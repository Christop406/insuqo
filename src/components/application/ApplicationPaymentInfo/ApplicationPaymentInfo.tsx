import React, { useState } from 'react';
import { Field, Formik } from 'formik';
import { Application } from 'insuqo-shared';
import { FilePond, registerPlugin } from 'react-filepond';
// @ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import axios from 'axios';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import s from './ApplicationPaymentInfo.module.scss';
import { ApplicationService } from '../../../services/application.service';
registerPlugin(FilePondPluginImagePreview);


interface PaymentInfoProps {
    onSubmit: (output: any) => any;
    application?: Application;
}

export const ApplicationPaymentInfo: React.FunctionComponent<PaymentInfoProps> = (props) => {

    const fileUrlLookup: { [fileId: string]: { put: string, delete: string } } = {};
    const [filepond, setFilepond] = useState<FilePond | null>(null);
    const applicationService = new ApplicationService();

    return (
        <Formik initialValues={initialFormValues} onSubmit={props.onSubmit}>
            {(form) =>
                <div className={s.container}>
                    <div className={s.formContainer}>
                        <div className={s.header}>
                            <h1 className="purpleText">Payment Information</h1>
                            <span className="lead">Please enter your bank account information so your coverage can begin as soon as you are approved.</span>
                        </div>
                        <form>
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
                                <FilePond ref={(ref) => setFilepond(ref)} server={{
                                    process: async (fieldName, file, metadata, load, error, progress, abort) => {
                                        const urls = await applicationService.getSignedUploadUrl(props.application!.id, {
                                            headers: {
                                                'X-Mime-Type': file.type,
                                            }
                                        });
                                        await axios.put(urls!.put, file, {
                                            headers: {
                                                'Content-Type': file.type
                                            }
                                        });
                                        fileUrlLookup[urls!.id] = {
                                            put: urls!.put,
                                            delete: urls!.delete,
                                        };

                                        load(urls!.id);
                                    },
                                    revert: async (uniqueFileId, load, error) => {
                                        const urls = fileUrlLookup[uniqueFileId];
                                        if (urls) {
                                            try {
                                                await axios.delete(urls.delete);
                                            } catch (err) {
                                                error(err);
                                            }
                                        } else {
                                            error('No URLs for fileId')
                                        }

                                        load();
                                    }
                                }} allowMultiple={true} maxFiles={2} />
                            </div>
                            <button className="button full primary" type="button" onClick={() => {
                                console.log(filepond?.getFile());
                            }} disabled={form.isSubmitting}>Submit
                            </button>
                        </form>
                    </div>
                </div>
            }
        </Formik>
    );
};

const initialFormValues = {
    nameOnAccount: '',
    accountNumber: '',
    routingNumber: ''
};