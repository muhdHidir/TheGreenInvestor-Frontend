import api from "./api";

class StateService {

    getStates(id) {
        return api.get("/states/" + id);
    }

    changeStates(id, currentState, yearValue) {
        return api.put("/states/" + id, {currentState, yearValue});
    }
}

export default new StateService();