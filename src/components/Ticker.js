import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { setPosition } from "../redux/store";

const Ticker = (props) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    props.setPosition(seconds);
  }, [seconds]);

  return
};

const stateToProps = (state) => ({
  position: state.position,
});

const dispatchToProps = (dispatch) => ({
  setPosition: (position) => dispatch(setPosition(position)),
});

export default connect(stateToProps, dispatchToProps)(Ticker);

