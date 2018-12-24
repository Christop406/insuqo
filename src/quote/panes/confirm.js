import React, { Component } from 'react';
import Store from '../../ApplicationStore';

class Confirm extends Component {
    render = () => {
        return <div>Confirm</div>;
    };
}

export default Store.withStore(Confirm);