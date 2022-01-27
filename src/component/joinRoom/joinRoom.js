import "./joinRoom.css";
import React, {useEffect, useState} from "react";
import socket from "../../socket";
import { Redirect} from "react-router-dom";
const JoinRoom=()=>{
    const [formData,setFormData]=useState({
        name:"",
        roomId:""
    });
    const [error,setError]=useState({
        name:"",
        roomId:""
    });
    const [roomJoined,setRoomJoined]=useState(false);
    const joinRoom=(e)=>{
        e.preventDefault();
        const err={
            name:"",
            roomId:""
        }
        if(formData.name==="")
        {
            err.name="Your Name Required";
        }
        if(formData.roomId.length !== 6)
        {
            err.roomId="Required 6 letter Id!";
        }
        if(err.name !== "" || err.roomId !== "" )
        {
            setError({...err});
        }
        else
        {
            socket.emit("joinRoom",formData);
        }
    }
    useEffect(()=>{
        let isMounted=true;
    socket.on("joinRoomError",(e)=>{
        if(isMounted)
        {
        if(e.alert!==undefined)
        {
            alert(e.alert);
            setError({...e});
        }
        else
        setError({...error,...e});
    }
    });
    socket.on("permissionAllowed",(data)=>{
        if(isMounted)
        {
        socket.emit("join",data);
        }
    })
    socket.on("joinedRoom",(name)=>{
        if(isMounted)
        {
        localStorage.clear();
        sessionStorage.setItem("isAuth","true");
        localStorage.setItem("messageList","{\"arr\":[]}");
        localStorage.setItem("name",name);
        setRoomJoined(true);
        }
    });
    return(
        ()=>isMounted=false
    )
},[]);
    return(
        <React.Fragment>
            {!roomJoined?
        <div className="background">
            <form onSubmit={joinRoom} className="card">

               <label htmlFor="joinName">Enter your Name:</label>
               <div className="inputDiv">
                   <input onChange={(e)=>{setFormData({...formData,name:e.target.value})}} autoFocus type="text" id="joinName" placeholder="Enter your Name"/>
                   <div className="inputError">{error.name}</div>
               </div>

               <label htmlFor="joinRoomId">Enter Room Id:</label>
               <div className="inputDiv">
                   <input onChange={(e)=>{setFormData({...formData,roomId:e.target.value})}} type="text" id="joinRoomId" placeholder="Enter Unique Room Id" minLength="6" maxLength="6"/>
                   <div className="inputError">{error.roomId}</div>
               </div>

               <input type="submit" value="Enter Room" className="enterButtons"/>
            </form>
        </div>:
        <Redirect to={"/chat-room/"+formData.roomId}/>
        }
        </React.Fragment>
    );
}
export default JoinRoom;