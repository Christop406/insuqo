import React, { Component } from 'react';
import AgentDashboard from './AgentDashboard';
import {Store as S } from 'undux';
import IQStore from 'store/IQStore';

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

export default IQStore.withStore(Agent);
