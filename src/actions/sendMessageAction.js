import * as ActionType from './ActionType';

export default sendMessageAction = (message) => {
    return (
        {
            type: ActionType.SEND_MESSAGE,
            message: message
        }
    )

}