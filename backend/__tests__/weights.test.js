process.env.NODE_ENV === "test";

const request = require("supertest");

const bcrypt = require('bcrypt');
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Weight = require("../models/weight");
const { AsyncLocalStorage } = require("async_hooks");

beforeAll(async function(){
    await db.query(`DELETE FROM users`);
    await User.register({"username": "shawn", "password": "shawn", "email":"shawn@test.com"});
    await User.register({"username": "shawn2", "password": "shawn2", "email":"shawn2@test.com"});
    await Weight.addWeight('shawn', 95.5);
    await Weight.addCals('shawn', 1875, 2000);
});

describe("Test weights routes", function(){

    test("GET weights between two dates throws error if incorrect username", async function(){
        let resp = await request(app).get('/weights/shawn999?startDate=01-01-2021&endDate=01-31-2021');

        expect(resp.body.message).toBe("There are no weights for the current username");
        expect(resp.statusCode).toBe(404);
    });

    test("GET weights between two dates throws error if there are no weights in the range", async function(){
        let resp = await request(app).get('/weights/shawn?startDate=01-01-1950&endDate=01-31-1950');

        expect(resp.body.message).toBe("No weights found between those dates");
        expect(resp.statusCode).toBe(404);
    });

    test("GET weights between two dates returns weights in date range", async function(){
        let resp = await request(app).get('/weights/shawn?startDate=01-01-2021&endDate=01-31-2021');

        expect(resp.body[0]).toEqual(
            {
                "user_weight": "95.5",
                "date_weighed": "2021-01-13T05:00:00.000Z"
            }
        );
        expect(resp.statusCode).toBe(200);
    });

    test("GET weight for today throws error if incorrect username", async function(){
        let resp = await request(app).get('/weights/shawn999/date');

        expect(resp.body).toBe("There are no weights for the current username");
        expect(resp.statusCode).toBe(404);
    });

    test("GET weight for today", async function(){
        let resp = await request(app).get('/weights/shawn/date');

        expect(resp.body).toEqual({
            "id": expect.any(Number)
        });
        expect(resp.statusCode).toBe(200);
    });

    test("POST weight schema throws error if no data", async function(){
        let resp = await request(app).post('/weights/shawn').send(
            {
                "noData":0
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "userWeight"');
        expect(resp.statusCode).toBe(400);
    });

    test("POST weight schema throws error if incorrect data", async function(){
        let resp = await request(app).post('/weights/shawn').send(
            {
                "userWeight": '90'
            }
        );

        expect(resp.body.message[0]).toBe('instance.userWeight is not of a type(s) number');
        expect(resp.statusCode).toBe(400);
    });

    test("POST weight for user throws error if weight has already been entered today", async function(){
        let resp = await request(app).post('/weights/shawn').send(
            {
                "userWeight": 90
            }
        );

        expect(resp.body.message).toBe("Weight has already been entered for today")
        expect(resp.statusCode).toBe(400);
    });

    test("POST weight for user", async function(){
        let resp = await request(app).post('/weights/shawn2').send(
            {
                "userWeight": 90
            }
        );

        expect(resp.body.message).toBe('Weight added');
        expect(resp.statusCode).toBe(201);

        let checkAdd = await request(app).get('/weights/shawn2/date');

        expect(checkAdd.body).toEqual(
            {
                "id": expect.any(Number)
            }
        );
        expect(checkAdd.statusCode).toBe(200);
    });

    test("GET calories for today throws error if incorrect username", async function(){
        let resp = await request(app).get('/weights/shawn999/cals');

        expect(resp.body).toBe("There are no calories for the current username");
        expect(resp.statusCode).toBe(404);
    });

    test("GET weight for today", async function(){
        let resp = await request(app).get('/weights/shawn/cals');

        expect(resp.body).toEqual({
            "id": expect.any(Number)
        });
        expect(resp.statusCode).toBe(200);
    });

    test("POST calories schema throws error with missing/incorrect data", async function(){
        let resp = await request(app).post('/weights/shawn2/cals').send(
            {
                "r_cals": '3000'
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "cals"');
        expect(resp.body.message[1]).toBe('instance.r_cals is not of a type(s) number');
        expect(resp.statusCode).toBe(400);
    });

    test("POST calories throws error if calories have been entered for the day", async function(){
        let resp = await request(app).post('/weights/shawn/cals').send(
            {
                "cals": 2875,
                "r_cals": 3000
            }
        );

        expect(resp.body.message).toBe("You have already entered calories for today");
        expect(resp.statusCode).toBe(400);
    });

    test("POST calories", async function(){
        let resp = await request(app).post('/weights/shawn2/cals').send(
            {
                "cals": 2875,
                "r_cals": 3000
            }
        );

        expect(resp.body.message).toBe("Calories added");
        expect(resp.statusCode).toBe(201);

        let addCheck = await request(app).get('/weights/shawn2/cals');

        expect(addCheck.body).toEqual(
            {
                "id": expect.any(Number)
            }
        );
    });
});

afterAll(async function() {
    await db.query(`DELETE FROM user_weights`);
    await db.query(`DELETE FROM user_cals`);
    await db.query(`DELETE FROM users`);
    await db.end();
});