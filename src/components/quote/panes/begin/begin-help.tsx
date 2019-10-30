import React from 'react';
import {Box} from "grommet";
import food from '../../../../assets/img/food.png';

const BeginHelp: React.FunctionComponent = () => {
    return (
        <Box animation="fadeIn"
             style={{backgroundImage: "url(" + food + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}}
             fill>
        </Box>
    );
};

export default BeginHelp;
