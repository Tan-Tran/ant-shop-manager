import callApi from './callApi';

export const getAllCustomers = async () => {
  const response = await callApi(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json'
  );
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

export const getCustomerById = async (key) => {
  const response = await callApi(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`
  );
  return response;
};

export const addCustomer = async (data) => {
  const bodyData = {
    name: data.name,
    address: data.address,
    dateOfBirth: data.dateOfBirth,
    phone: data.phone,
  };
  const response = await callApi(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/customers.json',
    'POST',
    bodyData
  );
  return response.name;
};

export const updateCustomer = async (data) => {
  const key = data.key;
  const bodyData = {
    name: data.name,
    address: data.address,
    dateOfBirth: data.dateOfBirth,
    phone: data.phone,
  };
  await callApi(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`,
    'PUT',
    bodyData
  );
};

export const deleteCustomer = async (key) => {
  await callApi(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/customers/${key}.json`,
    'DELETE'
  );
};
