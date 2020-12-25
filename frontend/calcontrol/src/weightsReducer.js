import { GETTWOWEEKSWEIGHTS } from './actionTypes';

const INITIAL_STATE = {weights: {}}

export default function weightsReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case GETTWOWEEKSWEIGHTS:
            return {weights: action.entries};
        default:
            return state;
    }
}