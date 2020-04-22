import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { ProcessServerConfigFunction, RevertServerConfigFunction, LoadServerConfigFunction } from 'model/filepond';
import ReactDOMServer from 'react-dom/server';

registerPlugin(FilePondPluginImagePreview);

interface CheckImageUploaderProps {
    onProcess: ProcessServerConfigFunction;
    onRevert: RevertServerConfigFunction;
    source?: string;
}

export const CheckImageUploader: React.FC<CheckImageUploaderProps> = ({ onProcess, onRevert, source }) => {

    const files: any[] = [
        { source, options: { type: 'local' } }
    ];

    return (
        <FilePond
            name='frontUploader'
            files={files}
            server={{
                load: getFilePreview,
                process: onProcess,
                revert: onRevert,
            }}
            allowMultiple={false}
            maxFiles={1}
            labelIdle={uploaderIdleText} />
    );
};

const getFilePreview: LoadServerConfigFunction = async (source, load) => {
    const myRequest = new Request(source);
    fetch(myRequest).then(function (response) {
        response.blob().then(function (myBlob) {
            load(myBlob as any);
        });
    });
};

const uploaderIdleText = ReactDOMServer.renderToStaticMarkup(
    <span>Drop Image Here or <span className="filepond--label-action">Click to Upload</span></span>
);