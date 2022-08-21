import React, { useEffect } from "react";
import axios from "axios";
import "../App.css";

function Dashboard({ code }) {
  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      axios
        .post(`http://localhost:3001/spotify/v1/auth`, { code })
        .then((res) => {
          console.log(res.data);
        })
        .catch(() => {
          window.location = "/";
        });
    }
    return () => {
      ignore = true;
    };
  }, [code]);
  return (
    <div>
      <h1>Hello Spotify World</h1>
    </div>
  );
}

export default Dashboard;
