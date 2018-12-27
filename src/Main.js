import React, { Component }  from 'react';
import Store from './ApplicationStore';
import Quote  from './quote/quote';
import QuoteHelp from './quote/quote-help';
import Application from './application/application';
import { fadeInUpBig } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import {Box, Grommet} from 'grommet';
import { grommet } from 'grommet/themes';
import { Route, Switch, Redirect } from 'react-router-dom';
import img from './img/insuqo-logo.png';

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
        let store = this.props.store;
        store.set('fname')('Chris');
        store.set('lname')('Gilardi');
    };

    getAlignment = () => {
        console.log(this.props.location.pathname);
        console.log(this.props.location.pathname === "/quote/results");
        if(this.props.location.pathname === "/quote/results") return 'start';
        return 'start';
    };

    render = () => {
        return(
            <StyleRoot>
                <Grommet full theme={grommet}>
                    <Box animation="fadeIn">
                        <nav style={styles.topNav}>
                            <img src={img} alt="iq-logo" style={styles.mainLogo}/>
                        </nav>
                        <Box direction="row">
                            <Box alignSelf="stretch" align={this.getAlignment()}>
                                <Switch>
                                    <Route path="/app" component={Application}/>
                                    <Route path="/application" component={Application}/>
                                    <Route path="/quote" component={Quote}/>
                                    <Redirect to="/quote"/>
                                </Switch>
                            </Box>
                            <Box alignSelf="stretch">
                                <Switch>
                                    <Route path="/quote" component={QuoteHelp}/>
                                </Switch>
                            </Box>
                        </Box>
                    </Box>
                </Grommet>
            </StyleRoot>
        )
    };
}

export default Store.withStore(Main);