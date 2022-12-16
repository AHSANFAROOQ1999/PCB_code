import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    loggedIn: sessionStorage.getItem("pcb-customer-token") ? true : false,
  },
  reducers: {
    loginn: (state, action) => {
      sessionStorage.setItem("pcb-customer-id", action.payload.data.id)
      sessionStorage.setItem("pcb-customer-token", action.payload.data.token)
      sessionStorage.setItem("pcb-customer-email", action.payload.data.email)
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.loggedIn = true

    },
    logout: (state) => {
      sessionStorage.removeItem('pcb-customer-token')
      sessionStorage.removeItem('pcb-customer-id')
      sessionStorage.removeItem('pcb-customer-email')
      localStorage.removeItem('wishList')
      state.loggedIn = false
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { loginn, logout } = accountSlice.actions

// console.log(accountSlice)
export default accountSlice.reducer