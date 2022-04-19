import callFetchApi from './callFetchApi';
const url = "http://localhost:8080/product"

export const getAllProducts = async () => {
  const response =  await callFetchApi(url) || [];
  return response.map(product =>{
    return{
      ...product,
      key: product.id,
    }
  })
};

export const getProduct = async (key) => {
  return await callFetchApi(`${url}/${key}`);
};

export const addProduct = async (data) => {
  return await callFetchApi(url,'POST',data);
};

export const updateProduct = async (key, data) => {
  await callFetchApi(`${url}/${key}`,'PUT',data);
};

export const deleteProduct = async (key) => {
  await callFetchApi(`${url}/${key}`,'DELETE');
};
