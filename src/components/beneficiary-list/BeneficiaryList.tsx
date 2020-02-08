import React, { Component } from 'react';
import Store from '../../ApplicationStore';
import { Box, Button, Heading } from 'grommet/es6/index';
import { makeid } from '../../func';
import relations from '@insuqo/shared/constants/relations.json';
import { Text } from 'grommet';
import './beneficiary-list.scss';
import { Col, Row } from 'react-bootstrap';
import { Beneficiary } from '@insuqo/shared';
import { Store as S } from 'undux';
import Cleave from 'cleave.js/react';
import { Logger } from '../../services/logger';

declare type IBeneficiaryListProps = {
    onUpdate: (beneficiaries: Beneficiary[]) => void;
    store: S<any>;
    initialValue?: Beneficiary[];
}

interface IBeneficiaryListState {
    beneficiaries: Beneficiary[];
    forceRender: boolean;
    idCounter: number;
}

class BeneficiaryList extends Component<IBeneficiaryListProps, IBeneficiaryListState> {

    state = {
        beneficiaries: [] as Beneficiary[],
        idCounter: 0,
        forceRender: false,
    };

    addBeneficiary = () => {
        this.setState({
            beneficiaries: this.state.beneficiaries.concat({
                key: makeid(),
                firstName: '',
                middleInitial: '',
                lastName: '',
                relationship: '',
                percentage: ''
            } as Beneficiary | any)
        });
    };

    deleteBeneficiary = (index: number) => {
        Logger.log('deleted');
        const oldBens = this.state.beneficiaries.map(value => value);
        oldBens.splice(index, 1);
        this.setState({ beneficiaries: oldBens }, this.updateParent.bind(this));
    };

    updateBenInfo = (event: any, value: any, key: string) => {
        value[key] = event.target.value;
        this.updateParent();
        this.setState({ forceRender: !this.state.forceRender });
    };

    updateParent = () => {
        this.props.onUpdate(this.state.beneficiaries);
    };

    componentDidMount = () => {
        this.setState({ beneficiaries: this.props.initialValue || [] }, () => {
            if (this.state.beneficiaries.length < 1) {
                this.addBeneficiary();
            }
        });
    };

    displayBeneficiaries = () => {
        const { beneficiaries } = this.state;
        return beneficiaries.map((value, index) => {
            return (
                <Box margin={{ top: 'small', bottom: 'small' }} key={(value as any).key} pad="small" animation="zoomIn"
                    elevation="small" round="small" gap="small" fill="horizontal">
                    <Box fill wrap gap="small">
                        <Heading margin="xxsmall" level={3}>Beneficiary {index + 1}</Heading>
                        <Row>
                            <Col>
                                <Text className="field-label">First Name<span className="text-danger">*</span></Text>
                                <input className="input" value={value.firstName}
                                    onChange={(event) => this.updateBenInfo(event, value, 'firstName')}
                                    placeholder="Johnny" />
                            </Col>
                            <Col>
                                <Text className="field-label">Middle Initial</Text>
                                <Cleave className="input" value={value.middleInitial} options={{ blocks: [1], uppercase: true }}
                                    onChange={(event) => this.updateBenInfo(event, value, 'middleInitial')}
                                    placeholder="K" />
                            </Col>
                            <Col>
                                <Text className="field-label">Last Name<span className="text-danger">*</span></Text>
                                <input className="input" value={value.lastName}
                                    onChange={(event) => this.updateBenInfo(event, value, 'lastName')}
                                    placeholder="Rocket" />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Text className="field-label">Relationship to You<span className="text-danger">*</span></Text>
                                <select placeholder="Choose" className="input select"
                                    value={value.relationship}
                                    onBlur={(event) => this.updateBenInfo(event, value, 'relationship')}>
                                    {relations.map((option, index) => <option value={option.code}
                                        key={index}>{option.name}</option>)}
                                </select>
                            </Col>
                            <Col>
                                <Text className="field-label">Percentage of Payout<span className="text-danger">*</span></Text>
                                <input className="input"
                                    onChange={(event) => this.updateBenInfo(event, value, 'percentage')}
                                    value={value.percentage}
                                    type="number"
                                    placeholder="10%" />
                            </Col>
                        </Row>
                        <Box gap="small" flex="grow" justify="end" direction="row">
                            <button type="button" className="button primary outline"
                                onClick={() => this.deleteBeneficiary(index)}>Delete
                            </button>
                        </Box>
                    </Box>
                </Box>
            );
        });
    };

    render = () => {
        return (
            <Box>
                {this.displayBeneficiaries()}
                <Box fill="vertical" align="center" justify="center">
                    <Button onClick={this.addBeneficiary} className="addBenButton" label="Add Another Beneficiary"
                        margin="small" fill />
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(BeneficiaryList);
