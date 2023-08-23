import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <h2>Not Found</h2>
      <p>There's nothing here. Maybe it's time to take a break.</p>
      <Link to={"/"} className="btn btn-warning">
        Return Home
      </Link>
    </>
  );
}

export default NotFound;
