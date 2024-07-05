# Consultas Blockbuster

1. **Contar el número total de copias de DVD disponibles en todos los registros:**

   ```javascript
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
   ```

2. **Encontrar todos los actores que han ganado premios Oscar:**

   ```javascript
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
   ```

3. **Encontrar la cantidad total de premios que ha ganado cada actor:**

   ```javascript
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
   ```

4. **Obtener todos los actores nacidos después de 1980:**

   ```javascript
   [
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
   ]
   ```

5. **Encontrar el actor con más premios:**

   ```javascript
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
       $sort: {
         "total_awards": -1
       }
     },
     {
       $limit: 1
     }
   ]
   ```

6. **Listar todos los géneros de películas distintos:**

   ```javascript
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
   ```

7. **Encontrar películas donde el actor con id 1 haya participado:**

   ```javascript
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
   ```

8. **Calcular el valor total de todas las copias de DVD disponibles:**

   ```javascript
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
   ```

9. **Encontrar todas las películas en las que John Doe ha actuado:**

   ```javascript
   
   ```

10. **Encontrar el número total de actores en la base de datos:**

    ```javascript
    [
      {
        $count: 'actores'
      }
    ]
    ```

11. **Encontrar la edad promedio de los actores en la base de datos:**

    ```javascript
    
    ```

12. **Encontrar todos los actores que tienen una cuenta de Instagram:**

    ```javascript
    
    ```

13. **Encontrar todas las películas en las que participan actores principales:**

    ```javascript
    
    ```

14. **Encontrar el número total de premios que se han otorgado en todas las películas:**

    ```javascript
    
    ```

15. **Encontrar todas las películas en las que John Doe ha actuado y que estén en formato Blu-ray:**

    ```javascript
    
    ```

16. **Encontrar todas las películas de ciencia ficción que tengan al actor con id 3:**

    ```javascript
    
    ```

17. **Encontrar la película con más copias disponibles en formato DVD:**

    ```javascript
    
    ```

18. **Encontrar todos los actores que han ganado premios después de 2015:**

    ```javascript
    find(
          {"awards.year": {$gt: 2015}}
        ).project({ _id: 0, id_actor: 1, full_name: 1, awards: 1})
    ```

19. **Calcular el valor total de todas las copias de Blu-ray disponibles:**

    ```javascript
    
    ```

20. **Encontrar todas las películas en las que el actor con id 2 haya participado:**

    ```javascript
    
    ```

