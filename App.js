import React, { Component } from 'react'
import AppNavigator from './src/RootNavigation';


import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './src/reducers';

const store = createStore(rootReducer)


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}
