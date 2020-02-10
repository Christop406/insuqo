import React, { Component, Suspense } from 'react';
import Store from './ApplicationStore';
import Quote from './controllers/quote/Quote';
// import AppStatus from './controllers/application-status/application-status';
import { fadeInUpBig } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import { Box, Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { Route, Switch, Redirect } from 'react-router-dom';
import img from './assets/img/insuqo-logo.png';
import s from './Main.module.scss';
const { ClientAuthentication } = React.lazy(() => import('./controllers/agent/Agent'));
const Agent = React.lazy(() => import('./controllers/agent/Agent'));
const ClientLogin = React.lazy(() => import('./controllers/login/ClientLogin'));
const Client = React.lazy(() => import('./controllers/client/Client'));
const Application = React.lazy(() => import('./controllers/application/Application'));

const styles = {
    fadeInUpBig: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInUpBig, 'fadeInUpBig')
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
        return (
            <StyleRoot>
                <Grommet theme={grommet}>
                    <Box style={{ height: '100%' }} fill>
                        <Switch>
                            <Route path="/register" component={ClientAuthentication} />
                            <Route path="/client/login" component={() => <Suspense fallback={<div></div>}><ClientLogin /></Suspense>} />
                            <Redirect path="/login" to="/client/login" />
                            <Route component={QuotingTool} />
                        </Switch>
                    </Box>
                </Grommet>
            </StyleRoot>
        );
    };
}

class QuotingTool extends Component {
    render() {
        return (
            <div className={s.quotingToolContainer}>
                <nav className={s.topNav}>
                    <Box fill style={{ backgroundColor: 'white' }}>
                        <img src={img} alt="iq-logo" style={styles.mainLogo} />
                    </Box>
                </nav>
                <div className={s.quoteFormContainer}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route path="/client" component={Client} />
                            <Route path="/agent" component={Agent} />
                            <Route path="/application/:appId" component={Application} />
                            <Route exact path="/application" component={Application} />
                            <Route path="/quote" component={Quote} />
                            <Redirect to="/quote" />
                        </Switch>
                    </Suspense>
                </div>
            </div>
        );
    }
}

export default Store.withStore(Main);
