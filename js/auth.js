import Axios from "axios";

// this is temporary values before backend connected
export default class Auth {
    static auth() {
        try {
        this.authParams = JSON.parse(localStorage.getItem("authParams"));
        } catch {
            this.authParams = null;
        }
        this.currentUser = {
            name: "Tester",
            status: "student",
            id: "s000000",
            group: "4SD-31",
        };
        return this;
    }
    static signIn(username, password) {
        const authPath = "http://127.0.0.1:5050/token-auth/";
        
        return Axios.post(authPath, {}, {
            data: {
                username: username,
                password: password
            }
        })
    }
}