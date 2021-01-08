const db = require("../db");
const express = require("express");
const router = new express.Router();
const Weight = require('../models/weight');
const ExpressError = require("../helpers/expressError");

router.get('/:username', async function(req, res, next){
    try {
        const {startDate, endDate} = req.query;
        const {username} = req.params;

        let entries = await Weight.getDates(startDate, endDate, username);

        return res.json(entries);
    } catch (err) {
        return next(err);
    }
});

router.get('/:username/date', async function(req, res, next){
    try {
        const {username} = req.params;

        let id = await Weight.getByDate(username);

        return res.json(id);
    } catch (err) {
        return next(err);
    }
})

router.post('/:username', async function(req, res, next){
    try {
        const {username} = req.params;

        const {userWeight} = req.body;

        let resp = await Weight.addWeight(username, userWeight);

        return res.json(resp);
        } catch (err) {
        return next(err);
    }
});

router.get('/:username/cals', async function(req,res,next){
    try {
        const {username} = req.params;

        let resp = await Weight.getCalsByDate(username);

        return res.json(resp);
    } catch (err) {
        return next(err);
    }
})

router.post('/:username/cals', async function(req, res, next){
    try {
        const {username} = req.params;
        const {cals, r_cals} = req.body;

        let check = await Weight.getCalsByDate(username);

        if(check){
            if(check.id){
                return res.json('Already entered')
            } 
        } else{
            let resp = await Weight.addCals(username, cals, r_cals);
            return res.json(resp)
        }

    } catch (err) {
        return next(err);
    }
})

module.exports = router;