
import { createStackNavigator, createAppContainer } from "react-navigation";
import RoomView from './components/RoomView';
import ChatView from './components/ChatView';
import LoginView from './components/LoginView'
const AppNavigator = createStackNavigator({
  LoginView: {
    screen: LoginView
  },
  RoomView: {
    screen: RoomView
  },
  ChatView: {
    screen: ChatView
  }
});
export default createAppContainer(AppNavigator);