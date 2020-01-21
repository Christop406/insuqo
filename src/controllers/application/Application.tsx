import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import { ApplicationBasicInfo } from "../../components/application/ApplicationBasicInfo/ApplicationBasicInfo";
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ApplicationService } from "../../services/application.service";
import { Application as ApplicationModel, QuickTermQuoteResult, ApplicationStatus as Status } from "insuqo-shared";
import { ApplicationPaymentInfo } from "../../components/application/ApplicationPaymentInfo/ApplicationPaymentInfo";
import { ApplicationReview } from '../../components/application/ApplicationReview/ApplicationReview';
import { ApplicationStatusView } from '../../components/application/ApplicationStatusView/ApplicationStatusView';
import Spinner from 'react-spinkit';
import s from './Application.module.scss';

interface ApplicationState {
    application: ApplicationModel | undefined;
    chosenQuote: QuickTermQuoteResult | undefined;
}

class Application extends Component<RouteComponentProps<{ appId: string }>, ApplicationState> {

    public state = {
        application: undefined,
        chosenQuote: undefined,
    };

    private applicationService: ApplicationService = new ApplicationService();

    public componentDidMount = async () => {
        document.title = 'Application | INSUQO';
        console.log(this.props);
        try {
            const application = await this.applicationService.getApplication(this.props.match.params.appId);
            if (application && application.quotes) {
                const chosenQuote = application.quotes.find<QuickTermQuoteResult>(((quote: QuickTermQuoteResult) => {
                    return quote.RecID === application.quoteRecId;
                }) as any);
                if (chosenQuote) {

                    switch(application.status) {
                        case Status.New:
                            this.props.history.push(`/application/${application.id}/apply`);
                            break;
                        case Status.Submitted:
                            this.props.history.push(`/application/${application.id}/status`);
                            break;
                    }

                    this.setState({
                        application,
                        chosenQuote
                    });
                }
            } else {
                // error
            }

        } catch (error) {
            console.log(error);
        }

    };

    render = () => {
        const { application, chosenQuote } = this.state;

        if (!application) {
            return <div className={s.loadingContainer}>
                <Spinner name="folding-cube" fadeIn="none" color="#9c37f2" />
            </div>;
        }

        return (
            <Switch>
                <Route path={`${this.props.match.path}/apply`} render={(props) =>
                    <ApplicationBasicInfo {...props} onSubmit={this.updateBasicInfo} application={application!}
                        chosenQuote={chosenQuote} />} />
                <Route path={`${this.props.match.path}/payment`} render={(props) =>
                    <ApplicationPaymentInfo {...props} application={application!}
                        onSubmit={this.updatePaymentInfo} />} />
                <Route path={`${this.props.match.path}/review`} render={(props) =>
                    <ApplicationReview {...props} application={application!}
                        onSubmit={(a) => this.updateApplication(a, 'finish')} />} />
                <Route path={`${this.props.match.path}/status`} render={(props) =>
                    <ApplicationStatusView {...props} application={application!} />} />
            </Switch>
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

    private updateApplication = async (app: any, continueTo: 'payment' | 'review' | 'finish') => {
        console.log(app);
        let application = await this.applicationService.updateApplication((this.state.application as any).id, app);
        if (application && (application = await this.applicationService.getApplication(application.id))) {
            this.setState({ application }, () => this.props.history.push(this.props.match.path + '/' + continueTo));
        }
    };

    private submitApplication = async (app: ApplicationModel) => {
        console.log(app);
    };
}

export default Store.withStore(Application as any);
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
