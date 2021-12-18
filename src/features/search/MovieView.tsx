import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Movie } from "./Movie";
import useStyle from "./style";

export type MovieProps = {
  movie: Movie;
  onClick?: (title: string) => void;
};

const MovieView: React.FC<MovieProps> = ({ movie, onClick }) => {
  const classes = useStyle();

  const showMovieDetail = () => {
    if (onClick) {
      onClick(movie.Title);
    }
  };
  return (
    <React.Fragment>
      <Card className={classes.movieRoot} onClick={showMovieDetail}>
        <CardActionArea>
          <CardMedia
            className={classes.movie}
            image={movie.Poster}
            title={movie.Title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {movie.Title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </React.Fragment>
  );
};

export default MovieView;
