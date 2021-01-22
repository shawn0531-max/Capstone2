process.env.NODE_ENV === "test";

const request = require("supertest");

const bcrypt = require('bcrypt');
const app = require("../app");
const db = require("../db");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Recommend = require("../models/recommendation");
const Weight = require('../models/weight');

beforeAll(async function(){
    await db.query(`DELETE FROM users`);
    await User.register({"username": "shawn", "password": "shawn", "email":"shawn@test.com"});
});

beforeEach(async function(){
    await db.query(`DELETE FROM user_weights`);
    await db.query(`DELETE FROM user_cals`);
    await db.query(`DELETE FROM user_favs`);
});

describe("Test users routes", function(){

    test("POST user signup schema throws error with missing/incorrect data", async function(){
        let resp = await request(app).post('/user/signup').send(
            {
                'username': 8,
                'email': 'shawn2@test.com'
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "password"');
        expect(resp.body.message[1]).toBe('instance.username is not of a type(s) string');
        expect(resp.statusCode).toBe(400);
    });

    test("POST user signup throws error if duplicate username", async function(){
        let resp = await request(app).post('/user/signup').send(
            {
                'username': 'shawn',
                'password': 'shawn',
                'email': 'shawn@test.com'
            }
        );

        expect(resp.body.message).toBe("The username 'shawn' is already being used");
        expect(resp.statusCode).toBe(400);
    });

    test("POST user signup", async function(){
        let resp = await request(app).post('/user/signup').send(
            {
                'username': 'shawn2',
                'password': 'shawn2',
                'email': 'shawn2@test.com' 
            }
        );

        expect(resp.body).toEqual(
            {
                "token": expect.any(String)
            }
        );
        expect(resp.statusCode).toBe(201);

        let info = jwt.decode(resp.body.token);
        expect(info.username).toBe('shawn2');
    });
    
    test("POST user login schema with missing/incorrect info", async function(){
        let resp = await request(app).post('/user/login').send(
            {
                'password': 9
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "username"');
        expect(resp.body.message[1]).toBe('instance.password is not of a type(s) string');
        expect(resp.statusCode).toBe(400);
    });

    test("POST user login throws error with incorrect username/password combination", async function(){
        let resp = await request(app).post('/user/login').send(
            {
                'username': 'shawn',
                'password': 'notpassword'
            }
        );

        let resp2 = await request(app).post('/user/login').send(
            {
                'username': 'notusername',
                'password': 'password'
            }
        );

        expect(resp.body.message).toBe('Incorrect username/password combination.');
        expect(resp2.body.message).toBe('Incorrect username/password combination.');
        expect(resp.statusCode).toBe(401);
        expect(resp2.statusCode).toBe(401);
    });

    test("POST user login", async function(){
        let resp = await request(app).post('/user/login').send(
            {
                'username': 'shawn',
                'password': 'shawn'
            }
        );

        expect(resp.body).toEqual(
            {
                "token": expect.any(String)
            }
        );
        expect(resp.statusCode).toBe(200);

        let info = jwt.decode(resp.body.token);

        expect(info.username).toBe('shawn');
    });

    test("GET user username throws error if username not found", async function(){
        let resp = await request(app).get('/user/shawn999');

        expect(resp.body.message).toBe("Username does not exist");
        expect(resp.statusCode).toBe(404);
    });

    test("GET user username", async function(){
        let resp = await request(app).get('/user/shawn');

        expect(resp.body.username).toBe('shawn');
        expect(resp.body.email).toBe('shawn@test.com');
        expect(resp.statusCode).toBe(200);
    });

    test("PATCH username (update password/email) schema throws errors with incorrect/missing data", async function(){
        let resp = await request(app).patch('/user/shawn').send(
            {
                "newPass": 8,
                'newEmail': "shawn@test.com"
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "oldPass"');
        expect(resp.body.message[1]).toBe('instance.newPass is not of a type(s) string');
        expect(resp.statusCode).toBe(400);
    });

    test("PATCH username (update password/email) throws error with incorrect old password", async function(){
        let resp = await request(app).patch('/user/shawn').send(
            {
                "oldPass": 'notpassword',
                "newPass": 'shawn!',
                "newEmail": 'shawns@test.com'
            }
        );

        expect(resp.body.message).toBe('Incorrect username/password combination.');
        expect(resp.statusCode).toBe(401);
    });

    test("PATCH username (update password/email)", async function(){
        let resp = await request(app).patch('/user/shawn').send(
            {
                "oldPass": 'shawn',
                "newPass": 'shawn',
                "newEmail": 'shawns@test.com'
            }
        );

        expect(resp.body.email).toBe('shawns@test.com');
        expect(resp.statusCode).toBe(200);
    });

    test("PATCH username BMR schema throws errors with incorrect/missing data", async function(){
        let resp = await request(app).patch('/user/shawn/BMR').send(
            {
                "curr_height": "10",
                "curr_age": 22,
                "curr_activity": 1,
                "curr_goal": "Gain Weight",
                "curr_experience": "Beginner",
                "gender": "Male"
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "curr_weight"');
        expect(resp.body.message[1]).toBe('instance.curr_height is not of a type(s) number');
        expect(resp.body.message[2]).toBe('instance.curr_activity is not of a type(s) string');
        expect(resp.statusCode).toBe(400);
    });

    test("PATCH username BMR", async function(){
        let resp = await request(app).patch('/user/shawn/BMR').send(
            {
                "curr_weight": 90,
                "curr_height": 175,
                "curr_age": 22,
                "curr_activity": "Very Active",
                "curr_goal": "Gain Weight",
                "curr_experience": "Beginner",
                "gender": "Male"
            }
        );

        expect(resp.body).toEqual(
            {
                "curr_bmr": expect.any(Number)
            }
        )
        expect(resp.statusCode).toBe(201);
    });

    test("PATCH username update weighdate error with invalid username", async function(){
        let resp = await request(app).patch('/user/shawn999/update/weighdate').send(
            {
                "checkDate": "1-1-2022"
            }
        );

        expect(resp.body.message).toBe("shawn999 is not in the database");
        expect(resp.statusCode).toBe(404);
    });

    test("PATCH username update weighdate", async function(){
        let resp = await request(app).patch('/user/shawn/update/weighdate').send(
            {
                "checkDate": "10-1-2021"
            }
        );

        expect(resp.body).toEqual(
            {
                "biweek_check_date": expect.any(String)
            }
        )
        expect(resp.statusCode).toBe(200);
    });

    test("PATCH username update biweekweight schema throws errors with invalid/missing data", async function(){
        let resp = await request(app).patch('/user/shawn/update/biweekweight').send(
            {
                "badParam": 75
            }
        );

        let resp2 = await request(app).patch('/user/shawn/update/biweekweight').send(
            {
                "weight": "85.7"
            }
        );


        expect(resp.body.message[0]).toBe('instance requires property "weight"')
        expect(resp2.body.message[0]).toBe('instance.weight is not of a type(s) number');
        expect(resp.statusCode).toBe(400);
        expect(resp2.statusCode).toBe(400);
    });
    
    test("PATCH username update biweekweight invalid username", async function(){
        let resp = await request(app).patch('/user/shawn999/update/biweekweight').send(
            {
                "weight": 85.7
            }
        );

        expect(resp.body.message).toBe("shawn999 is not in the database");
        expect(resp.statusCode).toBe(404);
    });

    test("PATCH username update biweekweight", async function(){
        let resp = await request(app).patch('/user/shawn/update/biweekweight').send(
            {
                "weight": 85.7
            }
        );

        expect(resp.body.message).toBe("User weight updated")
        expect(resp.statusCode).toBe(200);

        let checkWeight = await request(app).get('/user/shawn')

        expect(checkWeight.body.username).toBe('shawn');
        expect(checkWeight.body.curr_weight).toBe("85.7");
    });

    test("GET username profile (weight and calorie arrays to graph) throws error if no weights for username", async function(){
        let resp = await request(app).get('/user/shawn/profile?month=1&year=2021');

        expect(resp.body.message).toBe("shawn has no weights entered yet");
        expect(resp.statusCode).toBe(404);
    });

    test("GET username profile (weight and calorie arrays to graph) throws error if no weights in queried month/year for username", async function(){
        await Weight.addWeight('shawn', 95);
        let resp = await request(app).get('/user/shawn/profile?month=1&year=1950');

        expect(resp.body.message).toBe("There are no weights in that month and year for shawn");
        expect(resp.statusCode).toBe(404);
    });
    
    test("GET username profile (weight and calorie arrays to graph) throws error if no cals for username", async function(){
        await Weight.addWeight('shawn', 95);
        let resp = await request(app).get('/user/shawn/profile?month=1&year=2021');

        expect(resp.body.message).toBe("shawn has no daily calories entered yet");
        expect(resp.statusCode).toBe(404);
    });

    test("GET username profile (weight and calorie arrays to graph)", async function(){
        await Weight.addWeight('shawn', 95);
        await Weight.addCals('shawn', 2800, 2900);

        let date = new Date();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let resp = await request(app).get(`/user/shawn/profile?month=${month}&year=${year}`);

        expect(resp.body[0][0]).toEqual(
            {
                'user_weight': '95',
                'date_weighed': expect.any(String)
            }
        );
        expect(resp.body[1][0]).toEqual(
            {
                'user_cal': '2800',
                'date_cal': expect.any(String)
            }
        );
        expect(resp.statusCode).toBe(200);
    });

    test("GET username profile weights (weights between a date range) throws error if no weights for user", async function(){
        let resp = await request(app).get('/user/shawn/profile/weights?startDate=01/01/2021&endDate=01/31/2021');

        expect(resp.body.message).toBe("shawn has no weights entered yet");
        expect(resp.statusCode).toBe(404);
    });

    test("GET username profile weights (weights between a date range) throws error if no weights in range for user", async function(){
        await Weight.addWeight('shawn', 95);
        let resp = await request(app).get('/user/shawn/profile/weights?startDate=01/01/1950&endDate=01/31/1950');

        expect(resp.body.message).toBe("There are no weights in that date range for shawn");
        expect(resp.statusCode).toBe(404);
    });

    test("GET username profile weights (weights between a date range)", async function(){
        await Weight.addWeight('shawn', 95);
        let resp = await request(app).get('/user/shawn/profile/weights?startDate=01/01/2021&endDate=01/31/2021');

        expect(resp.body[0]).toEqual(
            {
                'user_weight': '95'
            }
        )
        expect(resp.statusCode).toBe(200);
    });

    test("POST username favorites schema throws error with invalid/missing data", async function(){
        let resp = await request(app).post('/user/shawn/favorites').send(
            {
                'food': 7.5,
                'protein': '5',
                'carbs': 20,
                'fat': 2.3
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "cals"');
        expect(resp.body.message[1]).toBe('instance.food is not of a type(s) string');
        expect(resp.body.message[2]).toBe('instance.protein is not of a type(s) number');
        expect(resp.statusCode).toBe(400);
    });

    test("POST username favorites", async function(){
        let resp = await request(app).post('/user/shawn/favorites').send(
            {
                'food': 'potato',
                'cals': 70,
                'protein': 3,
                'carbs': 20,
                'fat': 0.3
            }
        );

        expect(resp.body.message).toBe("potato added to favorites")
        expect(resp.statusCode).toBe(200);
    });

    test("GET username favorites throws error with no favorites found", async function(){
        let resp = await request(app).get('/user/shawn/favorites');

        expect(resp.body.message).toBe("shawn has no favorites yet");
        expect(resp.statusCode).toBe(404);
    });

    test("GET username favorites", async function(){
        await User.addFavFood('shawn', 'steak', 150, 25.5, 0.5, 6.5);
        let resp = await request(app).get('/user/shawn/favorites');

        expect(resp.body[0]).toEqual(
            {
                'id': expect.any(Number),
                'username': 'shawn',
                'food': 'steak',
                'cals': '150',
                'protein': '25.5',
                'carbs': '0.5',
                'fat': '6.5'
            }
        );
        expect(resp.statusCode).toBe(200);
    });

    test("DELETE username favorites throws error with invalid id", async function(){
        let resp = await request(app).delete('/user/shawn/favorites/9999');

        expect(resp.body.message).toBe('shawn does not have that food as a favorite');
        expect(resp.statusCode).toBe(400);
    });

    test("DELETE username favorites", async function(){
        await User.addFavFood('shawn', 'steak', 150, 25.5, 0.5, 6.5);

        let food = await request(app).get('/user/shawn/favorites');
        let id = food.body[0].id;

        let resp = await request(app).delete(`/user/shawn/favorites/${id}`);

        expect(resp.body.message).toBe("Favorite has been removed");
        expect(resp.statusCode).toBe(200);
    });
});

afterAll(async function() {
    await db.query(`DELETE FROM users`);
    await db.query(`DELETE FROM user_weights`);
    await db.query(`DELETE FROM user_cals`);
    await db.query(`DELETE FROM user_favs`);
    await db.end();
});