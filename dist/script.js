// This challenge involves lots of state's updates.
// That's why implementing Redux here seems to be wise.

const audioUrl = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

// PURE REACT //

class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'Session',
      displayedTime: {
        minutes: 25,
        seconds: 0 },

      initializedCountdown: false };

    this.timer = 0;
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleAudio = this.handleAudio.bind(this);
    this.countdown = this.countdown.bind(this);
  }

  // this.props = {
  //    count: { sessionTime, breakTime },
  //    resume
  //    ... + functions
  // }

  handleSessionIncrement() {
    if (!this.state.initializedCountdown) {
      this.setState({
        displayedTime: {
          minutes:
          this.props.count.sessionTime == 60 ?
          60 :
          this.props.count.sessionTime + 1,
          seconds: 0 } });


    }
    this.props.incrementSession();
  }

  handleSessionDecrement() {
    if (!this.state.initializedCountdown) {
      this.setState({
        displayedTime: {
          minutes:
          this.props.count.sessionTime == 1 ?
          1 :
          this.props.count.sessionTime - 1,
          seconds: 0 } });


    }
    this.props.decrementSession();
  }

  handleBreakIncrement() {
    this.props.incrementBreak();
  }

  handleBreakDecrement() {
    this.props.decrementBreak();
  }

  handleReset() {
    let initVar = false;
    this.props.resetMode();
    this.setState({
      mode: 'Session',
      displayedTime: {
        minutes: 25,
        seconds: 0 },

      initializedCountdown: initVar });

    if (!this.props.resume) {
      this.props.playOrPause();
    };
    this.handleStop(initVar);
  }

  countdown() {
    let mode = this.state.mode.toLowerCase(),
    mins = this.state.displayedTime.minutes,
    secs = this.state.displayedTime.seconds,
    updatedMins,
    updatedSecs;
    if (secs == 0) {
      if (mins != 0) {
        let updatedMins = mins - 1;
        this.setState({
          displayedTime: {
            minutes: updatedMins,
            seconds: 59 } });


      } else {
        if (this.state.mode == 'Session') {
          this.setState({
            displayedTime: {
              minutes: this.props.count.breakTime,
              seconds: 0 },

            mode: 'Break' });

          this.handleAudio();
        } else {
          this.setState({
            displayedTime: {
              minutes: 0,
              seconds: 0 },

            mode: 'Session' });

          this.props.playOrPause();
          this.handleStop();
        }
      }
    } else {
      updatedMins = mins;
      updatedSecs = secs - 1;
      this.setState({
        displayedTime: {
          minutes: updatedMins,
          seconds: updatedSecs } });


    }
  }

  handlePlayPause() {
    this.props.playOrPause();
    if (this.props.resume) {
      this.handlePlay();
    } else if (!this.props.resume) {
      this.handlePause();
    }
  }

  handlePlay() {
    if (!this.state.initializedCountdown) {
      this.setState({
        displayedTime: {
          minutes: this.props.count.sessionTime,
          seconds: 0 },

        initializedCountdown: true });

    }
    this.timer = setInterval(this.countdown, 1000);
  }

  handlePause() {
    clearInterval(this.timer);
  }

  handleStop(bool = true) {
    this.handlePause();
    this.setState({
      displayedTime: {
        minutes: this.props.count.sessionTime,
        seconds: 0 } });


    this.handleAudio(bool);
  }

  handleAudio(bool = true) {
    let audioPlayed = document.getElementById('beep');
    audioPlayed.currentTime = 0;
    if (!bool) {
      audioPlayed.pause();
    } else {
      audioPlayed.play();
    }
  }

  render() {

    return (
      React.createElement("div", { id: "pomodoro-clock" },

      React.createElement(Timer, {
        id: "session-label",
        idIncrement: "session-increment",
        idDecrement: "session-decrement",
        idTime: "session-length",
        increment: this.handleSessionIncrement,
        decrement: this.handleSessionDecrement },

      this.props.count.sessionTime),


      React.createElement(Timer, {
        id: "break-label",
        idIncrement: "break-increment",
        idDecrement: "break-decrement",
        idTime: "break-length",
        increment: this.handleBreakIncrement,
        decrement: this.handleBreakDecrement },

      this.props.count.breakTime),


      React.createElement(Display, {
        id: "display",
        idLabel: "timer-label",
        idTimeLeft: "time-left",
        mode: this.state.mode },

      this.state.displayedTime.minutes < 10 ? `0${this.state.displayedTime.minutes}` : this.state.displayedTime.minutes, ":", this.state.displayedTime.seconds < 10 ? `0${this.state.displayedTime.seconds}` : this.state.displayedTime.seconds),


      React.createElement("button", {
        id: "start_stop",
        onClick: this.handlePlayPause }, "Play/Pause"),


      React.createElement("button", {
        id: "reset",
        onClick: this.handleReset }, "Reset"),


      React.createElement("audio", {
        src: audioUrl,
        id: "beep" })));




  }}


