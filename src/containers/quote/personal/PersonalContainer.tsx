import React from 'react';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Personal from './components/Personal';
import dayjs from 'dayjs';

interface PersonalContainerProps extends IQStoreProps, RouteComponentProps { }
interface PersonalContainerState {
    birthDate: string;
    sex: 'male' | 'female' | 'none';
    tobacco: boolean;
    cannabis: boolean;
    bdError: boolean;
    bdErrMsg: string | undefined;
}

class PersonalContainer extends React.Component<PersonalContainerProps, PersonalContainerState> {

    state: PersonalContainerState = {
        birthDate: '',
        sex: 'none',
        tobacco: false,
        cannabis: false,
        bdError: false,
        bdErrMsg: undefined,
    };

    private updateBirthday = (birthDate: string) => {
        console.log(birthDate);
        const bd = dayjs(birthDate, 'MM/DD/YYYY');
        const now = dayjs();

        if (birthDate.length > 8 && now.isBefore(bd)) {
            this.setState({ birthDate, bdError: true, bdErrMsg: 'Please input a valid birthdate.' });
        } else if (birthDate.length > 8 && now.subtract(18, 'year').isBefore(bd)) {
            this.setState({
                birthDate,
                bdError: true,
                bdErrMsg: 'You must be 18 years or older to use this service.'
            });
        } else {
            this.setState({ birthDate, bdError: false, bdErrMsg: undefined });
        }
    };

    private validateBirthdate = () => {
        // todo - implement
        return true;
    };

    private updateTobacco = () => {
        const { tobacco } = this.state;
        this.setState({ tobacco: !tobacco });
    };

    private updateCannabis = () => {
        const { cannabis } = this.state;
        this.setState({ cannabis: !cannabis });
    };

    private updateSex = (sex: 'male' | 'female' | 'none') => {
        this.setState({ sex });
    };

    private submitPersonalInfo = () => {
        if (this.validateBirthdate()) {
            const store = this.props.store;
            const { birthDate, sex, tobacco, cannabis } = this.state;
            store.set('birthDate')(dayjs(birthDate, 'MM/DD/YYYY').format('YYYY-MM-DD'));
            store.set('sex')(sex);
            store.set('tobacco')(tobacco);
            store.set('cannabis')(cannabis);
            this.props.history.push('/quote/plan');
        }
    };

    render = () => {
        const { bdError, bdErrMsg, tobacco, cannabis, birthDate, sex } = this.state;
        return <Personal
            sex={sex}
            updateSex={this.updateSex}
            birthDate={birthDate}
            updateCannabis={this.updateCannabis}
            updateTobacco={this.updateTobacco}
            tobacco={tobacco}
            cannabis={cannabis}
            birthDateError={bdError}
            birthDateMessage={bdErrMsg}
            onSubmit={this.submitPersonalInfo}
            updateBirthday={this.updateBirthday} />;
    };
}

export default IQStore.withStore(withRouter(PersonalContainer));
