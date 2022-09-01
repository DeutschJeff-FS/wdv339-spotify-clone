import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [secondLoading, setSecondLoading] = useState(true);
  const [data, setData] = useState(null);
  const [choices, setChoices] = useState(null);

  useEffect(() => {
    const getRelease = async () => {
      await axios
        .get("http://localhost:3001/spotify/v1/browse/new-releases")
        .then(({ data }) => {
          setData(data);
        })
        .catch((error) => {
          console.error(error);
        });
      setLoading(false);
    };
    getRelease();
  }, []);

  useEffect(() => {
    const getChoices = async () => {
      await axios
        .get("http://localhost:3001/spotify/v1/browse/categories")
        .then(({ data }) => {
          setChoices(data);
        })
        .catch((error) => {
          console.error(error);
        });
      setSecondLoading(false);
    };
    getChoices();
  }, []);
  return (
    <div className="App-header">
      <h1>Hello Spotify World</h1>
    </div>
  );
}

export default Dashboard;
