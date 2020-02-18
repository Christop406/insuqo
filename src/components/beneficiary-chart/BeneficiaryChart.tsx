import React from 'react';
import { Beneficiary, Relationship } from '@insuqo/shared';
import { Doughnut } from 'react-chartjs-2';

interface BeneficiaryChartProps {
    beneficiaries?: Beneficiary[];
}

const BeneficiaryChart: React.FC<BeneficiaryChartProps> = ({ beneficiaries }) => {
    beneficiaries = beneficiaries || [];
    beneficiaries = prepareBeneficiaries(beneficiaries.filter((b) => !!b.percentage));
    return (
        <Doughnut
            legend={{ 
                display: false
            }}
            options={{
                responsive: true,
                maintainAspectRatio: true,
                showLines: false
            }}
            data={{
                labels: beneficiaries.map((b) => `${b.firstName} ${b.lastName}`),
                datasets: [{
                    data: beneficiaries.map((b) => b.percentage),
                    backgroundColor: getColors(beneficiaries),
                }]
            }} />
    );
};

const allowedColors = (index: number) => {
    switch (index % 3) {
        case 0:
            return '#9c37f2';
        case 1:
            return '#be59f4';
        case 2:
            return '#df7af6';
        default:
            return '#ff9cf8';
    }
};

const getColors = (beneficiaries: Beneficiary[]) => {

    const colors = beneficiaries.slice(0, -1).map((b, i) => allowedColors(i));

    if (beneficiaries[beneficiaries.length - 1].firstName !== 'Unassigned') {
        colors.push(allowedColors(beneficiaries.length - 1));
    }

    return colors;
};

const prepareBeneficiaries = (beneficiaries: Beneficiary[]) => {
    const percentage = beneficiaries.reduce((acc, curr) => {
        acc += curr.percentage;
        return acc;
    }, 0);
    if (percentage < 100) {
        return beneficiaries.concat([{
            firstName: 'Unassigned',
            lastName: '',
            middleInitial: '',
            relationship: Relationship.OTHER,
            suffix: '',
            percentage: 100 - percentage
        }]);
    }
    return [].concat(beneficiaries as any);
};


export default BeneficiaryChart;