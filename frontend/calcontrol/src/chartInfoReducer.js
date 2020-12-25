import { CHARTINFO } from './actionTypes';

const INITIAL_STATE = {info: []}

export default function chartInfoReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case CHARTINFO:
            return [action.info];
        default:
            return state;
    }
}