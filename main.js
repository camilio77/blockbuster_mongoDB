// main.js
import { author } from "./js/model/actor.js";
import { movis } from "./js/model/movis.js";

let obj;

// obj = new movis();
// console.log(await obj.getAll());

// console.log(await obj.getAllDVDs());
// console.log(await obj.getAllMovieGenres());
// console.log(await obj.getAllMoviesWithAuthor1());
// console.log(await obj.getAllDVDsAvaliableValue());
// console.log(await obj.getAllMoviesWithJonDoe());
// console.log(await obj.getAllMoviesWithPrincipalAuthors());

// console.log(await obj.getMostDvdMovie());
// console.log(await obj.getAllBlueRayAvaliableCost());
// obj.destructor();

obj = new author();
console.log(await obj.getAllAuthorWithOscar());
console.log(await obj.getAllAuthorsAwards());
console.log(await obj.getAllAuthorsBornAfter1980());
console.log(await obj.getMostAwardedAuthor());
console.log(await obj.getAllAuthors());
console.log(await obj.getAverageAuthorsYearsOld());
console.log(await obj.getAllAuthorsWithInstagram());
console.log(await obj.getAllAuthorsWithAwardsAfter2015());
obj.destructor();