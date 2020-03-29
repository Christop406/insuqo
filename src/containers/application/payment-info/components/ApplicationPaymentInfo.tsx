import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Application } from '@insuqo/shared';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import cx from 'classnames';

import s from './ApplicationPaymentInfo.module.scss';
import { useForm } from 'react-hook-form';
import { ProcessServerConfigFunction, RevertServerConfigFunction } from 'model/filepond';
registerPlugin(FilePondPluginImagePreview);



interface PaymentInfoProps {
    onSubmit: (output: any) => any;
    application?: Application;
    onImageClick?: () => any;
    onAddImage: (side: 'front' | 'back') => ProcessServerConfigFunction;
    onRemoveImage: (side: 'front' | 'back') => RevertServerConfigFunction;
}

const ApplicationPaymentInfo: React.FunctionComponent<PaymentInfoProps> = ({ application, onSubmit, onAddImage, onRemoveImage }) => {
    const { handleSubmit, register, formState } = useForm({ defaultValues: application, mode: 'onChange' });

    if (!application) {
        return <></>;
    }

    return (
        <div className={s.container}>
            <div className={s.formContainer}>
                <div className={s.header}>
                    <h1 className="purpleText">Payment Information</h1>
                    <span className="lead">Please enter your bank account information so your coverage can begin as soon as you are approved.</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="nameOnAccount">Name on Account</label>
                        <input ref={register({ required: true })} className="input" placeholder="John Smith" name="nameOnAccount" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number</label>
                        <input ref={register({ required: true })} className="input code" placeholder="8462957140" name="accountNumber" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="routingNumber">Routing Number</label>
                        <input ref={register({ required: true })} className="input code" placeholder="011401533" name="routingNumber" />
                    </div>
                    <div className={cx('form-group', s.checkUploaderContainer)}>
                        <div className={s.checkUploader}>
                            <label htmlFor='frontUploader'>Front of Check</label>
                            {/* <button onClick={onImageClick}>Open Media thing</button> */}
                            <FilePond name='frontUploader' server={{
                                process: onAddImage('front'),
                                revert: onRemoveImage('front')
                            }} allowMultiple={true} maxFiles={1} labelIdle={uploaderIdleText()} />
                        </div>
                        <div className={s.checkUploader}>
                            <label htmlFor='backUploader'>Back of Check</label>
                            <FilePond name='backUploader' server={{
                                process: onAddImage('back'),
                                revert: onRemoveImage('back')
                            }} allowMultiple={true} maxFiles={1} labelIdle={uploaderIdleText()} />
                        </div>
                    </div>
                    <img alt="test" src="https://storage.cloud.google.com/insuqo-payments/process/4cac73ab-dd7d-4563-9398-298d2da3b8a6/2d30381d-0a85-4550-adbe-3b2e3d33f100.png"></img>
                    <button className="button full primary"
                        disabled={!formState.isValid}
                        type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

const uploaderIdleText = () => ReactDOMServer.renderToStaticMarkup(
    <span>Drop Image Here or <span className="filepond--label-action">Click to Upload</span></span>
);

export default ApplicationPaymentInfo;