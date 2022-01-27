import React from "react";

const SliderInfo = (props) => {
    let j = 0;
    return (
        <React.Fragment>
            <h3 style={{ width: "100%", textAlign: "left" }}>Room Id: {props.roomData.roomId}</h3>
            <h4 style={{ width: "100%", textAlign: "left", color: "darkgreen" }}>Online:</h4>
            <ul>
                {
                    props.roomData.users.map((obj) => {
                        if (props.roomData.currentSocket === obj.socketId && props.roomData.admin === obj.socketId) {
                            return (
                                <li style={{ color: "darkgreen" }} key={j++}>You (admin)</li>
                            )
                        }
                        else if (props.roomData.currentSocket === obj.socketId) {
                            return (
                                <li style={{ color: "darkgreen" }} key={j++}>You</li>
                            )
                        }
                        else if (props.roomData.admin === obj.socketId) {
                            return (
                                <li key={j++}>{obj.name} (admin)</li>
                            );
                        }
                        else {
                            return (
                                <li key={j++}>{obj.name}</li>
                            )
                        }
                    })
                }
            </ul>
        </React.Fragment>
    );
}
export default SliderInfo;