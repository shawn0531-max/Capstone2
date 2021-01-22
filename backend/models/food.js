const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Food{

    /** Add food information for specific user **/

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

    /** Get food information for specific user on a given date **/

    static async getFoods(username, dateAdded){
        const result = await db.query(
            `SELECT id, food, cals, protein, carbs, fat, amount FROM foods
             WHERE username = $1 AND date_added = $2`, [username, dateAdded]
        );

        if(result.rows.length === 0){
            return new ExpressError('There are no foods listed for this date. Please make sure the date is correct.', 404);
        }

        return result.rows;
    }

    /** Get food information for specific user regardless of date **/

    static async getFood(foodId){
        const result = await db.query(
            `SELECT food, cals, protein, carbs, fat, amount FROM foods
             WHERE id = $1`, [foodId]
        );

        if(result.rows.length === 0){
            return new ExpressError("This food is not listed in the database.", 404);
        }

        return result.rows;
    }

    /** Update previosly entered food information for specific user **/

    static async editFood(newCals, newProtein, newCarbs, newFat, newAmount, foodId){
        
        const foodCheck = await db.query(
            `SELECT id from foods WHERE id = $1`, [foodId]
        );

        if(foodCheck.rows.length === 0){
            return new ExpressError('Food not in database.', 404);
        }
        
        const result = await db.query(
            `UPDATE foods SET
             cals = $1, protein = $2, carbs = $3, fat = $4, amount = $5
             WHERE id = $6 RETURNING food`,
             [newCals, newProtein, newCarbs, newFat, newAmount, foodId]
        );

        return result.rows[0]
    }

    /** Remove food information for specific user **/

    static async removeFood(foodId){
        const result = await db.query(
        `DELETE FROM foods WHERE id = $1 RETURNING username`,[foodId]
        );

        if(result.rows.length === 0){
            return new ExpressError('Food not in database', 404);
        } else {
            return result.rows[0];
        }
    }

}

module.exports = Food;