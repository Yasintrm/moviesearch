import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MovieResult } from "./Movie";

export interface SearchState {
  loading: boolean;
  movieSearchResult: MovieResult;
  error?: string;
}

const initialState: SearchState = {
  loading: false,
  movieSearchResult: {
    Search: [],
    totalResults: 0,
  },
};

export const searchSlice = createSlice({
  name: "searchMovie",
  initialState,
  reducers: {
    searchBegin(state) {
      state.loading = true;
      state.movieSearchResult = {
        totalResults: 0,
        Search: [],
      };
      state.error = "";
    },
    searchSuccess(state, action: PayloadAction<MovieResult>) {
      state.loading = false;
      state.movieSearchResult = action.payload;
      state.error = "";
    },
    searchError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.movieSearchResult = {
        totalResults: 0,
        Search: [],
      };
      state.error = action.payload;
    },
  },
});

export const SearchActions = searchSlice.actions;
export const SearchSelectors = {
  movies: (state: RootState) => state.search.movieSearchResult.Search,
  error: (state: RootState) => state.search.error,
  loading: (state: RootState) => state.search.loading,
};

export default searchSlice.reducer;
