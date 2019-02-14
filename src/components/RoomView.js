import React, { Component } from 'react'
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, Button, AsyncStorage } from 'react-native'
import RoomItem from '../presentation/RoomItem';
import Rocket from '../lib/Rocket';
import { connect } from 'react-redux'

class RoomView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataList: this.props.DataList,
            loaded: false,
            myuserid: '',
            token: '',
            userId: ''
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
    componentWillMount() {
    }

    componentDidMount() {
        // try {
        //     let loginStore = await AsyncStorage.getItem("@userlogin");
        //     let userlogin = JSON.parse(loginStore);
        //     this.loginWithToken(userlogin.token);

        // } catch (error) {
        //     console.log(error);
        // }
        this.getRoomView();

    }

    _keyExtractor = (item, index) => item.id;

    getRoomView() {
        Rocket.getRoom()
            .then((data) => {
                if (data) {
                    this.setState({
                        DataList: data
                    })
                }
            });


        console.log('state datalist', this.state.DataList)

    }

    async loginWithToken(token) {
        let userlogin = await Rocket.loginWithAuthenticationToken(token);
        if (userlogin) {
            await AsyncStorage.setItem("@userlogin", userlogin);
        }
    }

    async _onPress() {
        // Rocket.loginWithPassword({ username: "muoinv", password: "12345678" })
        //     .then((result) => {
        //         if (result) {
        //             this.setState({
        //                 userId: result.id,
        //                 token: result.token
        //             });

        //             Rocket.subscribe("stream-notify-user", `${result.id}/subscriptions-changed`, false);
        //             Rocket.subscribe("stream-notify-user", `${result.token}/rooms-changed`, false);
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     })

        // this.ddp.call("login", {
        //     user: {
        //         username: 'muoinv'
        //     },
        //     password: hashPassword("12345678")
        // }).then((result) => {
        //     console.log('login', result);
        //     this.setState({
        //         userId: result.id,
        //         token: result.token
        //     });

        //     this.ddp.subscribe("stream-notify-user", `${result.id}/subscriptions-changed`, false);
        //     this.ddp.subscribe("stream-notify-user", `${result.id}/rooms-changed`, false);

        // }).catch((err) => {
        //     console.log('loi dang nhap', err);
        // });

        this.getRoomView();

    }
    _onPressItem(item) {
        console.log('item', item);
        this.props.navigation.navigate('ChatView', { item: item });
    }
    _renderItem = ({ item }) => {
        return (
            // <TouchableOpacity style={styles.listItemContainer} onPress={() => { this._onPress(item) }}>
            //     <View style={styles.iconContainer}>
            //         <Image source={{ uri: item.image }} style={styles.initStyle} resizeMode='contain' />
            //     </View>
            //     <View style={styles.callerDetailsContainer}>
            //         <View style={styles.callerDetailsContainerWrap}>
            //             <View style={styles.nameContainer}>
            //                 <Text>{item.name}</Text>
            //                 <View style={styles.dateContainer}>
            //                     <Icon name={item.missed ? "call-missed" : "call-received"} size={15} color={item.missed ? "#ed788b" : "#075e54"} />
            //                     {/* <Text style={{ fontWeight: '400', color: '#666', fontSize: 12 }}>{item.date} {item.time}</Text> */}
            //                 </View>
            //             </View>
            //             <View style={styles.callIconContainer}>
            //                 <Text style={{ fontWeight: '400', color: '#666', fontSize: 12 }}>{item.date} {item._updatedAt}</Text>
            //                 {/* <Icon name="phone" color='#075e54' size={23} style={{ padding: 5 }} /> */}
            //             </View>
            //         </View>
            //     </View>
            // </TouchableOpacity>
            <RoomItem
                alert={item.alert}
                unread={item.unread}
                userMentions={item.userMentions}
                favorite={item.f}
                name={item.name}
                _updatedAt={item.roomUpdatedAt}
                key={item._id}
                type={item.t}
                baseUrl={this.completeUrl('http://192.168.1.100:4000')}
                lastMessage={item.lastMessage}
                onPress={() => this._onPressItem(item)}
            />
        );
    };

    render() {
        // Rocket.getRoom()
        //     .then((result) => {
        //         if (result) {
        //             this.setState({
        //                 DataList: result
        //             })
        //         }
        //     });


        listDataRoom = this.props.DataList ? this.props.DataList : this.state.DataList;
        console.log('listDataRoom', listDataRoom)
        return (
            // <View style={{ flex: 1 }}>
            //     <FlatList
            //         //data={this.state.DataList}
            //         data={listDataRoom}
            //         keyExtractor={this._keyExtractor}
            //         renderItem={this._renderItem}
            //         extraData={this.state}
            //     />
            //     <Button title="login" onPress={() => { this._onPress() }} />
            // </View>
            <FlatList
                //data={this.state.DataList}
                data={listDataRoom}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                extraData={this.state}
            />
        )
    }
}


const mapStateToProps = (state) => {
    console.log('state', state);

    return {
        DataList: state.ListRoomReduces
    }
}

export default connect(mapStateToProps, null)(RoomView);


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