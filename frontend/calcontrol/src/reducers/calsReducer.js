import { DATECAL } from '../actionTypes';

const INITIAL_STATE = {cals: undefined}

export default function calsReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case DATECAL:
            return {cals: action.id} || {cals: undefined}
        default:
            return state;
    }
}