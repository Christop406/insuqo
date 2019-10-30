import React from 'react';
import {Text} from 'grommet';

const SmokingPopover: React.FunctionComponent = () => {
    return (
        <div>
            <Text>
                Each insurance company has a preference for the types of clients they want in their plans.
                Some carriers will give <em>better</em> rates to smokers, and some will give worse. Answering this
                question
                truthfully will give the most accurate quote results.
            </Text>
        </div>
    );
}

export default SmokingPopover;
