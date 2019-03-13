import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import qs from 'query-string';
import {Box, Heading} from "grommet";
import './status.scss';

class AppStatus extends Component {

    state = {
        uuid: '',
        complete: false
    };

    render = () => {
        return (
            <Box style={{height: 'calc(100vh - 70px)'}} fill align="center" justify="center">
                <div style={{height: 200, width: 200, marginBottom: 20}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="path circle" fill="none" stroke="#9c37f2" strokeWidth="6" strokeMiterlimit="10"
                                cx="65.1" cy="65.1" r="62.1"/>
                        <polyline className="path check" fill="none" stroke="#9c37f2" strokeWidth="6"
                                  strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    </svg>
                </div>
                <div style={{textAlign: 'center'}}>
                    <Heading level={1}>Success!</Heading>
                    <Heading level={3} className="submitted-subtitle">Your application is on the way! You can check back at this page at any time for updattes.</Heading>
                </div>
            </Box>
        );
    };

    componentDidMount = () => {
        let query = qs.parse(this.props.location.search);
        let id;
        if(query === undefined || query.id === undefined) {
            if(localStorage.getItem("app_id") === undefined) {
                //this.props.history.push("/login"); // todo - implement
            } else {
                id = localStorage.getItem("app_id");
            }
        } else {
            id = query.id;
        }

        setInterval(() => {this.setState({complete: true})}, 1000);

        this.setState({uuid: id});
    }
}

export default Store.withStore(AppStatus);

/*            <Box margin="small">
                <h1>Your application is on the way!</h1>
                <h2>Application Details</h2>
                <div>Submitted At: </div>
                <div>Your Name: </div>
                <div>Beneficiaries: </div>
                <Box margin="xsmall"/>
                <h3>Plan Info</h3>
                <div>Term Length: </div>
                <div>Coverage: </div>
                <div>Rider: </div>
                <div>Product Name: </div>
                <div>Insurer: </div>
                <div style={{color: "#AAA"}}>id: {uuid}</div>
            </Box>*/