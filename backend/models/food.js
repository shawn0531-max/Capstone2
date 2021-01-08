const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Food{
    static async postFoods(username, food, cals, protein, carbs, fat, amount){
        let date = Date();
        date = date.slice(4, 15);
        let result = await db.query(
            `INSERT INTO foods (username, food, cals, protein, carbs, fat, date_added, amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, food, cals, protein, carbs, fat, amount
             `, [username, food, cals, protein, carbs, fat, date, amount]
        );
        return result.rows;
    }

    static async getFoods(username, dateAdded){
        const result = await db.query(
            `SELECT id, food, cals, protein, carbs, fat, amount FROM foods
             WHERE username = $1 AND date_added = $2`, [username, dateAdded]
        );

        return result.rows;
    }

    static async getFood(foodId){
        const result = await db.query(
            `SELECT food, cals, protein, carbs, fat, amount FROM foods
             WHERE id = $1`, [foodId]
        );

        return result.rows;
    }

    static async editFood(newCals, newProtein, newCarbs, newFat, newAmount, foodId){
        const result = await db.query(
            `UPDATE foods SET
             cals = $1, protein = $2, carbs = $3, fat = $4, amount = $5
             WHERE id = $6`,
             [newCals, newProtein, newCarbs, newFat, newAmount, foodId]
        );
    }

    static async removeFood(foodId){
        const result = await db.query(
        `DELETE FROM foods WHERE id = $1 RETURNING username`,[foodId]
        );

        if(result.rows.length === 0){
            throw new ExpressError('Food not in database', 404);
        } else {
            return result.rows;
        }
    }

}

module.exports = Food;