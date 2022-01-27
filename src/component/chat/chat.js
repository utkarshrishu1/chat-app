import React, { Fragment, useEffect, useState } from "react";
import "./chat.css";
import socket from "../../socket";
import { Redirect } from "react-router-dom";
import { useRef } from "react";
import SliderInfo from "./SiderInfo";
import ChatInfo from "./ChatInfo";
const Chat = () => {
    const ref = useRef(null);
    const inputRef = useRef(null);
    const [messageList, setMessageList] = useState(JSON.parse(localStorage.getItem("messageList")).arr);
    const [displayType, setDisplayType] = useState(false);
    const [roomData, setRoomData] = useState(
        { roomId: "", roomName: "Initial", admin: "456", users: [{ name: "example1", socketId: "123" }, { name: "example2", socketId: "456" }], currentSocket: "456" });

    const [alert, setAlert] = useState({
        show: false,
        data: {}
    });
    const [message, setMessage] = useState("");
    const displaySlider = () => {
        if (displayType)
            setDisplayType(false);
        else
            setDisplayType(true);
    }
    const scrollToBottom = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
    const allowUser = () => {
        socket.emit("permissionReply", { permission: true, data: { ...alert.data } });
        setAlert({ show: false, data: {} });
    }
    const denyUser = () => {
        socket.emit("permissionReply", { permission: false, ...alert.data });
        setAlert({ show: false, data: {} });
    }
    const sendMessage = (e) => {
        e.preventDefault();
        inputRef.current.value = "";
        if (message !== "") {
            socket.emit("sendMessage", message);
            let data = new Date();
            let hours = data.getHours() % 12;
            let min = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
            let ampm = data.getHours >= 12 ? "am" : "pm";
            let currTime = hours + ":" + min + "" + ampm;
            const arr = [...messageList];
            arr.push({ sender: "", content: message, time: currTime });
            localStorage.setItem("messageList", JSON.stringify({ arr }));
            setMessageList([...messageList, { sender: "", content: message, time: currTime }]);
            setMessage("");
        }
    }
    socket.off("permission").on("permission", (data) => {
        setAlert({ show: true, data: data });
    });
    socket.off("recieveMessage").on("recieveMessage", (data) => {
        const arr = [...messageList];
        arr.push({ notification: false, sender: data.sender, content: data.message, time: data.time });
        localStorage.setItem("messageList", JSON.stringify({ arr }));
        setMessageList([...messageList, { notification: false, sender: data.sender, content: data.message, time: data.time }])
    });
    socket.off("getRoomData").on("getRoomData", (roomId) => {
        socket.emit("sendRoomData", roomId);
    });
    socket.off("roomData").on("roomData", (data) => {
        setRoomData({ ...data });
        localStorage.setItem("roomData", JSON.stringify({ ...data }));
    });
    socket.off("Notification").on("Notification", (data) => {
        const arr = [...messageList];
        arr.push({ notification: true, content: data });
        localStorage.setItem("messageList", JSON.stringify({ arr }));
        setMessageList([...messageList, { notification: true, content: data }]);
    });

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            if (window.performance) {
                if (performance.navigation.type === 1) {
                    sessionStorage.setItem("isAuth", "true");
                    socket.emit("changeSocketId", ({ name: localStorage.getItem("name"), roomData: localStorage.getItem("roomData") }));
                }
            }
        }
        return (() => isMounted = false);
    }, []);
    return (
        <React.Fragment>
            {
                sessionStorage.getItem("isAuth") === null ? <Fragment>
                    <Redirect to="/home" /></Fragment> :
                    alert.show ?
                        <div className="backdrop">
                            <div className="card">
                                <h3 style={{ color: "white" }}>{alert.data.name} Wants to join Room</h3>
                                <button className="alertButton" onClick={allowUser}>Allow</button>
                                <button className="alertButton" onClick={denyUser}>Deny</button>
                            </div>
                        </div> : null}
            <div className="Navbar">
                <div onClick={displaySlider} className="Slider-button">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <h3 style={{ color: "white", width: "100%", textAlign: "center" }}>{roomData.roomName}</h3>
            </div>
            <div className="slider_chat_box">
                <div className={displayType ? "showSlider" : "hideSlider"}>
                    <SliderInfo roomData={roomData} />

                </div>
                <div className="chatBox">
                    <ChatInfo ref={ref} messageList={messageList} />
                    <form onSubmit={sendMessage} className="chatInput">
                        <input ref={inputRef} onChange={(e) => { setMessage(e.target.value) }} autoFocus className="messageInput" type="text" placeholder="Enter your message" />
                        <input className="sendMessage" type="submit" value="Send" />
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Chat;