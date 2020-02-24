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
        console.log('heh');
        this.loadBeneficiaries.bind(this);
        this.handleSubmit.bind(this);
        this.loadCheckImages.bind(this);
    }

    public componentDidMount(): void {
        console.log('cdm');
        document.title = 'Review - Application | INSUQO';
        Promise.all([
            this.loadBeneficiaries(),
            this.loadCheckImages(),
        ]);
    }

    public render(): JSX.Element {
        const application = this.props.store.get('application');
        const chosenQuote = this.props.store.get('chosenQuote');
        const beneficiaries = this.props.store.get('beneficiaries');
        const { frontImage, backImage } = this.state;
        return (
            <ApplicationReview
                application={application}
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
        if (application && application.images) {
            if (application.images[0]) {
                this.applicationService.getImageUrl(application.id, application.images![0]).then((img) => {
                    this.setState({ frontImage: img });
                });
                if (application.images[1]) {
                    this.applicationService.getImageUrl(application.id, application.images![1]).then((img) => {
                        this.setState({ backImage: img });
                    });
                    console.debug('2 images');
                } else {
                    console.debug('1 image');
                }
            } else{
                console.debug('No images');
            }
        }
    }
}

export default IQStore.withStore(withRouter(ReviewContainer));