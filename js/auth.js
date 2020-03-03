// this is temporary values before backend connected
export default class Auth {
    static currentUser;

    static signIn = new Promise((resolve, reject) => {
        resolve(true);
    });

    constructor() {
        currentUser = {
            name: "Tester",
            status: "student",
            id: "s000000"
        }
    }
}