// main.js
import { authors } from "./js/model/actor.js";
import { movis } from "./js/model/movis.js";

let obj;

// obj = new movis();

// console.log(`-----1. **Contar el número total de copias de DVD disponibles en todos los registros:**`,await obj.getAllDVDs());
// console.log(`------6. **Listar todos los géneros de películas distintos:**`,await obj.getAllMovieGenres());
// console.log(`-----7. **Encontrar películas donde el actor con id 1 haya participado:**`,await obj.getAllMoviesWithAuthor1());
// console.log(`-----8. **Calcular el valor total de todas las copias de DVD disponibles:**`,await obj.getAllDVDsAvaliableValue());
// console.log(`-----9. **Encontrar todas las películas en las que John Doe ha actuado:**`,await obj.getAllMoviesWithJonDoe());
// console.log(`-----13. **Encontrar todas las películas en las que participan actores principales:**`,await obj.getAllMoviesWithPrincipalAuthors());
// console.log(`-----14. **Encontrar el número total de premios que se han otorgado en todas las películas:**`,await obj.getTotalMoviesAwards());
// console.log(`-----15. **Encontrar todas las películas en las que John Doe ha actuado y que estén en formato Blu-ray:**`,await obj.getAllJohnDoeBluerayMovies());
// console.log(`-----16. **Encontrar todas las películas de ciencia ficción que tengan al actor con id 3:**`,await obj.getAllFictionMoviesWithAuthor3());
// console.log `-----17. **Encontrar la película con más copias disponibles en formato DVD:**`,(await obj.getMostDvdMovie());
// console.log( `-----19. **Calcular el valor total de todas las copias de Blu-ray disponibles:**`,await obj.getAllBlueRayAvaliableCost());
// console.log(`-----20. **Encontrar todas las películas en las que el actor con id 2 haya participado:**`,await obj.getMoviesWithAuthor2());
// obj.destructor();

obj = new authors();
console.log(`-----2. **Encontrar todos los actores que han ganado premios Oscar:** `,await obj.getAllAuthorsWithOscar());
console.log(`-----3. **Encontrar la cantidad total de premios que ha ganado cada actor:**`,await obj.getAllAuthorAwards());
console.log(`-----4. **Obtener todos los actores nacidos después de 1980:**`,await obj.getAllauthorsBornAfter1980());
console.log(`-----5. **Encontrar el actor con más premios:**`,await obj.getMostAwardedAuthor());
console.log(`-----10. **Encontrar el número total de actores en la base de datos:**`,await obj.getTotalAuthors());
console.log(`-----11. **Encontrar la edad promedio de los actores en la base de datos:**`,await obj.getAverageAuthorsAge());
console.log(`-----12. **Encontrar todos los actores que tienen una cuenta de Instagram:**`,await obj.getAllAuthorsWithInstagram());
console.log( `-----18. **Encontrar todos los actores que han ganado premios después de 2015:**`,await obj.getAllAuthorsWithAwardsAfter2015());
obj.destructor();