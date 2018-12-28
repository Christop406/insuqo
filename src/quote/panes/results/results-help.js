import React, { Component } from 'react';
import {Box} from "grommet";
import school from "../../../img/school.png";

export default class ResultsHelp extends Component {
    render() {
        return (
            <Box style={{backgroundImage: "url(" + school + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}} fill>
            </Box>
        );
    }
}