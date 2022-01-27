import React from "react";
import { Redirect,Route,Switch} from "react-router-dom";
import './App.css';
import Home from "./component/Home/home";
import Chat from "./component/chat/chat";
function App() {
  return (
    <Switch>
    <Route path="/home" component={Home}/>
    <Route path="/chat-room/:id" component={Chat}/>
    <Redirect to="/home"/>
   </Switch>
  );
}
export default App;
