import React, { Component } from 'react';
import {Anchor, Box, Button, FormField, Heading, Paragraph, Text, TextInput} from "grommet";

class PlanInfoModal extends Component {

    render() {
        return(
            <Box style={{maxWidth: 500}}>
                <Paragraph>
                    <b>Choosing the right amount of coverage can be daunting.</b><br/><br/> That's why we've created a handy calculator
                    for you to figure out how much coverage you need. <br/><br/>Please
                    <Anchor target="_blank" href="https://insuqo.com/calculator" label=" click here "/>
                    to open the calculator. (It will open in a new window)
                </Paragraph>
            </Box>
        );
    }
}

export default PlanInfoModal;