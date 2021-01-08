const { response } = require('express');
const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Weight {

    /** Get weights entered over two week period to decide if daily needs have to be changed **/

    static async getDates(startDate, endDate, username){

        const entries = await db.query(
            `SELECT user_weight, date_weighed
            FROM user_weights WHERE username = $1 AND
            date_weighed BETWEEN '${startDate}'
            AND '${endDate}'
            ORDER BY date_weighed ASC`, [username]
        );
        
        if(entries.rows.length === 0) {
            throw new ExpressError('No dates found', 404);
        }

        return entries.rows;
    }

    static async getByDate(username){
        let date = Date();
        date = date.slice(4,15);

        const result = await db.query(
            `SELECT id from user_weights WHERE date_weighed = $1 AND username = $2`,[date, username]
        );

        return result.rows[0]
    }

    static async addWeight(username, weight){
        let date = Date();
        date = date.slice(4,15);

        const result = await db.query(
            `INSERT INTO user_weights (username, user_weight, date_weighed)
             VALUES ($1, $2, $3) RETURNING id`,[username, weight, date]
        );

        return result.rows[0]
    }

    static async addCals(username, cals, r_cals){
        let date = Date();
        date = date.slice(4,15);
        
        const result = await db.query(
            `INSERT INTO user_cals (username, user_cal, recommended_cals, date_cal)
             VALUES ($1, $2, $3, $4) RETURNING id`,[username, cals, r_cals, date]
        );

        return result.rows[0]
    }

    static async getCalsByDate(username){
        let date = Date();
        date = date.slice(4,15);

        const result = await db.query(
            `SELECT id from user_cals WHERE date_cal = $1 AND username = $2`,[date, username]
        );

        return result.rows[0]
    }
}

module.exports = Weight;