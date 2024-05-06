import {createStore} from 'redux';
import rootReducer from './reducer';

// @ts-ignore
const store = createStore(rootReducer);

export default store;
