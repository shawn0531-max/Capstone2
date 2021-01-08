import {GETUSERINFO, LOGIN, SIGNUP, CHARTINFO, STORETOKEN, LOGOUT, GETTWOWEEKSWEIGHTS, SENDRECOMMENDS, 
        GETRECOMMENDS, POSTFOOD, GETFOOD, FOODSEARCH, EDITFOOD, GETSINGLEFOOD, DELETEFOOD,
        GETFAVS, DATEWEIGHT, DATECAL, WEIGHTINFO} from './actionTypes';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const DBAPI = 'http://localhost:5000';
const FoodAPI = 'https://api.calorieninjas.com/v1/nutrition';
const api_key = 'abzfQrMaqXyvSxbZv72JRA==ATIcRZPxiYS74NxH';

export function getUserInfo(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/user/${username}`);

        return dispatch(getInfo(resp.data));
    }
}

function getInfo(user){
    return {type: GETUSERINFO, user: user}
}

export function loginUser(formData){
    return async function(dispatch){
        let resp = await axios.post(`${DBAPI}/user/login`,{
            "username": formData.username,
            "password": formData.password
        });

        return dispatch(login(resp.token));
    }
}

function login(token){
    let username = jwt.decode(token);

    return {type: LOGIN, username: username}
}

export function signupUser(formData){
    return async function(dispatch){
        let resp = await axios.post(`${DBAPI}/user/signup`,{
            "username": formData.username,
            "password": formData.password,
            "email": formData.email
        });

        return dispatch(signup(resp.token));
    }
}

function signup(token){
    let username = jwt.decode(token);

    return {type: SIGNUP, username: username}
}

export function getChartInfo(username, month, year){

    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/user/${username}/profile?month=${month}&year=${year}`);
        let weightsArr = resp.data[0];
        let calsArr = resp.data[1];
        return dispatch(getChart(weightsArr, calsArr));
    }
}

function getChart(weightsArr, calsArr){
    return {type: CHARTINFO, info: [weightsArr, calsArr]}
}

export async function getWeightInfo(username, startDate, endDate){
        let resp = await axios.get(`${DBAPI}/user/${username}/profile/weights?startDate=${startDate}&endDate=${endDate}`);
        return resp.data
}

export function getUserToken(){
    let token = sessionStorage.getItem('token') || undefined;
    return {type: STORETOKEN, token: token}
}

export function userLogout(){
    sessionStorage.removeItem('token');
    return {type: LOGOUT}
}

export function getOldWeights(username, datesArr){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/weights/${username}`, {params: {'startDate': datesArr[0], 'endDate': datesArr[1]}});
        return dispatch(getWeights(resp.data));
    }
}

function getWeights(entries){
    return {type: GETTWOWEEKSWEIGHTS, entries: entries};
}

export async function updateUser(username, oldPass, newPass, newEmail){
        
    let resp = await axios.patch(`${DBAPI}/user/${username}`,{
        'oldPass': oldPass,
        'newPass': newPass,
        'newEmail': newEmail,
    });

    return resp;
}

export function postRecommendations(username, infoArr){
    return async function(dispatch){
        await axios.post(`${DBAPI}/recommendations/${username}`,{
            'cals': infoArr[0],
            'protein': infoArr[1].protein,
            'fats': infoArr[1].fats,
            'carbs': infoArr[1].carbs
        });

        return dispatch(postRecommends());
    }
}

function postRecommends(){
    return {type: SENDRECOMMENDS}
}

export async function updateRecommends(username, infoArr){
        let resp = await axios.patch(`${DBAPI}/recommendations/${username}`,{
            'cals': infoArr[0],
            'protein': infoArr[1].protein,
            'fats': infoArr[1].fats,
            'carbs': infoArr[1].carbs
        });

        return resp;
}

export function getRecommendations(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/recommendations/${username}`);

        return dispatch(getRecommendInfo(resp.data));
    }
}

function getRecommendInfo(recommendations){
    return {type: GETRECOMMENDS, recommendations: recommendations}
}

