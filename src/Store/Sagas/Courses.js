import { fetchCourse, fetchCourses,removeCourse, editCourse,createCourse } from "../../Services/Courses_Services";
  import {
    DELETE_COURSE,
    GET_COURSE,
    GET_COURSES,
    SAVE_COURSE,
    UPDATE_COURSE,
  } from "../Action_Constants";

import { _saveCourses, _saveCourse, setLoading,courseCreated } from "../Slices/Courses";
  import { takeLatest, put, call } from "redux-saga/effects";
  import { toast } from "react-toastify";
  import { store } from "../Store";
  
  function* getCourses(action) {
    try {
      const response = yield call(fetchCourses, action);
      yield put(_saveCourses(response?.data));
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* getCourse(action) {
    try {
      const response = yield call(fetchCourse, action.payload);
      yield put(_saveCourse(response?.data?.data));
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* deleteCourse(action) {
    try {
      const response = yield call(removeCourse, action?.payload.courseId);
      if (response.status === 200) {
        store.dispatch({
          type: GET_COURSES,
          payload: {
            page: action?.payload.page,
            rows: action?.payload.row,
          },
        });
        toast.success("course has been successfully deleted");

      }
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* saveCourse(action) {
    try {
      const response = yield call(createCourse, action);
      if (response.status === 200) {
        yield put(courseCreated());
        toast.success("course has been saved successfully");
      }
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* updateCouse(action) {
    try {
      const response = yield call(editCourse, action);
      if (response.status === 200) {
        yield put(courseCreated());
        toast.success("course has been updated successfully");
        store.dispatch({
          type: GET_COURSES,
        });
      }
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  export function* coursesSaga() {
    yield takeLatest(GET_COURSES, getCourses);
    yield takeLatest(DELETE_COURSE, deleteCourse);
    yield takeLatest(SAVE_COURSE, saveCourse);
    yield takeLatest(UPDATE_COURSE, updateCouse);
    yield takeLatest(GET_COURSE, getCourse);
  }
  