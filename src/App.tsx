import React from 'react';
import Store from './ApplicationStore';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './Main';
import './App.scss';
require('./icon-library');


class App extends React.Component {
    render = () => {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <Store.Container>
                    <Router>
                        <Switch>
                            <Route path="/" component={Main} />
                        </Switch>
                    </Router>
                </Store.Container>
            </div>
        );
    }
}

export default App;
