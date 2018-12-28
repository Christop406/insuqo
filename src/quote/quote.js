import React, { Component } from 'react';
import Store from '../ApplicationStore';
import Begin from './panes/begin/begin';
import Personal from './panes/personal/personal';
import Plan from './panes/plan/plan';
import Results from './panes/results/results';
import {Box} from "grommet";
import {Redirect, Route, Switch} from "react-router-dom";
import QuoteHelp from "./quote-help";

class Quote extends Component {

    componentDidMount = () => {
        if(this.props.store) {
            if(this.props.match.path !== '/iq/quote/begin' && this.props.store.state.started === false) {
                //this.props.history.push("/iq/quote/begin");
            }
        }
    };

    getAlignment = () => {
        console.log(this.props.location.pathname);
        console.log(this.props.location.pathname === "/iq/quote/results");
        if(this.props.location.pathname === "/iq/quote/results") return 'start';
        return 'start';
    };

    render = () => {
        return (
            <Box direction="row" fill="horizontal">
                <Box className="form-content" alignSelf="stretch" fill={true} align={this.getAlignment()}>
                    <Box align="center">
                        <Box /*elevation="xlarge"*/ round={false}
                                                    style={{overflowY: 'scroll', WebkitOverflowScrolling: 'touch'}}
                                                    pad="large" truncate={false}>
                            <Switch>
                                <Route path={this.props.match.path + "/begin"} component={Begin}/>
                                <Route path={this.props.match.path + "/personal"} component={Personal}/>
                                <Route path={this.props.match.path + "/plan"} component={Plan}/>
                                <Route path={this.props.match.path + "/results"} component={Results}/>
                                <Redirect to="/iq/quote/begin"/>
                            </Switch>
                        </Box>
                    </Box>
                </Box>
                <Box className="hideOnSmallScreens" alignSelf="stretch" fill={true}>
                    <Switch>
                        <Route path="/iq/quote" component={QuoteHelp}/>
                    </Switch>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(Quote);