import React, { Component } from 'react';
import { Route, RouteComponentProps, Switch, Redirect, withRouter } from 'react-router-dom';
import { ApplicationService } from 'services/application.service';
import { Application as ApplicationModel, QuickTermQuoteResult, ApplicationStatus as Status } from '@insuqo/shared';
import Spinner from 'react-spinkit';
import s from './Application.module.scss';
import { Logger } from 'services/logger';
import { Auth } from 'services/firebase';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { QuoteService } from 'services/quote.service';
import { Optional } from 'components/base/Optional';
import AuthContainer from 'containers/auth/AuthContainer';
const BeneficiariesContainer = React.lazy(() => import('../beneficiaries/BeneficiariesContainer'));
const BasicInfoContainer = React.lazy(() => import('../basic-info/BasicInfoContainer'));
const PaymentInfoContainer = React.lazy(() => import('../payment-info/PaymentInfoContainer'));
const ReviewContainer = React.lazy(() => import('../review/ReviewContainer'));
const StatusContainer = React.lazy(() => import('containers/application/status/StatusContainer'));

interface ApplicationProps extends IQStoreProps, RouteComponentProps<{ appId: string }> {

}

interface ApplicationState {
    application: ApplicationModel | undefined;
    chosenQuote: QuickTermQuoteResult | undefined;
    showAuthModal: boolean;
}

class Application extends Component<ApplicationProps, ApplicationState> {

    public state = {
        application: undefined,
        chosenQuote: undefined,
        showAuthModal: false,
    };

    private applicationService: ApplicationService = new ApplicationService();
    private quoteService: QuoteService = new QuoteService();

    public componentDidMount = async () => {
        document.title = 'Application | INSUQO';
        Auth.onAuthStateChanged(async (user) => {
            if (user) {
                const appId = this.props.match.params.appId;
                if (!appId) {
                    this.props.history.push('/');
                    return;
                }
                await this.loadApplication();
            } else {
                await this.loadApplication(); // TODO: REMOVE
                Auth.showAuthModal('signin');
            }
        });

    };

    render = () => {
        const { application, showAuthModal } = this.state; // chosenQuote

        if (!application) {
            return <div className={s.loadingContainer}>
                <Spinner name="folding-cube" fadeIn="none" color="#9c37f2" />
                <Optional condition={showAuthModal}>
                    <AuthContainer formType="signup" />
                </Optional>
            </div>;
        }

        return (
            <>
                <Switch>
                    <Route path={`${this.props.match.path}/apply`} component={BasicInfoContainer} />
                    <Route path={`${this.props.match.path}/beneficiaries`} component={BeneficiariesContainer} />
                    <Route path={`${this.props.match.path}/payment`} component={PaymentInfoContainer} />
                    <Route path={`${this.props.match.path}/review`} component={ReviewContainer} />
                    <Route path={`${this.props.match.path}/status`} component={StatusContainer} />
                    <Redirect to={`${this.props.match.path}/${this.getDefaultStep(application)}`} />
                </Switch>
            </>
        );
    };

    private getDefaultStep = (app?: ApplicationModel) => {
        switch (app?.status) {
            case Status.New:
                return 'apply';
            case Status.AwaitingPayment:
                return 'payment';
            case Status.Draft: // change?
                return 'review';
            default:
                return 'status';
        }
    };

    private handleAuthentication = async () => {
        this.setState({ showAuthModal: false });
        await this.loadApplication();
    };

    private loadApplication = async () => {
        const appId = this.props.match.params.appId;
        const [app, quotes] = await Promise.all([
            this.applicationService.getApplication(appId),
            this.quoteService.getQuotesForApplication(appId)
        ]);

        const application = app?.application;

        if (application && quotes) {
            application.quotes = quotes;
            const chosenQuote = quotes.find<QuickTermQuoteResult>(((quote: QuickTermQuoteResult) => {
                return quote.RecID === application.quoteRecId;
            }) as any);
            if (chosenQuote) {
                switch (application.status) {
                    case Status.New:
                        this.props.history.push(`/application/${application.id}/apply`);
                        break;
                    case Status.Submitted:
                    case Status.InProgress:
                    case Status.Done: // change?
                    case Status.Problem:
                        this.props.history.push(`/application/${application.id}/status`);
                        break;
                    case Status.AwaitingPayment:
                        if (this.props.location.pathname.includes('status')) {
                            this.props.history.push(`/application/${application.id}/payment`);
                        }
                        break;
                }
                Logger.info(application);

                this.setState({
                    application,
                    chosenQuote
                });

                this.props.store.set('application')(application);
                this.props.store.set('chosenQuote')(chosenQuote);
                this.props.store.set('location')(app?.location);
                this.props.store.set('quote')(app?.quote);
            }
        } else {
            // error
            Logger.error('No Application Found');
        }
    };
}

export default IQStore.withStore(withRouter(Application));
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
