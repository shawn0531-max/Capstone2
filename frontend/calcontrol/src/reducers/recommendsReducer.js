import { GETRECOMMENDS, SENDRECOMMENDS } from '../actionTypes';

const INITIAL_STATE = {recommendations: []};

export default function recommendsReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case SENDRECOMMENDS:
            return state;
        case GETRECOMMENDS:
            return action.recommendations;
        default:
            return state;
    }
}