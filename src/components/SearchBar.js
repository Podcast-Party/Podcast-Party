import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Player from "./Player";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Button from "@material-ui/core/Button";
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store";
import { connect } from "react-redux";
import { getEpisode, fetchEpisodes, fetchShows } from "../api/spotifyApi";

const SearchBar = (props) => {
  const token = props.token;
  const [state, setState] = useState({
    epId: "",
  });
  let [search, setSearch] = useState("");
  let [result, setResult] = useState([]);
  let [episodes, setEpisodes] = useState([]);
  let [chosenEpisode, setEpisode] = useState();
  let [uri, setUri] = useState();
  let [results, setResults] = useState([
    { value: "chocolate", label: "Chocolate" },
  ]);
  const searchHandler = async () => {
    const q = encodeURIComponent(`${search}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const searchJSON = await response.json();
    console.log(searchJSON);
    let searchArr = [{ value: "chocolate", label: "Chocolate" }];

    if (searchJSON.shows) {
      searchArr = searchJSON.shows.items.map((item) => {
        return { value: item.id, label: item.name };
      });
    }
    setResults(searchArr);
    // var result = results.filter(item => item.label === search)
    // setResult(result)
  };

  useEffect(() => {
    const foo = async function () {
      await searchHandler();
    };
    foo();
  }, [props.search]);

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
    getEpisode(event.target.value, token).then((res) => setEpisode(res));
  };

  const activeSearch = async (text) => {
    setSearch(text);
    await searchHandler();
  };

  const getEpisodes = async () => {
    fetchShows(search, token)
      .then((res) => {
        result = res.shows.items.map((item) => {
          return item.id;
        });
      })
      .then(() => setResult(result))
      .then(() => fetchEpisodes(result, token))
      .then((res) => {
        return res.items.map((item) => {
          return {
            uri: item.uri,
            name: item.name,
            date: item.release_date,
            id: item.id,
          };
        });
      })
      .then((res) => setEpisodes(res));
  };
  // .then((res) => setEpisodes(res))

  // const q = encodeURIComponent(`${search}`);
  // const response = await fetch(
  //   `https://api.spotify.com/v1/search?q=${q}&type=show&market=US&limit=1`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );
  // const searchJSON = await response.json();
  // console.log(searchJSON)

  //   if (result) {
  //     console.log("getting episodes");

  //     console.log(episodesJSON);
  //     try {
  //       let episodesArr = episodesJSON.items.map((item) => {
  //         return {
  //           uri: item.uri,
  //           name: item.name,
  //           date: item.release_date,
  //           id: item.id,
  //         };
  //       });
  //       setEpisodes(episodesArr);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  // console.log('CHOSEN EPISODE URI ', chosenEpisode)
  return (
    <div>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e, v) => activeSearch(v)}
        options={results.map((item) => item.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={({ target }) => {
              activeSearch(target.value);
            }}
            label="Search input"
            margin="normal"
            variant="outlined"
          />
        )}
      />
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={getEpisodes}
      >
        Get Episodes
      </Button>

      <div>
        <FormControl>
          <InputLabel htmlFor="age-native-simple">Episodes</InputLabel>
          <Select native value={state.epId} onChange={handleChange}>
            <option aria-label="None" value="" />
            {episodes &&
              episodes.map((episode) => (
                <option
                  key={episode.id}
                  value={episode.id}
                  onClick={() => {
                    getEpisode(episode.id);
                    setUri(episode.uri);
                  }}
                >
                  {episode.name}
                </option>
              ))}
          </Select>
        </FormControl>
      </div>

      {/* {episodes.map((episode) => (
        <ListItem
          button
          onClick={() => {
            getEpisode(episode.id);
            setUri(episode.uri);
          }}
          key={episode.id}
        >
          {episode.name}
        </ListItem>
      ))} */}

      <Player
        token={token}
        uri={uri}
        roomId={props.roomId}
        episode={chosenEpisode}
      />
    </div>
  );
};
const stateToProps = (state) => ({
  token: state.access_token,
});

export default connect(stateToProps)(SearchBar);
