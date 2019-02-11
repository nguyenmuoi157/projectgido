import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class ChatView extends Component {
    constructor(props){
        super(props);
        this.state = {
            ListMessage:[]
        }
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('item').first_name,
        };
    };
    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item');
        return (
            <View>
                <Text> {item.id} </Text>
            </View>
        )
    }
}
