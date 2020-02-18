import React from 'react';
import { Field, Formik } from 'formik';
import { Application } from '@insuqo/shared';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import axios from 'axios';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import s from './ApplicationPaymentInfo.module.scss';
import { ApplicationService } from 'services/application.service';
import { useForm } from 'react-hook-form';
registerPlugin(FilePondPluginImagePreview);


interface PaymentInfoProps {
    onSubmit: (output: any) => any;
    application?: Application;
    onImageClick?: () => any;
}

const ApplicationPaymentInfo: React.FunctionComponent<PaymentInfoProps> = ({ application, onSubmit }) => {
    const { handleSubmit, register } = useForm({ defaultValues: application });

    if (!application) {
        return <></>;
    }

    const fileUrlLookup: Map<string, { put: string; delete: string }> = new Map();
    const applicationService = new ApplicationService();

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
                        <input ref={register} className="input" placeholder="John Smith" name="nameOnAccount" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number</label>
                        <input ref={register} className="input code" placeholder="8462957140" name="accountNumber" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="routingNumber">Routing Number</label>
                        <input ref={register} className="input code" placeholder="011401533" name="routingNumber" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='imageUploader'>Check Picture</label>
                        {/* <button onClick={onImageClick}>Open Media thing</button> */}
                        <FilePond name='imageUploader' server={{
                            process: async (fieldName, file, metadata, load, error) => {
                                try {
                                    const urls = await applicationService.getSignedUploadUrl(application.id, {
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
                                        fileUrlLookup.set(urls.id, {
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

                            },
                            revert: async (uniqueFileId, load, error) => {
                                const urls = fileUrlLookup.get(uniqueFileId);
                                if (urls) {
                                    try {
                                        await axios.delete(urls.delete);
                                    } catch (err) {
                                        error(err);
                                    }
                                } else {
                                    error('No URLs for fileId');
                                }
                                fileUrlLookup.delete(uniqueFileId);
                                load();
                            }
                        }} allowMultiple={true} maxFiles={2} />
                    </div>
                    <button className="button full primary"
                        type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

function iteratorToArray<T>(iterator: IterableIterator<T>): T[] {
    return Array.from(iterator);
}

export default ApplicationPaymentInfo;