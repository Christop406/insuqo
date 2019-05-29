import React, { Component } from 'react';
import Store from '../ApplicationStore';
import {Anchor, Box, Button, Image, Text, TextInput} from "grommet";
import logo from '../img/insuqo-logo.png';
import {login} from "../api";
import constants from '../util/constants';

class ClientLogin extends Component {

    state = {
        email: '',
        password: ''
    };

    componentDidMount() {
        document.title = "Login | INSUQO";
    }

    login = () => {
        console.log('logging in');
        login(constants.userTypes.client, this.state.email, this.state.password).then(res => {
            console.log(JSON.stringify(res));
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
            <Box style={{height: "100vh"}} justify="center" fill>
                <Box pad="medium" justify="center" alignContent="center">
                    <Box background={{color: 'white'}}
                         style={{width: '100%', maxWidth: 400}}
                         pad="small"
                         alignSelf="center"
                         justify="center">
                        <Box style={{maxHeight: 80, minHeight: 40}}>
                            <Image src={logo} fit="contain"/>
                        </Box>
                        <Box style={{textAlign: 'center'}}>
                            <Text weight="bold">User Portal</Text>
                        </Box>
                        <Box pad="small" style={{minHeight: 166}}>
                            <Text>Email</Text>
                            <TextInput onChange={this.updateEmail} placeholder="jsmith@example.com" id="emailInput"/>
                            <span style={{height: 10}}/>
                            <Text>Password</Text>
                            <TextInput onChange={this.updatePassword} type="password" placeholder="*******" id="passwordInput"/>
                        </Box>
                        <Box pad="xsmall" style={{textAlign: 'center'}}>
                            <Button onClick={this.login} margin="xsmall" className="purpleBackground purpleOutline" primary label="Login"/>
                            <Button onClick={() => window.location.href = "https://insuqo.com/"} margin="xsmall" className="purpleOutline" label="Cancel"/>
                            <Anchor className="purpleText" margin="xsmall" size="small" label="Forgot My Password"/>
                            <Anchor className="purpleText" href="/agent/login" size="small" label="Agent Login"/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(ClientLogin);
