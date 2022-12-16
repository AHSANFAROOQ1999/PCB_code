import { createSlice } from "@reduxjs/toolkit";

export const currencySlice = createSlice({
  name: "multiLocation",
  initialState: {
    defaultCountry: "Pakistan",
    defaultCountryCode: "PK",
    defaultCurrency: "PKR",
    countriesList: null,
  },
  reducers: {
    setDefaultCountry: (state, action) => {
      // debugger;
      state.defaultCountry = action?.payload?.country_name;
      state.defaultCountryCode = action?.payload?.short_code;
      state.defaultCurrency = action?.payload?.currency;
    },
    changeCountryCode: (state, action) => {
      // debugger;
      state.defaultCountryCode = action?.payload;
    },
    changeCountry: (state, action) => {
      // debugger;
      state.defaultCountry = action?.payload;
      localStorage.removeItem("cart");
      localStorage.removeItem("wishList");
      localStorage.removeItem("checkout_id");
    },
    changeCurrency: (state, action) => {
      // debugger;
      state.defaultCurrency = action?.payload;
    },
    countriesList: (state, action) => {
      // debugger;
      state.countriesList = action?.payload;
    },
  },
});

export const {
  setDefaultCountry,
  changeCountryCode,
  changeCountry,
  changeCurrency,
  countriesList,
} = currencySlice.actions;
export default currencySlice.reducer;
