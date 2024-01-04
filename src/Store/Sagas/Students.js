import {
  fetchStudents,
  fetchSingleStudent,
  removeStudent,
  editStudent,
  createStudent,
} from "../../Services/Students_Services";
import {
  GET_STUDENTS,
  DELETE_STUDENT,
  UPDATE_STUDENT,
  SAVE_STUDENT,
  GET_STUDENT,
} from "../Action_Constants";
import {
  _saveStudents,
  _saveStudent,
  setLoading,
  studentCreated,
} from "../Slices/Students";
import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";

function* getStudents(action) {
  try {
    const response = yield call(fetchStudents, action);
    yield put(_saveStudents(response?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error || e?.response?.data?.message);
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
      // store.dispatch({
      //   type: GET_STUDENTS,
      //   payload: {
      //     page: action?.payload.page,
      //     rows: action?.payload.row,
      //   },
      // });
      toast.success("Student deleted successfully");
      yield put({ type: GET_STUDENTS });
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
      toast.success("Student has been saved successfully");
    }
  } catch (e) {
    let errorMessage = "An error occurred";
    if (e.response && e.response.data && e.response.data.error) {
      const emailError = e.response.data.error.email;
      const phoneError = e.response.data.error.phone;

      if (emailError) {
        errorMessage = emailError[0];
      } else if (phoneError) {
        errorMessage = phoneError[0];
      }
    }

    toast.error(errorMessage);
    yield put(setLoading(false));
  }
}

function* updateStudent(action) {
  try {
    const response = yield call(editStudent, action);
    if (response.status === 200) {
      yield put(studentCreated());
      toast.success("Student Information has been updated successfully");
      // store.dispatch({
      //   type: GET_STUDENTS,
      // });
      yield put({ type: GET_STUDENTS });
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
