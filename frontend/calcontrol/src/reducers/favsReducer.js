import { GETFAVS } from '../actionTypes';

const INITIAL_STATE = {favs: []}
export default function favsReducer(state=INITIAL_STATE, action){
    switch(action.type){
        case GETFAVS:
            return action.favorites
        default:
            return state
    }
}