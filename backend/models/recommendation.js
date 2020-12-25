const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Recommendation{
    static async sendRecommendations(username, cals, protein, fats, carbs){
        const result = await db.query(
            `INSERT INTO recommendations (username, cals, protein, fats, carbs)
            VALUES ($1, $2, $3, $4, $5)`, [username, cals, protein, fats, carbs]
        );
    };

    static async getRecommendations(username){
        const result = await db.query(
            `SELECT cals, protein, fats, carbs FROM recommendations
             WHERE username = $1`, [username]
        );
    };

    static async updateRecommendations(cals, protein, fats, carbs, username){
        `UPDATE recommendations SET
         cals = $1, protein = $2, fats = $3, carbs = $4
         WHERE username = $5`, [cals, protein, fats, carbs, username]
    }
};

module.exports = Recommendation;