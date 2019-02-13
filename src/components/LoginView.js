import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard } from 'react-native'
import styles from './Styles';

import Rocket from '../lib/Rocket';

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

    async componentDidMount() {
        let url = this.completeUrl('http://192.168.1.100:4000');
        Rocket.connect(url);
    }

    async submit() {
        try {
            const { username, password } = this.state;
            let userLogin = await Rocket.loginWithPassword({ username: username, password: password });
            if (userLogin) {
                let loginStore = JSON.stringify(userLogin);
                await AsyncStorage.setItem("@userlogin", loginStore);
                Rocket.subscribe("stream-notify-user", `${userLogin.id}/subscriptions-changed`, false);
                Rocket.subscribe("stream-notify-user", `${userLogin.token}/rooms-changed`, false);
                this.props.navigation.navigate('RoomView');
                console.log('login', userLogin);
            }

        } catch (error) {
            console.log(error);
        }
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
                    onPress={() => this.submit()}
                >
                    <Text style={styles.button} accessibilityTraits='button'>LOGIN</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
