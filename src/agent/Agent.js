import React, { Component } from 'react';
import Store from '../ApplicationStore';
import AgentDashboard from "./AgentDashboard";

class Agent extends Component {
    render() {
        return (
            <div>
                <AgentDashboard/>
            </div>
        );
    }
}

export default Store.withStore(Agent);
