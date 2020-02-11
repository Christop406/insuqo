import React, { Component } from 'react';
import Cleave from 'cleave.js/react';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style/css';
import SmokingPopover from './smoking-popover';
import classes from './personal.module.scss';
import { Checkbox } from '../../../../components/forms/Checkbox/Checkbox';
import { RadioOption, RadioGroup } from '../../../../components/forms/RadioGroup/RadioGroup';
import IQStore, { IQStoreProps } from '../../../../store/IQStore';
import GenderModal from './GenderModal';

interface PersonalProps extends IQStoreProps {
    updateBirthday: (birthday: string) => any;
    onSubmit: () => any;
    updateTobacco: (tobacco: boolean) => any;
    updateCannabis: (cannabis: boolean) => any;
    updateSex: (sex: 'male' | 'female') => any;
    birthDateError: boolean;
    birthDateMessage: string | undefined;
    tobacco: boolean;
    cannabis: boolean;
    birthDate: string | undefined;
    sex: 'male' | 'female' | 'none';
}

const styles = {
    quoteSubtitle: {
        marginTop: '-10px'
    },
    sexButtons: {
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 0
    }
};

class Personal extends Component<PersonalProps> {

    state = {
        sModalVisible: false
    };

    private sexOptions: RadioOption<string>[] = [
        { name: 'Male', value: 'male' },
        { name: 'Female', value: 'female' }
    ];


    showSmokingModal = () => {
        Modal.info({
            title: 'Why we need your smoking habits',
            centered: true,
            content: <SmokingPopover />
        });
    };

    showGenderModal = () => {
        Modal.info({
            title: 'Why can I only choose male or female?',
            centered: true,
            content: <GenderModal />
        }
        );
    };

    render = () => {
        const {
            store,
            updateBirthday,
            onSubmit,
            birthDateError,
            birthDateMessage,
            updateCannabis,
            updateTobacco,
            birthDate,
            updateSex,
            sex
        } = this.props;
        return (
            <div>
                <h1 className={classes.paneHeader} color="#9c37f2">The weather's fine
                    in {store.get('stateName') ? store.get('stateName') : 'XXXX'}!</h1>
                <h3 style={styles.quoteSubtitle}>(Because we've got you covered!)</h3>
                <p>
                    Before we can find quotes, we need to know a bit more about you as a person - let's start with your
                    age and sex.
                </p>
                <div className="qform-group">
                    <label className="qform-label" htmlFor="birthDate">Birthdate</label>
                    <div className={classes.birthdateContainer}>
                        <Cleave
                            name="birthDate"
                            style={{ borderColor: birthDateError ? '#f03434' : undefined }}
                            placeholder="MM/DD/YYYY"
                            className="input"
                            options={{ date: true, datePattern: ['m', 'd', 'Y'] }}
                            onChange={(e) => updateBirthday(e.target.value)}
                            value={birthDate}
                        />
                    </div>
                    {birthDateError ? <span className={classes.errorMessage}>{birthDateMessage}</span> : ''}
                </div>
                <div className="qform-group">
                    <label className="qform-label" htmlFor="sex">Sex</label>&nbsp;
                    <button className="button text text-primary" color="dark-4" onClick={this.showGenderModal}>Why are there only two options?</button>
                    <RadioGroup name="sex" value={sex} options={this.sexOptions} onChange={updateSex} />
                </div>
                <div className="qform-group">
                    <label className="qform-label" htmlFor="substance-cb">Lifestyle</label>
                    <p>
                        Select any of the answers below, if they apply to you.&nbsp;
                        <button className="button text text-primary" onClick={this.showSmokingModal}>Why?</button>
                    </p>
                    <div id="substance-cb" style={{ marginBottom: 20 }}>
                        <Checkbox
                            label="I regularly smoke tobacco products"
                            onChange={updateTobacco}
                            name="tobacco"
                        />
                        <Checkbox
                            label="I regularly use cannabis products"
                            onChange={updateCannabis}
                            name="cannabis"
                        />
                    </div>
                </div>
                <button onClick={onSubmit} className="button primary full"
                    disabled={(birthDate && birthDate.length < 10) || birthDateError || sex === 'none'}>Continue</button>
            </div>
        );
    };
}

export default IQStore.withStore(Personal);
