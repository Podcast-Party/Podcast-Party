import React, { useEffect, useState } from "react";
import Routes from "../routes";
import SearchBar from "./SearchBar";
import "./App.css";
import { spotifyLogin } from "../spotifyLogin";
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store";
import { connect } from "react-redux";
import Rooms from "./Rooms";
import Button from "@material-ui/core/Button";

function App(props) {
  useEffect(() => {
    if (!props.code) {
      let code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        props.setSpotifyCode(code);
        props.getAccessToken(code);
      }
    }
  }, []);

  useEffect(() => {
    if (props.access_token) {
      props.getUserData(props.access_token);
    }
  }, [props.access_token]);

  useEffect(() => {
    const roomId = window.sessionStorage.getItem("roomId");
    console.log("roomId", roomId);
    if (!!props.userData.display_name) {
      console.log("LOOOOOOOK", props.userData);
      props.history.push(`/home`);
    }
    if (props.userData.product) {
      if (props.userData.product !== "premium" || null || undefined) {
        props.history.push(`/error`);
      }
    }
  }, [props]);
  console.log(props.userData);
  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" onClick={() => spotifyLogin(props.code)}>
          Login to Spotify
        </Button>
      </header>
    </div>
  );
}

const stateToProps = (state) => ({
  code: state.code,
  access_token: state.access_token,
  refresh_token: state.refresh_token,
  userData: state.userData,
});

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
});

export default connect(stateToProps, dispatchToProps)(App);
