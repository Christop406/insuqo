import React, {Component} from 'react';
import {Box} from "grommet";
import school from "../../../../assets/img/school.png";

const ResultsHelp = () => {
    return (
        <Box
            style={{backgroundImage: "url(" + school + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}}
            fill>
        </Box>
    );
};

export default ResultsHelp;
