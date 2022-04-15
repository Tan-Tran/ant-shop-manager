import callFetchApi from './callFetchApi';

export const getAllCustomers = async () => {
  const response = await callFetchApi('https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json');
  let data = [];
  if (response) {
    data = Object.keys(response).map((key) => {
      return {
        key: key,
        name: response[key].name,
        address: response[key].address,
        dateOfBirth: response[key].dateOfBirth,
        phone: response[key].phone,
      };
    });
  }
  return data;
};

export const getCustomer = async (key) => {
  const response = await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`);
  return response;
};

export const addCustomer = async (data) => {
  const response = await callFetchApi('https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json','POST',data);
  return response.name;
};

export const updateCustomer = async (key, data) => {
  await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`,'PUT',data);
};

export const deleteCustomer = async (key) => {
  await callFetchApi(`https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`,'DELETE');
};
