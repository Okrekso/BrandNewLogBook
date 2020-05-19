import Axios from "axios";
import Backend from "./backend";
import Auth from "./auth";
class Request {
    /**
     * @param {String} backendURL url to backend server
     * @param {String} tableName name of the table where data is
     * @param {"GET"|"POST"} method method of request to be done
     */
    constructor() {
        this.url = Backend.url;
    }

    /**
     * @returns {Promise}
     */
    get() {
        console.log(this.url);
        return new Promise((resolve, reject) => {
            Axios
                .get(this.url, { headers: { Authorization: `Bearer ${Auth.authParams.access}` } })
                .then(data => resolve(data.data))
                .catch(err => {
                    err = err.response.statusText;
                    if (err == "Unauthorized") {
                        Auth.refreshToken().then(() => {
                            this.get().then(data => resolve(data));
                        });
                    } else reject(err.response);
                });
        });
    }
}

class DocumentRequest extends Request {
    constructor(tableId, documentId) {
        super();
        this.url = Backend.url + `/${tableId}/${documentId}/`;
    }

    update(data) {
        return Axios.post(this.url, {}, { data: data });
    }
}

class TableRequest extends Request {
    constructor(tableId) {
        super();
        this.tableId = tableId;
        this.url = this.url + `/${tableId}/`;
    }
    add(data) {
        return Axios.post(this.url, {}, { data: data });
    }

    id(documentId) {
        return new DocumentRequest(this.tableId, documentId);
    }
}

export default class Database {
    table(tableName) {
        return new TableRequest(tableName);
    }
}