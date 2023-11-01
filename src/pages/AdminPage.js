import React from "react";
import {Link} from "react-router-dom";
const AdminPage = () => {
  return (
    <div className="center">
      <Link to="/">
            <button className="back">Back</button>
        </Link>
      <h3>List here</h3>
      <button>Start Game!</button>
    </div>
  );
}
export default AdminPage;