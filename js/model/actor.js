// author.js
import { connect } from "../../helpers/db/connect.js";

export class author extends connect {
    static instanceauthor;
    db;
    collection;
    constructor() {
        if (author.instanceauthor) {
            return author.instanceauthor;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('authors');
        author.instanceauthor = this;
    }
    destructor(){
        author.instanceauthor = undefined;
        connect.instanceConnect = undefined;
    }

    async getAllAuthorWithOscar(){
        await this.conexion.connect();
        const res = await this.collection.aggregate(
          [
            {
              $unwind: "$awards"
            },
            {
              $match: {
                "awards.name": "Oscar Award"
              }
            }
          ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllAuthorsAwards(){
      await this.conexion.connect();
        const res = await this.collection.aggregate(
          [
            { 
              $unwind: "$awards" 
            },
            { 
              $group: {
                _id: "$full_name",
                total_awards: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                total_awards: 1
              }
            }
          ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllAuthorsBornAfter1980(){
      await this.conexion.connect();
        const res = await this.collection.find({
            "date_of_birth": { $gte: "1980"}
        }).project({_id: 0, full_name: 1, date_of_birth: 1}).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getMostAwardedAuthor(){
      await this.conexion.connect();
        const res = await this.collection.aggregate([
          { 
            $unwind: "$awards" 
          },
          { 
            $group: {
              _id: "$full_name",
              total_awards: { $sum: 1 }
            }
          },
          {
            $sort: {
              "total_awards": -1
            }
          },
          {
            $limit: 1
          }
        ]).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllAuthors(){
      await this.conexion.connect();
        const res = await this.collection.aggregate(
          [
            {
              $count: 'actores'
            }
          ]
        ).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAverageAuthorsYearsOld(){
      await this.conexion.connect();
        const res = await this.collection.aggregate([
          {
            $project: {
              age: {
                $subtract: [
                  { $year: new Date() },
                  { $year: { $dateFromString: { dateString: "$date_of_birth"}}}
                ]
              }
            }
          },
          { $group: { _id: null, averageAge: {$avg: "$age"}}}
        ]).toArray(); 
        await this.conexion.close();
        return res;
    }

    async getAllAuthorsWithInstagram(){
      await this.conexion.connect();
        const res = await this.collection.find({
            "social_media.instagram": { $exists: 1}
        }).project({_id: 0, full_name: 1, social_media: 1}).toArray(); 
        await this.conexion.close();
        return res;
    }
    
    async getAllAuthorsWithAwardsAfter2015(){
      await this.conexion.connect();
        const res = await this.collection.find(
          {"awards.year": {$gt: 2015}}
        ).project({ _id: 0, id_actor: 1, full_name: 1, awards: 1}).toArray(); 
        await this.conexion.close();
        return res;
    }

}