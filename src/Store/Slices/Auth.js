import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  loading: false,
  user: {},
  success: false,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleUserLogin: (state, action) => {
      const { data } = action?.payload;
      if (data.token) {
        return {
          ...state,
          user: data,
          token:data.token,
          success:data.token?true:false,
          loading: false,
        };
      }
    },

    handleUserLogout: (state, action) => {
      return {
        ...state,
        token: "",
        user: "",
        success: false,
      };
    },

    setLoading: (state, action) => {
      return {
        ...state,
        loading: action?.payload,
      };
    },
  },
});

export const { setLoading, handleUserLogin, handleUserLogout } = auth.actions;
export default auth.reducer;
