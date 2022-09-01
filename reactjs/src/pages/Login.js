import "../App.css";
import GreenSpotify from "../images/logos/02_CMYK/02_PNG/Spotify_Logo_CMYK_Green.png";

function Login() {
  return (
    <div>
      <header className="App-header">
        <div className="heading">
          <h1>Welcome!</h1>
          <img src={GreenSpotify} alt="" />
        </div>
        <button>
          <a href="http://localhost:3001/spotify/v1/login">
            Log In with Spotify
          </a>
        </button>
      </header>
    </div>
  );
}

export default Login;
