import { combineReducers } from '@reduxjs/toolkit';

import globalReducer from './global.store';
import tagsViewReducer from './tags-view.store';
import userReducer from './user.store';
import dashbaordReducer from './dashboard.store';
import playerReducer from './player.store';
import winlossReducer from './winloss.store';
import betsReducer from "./bets.store";

const rootReducer = combineReducers({
  user: userReducer,
  tagsView: tagsViewReducer,
  global: globalReducer,
  dashbaord: dashbaordReducer,
  player: playerReducer,
  winloss: winlossReducer,
  bets: betsReducer
});

export default rootReducer;
