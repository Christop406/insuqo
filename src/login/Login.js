import React, { Component } from 'react';
import Store from '../ApplicationStore';

class Login extends Component {
    render() {
        return (
            <div>
                Login Page.
            </div>
        );
    }
}

export default Store.withStore(Login);
