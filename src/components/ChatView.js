import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Rocket from '../lib/Rocket';
import { connect } from 'react-redux'
class ChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            rid: '',
            username: '',
            ListMessage: []
        }
    }

    async componentWillMount() {
        alert()
        const { navigation } = this.props;
        const item = navigation.getParam('item');
        let listmess = await Rocket.loadMessagesForRoom(item.rid, item.ls);
        console.log(listmess);
        let listdata = this._buildMessage(listmess.messages);
        Rocket.subscribe("stream-room-messages", item.rid, false);

        this.setState({
            // ListMessage: [
            //     {
            //         _id: 1,
            //         text: 'Hello developer',
            //         createdAt: new Date(),
            //         user: {
            //             _id: 2,
            //             name: 'React Native',
            //             avatar: 'https://placeimg.com/140/140/any',
            //         },
            //     },
            // ],
            ListMessage: listdata,
            userId: item.u._id,
            rid: item.rid,
            username: item.u.username,
            name: item.u.name
        })
    }
    async onSend(messages = []) {
        console.log('messages', messages)
        const { rid, userId, username } = this.state;
        messages.forEach(async (item) => {
            await Rocket.sendMessage(rid, item.text, userId, username);
        });


        this.setState(previousState => ({
            ListMessage: GiftedChat.append(previousState.ListMessage, this._buildMessage(this.props.ListMessage)),
            //ListMessage: this._buildMessage(this.props.ListMessage)
        }))
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('item').name,
        };
    };

    _buildMessage(messages = []) {
        let listdata = messages.map((item, index) => {
            debugger;
            return {
                _id: item._id,
                text: item.msg,
                createdAt: item._updatedAt,
                user: {
                    _id: item.u._id,
                    name: item.u.name,
                    avatar: 'https://placeimg.com/140/140/any',
                }
            }
        });

        return listdata
    }
    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item');
        // AsyncStorage.getItem("@userlogin")
        // .then((result)=>{
        //     console.log('@userlogin',result);
        // })
        let listdata = this.props.ListMessage ? this.props.ListMessage : this.state.ListMessage;
        listdata = this._buildMessage(listdata);
        return (
            <GiftedChat
                messages={listdata}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: item.u._id,
                    name: item.u.username
                }}
            />
        )
    }
}

const mapStateToProps = (state) => {
    console.log('state', state);

    return {
        ListMessage: state.SendMessageReducers
    }
}

export default connect(mapStateToProps, null)(ChatView)