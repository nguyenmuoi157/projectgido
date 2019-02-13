import * as ActionType from './ActionType';

export default onChangeListRoom = (listRoom) => {
    return (
        {
            type: ActionType.ADD_MESSAGE,
            ListRoom: listRoom
        }
    )

}