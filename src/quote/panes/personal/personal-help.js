import React, { Component } from 'react';
import {Box} from "grommet";
import weather from "../../../img/weather.png";

export default class PersonalHelp extends Component {
    render() {
        return (
            <Box style={{backgroundImage: "url(" + weather + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}} fill>
            </Box>
        );
    }
}