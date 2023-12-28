import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  paymentList: [],
  updateList:[]
};

const payment = createSlice({
  name: 'paymentList',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPaymentList: (state, action) => {
      state.paymentList = action.payload || [];
    },
    clearPaymentList:(state, action)=>{
      state.paymentList=[]

    },
    setUpdateList: (state, action) => {
      state.updateList = action.payload || [];
    },

  },
});

export const { setLoading, setError, clearError, setPaymentList,clearPaymentList,setUpdateList } = payment.actions;
export default payment.reducer;