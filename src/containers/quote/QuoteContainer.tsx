import React from 'react';
import Quote from './components/Quote';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import IQStore, { IQStoreProps } from '../../store/IQStore';

type QuoteContainerProps = RouteComponentProps & IQStoreProps;

class QuoteContainer extends React.Component<QuoteContainerProps> {

    componentDidMount = () => {
        document.title = 'Quote | INSUQO';
    }

    public render() {
        return <Quote />;
    }
}

export default IQStore.withStore(withRouter(QuoteContainer));