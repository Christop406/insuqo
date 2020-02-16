import React from 'react';
import { Beneficiary } from '@insuqo/shared';
import { Doughnut } from 'react-chartjs-2';

interface BeneficiaryChartProps {
    beneficiaries: Beneficiary[];
}

const BeneficiaryChart: React.FC<BeneficiaryChartProps> = ({ beneficiaries }) => {
    return (
        <Doughnut
            legend={{ position: 'left' }}
            options={{ responsive: true, maintainAspectRatio: true }}
            data={{
                labels: beneficiaries.map((b) => `${b.firstName} ${b.lastName}`),
                datasets: [{
                    data: beneficiaries.map((b) => b.percentage),
                    backgroundColor: allowedColors.slice(0, beneficiaries.length),
                }]
            }} />
    );
};

const allowedColors = [
    '#ff4949',
    '#fccb8f',
    '#facf5a',
    '#00bd56',
    '#0075f6'
];


export default BeneficiaryChart;