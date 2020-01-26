import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import Begin from '../../components/quote/panes/begin/begin';
import Personal from '../../components/quote/panes/personal/personal';
import Plan from '../../components/quote/panes/plan/plan';
import Results from '../../components/quote/panes/results/results';
import { Redirect, Route, Switch } from 'react-router-dom';
import QuoteHelp from '../../components/quote/quote-help';
import s from './Quote.module.scss';
import cx from 'classnames';

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
                        <Switch>
                            <Route path={this.props.match.path + '/begin'} component={Begin} />
                            <Route path={this.props.match.path + '/personal'} component={Personal} />
                            <Route path={this.props.match.path + '/plan'} component={Plan} />
                            <Route path={this.props.match.path + '/results'} component={Results} />
                            <Redirect to="/quote/begin" />
                        </Switch>
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
