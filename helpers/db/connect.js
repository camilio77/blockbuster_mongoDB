// connect.js
import { MongoClient } from 'mongodb';

export class connect {
    static instanceConnect;
    db;
    user;
    port;
    cluster;
    #url;
    #host;
    #pass;
    #dbName;

    constructor({ host, user, pass, port, cluster, dbName } = {
        host: "mongodb://",
        user: "mongo",
        pass: "PNSmQbwecKrbuFTCqXmYoaqicgEZpFeF",
        port: 47797,
        cluster: "monorail.proxy.rlwy.net",
        dbName: "test"
    }) {
        if (connect.instanceConnect) {
            return connect.instanceConnect;
        }
        this.setHost = host;
        this.user = user;
        this.setPass = pass;
        this.port = port;
        this.cluster = cluster;
        this.setDbName = dbName;
        this.#open();
        connect.instanceConnect = this;
    }
    destructor(){
        connect.instanceConnect = undefined;
    }
    set setHost(host) {
        this.#host = host;
    }

    set setPass(pass) {
        this.#pass = pass;
    }

    set setDbName(dbName) {
        this.#dbName = dbName;
    }

    get getDbName() {
        return this.#dbName;
    }
    async reConnect() {
        await this.#open();
    }
    async #open() {
        const loadingBar = (progress) => {
            const width = 40; // Width of the loading bar
            const filled = Math.round(progress * width);
            const empty = width - filled;
            const bar = `\r[\x1b[32m${'='.repeat(filled)}${' '.repeat(empty)}\x1b[0m] ${Math.round(progress * 100)}%`;
            process.stdout.write(bar);
        };
    
        // Initial progress
        loadingBar(0);
    
        // MongoDB connection string
        this.#url = `${this.#host}${this.user}:${this.#pass}@${this.cluster}:${this.port}`;
        this.conexion = new MongoClient(this.#url);
    
        // Update progress
        loadingBar(0.25);

        try {
            // Connect to MongoDB
        await this.conexion.connect();
    
        // Update progress
        loadingBar(0.75);
    
        // Log connection message
        console.clear();
        console.log("\n\tMONGO CONNECTION SUCCESSFUL");
    
        // Initialize database
        this.db = this.conexion.db(this.#dbName);
    
        // Finish the loading bar
        loadingBar(1);
        console.log("\n\n\t    CONNECTION RESULT:\n"); // Move to the next line
        } catch(error){
            console.clear();
            console.error("\n\tERROR CONNECTING TO MONGODB");
            loadingBar(0.50);
            console.error(`
                °՞(ᗒᗣᗕ)՞°

             TRY AGAIN PLEASE
                `);
            process.exit(1);
        }
    }
}