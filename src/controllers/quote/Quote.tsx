import React, { Component, Suspense } from 'react';
import Store from '../../ApplicationStore';
import { Redirect, Route, Switch } from 'react-router-dom';
import QuoteHelp from '../../components/quote/quote-help';
import s from './Quote.module.scss';
import './Quote.common.scss';
import cx from 'classnames';
const Begin = React.lazy(() => import('../../components/quote/panes/begin/begin'));
const Personal = React.lazy(() => import('../../components/quote/panes/personal/personal'));
const Plan = React.lazy(() => import('../../components/quote/panes/plan/plan'));
const Results = React.lazy(() => import('../../components/quote/panes/results/results'));


class Quote extends Component<any, any> {

    componentDidMount = () => {
        document.title = 'Quote | INSUQO';
        if (this.props.store) {
            if (this.props.match.path !== '/quote/begin' && !this.props.store.state.started) {
                //this.props.history.push("/iq/quote/begin");
            }
        }
    };

    render = () => {
        return (
            <div className={s.quoteContainer}>
                <div className="form-content">
                    <div className={s.formContainer}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                <Route path={this.props.match.path + '/begin'} component={Begin} />
                                <Route path={this.props.match.path + '/personal'} component={Personal} />
                                <Route path={this.props.match.path + '/plan'} component={Plan} />
                                <Route path={this.props.match.path + '/results'} component={Results} />
                                <Redirect to="/quote/begin" />
                            </Switch>
                        </Suspense>
                    </div>
                </div>
                <div className={cx(s.quoteHelpContainer, 'hideOnSmallScreens')}>
                    <Switch>
                        <Route path="/quote" component={QuoteHelp} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Store.withStore(Quote);
