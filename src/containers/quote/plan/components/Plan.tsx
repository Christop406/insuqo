import React, { Component } from 'react';
import { formatCovAmount } from '../../../../func';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style/css';
import PlanInfoModal from './plan-info-modal';
import RiderInfoModal from './rider-info-modal';
import s from './Plan.module.scss';
import { Slider } from '../../../../components/forms/Slider/Slider';
import { RadioOption, RadioGroup } from '../../../../components/forms/RadioGroup/RadioGroup';
import IQStore, { IQStoreProps } from '../../../../store/IQStore';
import { QuoteRider } from '@insuqo/shared';

interface PlanProps extends IQStoreProps {
    onSubmit: () => any;
    onUpdateCoverage: (coverage: number) => any;
    onUpdateTermLength: (len: number) => any;
    onUpdateRider: (rider: QuoteRider) => any;
    rider: QuoteRider | undefined;
    termLength: number;
    coverageAmount: number;
}

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    }
};

class Plan extends Component<PlanProps> {

    private readonly riderOptions: RadioOption<string | undefined>[] = [
        { name: 'Accidental Death', value: QuoteRider.AccidentalDeath },
        { name: 'Waiver of Premium', value: QuoteRider.WaiverOfPremium },
        { name: 'Return of Premium', value: QuoteRider.ReturnOfPremium },
        { name: 'Child Rider', value: QuoteRider.ChildRider },
        { name: 'None', value: '' }
    ];

    showHelpMeChoose = () => {
        Modal.info({
            title: 'How to choose the right coverage',
            content: <PlanInfoModal />,
            centered: true
        });
    };

    showRiderInfo = () => {
        Modal.info({
            title: 'More on Riders',
            content: <RiderInfoModal />,
            centered: true
        });
    };

    render = () => {
        const {
            onSubmit,
            onUpdateCoverage,
            onUpdateTermLength,
            onUpdateRider,
            rider,
            termLength,
            coverageAmount
        } = this.props;

        return (
            <div>
                <h1 className={s.paneHeader}>Choose your coverage.</h1>
                <h3 style={styles.quoteSubtitle}>You can change these values later.</h3>
                <p style={{ maxWidth: '600px' }}>
                    These values help insurers calculate how much you need to pay for your insurance. <button className="button text" onClick={this.showHelpMeChoose}>Help me choose!</button>
                </p>
                <h3 className={s.paneHeader}>Coverage Amount</h3>
                <div className={s.slider}>
                    <Slider name="covAmount"
                        initialValue={coverageAmount}
                        stepSize={10000}
                        min={100000}
                        max={2000000}
                        onChange={onUpdateCoverage}
                    />
                    <h2>$ {formatCovAmount(coverageAmount)}</h2>
                </div>
                <h3 className={s.paneHeader}>Term Length</h3>
                <div className={s.slider}>
                    <Slider name="termLength"
                        initialValue={termLength}
                        stepSize={5}
                        min={5}
                        max={30}
                        onChange={onUpdateTermLength}
                    />
                    <h2>{termLength} Years</h2>
                </div>
                <div>
                    <h2 className={s.paneHeader}>Other Options</h2>
                    <h3 className={s.paneHeader}>Riders</h3>
                    <p><button className="button text" style={{ marginTop: -10 }} onClick={this.showRiderInfo}>What are these?</button></p>
                    <RadioGroup name="rider" value={rider || ''} options={this.riderOptions} onChange={onUpdateRider} />
                </div>
                <button onClick={onSubmit} className="button primary full">Get Quotes</button>
            </div>
        );
    };
}

export default IQStore.withStore(Plan);
