import React from 'react';
import IQStore, { IQStoreProps } from 'store/IQStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ApplicationReview from './components/ApplicationReview';
import { Application } from '@insuqo/shared';

interface ReviewContainerProps extends IQStoreProps, RouteComponentProps { }

class ReviewContainer extends React.Component<ReviewContainerProps> {

    componentDidMount = () => {
        document.title = 'Review - Application | INSUQO';
    };

    render() {
        const application = this.props.store.get('application');
        return (
            <>
                <ApplicationReview
                    application={application}
                    onSubmit={this.handleSubmit} />
            </>
        );
    }

    handleSubmit = async (application: Application) => {
        console.log(application);
    };
}

export default IQStore.withStore(withRouter(ReviewContainer));