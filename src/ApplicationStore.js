import { createConnectedStore } from 'undux';

export default createConnectedStore({
    started: false,
    fname: '',
    lname: '',
    zipCode: '',
    stateName: '',
    stateCode: '',
    city: '',
    birthdate: '',
    sex: '',
    tobacco: false,
    cannabis: false,
    covAmount: 0,
    termLength: 0
});