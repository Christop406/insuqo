import React from 'react';
import { ApplicationStatus, Application } from '@insuqo/shared';
import 'react-step-progress-bar/styles.css';
import { ProgressBar } from 'react-step-progress-bar';
import s from './ApplicationStatusView.module.scss';
import { ApplicationActivityLogItem } from '@insuqo/shared/types/logging';


interface StatusViewProps {
    application: Application | undefined;
    activityLog: ApplicationActivityLogItem[];
}

const statusInfo: Map<ApplicationStatus | undefined, { name: string; description: string; percent: number }> = new Map<ApplicationStatus, any>();
statusInfo.set(ApplicationStatus.Submitted, { name: 'Submitted', percent: 5, description: 'Your application has been submitted! It\'s in our hands now. We are working with your chosen carrier to set up your plan.' });
statusInfo.set(ApplicationStatus.InProgress, { name: 'In Progress', percent: 50, description: 'We have started the process of submitting your application to the carrier. If everything goes well, you should be hearing from them soon.' });
statusInfo.set(ApplicationStatus.Problem, { name: 'Problem', percent: 75, description: 'There was an issue processing your application. A member of our team will reach out to you shortly for more information.' });
statusInfo.set(ApplicationStatus.Done, { name: 'Done', percent: 100, description: 'Congratulations! Your application has been submitted to the carrier. You will be hearing from them soon to finalize your plan and coverage.' });

const getGradient = (status: ApplicationStatus | undefined): { start: string; end: string } => {
    let start = 'df82ff';
    let end = '9c37f2';
    switch (status) {
        case ApplicationStatus.Problem:
            start = 'EC9F05';
            end = 'FF4E00';
            break;
        case ApplicationStatus.Done:
            start = '5AFF15';
            end = '00B712';
    }
    return { start, end };
};

const ApplicationStatusView: React.FunctionComponent<StatusViewProps> = (props) => {
    const application = props.application;
    const activity = props.activityLog;
    const info = statusInfo.get(application?.status) || { name: 'Not Found', percent: 0, description: 'You have entered an invalid application ID.' };
    const gradient = getGradient(application?.status);
    return (
        <div className={s['status-view-container']}>
            <div className={s['status-view']}>
                <h1>{info.name}</h1>
                <div className={s['app-progress']}>
                    <ProgressBar
                        percent={info.percent}
                        filledBackground={`linear-gradient(to right, #${gradient.start}, #${gradient.end})`}
                    />
                </div>
                <div className={s['progress-description']}>{info.description}</div>
            </div>
            <div className={s.historyContainer}>
                <h2>Change History</h2>
                <ol>
                    {activity.map((item, index) => <li key={index}>{item.action} ({item.data}), time: {item.time}, performed by: {item.initiator} </li>)}
                </ol>
            </div>
        </div>
    );
};

export default ApplicationStatusView;