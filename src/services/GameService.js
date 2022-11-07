import axios from "axios";
import authHeader from "./auth-header";

/** change this to api.js */

const API_URL = "https://api.thegreeninvestor.net:8080/api/";

class GameService {
  getGameContent() {
    return axios.get(API_URL + "questions", {
      headers: authHeader(),
      "Content-Type": "application/json",
    });
    //return "dummytext";
  }

  getOptions({ id }) {
    return axios.get(API_URL + `questions/${id}/options`, {
      headers: authHeader(),
      "Content-Type": "application/json",
    });
    //return "dummytext";
  }

 
  getGameState() {
    console.log("hello");
    if (Object.keys(authHeader()).length !== 0) {
      return axios.get("https://api.thegreeninvestor.net:8080/api/gameInfo", {
        headers: authHeader(),
        "Content-Type": "application/json",
      });
    }
  }

  postStartGame() {
    console.log("hello");
    if (Object.keys(authHeader()).length !== 0) {
      return axios.post("https://api.thegreeninvestor.net:8080/api/startGame", undefined, {
        headers: authHeader(),
        "Content-Type": "application/json",
      });
    }
  }
}

export default new GameService();
