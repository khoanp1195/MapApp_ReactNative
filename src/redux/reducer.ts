import {combineReducers } from '@reduxjs/toolkit';
import detailReducer from './detail/reducer'
import locationReducer from './location/reducer'
import appbarCustomReducer from './appbarcustom/reducer'
const rootReducer = combineReducers({
    detail : detailReducer,
    location: locationReducer,
    appbarCustom: appbarCustomReducer
});

export default rootReducer;

