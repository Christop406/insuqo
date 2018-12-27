import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import BeginHelp from './panes/begin/begin-help';
import PersonalHelp from './panes/personal/personal-help';
import PlanHelp from './panes/plan/plan-help';

class QuoteHelp extends Component {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.path + "/begin"} component={BeginHelp}/>
                <Route path={this.props.match.path + "/personal"} component={PersonalHelp}/>
                <Route path={this.props.match.path + "/plan"} component={PlanHelp}/>
            </Switch>
        );
    }
}

export default QuoteHelp;