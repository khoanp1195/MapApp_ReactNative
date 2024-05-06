import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    satellite: false,
    standard: false
};

const appbarCustomSlice = createSlice({
    name: 'appbarCustom',
    initialState,
    reducers: {
        setIssatellite: (state) => {
            state.satellite = true;
            state.standard = false
        },
        setIsStandard: (state) => {
            state.satellite = false;
            state.standard = true
        },
    },
});

export const { setIssatellite, setIsStandard } = appbarCustomSlice.actions;
const { reducer } = appbarCustomSlice;
export default reducer;
