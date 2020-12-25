const db = require("../db");
const express = require("express");
const router = new express.Router();
const TwoWeekDate = require('../models/twoWeekDate');

router.get('/:username', async function(req, res, next){
    try {
        const {startDate, endDate} = req.query;
        const {username} = req.params;

        let entries = await TwoWeekDate.getDates(startDate, endDate, username);

        return res.json(entries);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;