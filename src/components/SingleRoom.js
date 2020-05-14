import React from "react"
import Messages from "./Messages"
import { db, userLeft, renderUsers } from "../firebase/firebase"
import { Route } from "react-router-dom"
import { Link } from "react-router-dom"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"

class SingleRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      users: {},
    }
    this.leaveRoom = this.leaveRoom.bind(this)
  }
  async componentDidMount() {
    this.props.getUserData(this.props.access_token)
    await renderUsers(this.props.match.params.roomId)
    this.setState({
      users: await renderUsers(this.props.match.params.roomId),
    })
  }
  async leaveRoom(roomId, displayName) {
    userLeft(this.props.match.params.roomId, this.props.userData.display_name)
    this.props.history.push("/")
  }

  render() {
    return (
      <div>
        <h2>Users</h2>
        <div>
          {Object.values(this.state.users).map((user) => {
            return <li key={user}>{user}</li>
          })}
        </div>
        <button type="button" onClick={this.leaveRoom}>
          Leave Room
        </button>
        <Messages />
      </div>
    )
  }
}
const stateToProps = (state) => ({
  access_token: state.access_token,
  userData: state.userData,
  refresh_token: state.refresh_token,
})

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
})

export default connect(stateToProps, dispatchToProps)(SingleRoom)