export function postNewFood(username, foodObj){
    return async function(dispatch){
        let resp = await axios.post(`${DBAPI}/foods/${username}`,{
            'food': foodObj.food,
            'cals': foodObj.cals,
            'protein': foodObj.protein,
            'carbs': foodObj.carbs,
            'fat': foodObj.fat,
            'amount': foodObj.amount
        });

        return dispatch(sendNewFood(resp.data));
    }
}

function sendNewFood(foods){
    return {type: POSTFOOD, foods: foods}
}

export function getDateFood(username, date){

    return async function (dispatch){
        let resp = await axios.get(`${DBAPI}/foods/${username}`, {
            params: {date: date}
        });

        return dispatch(listNewFood(resp.data));
    }
}

function listNewFood(foods){
    return {type: GETFOOD, foods: foods}
}

export function searchFoodApi(food){
    return async function(dispatch){
        let resp = await axios.get(`${FoodAPI}?query=${food}`,{
            headers: {'X-Api-Key': api_key}
        });

        return dispatch(searchFood(resp.data));
    }
}

function searchFood(food){
    return {type: FOODSEARCH, food: food}
}

export function editFoodInfo(foodId, foodObj, username){
    return async function(dispatch){

        await axios.patch(`${DBAPI}/foods/${username}/food/${foodId}`,{
            'cals': foodObj.cals,
            'protein': foodObj.protein,
            'carbs': foodObj.carbs,
            'fat': foodObj.fat,
            'amount': foodObj.amount
        });

        return dispatch(editInfo())
    }
}

function editInfo(){
    return {type: EDITFOOD}
}

export function getOneFood(username, foodId){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/foods/${username}/food/${foodId}`);

        return dispatch(getAFood(resp.data));
    }
}

function getAFood(food){
    return {type: GETSINGLEFOOD, food: food}
}

export function deleteFoodInfo(username, foodId){
    return async function(dispatch){
        let resp = await axios.delete(`${DBAPI}/foods/${username}/food/${foodId}`);

        return dispatch(deleteInfo());
    }
}

function deleteInfo(){
    return {type: DELETEFOOD}
}

export function getAllFavs(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/user/${username}/favorites`);
        return dispatch(allFavs(resp.data));
    }
}

function allFavs(favs){
    return {type: GETFAVS, favorites: favs}
}

export async function addFav(username, food, cals, protein, carbs, fat){
    let resp = await axios.post(`${DBAPI}/user/${username}/favorites`,{
        'food': food,
        'cals': cals,
        'protein': protein,
        'carbs': carbs,
        'fat': fat
    });

    return resp;
}

export async function deleteFav(username, id){
    let resp = await axios.delete(`${DBAPI}/user/${username}/favorites/${id}`);

    return resp;
}

export async function addDailyWeight(username, weight){
    let resp = await axios.post(`${DBAPI}/weights/${username}`,{
        'userWeight': weight
    });

    return resp;
}

export function getDailyWeight(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/weights/${username}/date`);
        return dispatch(dailyWeight(resp.data));
    }
}

function dailyWeight(id){
    return{type: DATEWEIGHT, id: id}
}

export async function addDailyCals(username, cals, rCals){
    let resp = await axios.post(`${DBAPI}/weights/${username}/cals`,{
        'cals': cals,
        'r_cals': rCals
    });

    return resp;
}

export function getDailyCals(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/weights/${username}/cals`);
        return dispatch(dailyCals(resp.data));
    }
}

function dailyCals(id){
    return{type: DATECAL, id: id}
}

export async function updateCheckDate(username, checkDate){
    let resp = await axios.patch(`${DBAPI}/user/${username}/update/weighdate`,{
        'checkDate': checkDate
    });

    return resp.data;
}

export async function updateBiweekWeight(username, weight){
    let resp = await axios.patch(`${DBAPI}/user/${username}/update/biweekweight`,
    {
        'weight': weight
    });

    return resp;
}