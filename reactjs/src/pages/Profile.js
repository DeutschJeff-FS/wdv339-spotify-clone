import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(true);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("http://localhost:300`/spotify/v1/me")
        .then(({ data }) => {
          setData(data);
        })
        .catch((error) => {
          console.error(error);
        });
      setLoading(false);
    };
    getData();
  }, []);
  return <div>Profile</div>;
}

export default Profile;
