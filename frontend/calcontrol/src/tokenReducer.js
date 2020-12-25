import {STORETOKEN} from './actionTypes';

const INITIAL_STATE = {token: undefined}

export default function tokenReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case STORETOKEN:
            return {token: action.token}
        default:
            return state;
    }
}
