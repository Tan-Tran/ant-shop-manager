import callFetchApi from './callFetchApi';
const url = "http://localhost:8080/order"

export const getAllOrders = async () => {
  return await callFetchApi(url) || [];
};

export const getOrder = async (key) => {
  return await callFetchApi(`${url}/${key}`);
};

export const addOrder = async (data) => {
   return await callFetchApi(`${url}/new`,'POST',data);
};

export const updateOrder = async (key, data) => {
  await callFetchApi(`${url}/${key}`,'PUT',data);
};

export const deleteOrder = async (key) => {
  await callFetchApi(`${url}/${key}`,'DELETE');
};

export const getOrderDetailPdf = async (orderId) => {
  const linkDownload = document.createElement("a");
  const response = await fetch(url + `/${orderId}/pdf`);
  const file = new Blob([await response.arrayBuffer()], {
    type: "application/pdf",
  });
  const fileURL = URL.createObjectURL(file);
  linkDownload.href = fileURL;
  linkDownload.download = `order${orderId}.pdf`;
  linkDownload.click();
};