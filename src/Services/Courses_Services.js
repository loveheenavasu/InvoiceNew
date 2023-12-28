import { AXIOS } from "./Setup";

export const fetchCourses = (action) => {
  const params = {
    page: action?.payload?.page ? action?.payload?.page : 1,
    rows: action?.payload?.row ? action?.payload?.row : 10,
    dropdown: action.dropdown > 0 ? 1 : 0,
  };

  return AXIOS.get("view-course", { params });
};

export const removeCourse = (action) => {
  return AXIOS.delete(`delete-course/${action}`);
};

export const createCourse = (action) => {
  return AXIOS.post("create-course", action?.payload);
};

export const editCourse = (action) => {
  return AXIOS.put(`update-course/${action.payload.id}`,action.payload);
};

export const fetchCourse = (action) => {
  return AXIOS.get(`view-course/${action}`);
};
