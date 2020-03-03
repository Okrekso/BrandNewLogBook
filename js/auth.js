// this is temporary values before backend connected
export default class Auth {
    static auth() {
        this.currentUser = {
            name: "Tester",
            status: "student",
            id: "s000000",
            group: "4SD-31",
        };
        return {
            currentUser: this.currentUser
        }
    }
    static signIn() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}