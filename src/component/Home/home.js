import "./home.css";
import React from "react";
import { Route, Switch, Link } from 'react-router-dom';
import CreateRoom from "../createRoom/createRoom";
import JoinRoom from "../joinRoom/joinRoom";
const Home = () => {
    localStorage.clear();
    sessionStorage.setItem("isAuth","false");
    const data = (
        <div className="background">
            <div className="card">
                <Link style={{ "textDecoration": "none" }} to="/home/createRoom"><div className="homeButton">Create Room</div></Link>
                <Link style={{ "textDecoration": "none" }} to="/home/joinRoom"><div className="homeButton">Join Room</div></Link>
            </div>
        </div>);
    return (
        <Switch>
            <Route exact path="/home/createRoom" component={CreateRoom} />
            <Route exact path="/home/joinRoom" component={JoinRoom} />
            <Route path="/home" render={() => { return (data) }} />
        </Switch>
    );
};
export default Home;