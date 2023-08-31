import React from "react";
import { Link } from "react-router-dom";

function NotFound({ backHome }) {
  return (
    <div className="NotFound">
      <h2>Not Found</h2>
      <Link to={"/"} className="btn btn-warning">
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;
