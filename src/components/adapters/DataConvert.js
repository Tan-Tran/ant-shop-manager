export const productConvert = (data) => {
  const productList = [];
  for (const key in data) {
    productList.push({
      key: key,
      name: data[key].name,
      price: data[key].price,
      quantity: data[key].quantity,
      desc: data[key].desc,
      origin: data[key].origin,
    });
  }
  return productList;
};

export const customerConvert = (data) => {
  const customerList = [];
  for (const key in data) {
    customerList.push({
      key: key,
      name: data[key].name,
      address: data[key].address,
      dateOfBirth: data[key].dateOfBirth,
      phone: data[key].phone,
    });
  }
  return customerList
};

export const orderListConvert = (data) => {
  const orderList = [];
  for(const key in data){
    orderList.push({
      key: key,
      dateOrder: data[key].dateOrder,
      customerId: data[key].customerId,
      products: data[key].products,
      delivery: data[key].delivery
    })
  }
  return orderList
}

