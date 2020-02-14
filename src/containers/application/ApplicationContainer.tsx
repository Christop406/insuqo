import React from 'react';
// import Quote from './components/Quote';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import IQStore, { IQStoreProps } from '../../store/IQStore';
import Application from './components/Application';

type ApplicationContainerProps = RouteComponentProps & IQStoreProps;

class ApplicationContainer extends React.Component<ApplicationContainerProps> {

    componentDidMount = () => {
        document.title = 'Application | INSUQO';
    }

    public render() {
        return <Application />;
    }
}

export default IQStore.withStore(withRouter(ApplicationContainer));