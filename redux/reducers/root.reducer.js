import mtgTrackerReducer from './utils/mtg-tracker.reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    mtgTracker: mtgTrackerReducer
});

export default rootReducer;