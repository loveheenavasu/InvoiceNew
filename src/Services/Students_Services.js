import { AXIOS } from "./Setup";

export const fetchStudents = (action) => {
  const params = {
    page: action?.payload?.page ? action?.payload?.page : 1,
    rows: action?.payload?.row ? action?.payload?.row : 10,
    dropdown: action.dropdown > 0 ? 1 : 0,
  };

  return AXIOS.get("view-student", { params });
};

export const removeStudent = (action) => {
  return AXIOS.delete(`delete-student/${action}`);
};

export const createStudent = (action) => {
  return AXIOS.post("create-student", action?.payload);
};
export const viewInvoice = (action) => {
  return AXIOS.get(`view-student/${action}`);
};

export const editStudent = (action) => {
  return AXIOS.put(`update-student/${action.payload.id}`,(action.payload) );
};

export const fetchSingleStudent = (action) => {
  return AXIOS.get(`view-student/${action}`);
};
