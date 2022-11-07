import axios from "axios";
import authHeader from "./auth-header";

/** change this to api.js */

const API_URL = "https://api.thegreeninvestor.net:8080/api/";

class ProfileService {
  getProfileDetails() {
    return axios.get(API_URL + "user/getProfile", {
      headers: authHeader(),
      "Content-Type": "application/json",
    });
    //return "dummytext";
  }

}

export default new ProfileService();
