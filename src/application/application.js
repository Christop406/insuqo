/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from 'react';
import Store from '../ApplicationStore';
import * as qs from 'query-string';

class Application extends Component {
    render = () => {
        return(
            <div>{JSON.stringify(qs.parse(this.props.location.search, {ignoreQueryPrefix: true}))}</div>
        );
    };
}

export default Store.withStore(Application);