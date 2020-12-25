import {GETUSERINFO, LOGIN, SIGNUP, CHARTINFO, STORETOKEN, LOGOUT, GETTWOWEEKSWEIGHTS} from './actionTypes';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const DBAPI = 'http://localhost:5000';

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
            "email": formData.email,
            "experience": formData.experience,
            "gender": formData.gender
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