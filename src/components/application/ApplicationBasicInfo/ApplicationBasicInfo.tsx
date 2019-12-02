import React from "react";
import {Formik} from "formik";
import s from './ApplicationBasicInfo.module.scss';
import countries from '../../../util/country-by-abbreviation.json';
import states from 'insuqo-shared/constants/states.json';
import Cleave from "cleave.js/react";
import {Application} from "insuqo-shared";

interface ApplicationBasicInfoProps {
    application?: Application;
}

export const ApplicationBasicInfo: React.FunctionComponent<ApplicationBasicInfoProps> = (props) => {

    return (
        <>
            <Formik validate={validateApplication}
                    validateOnBlur={false}
                    validateOnMount={false}
                    validateOnChange={false}
                    initialValues={initialApplicationValues}
                    onSubmit={(values) => console.log(values)}>
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                  }) =>
                    <div className={s.container}>
                        <div className={s['form-container']}>
                            <form onSubmit={handleSubmit}>
                                <h1>Let's wrap this up.</h1>
                                <h2 className="purpleText">We just need a few more things to get you on your way.</h2>
                                <div className={s['personal-group']}>
                                    <h3>Personal Info</h3>
                                    <label htmlFor="firstName">First Name</label>
                                    <input onChange={handleChange} onBlur={handleBlur} value={values.firstName}
                                           name="firstName" className="input" placeholder="John"/>
                                    {errors.firstName && <span className={s['form-error']}>{errors.firstName}</span>}
                                    <label htmlFor="lastName">Last Name</label>
                                    <input onChange={handleChange} onBlur={handleBlur} value={values.lastName}
                                           name="lastName" className="input" placeholder="Smith"/>
                                    {errors.lastName && <span className={s['form-error']}>{errors.lastName}</span>}
                                </div>
                                <div className={s['citizenship-group']}>
                                    <h3>Citizenship</h3>
                                    <label htmlFor="countryOfBirth">Country of Birth</label>
                                    <select className="input select"
                                            name="countryOfBirth"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.countryOfBirth}
                                            placeholder="United States"
                                    >
                                        <option value={undefined} selected disabled key="-1">Select...</option>
                                        {countries.map((option, index) =>
                                            <option key={index}
                                                    value={option.abbreviation}>{option.country}</option>
                                        )}
                                    </select>
                                    {errors.countryOfBirth && <span className={s['form-error']}>{errors.countryOfBirth}</span>}
                                    <label htmlFor="ssn">Social Security Number</label>
                                    <span className="form-help">We are required to use this for validation purposes.</span>
                                    <Cleave placeholder="123-45-6789"
                                            name="ssn"
                                            className="input"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.ssn}
                                            options={{
                                                numericOnly: true,
                                                delimiter: '-',
                                                blocks: [3, 2, 4]
                                            }}
                                    />
                                    {errors.ssn && <span className={s['form-error']}>{errors.ssn}</span>}
                                    <div className={s['license-group']}>
                                        <h4>Driver's License Info</h4>
                                        <label htmlFor="dlState">Registered State</label>
                                        <select className="input select" value={values.dlState}
                                                name="dlState"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                        >
                                            <option key="-1" selected value={undefined}>Select...</option>
                                            {states.map((option, index) =>
                                                <option key={index} value={option.abbreviation}>{option.name}</option>
                                            )}
                                        </select>
                                        <label htmlFor="dlNum">License Code/Number</label>
                                        <Cleave
                                            name="dlNum"
                                            className="input"
                                            options={{
                                                blocks: [8],
                                                numericOnly: false,
                                                uppercase: true
                                            }}
                                            value={values.dlNum}
                                            onChange={handleChange}
                                            placeholder="F870684"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </Formik>
            {/*<Box fill align="center">*/}
            {/*    <Box style={{maxWidth: 800}} justify="start" margin="small">*/}
            {/*            <Box>*/}
            {/*                <Heading margin="xsmall" color="black" level={3}>Address</Heading>*/}
            {/*                <Box>*/}
            {/*                    <FormField label="Street Address">*/}
            {/*                        <TextInput value={addrLine1}*/}
            {/*                                   onChange={event => this.updateValue('addrLine1', event.target.value)}*/}
            {/*                                   placeholder="123 Mulberry Lane"/>*/}
            {/*                    </FormField>*/}
            {/*                    <FormField label="Apartment/Unit (Address Line 2)">*/}
            {/*                        <TextInput value={addrLine2}*/}
            {/*                                   onChange={event => this.updateValue('addrLine2', event.target.value)}*/}
            {/*                                   placeholder="10B"/>*/}
            {/*                    </FormField>*/}
            {/*                    <Box align="start">*/}
            {/*                        <Box wrap justify="start" align="center" margin="none" direction="row" gap="small">*/}
            {/*                            <Text color="#999" size="large"*/}
            {/*                                  weight="bold">{this.props.store.get('city')},</Text>*/}
            {/*                            <Text color="#999" size="large"*/}
            {/*                                  weight="bold">{this.props.store.get('stateName')}</Text>*/}
            {/*                            <Text color="#999" size="large"*/}
            {/*                                  weight="bold">{this.props.store.get('zipCode')}</Text>*/}
            {/*                            <Anchor onClick={this.showCityReasoning} size="small">Why can't I change my*/}
            {/*                                city?</Anchor>*/}
            {/*                        </Box>*/}

            {/*                    </Box>*/}
            {/*                </Box>*/}
            {/*            </Box>*/}
            {/*            <Box>*/}
            {/*                <Heading margin="xsmall" color="black" level={3}>Contact Info</Heading>*/}
            {/*                <FormField label="Email Address"*/}
            {/*                           error={emailError ? 'Please input a valid email address.' : undefined}*/}
            {/*                >*/}
            {/*                    <TextInput*/}
            {/*                        placeholder="jsmith@example.com"*/}
            {/*                        onChange={event => this.updateValue('primaryEmail', event.target.value)}*/}
            {/*                        onBlur={this.blurEmail}*/}
            {/*                    />*/}
            {/*                </FormField>*/}
            {/*                <FormField label="Primary Phone Number"*/}
            {/*                           error={pPhoneError ? 'Please input a valid phone number.' : undefined}*/}
            {/*                >*/}
            {/*                    <Box>*/}
            {/*                        <Cleave placeholder="(123) 456-7890"*/}
            {/*                                style={{*/}
            {/*                                    borderWidth: 0,*/}
            {/*                                    height: 46,*/}
            {/*                                    padding: 11,*/}
            {/*                                    fontWeight: 600,*/}
            {/*                                    outline: 'none'*/}
            {/*                                }}*/}
            {/*                                options={{*/}
            {/*                                    numericOnly: true,*/}
            {/*                                    blocks: [0, 3, 0, 3, 4],*/}
            {/*                                    delimiters: ['(', ')', ' ', '-']*/}
            {/*                                }}*/}
            {/*                                onChange={event => this.updateValue('primaryPhone', event.target.value)}*/}
            {/*                                onBlur={this.blurPPhoneNum}*/}
            {/*                        />*/}
            {/*                    </Box>*/}
            {/*                </FormField>*/}
            {/*            </Box>*/}
            {/*        </Box>*/}
            {/*        <Box>*/}
            {/*            <Heading margin="xsmall" level={2}>Plan Info</Heading>*/}
            {/*            <Box margin="xsmall">*/}
            {/*                <Heading margin="none" level={3}>Beneficiaries</Heading>*/}
            {/*                <Heading margin="none" color="gray" level={4}>Who is covered if the plan goes into*/}
            {/*                    effect?</Heading>*/}
            {/*                <BeneficiaryList onUpdate={this.updateBens}/>*/}
            {/*            </Box>*/}
            {/*            <Box margin="xsmall">*/}
            {/*                <Heading margin="none" level={3}>Payment Frequency</Heading>*/}
            {/*                <Heading margin="none" level={4}><Anchor className="purpleText" onClick={this.showFreqInfo}>Help*/}
            {/*                    me choose!</Anchor></Heading>*/}
            {/*                <Box direction="row">*/}
            {/*                    <Box fill margin="small" gap="small">*/}
            {/*                        <RadioButton checked={freq === 'month'} onChange={this.updateFreq} name="month"*/}
            {/*                                     label="Monthly"/>*/}
            {/*                        <RadioButton checked={freq === 'quarter'} onChange={this.updateFreq} name="quarter"*/}
            {/*                                     label="Quarterly"/>*/}
            {/*                        <RadioButton checked={freq === 'semiannual'} onChange={this.updateFreq}*/}
            {/*                                     name="semiannual" label="Semi-Annually"/>*/}
            {/*                        <RadioButton checked={freq === 'annual'} onChange={this.updateFreq} name="annual"*/}
            {/*                                     label="Annually"/>*/}
            {/*                    </Box>*/}
            {/*                    <Box align="center" justify="center" fill*/}
            {/*                         style={{backgroundColor: '#efecff', height: 'auto'}}>*/}
            {/*                        <Heading margin="none"*/}
            {/*                                 color={constants.colors.iqBrand}>${this.getPaymentByTerm()}</Heading>*/}
            {/*                        <Text className="purpleText">every <b>{this.getPaymentTerm()}</b></Text>*/}
            {/*                    </Box>*/}
            {/*                </Box>*/}
            {/*            </Box>*/}
            {/*            <Box style={{backgroundColor: '#FAFAFA', marginBottom: 20, padding: 20}} margin="xsmall">*/}
            {/*                <Heading margin="none" level={3}>Other Information</Heading>*/}
            {/*                <Text>Please select any of the following options <b>only</b> if they apply to you.</Text>*/}
            {/*                <Box margin="xsmall" fill gap="small">*/}
            {/*                    <CheckBox name="otherLifeInsurance" checked={otherLifeInsurance}*/}
            {/*                              onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>I currently have another life insurance plan.</Box>}/>*/}
            {/*                    <CheckBox name="oiWillReplace" checked={oiWillReplace}*/}
            {/*                              onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>This policy will replace or change my other policy.</Box>}/>*/}
            {/*                    <CheckBox name="oiPending" checked={oiPending} onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>I currently have another application pending with another*/}
            {/*                                  insurance company.</Box>}/>*/}
            {/*                    <CheckBox name="oiModified" checked={oiModified}*/}
            {/*                              onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>A previous application has been declined, postponed, or modified*/}
            {/*                                  after applying.</Box>}/>*/}
            {/*                    <CheckBox name="intendedParty" checked={intendedParty}*/}
            {/*                              onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>Another party, besides me, will obtain a right, title, or interest*/}
            {/*                                  in any policy issued on the life of the proposed insured as a result of*/}
            {/*                                  this application.</Box>}/>*/}
            {/*                    <CheckBox name="willFinance" checked={willFinance}*/}
            {/*                              onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>I will be taking out a loan or financing my premiums for this*/}
            {/*                                  plan.</Box>}/>*/}
            {/*                    <CheckBox name="willLiquidate" checked={willLiquidate}*/}
            {/*                              onChange={this.updateOtherLifeInsurance}*/}
            {/*                              label={<Box>This policy will be replaced through a 1035 exchange or*/}
            {/*                                  liquidation.</Box>}/>*/}
            {/*                </Box>*/}
            {/*            </Box>*/}
            {/*        </Box>*/}
            {/*        <Button primary*/}
            {/*                className="purpleBackground purpleOutline" label="Submit Application"*/}
            {/*                onClick={this.showConfirm}/>*/}
            {/*    </Box>*/}
            {/*</Box>*/}
        </>
    );
};

const initialApplicationValues = {
    firstName: '',
    lastName: '',
    countryOfBirth: undefined,
    ssn: '',
    dlState: undefined,
    dlNum: undefined
};

const validateApplication = (values: typeof initialApplicationValues) => {
    const errors: typeof values | any = {};

    if (!values.firstName || values.firstName.length < 2) {
        errors.firstName = 'First name must be 2 characters or longer.';
    }
    if (!values.lastName || values.lastName.length < 2) {
        errors.lastName = 'Last name must be 2 characters or longer.';
    }
    if (!values.countryOfBirth) {
        errors.countryOfBirth = 'Please choose a country.';
    }
    if (!values.ssn || values.ssn.replace(/-/g, '').length < 9) {
        errors.ssn = 'Please enter a valid social security number.';
    }

    return errors;
};
