import React from "react";
import {Link} from "react-router-dom";
const AdminPage = () => {
  return (
    <div className="center">
      <Link to="/">
            <button className="back">Back</button>
        </Link>
      <h3>List here</h3>
      <h4>not a task 1 I'm just a header for good looks</h4>
      <h4>not a task 2 Just a placeholding space</h4>
      <h4>not a task 3 I should make my cheatsheet</h4>
      <h3>Game customizations here</h3>
      <p>A slider that does not do anything (poor slider):</p>
      <input type="range" min="1" max="100"></input>
      <button>Start a Room</button>
    </div>
  );
}
export default AdminPage;