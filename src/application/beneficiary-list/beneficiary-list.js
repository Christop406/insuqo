import React, {Component} from 'react';
import Store from '../../ApplicationStore';
import {Box, Button, Heading, TextInput} from "grommet/es6/index";
import {makeid} from '../../func';
import relations from '../relations';
import {Text} from "grommet";
import './beneficiary-list.scss';
import {Col, Row} from "react-bootstrap";

class BeneficiaryList extends Component {

    state = {
        beneficiaries: [],
        idCounter: 0,
        forceRender: false
    };

    addBeneficiary = () => {
        this.setState({
            beneficiaries: this.state.beneficiaries.concat({
                key: makeid(),
                fname: '',
                middleI: '',
                lname: '',
                rel: '',
                share: ''
            })
        });
    };

    deleteBeneficiary = index => {
        let oldBens = this.state.beneficiaries.map(value => value);
        oldBens.splice(index, 1);
        this.setState({beneficiaries: oldBens});
    };

    updateBenInfo = (event, value, key) => {
        value[key] = event.target.value;
        this.updateParent(event);
        this.setState({forceRender: !this.state.forceRender});
    };

    updateParent = event => {
        this.props.onUpdate(this.state.beneficiaries);
    };

    componentDidMount = () => {
        this.addBeneficiary();
    };

    displayBeneficiaries = () => {
        const {beneficiaries} = this.state;
        return beneficiaries.map((value, index) => {
            return (
                <Box margin={{top: 'small', bottom: 'small'}} key={value.key} pad="small" animation="zoomIn"
                     elevation="small" round="small" gap="small" fill="horizontal">
                    <Box fill wrap gap="small">
                        <Heading margin="xxsmall" level={3}>Beneficiary {index + 1}</Heading>
                        <Row>
                            <Col>
                                <Text className="field-label">First Name</Text>
                                <TextInput onChange={(event) => this.updateBenInfo(event, value, 'fname')}
                                           placeholder="Johnny"/>
                            </Col>
                            <Col>
                            <Text className="field-label">Middle Initial</Text>
                            <TextInput onChange={(event) => this.updateBenInfo(event, value, 'middleI')}
                                       placeholder="K"/>
                            </Col>
                            <Col>
                                <Text className="field-label">Last Name</Text>
                                <TextInput onChange={(event) => this.updateBenInfo(event, value, 'lname')}
                                           placeholder="Rocket"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Text className="field-label">Relationship to You</Text>
                                <select placeholder="Choose" className="rel-select"
                                        onChange={(event) => this.updateBenInfo(event, value, 'rel')}
                                        children={relations.map((option, index) => <option value={option.code}
                                                                                           key={index}>{option.name}</option>)}/>
                            </Col>
                            <Col>
                                <Text className="field-label">Percentage of Payout</Text>
                                <TextInput onChange={(event) => this.updateBenInfo(event, value, 'share')}
                                           type="number"
                                           placeholder="10%"/>
                            </Col>
                        </Row>
                        <Box gap="small" flex="grow" justify="end" direction="row">
                            <Button className="purpleText purpleOutline" onClick={() => this.deleteBeneficiary(index)}
                                    label={"Delete"}/>
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
                            round="small" margin="small" align="center" fill/>
                </Box>
            </Box>
        );
    }
}

export default Store.withStore(BeneficiaryList);
