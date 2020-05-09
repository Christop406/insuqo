import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { ProcessServerConfigFunction, RevertServerConfigFunction, LoadServerConfigFunction } from 'model/filepond';
import ReactDOMServer from 'react-dom/server';

registerPlugin(FilePondPluginImagePreview);

interface CheckImageUploaderProps {
    onLoad?: LoadServerConfigFunction;
    onProcess: ProcessServerConfigFunction;
    onRevert: RevertServerConfigFunction;
    source?: string;
}

export const CheckImageUploader: React.FC<CheckImageUploaderProps> = ({
    onLoad,
    onProcess,
    onRevert,
}) => {

    return (
        <FilePond
            name='frontUploader'
            server={{
                load: onLoad,
                process: onProcess,
                revert: (_id, load) => load(),
            }}
            beforeRemoveFile={(_) => {
                onRevert(_, () => '', () => '');
                return true;
            }}
            allowMultiple={false}
            maxFiles={1}
            labelIdle={uploaderIdleText} />
    );
};

const uploaderIdleText = ReactDOMServer.renderToStaticMarkup(
    <span>Drop Image Here or <span className="filepond--label-action">Click to Upload</span></span>
);