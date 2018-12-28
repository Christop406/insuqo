import React, { Component } from 'react';
import {Box} from "grommet";
import newYear from "../../../img/new-year.png";

export default class PlanHelp extends Component {
    render() {
        return (
            <Box style={{backgroundImage: "url(" + newYear + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}} fill>
            </Box>
        );
    }
}