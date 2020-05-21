import React, { useEffect, useState } from 'react';
import { db, userLeft, renderUsers, vacantRoom } from '../firebase/firebase';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
//import { getMyData } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from '../redux/store';
import { connect } from 'react-redux';
import { Modal } from '@material-ui/core';
import Messages from './Messages';
import { SearchBar } from '.';
import Header from './Header';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { List } from '@material-ui/core';
import Footer from './Footer';
import useDarkMode from 'use-dark-mode';
import CardContent from '@material-ui/core/CardContent';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import { Alert, AlertTitle } from '@material-ui/lab';
import Collapse from '@material-ui/core/Collapse';
import Slide from '@material-ui/core/Slide';

const SingleRoom = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [users, setUsers] = useState([]);
  const darkMode = useDarkMode(false);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [alert, setAlert] = useState(false);

  const getNewUsers = async () => {
    await db
      .collection('Rooms')
      .doc(props.match.params.roomId)
      .collection('Users')
      .onSnapshot(snapshot => {
        const allUsers = [];
        snapshot.forEach(doc => allUsers.push(doc.data()));
        setUsers(allUsers);
      });
  };

  useEffect(() => {
    if (!props.userData.display_name) {
      props.history.push('/');
    } else {
      getNewUsers();
    }
  }, []);

  useEffect(() => {
    var button = document.getElementById('addPerson');
    console.log(button);
    setAnchorEl2(button);
  }, []);

  const click = () => {
    darkMode.toggle();
    console.log(darkMode.value);
  };
  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const copyText = () => {
    var copyText = document.getElementById('room-code');

    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    document.execCommand('copy');
    handleClose();
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 5000)
  };
  const open3 = Boolean(anchorEl2);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  console.log('users in render', users);
  return (
    <div>
      <Header roomId={props.match.params.roomId} history={props.history} />
      {alert ? (
        <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
        <Alert variant='filled' onClose={() => setAlert(false)} severity="success">
          <AlertTitle>Success</AlertTitle>
          Code was Successfully copied to clipboard —{' '}
          <strong>{props.roomCode}</strong>
        </Alert>
        </Slide>
      ) : null}
      <div className="main-container">
        <div className="messages-container">
          <button onClick={click}>Toggle Day / Night</button>
          <h2 id="adding">Buddys</h2>
          <IconButton size="small" id="addPerson" onClick={handleOpen}>
            <p fontSize="small" id="adding">
              <PersonAddIcon /> Add Buddy
            </p>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
          >
            <Card>
              <CardContent className="invite-card">
                <Typography variant="subtitle1" color="textSecondary">
                  Send Invite Code
                </Typography>
                <input
                  type="text"
                  value={props.roomCode}
                  id="room-code"
                ></input>
                <Button
                  onClick={() => copyText()}
                  variant="contained"
                  color="primary"
                  id="search-button"
                >
                  Copy Code
                </Button>
              </CardContent>
            </Card>
          </Popover>
          <Popover
            // id='popover'
            open={open3}
            anchorEl={anchorEl2}
            onClose={handleClose2}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
          >
            <Card id="popover">
              <CardContent className="invite-card">
                <Typography variant="subtitle1" color="textSecondary">
                  add friends here
                </Typography>
              </CardContent>
            </Card>
          </Popover>
          <div>
            {Object.values(users).map((user, i) => {
              console.log('user', user);
              return (
                <div id="userList" key={i}>
                  <img
                    style={{
                      width: '25px',
                      height: '25px',
                      borderRadius: '30%',
                    }}
                    alt="avatar"
                    src={
                      user.image.length > 0
                        ? user.image[0].url
                        : 'https://www.mentoring.org/new-site/wp-content/uploads/2019/05/default-user-300x300.png'
                    }
                  />{' '}
                  {user.name}
                </div>
              );
            })}
          </div>
          <Messages roomId={props.match.params.roomId} />
        </div>
        <div className="right-box">
          <SearchBar roomId={props.match.params.roomId} />
        </div>
      </div>
      <Footer roomCode={props.roomCode} />
    </div>
  );
};
const stateToProps = state => ({
  access_token: state.access_token,
  userData: state.userData,
  refresh_token: state.refresh_token,
  roomCode: state.roomCode,
});

const dispatchToProps = dispatch => ({
  getAccessToken: code => dispatch(getAccessToken(code)),
  setSpotifyCode: code => dispatch(setSpotifyCode(code)),
  getUserData: token => dispatch(getUserData(token)),
});

export default connect(stateToProps, dispatchToProps)(SingleRoom);
