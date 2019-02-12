import * as type from '../actions/ActionType';
const ListRoomReduces = (state = [], action) => {
    switch (action.type) {
        case type.ADD_MESSAGE:
            return [
                ...state
            ]
        default:
            return state;
    }
}

export default ListRoomReduces;