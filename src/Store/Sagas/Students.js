import { fetchStudents, fetchSingleStudent, removeStudent, editStudent, createStudent } from "../../Services/Students_Services";
import { GET_STUDENTS, DELETE_STUDENT, UPDATE_STUDENT, SAVE_STUDENT,GET_STUDENT } from "../Action_Constants";
import { _saveStudents, _saveStudent, setLoading, studentCreated } from "../Slices/Students";
  import { takeLatest, put, call } from "redux-saga/effects";
  import { toast } from "react-toastify";
  import { store } from "../Store";
  
  function* getStudents(action) {
    try {
      const response = yield call(fetchStudents, action);
      yield put(_saveStudents(response?.data));
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* getStudent(action) {
    try {
      const response = yield call(fetchSingleStudent, action.payload);
      yield put(_saveStudent(response?.data?.data));
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* deleteStudent(action) {
    try {
      const response = yield call(removeStudent, action?.payload.clientId);
      if (response.status === 200) {
        store.dispatch({
          type: GET_STUDENTS,
          payload: {
            page: action?.payload.page,
            rows: action?.payload.row,
          },
        });
      }
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* saveStudent(action) {
    try {
      const response = yield call(createStudent, action);
      if (response.status === 200) {
        yield put(studentCreated());
        toast.success("student has been saved successfully");
      }
    } catch (e) {

      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  function* updateStudent(action) {
    try {
      const response = yield call(editStudent, action);
      if (response.status === 200) {
        yield put(studentCreated());
        toast.success("client has been updated successfully");
        store.dispatch({
          type: GET_STUDENTS,
        });
      }
    } catch (e) {
      toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
      yield put(setLoading(false));
    }
  }
  
  export function* studentsSaga() {
    yield takeLatest(GET_STUDENTS, getStudents);
    yield takeLatest(DELETE_STUDENT, deleteStudent);
    yield takeLatest(SAVE_STUDENT, saveStudent);
    yield takeLatest(UPDATE_STUDENT, updateStudent);
    yield takeLatest(GET_STUDENT, getStudent);
  }
  