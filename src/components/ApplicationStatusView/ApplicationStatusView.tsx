import React from 'react';
import {ApplicationStatus} from 'insuqo-shared';
import 'react-step-progress-bar/styles.css';
import {ProgressBar} from 'react-step-progress-bar';
import './ApplicationStatusView.scss';


interface StatusViewProps {
    status: ApplicationStatus | undefined;
}

const statusInfo: Map<ApplicationStatus, { name: string; description: string; percent: number }> = new Map<ApplicationStatus, any>();
statusInfo.set(ApplicationStatus.NEW, {name: 'Started', percent: 5, description: 'Your application has been submitted! It\'s in our hands now. We are working with your chosen carrier to set up your plan.'});
statusInfo.set(ApplicationStatus.IN_PROGRESS, {name: 'In Progress', percent: 50, description: 'We have started the process of submitting your application to the carrier. If everything goes well, you should be hearing from them soon.'});
statusInfo.set(ApplicationStatus.PROBLEM, {name: 'Problem', percent: 75, description: 'There was an issue processing your application. A member of our team will reach out to you shortly for more information.'});
statusInfo.set(ApplicationStatus.DONE, {name: 'Done', percent: 100, description: 'Congratulations! Your application has been submitted to the carrier. You will be hearing from them soon to finalize your plan and coverage.'});

const getGradient = (status: ApplicationStatus): { start: string; end: string } => {
    let start = 'df82ff';
    let end = '9c37f2';
    switch (status) {
        case ApplicationStatus.PROBLEM:
            start = 'EC9F05';
            end = 'FF4E00';
            break;
        case ApplicationStatus.DONE:
            start = '5AFF15';
            end = '00B712';
    }
    return {start, end};
};

export const ApplicationStatusView: React.FunctionComponent<StatusViewProps> = (props) => {
    const status = props.status as ApplicationStatus;
    const info = statusInfo.get(status) || {name: 'Not Found', percent: 0, description: 'You have entered an invalid application ID.'};
    const gradient = getGradient(status);
    return (
        <div className="status-view">
            <h1>{info.name}</h1>
            <div className="app-progress">
                <ProgressBar
                    percent={info.percent}
                    filledBackground={`linear-gradient(to right, #${gradient.start}, #${gradient.end})`}
                />
            </div>
            <div className="progress-description">{info.description}</div>
        </div>
    );
};
