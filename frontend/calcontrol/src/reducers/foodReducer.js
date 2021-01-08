import {EDITFOOD, FOODSEARCH, GETFOOD, GETSINGLEFOOD, POSTFOOD} from '../actionTypes';

const INITIAL_STATE = {foods: {}}

export default function foodReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case GETFOOD:
            return {foods: action.foods};
        case POSTFOOD:
            return {foods: action.foods};
        case FOODSEARCH:
            return {foods: action.food};
        case GETSINGLEFOOD:
            return {food: action.food};
        case EDITFOOD:
            return state
        default:
            return state;
    }
}