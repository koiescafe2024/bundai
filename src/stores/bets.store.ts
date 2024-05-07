import type { TagItem, TagState } from '@/interface/layout/tagsView.interface';
import { history } from '@/routes/history';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface BetsState {
    startDate: string
    endDate: string
}

const initialState: BetsState = {
    startDate: '',
    endDate: ''
};

const betsSlice = createSlice({
    name: 'player',
    initialState,
    reducers: { 
        setBetsDateRange(state, action: PayloadAction<BetsState>) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        } 
    }
})


export const { setBetsDateRange} = betsSlice.actions;

export default betsSlice.reducer;
