import { createSlice, PayloadAction, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';

type LoadingState = { count: number };
const initialState: LoadingState = { count: 0 };

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    start(state) {
      state.count += 1;
    },
    stop(state) {
      state.count = Math.max(0, state.count - 1);
    },
    reset(state) {
      state.count = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(isPending, state => {
        state.count += 1;
      })
      .addMatcher(isFulfilled, state => {
        state.count = Math.max(0, state.count - 1);
      })
      .addMatcher(isRejected, state => {
        state.count = Math.max(0, state.count - 1);
      });
  },
});

export const { start, stop, reset } = loadingSlice.actions;
export default loadingSlice.reducer;
