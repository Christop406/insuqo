import React from 'react';
import { Redirect, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import QuoteHelp from '../../../components/quote/quote-help';
import s from './Quote.module.scss';
import './Quote.common.scss';
import cx from 'classnames';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { QuoteService } from 'services/quote.service';
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
                            <Route path={props.match.path + '/:id'} component={ContinueQuote}/>
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

class ContinueQuoteImpl extends React.Component<RouteComponentProps & IQStoreProps, any> {

    private quoteService: QuoteService;

    constructor(props: RouteComponentProps & IQStoreProps) {
        super(props);
        this.quoteService = new QuoteService();
    }

    componentDidMount(): void {
        console.log(this.props);
        this.retrieveQuote();
    }

    render(): JSX.Element {
        const { match } = this.props;
        return (
            <Switch>
                <Route path={match.path + '/personal'} component={PersonalContainer} />
                <Route path={match.path + '/plan'} component={PlanContainer} />
                <Route path={match.path + '/results'} component={ResultsContainer} />
            </Switch>
        );
    }

    private retrieveQuote = async () => {
        const { params } = this.props.match;
        const res = await this.quoteService.getQuoteRecord((params as any).id);
        this.props.store.set('quote')(res?.quote);
        this.props.store.set('location')(res?.location);
    };
}

const ContinueQuote = IQStore.withStore(withRouter(ContinueQuoteImpl));
export default IQStore.withStore(withRouter(Quote));
