export class Backend {
    constructor() {
        this.url = "http://127.0.0.1:5050";
        this.authTokenPath = this.url + "/token/auth/";
        this.refreshTokenPath = this.url + "/token/refresh/";
    }
}

export default new Backend();