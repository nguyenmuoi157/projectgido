import React, { Component } from 'react'
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, Button } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ddp from '../lib/ddp';
import RocketChat from '../lib/rocketchat';
import { hashPassword } from 'react-native-meteor/lib/utils';
// --------------------------------------
var authToken = "9fbRkdLcSmY34EGOFkWzhzzhffvGbMrYQMkvEmFWoy_";
const loginCall = args => (args.resume ? RocketChat.login(args) : RocketChat.loginWithPassword(args));
const meCall = args => RocketChat.me(args);
const userInfoCall = args => RocketChat.userInfo(args);
// --------------------------------------------
export default class RoomView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataList: [],
            loaded: false,
            myuserid: '',
            token:'',
            userId:''
        }

    }


    completeUrl = (url) => {
        url = url.trim();

        if (/^(\w|[0-9-_]){3,}$/.test(url) &&
            /^(htt(ps?)?)|(loca((l)?|(lh)?|(lho)?|(lhos)?|(lhost:?\d*)?)$)/.test(url) === false) {
            url = `${url}.rocket.chat`;
        }

        if (/^(https?:\/\/)?(((\w|[0-9])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(url)) {
            if (/^localhost(:\d+)?/.test(url)) {
                url = `http://${url}`;
            } else if (/^https?:\/\//.test(url) === false) {
                url = `https://${url}`;
            }
        }
        return url.replace(/\/+$/, '');
    }
    handleLogin(result) {
        console.log(result);
    }

    componentWillMount() {

    }


    async componentDidMount() {
        fetch('https://gist.githubusercontent.com/yllongboy/81de024b02f1b668818066bcafbf3c4c/raw/5a508fd580cc1c3d104a300589e7e88d895fa766/whatsapp_contacts.json')
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                this.setState({
                    DataList: data,
                    loaded: true
                })
            });


        let url = this.completeUrl('http://192.168.1.100:4000');
        this.ddp = new Ddp(url);
        this.ddp.on('connected', () => {
            console.log("connected");
        });

        this.ddp.on('connected', () => this.ddp.subscribe('activeUsers', null, false));
        this.ddp.on('stream-room-messages', (ddpMessage) => {
            console.log('stream-room-messages');
        });

        this.ddp.on('stream-notify-room', (ddpMessage) => {
            console.log('stream-notify-room',ddpMessage);
        });

        this.ddp.on('stream-notify-user', (ddpMessage) => {
            console.log('stream-notify-user có tin nhắn đến',ddpMessage);
        });
    }
    componentWillUpdate() {

    }


    me({ server, token, userId }) {
        return fetch(`${server}/api/v1/me`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token,
                'X-User-Id': userId
            }
        }).then(response => response.json());
    }

    _keyExtractor = (item, index) => item.id;
    _onPress(item) {
        this.ddp.call("login", {
            user: {
                username: 'muoinv'
            },
            password: hashPassword("12345678")
        }).then((result) => {
            console.log('login', result);
            this.setState({
                userId : result.id,
                token : result.token
            });


            this.ddp.subscribe("stream-notify-user",`${result.id}/subscriptions-changed`,false);
            this.ddp.subscribe("stream-notify-user",`${result.id}/rooms-changed`,false);



        }).catch((err) => {
            console.log('loi dang nhap',err);
        });


        this.ddp.call("rooms/get",{
            $date: 0
        }).then((result)=>{
            console.log("danh sach phong", result);
        })
        
    }

    completeUrl = (url) => {
        url = url.trim();

        if (/^(\w|[0-9-_]){3,}$/.test(url) &&
            /^(htt(ps?)?)|(loca((l)?|(lh)?|(lho)?|(lhos)?|(lhost:?\d*)?)$)/.test(url) === false) {
            url = `${url}.rocket.chat`;
        }

        if (/^(https?:\/\/)?(((\w|[0-9])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(url)) {
            if (/^localhost(:\d+)?/.test(url)) {
                url = `http://${url}`;
            } else if (/^https?:\/\//.test(url) === false) {
                url = `https://${url}`;
            }
        }
        return url.replace(/\/+$/, '');
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.listItemContainer} onPress={() => { this._onPress(item) }}>
                <View style={styles.iconContainer}>
                    <Image source={{ uri: item.image }} style={styles.initStyle} resizeMode='contain' />
                </View>
                <View style={styles.callerDetailsContainer}>
                    <View style={styles.callerDetailsContainerWrap}>
                        <View style={styles.nameContainer}>
                            <Text>{item.first_name}</Text>
                            <View style={styles.dateContainer}>
                                <Icon name={item.missed ? "call-missed" : "call-received"} size={15} color={item.missed ? "#ed788b" : "#075e54"} />
                                {/* <Text style={{ fontWeight: '400', color: '#666', fontSize: 12 }}>{item.date} {item.time}</Text> */}
                            </View>
                        </View>
                        <View style={styles.callIconContainer}>
                            <Text style={{ fontWeight: '400', color: '#666', fontSize: 12 }}>{item.date} {item.time}</Text>
                            {/* <Icon name="phone" color='#075e54' size={23} style={{ padding: 5 }} /> */}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <FlatList
                data={this.state.DataList}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                extraData={this.state}
            />

        )
    }
}

const styles = StyleSheet.create({
    logoText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        alignItems: "flex-start",
        marginLeft: 10
    },
    listItemContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10
    },
    iconContainer: {
        flex: 1,
        alignItems: "flex-start"
    },
    callerDetailsContainer: {
        flex: 4,
        justifyContent: "center",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.25
    },
    callerDetailsContainerWrap: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row"
    },
    nameContainer: {
        alignItems: "flex-start",
        flex: 1
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    callIconContainer: {
        flex: 1,
        alignItems: "flex-end"
    },
    initStyle: {
        borderRadius: 30,
        width: 60,
        height: 60
    }
});