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
                checkFront={frontImage}
                checkBack={backImage}
            />
        );
    }

    private handleSubmit = async (application: Application): Promise<void> => {
        console.log(application);
        const updated = await this.applicationService.submitApplication(application.id);
        this.props.store.set('application')(updated);
        this.props.history.push(`/application/${application.id}/status`);
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
        if (application) {
            const [frontImage, backImage] = await Promise.all([
                await this.applicationService.getSignedImageUrl(application.id, 'front'),
                await this.applicationService.getSignedImageUrl(application.id, 'back')
            ]);
            this.setState({
                frontImage,
                backImage,
            });
            console.log(frontImage, backImage);
        }

    }
}

export default IQStore.withStore(withRouter(ReviewContainer));