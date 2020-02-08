import React from 'react';
import { Field, Formik } from 'formik';
import { Application } from '@insuqo/shared';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import axios from 'axios';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import s from './ApplicationPaymentInfo.module.scss';
import { ApplicationService } from '../../../services/application.service';
registerPlugin(FilePondPluginImagePreview);


interface PaymentInfoProps {
    onSubmit: (output: any) => any;
    application: Application;
}

export const ApplicationPaymentInfo: React.FunctionComponent<PaymentInfoProps> = (props) => {
    if (!props.application) {
        return <></>;
    }

    const fileUrlLookup: Map<string, { put: string; delete: string }> = new Map();
    const applicationService = new ApplicationService();

    return (
        <Formik initialValues={props.application} onSubmit={(values) => props.onSubmit({ ...values, images: Object.keys(fileUrlLookup) })}>
            {(form) =>
                <div className={s.container}>
                    <div className={s.formContainer}>
                        <div className={s.header}>
                            <h1 className="purpleText">Payment Information</h1>
                            <span className="lead">Please enter your bank account information so your coverage can begin as soon as you are approved.</span>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="nameOnAccount">Name on Account</label>
                                <Field className="input" placeholder="John Smith" name="nameOnAccount" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="accountNumber">Account Number</label>
                                <Field className="input code" placeholder="8462957140" name="accountNumber" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="routingNumber">Routing Number</label>
                                <Field className="input code" placeholder="011401533" name="routingNumber" />
                            </div>
                            <div className="form-group">
                                <label>Check Picture</label>
                                <FilePond server={{
                                    process: async (fieldName, file, metadata, load, error) => {
                                        try {
                                            const urls = await applicationService.getSignedUploadUrl(props.application!.id, {
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
                                type="submit"
                                onClick={() => props.onSubmit({ ...form.values, images: iteratorToArray(fileUrlLookup.keys()) })}
                                disabled={form.isSubmitting}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            }
        </Formik>
    );
};

function iteratorToArray<T>(iterator: IterableIterator<T>): T[] {
    return Array.from(iterator);
}