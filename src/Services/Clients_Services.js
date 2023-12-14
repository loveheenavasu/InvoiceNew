import { AXIOS } from "./Setup";

export const fetchClients = (action) => {
  console.log(action.dropdown, "84848fff4848ddd48");
  const params = {
    page: action?.payload?.page ? action?.payload?.page : 1,
    rows: action?.payload?.row ? action?.payload?.row : 10,
    dropdown: action.dropdown > 0 ? 1 : 0,
  };

  return AXIOS.get("view-course", { params });
};

export const removeClient = (action) => {
  return AXIOS.delete(`delete-course/${action}`);
};

export const createClient = (action) => {
  return AXIOS.post("create-course", action?.payload);
};

export const editClient = (action) => {
  return AXIOS.put("update", action?.payload);
};

export const fetchClient = (action) => {
  return AXIOS.get(`view-course/${action}`);
};
