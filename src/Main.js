import React, { Component }  from 'react';
import Store from './ApplicationStore';
import Quote  from './quote/quote';
import Application from './application/application';
import { fadeInUpBig } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import {Box, Grommet} from 'grommet';
import { grommet } from 'grommet/themes';
import { Route, Switch, Redirect } from 'react-router-dom';
import img from './img/insuqo-logo.png';
import {fillStoreFromLocalStorage} from "./func";

const styles = {
    fadeInUpBig: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInUpBig, 'fadeInUpBig')
    },
    topNav: {
        width: '100%',
        height: '70px',
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
        fillStoreFromLocalStorage(store).then(value => {
            this.forceUpdate();
        }, rejected => {
            this.props.history.push("/quote");
        });

        store.onAll().subscribe(({key, value}) => {
            localStorage.setItem("store_persisted", "true");
            console.log('persisting', key, value);
            localStorage.setItem(key, value);
        });

    };

    render = () => {
        return(
            <StyleRoot>
                <Grommet full theme={grommet}>
                    <Box fill={true} animation="fadeIn">
                        <nav style={styles.topNav}>
                            <img src={img} alt="iq-logo" style={styles.mainLogo}/>
                        </nav>
                        <Box direction="row" fill="horizontal">
                            <Switch>
                                <Route path="/app" component={Application}/>
                                <Route path="/application" component={Application}/>
                                <Route path="/quote" component={Quote}/>
                                <Redirect to="/quote"/>
                            </Switch>
                        </Box>
                    </Box>
                </Grommet>
            </StyleRoot>
        )
    };
}

export default Store.withStore(Main);