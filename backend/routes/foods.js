/**  **/

const express = require("express");
const router = new express.Router();
const Food = require('../models/food');

router.post('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        const {food, cals, protein, carbs, fat, amount} = req.body;

        let resp = await Food.postFoods(username, food, cals, protein, carbs, fat, amount);

        return res.status(201).json(resp);
    } catch (err) {
        return next(err);
    }
});

router.get('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        const {date} = req.query;

        let resp = await Food.getFoods(username, date);

        return res.json(resp);
    } catch (err) {
        return next(err);
    }
});

router.get('/:username/food/:foodId', async function(req, res, next){
    try {
        const {foodId} = req.params;

        let resp = await Food.getFood(foodId);
        return res.json(resp);
    } catch (err) {
        return next(err)
;    }
})

router.patch('/:username/food/:foodId', async function(req, res, next){
    try {
        const {foodId} = req.params;
        const {cals, protein, carbs, fat, amount} = req.body;

        let resp = await Food.editFood(cals, protein, carbs, fat, amount, foodId);

        return res.json(resp);
    } catch (err) {
        return next(err);
    }
})

router.delete('/:username/food/:foodId', async function(req, res, next){
    try {
        const {username, foodId} = req.params;
        let resp = await Food.removeFood(foodId);

        return res.json(resp)
    } catch (err) {
        return next(err)
    }
})

module.exports = router;