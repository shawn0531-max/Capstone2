process.env.NODE_ENV === "test";

const request = require("supertest");

const bcrypt = require('bcrypt');
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Recommend = require("../models/recommendation");

beforeAll(async function(){
    await db.query(`DELETE FROM users`);
    await User.register({"username": "shawn", "password": "shawn", "email":"shawn@test.com"});
    await User.register({"username": "shawn2", "password": "shawn2", "email":"shawn2@test.com"});
});

beforeEach(async function(){
    await db.query(`DELETE FROM recommendations`);
    await Recommend.sendRecommendations("shawn", 3000, 220, 60, 425);
});

describe("Test recommendations routes", function(){

    test("GET recommend by username throws error if no username match", async function(){
        let resp = await request(app).get('/recommendations/shawn999');

        expect(resp.body.message).toBe("There is no user with that username in the database");
        expect(resp.statusCode).toBe(404);
    });

    test("GET recommend by username", async function(){
        let resp = await request(app).get('/recommendations/shawn');

        expect(resp.body).toEqual(
            {
                "cals": "3000",
                "protein": "220",
                "fat": "60",
                "carbs": "425"
            }
        )
    });

    test("POST recommendations schema throws errors with incorrect data", async function(){
        let resp = await request(app).post('/recommendations/shawn2').send(
            {
                "cals": "2700",
                "protein": 190,
                "carbs": 375 
            }
        );

        expect(resp.body.message[0]).toBe('instance requires property "fats"');
        expect(resp.body.message[1]).toBe('instance.cals is not of a type(s) number');
    });

    test("POST recommendations", async function(){
        let resp = await request(app).post('/recommendations/shawn2').send(
            {
                "cals": 2700,
                "protein": 190,
                "fats": 50,
                "carbs": 375 
            }
        );

        expect(resp.body.message).toBe("Recommendations added");
        expect(resp.statusCode).toBe(201);
    });

    test("PATCH recommendations throws errors with invalid username", async function(){
        let resp = await request(app).patch('/recommendations/shawn999').send(
            {
                "cals": 2700,
                "protein": 190,
                "fats": 50,
                "carbs": 375 
            }
        );

        expect(resp.body.message).toBe("There is no user with that username in the database");
        expect(resp.statusCode).toBe(404);
    });

    test("PATCH recommendations", async function(){
        let resp = await request(app).patch('/recommendations/shawn').send(
            {
                "cals": 2900,
                "protein": 190,
                "fats": 50,
                "carbs": 375 
            }
        );

        expect(resp.body.message).toBe("shawn's recommendations have been updated.");
        expect(resp.statusCode).toBe(200);
    });
});

afterAll(async function() {
    await db.query(`DELETE FROM recommendations`);
    await db.query(`DELETE FROM users`);
    await db.end();
});