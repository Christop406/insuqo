import React from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import  { Provider } from 'react-redux';
import Main from "./Main";
import './App.css';

const App = ({store}) => (
    <Provider store={store}>
        <Router>
            <Route path="/" component={Main}/>
        </Router>
    </Provider>
);

App.propTypes = {
    store: PropTypes.object.isRequired
};

export default App;
