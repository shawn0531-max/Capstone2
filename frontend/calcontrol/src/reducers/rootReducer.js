import userReducer from './userReducer';
import tokenReducer from './tokenReducer';
import chartInfoReducer from './chartInfoReducer';
import weightsReducer from './weightsReducer';
import recommendsReducer from './recommendsReducer';
import foodReducer from './foodReducer';
import favsReducer from './favsReducer';
import calsReducer from './calsReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({user: userReducer, token: tokenReducer, info: chartInfoReducer, 
                                     weights: weightsReducer, recommendations: recommendsReducer, foods: foodReducer,
                                     favorites: favsReducer, cals: calsReducer});

export default rootReducer;