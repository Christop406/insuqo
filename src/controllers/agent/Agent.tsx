import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import AgentDashboard from "./AgentDashboard";
import {Store as S } from 'undux';

interface IAgentProps {
    store: S<any>;
}

class Agent extends Component<IAgentProps> {
    render() {
        return (
            <div>
                <AgentDashboard/>
            </div>
        );
    }
}

export default Store.withStore(Agent);
