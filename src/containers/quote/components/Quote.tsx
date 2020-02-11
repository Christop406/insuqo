import React from 'react';
import { Redirect, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import QuoteHelp from '../../../components/quote/quote-help';
import s from './Quote.module.scss';
import './Quote.common.scss';
import cx from 'classnames';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
const BeginContainer = React.lazy(() => import('../begin/BeginContainer'));
const PersonalContainer = React.lazy(() => import('../personal/PersonalContainer'));
const PlanContainer = React.lazy(() => import('../plan/PlanContainer'));
const ResultsContainer = React.lazy(() => import('../results/ResultsContainer'));

type QuoteProps = RouteComponentProps & IQStoreProps;

const Quote: React.FC<QuoteProps> = (props) => {
    return (
        <div className={s.quoteContainer}>
            <div className="form-content">
                <div className={s.formContainer}>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route path={props.match.path + '/begin'} component={BeginContainer} />
                            <Route path={props.match.path + '/personal'} component={PersonalContainer} />
                            <Route path={props.match.path + '/plan'} component={PlanContainer} />
                            <Route path={props.match.path + '/results'} component={ResultsContainer} />
                            <Redirect to="/quote/begin" />
                        </Switch>
                    </React.Suspense>
                </div>
            </div>
            <div className={cx(s.quoteHelpContainer, 'hideOnSmallScreens')}>
                <Switch>
                    <Route path="/quote" component={QuoteHelp} />
                </Switch>
            </div>
        </div>
    );
};

export default IQStore.withStore(withRouter(Quote));
