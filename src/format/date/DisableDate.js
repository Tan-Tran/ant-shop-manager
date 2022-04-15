import moment from 'moment';
const DisableDate = (current) =>{
    return current && current > moment().endOf('day');
}

export default DisableDate