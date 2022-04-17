import callFetchApi from './callFetchApi';
// import moment from 'moment';
// import { FormatDate_DD_MM_YYY } from '../constant/FormatDate';

export const getAllCustomers = async () => {
  const response = await callFetchApi('https://shop-database-e29d3-default-rtdb.firebaseio.com/customers.json') || {};
  return Object.keys(response).map((key) => ({
   ...response[key],
   key: key,
  }),[])
};

export const getCustomer = async (key) => {
  return await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/customers/${key}.json`);
};

export const addCustomer = async (data) => {
  const response = await callFetchApi('https://shop-database-e29d3-default-rtdb.firebaseio.com/customers.json','POST',data);
  return response.name;
};

export const updateCustomer = async (key, data) => {
  await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/customers/${key}.json`,'PUT',data);
};

export const deleteCustomer = async (key) => {
  await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/customers/${key}.json`,'DELETE');
};
