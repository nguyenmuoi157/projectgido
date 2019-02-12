import Ddp from './ddp';
import { hashPassword } from 'react-native-meteor/lib/utils';
const TOKEN_KEY = 'reactnativemeteor_usertoken';
const SERVER_TIMEOUT = 30000;
const Rocket = {
    TOKEN_KEY,
    async testServer(url) {
        if (/^(https?:\/\/)?(((\w|[0-9-_])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(url)) {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.status === 200 && response.headers.get('x-instance-id') != null && response.headers.get('x-instance-id').length) {
                return url;
            }
        }
        throw new Error({ error: 'invalid server' });
    },
    reconnect() {
        if (this.ddp) {
            this.ddp.reconnect();
        }
    },
    connect(url) {
        if (this.ddp) {
            this.ddp.disconnect();
        }
        this.ddp = new Ddp(url);
        this.ddp.on('disconnected_by_user', () => {
            //reduxStore.dispatch(disconnect_by_user());
            console.log('disconnected_by_user');
        });
        this.ddp.on('disconnected', () => {
            //reduxStore.dispatch(disconnect());
            console.log('disconnected');
        });
        this.ddp.on('open', async () => {
            // resolve(reduxStore.dispatch(connectSuccess()));
            console.log('open');
        });
        this.ddp.on('connected', () => {
            // RocketChat.getSettings();
            // RocketChat.getPermissions();
            // RocketChat.getCustomEmoji();
            console.log('connected');
        });

        this.ddp.on('error', (err) => {
            alert(JSON.stringify(err));
            //reduxStore.dispatch(connectFailure());
        });

        this.ddp.on('connected', () => this.ddp.subscribe('activeUsers', null, false));

        this.ddp.on('users', (ddpMessage) => {
            // if (ddpMessage.collection === 'users') {
            // 	return RocketChat._setUser(ddpMessage);
            // }
            console.log("user");
        });

        this.ddp.on('stream-room-messages', (ddpMessage) => {
            // const message = this._buildMessage(ddpMessage.fields.args[0]);
            // return reduxStore.dispatch(roomMessageReceived(message));
        });

        this.ddp.on('stream-notify-room', (ddpMessage) => {
            // const [_rid, ev] = ddpMessage.fields.eventName.split('/');
            // if (ev !== 'typing') {
            // 	return;
            // }
            // return reduxStore.dispatch(someoneTyping({ _rid, username: ddpMessage.fields.args[0], typing: ddpMessage.fields.args[1] }));
            console.log('co tin nhan den stream-notify-room');
        });

        this.ddp.on('stream-notify-user', (ddpMessage) => {
            // const [type, data] = ddpMessage.fields.args;
            // const [, ev] = ddpMessage.fields.eventName.split('/');
            // if (/subscriptions/.test(ev)) {
            // 	if (data.roles) {
            // 		data.roles = data.roles.map(role => ({ value: role }));
            // 	}
            // 	database.write(() => {
            // 		database.create('subscriptions', data, true);
            // 	});
            // }
            // if (/rooms/.test(ev) && type === 'updated') {
            // 	const sub = database.objects('subscriptions').filtered('rid == $0', data._id)[0];
            // 	database.write(() => {
            // 		sub.roomUpdatedAt = data._updatedAt;
            // 		sub.ro = data.ro;
            // 	});
            // }
            console.log('co tin nhan den stream-notify-user');
        });

        // return new Promise((resolve) => {
        //     this.ddp.on('disconnected_by_user', () => {
        //         //reduxStore.dispatch(disconnect_by_user());
        //         console.log('disconnected_by_user');
        //     });
        //     this.ddp.on('disconnected', () => {
        //         //reduxStore.dispatch(disconnect());
        //         console.log('disconnected');
        //     });
        //     this.ddp.on('open', async () => {
        //         // resolve(reduxStore.dispatch(connectSuccess()));
        //         console.log('open');
        //     });
        //     this.ddp.on('connected', () => {
        //         // RocketChat.getSettings();
        //         // RocketChat.getPermissions();
        //         // RocketChat.getCustomEmoji();
        //         console.log('connected');
        //     });

        //     this.ddp.on('error', (err) => {
        //         alert(JSON.stringify(err));
        //         //reduxStore.dispatch(connectFailure());
        //     });

        //     this.ddp.on('connected', () => this.ddp.subscribe('activeUsers', null, false));

        //     this.ddp.on('users', (ddpMessage) => {
        //         // if (ddpMessage.collection === 'users') {
        //         // 	return RocketChat._setUser(ddpMessage);
        //         // }
        //         console.log("user");
        //     });

        //     this.ddp.on('stream-room-messages', (ddpMessage) => {
        //         // const message = this._buildMessage(ddpMessage.fields.args[0]);
        //         // return reduxStore.dispatch(roomMessageReceived(message));
        //     });

        //     this.ddp.on('stream-notify-room', (ddpMessage) => {
        //         // const [_rid, ev] = ddpMessage.fields.eventName.split('/');
        //         // if (ev !== 'typing') {
        //         // 	return;
        //         // }
        //         // return reduxStore.dispatch(someoneTyping({ _rid, username: ddpMessage.fields.args[0], typing: ddpMessage.fields.args[1] }));
        //         console.log('co tin nhan den stream-notify-room');
        //     });

        //     this.ddp.on('stream-notify-user', (ddpMessage) => {
        //         // const [type, data] = ddpMessage.fields.args;
        //         // const [, ev] = ddpMessage.fields.eventName.split('/');
        //         // if (/subscriptions/.test(ev)) {
        //         // 	if (data.roles) {
        //         // 		data.roles = data.roles.map(role => ({ value: role }));
        //         // 	}
        //         // 	database.write(() => {
        //         // 		database.create('subscriptions', data, true);
        //         // 	});
        //         // }
        //         // if (/rooms/.test(ev) && type === 'updated') {
        //         // 	const sub = database.objects('subscriptions').filtered('rid == $0', data._id)[0];
        //         // 	database.write(() => {
        //         // 		sub.roomUpdatedAt = data._updatedAt;
        //         // 		sub.ro = data.ro;
        //         // 	});
        //         // }
        //         console.log('co tin nhan den stream-notify-user');
        //     });
        // });
    },
    me({ server, token, userId }) {
        return fetch(`${server}/api/v1/me`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token,
                'X-User-Id': userId
            }
        }).then(response => response.json());
    },
    userInfo({ server, token, userId }) {
        return fetch(`${server}/api/v1/users.info?userId=${userId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token,
                'X-User-Id': userId
            }
        }).then(response => response.json());
    },
    loginWithPassword({ username, password }) {
        return this.ddp.call("login", {
            user: {
                username: username
            },
            password: hashPassword(password)
        });

    },
    loginWithAuthenticationToken(authtoken) {
        return this.ddp.call("login", {
            resume: authtoken
        });
    },
    subscribe(name, ...params) {
        return this.ddp.subscribe(name, ...params);
    },
    emitTyping(room, t = true, username) {
        // const { login } = reduxStore.getState();
        return call('stream-notify-room', `${room}/typing`, username, t);
    },
    async _sendMessageCall({ _id, rid, msg }) {
        return call('sendMessage', { _id, rid, msg });
    },
    async sendMessage(rid, msg) {
        // const tempMessage = this.getMessage(rid, msg);
        // return RocketChat._sendMessageCall(tempMessage);
    },
    loadMessagesForRoom(rid, end, cb) {
        return this.ddp.call('loadHistory', rid, end, 20)
        // .then((data) => {
        //     if (data && data.messages.length) {
        //         const messages = data.messages.map(message => this._buildMessage(message));
        //         // database.write(() => {
        //         // 	messages.forEach((message) => {
        //         // 		database.create('messages', message, true);
        //         // 	});
        //         // });
        //     }
        //     if (cb) {
        //         cb({ end: data && data.messages.length < 20 });
        //     }
        //     return data.message;
        // }, (err) => {
        //     if (err) {
        //         if (cb) {
        //             cb({ end: true });
        //         }
        //         return Promise.reject(err);
        //     }
        // });
    },
    _buildMessage(message) {
        message.status = messagesStatus.SENT;
        message.attachments = message.attachments || [];
        if (message.urls) {
            message.urls = RocketChat._parseUrls(message.urls);
        }
        // loadHistory returns message.starred as object
        // stream-room-messages returns message.starred as an array
        message.starred = message.starred && (Array.isArray(message.starred) ? message.starred.length > 0 : !!message.starred);
        message.reactions = _.map(message.reactions, (value, key) =>
            ({ emoji: key, usernames: value.usernames.map(username => ({ value: username })) }));
        return message;
    },
    async getRoom() {
        let [subscriptions, rooms] = await Promise.all([this.ddp.call('subscriptions/get', 0), this.ddp.call('rooms/get', 0)]);
        const data = subscriptions.map((subscription) => {
            const room = rooms.find(({ _id }) => _id === subscription.rid);
            if (room) {
                subscription.roomUpdatedAt = room._updatedAt;
                subscription.ro = room.ro;
                subscription.lastMessage = room.lastMessage.msg;
            }
            if (subscription.roles) {
                subscription.roles = subscription.roles.map(role => ({ value: role }));
            }
            return subscription;
        });

        data.sort((a, b) => {
            return b.roomUpdatedAt - a.roomUpdatedAt
        })
        return data;
        // this.setState({
        //     DataList: data
        // });
    }

}

export default Rocket;