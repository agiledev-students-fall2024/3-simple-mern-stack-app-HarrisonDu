import { Link } from 'react-router-dom'
import './Home.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AboutPage = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the about info when the component mounts
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/aboutUs`)
      .then((response) => {
        setAboutInfo(response.data);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.error || err.message;
        setError(errMsg);
      });
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : aboutInfo ? (
        <div>
          <h1>{aboutInfo.name}</h1>
          <p>{aboutInfo.description[0]}</p><br></br>
          <p>{aboutInfo.description[1]}</p><br></br>
          <p>{aboutInfo.description[2]}</p><br></br>
          <img src={aboutInfo.imageUrl} alt={aboutInfo.name} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AboutPage;
