import React from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ApplicationPaymentInfo from './components/ApplicationPaymentInfo';
import { ProcessServerConfigFunction, RevertServerConfigFunction } from 'model/filepond';
import { ApplicationService } from 'services/application.service';
import axios from 'axios';
import { Application } from '@insuqo/shared';

interface PaymentInfoContainerProps extends IQStoreProps, RouteComponentProps {
    continueTo?: string;
}

interface PaymentInfoContainerState {
    videoStream?: any;
}

class PaymentInfoContainer extends React.Component<PaymentInfoContainerProps, PaymentInfoContainerState> {

    state: PaymentInfoContainerState = { };
    private videoRef?: any;
    private applicationService: ApplicationService;
    private fileUrlLookup: Map<string, { put: string; delete: string }>;

    constructor(props: any) {
        super(props);
        this.applicationService = new ApplicationService();
        this.fileUrlLookup = new Map();
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
                    onAddImage={this.handleAddImage}
                />
                {/* <video autoPlay ref={(r) => this.videoRef = r}></video> */}
            </>
        );
    }

    handleSubmit = async (paymentInfo: Partial<Application>) => {
        const application = this.props.store.get('application');
        await this.applicationService.updatePaymentInfo(application!.id, {...paymentInfo, images: Array.from(this.fileUrlLookup.keys())});
        const { history, continueTo } = this.props;

        history.push(continueTo || `/application/${application?.id}/review`);
    };

    openCamera = async () => {
        const res = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        this.videoRef.srcObject = res;
    };

    handleAddImage: ProcessServerConfigFunction = async (fileName, file, metadata, load, error) => {
        const application = this.props.store.get('application')!;
        try {
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
                this.fileUrlLookup.set(urls.id, {
                    put: urls.put,
                    delete: urls.delete,
                });
                load(urls.id);
            } else {
                error('Could not sign URLs for upload');
            }
        } catch (err) {
            error(err);
        }
    };

    handleRemoveImage: RevertServerConfigFunction = async (uniqueFileId, load, error) => {
        const urls = this.fileUrlLookup.get(uniqueFileId);
        if (urls) {
            try {
                await axios.delete(urls.delete);
            } catch (err) {
                error(err);
            }
        } else {
            error('No URLs for fileId');
        }
        this.fileUrlLookup.delete(uniqueFileId);
        load();
    }
}

export default IQStore.withStore(withRouter(PaymentInfoContainer));