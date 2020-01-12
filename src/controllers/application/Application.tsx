import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import { ApplicationBasicInfo } from "../../components/application/ApplicationBasicInfo/ApplicationBasicInfo";
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ApplicationService } from "../../services/application.service";
import { Application as ApplicationModel, QuickTermQuoteResult } from "insuqo-shared";
import { ApplicationPaymentInfo } from "../../components/application/ApplicationPaymentInfo/ApplicationPaymentInfo";

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
        return (
            <Switch>
                <Route path={`${this.props.match.path}/apply`} render={(props) =>
                    <ApplicationBasicInfo {...props} onSubmit={this.submitApplication} application={application}
                        chosenQuote={chosenQuote} />} />
                <Route path={`${this.props.match.path}/payment`} render={(props) =>
                    <ApplicationPaymentInfo {...props} application={application}
                        onSubmit={(paymentInfo) => console.log(paymentInfo)} />} />
            </Switch>
        );
    };

    private submitApplication = async (app: any) => {
        console.log(app);
        // this.applicationService.submitApplication(app);
        // on success
    };
}

export default Store.withStore(Application as any);
// disabled={!fnameValid || !lnameValid || !ssValid || !pPhoneValid || !emailValid}
