import React from 'react';
import { Application } from '@insuqo/shared';

import cx from 'classnames';

import s from './ApplicationPaymentInfo.module.scss';
import { useForm } from 'react-hook-form';
import { ProcessServerConfigFunction, RevertServerConfigFunction } from 'model/filepond';
import { CheckImageUploader } from 'components/forms/CheckImageUploader/CheckImageUploader';



interface PaymentInfoProps {
    onSubmit: (output: any) => any;
    application?: Application;
    onImageClick?: () => any;
    onAddImage: (side: 'front' | 'back') => ProcessServerConfigFunction;
    onRemoveImage: (side: 'front' | 'back') => RevertServerConfigFunction;
    imagesUploaded: boolean;
}

const ApplicationPaymentInfo: React.FunctionComponent<PaymentInfoProps> = ({
    application,
    onSubmit,
    onAddImage,
    onRemoveImage,
    imagesUploaded,
}) => {
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
                            <CheckImageUploader
                                onProcess={onAddImage('front')}
                                onRevert={onRemoveImage('front')}
                                source=""/>
                        </div>
                        <div className={s.checkUploader}>
                            <label htmlFor='backUploader'>Back of Check</label>
                            <CheckImageUploader
                                onProcess={onAddImage('back')}
                                onRevert={onRemoveImage('back')} />
                        </div>
                    </div>
                    <button className="button full primary"
                        disabled={!formState.isValid || !imagesUploaded}
                        type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationPaymentInfo;