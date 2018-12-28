import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import BeginHelp from './panes/begin/begin-help';
import PersonalHelp from './panes/personal/personal-help';
import PlanHelp from './panes/plan/plan-help';
import ResultsHelp from "./panes/results/results-help";
import {Box} from "grommet";

class QuoteHelp extends Component {
    render() {
        return (
            <Box fill="horizontal">
                <Switch>
                    <Route path={this.props.match.path + "/begin"} component={BeginHelp}/>
                    <Route path={this.props.match.path + "/personal"} component={PersonalHelp}/>
                    <Route path={this.props.match.path + "/plan"} component={PlanHelp}/>
                    <Route path={this.props.match.path + "/results"} component={ResultsHelp}/>
                </Switch>
            </Box>
        );
    }
}

export default QuoteHelp;