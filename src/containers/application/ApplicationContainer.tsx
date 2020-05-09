import React from 'react';
import Application from './components/Application';


export default class ApplicationContainer extends React.Component {

    componentDidMount = () => {
        document.title = 'Application | INSUQO';
    }

    public render() {
        return <Application />;
    }
}
