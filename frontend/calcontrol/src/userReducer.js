import {GETUSERINFO, LOGOUT} from './actionTypes';

const INITIAL_STATE = {user: {}}

export default function userReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case GETUSERINFO:
            return {user: action.user};
        case LOGOUT:
            return INITIAL_STATE;
        default:
            return state;
    }
}