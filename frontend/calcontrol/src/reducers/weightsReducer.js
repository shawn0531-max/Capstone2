import { DATEWEIGHT, GETTWOWEEKSWEIGHTS } from '../actionTypes';

const INITIAL_STATE = {weights: undefined}

export default function weightsReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case GETTWOWEEKSWEIGHTS:
            return {weights: action.entries};
        case DATEWEIGHT:
            return action.id || null
        default:
            return state;
    }
}