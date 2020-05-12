import React, { Component, Suspense } from 'react';
import IQStore, { IQStoreProps } from './store/IQStore';
// import AppStatus from './controllers/application-status/application-status';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import img from './assets/img/insuqo-logo.png';
import s from './Main.module.scss';
const QuoteContainer = React.lazy(() => import('containers/quote/QuoteContainer'));
const ClientAuthentication = React.lazy(() => import('./controllers/auth/ClientAuthentication'));
const ApplicationContainer = React.lazy(() => import('containers/application/ApplicationContainer'));

type MainProps = IQStoreProps & RouteComponentProps;

class Main extends Component<MainProps> {
    render = () => {
        return (
            <Grommet theme={grommet}>
                <Switch>
                    <Route path="/register" component={() => <Suspense fallback={<div>Loading...</div>}><ClientAuthentication/></Suspense>} />
                    {/* <Route path="/client/login" component={() => <Suspense fallback={<div></div>}><ClientLogin /></Suspense>} /> */}
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
                            <Route path="/application/:appId" component={ApplicationContainer} />
                            <Route exact path="/application" component={ApplicationContainer} />
                            <Route path="/quote" component={QuoteContainer} />
                            <Redirect to="/quote" />
                        </Switch>
                    </Suspense>
                </div>
            </div>
        );
    }
}

export default IQStore.withStore(withRouter(Main));
