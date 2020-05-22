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

    static fromUrl(url) {
        return new Request();
    }

    /**
     * 
     * @param {Object} object 
     */
    removeNullsFromObject(object) {
        let newObject = new Object();
        Object.keys(object).map(key => { if (object[key] != null) newObject[key] = object[key] });
        return newObject;
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
                        })
                            .catch(err => {
                                err = err.response.statusText;
                                if (err == "Unathorized") {
                                    Auth.logOut();
                                }
                            })
                    } else reject(err.response);
                });
        });
    }
}

class DocumentRequest extends Request {
    constructor(tableId, documentId) {
        super();
        this.url = Backend.url + `/${tableId}/${documentId}/`;
        this.document = documentId;
        this.table = tableId;
    }

    static fromUrl(url) {
        const tableId = url.split("/")[1];
        const documentId = url.split("/")[2];
        return new DocumentRequest(tableId, documentId);
    }

    update(data) {
        data = this.removeNullsFromObject(data);
        return Axios.patch(this.url, {}, {
            data: {
                ...data,
            },
            headers: {
                Authorization: `Bearer ${Auth.authParams.access}`
            }
        })
            .catch(err => {
                err = err.response.statusText;
                if (err == "Unauthorized") {
                    Auth.refreshToken().then(() => {
                        this.update(data).then(data => resolve(data));
                    })
                        .catch(err => {
                            err = err.response.statusText;
                            if (err == "Unathorized") {
                                Auth.logOut();
                            }
                        })
                }
            });
    }

    delete() {
        return Axios.delete(this.url, {
            headers: {
                Authorization: `Bearer ${Auth.authParams.access}`
            }
        })
            .catch(err => {
                err = err.response.data;
                console.log(err);
                if (err == "Unauthorized") {
                    Auth.refreshToken().then(() => {
                        this.delete(data).then(data => resolve(data));
                    })
                        .catch(err => {
                            err = err.response.statusText;
                            if (err == "Unathorized") {
                                Auth.logOut();
                            }
                        })
                }
            });
    }
}

class TableRequest extends Request {
    constructor(tableId) {
        super();
        this.tableId = tableId;
        this.url = this.url + `/${tableId}/`;
    }

    static fromUrl(url) {
        const tableId = url.split("/")[1];
        return new TableRequest(tableId);
    }

    add(data) {
        data = this.removeNullsFromObject(data);
        return Axios.post(this.url, {}, {
            data: {
                ...data,
            },
            headers: {
                Authorization: `Bearer ${Auth.authParams.access}`
            }
        })
            .catch(err => {
                err = err.response.statusText;
                if (err == "Unauthorized") {
                    Auth.refreshToken().then(() => {
                        this.add(data).then(data => resolve(data));
                    })
                        .catch(err => {
                            err = err.response.statusText;
                            if (err == "Unathorized") {
                                Auth.logOut();
                            }
                        })
                }
            });
    }

    /**
     * 
     * @param {String} fieldId ID of the field to filter
     * @param {"="|">"|"<"|"<="|">="} condition Condition to do with fieldID
     * @param {String} equality value to use conditon
     */
    where(fieldId, condition, equality) {
        this.url = this.url + `?${fieldId}${condition}${equality}`;
        return new ConditionRequest(this.url);
    }

    id(documentId) {
        return new DocumentRequest(this.tableId, documentId);
    }
}

class ConditionRequest extends Request {
    constructor(url) {
        super();
        this.url = url;
    }
    /**
     * 
     * @param {String} fieldId ID of the field to filter
     * @param {"="|">"|"<"|"<="|">="} condition Condition to do with fieldID
     * @param {String} equality value to use conditon
     */
    where(fieldId, condition, equality) {
        this.url = this.url + `&${fieldId}${condition}${equality}`;
        return new ConditionRequest(this.url);
    }
}

export default class Database {
    table(tableName) {
        return new TableRequest(tableName);
    }
}