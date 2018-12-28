import React, { Component } from 'react';
import Store from '../ApplicationStore';
import Begin from './panes/begin/begin';
import Personal from './panes/personal/personal';
import Plan from './panes/plan/plan';
import Results from './panes/results/results';
import {Box} from "grommet";
import {Redirect, Route, Switch} from "react-router-dom";

class Quote extends Component {

    componentDidMount = () => {
        if(this.props.store) {
            if(this.props.match.path !== '/iq/quote/begin' && this.props.store.state.started === false) {
                //this.props.history.push("/iq/quote/begin");
            }
        }
    };

    render = () => (
            <Box align="center">
                <Box /*elevation="xlarge"*/ round={false} style={{overflowY: 'scroll', "-webkit-overflow-scrolling": 'touch'}} pad="large" truncate={false}>
                    <Switch>
                        <Route path={this.props.match.path + "/begin"} component={Begin}/>
                        <Route path={this.props.match.path + "/personal"} component={Personal}/>
                        <Route path={this.props.match.path + "/plan"} component={Plan}/>
                        <Route path={this.props.match.path + "/results"} component={Results}/>
                        <Redirect to="/iq/quote/begin"/>
                    </Switch>
                </Box>
            </Box>
        );
}

export default Store.withStore(Quote);