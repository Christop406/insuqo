import React, { Component, Suspense } from 'react';
import Store from './ApplicationStore';
import Quote from './controllers/quote/Quote';
// import AppStatus from './controllers/application-status/application-status';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { Route, Switch, Redirect } from 'react-router-dom';
import img from './assets/img/insuqo-logo.png';
import s from './Main.module.scss';
const ClientAuthentication = React.lazy(() => import('./controllers/auth/ClientAuthentication'));
const Agent = React.lazy(() => import('./controllers/agent/Agent'));
const ClientLogin = React.lazy(() => import('./controllers/login/ClientLogin'));
const Client = React.lazy(() => import('./controllers/client/Client'));
const Application = React.lazy(() => import('./controllers/application/Application'));


class Main extends Component {
    render = () => {
        return (
            <Grommet theme={grommet}>
                <Switch>
                    <Route path="/register" component={ClientAuthentication} />
                    <Route path="/client/login" component={() => <Suspense fallback={<div></div>}><ClientLogin /></Suspense>} />
                    <Redirect path="/login" to="/client/login" />
                    <Route component={QuotingTool} />
                </Switch>
            </Grommet>
        );
    };
}

class QuotingTool extends Component {
    render() {
        return (
            <div className={s.quotingToolContainer}>
                <nav className={s.topNav}>
                    <img src={img} alt="iq-logo" className={s.mainLogo} />
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

export default Store.withStore(Main as any);
