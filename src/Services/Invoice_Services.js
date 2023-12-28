import { AXIOS } from "./Setup";

export const createInvoice = (action) => {
  return AXIOS.post("create-invoice", action?.payload);
};

export const fetchInvoices = (action) => {
  const params = {
    page: action?.payload?.page ? action?.payload?.page : 1,
    rows: action?.payload?.row ? action?.payload?.row : 10,
  };

  return AXIOS.get("view-invoice", { params });
};

export const removeInvoice = (action) => {
  return AXIOS.delete(`delete-invoice/${action}`);
};

export const fetchInvoice = (action) => {
  return AXIOS.get(`view-invoice/${action}`);
};

export const editInvoice = (action) => {
const id =action.payload.id
 delete action.payload.id
  return AXIOS.put(`update-invoice/${id}`, action?.payload);
};

export const viewInvoice = (action) => {
  return AXIOS.get(`view-invoice/${action}`);
};

export const _downloadPdf = (action) => {
  return AXIOS.get(`download-invoice/${action}`);
};

export const mark_payment_done = (action) => {
  return AXIOS.put(`update-payment-status/${action}`);
};

export const get_course_fee = (action)=>{
  const data ={course_id:action.payload}
  return AXIOS.post('course-fee', data)
}
export const get_course_list = (action)=>{
  return AXIOS.post('course-list', action.payload)
}

export const pending_amount = (action) => {
  return AXIOS.post("pay-pending", action.payload );
};
export const payment_list = (action)=>{
  return AXIOS.post(`list-amount`, action.payload)
}
export const update_payment = (action)=>{
  return AXIOS.put("update-amount" , action.payload)
}