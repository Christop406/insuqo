import React from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ApplicationPaymentInfo from './components/ApplicationPaymentInfo';
import { ProcessServerConfigFunction, RevertServerConfigFunction } from 'model/filepond';
import { ApplicationService } from 'services/application.service';
import { Application } from '@insuqo/shared';

interface PaymentInfoContainerProps extends IQStoreProps, RouteComponentProps {
    continueTo?: string;
}

interface PaymentInfoContainerState {
    videoStream?: any;
    imagesUploaded: boolean;
}

class PaymentInfoContainer extends React.Component<PaymentInfoContainerProps, PaymentInfoContainerState> {

    state: PaymentInfoContainerState = {
        imagesUploaded: false,
    };
    private videoRef?: any;
    private applicationService: ApplicationService;
    private checkFront?: string;
    private checkBack?: string;

    constructor(props: any) {
        super(props);
        this.applicationService = new ApplicationService();
    }

    componentDidMount = () => {
        document.title = 'Payment Info - Application | INSUQO';
    };

    render() {
        const { imagesUploaded } = this.state;
        const application = this.props.store.get('application');
        return (
            <>
                <ApplicationPaymentInfo
                    application={application}
                    onSubmit={this.handleSubmit}
                    onImageClick={this.openCamera}
                    onAddImage={this.handleAddCheckImage}
                    onRemoveImage={this.handleRemoveCheckImage}
                    imagesUploaded={imagesUploaded}
                />
            </>
        );
    }

    handleSubmit = async (paymentInfo: Partial<Application>) => {
        const application = this.props.store.get('application');
        const { checkFront, checkBack } = this;
        await this.applicationService.updateApplication(application!.id, { ...paymentInfo, checkFront, checkBack });
        const { history, continueTo } = this.props;

        history.push(continueTo || `/application/${application?.id}/review`);
    };

    openCamera = async () => {
        const res = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        this.videoRef.srcObject = res;
    };

    handleAddCheckImage = (side: 'front' | 'back'): ProcessServerConfigFunction => {
        return (_, file, metadata, load, error, progress, abort) => this.handleAddImage(side, file, metadata, load, error, progress, abort);
    };

    handleAddImage: ProcessServerConfigFunction = async (fileName, file, _m, load, error) => {
        const application = this.props.store.get('application')!;
        try {
            const uploadedFile = await this.applicationService.uploadFile(application.id, file, fileName);

            if (!uploadedFile) {
                throw new Error('WHOOPSY');
            }

            if (fileName === 'front') {
                this.checkFront = uploadedFile;
            } else if (fileName === 'back') {
                this.checkBack = uploadedFile;
            }

            this.setState({ imagesUploaded: !!(this.checkBack && this.checkFront) });

            load(uploadedFile!);
        } catch (err) {
            error(err);
        }
    };

    private handleRemoveCheckImage = (side: 'front' | 'back'): RevertServerConfigFunction => {
        return (_uniqueFileId, load, error) => this.handleRemoveImage(side, load, error);
    };

    handleRemoveImage: RevertServerConfigFunction = async (side, load, error) => {
        if (side === 'front') {
            this.checkFront = undefined;
        } else if (side === 'back') {
            this.checkBack = undefined;
        }

        const application = this.props.store.get('application')!;
        try {
            await this.applicationService.deleteImage(application.id, side);
            this.setState({ imagesUploaded: false });
        } catch (e) {
            error(e);
        }

        load();
    }
}

export default IQStore.withStore(withRouter(PaymentInfoContainer));