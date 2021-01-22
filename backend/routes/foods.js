/** API routes for for food search and add */

const express = require("express");
const router = new express.Router();
const Food = require('../models/food');
const ExpressError = require('../helpers/expressError');
const jsonschema = require('jsonschema');
const createFoodSchema = require('../schema/food/createFoodSchema.json');
const updateFoodSchema = require('../schema/food/updateFoodSchema.json');

 /** Add food information for specific user **/

router.post('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        const result = jsonschema.validate(req.body, createFoodSchema);

        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }
        const {food, cals, protein, carbs, fat, amount} = req.body;

        let resp = await Food.postFoods(username, food, cals, protein, carbs, fat, amount);

        return res.status(201).json(resp);
    } catch (err) {
        return next(err);
    }
});

/** Get food information for specific user for given date **/

router.get('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        const {date} = req.query;

        let resp = await Food.getFoods(username, date);

        if(resp.message){
            return res.status(resp.status).json({"message": resp.message});
        }
        return res.json(resp);
    } catch (err) {
        return next(err);
    }
});

/** Get food information for specific user regardless of date **/

router.get('/:username/food/:foodId', async function(req, res, next){
    try {
        const {foodId} = req.params;

        let resp = await Food.getFood(foodId);

        if(resp.message){
            return res.status(resp.status).json({"message": resp.message})
        }
        return res.json(resp);
    } catch (err) {
        return next(err)
;    }
});

/** Update previosly entered food information for specific user **/

router.patch('/:username/food/:foodId', async function(req, res, next){
    try {
        const {foodId} = req.params;
        const result = jsonschema.validate(req.body, updateFoodSchema);

        if(!result.valid){
            let errList = result.errors.map(err => err.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {cals, protein, carbs, fat, amount} = req.body;

        let resp = await Food.editFood(cals, protein, carbs, fat, amount, foodId);

        if(resp.food){
            return res.status(200).json({'message': `${resp.food} information has been updated.`})
        } else if (resp.message){
            return res.status(resp.status).json({"message": resp.message})
        }
        return res.json(resp);
    } catch (err) {
        return next(err);
    }
});

/** Remove food information for specific user **/

router.delete('/:username/food/:foodId', async function(req, res, next){
    try {
        const {username, foodId} = req.params;
        let resp = await Food.removeFood(foodId);

        if(resp.username){
            return res.json({'message': "Food has been deleted"})
        } else if (resp.message){
            return res.status(resp.status).json({"message": resp.message})
        }

        return res.json(resp)
    } catch (err) {
        return next(err)
    }
})

module.exports = router;