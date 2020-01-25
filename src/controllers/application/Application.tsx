import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import { ApplicationBasicInfo } from "../../components/application/ApplicationBasicInfo/ApplicationBasicInfo";
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { ApplicationService } from "../../services/application.service";
import { Application as ApplicationModel, QuickTermQuoteResult, ApplicationStatus as Status, ApplicationStatus } from "insuqo-shared";
import { ApplicationPaymentInfo } from "../../components/application/ApplicationPaymentInfo/ApplicationPaymentInfo";
import { ApplicationReview } from '../../components/application/ApplicationReview/ApplicationReview';
import { ApplicationStatusView } from '../../components/application/ApplicationStatusView/ApplicationStatusView';
import Spinner from 'react-spinkit';
import s from './Application.module.scss';
import { ClientAuthentication } from '../sign-up/ClientAuthentication';
import { AuthenticationService } from '../../services/authentication.service';
import { Logger } from '../../services/logger';

interface ApplicationState {
    application: ApplicationModel | undefined;
    chosenQuote: QuickTermQuoteResult | undefined;
    showAuthModal: boolean;
}

class Application extends Component<RouteComponentProps<{ appId: string }>, ApplicationState> {

    public state = {
        application: undefined,
        chosenQuote: undefined,
        showAuthModal: false,
    };

    private applicationService: ApplicationService = new ApplicationService();

    public componentDidMount = async () => {
        document.title = 'Application | INSUQO';
        try {
            if ((await AuthenticationService.getCurrentSession()).isValid()) {
                const appId = this.props.match.params.appId;
                if (!appId) {
                    Logger.warn('No application ID');
                    this.props.history.push('/');
                    return;
                }
                await this.loadApplication();
            } else {
                throw new Error('Invalid session');
            }

        } catch (error) {
            Logger.error(error);
            this.setState({ showAuthModal: true });
        }

    };

    render = () => {
        const { application, chosenQuote, showAuthModal } = this.state;

        if (!application) {
            return <div className={s.loadingContainer}>
                <Spinner name="folding-cube" fadeIn="none" color="#9c37f2" />
                {showAuthModal && <ClientAuthentication type="login" onAuthenticate={this.handleAuthentication} />}
            </div>;
        }

        return (
            <>
                <Switch>
                    <Route path={`${this.props.match.path}/apply`} render={(props) =>
                        <ApplicationBasicInfo {...props} onSubmit={this.updateBasicInfo} application={application!}
                            chosenQuote={chosenQuote} />} />
                    <Route path={`${this.props.match.path}/payment`} render={(props) =>
                        <ApplicationPaymentInfo {...props} application={application!}
                            onSubmit={this.updatePaymentInfo} />} />
                    <Route path={`${this.props.match.path}/review`} render={(props) =>
                        <ApplicationReview {...props} application={application!}
                            onSubmit={this.submitApplication} />} />
                    <Route path={`${this.props.match.path}/status`} render={(props) =>
                        <ApplicationStatusView {...props} application={application!} />} />
                    <Redirect to={`${this.props.match.path}/${this.getDefaultStep(application)}`} />
                </Switch>
            </>
        );
    };

    private updateBasicInfo = async (app: any) => {
        const appId = (this.state.application as any).id;
        const updateResponse = await this.applicationService.updateBasicInfo(appId, app);
        if (updateResponse) {
            this.props.history.push(`/application/${appId}/payment`);
        }
    };

    private updatePaymentInfo = async (paymentInfo: any) => {
        const appId = (this.state.application as any).id;
        const updateResponse = await this.applicationService.updatePaymentInfo(appId, paymentInfo);
        if (updateResponse) {
            this.setState({ application: updateResponse }, () => this.props.history.push(`/application/${appId}/review`));
        }
    };

    private submitApplication = async (applicationId: string) => {
        const updated = await this.applicationService.submitApplication(applicationId);
        if (updated?.status === ApplicationStatus.Submitted) {
            // success
            this.setState({ application: updated }, () => this.props.history.push(`/application/${updated.id}/status`));
        } else {
            // failure
            // TODO: Show eror
        }
    }

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
        const application = await this.applicationService.getApplication(appId);
        if (application && application.quotes) {
            const chosenQuote = application.quotes.find<QuickTermQuoteResult>(((quote: QuickTermQuoteResult) => {
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
                    case Status.New:
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
            }
        } else {
            // error
            Logger.error('No Application Found');
        }
    };
}

export default Store.withStore(Application as any);
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
