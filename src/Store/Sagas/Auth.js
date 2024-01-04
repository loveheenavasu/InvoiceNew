import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import { LOGIN_USER } from "../Action_Constants";
import { handleUserLogin, setLoading } from "../Slices/Auth";
import { loginRequest } from "../../Services/Auth_Services";

function* loginUser(action) {
  try {
    const response = yield call(loginRequest, action);
    yield put(handleUserLogin(response?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN_USER, loginUser);
}
