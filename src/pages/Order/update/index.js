import {useParams } from 'react-router-dom';
import OrderForm from '../components/OrderForm';

const UpdateOrder = () =>{
    const { id } = useParams();
    return <OrderForm orderId={id}/>
}

export default UpdateOrder