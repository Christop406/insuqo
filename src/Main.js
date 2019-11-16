import React, { Component }  from 'react';
import Store from './ApplicationStore';
import Quote  from './controllers/quote/Quote';
import Application from './controllers/application/Application';
import AppStatus from './controllers/application-status/application-status';
import { fadeInUpBig } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import {Box, Grommet} from 'grommet';
import { grommet } from 'grommet/themes';
import { Route, Switch, Redirect } from 'react-router-dom';
import img from './assets/img/insuqo-logo.png';
import {fillStoreFromLocalStorage} from './func';
import Agent from './controllers/agent/Agent';
import Client from './controllers/client/Client';
import ClientLogin from './controllers/login/ClientLogin';
import {ClientAuthentication} from './controllers/sign-up/ClientAuthentication';
// import AgentLogin from "./controllers/login/AgentLogin";

const styles = {
    fadeInUpBig: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInUpBig, 'fadeInUpBig')
    },
    topNav: {
        width: '100%',
        height: '70px',
        position: 'fixed',
        zIndex: 100
    },
    mainLogo: {
        float: 'left',
        width: '200px',
        marginTop: '5px'
    }
};


class Main extends Component {
    componentDidMount = () => {
        // var store = this.props.store;
        // fillStoreFromLocalStorage(store).then(() => {
        //     this.forceUpdate();
        // }, rejected => {
        //     this.props.history.push("/quote");
        // });
        //
        // store.onAll().subscribe(({key, value}) => {
        //     localStorage.setItem("store_persisted", "true");
        //     localStorage.setItem("quotes_ran", "false");
        //     // console.log('persisting', key, value);
        //     localStorage.setItem(key, value);
        // });

    };

    render = () => {
        return(
            <StyleRoot>
                <Grommet theme={grommet}>
                    <Box style={{height: '100%'}} fill>
                        <Switch>
                            <Route path="/register" component={ClientAuthentication}/>
                            <Route path="/client/login" component={ClientLogin}/>
                            {/*<Route path="/agent/login" component={AgentLogin}/>*/}
                            <Redirect path="/login" to="/client/login"/>
                            <Route component={QuotingTool}/>
                        </Switch>
                    </Box>
                </Grommet>
            </StyleRoot>
        )
    };
}

class QuotingTool extends Component {
    render() {
        return (
            <Box style={{height: '100%'}} fill={true} /*animation="fadeIn"*/>
                <nav style={styles.topNav}>
                    <Box fill style={{backgroundColor: 'white'}}>
                        <img src={img} alt="iq-logo" style={styles.mainLogo}/>
                    </Box>
                </nav>
                <Box className="quote-form-content" style={{paddingTop: 70}} direction="row" fill="horizontal">
                    <Switch>
                        <Route path="/client" component={Client}/>
                        <Route path="/agent" component={Agent}/>
                        <Route path="/application/status" component={AppStatus}/>
                        <Route exact path="/app" component={Application}/>
                        <Route exact path="/application" component={Application}/>
                        <Route path="/quote" component={Quote}/>
                        <Redirect to="/quote"/>
                    </Switch>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(Main);
