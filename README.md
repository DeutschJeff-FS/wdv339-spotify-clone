# Project & Portfolio 3

## WDV339-O | C202208-01

#### Jeff Deutsch

![](https://img.shields.io/badge/school-full%20sail%20university-orange)
![](https://img.shields.io/badge/degree-web%20development-blue)

<jadeutsch@student.fullsail.edu>

---

---

### Project Overview

This project is a Spotify clone. It will have a minimum of three endpoints, be able to handle a user logging in and out (along with handling errors associated with that), and a full interactive UI.

---

### Prerequesites

_**Base Technology Requirements**_

- React >= v18.2.0
- Node >= v16.15.0
- npm >= v8.13.0
- Express >= v4.18.0
- Browser Support (per React): Chrome/Firefox/Safari <= Last Major Version
- MongoDB

_**Other Technologies Used**_

- NPM Packages
  - API
    - Dependencies
      - axios >= v0.27.0
      - body-parser >= v1.20.0
      - cors >= v2.8.0
      - dotenv >= v16.0.0
      - mongoose >= v6.5.0
      - qs >= v6.11.0
      - randomstring >= v1.2.2
      - spotify-web-api-node >= v5.0.0
    - DevDependencies
      - nodemon >= v2.0.0
  - React
    - Dependencies
      - react-icons >= v4.4.0
      - react-router-dom >= v6.3.0
      - axios >= v0.27.0
      - styled-components >= v5.3.0

---

### Getting Started

- Install dependencies
  - `npm i` or `npm install`
- To run API using Nodemon
  - From root folder, `cd api`
  - Then `npm run dev`
- To run API using Node
  - From root folder, `cd api`
  - Then `npm start`
- To run React
  - From root folder, `cd reactjs`
  - Then `npm start`

---

### Links

- [](http://localhost:3000) - Link to the frontend application for the homepage
- [](http://localhost:3001) - Link to the backend (Express) API
- [](https://accounts.spotify.com/authorize) - Spotify API authorization route
- [](https://api.spotify.com/v1/me) - Spotify API endpoint to get user info
- [](https://api.spotify.com/v1/me/player) - Spotify API endpoint to create player
- [](https://api.spotify.com/v1/me/player/currently-playing) - Spotify API endpoint to play currently selected music
- [](https://api.spotify.com/v1/playlists) - Spotify API endpoint to get user's playlist data
