import callFetchApi from './callFetchApi';

export const getAllProducts = async () => {
  const response = await callFetchApi('https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json');
  let data = [];
  if (response) {
    data = Object.keys(response).map((key) => {
      return {
        key: key,
        name: response[key].name,
        price: response[key].price,
        quantity: response[key].quantity,
        desc: response[key].desc,
        origin: response[key].origin,
      };
    });
  }
  return data;
};

export const getProduct = async (key) => {
  const response = await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`);
  return response;
};

export const addProduct = async (data) => {
  
  const response = await callFetchApi('https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json','POST',data);
  return response.name;
};

export const updateProduct = async (key, data) => {
  await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`,'PUT',data);
};

export const deleteProduct = async (key) => {
  await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`,'DELETE');
};
