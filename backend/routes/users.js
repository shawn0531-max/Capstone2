/** API routes for posts. */

const db = require("../db");
const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const createUserToken = require('../helpers/createToken');
const {requireLogin} = require('../middleware/auth');
const { end } = require("../db");

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

/** Update password and/or email **/

router.patch('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        const {oldPass, newPass, newEmail} = req.body;


        let resp = await User.authenticate(username, oldPass);
        if(!resp.username){
            return res.json(resp)
        }
        let emailResult = await User.updateInfo(username, newPass, newEmail);

        return res.json(emailResult);
    } catch (err) {
        return next(err);
    }
})

/** Send info for BMR to Database **/

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

/** Update biweekly check date (the day that weight change was last checked) **/

router.patch('/:username/update/weighdate', async function(req, res, next){
    try {
        const {username} = req.params;
        const {checkDate} = req.body;

        let updatedDate = await User.updateBiweek(checkDate, username);

        return res.json(updatedDate);
    } catch (err) {
        return next(err);
    }
});

/** Update current user weight after biweekly check **/

router.patch('/:username/update/biweekweight', async function(req, res, next){
    try {
        const {username} = req.params;
        const {weight} = req.body;

        let resp = await User.updateWeight(username, weight);

        return res.json(resp);
    } catch (err) {
        return next(err);
    }
});

/** Get all weights and cals for user in the month and year requested **/

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

router.get('/:username/profile/weights', async function(req, res, next){
    const {username} = req.params;
    const {startDate, endDate} = req.query;

    try {
        let weightInfo = await User.getWeightInfo(username, startDate, endDate);
        return res.json(weightInfo);
    } catch (err) {
        return next(err);
    }
});

/** Get all of a user's favorite foods **/

router.get('/:username/favorites', async function(req, res, next){
    const {username} = req.params;

    try {
        let favs = await User.getFavs(username);

        return res.json(favs);
    } catch (err) {
        return next(err);
    }
});

/** Add a favorite for specified user **/

router.post('/:username/favorites', async function(req, res, next){
    const {username} = req.params;
    const {food, cals, protein, carbs, fat} = req.body;

    try {
        let resp = await User.addFavFood(username, food, cals, protein, carbs, fat);

        return res.json(resp)
    } catch (err) {
        return next(err);
    }
});

/** Remove a favorite for specified user **/

router.delete('/:username/favorites/:id', async function(req, res, next){
    const {username, id} = req.params;

    try {
        let resp = await User.deleteFavFood(username, id);

        return res.json(resp);
    } catch (err) {
        return next(err);
    }
})

module.exports = router;