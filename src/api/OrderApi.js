import callFetchApi from './callFetchApi';

export const getAllOrders = async () => {
  const response = await callFetchApi('https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json');
  let data = [];
  if (response) {
    data = Object.keys(response).map((key) => {
      return {
        key: key,
        customerId: response[key].customerId,
        customerName: response[key].customerName,
        delivery: response[key].delivery,
        productNames: response[key].products?.map((product) => product.name),
        total: response[key].products?.reduce((prev, current) => prev + current.total,0),
        date: new Date(response[key].createAt).toLocaleDateString('en-GB'),
      };
    });
  }
  return data;
};

export const getOrder = async (key) => {
  const response = await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`);
  return response;
};

export const addOrder = async (data) => {
  const response = await callFetchApi('https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json','POST',data);
  return response.name;
};

export const updateOrder = async (key, data) => {
  await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`,'PUT',data);
};

export const deleteOrder = async (key) => {
  await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`,'DELETE');
};
