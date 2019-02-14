import * as type from '../actions/ActionType';
const SendMessageReduces = (state = [], action) => {
    switch (action.type) {
        case type.SEND_MESSAGE:
            return [
                ...state,
                action.message
            ]
        default:
            return state;
    }
}

export default SendMessageReduces;