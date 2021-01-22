const express = require("express");
const router = new express.Router();
const jsonschema = require('jsonschema');
const addWeightSchema = require('../schema/weight/addWeightSchema.json');
const addCalSchema = require('../schema/weight/addCalSchema.json');
const Weight = require('../models/weight');
const ExpressError = require("../helpers/expressError");

/** GET all user weights between two dates **/

router.get('/:username', async function(req, res, next){
    try {
        const {startDate, endDate} = req.query;
        const {username} = req.params;

        let entries = await Weight.getDates(startDate, endDate, username);

        if(entries.message){
            return res.status(entries.status).json({'message': entries.message});
        }

        return res.json(entries);
    } catch (err) {
        return next(err);
    }
});

/** GET user weight for today **/

router.get('/:username/date', async function(req, res, next){
    try {
        const {username} = req.params;

        let id = await Weight.getByDate(username);

        if(id.message){
            return res.status(id.status).json(id.message);
        }
        return res.json(id);
    } catch (err) {
        return next(err);
    }
});

/** POST weight for user (daily weigh in) **/

router.post('/:username', async function(req, res, next){
    try {
        const {username} = req.params;

        const result = jsonschema.validate(req.body, addWeightSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {userWeight} = req.body;

        let resp = await Weight.addWeight(username, userWeight);

        if(resp.id){
            return res.status(201).json({"message": 'Weight added'})
        } else if(resp.message){
            return res.status(resp.status).json({"message": resp.message})
        }
        return res.status(201).json(resp);
        } catch (err) {
        return next(err);
    }
});

/** GET user calories for today **/

router.get('/:username/cals', async function(req,res,next){
    try {
        const {username} = req.params;

        let resp = await Weight.getCalsByDate(username);

        if(resp.message){
            return res.status(resp.status).json(resp.message);
        }

        return res.json(resp);
    } catch (err) {
        return next(err);
    }
});

/** POST calories for user (daily calorie check in) **/

router.post('/:username/cals', async function(req, res, next){
    try {
        const {username} = req.params;

        const result = jsonschema.validate(req.body, addCalSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {cals, r_cals} = req.body;

        let check = await Weight.getCalsByDate(username);

        if(check){
            if(check.id){
                return res.status(400).json({'message':'You have already entered calories for today'});
            } 
        } 

        let resp = await Weight.addCals(username, cals, r_cals);

        if(resp.id){
            return res.status(201).json({'message': 'Calories added'})
        }
        return res.json(resp)
        
    } catch (err) {
        return next(err);
    }
})

module.exports = router;