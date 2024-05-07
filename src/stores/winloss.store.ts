import type { TagItem, TagState } from '@/interface/layout/tagsView.interface';
import { history } from '@/routes/history';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface WinLossState {
    startDate: string
    endDate: string
}

const initialState: WinLossState = {
    startDate: '',
    endDate: ''
};

const winlossSlice = createSlice({
    name: 'WinLoss',
    initialState,
    reducers: { 
        setWinLossDateRange(state, action: PayloadAction<WinLossState>) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        } 
    }
})


export const { setWinLossDateRange} = winlossSlice.actions;

export default winlossSlice.reducer;
