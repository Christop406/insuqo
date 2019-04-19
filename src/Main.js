import React, { Component }  from 'react';
import Store from './ApplicationStore';
import Quote  from './quote/quote';
import Application from './application/application';
import AppStatus from './application/application-status/application-status';
import { fadeInUpBig } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import {Box, Grommet} from 'grommet';
import { grommet, dark } from 'grommet/themes';
import { Route, Switch, Redirect } from 'react-router-dom';
import img from './img/insuqo-logo.png';
import {fillStoreFromLocalStorage} from "./func";
import Agent from "./agent/Agent";
import Client from './client/Client';
import Login from "./login/Login";

const styles = {
    fadeInUpBig: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInUpBig, 'fadeInUpBig')
    },
    topNav: {
        width: '100%',
        height: '70px',
        position: 'fixed',
        zIndex: 100
    },
    mainLogo: {
        float: 'left',
        width: '200px',
        marginTop: '5px'
    }
};


class Main extends Component {
    componentDidMount = () => {
        var store = this.props.store;
        fillStoreFromLocalStorage(store).then(() => {
            this.forceUpdate();
        }, rejected => {
            this.props.history.push("/quote");
        });

        store.onAll().subscribe(({key, value}) => {
            localStorage.setItem("store_persisted", "true");
            localStorage.setItem("quotes_ran", "false");
            console.log('persisting', key, value);
            localStorage.setItem(key, value);
        });

    };

    render = () => {
        return(
            <StyleRoot>
                <Grommet theme={grommet}>
                    <Box style={{height: '100%'}} fill>
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Route path="/client" component={Client}/>
                            <Route path="/agent" component={Agent}/>
                            <Route component={QuotingTool}/>
                        </Switch>
                    </Box>
                </Grommet>
            </StyleRoot>
        )
    };
}

class QuotingTool extends Component {
    render() {
        return (
            <Box style={{height: '100%'}} fill={true} /*animation="fadeIn"*/>
                <nav style={styles.topNav}>
                    <Box fill style={{backgroundColor: 'white'}}>
                        <img src={img} alt="iq-logo" style={styles.mainLogo}/>
                    </Box>
                </nav>
                <Box className="quote-form-content" style={{paddingTop: 70}} direction="row" fill="horizontal">
                    <Switch>
                        <Route path="/application/status" component={AppStatus}/>
                        <Route exact path="/app" component={Application}/>
                        <Route exact path="/application" component={Application}/>
                        <Route path="/quote" component={Quote}/>
                        <Redirect to="/quote"/>
                    </Switch>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(Main);
