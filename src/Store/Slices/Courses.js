import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  loading: false,
  courseCreating: false,
  course: {},
  totalCourses: 0,
  duration:[]
};

const courses = createSlice({
  name: "courses",
  initialState,
  reducers: {
    _saveCourses: (state, action) => {
      const { data, total } = action.payload || {};

      return {
        ...state,
        courses: data?.courses || [],
        totalCourses: total || 0,
        duration: data?.course_duration,
        loading: false,
      };
    },
    _saveCourse: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        course: payload || {},
        loading: false,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    courseCreated: (state, action) => {
      localStorage.setItem("coursecreating", false);
      return {
        ...state,
        loading: false,
        courseCreating: false,
      };
    },
    courseCreating: (state, action) => {
      return {
        ...state,
        courseCreating: action.payload,
      };
    },
  },
});


export const {
  setLoading,
  _saveCourses,
  courseCreated,
  courseCreating,
  _saveCourse,
} = courses.actions;
export default courses.reducer;

