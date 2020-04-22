import React from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ApplicationPaymentInfo from './components/ApplicationPaymentInfo';
import { ProcessServerConfigFunction, RevertServerConfigFunction } from 'model/filepond';
import { ApplicationService, SignedUrlResponse } from 'services/application.service';
import axios from 'axios';
import { Application } from '@insuqo/shared';

interface PaymentInfoContainerProps extends IQStoreProps, RouteComponentProps {
    continueTo?: string;
}

interface PaymentInfoContainerState {
    videoStream?: any;
}

class PaymentInfoContainer extends React.Component<PaymentInfoContainerProps, PaymentInfoContainerState> {

    state: PaymentInfoContainerState = {};
    private videoRef?: any;
    private applicationService: ApplicationService;
    private checkFront?: SignedUrlResponse;
    private checkBack?: SignedUrlResponse;

    constructor(props: any) {
        super(props);
        this.applicationService = new ApplicationService();
    }

    componentDidMount = () => {
        document.title = 'Payment Info - Application | INSUQO';
    };

    render() {
        const application = this.props.store.get('application');
        return (
            <>
                <ApplicationPaymentInfo
                    application={application}
                    onSubmit={this.handleSubmit}
                    onImageClick={this.openCamera}
                    onAddImage={this.handleAddCheckImage}
                    onRemoveImage={this.handleRemoveCheckImage}
                />
            </>
        );
    }

    handleSubmit = async (paymentInfo: Partial<Application>) => {
        const application = this.props.store.get('application');
        const { checkFront, checkBack } = this;
        await this.applicationService.updateApplication(application!.id, { ...paymentInfo, checkFront: checkFront?.id, checkBack: checkBack?.id });
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

            load(uploadedFile!);
        } catch (err) {
            error(err);
        }
    };

    private signAndUpload = async (application: Application, file: any): Promise<SignedUrlResponse> => {
        const urls = await this.applicationService.getSignedUploadUrl(application.id, {
            headers: {
                'X-Mime-Type': file.type,
            }
        });

        if (urls) {
            await axios.put(urls.put, file, {
                headers: {
                    'Content-Type': file.type
                }
            });

            return urls;
        } else {
            throw new Error('Could not sign URLs for upload');
        }
    }

    private handleRemoveCheckImage = (side: 'front' | 'back'): RevertServerConfigFunction => {
        return (_uniqueFileId, load, error) => this.handleRemoveImage(side, load, error);
    };

    handleRemoveImage: RevertServerConfigFunction = async (side, load, error) => {
        let deleteUrl: string | undefined;

        if (side === 'front') {
            deleteUrl = this.checkFront?.delete;
            this.checkFront = undefined;
        } else if (side === 'back') {
            deleteUrl = this.checkBack?.delete;
            this.checkBack = undefined;
        }

        if (deleteUrl) {
            try {
                await axios.delete(deleteUrl);
            } catch (err) {
                error(err);
            }
        } else {
            error('No URL for file');
        }
        console.log(this.checkFront, this.checkBack);
        load();
    }
}

export default IQStore.withStore(withRouter(PaymentInfoContainer));