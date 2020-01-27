import React from 'react';
import weather from "../../../../assets/img/weather.png";

const PersonalHelp: React.FunctionComponent = () => {
    return (
        <div style={{
            backgroundImage: "url(" + weather + ")",
            backgroundRepeat: 'repeat',
            width: '100%',
            height: '100%'
        }}>
        </div>
    );
};

export default PersonalHelp;
