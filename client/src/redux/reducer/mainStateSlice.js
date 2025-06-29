import { createSlice } from "@reduxjs/toolkit";

const mainStateSlice = createSlice({
    name: "mainState",
    initialState: {
        page: "home",
    },
    reducers: {
        setMainState: (state, action) => {
            state.page = action.payload;
        },
    },
});

export const { setMainState } = mainStateSlice.actions;
export default mainStateSlice.reducer;


