import React, { Component } from 'react'
import AppNavigator from './src/RootNavigation';


import { Provider } from 'react-redux'
//import { createStore } from 'redux'
//import rootReducer from './src/reducers';
//const store = createStore(rootReducer)

import ReduxStore from './src/lib/CreateStore';

export default class App extends Component {
  render() {
    return (
      <Provider store={ReduxStore}>
        <AppNavigator />
      </Provider>
    )
  }
}
