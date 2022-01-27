import React from "react";

const ChatInfo = React.forwardRef((props,ref) => {
    let i = 0;
    return (
        <div className="chat">
            {
                props.messageList.map((data) => {
                    if (data.notification) {
                        return (
                            <div ref={ref} key={i++} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px", boxSizing: "border-box" }}>
                                <div style={{ width: "fit-content", color: "gray", fontSize: "15px" }} className="messages">
                                    {data.content}
                                </div>
                            </div>
                        )
                    }
                    else {
                        return (<div ref={ref} key={i++} className={data.sender === "" ? "sender" : "reciever"}>
                            <div className="messageInfo">
                                <h4>{data.sender === "" ? "You" : data.sender}</h4>
                                <h6>{data.time}</h6>
                            </div>
                            <div className="messages">{data.content}</div>
                        </div>)
                    }
                })
            }
        </div>
    );
})
export default ChatInfo;