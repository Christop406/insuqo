import React from 'react';
import IQStore from './store/IQStore';
import { BrowserRouter } from 'react-router-dom';
import Main from './Main';
import './App.scss';
require('./icon-library');


class App extends React.Component {
    render = () => {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <IQStore.Container>
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </IQStore.Container>
            </div>
        );
    }
}

export default App;
