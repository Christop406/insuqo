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
            if(this.props.match.path !== '/quote/begin' && this.props.store.state.started === false) {
                //this.props.history.push("/iq/quote/begin");
            }
        }
    };

    getAlignment = () => {
        if(this.props.location.pathname === "/quote/results") return 'start';
        return 'start';
    };

    render = () => {
        return (
            <Box direction="row" style={{height: "100%"}} fill="horizontal">
                <Box className="form-content" alignSelf="stretch" fill={true} align={this.getAlignment()}>
                    <Box align="center" fill>
                        <Box /*elevation="xlarge"*/ round={false}
                                                    style={{WebkitOverflowScrolling: 'touch'}}
                                                    pad="large" truncate={false} fill>
                            <Switch>
                                <Route path={this.props.match.path + "/begin"} component={Begin}/>
                                <Route path={this.props.match.path + "/personal"} component={Personal}/>
                                <Route path={this.props.match.path + "/plan"} component={Plan}/>
                                <Route path={this.props.match.path + "/results"} component={Results}/>
                                <Redirect to="/quote/begin"/>
                            </Switch>
                        </Box>
                    </Box>
                </Box>
                <Box className="hideOnSmallScreens" style={{height: '100%'}} alignSelf="stretch" fill={true}>
                    <Switch>
                        <Route path="/quote" component={QuoteHelp}/>
                    </Switch>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(Quote);
