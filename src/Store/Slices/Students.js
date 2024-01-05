import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  loading: false,
  studentCreating: false,
  student: [],
  pdfUrl: "",
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
        totalStudents: action?.payload?.total || 0,
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
    setPDFUrl: (state, action) => {
      return {
        ...state,
        pdfUrl: action?.payload,
        loading: false
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
  setPDFUrl,
} = students.actions;
export default students.reducer;
