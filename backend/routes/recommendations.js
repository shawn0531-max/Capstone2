const db = require("../db");
const express = require("express");
const router = new express.Router();
const Recommendation = require('../models/recommendation');

/** Post recommendations to database **/

router.post('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        const {cals, protein, fats, carbs} = req.body;
        await Recommendation.sendRecommendations(username, cals, protein, fats, carbs);

        return res.status(201);
    } catch (err) {
        return next(err);
    }
});

router.get('/:username', async function(req, res, next){
    try {
        const {username} = req.params;

        let recommendations = await Recommendation.getRecommendations(username);

        return res.json(recommendations);
    } catch (err) {
        return next(err);
    }
})