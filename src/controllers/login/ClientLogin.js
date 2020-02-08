import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import {login} from '../../api';
import constants from '../../util/constants';
import './ClientLogin.scss';
import {ClientAuthentication} from '../sign-up/ClientAuthentication';
import { Logger } from '../../services/logger';

class ClientLogin extends Component {

    state = {
        email: '',
        password: ''
    };

    componentDidMount() {
        document.title = 'Login | INSUQO';
    }

    login = () => {
        Logger.debug('logging in');
        login(constants.userTypes.client, this.state.email, this.state.password).then(res => {
            console.log(res.data);
            localStorage.setItem('lt', res.data.data.tok);
            sessionStorage.setItem('usr', JSON.stringify(res.data.data.user));
            this.props.history.push('/client');
        });
    };

    updateEmail = (event) => {
        this.setState({email: event.target.value});
    };

    updatePassword = (event) => {
        this.setState({password: event.target.value});
    };

    render() {
        return (
            <div>
                <ClientAuthentication type="login" onAuthenticate={(usr) => Logger.log(usr)}/>
            </div>
        );
    }
}

export default Store.withStore(ClientLogin);
