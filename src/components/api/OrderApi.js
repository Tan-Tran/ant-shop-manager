export const getAllOrders = async () => {
  const response = await fetch(
    'https://shop-management-aba6f-default-rtdb.firebaseio.com/orders.json'
  );
  const data = await response.json();
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
