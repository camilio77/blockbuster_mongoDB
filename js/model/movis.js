import { ObjectId } from "mongodb";
import {connect} from "../../helpers/db/connect.js"
/// 1 


// movis.js

export class movis extends connect{
    static instanceMovis;
    db
    constructor() {
        super();

        this.db = this.conexion.db(this.getDbName);
        if (typeof movis.instanceMovis === 'object') {
            return movis.instanceMovis;
        }
        movis.instanceMovis = this;
        return this;
    }
    destructor(){
      movis.instanceMovis = undefined;
      connect.instance= undefined;
    }
    // 1. **Contar el número total de copias de DVD disponibles en todos los registros:**
    async getAllDVDs(){
      await this.conexion.connect();
        const collection = this.db.collection('movis');
        const data = await collection.aggregate([
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
        ]).toArray();
        await this.conexion.close();
        return data;
    }
 // 6 **Listar todos los géneros de películas distintos:**
    async getAllMovieGenres(){
      await this.conexion.connect();
      const collection = this.db.collection('movis');
      const data = await collection.aggregate([
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
      ]).toArray();
      await this.conexion.close();
      return data;
  }
  // 7 **Encontrar películas donde el actor con id 1 haya participado:**
  async getAllMoviesWithAuthor1(){
    await this.conexion.connect();
    const  collection = this.db.collection('movis');
    const data = await collection.aggregate([
      {
        $unwind: "$character"
      },
      {
        $match: {
          "character.id_actor": 1
        }
      }
    ]).toArray();
    await this.conexion.close();
    return data;
  }

  async getAllDVDsAvaliableValue() {
    await this.conexion.connect();
    const collection = this.db.collection('movis');
    const data = await collection.aggregate([
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
    ]).toArray();
    await this.conexion.close();
    return data;
  }

  //9 Encontrar todas las películas en las que John Doe ha actuado:**
  async getAllMoviesWithJonDoe(){
    await this.conexion.connect();
    const  collection = this.db.collection('movis');
    const data = await collection.aggregate([
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
    ]).toArray();
    await this.conexion.close();
    return data;
  }
  //13 **Encontrar todas las películas en las que participan actores principales:**
  async getAllMoviesWithPrincipalAuthors(){
    await this.conexion.connect();
    const collection = this.db.collection('movis');
    const data = await collection.aggregate( [
      {
        $match: {
          "character.rol": "principal"
        }
      },
      {
        $project: {
          name: 1,
            personaje: '$character.apodo',
            rol: '$character.rol',
          _id: 0
        }
      }
    ]).toArray();
    await this.conexion.close();
    return data;
  }
  //14 // 14 **Encontrar el número total de premios que se han otorgado en todas las películas:**
  async getTotalMoviesAwards(){
    await this.conexion.connect();
    const collection = this.db.collection('movis');
    const data = await collection.aggregate([
      {
        $lookup: {
          from: "authors", // actor en mi db authors en la de miguel 
          localField: "character.id_actor",
          foreignField: "id_actor",
          as: "actor_info"
        }
      },
      {
        $unwind: "$actor_info"
      },
      {
        $unwind: "$actor_info.awards"
      },
      {
        $group: {
          _id: null,
          total_premios: { $sum: 1 }
        }
      }
    ]).toArray();
    await this.conexion.close();
    return data;
  }
  // 15 **Encontrar todas las películas en las que John Doe ha actuado y que estén en formato Blu-ray:**
  async getAllJohnDoeBluerayMovies(){
    await this.conexion.connect();
    const collection = this.db.collection('movis');
    const data = await collection.aggregate([
      {
        $lookup: {
          from: "authors", //actor en mi db authord en la de miguel 
          localField: "character.id_actor",
          foreignField: "id_actor",
          as: "actor_info"
        }
      },
      {
        $match: {
          "actor_info.full_name": "John Doe",
          "format.name": "Bluray"
        }
      },
      {
        $project: {
          name: 1,
          formato : "$format.name",
          _id: 0
        }
      }
    ]).toArray();
    await this.conexion.close();
    return data;

   
  }
  //16 **Encontrar todas las películas de ciencia ficción que tengan al actor con id 3:**
  async getAllFictionMoviesWithAuthor3(){
    await this.conexion.connect();
    const collection = this.db.collection('movis');
    const data = await collection.aggregate([
      {
        $match: {
          genre: "Ciencia Ficción",
          "character.id_actor": 3
        }
      },
      {
        $project: {
          nombre_pelicula: "$name",
            id_actores: "$character.id_actor",
          _id: 0
        }
      }
    ]).toArray();
    await this.conexion.close();
    return data;
  }
//17 **Encontrar la película con más copias disponibles en formato DVD:**
async getMostDvdMovie(){
  await this.conexion.connect();
  const collection = this.db.collection('movis');
  const data = await collection.aggregate([
    {
      $unwind: "$format"
    },
    {
      $match: {
        "format.name": "dvd"
      }
    },
    {
      $sort: {
        "format.copies": -1
      }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 1,
        name: 1,
        "format.name": 1,
        "format.copies": 1
      }
    }
  ]).toArray();
  await this.conexion.close();
  return data;

}
//19**Calcular el valor total de todas las copias de Blu-ray disponibles:**
async getAllBlueRayAvaliableCost(){
  await this.conexion.connect();
  const collection = this.db.collection('movis');
  const data = await collection.aggregate([
    {
      $unwind: "$format"
    },
    {
      $match: {
        "format.name": "Bluray"
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
  ]).toArray();
  await this.conexion.close();
  return data;
}
//20 **Encontrar todas las películas en las que el actor con id 2 haya participado:**}
async getMoviesWithAuthor2(){
  await this.conexion.connect();
  const collection = this.db.collection('movis');
  const data = await collection.aggregate([
    {
      $match: {
        "character.id_actor": 2
      }
    },
    {
      $project: {
        name: 1,
        actores: "$character.id_actor",
        _id: 0
      }
    }
  ]).toArray();
  await this.conexion.close();
  return data;
}

}
