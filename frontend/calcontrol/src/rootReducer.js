import userReducer from './userReducer';
import tokenReducer from './tokenReducer';
import chartInfoReducer from './chartInfoReducer';
import weightsReducer from './weightsReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({user: userReducer, token: tokenReducer, info: chartInfoReducer, weights: weightsReducer});

export default rootReducer;