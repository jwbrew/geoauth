import React, { Component } from "react";
import Blocked from "./Blocked";
import Debug from "./Debug";
import Loading from "./Loading";
import Records from "./Records";
import "./bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      isGeofenced: null
    };

    this.checkGeoFence = this.checkGeoFence.bind(this);
    this.handleGeoError = this.handleGeoError.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }

  checkGeoFence() {
    fetch(
      `/.netlify/functions/geoauth?latitude=${this.state.latitude}&longitude=${
        this.state.longitude
      }`
    )
      .then(x => x.json())
      .then(x => {
        this.setState({ isGeofenced: x.permitted });
      });
  }

  isAuthenticated() {
    return true;
  }

  isGeofenced() {
    return this.state.isGeofenced;
  }

  componentDidMount() {
    console.log("componentDidMount");
    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 5000
    };
    navigator.geolocation.getCurrentPosition(
      this.updatePosition,
      this.handleGeoError,
      options
    );

    const watch = navigator.geolocation.watchPosition(
      this.updatePosition,
      this.handleGeoError,
      options
    );
  }

  handleGeoError(error) {
    console.log(error);
  }

  updatePosition(position) {
    this.setState(state => {
      const newState = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      if (newState !== state && newState.latitude && newState.longitude) {
        this.checkGeoFence();
      }

      return newState;
    });
  }

  render() {
    const isPermitted = this.isAuthenticated() && this.isGeofenced();
    const isLoading = this.state.isGeofenced === null;
    return (
      <div className="container my-4">
        <Debug data={this.state} isPermitted={isPermitted} />
        {isLoading ? <Loading /> : isPermitted ? <Records /> : <Blocked />}
      </div>
    );
  }
}

export default App;
