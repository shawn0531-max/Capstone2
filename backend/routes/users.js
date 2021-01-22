/** API routes for users */

const db = require("../db");
const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const createUserToken = require('../helpers/createToken');
const ExpressError = require('../helpers/expressError');
const jsonschema = require('jsonschema');
const loginSchema = require('../schema/user/loginSchema.json');
const signupSchema = require('../schema/user/signupSchema.json');
const updatePasswordSchema = require('../schema/user/updatePasswordSchema.json');
const updateBMRSchema = require('../schema/user/updateBMRSchema.json');
const updateWeightSchema = require('../schema/user/updateWeightSchema.json');
const addFavoriteSchema = require('../schema/user/addFavoriteSchema.json');
const {requireLogin} = require('../middleware/auth');

/** User sign up **/

router.post('/signup', async function (req, res, next){
    try {

        const result = jsonschema.validate(req.body, signupSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {username, password, email} = req.body;

        let user = await User.register({username, password, email})
        
        if(user.message){
            return res.status(user.status).json({'message':user.message});
        }

        let token = createUserToken(user.rows[0].username);

        return res.status(201).json({token});
    } catch (err) {
        return next(err);
    }
});

/** User login **/

router.post('/login', async function (req, res, next){
    try {
        const result = jsonschema.validate(req.body, loginSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {username, password} = req.body;
        
        let user = await User.authenticate(username, password);

        if(user.message){
            return res.status(user.status).json({'message':user.message})
        }

        let token = createUserToken(user.username);
        return res.status(200).json({token});
    } catch (err) {
        return next(err);
    }
});

/** Get user info **/

router.get('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        let user = await User.getUser(username);

        if(user.message){
            return res.status(user.status).json(user.message);
        }
        return res.json(user);
    } catch (err){
        return next(err);
    }
});

/** Update password and/or email **/

router.patch('/:username', async function(req, res, next){
    try {
        const {username} = req.params;

        const result = jsonschema.validate(req.body, updatePasswordSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {oldPass, newPass, newEmail} = req.body;
        
        let resp = await User.authenticate(username, oldPass);
        if(resp.message){
            return res.status(resp.status).json({'message': resp.message})
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
        console.log(req.body)
        const result = jsonschema.validate(req.body, updateBMRSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {curr_weight, curr_height, curr_age, curr_activity, curr_goal, curr_experience, gender} = req.body;
        let BMR = await User.updateBMR(curr_weight, curr_height, curr_age, curr_activity, 
                                       curr_goal, curr_experience, gender, username);

                                        
        if(BMR.message){
            return res.status(BMR.status).json(BMR.message);
        }        

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

        if(updatedDate.message){
            return res.status(updatedDate.status).json({'message': updatedDate.message});
        }

        return res.json(updatedDate);
    } catch (err) {
        return next(err);
    }
});

/** Update current user weight after biweekly check **/

router.patch('/:username/update/biweekweight', async function(req, res, next){
    try {
        const {username} = req.params;

        const result = jsonschema.validate(req.body, updateWeightSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {weight} = req.body;

        let resp = await User.updateWeight(username, weight);

        if(resp.username){
            return res.json({'message': 'User weight updated'});
        } else if(resp.message){
            return res.status(resp.status).json({'message': resp.message});
        }

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

        if(chartInfo.message){
            return res.status(chartInfo.status).json({'message': chartInfo.message})
        }
        return res.json(chartInfo);
    } catch (err) {
        return next(err);
    }
});

/** Get all weights for user in specified date range **/

router.get('/:username/profile/weights', async function(req, res, next){
    const {username} = req.params;
    const {startDate, endDate} = req.query;

    try {
        let weightInfo = await User.getWeightInfo(username, startDate, endDate);

        if(weightInfo.message){
            return res.status(weightInfo.status).json({'message': weightInfo.message});
        }

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

        if(favs.message){
            return res.status(favs.status).json({'message': favs.message});
        }

        return res.json(favs);
    } catch (err) {
        return next(err);
    }
});

/** Add a favorite for specified user **/

router.post('/:username/favorites', async function(req, res, next){
    const {username} = req.params;

    const result = jsonschema.validate(req.body, addFavoriteSchema);

    if(!result.valid){
        let errList = result.errors.map(error => error.stack);
        let err = new ExpressError(errList, 400);
        return next(err);
    }

    const {food, cals, protein, carbs, fat} = req.body;

    try {
        let resp = await User.addFavFood(username, food, cals, protein, carbs, fat);

        if(resp.id){
            return res.json({'message': `${food} added to favorites`})
        }
        return res.json(resp)
    } catch (err) {
        return next(err);
    }
});

/** Remove a favorite for specified user **/

router.delete('/:username/favorites/:id', async function(req, res, next){
    const {username, id} = req.params;

    try {
        let resp = await User.deleteFavFood(id, username);

        if(resp.message){
            return res.status(resp.status).json({'message': resp.message});
        }

        return res.json({'message': "Favorite has been removed"});
    } catch (err) {
        return next(err);
    }
})

module.exports = router;