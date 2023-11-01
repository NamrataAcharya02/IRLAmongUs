import React, {useState} from "react";
import {Link} from "react-router-dom";
function PlayerWaiting({nickname}){
    // const nickname = useState('');
  return (
    <div className="center">
      <Link to="/">
            <button className="back">Back</button>
        </Link>
      <h1>HELLO WORLD! lol</h1>
      <h1>{nickname}</h1>
    </div>
  );
}
export default PlayerWaiting;