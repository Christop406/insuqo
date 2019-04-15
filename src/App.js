import React from 'react';
import Store from './ApplicationStore';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import HttpsRedirect from 'react-https-redirect';
import Main from "./Main";
import './App.css';


class App extends React.Component {
    render = () => {
        return (
            <HttpsRedirect>
                <Store.Container>
                    <Router>
                        <Switch>
                            <Route path="/" component={Main}/>
                        </Switch>
                    </Router>
                </Store.Container>
            </HttpsRedirect>
        )
    }
}

export default App;
