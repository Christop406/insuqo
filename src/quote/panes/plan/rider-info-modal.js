import React, { Component } from 'react';
import {Box, Heading, Paragraph} from "grommet";

class RiderInfoModal extends Component {
    render() {
        return (
            <Box style={{maxWidth: 500}}>
                <Heading level={3}>What are riders?</Heading>
                <Paragraph margin={{bottom: "small"}}>
                    <b>Riders</b> are additional features added to your life insurance plan
                    that stay active over the life of the plan.
                </Paragraph>
                <Heading level={3}>Types of Riders</Heading>
                <Heading level={4}>Accidental Death Benefit</Heading>
                <Paragraph margin={{bottom: "small"}}>
                    This rider adds an extra layer of payment in the event that a pre-determined,
                    accidental event is the cause of the policyholder's death.
                </Paragraph>
                <Heading level={4}>Waiver of Premium</Heading>
                <Paragraph margin={{bottom: "small"}}>
                    This rider waives premium payments in the event the policyholder becomes
                    critically ill, seriously injured, or disabled.
                </Paragraph>
                <Heading level={4}>Return of Premium</Heading>
                <Paragraph margin={{bottom: "small"}}>
                    This rider returns the premiums paid if the policyholder outlives the policy.
                </Paragraph>
                <Heading level={4}>Child Rider</Heading>
                <Paragraph margin={{bottom: "small"}}>
                    This rider allows a policyholder's children to be covered under his/her life insurance
                    policy, without having to purchase a second policy.
                </Paragraph>
            </Box>
        );
    }
}

export default RiderInfoModal;