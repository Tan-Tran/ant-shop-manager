import callApi from './callApi';

export const getAllOrders = async () => {
  const response = await callApi(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json'
  );
  let data = [];
  if (response) {
    data = Object.keys(response).map((key) => {
      return {
        key: key,
        customerId: response[key].customerId,
        customerName: response[key].customerName,
        delivery: response[key].delivery,
        productNames: response[key].products?.map(
          (product) => product.productName
        ),
        total: response[key].products?.reduce(
          (prev, current) => prev + current.total,
          0
        ),
        date: new Date(response[key].createAt).toLocaleDateString('en-US'),
      };
    });
  }
  return data;
};

export const getOrder = async (key) => {
  const response = await fetch(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`
  );
  const data = await response.json();
  return data;
};

export const addOrder = async (dataBody) => {
  const response = await fetch(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataBody),
    }
  );
  const data = await response.json();
  const id = data.name;
  return id;
};

export const updateOrder = async (key, dataBody) => {
  const response = await fetch(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataBody),
    }
  );
  const data = await response.json();
  const id = data.name;
  return id;
};

export const deleteOrder = async (key) => {
  const response = await fetch(
    `https://shop-management-aba6f-default-rtdb.firebaseio.com/orders/${key}.json`,
    {
      method: 'DELETE',
    }
  );
};
