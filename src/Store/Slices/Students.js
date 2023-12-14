import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  loading: false,
  studentCreating: false,
  student: {},
  totalStudents: 0,
};

const students = createSlice({
  name: "students",
  initialState,
  reducers: {
    _saveStudents: (state, action) => {
      return {
        ...state,
        students: action?.payload?.data,
        totalStudents: action?.payload?.total_student_record || 0,
        loading: false,
      };
    },
    _saveStudent: (state, action) => {
      return {
        ...state,
        student: action?.payload,
        loading: false,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action?.payload,
      };
    },
    studentCreated: (state, action) => {
      localStorage.setItem("studentcreating", false);
      return {
        ...state,
        loading: false,
        studentCreating: false,
      };
    },
    studentCreating: (state, action) => {
      return {
        ...state,
        studentCreating: action?.payload,
      };
    },
  },
});

export const {
  setLoading,
  _saveStudents,
  studentCreated,
  studentCreating,
  _saveStudent,
} = students.actions;
export default students.reducer;
