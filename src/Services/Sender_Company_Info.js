import { AXIOS } from "./Setup";

export const createSenderCompany = (action) => {
  return AXIOS.post("create-company", action?.payload);
};

export const fetchSenderCompany = () => {
  return AXIOS.get("view-company");
};

export const modifySenderCompany = (action) => {
  return AXIOS.post("create-company", action?.payload);
};
