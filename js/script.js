let page = 1;
let movieName;
const elForm = $_("#form");
const elPrev = $_(".js-prev");
const elNext = $_(".js-next");
const elError = $_(".js-error");
const elInput = $_("#js-input");
const numberOfMovies = $_("#result");
const elMoviesList = $_(".js-films-list");
const elMoviesTemplate = $_("#search-result-template");

let movieApi = (name, page) => `https://www.omdbapi.com/?apikey=16bb7ce6&s=${name}&page=${page}`;

let creatMovieList = item => {
  let movieList = elMoviesTemplate.content.cloneNode(true);
  $_(".movie__trailer", movieList).href = "https://www.imdb.com/title/" + item.imdbID;
  $_(".movie__poster", movieList).src = item.Poster;
  $_(".movie__title", movieList).textContent = item.Title;
  $_(".movie__year", movieList).textContent = item.Year;
  return movieList;
}

let render = movies => {
  elMoviesList.textContent = "";
  movies.forEach(element => {
    elMoviesList.appendChild(creatMovieList(element))
  });
}

let getData = linkOmdb => {
  fetch(linkOmdb)
  .then((response) => response.json())
  .then((data) => {
      if (page <= 1) {
          elPrev.disabled = true;
      }
      if (page > 1) {
          elPrev.disabled = false;
      }
      if (page == Math.ceil(data.totalResults / 10)) {
          elNext.disabled = true;
      }
      if (page < Math.ceil(data.totalResults / 10)) {
          elNext.disabled = false;
      }
      // elLoader.style.display = "none";
      if(data.Response == 'True') {
        elError.textContent = "";
        render(data.Search);
      } else {
        elMoviesList.textContent = "";
        elError.textContent = "error 404 - film not found"
      } 
      numberOfMovies.textContent = data.totalResults;
  }
  );
}

elForm.addEventListener("submit", (e) => {
  e.preventDefault();
  movieName = elInput.value.trim();
  if (movieName.length > 2) {
      let link = movieApi(movieName, 1);
      getData(link);
  }
});

function nextPage() {
  page = page + 1;
  elMoviesList.textContent = "";
  console.log("salom");
  // elLoader.style.display = "block";
  getData(movieApi(movieName,page));
}
elNext.addEventListener("click", nextPage);

function prevPage() {
  page = page - 1;
  elMoviesList.textContent = "";
  // elLoader.style.display = "block";
  getData(movieApi(movieName,page));
}
elPrev.addEventListener("click", prevPage);
