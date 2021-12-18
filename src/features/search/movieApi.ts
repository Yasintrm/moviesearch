import axios from "../../app/axios";
import configs from "../../app/configs";
import { MovieDetail, MovieResult } from "./Movie";

export async function getMovies(title: string) {
  return axios.get<MovieResult>("http://www.omdbapi.com", {
    params: {
      apikey: configs.apiKey,
      s: title,
    },
  });
}

export async function getMovieDetail(title: string) {
  return axios.get<MovieDetail>("http://www.omdbapi.com", {
    params: {
      apikey: configs.apiKey,
      t: title,
    },
  });
}
