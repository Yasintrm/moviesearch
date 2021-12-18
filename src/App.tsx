import { Container } from "@material-ui/core";
import React from "react";
import "./App.css";
import Search from "./features/search/Search";

function App() {
  return (
    <Container maxWidth="lg">
      <Search />
    </Container>
  );
}

export default App;
