import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, AsyncStorage,Keyboard } from 'react-native'
import styles from './Styles';

import RocketChat from '../lib/rocketchat';
import * as ConstCommon from '../constaint';

const loginCall = args => (args.resume ? RocketChat.login(args) : RocketChat.loginWithPassword(args));
const meCall = args => RocketChat.me(args);
const userInfoCall = args => RocketChat.userInfo(args);

export default class LoginView extends Component {

    // static navigationOptions = () => ({
    //     title: 'Login'
    // });
    constructor(props) {
        super(props);

        this.state = {
            username: 'muoinv',
            password: '12345678'
        };

    }




    submit = () => {
        debugger;
        const { username, password, code } = this.state;
        if (username.trim() === '' || password.trim() === '') {
           // showToast('Email or password field is empty');
            return;
        }
        debugger;
        let url = this.completeUrl("'http://192.168.1.100:4000'");
        
        //AsyncStorage.setItem(ConstCommon.SERVER_URL, url);
        //this.props.loginSubmit({	username, password, code });
        //Keyboard.dismiss();
    }


    render() {
        return (
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input_white}
                    onChangeText={username => this.setState({ username })}
                    keyboardType='email-address'
                    autoCorrect={false}
                    returnKeyType='next'
                    autoCapitalize='none'
                    underlineColorAndroid='transparent'
                    onSubmitEditing={() => { this.password.focus(); }}
                    placeholder={this.props.Accounts_EmailOrUsernamePlaceholder || 'Email or username'}
                />
                <TextInput
                    ref={(e) => { this.password = e; }}
                    style={styles.input_white}
                    onChangeText={password => this.setState({ password })}
                    secureTextEntry
                    autoCorrect={false}
                    returnKeyType='done'
                    autoCapitalize='none'
                    underlineColorAndroid='transparent'
                    onSubmitEditing={this.submit}
                    placeholder={this.props.Accounts_PasswordPlaceholder || 'Password'}
                />

                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this.submit}
                >
                    <Text style={styles.button} accessibilityTraits='button'>LOGIN</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
