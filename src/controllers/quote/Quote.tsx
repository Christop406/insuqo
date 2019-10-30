import React, {Component} from 'react';
import Store from '../../ApplicationStore';
import Begin from '../../components/quote/panes/begin/begin';
import Personal from '../../components/quote/panes/personal/personal';
import Plan from '../../components/quote/panes/plan/plan';
import Results from '../../components/quote/panes/results/results';
import {Box} from "grommet";
import {Redirect, Route, Switch} from "react-router-dom";
import QuoteHelp from "../../components/quote/quote-help";
import './Quote.scss';

class Quote extends Component<any, any> {

    componentDidMount = () => {
        document.title = "Quote | INSUQO";
        if (this.props.store) {
            if (this.props.match.path !== '/quote/begin' && !this.props.store.state.started) {
                //this.props.history.push("/iq/quote/begin");
            }
        }
    };

    getAlignment = () => {
        return 'start';
    };

    render = () => {
        return (
            <Box direction="row" style={{height: "100%"}} fill="horizontal">
                <Box className="form-content" alignSelf="stretch" fill={true} align={this.getAlignment() as any}>
                    <Box align="center" fill>
                        <Box round={false} className="quote-container"
                             style={{}}
                             pad="large" fill>
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
