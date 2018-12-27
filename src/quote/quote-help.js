import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import BeginHelp from './panes/begin/begin-help';

class QuoteHelp extends Component {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.path + "/begin"} component={BeginHelp}/>
            </Switch>
        );
    }
}

export default QuoteHelp;