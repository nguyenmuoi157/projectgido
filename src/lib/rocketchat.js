import Ddp from './ddp';
import { hashPassword } from 'react-native-meteor/lib/utils';
import Random from 'react-native-meteor/lib/Random';
const call = (method, ...params) => RocketChat.ddp.call(method, ...params); // eslint-disable-line
const TOKEN_KEY = 'reactnativemeteor_usertoken';
const SERVER_TIMEOUT = 30000;
const RocketChat = {
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
    _setUser(ddpMessage) {
		let status;
		if (!ddpMessage.fields) {
			status = 'offline';
		} else {
			status = ddpMessage.fields.status || 'offline';
		}

		// const { user } = reduxStore.getState().login;
		// if (user && user.id === ddpMessage.id) {
		// 	//return reduxStore.dispatch(setUser({ status }));
		// }

		const activeUser = {};
		activeUser[ddpMessage.id] = status;
		//return reduxStore.dispatch(requestActiveUser(activeUser));
    },
    reconnect() {
		if (this.ddp) {
			this.ddp.reconnect();
		}
    },
    connect(url) {
			debugger;
		if (this.ddp) {
			this.ddp.disconnect();
		}
		this.ddp = new Ddp(url);
		return new Promise((resolve) => {
			this.ddp.on('disconnected_by_user', () => {
				//reduxStore.dispatch(disconnect_by_user());
			});
			this.ddp.on('disconnected', () => {
				//reduxStore.dispatch(disconnect());
			});
			this.ddp.on('open', async() => {
				// resolve(reduxStore.dispatch(connectSuccess()));
			});
			this.ddp.on('connected', () => {
				// RocketChat.getSettings();
				// RocketChat.getPermissions();
				// RocketChat.getCustomEmoji();
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
			});
		});
    },
    me({ server, token, userId }) {
		return fetch(`${ server }/api/v1/me`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': token,
				'X-User-Id': userId
			}
		}).then(response => response.json());
	},

	userInfo({ server, token, userId }) {
		return fetch(`${ server }/api/v1/users.info?userId=${ userId }`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': token,
				'X-User-Id': userId
			}
		}).then(response => response.json());
    },
    loginWithPassword({ username, password, code }, callback) {
			debugger;
		let params = {};
		// const state = reduxStore.getState();

		// if (state.settings.LDAP_Enable) {
		// 	params = {
		// 		ldap: true,
		// 		username,
		// 		ldapPass: password,
		// 		ldapOptions: {}
		// 	};
		// } else if (state.settings.CROWD_Enable) {
		// 	params = {
		// 		crowd: true,
		// 		username,
		// 		crowdPassword: password
		// 	};
		// } else {
		// 	params = {
		// 		password: hashPassword(password),
		// 		user: {
		// 			username
		// 		}
		// 	};

		// 	if (typeof username === 'string' && username.indexOf('@') !== -1) {
		// 		params.user = { email: username };
		// 	}
		// }

		// ----------------
		params = {
			password: hashPassword(password),
			user: {
				username
			}
		};

		if (typeof username === 'string' && username.indexOf('@') !== -1) {
			params.user = { email: username };
		}

		// ----------------------
		if (code) {
			params = {
				totp: {
					login: params,
					code
				}
			};
		}

		return this.login(params, callback);
    },
    disconnect() {
		if (!this.ddp) {
			return;
		}
		//reduxStore.dispatch(disconnect_by_user());
		delete this.ddp;
		return this.ddp.disconnect();
		},
		
    login(params, callback) {
		return this.ddp.call('login', params).then((result) => {
			if (typeof callback === 'function') {
				callback(null, result);
			}
			return result;
		}, (err) => {
			if (/user not found/i.test(err.reason)) {
				err.error = 1;
				err.reason = 'User or Password incorrect';
				err.message = 'User or Password incorrect';
			}
			if (typeof callback === 'function') {
				callback(err, null);
			}
			return Promise.reject(err);
		});
    },
    getRoom(rid) {
		// const result = database.objects('subscriptions').filtered('rid = $0', rid);
		// if (result.length === 0) {
		// 	return Promise.reject(new Error('Room not found'));
		// }
		// return Promise.resolve(result[0]);
    },
    subscribe(...args) {
		return this.ddp.subscribe(...args);
    },
    emitTyping(room, t = true) {
		// const { login } = reduxStore.getState();
		// return call('stream-notify-room', `${ room }/typing`, login.user.username, t);
    },
    async _sendMessageCall(message) {
		const { _id, rid, msg } = message;
		const sendMessageCall = call('sendMessage', { _id, rid, msg });
		const timeoutCall = new Promise(resolve => setTimeout(resolve, SERVER_TIMEOUT, 'timeout'));
		const result = await Promise.race([sendMessageCall, timeoutCall]);
		// if (result === 'timeout') {
		// 	database.write(() => {
		// 		message.status = messagesStatus.ERROR;
		// 		database.create('messages', message, true);
		// 	});
		// }
    },
    async sendMessage(rid, msg) {
		const tempMessage = this.getMessage(rid, msg);
		return RocketChat._sendMessageCall(tempMessage);
	},
	async resendMessage(messageId) {
		// const message = await database.objects('messages').filtered('_id = $0', messageId)[0];
		// database.write(() => {
		// 	message.status = messagesStatus.TEMP;
		// 	database.create('messages', message, true);
		// });
		// return RocketChat._sendMessageCall(message);
    },
    loadMessagesForRoom(rid, end, cb) {
		return this.ddp.call('loadHistory', rid, end, 20).then((data) => {
			if (data && data.messages.length) {
				const messages = data.messages.map(message => this._buildMessage(message));
				// database.write(() => {
				// 	messages.forEach((message) => {
				// 		database.create('messages', message, true);
				// 	});
				// });
			}
			if (cb) {
				cb({ end: data && data.messages.length < 20 });
			}
			return data.message;
		}, (err) => {
			if (err) {
				if (cb) {
					cb({ end: true });
				}
				return Promise.reject(err);
			}
		});
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
}

export default RocketChat;