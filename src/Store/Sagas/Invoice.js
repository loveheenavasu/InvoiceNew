import {
  createInvoice,
  editInvoice,
  fetchInvoice,
  fetchInvoices,
  removeInvoice,
  _downloadPdf,
  get_course_fee,
  get_course_list,
  pending_amount,
  payment_list,
  update_payment,
} from "../../Services/Invoice_Services";
import {
  ADD_INVOICE,
  DELETE_INVOICE,
  DOWNLOAD_PDF,
  GET_INVOICE,
  GET_INVOICES,
  UPDATE_INVOICE,
  GET_COURSE_FEE,
  GET_COURSE_LIST,
  PENDING_AMOUNT,
  PAYMENT_LIST,
  UPDATE_PAYMENT,
} from "../Action_Constants";
import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  invoiceCreated,
  setInvoiceToUpdate,
  setLoading,
  setPDFUrl,
  _saveInvoice,
  setCourseDuration,
  setCourseFee,
} from "../Slices/Invoice";
import { store } from "../Store";
import { setPaymentList, setUpdateList } from "../Slices/Payment";

function* addInvoice(action) {
  try {
    const response = yield call(createInvoice, action);
    if (response.status === 200) {
      yield put(invoiceCreated());
      toast.success("Invoice has been created successfully");
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* deleteInvoice(action) {
  try {
    const response = yield call(removeInvoice, action?.payload.invoiceId);
    if (response.status === 200) {
      store.dispatch({
        type: GET_INVOICES,
        payload: {
          page: action?.payload.page,
          rows: action?.payload.row,
        },
      });
      toast.success("Invoice has been successfully deleted");
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* getInvoices(action) {
  try {
    const response = yield call(fetchInvoices, action);
    yield put(_saveInvoice(response?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* getInvoice(action) {
  try {
    const response = yield call(fetchInvoice, action?.payload);
    yield put(setInvoiceToUpdate(response?.data?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* updateInvoice(action) {
  try {
    const response = yield call(editInvoice, action);
    if (response.status === 200) {
      yield put(invoiceCreated());
      yield put(setInvoiceToUpdate(false));
      toast.success("Invoice has been updated successfully");
      yield put({ type: GET_INVOICES });
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

    if(response.status === 200){
      window.open(response?.data?.url);
      yield put(setPDFUrl(response?.data?.url));
    }

  } catch (e) {
    toast.error(e?.response?.error || e?.response?.message);
    yield put(setLoading(false));
  }
}

function* getCourseFee(action) {
  try {
    const response = yield call(get_course_fee, action);
    if (response.status === 200) {
      yield put(setCourseFee(response.data));
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}
function* getCourselist(action) {
  try {
    const response = yield call(get_course_list);
    if (response.status === 200) {
      yield put(setCourseDuration(response.data.data));
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* pendingAmount(action) {
  try {
    const response = yield call(pending_amount, action);
    if (response.status === 200) {
      toast.success("Pending amount request successful");
      yield put({ type: GET_INVOICES });
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}
function* paymentlist(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(payment_list, action);
    if (response.status === 200) {
      yield put(setPaymentList(response?.data.paid_amount || []));
      yield put(setLoading(false));
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* updatePayment(action) {
  try {
    const response = yield call(update_payment, action);
    if (response.status === 200) {
      yield put(setUpdateList(response.data))
      yield put ({type: PAYMENT_LIST, payload:{ id: response.data.paid_amount.invoice_id}})
      yield put({ type: GET_INVOICES });
      toast.success("Payment has been updated successfully");
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

export function* invoiceSaga() {
  yield takeLatest(ADD_INVOICE, addInvoice);
  yield takeLatest(GET_INVOICES, getInvoices);
  yield takeLatest(DELETE_INVOICE, deleteInvoice);
  yield takeLatest(GET_INVOICE, getInvoice);
  yield takeLatest(UPDATE_INVOICE, updateInvoice);
  yield takeLatest(DOWNLOAD_PDF, downloadPdf);
  yield takeLatest(GET_COURSE_FEE, getCourseFee);
  yield takeLatest(GET_COURSE_LIST, getCourselist);
  yield takeLatest(PENDING_AMOUNT, pendingAmount);
  yield takeLatest(PAYMENT_LIST, paymentlist);
  yield takeLatest(UPDATE_PAYMENT, updatePayment);
}
