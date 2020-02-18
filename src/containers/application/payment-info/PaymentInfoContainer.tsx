import React, { Ref } from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ApplicationPaymentInfo from './components/ApplicationPaymentInfo';

interface PaymentInfoContainerProps extends IQStoreProps, RouteComponentProps {

}

interface PaymentInfoContainerState {
    videoStream?: any;
}

class PaymentInfoContainer extends React.Component<PaymentInfoContainerProps, PaymentInfoContainerState> {

    state: PaymentInfoContainerState = {};
    private videoRef?: any;

    render() {
        const application = this.props.store.get('application');
        return (
            <>
                <ApplicationPaymentInfo
                    application={application}
                    onSubmit={this.handleSubmit}
                    onImageClick={this.openCamera} />
                {/* <video autoPlay ref={(r) => this.videoRef = r}></video> */}
            </>
        );
    }

    handleSubmit = (input: any) => {
        console.log(input);
    };

    openCamera = async () => {
        const res = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        this.videoRef.srcObject = res;
    };
}

export default IQStore.withStore(withRouter(PaymentInfoContainer));