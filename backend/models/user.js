const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {

/** Register user with data. Returns new user data. */

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
          (username, user_password, email, date_joined) 
          VALUES ($1, $2, $3, $4) 
          RETURNING username, email, date_joined`,
      [username, hashedPassword, email, date_joined]
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
      `SELECT username, user_password, email, date_joined, curr_experience, gender
          FROM users 
          WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.user_password))) {
      return user;
    } else {
      throw new ExpressError('Incorrect username/password combination.', 401);
    }
  }

  static async getUser(username){
    const result = await db.query(
      `SELECT id, username, date_joined, curr_weight, curr_height, curr_age,
                  curr_activity, curr_goal, curr_experience, gender, curr_BMR
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

    const userResult = await db.query(
      `SELECT id FROM users WHERE username = $1`, [username]
    );

    let id = userResult.rows[0].id
    
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
      `SELECT user_weight, date_weighed FROM user_weights WHERE user_id = $1 
                                            AND date_weighed BETWEEN '${year}-${month}-01'
                                            AND '${year}-${month}-${lastDay}'`, [id]
    );

    const cals = await db.query(
      `SELECT user_cal, date_cal FROM user_cals WHERE user_id = $1
                                      AND date_cal BETWEEN '${year}-${month}-01'
                                      AND '${year}-${month}-${lastDay}'`, [id]
    );
    
    return [weights.rows, cals.rows]
  }
}

module.exports = User;