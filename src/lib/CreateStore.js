import rootReducer from '../reducers/index';
import { createStore } from 'redux'

const ReduxStore = createStore(rootReducer);

export default ReduxStore;