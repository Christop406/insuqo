import React from 'react';
import {Box} from "grommet";
import weather from "../../../../assets/img/weather.png";

const PersonalHelp: React.FunctionComponent = () => {
    return (
        <Box style={{
            backgroundImage: "url(" + weather + ")",
            backgroundRepeat: 'repeat',
            width: '100%',
            height: '100vh'
        }} fill>
        </Box>
    );
};

export default PersonalHelp;
