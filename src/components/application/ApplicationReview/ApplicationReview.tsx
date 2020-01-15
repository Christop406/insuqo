import React from 'react';
import { Application } from 'insuqo-shared';

export const ApplicationReview: React.FC<ApplicationReviewProps> = (props) => {
    return <>{JSON.stringify(props.application)}</>;
};

interface ApplicationReviewProps {
    application?: Application;
    onSubmit: (application: Application) => any;
}