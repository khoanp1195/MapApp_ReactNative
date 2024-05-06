// import { createSlice } from '@reduxjs/toolkit';
// import {BaseSubSite, subsiteStore} from "../../config/constants";

// const subSiteSlice = createSlice({
//     name: 'sub_site',
//     initialState: {
//         currentSite:BaseSubSite,
//         isVisibleSubSite:false
//     },
//     reducers: {
//         setSubSite: (state, action) => {
//             subsiteStore.setSubsite(action.payload)
//             state.currentSite= action.payload;
//         },
//         showSubSite: (state) => {
//             state.isVisibleSubSite = true;
//         },
//         hideSubSite: (state) => {
//             state.isVisibleSubSite = false;
//         },
//     },
// });

// export const {
//     setSubSite,
//     showSubSite,
//     hideSubSite }
//     = subSiteSlice.actions;
// const {reducer}=subSiteSlice;
// export default  reducer;
