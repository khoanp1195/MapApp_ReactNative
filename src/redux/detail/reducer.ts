import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    IsUpdate: false,
    IsUpdateFromHome: false
};

const detailListSlice = createSlice({
    name: 'detail',
    initialState,
    reducers: {
        setIsUpdate: (state) => {
            state.IsUpdate = true;
        },
        setIsUpdateHome: (state) => {
            state.IsUpdateFromHome = true
        },
        setIsUpdateFinishHome: (state) => {
            state.IsUpdateFromHome = false;
        },
        setIsUpdateFinish: (state) => {
            state.IsUpdate = false;
        },
    },
});

export const { setIsUpdate, setIsUpdateFinish, setIsUpdateHome, setIsUpdateFinishHome } = detailListSlice.actions;
const { reducer } = detailListSlice;
export default reducer;
