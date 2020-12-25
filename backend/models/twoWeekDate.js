const db = require('../db');
const ExpressError = require('../helpers/expressError');

class TwoWeekDate {

    /** Get weights entered over two week period to decide if daily needs have to be changed **/

    static async getDates(startDate, endDate, username){

        const user = await db.query(
            `SELECT id from users WHERE username = $1`, [username]
        );

        let id = user.rows[0].id

        const entries = await db.query(
            `SELECT user_weight, date_weighed
            FROM user_weights WHERE user_id = $1 AND
            date_weighed BETWEEN '${startDate}'
            AND '${endDate}'
            ORDER BY date_weighed ASC`, [id]
        );
        
        if(entries.rows.length === 0) {
            throw new ExpressError('No dates found', 404);
        }

        return entries.rows;
    }
}

module.exports = TwoWeekDate;