import {
  fetchStudents,
  removeStudent,
  editStudent,
  createStudent,
  viewInvoice,
  _downloadPdf,
  addPayment


} from "../../Services/Students_Services";
import {
  GET_STUDENTS,
  DELETE_STUDENT,
  UPDATE_STUDENT,
  SAVE_STUDENT,
  GET_STUDENT,
  DOWNLOAD_PDF,
  ADD_PAYMENT,
  VIEW_PAYMENTS,
  FILTER_STUDENT
} from "../Action_Constants";
import {
  _saveStudents,
  _saveStudent,
  setLoading,
  studentCreated,
  setPDFUrl,
  paymentList,
  filterStudent,
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

// function* getViewInvoice(action) {
//   try {

//     const response = yield call(viewInvoice, action);
//     console.log("23435", response?.data);
//     yield put(getInvoice(response?.data));
//   } catch (e) {
//     toast.error(e?.response?.data?.error || e?.response?.data?.message);
//     yield put(setLoading(false));
//   }
// }

function* getStudent(action) {
  try {
    const response = yield call(viewInvoice, action.payload);
    yield put(_saveStudent(response?.data?.data));
    yield put(paymentList(response?.data?.payment));

  } catch (e) {
    toast.error(e?.response?.statusText || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}
function* viewPayments(action) {
  try {
    const response = yield call(viewInvoice, action.payload);
    yield put(paymentList(response?.data?.payment));
    // yield put(_saveStudent(response?.data));

  } catch (e) {
    toast.error(e?.response?.statusText || e?.response?.data?.message);
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

function* downloadPdf(action) {
  try {
    const response = yield call(_downloadPdf, action?.payload);
    yield put(setLoading(true));

    if (response.status === 200) {
      window.open(response?.data?.url);
      yield put(setPDFUrl(response?.data?.url));
    }

  } catch (e) {
    toast.error(e?.response?.error || e?.response?.message);
    yield put(setLoading(false));
  }
}
function* filterStudents(action) {
  try {

    yield put(filterStudent(action.payload));



  } catch (error) {
    // 
  }

}

function* addPaymentData(action) {
  try {
    const response = yield call(addPayment, action?.payload);
    yield put(setLoading(true));




  } catch (e) {
    // 
  }
}
export function* studentsSaga() {
  yield takeLatest(GET_STUDENTS, getStudents);
  yield takeLatest(DELETE_STUDENT, deleteStudent);
  yield takeLatest(SAVE_STUDENT, saveStudent);
  yield takeLatest(DOWNLOAD_PDF, downloadPdf);
  yield takeLatest(UPDATE_STUDENT, updateStudent);
  yield takeLatest(GET_STUDENT, getStudent);
  yield takeLatest(ADD_PAYMENT, addPaymentData);
  // yield takeLatest(VIEW_INVOICE, getViewInvoice);
  yield takeLatest(VIEW_PAYMENTS, viewPayments)
  yield takeLatest(FILTER_STUDENT, filterStudents)
}
