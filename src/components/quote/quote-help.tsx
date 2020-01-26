import React from 'react';
import { Route, Switch, match } from 'react-router-dom';
import BeginHelp from './panes/begin/begin-help';
import PersonalHelp from './panes/personal/personal-help';
import PlanHelp from './panes/plan/plan-help';
import ResultsHelp from "./panes/results/results-help";

interface QuoteHelpComponentProps {
    match: match;
}

const QuoteHelp: React.FunctionComponent<QuoteHelpComponentProps> = (props) => {
    return (
        <Switch>
            <Route path={props.match.path + "/begin"} component={BeginHelp} />
            <Route path={props.match.path + "/personal"} component={PersonalHelp} />
            <Route path={props.match.path + "/plan"} component={PlanHelp} />
            <Route path={props.match.path + "/results"} component={ResultsHelp} />
        </Switch>
    );
}

export default QuoteHelp;
