import callApi from './callApi';

export const getAllProducts = async () => {
  const response = await callApi(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json'
  );
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
  const response = await fetch(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`
  );
  const data = await response.json();
  return data;
};

export const addProduct = async (data) => {
  const bodyData = {
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    origin: data.origin,
    desc: data.desc,
  };
  const response = await callApi(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/products.json',
    'POST',
    bodyData
  );
  return response.name;
};

export const updateProduct = async (data) => {
  const key = data.key;
  const bodyData = {
    name: data.name,
    quantity: data.quantity,
    price: data.price,
    origin: data.origin,
    desc: data.desc,
  };
  await callApi(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`,
    'PUT',
    bodyData
  );
};

export const deleteProduct = async (key) => {
  await callApi(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/products/${key}.json`,
    'DELETE'
  );
};
