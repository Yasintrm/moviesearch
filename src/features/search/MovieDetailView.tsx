import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Typography,
} from "@material-ui/core";
import useStyle from "./style";
import { MovieDetail } from "./Movie";
import { getMovieDetail } from "./movieApi";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";

import {
  catchError,
  distinctUntilChanged,
  filter,
  from,
  map,
  of,
  Subject,
  switchMap,
  tap,
} from "rxjs";

export type MovieDetailViewProps = {
  title?: string;
  onClose: () => void;
};

type MovieDetailResult = {
  movie: MovieDetail;
  error?: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListRenderer: React.FC<{ title: string; value: string }> = ({
  value,
  title,
}) => {
  const classes = useStyle();
  if (!value) {
    return null;
  }

  return (
    <React.Fragment>
      <div className={classes.listContainer}>
        <div className={classes.title}>
          <Typography variant="body2">{title}</Typography>
        </div>
        {value.split(",").map((it) => {
          return (
            <div className={classes.text}>
              <Typography variant="body2">{it}</Typography>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

const MovieDetailView: React.FC<MovieDetailViewProps> = ({
  title = "",
  onClose,
}) => {
  const classes = useStyle();
  const [movie, setMovie] = useState<MovieDetail | undefined>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const subject$ = useRef(new Subject<string>());

  useEffect(() => {
    const subscription = subject$.current
      .pipe(
        map((title) => title.trim()),
        filter((title) => !!title),
        distinctUntilChanged(),
        tap(() => setLoading(true)),
        switchMap((title) => {
          return from(getMovieDetail(title)).pipe(
            map(
              (result) =>
                ({ error: "", movie: result.data } as MovieDetailResult)
            ),
            catchError((err) => {
              return of({
                error: err.toString(),
                movie: {},
              } as MovieDetailResult);
            })
          );
        })
      )
      .subscribe((result) => {
        if (result.error) {
          setLoading(false);
          setMovie(undefined);
          setError(result.error);
        } else {
          setLoading(false);
          setMovie(result.movie);
          setError("");
        }
      });

    return () => subscription.unsubscribe();
  }, [setLoading, setMovie, setError]);

  useEffect(() => {
    subject$.current.next(title);
  }, [title]);

  if (loading) {
    return <CircularProgress size={30} />;
  }

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  if (!movie) {
    return null;
  }

  return (
    <React.Fragment>
      <Dialog
        className={classes.movieDetail}
        fullScreen
        open={!!title}
        onClose={onClose}
        TransitionComponent={Transition}
        classes={{
          paper: classes.darkBg,
        }}
      >
        <Grid container>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography variant="caption" className={classes.title}>
                {movie.Runtime + " " + movie.Released}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.text}>
                <Typography variant="h1">{movie.Title}</Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.ratingContainer}>
                <Typography variant="body2">
                  Imdb: {movie.imdbRating}
                </Typography>
                <Typography variant="body2">
                  Metascore: {movie.Metascore}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.plotContainer}>
                <div className={classes.title}>
                  <Typography variant="body2">Plot</Typography>
                </div>
                <div className={classes.text}>
                  <Typography variant="body2">{movie.Plot}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={4}>
                <ListRenderer title="Cast" value={movie.Actors} />
              </Grid>
              <Grid item xs={4}>
                <ListRenderer title="Genre" value={movie.Genre} />
              </Grid>
              <Grid item xs={4}>
                <ListRenderer title="Director" value={movie.Director} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.darkBg}>
            <img src={movie.Poster} width="100%" alt={movie.Title} />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.closeButtonContainer}>
              <Button
                classes={{
                  label: classes.closeButton,
                }}
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
};

export default MovieDetailView;