class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { id: this.props.id },
      React.createElement("button", {
        id: this.props.idIncrement,
        onClick: this.props.increment }, "+"),

      React.createElement("button", {
        id: this.props.idDecrement,
        onClick: this.props.decrement }, "-"),

      React.createElement("div", { id: this.props.idTime }, this.props.children)));


  }}


class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", { id: this.props.idLabel }, this.props.mode),
      React.createElement("div", { id: this.props.idTimeLeft }, this.props.children)));


  }}


// PURE REDUX //

const INCREMENT_SESSION = 'INCREMENT_SESSION';
const DECREMENT_SESSION = 'DECREMENT_SESSION';
const INCREMENT_BREAK = 'INCREMENT_BREAK';
const DECREMENT_BREAK = 'DECREMENT_BREAK';
const RESET = 'RESET';

const initialCounter = { sessionTime: 25, breakTime: 5 };

const counterReducer = (state = initialCounter, action) => {
  let count = { ...state };
  switch (action.type) {
    case INCREMENT_SESSION:
      count.sessionTime = Math.min(60, count.sessionTime + 1);
      return count;
    case DECREMENT_SESSION:
      count.sessionTime = Math.max(1, count.sessionTime - 1);
      return count;
    case INCREMENT_BREAK:
      count.breakTime = Math.min(60, count.breakTime + 1);
      return count;
    case DECREMENT_BREAK:
      count.breakTime = Math.max(1, count.breakTime - 1);
      return count;
    case RESET:
      return initialCounter;
    default:
      return state;}

};

const PLAY_OR_PAUSE = 'PLAY_OR_PAUSE';

const countdownReducer = (state = true, action) => {
  let newState = state;
  if (action.type == PLAY_OR_PAUSE) {
    return !newState;
  } else {
    return newState;
  }
};

const rootReducer = Redux.combineReducers({
  count: counterReducer,
  resume: countdownReducer });


const store = Redux.createStore(rootReducer);

// REACT-REDUX //

const mapStateToProps = state => {
  return {
    count: state.count,
    resume: state.resume };

};

const mapDispatchToProps = dispatch => {
  return {
    incrementSession: () => {
      dispatch({ type: INCREMENT_SESSION });
    },
    decrementSession: () => {
      dispatch({ type: DECREMENT_SESSION });
    },
    incrementBreak: () => {
      dispatch({ type: INCREMENT_BREAK });
    },
    decrementBreak: () => {
      dispatch({ type: DECREMENT_BREAK });
    },
    playOrPause: () => {
      dispatch({ type: PLAY_OR_PAUSE });
    },
    resetMode: () => {
      dispatch({ type: RESET });
    } };

};

const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

const Container = connect(mapStateToProps, mapDispatchToProps)(PomodoroClock);

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement(Container, null)));


  }}
;

// And, finally, render the PomodoroClock component!

ReactDOM.render(React.createElement(AppWrapper, null), document.getElementById('root'));