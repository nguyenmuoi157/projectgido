import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import RoomView from './src/components/RoomView';
import ChatView from './src/components/ChatView';
import LoginView from './src/components/LoginView';
const AppNavigator = createStackNavigator({
  RoomView: {
    screen: RoomView
  },
  ChatView: {
    screen: ChatView
  }
});
export default createAppContainer(AppNavigator);
//export default LoginView;
