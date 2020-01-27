import React from 'react';
import newYear from "../../../../assets/img/new-year.png";

const PlanHelp: React.FunctionComponent = () => {
    return (
        <div style={{
            backgroundImage: "url(" + newYear + ")",
            backgroundRepeat: 'repeat',
            width: '100%',
            height: '100%'
        }}>
        </div>
    );
};

export default PlanHelp;
