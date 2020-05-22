import Axios from "axios";
import Backend from "./backend";

// this is temporary values before backend connected
export class Auth {
    constructor() {
        try {
            this.authParams = JSON.parse(localStorage.getItem("authParams"));
        } catch {
            this.authParams = null;
        }
        return this;
    }

    isAuthenticated() {
        console.log(this.authParams)
        return this.authParams != null &&
            this.authParams.access &&
            this.authParams.refresh &&
            this.authParams.userId;
    }

    getUserId() {
        return this.authParams.userId;
    }

    refreshToken() {
        console.log("updates token");
        return new Promise((resolve, reject) => {
            Axios.post(Backend.refreshTokenPath, {}, {
                data: { refresh: this.authParams.refresh }
            })
                .then(data => {
                    const authParams = { ...this.authParams, access: data.data.access };
                    this.authParams = authParams;
                    localStorage.setItem("authParams", JSON.stringify(authParams));
                    resolve("success");
                })
                .catch(err => {
                    err = err.response.data.code;
                    if (err == "token_not_valid") {
                        this.logOut();
                        window.location.reload();
                    } else reject(err);
                })
        });
    }

    logOut() {
        localStorage.setItem("authParams", null);
        this.authParams = null;
    }

    /**
     * 
     * @param {{name:String, surname:String, type:"STD"|"ADM"|"TCH"}} params 
     */
    signUp(params) {
        return new Promise((resolve, reject) => {

        });
    }

    logIn(email, password) {
        return new Promise((resolve, reject) => {
            Axios.post(Backend.authTokenPath, {}, {
                data: {
                    email: email,
                    password: password
                }
            })
                .then(data => {
                    data = { ...data.data, email: email };
                    localStorage.setItem("authParams", JSON.stringify(data));
                    resolve(data);
                })
                .catch(err => reject(err));
        });
    }
}

export default new Auth();