import { configureStore, createSlice } from "@reduxjs/toolkit";

let user = createSlice({
    name : "user",
    initialState : ["수호", "김준면"],
    reducers : {
        changeName(state) {
            return ["테스트" + state];
        }
    }
});

let dark = createSlice({
    name : "dark",
    initialState : "light",
    reducers : {
        toggleTheme : (state) => state === "light" ? "dark" : "light"
    }
});

export const {changeName} = user.actions;
export const {toggleTheme} = dark.actions;

export default configureStore({
    reducer : {
        user : user.reducer,
        dark : dark.reducer
    }
});