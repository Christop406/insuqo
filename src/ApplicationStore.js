import { createConnectedStore } from 'undux';

export default createConnectedStore({
    started: false,
    fname: '',
    lname: '',
    zipCode: '',
    stateName: '',
    stateCode: '',
    city: ''
});