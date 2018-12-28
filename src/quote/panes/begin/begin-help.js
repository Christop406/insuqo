import React, { Component } from 'react';
import {Box} from "grommet";
import food from './../../../img/food.png';

class BeginHelp extends Component {
    render() {
        return (
            <Box animation="fadeIn" style={{backgroundImage: "url(" + food + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}} fill>
            </Box>
        );
    }
}

export default BeginHelp;