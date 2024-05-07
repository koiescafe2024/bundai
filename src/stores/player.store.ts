import type { TagItem, TagState } from '@/interface/layout/tagsView.interface';
import { history } from '@/routes/history';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface PlayerState {
    startDate: string
    endDate: string
}

const initialState: PlayerState = {
    startDate: '',
    endDate: ''
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: { 
        setPlayerDateRange(state, action: PayloadAction<PlayerState>) {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
        } 
    }
})


export const { setPlayerDateRange} = playerSlice.actions;

export default playerSlice.reducer;
