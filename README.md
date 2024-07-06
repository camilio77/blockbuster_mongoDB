# Consultas Blockbuster

1. **Contar el número total de copias de DVD disponibles en todos los registros:**

   ```javascript
   db.movis.aggregate([
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
   ])
   ```

2. **Encontrar todos los actores que han ganado premios Oscar:**

   ```javascript
   db.authors.aggregate([
     {
       $unwind: "$awards"
     },
     {
       $match: {
         "awards.name": "Oscar Award"
       }
     }
   ])
   ```

3. **Encontrar la cantidad total de premios que ha ganado cada actor:**

   ```javascript
   db.authors.aggregate([
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
   ])
   ```

4. **Obtener todos los actores nacidos después de 1980:**

   ```javascript
   db.authors.aggregate([
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
   ])
   ```

5. **Encontrar el actor con más premios:**

   ```javascript
   db.authors.aggregate([
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
   ])
   ```

6. **Listar todos los géneros de películas distintos:**

   ```javascript
   db.movis.aggregate([
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
   ])
   ```

7. **Encontrar películas donde el actor con id 1 haya participado:**

   ```javascript
   db.movis.aggregate([
     {
       $unwind: "$character"
     },
     {
       $match: {
         "character.id_actor": 1
       }
     }
   ])
   ```

8. **Calcular el valor total de todas las copias de DVD disponibles:**

   ```javascript
   db.movis.aggregate([
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
   ])
   ```

9. **Encontrar todas las películas en las que John Doe ha actuado:**

   ```javascript
   db.movis.aggregate([
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
   ]);
   ```

10. **Encontrar el número total de actores en la base de datos:**

    ```javascript
    db.authors.aggregate([
      {
        $count: 'actores'
      }
    ])
    ```

11. **Encontrar la edad promedio de los actores en la base de datos:**

    ```javascript
    db.authors.aggregate([
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
        ])
    ```
    
12. **Encontrar todos los actores que tienen una cuenta de Instagram:**

    ```javascript
    db.authors.aggregate([
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
        ])
    ```

13. **Encontrar todas las películas en las que participan actores principales:**

    ```javascript
    db.movis.aggregate( [
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
        ])
    ```

14. **Encontrar el número total de premios que se han otorgado en todas las películas:**

    ```javascript
    db.movis.aggregate([
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
        ])
    ```

15. **Encontrar todas las películas en las que John Doe ha actuado y que estén en formato Blu-ray:**

    ```javascript
    db.movis.aggregate([
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
        ])
    ```

16. **Encontrar todas las películas de ciencia ficción que tengan al actor con id 3:**

    ```javascript
    db.movis.aggregate([
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
    ])
    
    ```

17. **Encontrar la película con más copias disponibles en formato DVD:**

    ```javascript
    db.movis.aggregate([
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
    ])
    ```

18. **Encontrar todos los actores que han ganado premios después de 2015:**

    ```javascript
    db.authors.find(
              {"awards.year": {$gt: 2015}}
            ).project({ _id: 0, id_actor: 1, full_name: 1, awards: 1})
    ```

19. **Calcular el valor total de todas las copias de Blu-ray disponibles:**

    ```javascript
    db.movis.aggregate([
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
    ])
    ```

20. **Encontrar todas las películas en las que el actor con id 2 haya participado:**

    ```javascript
    db.movis.aggregate([
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
        ])
    ```

