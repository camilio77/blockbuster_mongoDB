// movis.js
import { connect } from "../../helpers/db/connect.js";

export class movis extends connect {
    static instanceMovis;
    db;
    collection;
    constructor() {
        if (movis.instanceMovis) {
            return movis.instanceMovis;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('movis');
        movis.instanceMovis = this;
    }
    destructor(){
        movis.instanceMovis = undefined;
        connect.instanceConnect = undefined;
    }
    async getAll() {
        await this.conexion.connect();
        const res = await this.collection.find({}).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllDVDs(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
            [
                {
                  $unwind: "$format"
                },
                {
                  $match: {
                    "format.name": "dvd"
                  }
                },
                {
                  $group: {
                    _id: "$format.name",
                    cantidad: {$sum: "$format.copies"}
                  }
                }
              ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllMovieGenres(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
            [
                {
                  $unwind: "$genre"
                },
                {
                  $group: {
                    _id: "$genre"
                  }
                },
                {
                  $project: {
                    _id: 0,
                    genero: "$_id"
                  }
                }
              ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllMoviesWithAuthor1(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
            [
                {
                  $unwind: "$character"
                },
                {
                  $match: {
                    "character.id_actor": 1
                  }
                }
              ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllDVDsAvaliableValue(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
            [
                {
                  $unwind: "$format"
                },
                {
                  $match: {
                    "format.name": "dvd"
                  }
                },
                {
                  $group: {
                    _id: "$format.name",
                    valor_total: {$sum: {$multiply: ["$format.value", "$format.copies"]}}
                  }
                },
                {
                  $project: {
                    _id: 0,
                    formato: "$_id",
                    valor_total: "$valor_total"
                  }
                }
              ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllMoviesWithJonDoe(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
            [
                { $unwind: "$character" },
                { $match: { "character.id_actor": 1 } },
                {
                  $lookup: {
                    from: "authors",
                    localField: "character.id_actor",
                    foreignField: "id_actor",
                    as: "actor_info"
                  }
                },
                { $unwind: "$actor_info" },
                {
                  $project: {
                    _id: 1,
                    movie_name: "$name",
                    "character.id_actor": 1,
                    "character.rol": 1,
                    "character.apodo": 1,
                    "actor_info.full_name": 1
                  }
                }
              ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllMoviesWithPrincipalAuthors(){
        await this.conexion.connect();
        const res = await this.collection.find(
            { "character.rol": "principal" },
            {
              name: 1,
              "character.$": 1
            }
          ).toArray(); 
        await this.conexion.close();
        return res;
    }



    async getMostDvdMovie(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
            [
                { $unwind: "$format" },
                { $match: { "format.name": "dvd" } },
                { $sort: { "format.copies": -1 } },
                { $limit: 1 },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    "format.name": 1,
                    "format.copies": 1
                  }
                }
              ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }
}