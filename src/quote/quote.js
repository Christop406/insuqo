import React, { Component } from 'react';
import Store from '../ApplicationStore';
import Begin from './panes/begin';
import Personal from './panes/personal';
import {Box} from "grommet";
import {Redirect, Route, Switch} from "react-router-dom";

class Quote extends Component {
    render = () => (
            <Box align="center">
                <Box /*elevation="xlarge"*/ round={true} pad="large" truncate={true}>
                    <Switch>
                        <Route path={this.props.match.path + "/begin"} component={Begin}/>
                        <Route path={this.props.match.path + "/personal"} component={Personal}/>
                        <Redirect to="/quote/begin"/>
                    </Switch>
                </Box>
            </Box>
        );
}

export default Store.withStore(Quote);