
import { createStackNavigator, createAppContainer } from "react-navigation";
import RoomView from './components/RoomView';
import ChatView from './components/ChatView';
const AppNavigator = createStackNavigator({
    RoomView: {
      screen: RoomView
    },
    ChatView: {
      screen: ChatView
    }
  });
  export default createAppContainer(AppNavigator);