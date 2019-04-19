import React, { Component } from 'react';
import Store from '../ApplicationStore';
import {Anchor, Box, Button, Image, Text, TextInput} from "grommet";
import background from '../img/li-bg.svg';

import logo from '../img/insuqo-logo.png';

class Login extends Component {

    state = {
        email: '',
        password: ''
    };

    render() {
        return (
            <Box style={{height: "100vh"}} justify="center" fill>
                <Box pad="medium" justify="center" alignContent="center">
                    <Box background={{color: 'white'}}
                         style={{width: '100%', maxWidth: 400}}
                         round="small"
                         pad="small"
                         alignSelf="center"
                         justify="center">
                        <Box style={{maxHeight: 80}}>
                            <Image src={logo} fit="contain"/>
                        </Box>
                        <Box style={{textAlign: 'center'}}>
                            <Text>User Log-In</Text>
                        </Box>
                        <Box pad="small" margin="none">
                            <Text>Email</Text>
                            <TextInput placeholder="jsmith@example.com" id="emailInput"/>
                            <span style={{height: 10}}/>
                            <Text>Password</Text>
                            <TextInput type="password" placeholder="*******" id="passwordInput"/>
                        </Box>
                        <Box pad="xsmall" style={{textAlign: 'center'}}>
                            <Button className="purpleBackground purpleOutline" primary label="Login"/>
                            <Anchor margin="xsmall" size="small" label="Forgot My Password"/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(Login);
