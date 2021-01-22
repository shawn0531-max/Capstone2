const express = require("express");
const router = new express.Router();
const jsonschema = require('jsonschema');
const createRecommendSchema = require('../schema/recommends/createRecommendSchema.json');
const Recommendation = require('../models/recommendation');
const ExpressError = require("../helpers/expressError");

/** Post recommendations to database **/

router.post('/:username', async function(req, res, next){
    try {
        const {username} = req.params;
        
        const result = jsonschema.validate(req.body, createRecommendSchema);
        
        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {cals, protein, fats, carbs} = req.body;

        let resp = await Recommendation.sendRecommendations(username, cals, protein, fats, carbs);

        if(resp.username){
            return res.status(201).json({'message': "Recommendations added"})
        }
        if(resp.message){
            return res.status(resp.status).json({'message': resp.message});
        }

        return res.status(201).json(resp);
    } catch (err) {
        return next(err);
    }
});

/** GET a user's current recommendations **/

router.get('/:username', async function(req, res, next){
    try {
        const {username} = req.params;

        let recommendations = await Recommendation.getRecommendations(username);

        if(recommendations.message){
            return res.status(recommendations.status).json({'message': recommendations.message})
        }

        return res.json(recommendations);
    } catch (err) {
        return next(err);
    }
});

/** Update a user's recommendations based on changes in information **/

router.patch('/:username', async function(req, res, next){
    try {
        const {username} = req.params;

        const result = jsonschema.validate(req.body, createRecommendSchema);
        
        if(!result.valid){
            let errList = result.errors.map(error => error.stack);
            let err = new ExpressError(errList, 400);
            return next(err);
        }

        const {cals, protein, fats, carbs} = req.body;

        let resp = await Recommendation.updateRecommendations(cals, protein, fats, carbs, username);

        if(resp.username){
            return res.json({'message': `${username}'s recommendations have been updated.`})
        }
        if(resp.message){
            return res.status(resp.status).json({'message': resp.message});
        }

        return res.json(resp);
    } catch (err) {
        return next(err)
    }
})

module.exports = router;