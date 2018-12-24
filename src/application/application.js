/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from 'react';
import Store from '../ApplicationStore';

class Application extends Component {
    render = () => {
        return(
            <div>//TODO: Implement Application</div>
        );
    };
}

export default Store.withStore(Application);