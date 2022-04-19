import callFetchApi from './callFetchApi';
const url = "http://localhost:8080/customer"

export const getAllCustomers = async () => {
  const response = await callFetchApi(url) || [];
  return response.map(customer => {
    return {
        ...customer,
        key: customer?.id,
        dateOfBirth: new Date(customer.dateOfBirth).toLocaleDateString('en-GB')
      }
    })
};

export const getCustomer = async (key) => {
  return await callFetchApi(`${url}/${key}`);
};

export const addCustomer = async (data) => {
  return await callFetchApi(url,'POST',data);
};

export const updateCustomer = async (key, data) => {
  await callFetchApi(`${url}/${key}`,'PUT',data);
};

export const deleteCustomer = async (key) => {
  await callFetchApi(`${url}/${key}`,'DELETE');
};
