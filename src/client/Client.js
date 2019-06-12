import React, { Component } from 'react';
import Store from '../ApplicationStore';
import ClientDashboard from "./ClientDashboard";
import {Route, Switch} from "react-router-dom";
import {getUserInfo} from "../api";
import constants from "../util/constants";

class Client extends Component {

    state = {
        clientInfo: {}
    };

    componentDidMount() {
        getUserInfo(constants.userTypes.client).then(res => {
            if(res.status === 200) {
                res = res.data;
                this.setState({clientInfo: res.data.user});
            } else {
                this.props.history.push("/client/login");
            }
        });
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route component={(props) => <ClientDashboard {...props} client={this.state.clientInfo} />}/>
                </Switch>
            </div>
        );
    }
}

export default Store.withStore(Client);
