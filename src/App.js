import React from 'react';
import Store from './ApplicationStore';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Main from "./Main";
import './App.css';


class App extends React.Component {
    render = () => {
        return (
            <Store.Container>
                <Router>
                    <Switch>
                        <Route path="/" component={Main}/>
                    </Switch>
                </Router>
            </Store.Container>
        )
    }
}

export default App;
