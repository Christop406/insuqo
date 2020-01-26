import React from 'react';
import food from '../../../../assets/img/food.png';

const BeginHelp: React.FunctionComponent = () => {
    return (
        <div style={{backgroundImage: "url(" + food + ")", backgroundRepeat: 'repeat', width: '100%', height: '100vh'}}>
        </div>
    );
};

export default BeginHelp;
