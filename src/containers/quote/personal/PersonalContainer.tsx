import React from 'react';
import IQStore, { IQStoreProps } from '../../../store/IQStore';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Personal from './components/Personal';
import dayjs from 'dayjs';
import { Sex } from '@insuqo/shared';
import { QuoteService } from 'services/quote.service';

interface PersonalContainerProps extends IQStoreProps, RouteComponentProps { }
interface PersonalContainerState {
    birthDate: string | undefined;
    sex: Sex | undefined;
    tobacco: boolean | undefined;
    cannabis: boolean | undefined;
    bdError: boolean;
    bdErrMsg: string | undefined;
}

class PersonalContainer extends React.Component<PersonalContainerProps, PersonalContainerState> {

    state: PersonalContainerState = {
        birthDate: '',
        sex: undefined,
        tobacco: undefined,
        cannabis: undefined,
        bdError: false,
        bdErrMsg: undefined,
    };

    private quoteService: QuoteService;

    constructor(props: PersonalContainerProps) {
        super(props);
        this.quoteService = new QuoteService();
    }

    public componentDidMount() {
        const { quote } = this.props.store.getState();
        this.setState({
            sex: quote?.sex,
            tobacco: quote?.tobacco,
            cannabis: quote?.cannabis,
            birthDate: quote?.birthdate,
        });
    }

    private updateBirthday = (birthDate: string) => {
        // console.log(birthDate);
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
        // console.log(tobacco, !tobacco);
        this.setState({ tobacco: !tobacco });
    };

    private updateCannabis = () => {
        const { cannabis } = this.state;
        this.setState({ cannabis: !cannabis });
    };

    private updateSex = (sex: Omit<Sex, Sex.UNKNOWN>) => {
        this.setState({ sex: sex as Sex });
        // console.log('updated to', sex);
    };

    private submitPersonalInfo = async () => {
        if (this.validateBirthdate()) {
            const store = this.props.store;
            const { birthDate, sex, tobacco, cannabis } = this.state;
            const currentQuote = store.get('quote');

            if (!currentQuote) {
                throw new Error('No current quote');
            }

            const updatedQuote = await this.quoteService.updateQuoteRecord(currentQuote.id, {
                birthdate: birthDate,
                sex,
                tobacco,
                cannabis,
            });

            store.set('quote')(updatedQuote);
            this.props.history.push(`/quote/${updatedQuote.id}/plan`);
        }
    };

    render = () => {
        const { bdError, bdErrMsg } = this.state;
        let { sex, birthDate, tobacco, cannabis } = this.state;
        const { store } = this.props;
        const quote = store.get('quote');
        const location = store.get('location');

        sex = sex === undefined ? quote?.sex : sex;
        birthDate = birthDate === undefined ? quote?.birthdate : birthDate;
        tobacco = tobacco === undefined ? !!(quote?.tobacco) : tobacco;
        cannabis = cannabis === undefined ? !!(quote?.cannabis) : cannabis;

        // TODO: get this (all values) updating correctly and auto-fill them on load
        // console.log(sex, birthDate);
        
        return <Personal
            location={location}
            sex={sex}
            tobaccoChecked={tobacco}
            cannabisChecked={cannabis}
            birthdate={birthDate}
            updateSex={this.updateSex}
            updateCannabis={this.updateCannabis}
            updateTobacco={this.updateTobacco}
            birthDateError={bdError}
            birthDateMessage={bdErrMsg}
            onSubmit={this.submitPersonalInfo}
            updateBirthday={this.updateBirthday} />;
    };
}

export default IQStore.withStore(withRouter(PersonalContainer));
