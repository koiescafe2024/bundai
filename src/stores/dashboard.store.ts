import type { TagItem, TagState } from '@/interface/layout/tagsView.interface';
import { history } from '@/routes/history';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
    startDate: string
    endDate: string
}

const initialState: DashboardState = {
    startDate: '',
    endDate: ''
};

const dashboardSlice = createSlice({
    name: 'dashbaord',
    initialState,
    reducers: { 
        setDashboardDateRange(state, action: PayloadAction<DashboardState>) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        } 
    }
})


export const { setDashboardDateRange} = dashboardSlice.actions;

export default dashboardSlice.reducer;
