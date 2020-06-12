import { ApplicationStatus } from '@insuqo/shared';

const statusNameMap: {[status in ApplicationStatus]: string} = {
    [ApplicationStatus.New]: 'New',
    [ApplicationStatus.Draft]: 'Draft',
    [ApplicationStatus.InProgress]: 'In Progress',
    [ApplicationStatus.AwaitingPayment]: 'Awaiting Payment',
    [ApplicationStatus.Submitted]: 'Submitted',
    [ApplicationStatus.Problem]: 'Problem',
    [ApplicationStatus.Done]: 'Done'
};

export class StatusUtil {
    public static formatApplicationStatus(status: ApplicationStatus | undefined): string {
        if (!status) {
            return 'Unknown';
        }
        return statusNameMap[status];
    }
}