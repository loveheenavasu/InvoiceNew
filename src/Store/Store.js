import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./Sagas";
import { auth, senderCompanyInfo, invoices, Courses, Students, Payment } from "./Slices";

const sagaMiddleware = createSagaMiddleware({ serializableCheck: false });

const middlewares = [sagaMiddleware];

const store = configureStore({
  reducer: {
    auth,
    senderCompanyInfo,
    invoices,
    Courses,
    Students,
    Payment
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([...middlewares]),
});

sagaMiddleware.run(rootSaga);
export { store };
