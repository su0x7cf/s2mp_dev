import { configureStore } from "@reduxjs/toolkit";
import mainStateSlice from "../reducer/mainStateSlice";
import userStateSlice from "../reducer/userStateSlice";

const store = configureStore({
    reducer: {
        mainState: mainStateSlice,
        userState: userStateSlice,
    },
});

export default store;
