import React from 'react';
import { Application } from '@insuqo/shared';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import s from './ApplicationPaymentInfo.module.scss';
import { useForm } from 'react-hook-form';
import { ProcessServerConfigFunction } from 'model/filepond';
registerPlugin(FilePondPluginImagePreview);



interface PaymentInfoProps {
    onSubmit: (output: any) => any;
    application?: Application;
    onImageClick?: () => any;
    onAddImage?: ProcessServerConfigFunction;
    onRemoveImage?: any;
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
                    <div className="form-group">
                        <label htmlFor='imageUploader'>Check Picture</label>
                        {/* <button onClick={onImageClick}>Open Media thing</button> */}
                        <FilePond name='imageUploader' server={{
                            process: onAddImage,
                            revert: onRemoveImage
                        }} allowMultiple={true} maxFiles={2} />
                    </div>
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

export default ApplicationPaymentInfo;