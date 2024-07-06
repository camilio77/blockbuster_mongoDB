import { ObjectId } from "mongodb";
import {connect} from "../../helpers/db/connect.js"



export class authors extends connect{
  static instanceAuthors;
  db
  constructor() {
      super();

      this.db = this.conexion.db(this.getDbName);
      if (typeof authors.instanceAuthors === 'object') {
          return authors.instanceAuthors;
      }
      authors.instanceAuthors = this;
      return this;
  }
  destructor(){
    authors.instanceAuthors = undefined;
    connect.instance = undefined;
  }
  // 1. **Contar el número total de copias de DVD disponibles en todos los registros:**
  async getAllAuthorsWithOscar(){
    await this.conexion.connect();
      const collection = this.db.collection('authors');
      const data = await collection.aggregate([
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
      return data;
  }

  async getAllAuthorAwards(){
    await this.conexion.connect();
    const collection = this.db.collection('authors');
    const data = await collection.aggregate([
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
    ]).toArray();
    await this.conexion.close();
    return data;
  }
  async getAllauthorsBornAfter1980(){
    await this.conexion.connect();
    const collection = this.db.collection('authors');
    const data = await collection.aggregate([
      {
        $match: {
          "date_of_birth": {$gt: "1980"}
        }
      },
      {
        $project: {
           full_name: 1
        }
      }
    ]).toArray();
    await this.conexion.close();
    return data;
  }

///5 **Encontrar el actor con más premios:**
  async getMostAwardedAuthor(){
    await this.conexion.connect();
    const collection = this.db.collection('authors');
    const data = await collection.aggregate([
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
    return data;
  }
// 10 **Encontrar el número total de actores en la base de datos:**
async getTotalAuthors(){
  await this.conexion.connect();
  const collection = this.db.collection('authors');

  const data = await collection.aggregate([
    {
      $count: 'actores'
    }
  ]).toArray();
  await this.conexion.close();
  return data;
}
//11 **Encontrar la edad promedio de los actores en la base de datos:**
async getAverageAuthorsAge(){
  await this.conexion.connect();
  const collection = this.db.collection('authors');
  const data = await collection.aggregate([
    {
      $project: {
        age: {
          $subtract: [
            { $year: new Date() },
            { $year: { $dateFromString: { dateString: "$date_of_birth" } } }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        promedio_edad: { $avg: "$age" }
      }
    }
  ]).toArray();
  await this.conexion.close();
  return data;
}
//12 **Encontrar todos los actores que tienen una cuenta de Instagram:**
async getAllAuthorsWithInstagram(){
  await this.conexion.connect();
  const collection = this.db.collection('authors');
  const data = await collection.aggregate([
    {
      $match: {
        "social_media.instagram": { $exists: true, $ne: "" }
      }
    },
    {
      $project: {
        full_name: 1,
        instagram: "$social_media.instagram",
        _id: 0
      }
    }
  ]).toArray();
  await this.conexion.close();
  return data;
}
//18 **Encontrar todos los actores que han ganado premios después de 2015:**
async getAllAuthorsWithAwardsAfter2015(){
  await this.conexion.connect();
  const collection = this.db.collection('authors');
  const data = await collection.find(
    {"awards.year": {$gt: 2015}}
  ).project({ _id: 0, id_actor: 1, full_name: 1, awards: 1}).toArray();
  await this.conexion.close();
  return data;
}
}