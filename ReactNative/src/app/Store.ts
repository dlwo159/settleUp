import { configureStore } from '@reduxjs/toolkit';
import stateReducer from './StateSlice';
import loadingSlice from './loadingSlice';

export const store = configureStore({
  reducer: {
    app: stateReducer,
    loading: loadingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
