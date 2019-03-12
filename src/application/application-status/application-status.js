import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import qs from 'query-string';
import {Box} from "grommet";
import {getApplication} from "../../api";

class AppStatus extends Component {

    state = {
        uuid: ''
    };

    render = () => {
        const { uuid } = this.state;
        return (
            <Box margin="small">
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
            </Box>
        );
    };

    componentDidMount = () => {
        let query = qs.parse(this.props.location.search);
        let id;
        if(query === undefined || query.id === undefined) {
            if(localStorage.getItem("app_id") === undefined) {
                this.props.history.push("/login"); // todo - implement
            } else {
                id = localStorage.getItem("app_id");
            }
        } else {
            id = query.id;
        }
        this.setState({uuid: id});
        getApplication(id).then(res => {
            console.log(res);
        });
    }
}

export default Store.withStore(AppStatus);