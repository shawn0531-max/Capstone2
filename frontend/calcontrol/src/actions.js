import {GETUSERINFO, LOGIN, SIGNUP, CHARTINFO, STORETOKEN, LOGOUT, GETTWOWEEKSWEIGHTS, SENDRECOMMENDS, 
        GETRECOMMENDS, POSTFOOD, GETFOOD, FOODSEARCH, EDITFOOD, GETSINGLEFOOD, DELETEFOOD,
        GETFAVS, DATEWEIGHT, DATECAL} from './actionTypes';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const DBAPI = 'http://localhost:5000';
const FoodAPI = 'https://api.calorieninjas.com/v1/nutrition';
// key to access API 
const api_key = 'abzfQrMaqXyvSxbZv72JRA==ATIcRZPxiYS74NxH';

/** Retrieve information on user **/
export function getUserInfo(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/user/${username}`);

        return dispatch(getInfo(resp.data));
    }
}

function getInfo(user){
    return {type: GETUSERINFO, user: user}
}

/** Authenticate username/password and generate user token **/
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

/** Create new user and login **/
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

/** Retrieve user information to plot on chart for profile page **/
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

/** Get user weights in date range **/
export async function getWeightInfo(username, startDate, endDate){
        let resp = await axios.get(`${DBAPI}/user/${username}/profile/weights?startDate=${startDate}&endDate=${endDate}`);
        return resp.data
}

/** Gets user token from session **/
export function getUserToken(){
    let token = sessionStorage.getItem('token') || undefined;
    return {type: STORETOKEN, token: token}
}

/** Removes user token from session **/
export function userLogout(){
    sessionStorage.removeItem('token');
    return {type: LOGOUT}
}

/** Gets previous two weeks of weights to determine if change in BMR or calories is needed **/
export function getOldWeights(username, datesArr){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/weights/${username}`, {params: {'startDate': datesArr[0], 'endDate': datesArr[1]}});
        return dispatch(getWeights(resp.data));
    }
}

function getWeights(entries){
    return {type: GETTWOWEEKSWEIGHTS, entries: entries};
}

/** Allows user to update password and/or email **/
export async function updateUser(username, oldPass, newPass, newEmail){
        
    let resp = await axios.patch(`${DBAPI}/user/${username}`,{
        'oldPass': oldPass,
        'newPass': newPass,
        'newEmail': newEmail,
    });

    return resp;
}

/** Sends recommended daily calories and macros to database **/
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

/** Updates recommendations **/
export async function updateRecommends(username, infoArr){
        let resp = await axios.patch(`${DBAPI}/recommendations/${username}`,{
            'cals': infoArr[0],
            'protein': infoArr[1].protein,
            'fats': infoArr[1].fats,
            'carbs': infoArr[1].carbs
        });

        return resp;
}

/** Gets user's current recommendations **/
export function getRecommendations(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/recommendations/${username}`);

        return dispatch(getRecommendInfo(resp.data));
    }
}

function getRecommendInfo(recommendations){
    return {type: GETRECOMMENDS, recommendations: recommendations}
}

/** Adds food for the day **/
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

/** Gets food from specified date **/
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

/** Sends query to food API CalorieNinjas **/
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

/** Changes information for food based on amount change **/
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

/** Gets specified food  **/
export function getOneFood(username, foodId){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/foods/${username}/food/${foodId}`);

        return dispatch(getAFood(resp.data));
    }
}

function getAFood(food){
    return {type: GETSINGLEFOOD, food: food}
}

/** Removes food for the day from database **/
export function deleteFoodInfo(username, foodId){
    return async function(dispatch){
        await axios.delete(`${DBAPI}/foods/${username}/food/${foodId}`);

        return dispatch(deleteInfo());
    }
}

function deleteInfo(){
    return {type: DELETEFOOD}
}

/** Retrieves all the user's favorites **/
export function getAllFavs(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/user/${username}/favorites`);
        return dispatch(allFavs(resp.data));
    }
}

function allFavs(favs){
    return {type: GETFAVS, favorites: favs}
}

/** Adds a fovorite for the user **/
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

/** Adds a weight for the user (daily weigh in) **/
export async function addDailyWeight(username, weight){
    let resp = await axios.post(`${DBAPI}/weights/${username}`,{
        'userWeight': weight
    });

    return resp;
}

/** Checks if there is weight entered for the day and retrieves it if it exists **/
export function getDailyWeight(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/weights/${username}/date`);
        return dispatch(dailyWeight(resp.data));
    }
}

function dailyWeight(id){
    return{type: DATEWEIGHT, id: id}
}

/** Adds calorie total for the user for the current day **/
export async function addDailyCals(username, cals, rCals){
    let resp = await axios.post(`${DBAPI}/weights/${username}/cals`,{
        'cals': cals,
        'r_cals': rCals
    });

    return resp;
}

/** Checks if total calories have been entered for current day **/
export function getDailyCals(username){
    return async function(dispatch){
        let resp = await axios.get(`${DBAPI}/weights/${username}/cals`);
        return dispatch(dailyCals(resp.data));
    }
}

function dailyCals(id){
    return{type: DATECAL, id: id}
}

/** User's weight change is checked and calories are updated every two weeks
 *  this function changes the date to two weeks in the future after the update **/
export async function updateCheckDate(username, checkDate){
    let resp = await axios.patch(`${DBAPI}/user/${username}/update/weighdate`,{
        'checkDate': checkDate
    });

    return resp.data;
}

/** Updates user's current week every two weeks after the check **/
export async function updateBiweekWeight(username, weight){
    let resp = await axios.patch(`${DBAPI}/user/${username}/update/biweekweight`,
    {
        'weight': weight
    });

    return resp;
}