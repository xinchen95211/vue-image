class indexDB {

    constructor() {
        this.db = null;
    }

    async initDB(dbName, version) {
        const request = indexedDB.open(dbName, version);

        return new Promise((resolve, reject) => {
            request.onupgradeneeded = evt => {
                this.db = evt.target.result;
                // 创建Object Store
                const store = this.db.createObjectStore('xiuren', {keyPath: 'id'});
                store.add(1,"test")
            };

            request.onsuccess = evt => {
                this.db = evt.target.result;
                resolve(this.db);
            };

            request.onerror = evt => {
                reject(evt);
            };
        });
    }

    async addData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = evt => {
                resolve(evt);
            };

            request.onerror = evt => {
                reject(evt);
            };
        });
    }
    async getData(storeName, key) {

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            const request = store.get(key);

            request.onsuccess = evt => {
                resolve(evt.target.result);
            };

            request.onerror = evt => {
                reject(evt);
            }

        });

    }

    // 其他方法
}

const db = new indexDB();

export default {
    install(app) {
        app.config.globalProperties.$db = db;
    }
}