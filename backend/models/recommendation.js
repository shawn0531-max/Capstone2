const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Recommendation{

    /** Add daily caloric and macronutrient goal to recommendations table **/

    static async sendRecommendations(username, cals, protein, fats, carbs){
        
        const result = await db.query(
            `INSERT INTO recommendations (username, cals, protein, fat, carbs)
            VALUES ($1, $2, $3, $4, $5) RETURNING username`, [username, cals, protein, fats, carbs]
        );

        return result.rows[0];
    };

    /** Get user current recommendations **/

    static async getRecommendations(username){
        const result = await db.query(
            `SELECT cals, protein, fat, carbs FROM recommendations
             WHERE username = $1`, [username]
        );

        if(result.rows.length === 0){
            return new ExpressError("There is no user with that username in the database", 404);
        }

        return result.rows[0];
    };

    /** Update daily caloric and macronutrient recommendations **/

    static async updateRecommendations(cals, protein, fats, carbs, username){

        const usercheck = await db.query(
            `SELECT username FROM users WHERE username = $1`, [username]
        );

        if(usercheck.rows.length === 0){
            return new ExpressError("There is no user with that username in the database", 404);
        }
        const result =  await db.query(
        `UPDATE recommendations SET
         cals = $1, protein = $2, fat = $3, carbs = $4
         WHERE username = $5 RETURNING username`, [cals, protein, fats, carbs, username]
        );

        return result.rows[0];
    }

};

module.exports = Recommendation;