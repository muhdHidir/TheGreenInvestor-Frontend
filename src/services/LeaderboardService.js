import axios from "axios";

/** change this to api.js */

const API_URL = "https://api.thegreeninvestor.net:8080/api/";

class LeaderboardService {
  getLeaderboardDetails() {
    return axios.get(API_URL + "gameStats/allUnique", {
      "Content-Type": "application/json",
    });
  }
}

export default new LeaderboardService();
