import React, { useEffect, useState } from "react";
import "./createRoom.css";
import socket from "../../socket";
import { Redirect } from "react-router-dom";
const CreateRoom = () => {
    const [formData, setFormData] = useState({
        name: "",
        roomName: "",
        roomId: ""
    });
    const [error, setError] = useState({
        name: "",
        roomName: "",
        roomId: ""
    });
    const [roomCreated,setRoomCreated]=useState(false);
    const createRoom = (e) => {
        e.preventDefault();
        let err = { name: "", roomName: "", roomId: "" };
        if (formData.name === "") {
            err.name = "Your Name Required!";
        }
        if (formData.roomName === "") {
            err.roomName = "Room Name Required!";
        }
        if (formData.roomId.length !== 6) {
            err.roomId = "Required 6 letters Id!";
        }
        if (err.name !== "" || err.roomId !== "" || err.roomName !== "") {
            setError({ ...err });
        }
        else {
            socket.emit("createRoom", formData);
        }
    }
    useEffect(() => {

        let isMounted = true;

        socket.on("createdRoom", (name) => {

            if (isMounted) {
                localStorage.clear();
                sessionStorage.setItem("isAuth","true");
                localStorage.setItem("messageList","{\"arr\":[]}")
                localStorage.setItem("name",name);
                setRoomCreated(true);
            }

        });
        socket.on("createRoomError", (e) => {

            if (isMounted)
                setError({ ...error, ...e });

        });

        return (() => isMounted = false);
    }, []);
    return (
        <React.Fragment>
            {!roomCreated ?
                <div className="background">
                    <form onSubmit={createRoom} className="card">
                    <label htmlFor="createName">Enter Your Name:</label>
                        <div className="inputDiv">
                            <input onChange={(e) => { setFormData({ ...formData, name: e.target.value.trim() }) }} autoFocus type="text" id="createName" placeholder="Enter your Name" />
                            <div className="inputError">{error.name}</div>
                        </div>

                        <label htmlFor="createRoomName">Enter Room Name:</label>
                        <div className="inputDiv">
                            <input onChange={(e) => { setFormData({ ...formData, roomName: e.target.value.trim() }) }} type="text" id="createRoomName" placeholder="Enter Room Name" />
                            <div className="inputError">{error.roomName}</div>
                        </div>

                        <label htmlFor="createRoomId">Create Unique Room Id:</label>
                        <div className="inputDiv">
                            <input onChange={(e) => { setFormData({ ...formData, roomId: e.target.value.trim() }) }} type="text" id="createRoomId" placeholder="Enter a Unique ID" maxLength="6" minLength="6" />
                            <div className="inputError">{error.roomId}</div>
                        </div>
                        <input type="submit" value="Create Room" className="enterButtons" />
                    </form>
                </div> :
                <Redirect to={"/chat-room/" + formData.roomId} />
            }
        </React.Fragment>
    )
}
export default CreateRoom;