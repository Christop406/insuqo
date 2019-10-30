import React from 'react';
import {Box} from "grommet";
import newYear from "../../../../assets/img/new-year.png";

const PlanHelp: React.FunctionComponent = () => {
    return (
        <Box style={{
            backgroundImage: "url(" + newYear + ")",
            backgroundRepeat: 'repeat',
            width: '100%',
            height: '100vh'
        }} fill>
        </Box>
    );
};

export default PlanHelp;
