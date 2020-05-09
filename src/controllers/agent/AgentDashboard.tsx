import React, { Component } from 'react';
import { Store as S } from 'undux';
import IQStore from 'store/IQStore';

interface IAgentDashboardProps {
    store: S<any>;
}

class AgentDashboard extends Component<IAgentDashboardProps> {
    render() {
        return(
            <div>Agent Dashboard</div>
        );
    }
}

export default IQStore.withStore(AgentDashboard);
