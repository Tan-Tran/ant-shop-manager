import callFetchApi from './callFetchApi';

export const getAllOrders = async () => {
  const response = await callFetchApi('https://shop-database-e29d3-default-rtdb.firebaseio.com/orders.json') || {};
  return Object.keys(response).map((key) => ({
    ...response[key],
    key: key,
    productNames: response[key].products?.map((product) => product.name),
    total: response[key].products?.reduce((prev, current) => prev + current.total,0),
    date: new Date(response[key].createAt).toLocaleDateString('en-GB'),
   }),[])
};

export const getOrder = async (key) => {
  return await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/orders/${key}.json`);
};

export const addOrder = async (data) => {
  const response = await callFetchApi('https://shop-database-e29d3-default-rtdb.firebaseio.com/orders.json','POST',data);
  return response.name;
};

export const updateOrder = async (key, data) => {
  await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/orders/${key}.json`,'PUT',data);
};

export const deleteOrder = async (key) => {
  await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/orders/${key}.json`,'DELETE');
};
