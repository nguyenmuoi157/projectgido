import { combineReducers } from 'redux'
import ListRoomReduces from './ListRoomReduces';
import SendMessageReducers from './SendMessageReducers';
export default combineReducers({
    ListRoomReduces,
    SendMessageReducers
})