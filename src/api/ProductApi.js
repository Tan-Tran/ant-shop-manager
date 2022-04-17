import callFetchApi from './callFetchApi';

export const getAllProducts = async () => {
  const response = await callFetchApi('https://shop-database-e29d3-default-rtdb.firebaseio.com/products.json');
  return Object.keys(response).map((key) => ({
    ...response[key],
    key: key,
   }),[])
};

export const getProduct = async (key) => {
  return await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/products/${key}.json`);
};

export const addProduct = async (data) => {
  
  const response = await callFetchApi('https://shop-database-e29d3-default-rtdb.firebaseio.com/products.json','POST',data);
  return response.name;
};

export const updateProduct = async (key, data) => {
  await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/products/${key}.json`,'PUT',data);
};

export const deleteProduct = async (key) => {
  await callFetchApi(`https://shop-database-e29d3-default-rtdb.firebaseio.com/products/${key}.json`,'DELETE');
};
