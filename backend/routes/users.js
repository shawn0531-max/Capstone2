/** API routes for posts. */

const db = require("../db");
const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const createUserToken = require('../helpers/createToken');
const {requireLogin} = require('../middleware/auth')

/** User login **/

router.post('/login', async function (req, res, next){
    try {
        const {username, password} = req.body;
        
        let user = await User.authenticate(username, password);
        let token = createUserToken(user.username);
        return res.status(200).json({token});
    } catch (err) {
        return next(err);
    }
});


/** User sign up **/

router.post('/signup', async function (req, res, next){
    try {
        const {username, password, email, experience, gender} = req.body;

        let user = await User.register({username, password, email, experience, gender})
        let token = createUserToken(user.rows[0].username);
        return res.status(201).json({token});
    } catch (err) {
        return next(err);
    }
});

/** Get user info **/

router.get('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        let user = await User.getUser(username);
        return res.json(user);
    } catch (err){
        return next(err);
    }
});

/** Send info for BMR to Database */

router.patch('/:username/BMR', async function(req, res, next){
    try{
        const {username} = req.params;
        const {curr_weight, curr_height, curr_age, curr_activity, curr_goal, curr_experience, gender} = req.body;
        let BMR = await User.updateBMR(curr_weight, curr_height, curr_age, curr_activity, 
                                       curr_goal, curr_experience, gender, username);
        return res.status(201).json(BMR);
    } catch (err) {
        return next(err)
    }
});

router.get('/:username/profile', async function(req, res, next){

    const {username} = req.params;
    const {month, year} = req.query;

    try{
        let chartInfo = await User.getInfo(username, month, year);
        return res.json(chartInfo);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;