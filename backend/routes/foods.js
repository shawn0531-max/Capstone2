/** API route for food/drink search. */

const db = require("../db");
const express = require("express");
const router = new express.Router();

const API = 'https://api.edamam.com/api/food-database/v2/parser';
const app_id = '97fe357f';
const app_key = 'd5ced070466bd3fd2e5e5a86bd2913e0';

router.get(`${API}?ingr=`)