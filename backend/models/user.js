const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const { BCRYPT_WORK_FACTOR } = require("../config");
const { start } = require('repl');
const { end } = require('../db');

class User {

/** Register user with data. Checks if username is taken. If it is notify the user
 * else returns new user data. */

  static async register({username, password, email}) {
    const duplicateCheck = await db.query(
      `SELECT username 
        FROM users 
        WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `The username '${username}' is already being used`,
        400
      );
    }

    let date_joined = Date();
    date_joined = date_joined.slice(4,15);
    
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users 
          (username, user_password, email, date_joined, biweek_check_date) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING username, email, date_joined, biweek_check_date`,
      [username, hashedPassword, email, date_joined, date_joined]
    );

    return result;
  }


  /** Is this username/password combo correct?
   *
   * Return all user data if true, throws error if invalid
   *
   * */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, user_password, email, date_joined, curr_experience, gender, biweek_check_date
          FROM users 
          WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.user_password))) {
      return user;
    } else {
      return new ExpressError('Incorrect username/password combination.', 401);
    }
  }

  static async getUser(username){
    const result = await db.query(
      `SELECT username, email, date_joined, curr_weight, curr_height, curr_age,
                  curr_activity, curr_goal, curr_experience, gender, curr_BMR, biweek_check_date
        FROM users
        WHERE username = $1 
        `, [username]
    );

    if (result.rows[0]) {
      return result.rows[0]
    } else {
      throw new ExpressError('Username does not exist', 400)
    }
  }

  static async updateBiweek(date, username){
    
    const check = await db.query(
      `UPDATE users SET biweek_check_date = $1 WHERE username = $2
       RETURNING biweek_check_date`, [date, username]
    );

    return check.rows[0];
  }

  static async updateWeight(username, weight){
    const result = await db.query(
      `UPDATE users SET curr_weight = $1 WHERE username = $2 RETURNING username`, [weight, username]
    );

    return result.rows[0]
  }

  static async updateBMR(curr_weight, curr_height, curr_age, curr_activity,
                         curr_goal, curr_experience, gender, username) {

    let BMR;

    const user_gender = await db.query(
      `SELECT gender
        FROM users
        WHERE username = $1 
        `, [username]
    );

    if (user_gender === "Male"){
      BMR = Math.round(66 + (13.7 * curr_weight) + (5 * curr_height) - (6.8 * curr_age));
    } else {
      BMR = Math.round(655 + (9.6 * curr_weight) + (1.8 * curr_height) - (4.7 * curr_age));
    }
  
    const result = await db.query(
      `UPDATE users
        SET curr_weight = $1, curr_height = $2, curr_age = $3, curr_activity = $4,
            curr_goal = $5, curr_experience = $6, gender = $7, curr_BMR = $8
        WHERE username = $9
        RETURNING curr_BMR`,
        [curr_weight, curr_height, curr_age, curr_activity, curr_goal, curr_experience, gender, BMR, username]
    );
      
    return result.rows[0];
  }

  static async getInfo(username, month, year){
    
    let longMonths = ['1', '3', '5', '7', '8', '10', '12']
    let lastDay;

    if(month === '2'){
      lastDay = 28;
    } else if (longMonths.includes(month)) {
      lastDay = 31;
    } else {
      lastDay = 30;
    }
    
    const weights = await db.query(
      `SELECT user_weight, date_weighed FROM user_weights WHERE username = $1 
                                            AND date_weighed BETWEEN '${year}-${month}-01'
                                            AND '${year}-${month}-${lastDay}'`, [username]
    );

    const cals = await db.query(
      `SELECT user_cal, date_cal FROM user_cals WHERE username = $1
                                      AND date_cal BETWEEN '${year}-${month}-01'
                                      AND '${year}-${month}-${lastDay}'`, [username]
    );
    
    return [weights.rows, cals.rows]
  }

  static async getWeightInfo(username, startDate, endDate){
    const weights = await db.query(
      `SELECT user_weight FROM user_weights WHERE username = $1
                                        AND date_weighed BETWEEN '${startDate}' AND '${endDate}'`,
                                        [username]
    );

    return weights.rows;
  }

  static async updateInfo(username, password, email){
    const userCheck = await db.query(
      `SELECT username 
        FROM users 
        WHERE username = $1`,
      [username]
    );

    if(!userCheck.rows[0]){
      throw new ExpressError("No such user in the database", 404);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `UPDATE users SET user_password = $1, email = $2
       WHERE username = $3 RETURNING email`,[hashedPassword, email, username]
    );

    if(!result.rows[0]){
      throw new ExpressError("Something went wrong. Please refresh and try again");
    }
    return result.rows[0];
  }

  static async addFavFood(username, food, cals, protein, carbs, fat){
    const favFood = await db.query(
      `INSERT INTO user_favs (username, food, cals, protein, carbs, fat)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,[username, food, cals, protein, carbs, fat]
    );

    return favFood.rows[0]
  }

  static async deleteFavFood(id, username){
    const result = await db.query(`DELETE FROM user_favs WHERE id = $1 AND username = $2`, [id, username]);
  }

  static async getFavs(username){
    const result = await db.query(`SELECT id, username, food, cals, protein, carbs, fat
                                   FROM user_favs WHERE username = $1`, [username]);

    // if no result throw error
    return result.rows;
  }
}

module.exports = User;