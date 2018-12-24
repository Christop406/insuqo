import React, { Component } from 'react';
import Store from '../ApplicationStore';
import Begin from './panes/begin';
import Personal from './panes/personal';
import Plan from './panes/plan';
import Confirm from './panes/confirm';
import {Box} from "grommet";
import {Redirect, Route, Switch} from "react-router-dom";

class Quote extends Component {

    componentDidMount = () => {
        if(this.props.store) {
            if(this.props.match.path !== '/quote/begin' && this.props.store.state.started === false) {
                //this.props.history.push("/quote/begin");
            }
        }
    };

    render = () => (
            <Box align="center">
                <Box /*elevation="xlarge"*/ round={true} pad="large" truncate={true}>
                    <Switch>
                        <Route path={this.props.match.path + "/begin"} component={Begin}/>
                        <Route path={this.props.match.path + "/personal"} component={Personal}/>
                        <Route path={this.props.match.path + "/plan"} component={Plan}/>
                        <Route path={this.props.match.path + "/confirm"} component={Confirm}/>
                        <Redirect to="/quote/begin"/>
                    </Switch>
                </Box>
            </Box>
        );
}

export default Store.withStore(Quote);