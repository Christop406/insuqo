import React, { Component } from 'react';
import Store from '../../../../ApplicationStore';
import { formatCovAmount } from "../../../../func";
import Modal from "antd/es/modal";
import 'antd/es/modal/style/css';
import PlanInfoModal from "./plan-info-modal";
import RiderInfoModal from "./rider-info-modal";
import { Store as S } from "undux";
import { History, LocationState } from "history";
import s from './plan.module.scss';
import { Slider } from '../../../forms/Slider/Slider';
import { RadioOption, RadioGroup } from '../../../forms/RadioGroup/RadioGroup';

interface IPlanProps {
    store: S<any>;
    history: History<LocationState>;
}

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    }
};

class Plan extends Component<IPlanProps> {

    state = {
        covAmount: 500000,
        termLength: 20,
        rider: 'none'
    };

    private riderOptions: RadioOption<string>[] = [
        { name: 'Accidental Death', value: 'accidental_death' },
        { name: 'Waiver of Premium', value: 'waiver_premium' },
        { name: 'Return of Premium', value: 'return_premium' },
        { name: 'Child Rider', value: 'child' },
        { name: 'None', value: 'none' }
    ];

    updateCovAmount = (covAmount: number) => {
        this.setState({ covAmount });
    };

    updateTermLength = (termLength: number) => {
        this.setState({ termLength });
    };

    updateRider = (rider: string) => {
        this.setState({ rider });
    };

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

    submitPlanInfo = () => {
        const store = this.props.store;
        const { covAmount, termLength, rider } = this.state;
        store.set('covAmount')(covAmount);
        store.set('termLength')(termLength);
        store.set('rider')(rider);
        this.props.history.push('/quote/results');
    };

    componentDidMount = () => {
        let cA = localStorage.getItem('covAmount');
        let tL = localStorage.getItem('termLength');
        let rd = localStorage.getItem('rider');
        if (cA == null) {
            cA = JSON.stringify(500000);
        }
        if (tL === null || tL === undefined || tL.length === 0) {
            // todo: implement
        }

        if (rd == null || rd.length === 0) {
            rd = 'none';
        }

        this.setState({ covAmount: cA, rider: rd });
    };

    render = () => {
        const { covAmount, termLength, rider } = this.state;
        return (
            <div>
                <h1 className={s.paneHeader}>Choose your coverage.</h1>
                <h3 style={styles.quoteSubtitle}>You can change these values later.</h3>
                <p style={{ maxWidth: '600px' }}>
                    These values help insurers calculate how much you need to pay for your insurance. <a onClick={this.showHelpMeChoose}>Help me choose!</a>
                </p>
                <h3 className={s.paneHeader}>Coverage Amount</h3>
                <div className={s.slider}>
                    <Slider name="covAmount"
                        initialValue={500000}
                        stepSize={10000}
                        min={100000}
                        max={2000000}
                        onChange={this.updateCovAmount}
                    />
                    <h2>$ {formatCovAmount(covAmount)}</h2>
                </div>
                <h3 className={s.paneHeader}>Term Length</h3>
                <div className={s.slider}>
                    <Slider name="termLength"
                        initialValue={20}
                        stepSize={5}
                        min={5}
                        max={30}
                        onChange={this.updateTermLength}
                    />
                    <h2>{termLength} Years</h2>
                </div>
                <div>
                    <h2 className={s.paneHeader}>Other Options</h2>
                    <h3 className={s.paneHeader}>Riders</h3>
                    <p><a style={{ marginTop: -10 }} onClick={this.showRiderInfo}>What are these?</a></p>
                    <RadioGroup name="rider" value={rider} options={this.riderOptions} onChange={this.updateRider} />
                </div>
                <button onClick={this.submitPlanInfo} className="button primary full">Get Quotes</button>
            </div>
        );
    };
}

export default Store.withStore(Plan);
