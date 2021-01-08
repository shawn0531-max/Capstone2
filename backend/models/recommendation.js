const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Recommendation{
    static async sendRecommendations(username, cals, protein, fats, carbs){
        const result = await db.query(
            `INSERT INTO recommendations (username, cals, protein, fat, carbs)
            VALUES ($1, $2, $3, $4, $5)`, [username, cals, protein, fats, carbs]
        );

        return result.rows;
    };

    static async getRecommendations(username){
        const result = await db.query(
            `SELECT cals, protein, fat, carbs FROM recommendations
             WHERE username = $1`, [username]
        );

        return result.rows[0];
    };

    static async updateRecommendations(cals, protein, fats, carbs, username){
        const result =  await db.query(`UPDATE recommendations SET
         cals = $1, protein = $2, fat = $3, carbs = $4
         WHERE username = $5
         RETURNING username`, [cals, protein, fats, carbs, username]
        );
         return result.rows;
    }

};

module.exports = Recommendation;