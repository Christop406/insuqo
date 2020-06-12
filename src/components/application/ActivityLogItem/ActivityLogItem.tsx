import React from 'react';
import { ApplicationActivityLogItem, ApplicationActivityAction, Initiator } from '@insuqo/shared/types/logging';
import s from './ActivityLogItem.module.scss';
import dayjs from 'dayjs';
import { StatusUtil } from 'util/status.util';

interface ActivityLogItemProps {
    item: ApplicationActivityLogItem;
}

export const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ item }) => {
    return (
        <div className={s.logItemContainer}>
            <span className={s.itemTitle}>{statusTitleMap.get(item.action)}</span>
            <span className={s.itemDescription}>{getDescription(item.action, item.initiator, item.data)}</span>
            <span className={s.itemTime}>{dayjs(item.time).format('MMM d, YYYY h:mmA')}</span>
        </div>
    );
};

const statusTitleMap = new Map<ApplicationActivityAction, string>();
statusTitleMap.set(ApplicationActivityAction.StatusUpdate, 'Status Update');
statusTitleMap.set(ApplicationActivityAction.Submitted, 'Application Submitted');

const getDescription = (action: ApplicationActivityAction, initiator: Initiator, data?: any): string => {
    switch (action) {
        case ApplicationActivityAction.StatusUpdate:
            return `${initiator === Initiator.Admin ? 'We' : 'You'} updated the status of this application to "${StatusUtil.formatApplicationStatus(data)}."`;
        case ApplicationActivityAction.Submitted:
            return 'You submitted your application.';
    }
};