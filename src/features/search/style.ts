import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useSearchStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    loadingSpinner: {
      color: "red",
      fontWeight: "bold",
    },
    movieRoot: {
      width: 250,
    },
    movie: {
      height: 300,
      minHeight: 300,
      maxHeight: 300,
    },
    movieResultContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: theme.spacing(2),
      columnGap: theme.spacing(2),
    },
    movieItem: {
      height: 300,
      border: "solid 1px white",
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
    searchField: {
      backgroundColor: "white",
    },
    error: {
      color: "red",
      fontWeight: "bold",
    },
    ratingContainer: {
      display: "flex",
      flexDirection: "row",
      columnGap: theme.spacing(2),
    },
    plotContainer: {
      display: "flex",
      flexDirection: "column",
      rowGap: theme.spacing(2),
    },
    text: {
      color: "white",
    },
    title: {
      color: "gray",
    },
    listContainer: {
      display: "flex",
      flexDirection: "column",
      rowGap: theme.spacing(2),
      color: "white",
    },
    movieDetail: {
      backgroundColor: "rgb(10, 16, 20)",
      padding: theme.spacing(4),
    },
    darkBg: {
      backgroundColor: "rgb(10, 16, 20)",
      padding: theme.spacing(2),
    },
    closeButtonContainer: {
      textAlign: "right",
      color: "white",
    },
    closeButton: {
      color: "white",
    },
  })
);

export default useSearchStyles;
