import { CircularProgress, InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { from, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { MovieResult } from "./Movie";
import { getMovies } from "./movieApi";
import MovieView from "./MovieView";
import { SearchActions, SearchSelectors } from "./searchSlice";
import useStyle from "./style";
import MovieDetailView from "./MovieDetailView";

export type SearchProps = {};
type MovieSearchResult = {
  movieResult: MovieResult;
  error?: string;
};

const Search: React.FC<SearchProps> = (props) => {
  const classes = useStyle();
  const searchSubject$ = useRef(new Subject<string>());
  const [searchKey, setSearchKey] = useState("");
  const dispatch = useDispatch();
  const movies = useSelector(SearchSelectors.movies);
  const error = useSelector(SearchSelectors.error);
  const loading = useSelector(SearchSelectors.loading);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState("");

  useEffect(() => {
    const subscription = searchSubject$.current
      .pipe(
        map((key) => key.trim()),
        filter((val) => !!val),
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => dispatch(SearchActions.searchBegin())),
        switchMap((key) => {
          return from(getMovies(key)).pipe(
            map(
              (result) =>
                ({ error: "", movieResult: result.data } as MovieSearchResult)
            ),
            catchError((err) => {
              return of({
                error: err.toString(),
                movieResult: {},
              } as MovieSearchResult);
            })
          );
        })
      )
      .subscribe((result) => {
        if (result.error) {
          dispatch(SearchActions.searchError(result.error));
        } else {
          dispatch(SearchActions.searchSuccess(result.movieResult));
        }
      });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
    searchSubject$.current.next(event.target.value);
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <React.Fragment>
      ---- <div style={{ color: "white" }}>{selectedMovieTitle}</div>----
      <TextField
        value={searchKey}
        fullWidth={true}
        variant="filled"
        size="medium"
        className={classes.searchField}
        onChange={onSearch}
        placeholder="Search Movies"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <React.Fragment>
              {loading && (
                <InputAdornment position="end">
                  <CircularProgress
                    size={15}
                    className={classes.loadingSpinner}
                  />
                </InputAdornment>
              )}
            </React.Fragment>
          ),
        }}
      />
      <br />
      <div> {!loading ? `Total movie count ${movies?.length || 0}` : ""}</div>
      <div className={classes.movieResultContainer}>
        {movies?.map((movie) => {
          return (
            <MovieView
              key={movie.imdbID}
              movie={movie}
              onClick={(title) => setSelectedMovieTitle(title)}
            />
          );
        })}
      </div>
      <MovieDetailView
        title={selectedMovieTitle}
        onClose={() => setSelectedMovieTitle("")}
      />
    </React.Fragment>
  );
};

export default Search;
