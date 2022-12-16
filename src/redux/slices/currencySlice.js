// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// export const fetchCurrencyRates = createAsyncThunk(
//     'currency/fetchRates',
//     async () => {
//       const response = await fetch("http://apilayer.net/api/live?access_key=cafdc1ec9a75c8b75e47731e60973dcc&currencies=PKR")
//       const jsonResponse = await response.json();
//       return jsonResponse
//     }
// )

// export const currencySlice = createSlice({
//     name: 'currency',
//     initialState: {
//         rates: {},
//         currency: sessionStorage.getItem("currency") ? sessionStorage.getItem("currency") : 'PKR'
//     },
//     reducers: {
//         changeCurrency: (state, action) => {
//             state.currency = action.payload;
//             sessionStorage.setItem("currency", action.payload);
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addCase(fetchCurrencyRates.fulfilled, (state, action) => {
//             state.rates = action.payload.quotes
//         });
//     }
// });

// export const {
//     changeCurrency
// } = currencySlice.actions;

// export default currencySlice.reducer

// fetchCurrencyRates()