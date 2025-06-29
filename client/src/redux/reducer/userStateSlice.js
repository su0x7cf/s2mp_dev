import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "userState",
    initialState: {
        user: null,
        isLoggedIn: false,
    },
    reducers: {
        setUser: (state, action) => {
            // return action.payload;
            // state.user = action.payload;
            Object.assign(state.user, action.payload);
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
    },
});

export const { setUser, setIsLoggedIn } = userSlice.actions;
export default userSlice.reducer;
