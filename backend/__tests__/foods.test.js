process.env.NODE_ENV === "test";

const request = require("supertest");

const bcrypt = require('bcrypt');
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Food = require("../models/food");

beforeAll(async function(){
    await db.query(`DELETE FROM users`);
    await User.register({"username": "shawn", "password": "shawn", "email":"shawn@test.com"});
});

beforeEach(async function(){
    await db.query(`DELETE FROM foods`);
    await Food.postFoods("shawn", "steak", 100, 26.5, 1.5, 6.5, 100);
});

describe("Test foods routes", function(){
    
    test("GET food entered on specified date", async function(){
        let date = Date();
        date = date.slice(4, 15);

        const response = await request(app).get(`/foods/shawn?date=${date}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toEqual({
            "id": expect.any(Number),
            "food": "steak",
            "cals": "100",
            "protein": "26.5",
            "carbs": "1.5",
            "fat": "6.5",
            "amount": "100"
        });
    });

    test("GET returns 404 error if there is no food for requested date", async function(){

        const resp = await request(app).get(`/foods/shawn?date=01-01-1950`);

        expect(resp.statusCode).toBe(404);
        expect(resp.body.message).toBe("There are no foods listed for this date. Please make sure the date is correct.")

    });
    
    test("GET single food by id", async function(){
        let date = Date();
        date = date.slice(4, 15);
        
        const getAllFood = await request(app).get(`/foods/shawn?date=${date}`);
        
        let id = getAllFood.body[0].id;
        
        const resp = await request(app).get(`/foods/shawn/food/${id}`);
        
        expect(resp.body.length).toEqual(1);
        expect(resp.body[0]).toEqual(
            {
                "food": "steak",
                "cals": "100",
                "protein": "26.5",
                "carbs": "1.5",
                "fat": "6.5",
                "amount": "100"
            });
        });

    test("GET food by id throw 404 error if not found", async function(){
        const resp = await request(app).get('/foods/shawn/food/88888');

        expect(resp.body.message).toBe("This food is not listed in the database.");
        expect(resp.statusCode).toBe(404);
    });

    test("PATCH food throws error if food not found", async function(){
        const resp = await request(app).patch('/foods/shawn/food/88888').send(
            {
                "cals": 100,
                "protein": 26.5,
                "carbs": 1.5,
                "fat": 6.5,
                "amount": 100
            });

            expect(resp.body.message).toBe("Food not in database.")
            expect(resp.statusCode).toBe(404);
    });

    test("PATCH food schema throws error with incorrect data", async function(){
        const resp = await request(app).patch('/foods/shawn/food/88888').send(
            {
                "protein": "26.5",
                "carbs": 1.5,
                "fat": 6.5,
                "amount": 100
            });

            expect(resp.body.message[0]).toBe('instance requires property "cals"');
            expect(resp.body.message[1]).toBe('instance.protein is not of a type(s) number');
    });

    test("PATCH edit food", async function(){
        let date = Date();
        date = date.slice(4, 15);

        const getAllFood = await request(app).get(`/foods/shawn?date=${date}`);

        let id = getAllFood.body[0].id;

        const resp = await request(app).patch(`/foods/shawn/food/${id}`).send(
            {
                "cals": 100,
                "protein": 35,
                "carbs": 1.5,
                "fat": 6.5,
                "amount": 100
            });

        expect(resp.body.message).toBe("steak information has been updated.");

        const updateCheck = await request(app).get(`/foods/shawn?date=${date}`);

        expect(updateCheck.body[0].protein).toBe("35");
    });
        
    test("POST schema for adding food throws error with incorrect data", async function(){

        const resp = await (await request(app).post('/foods/shawn').send(
            {
            "id": 9999,
            "food": "noodles",
            "cals": "120",
            "carbs": 33,
            "fat": 2.0,
            "amount": 100
            }
        ));

        expect(resp.body.message[0]).toContain('instance requires property "protein"');
        expect(resp.body.message[1]).toContain('instance.cals is not of a type(s) number');
    });

    test("POST add food", async function(){

        const resp = await (await request(app).post('/foods/shawn').send(
            {
            "id": 9999,
            "food": "noodles",
            "cals": 120,
            "protein": 6.5,
            "carbs": 33,
            "fat": 2.0,
            "amount": 100
            }
        ));

        expect(resp.body[0]).toEqual({
            "id": expect.any(Number),
            "food": "noodles",
            "cals": "120",
            "protein": "6.5",
            "carbs": "33",
            "fat": "2",
            "amount": "100"
        });

        expect(resp.statusCode).toBe(201);
    
        let date = Date();
        date = date.slice(4, 15);
    
        const lengthCheck = await request(app).get(`/foods/shawn?date=${date}`);
    
        expect(lengthCheck.body.length).toBe(2);
    });
});

test("DELETE food by id if food not found", async function(){
    const resp = await request(app).delete('/foods/shawn/food/88888');

    expect(resp.body.message).toBe("Food not in database");
    expect(resp.statusCode).toBe(404);
});

test("DELETE food by id", async function(){
    let date = Date();
    date = date.slice(4, 15);
    
    const getId = await request(app).get(`/foods/shawn?date=${date}`);
    
    let id = getId.body[0].id;

    const resp = await request(app).delete(`/foods/shawn/food/${id}`);

    expect(resp.body.message).toBe("Food has been deleted");

    const checkDelete = await request(app).get(`/foods/shawn?date=${date}`);

    expect(checkDelete.body.message).toBe("There are no foods listed for this date. Please make sure the date is correct.")
});

afterAll(async function() {
    await db.query(`DELETE FROM foods`);
    await db.query(`DELETE FROM users`);
    await db.end();
});