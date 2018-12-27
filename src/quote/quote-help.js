import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import BeginHelp from './panes/begin/begin-help';
import PersonalHelp from './panes/personal/personal-help';

class QuoteHelp extends Component {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.path + "/begin"} component={BeginHelp}/>
                <Route path={this.props.match.path + "/personal"} component={PersonalHelp}/>
            </Switch>
        );
    }
}

export default QuoteHelp;