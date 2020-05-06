import React from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ApplicationReview from './components/ApplicationReview';
import { Application } from '@insuqo/shared';
import { BeneficiaryService } from 'services/beneficiary.service';
import { ApplicationService } from 'services/application.service';

interface ReviewContainerProps extends IQStoreProps, RouteComponentProps { }

class ReviewContainer extends React.Component<ReviewContainerProps, any> {

    state: any = {
        
    };

    private beneficiaryService: BeneficiaryService;
    private applicationService: ApplicationService;

    constructor(props: React.ComponentProps<any>) {
        super(props);
        this.beneficiaryService = new BeneficiaryService();
        this.applicationService = new ApplicationService();

        this.loadBeneficiaries.bind(this);
        this.handleSubmit.bind(this);
        this.loadCheckImages.bind(this);
    }

    public componentDidMount(): void {
        document.title = 'Review - Application | INSUQO';
        Promise.all([
            this.loadBeneficiaries(),
            this.loadCheckImages(),
        ]);
    }

    public render(): JSX.Element {
        const application = this.props.store.get('application');
        const chosenQuote = this.props.store.get('chosenQuote');
        const quote = this.props.store.get('quote');
        const beneficiaries = this.props.store.get('beneficiaries');
        const location = this.props.store.get('location');
        const { frontImage, backImage } = this.state;
        return (
            <ApplicationReview
                application={application}
                quote={quote}
                location={location}
                onSubmit={this.handleSubmit}
                quotes={application?.quotes}
                chosenQuote={chosenQuote}
                beneficiaries={beneficiaries}
                checkImages={[frontImage, backImage]}
            />
        );
    }

    private async handleSubmit(application: Application): Promise<void> {
        console.log(application);
    }

    private async loadBeneficiaries(): Promise<void> {
        const application = this.props.store.get('application');
        if (application) {
            const beneficiaries = await this.beneficiaryService.getBeneficiaries(application?.id);
            this.props.store.set('beneficiaries')(beneficiaries);
        }
    }

    private async loadCheckImages(): Promise<void> {
        const application = this.props.store.get('application');
        let frontPromise: Promise<string | undefined> | undefined;
        let backPromise: Promise<string | undefined> | undefined;
        if (application?.checkFront) {
            // frontPromise = ApplicationService.getImageUrl(application.id, application.checkFront) as any;
        }
        if (application?.checkBack) {
            // backPromise = ApplicationService.getImageUrl(application.id, application.checkBack) as any;
        }

        this.setState({
            frontImage: await frontPromise,
            backImage: await backPromise,
        });
    }
}

export default IQStore.withStore(withRouter(ReviewContainer));