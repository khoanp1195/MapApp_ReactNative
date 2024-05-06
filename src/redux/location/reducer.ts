import { action } from '@nozbe/watermelondb/decorators';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    latitude:"",
    longtitude: "",
    isFindItem: false,
    isLoaing: false
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLongtitude: (state,actions) => {
            state.longtitude = actions.payload;
            console.log(" state.longtitude 3: " + actions.payload)
        },
        setLatitude:(state,actions) =>{
            state.latitude = actions.payload;
            console.log(" state.latitude 3: " + actions.payload)
        },
        setIsFindItem: (state,actions) =>{
            state.latitude = actions.payload
        },
        setResetLoction: (state) => {
            state.latitude =""
            state.longtitude =""
        },
    },
});

export const { setLongtitude,setLatitude,setResetLoction,setIsFindItem } = locationSlice.actions;
const {reducer}= locationSlice;
export default reducer;
