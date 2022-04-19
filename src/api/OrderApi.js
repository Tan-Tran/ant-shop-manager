import callFetchApi from './callFetchApi';
const url = "http://localhost:8080/order"

export const getAllOrders = async () => {
  const response = await callFetchApi(url) || [];
  return response.map((key) => ({
    ...response,
    key: response.id,
    productNames: response.products?.map((product) => product.name),
    total: response.products?.reduce((prev, current) => prev + current.total,0),
    date: new Date(response.createAt).toLocaleDateString('en-GB'),
   }),[])
};

export const getOrder = async (key) => {
  return await callFetchApi(`${url}/${key}`);
};

export const addOrder = async (data) => {
   return await callFetchApi(`${url}/new`,'POST',data);
};

export const updateOrder = async (key, data) => {
  await callFetchApi(`${url}/${key}`,'PUT',data);
};

export const deleteOrder = async (key) => {
  await callFetchApi(`${url}/${key}`,'DELETE');
};
