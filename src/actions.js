const ADD_PROPERTY = 'ADD_PROPERTY';

function addProperty(prop, val) {
    return {
        type: ADD_PROPERTY,
        [prop] : val
    }
}