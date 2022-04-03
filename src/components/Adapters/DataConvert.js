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
