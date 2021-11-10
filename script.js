const app = document.querySelector('#app');
const logo = document.createElement('img');
logo.src = 'logo.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');

const row = document.createElement('div');
row.setAttribute('class', 'row g-1');

app.appendChild(logo);
app.appendChild(container);
container.appendChild(row);

const options = {
    backdrop: true,
    keyboard: false,
    focus: false
};
const movieModalElement = document.querySelector('#movie-modal');
const movieModal = new bootstrap.Modal(movieModalElement, options);
const modalContent = movieModalElement.querySelector('.modal-content');

function createSidebarColumn() {
    const sidebarCol = document.createElement('div');
    sidebarCol.setAttribute('class', 'col-3');

    let movieImageElement = document.createElement('img');
    movieImageElement.setAttribute('id', 'movie-image');

    sidebarCol.appendChild(movieImageElement);
    
    return sidebarCol;
}

function createList(title) {
    const listElement = document.createElement('div');
    listElement.setAttribute('class', 'col-3');

    const listTitleElement = document.createElement('h4');
    listTitleElement.setAttribute('class', 'text-center');
    listTitleElement.textContent = title.charAt(0).toUpperCase() + title.slice(1);

    const unorderedListElement = document.createElement('ul');
    unorderedListElement.setAttribute('class', 'list-group list-group-flush');
    unorderedListElement.setAttribute('id', `list-of-${title}`);

    listElement.appendChild(listTitleElement);
    listElement.appendChild(unorderedListElement);
    return listElement;
}

function createMovieContentColumn() {
    const movieContentColumnElement = document.createElement('div');
    movieContentColumnElement.setAttribute('class', 'col-9');

    const movieOriginalTitleElement = document.createElement('h3');
    movieOriginalTitleElement.setAttribute('id', 'movie-original-title');

    const movieSubtitleElement = document.createElement('h6');
    movieSubtitleElement.setAttribute('class', 'text-muted');
    movieSubtitleElement.setAttribute('id', 'movie-subtitle');

    const movieDescriptionElement = document.createElement('p');
    movieDescriptionElement.setAttribute('id', 'movie-description');

    const directorTextElement = document.createElement('p');
    directorTextElement.setAttribute('class', 'text-muted');    
    directorTextElement.setAttribute('id', 'director-text');

    const producerTextElement = document.createElement('p');
    producerTextElement.setAttribute('class', 'text-muted');    
    producerTextElement.setAttribute('id', 'producer-text');

    const releaseDateTextElement = document.createElement('p');
    releaseDateTextElement.setAttribute('class', 'text-muted');    
    releaseDateTextElement.setAttribute('id', 'release-date-text');

    const runningTimeTextElement = document.createElement('p');
    runningTimeTextElement.setAttribute('class', 'text-muted');    
    runningTimeTextElement.setAttribute('id', 'running-time-text');

    const RTScoreTextElement = document.createElement('div');
    RTScoreTextElement.setAttribute('class', 'text-muted');    
    RTScoreTextElement.setAttribute('id', 'rt-score-text');

    const movieRTScoreElement = document.createElement('div');
    movieRTScoreElement.setAttribute('class', 'tomatoerow');    
    movieRTScoreElement.setAttribute('id', 'movie-tomatoes');    
    for (let i = 0; i < 5; i++) {
        const tomatoElement = document.createElement('div');
        const tomatoImage = document.createElement('img');
        tomatoImage.setAttribute('id', 'movie-rt-score');

        movieRTScoreElement.appendChild(tomatoElement);
        tomatoElement.appendChild(tomatoImage);
    }

    const movieDetailsListRow = document.createElement('div');
    movieDetailsListRow.setAttribute('class', 'row');

    const moviePeopleListElement = createList('people'); // createPeopleListOfMovie();
    const movieSpeciesListElement = createList('species'); //  createSpeciesListOfMovie();
    const movieLocationListElement = createList('locations'); //  createLocationsListOfMovie();
    const movieVehiclesListElement = createList('vehicles'); //  createVehiclesListOfMovie();

    movieContentColumnElement.appendChild(movieOriginalTitleElement);
    movieContentColumnElement.appendChild(movieSubtitleElement);
    movieContentColumnElement.appendChild(movieDescriptionElement);
    movieContentColumnElement.appendChild(directorTextElement);
    movieContentColumnElement.appendChild(producerTextElement);
    movieContentColumnElement.appendChild(releaseDateTextElement);
    movieContentColumnElement.appendChild(runningTimeTextElement);
    movieContentColumnElement.appendChild(RTScoreTextElement);
    movieContentColumnElement.appendChild(movieRTScoreElement);
    movieContentColumnElement.appendChild(movieDetailsListRow);
    movieDetailsListRow.appendChild(moviePeopleListElement);
    movieDetailsListRow.appendChild(movieSpeciesListElement);
    movieDetailsListRow.appendChild(movieLocationListElement);
    movieDetailsListRow.appendChild(movieVehiclesListElement);

    return movieContentColumnElement;
}

function setupModalBody() {
    const modalBodyElement = modalContent.querySelector('.modal-body');
    
    const modalBodyRow = document.createElement('div');
    modalBodyRow.setAttribute('class', 'row');

    const sidebarColumn = createSidebarColumn();
    const movieContentColumn = createMovieContentColumn();

    modalBodyElement.appendChild(modalBodyRow);
    modalBodyRow.appendChild(sidebarColumn);
    modalBodyRow.appendChild(movieContentColumn);
}
setupModalBody();

const baseUrl = 'https://ghibliapi.herokuapp.com/';
fetch(`${baseUrl}films`)
    .then(blob => blob.json())
    .then(movies => {
        movies.forEach(createMovieCard);
    })
    .catch(showErrorMessage);


function createModalHeaderDiv(movie) {
    const className = 'modal-header';
    const modalHeaderDiv = modalContent.querySelector(`.${className}`);

    const modalTitle = modalHeaderDiv.querySelector('.modal-title');
    modalTitle.textContent = movie.title;
}

function createListOfArray(movie, arrayName, modalBodyElement) {
    const unorderedListElement = modalBodyElement.querySelector(`#list-of-${arrayName}`);
    unorderedListElement.textContent = '';
    if(movie[arrayName].length > 0 && movie[arrayName][0] !== `https://ghibliapi.herokuapp.com/${arrayName}/`) {
        movie[arrayName].forEach(vehicle => {
            fetch(vehicle)
                .then(blob => blob.json())
                .then(a => {
                    const unorderedListElement = document.querySelector(`#list-of-${arrayName}`);

                    const arrayObjectElement = document.createElement('li');
                    arrayObjectElement.setAttribute('class', 'list-group-item text-center');
                    arrayObjectElement.textContent = `${a.name}`;
                
                    unorderedListElement.appendChild(arrayObjectElement);
                })
                .catch(console.error);
        });
    }
    else {
        const noVehiclesFoundElement = document.createElement('li');
        noVehiclesFoundElement.setAttribute('class', 'list-group-item text-center');
        noVehiclesFoundElement.textContent = `No ${arrayName} in this movie..`;
    
        unorderedListElement.appendChild(noVehiclesFoundElement);
    }
}

function displayTomatoScore(n, modalBodyElement) {
    const tomatoImageDivs = modalBodyElement.querySelectorAll('#movie-rt-score');
    tomatoImageDivs.forEach(image => {
        image.setAttribute('class', 'hidden');
    });
    
    for (let i = 0; i < n; i++) {
        tomatoImageDivs[i].setAttribute('src', 'tomato.png');
        tomatoImageDivs[i].setAttribute('class', '');
    }
}

function createModalBodyDiv(movie) {
    const className = 'modal-body';
    const modalBodyElement = modalContent.querySelector(`.${className}`);

    const moveImageElement = modalBodyElement.querySelector('#movie-image');
    moveImageElement.setAttribute('src', movie.image);

    const movieOriginalTitleElement = modalBodyElement.querySelector('#movie-original-title');
    movieOriginalTitleElement.textContent = `${movie.original_title_romanised} (${movie.title})`;

    const movieSubtitleElement = modalBodyElement.querySelector('#movie-subtitle');
    movieSubtitleElement.textContent = `Instructed by ${movie.director}, Produced by ${movie.producer}, Running time: ${movie.running_time} minutes`;

    const movieDescriptionElement = modalBodyElement.querySelector('#movie-description');
    movieDescriptionElement.textContent = movie.description;

    const directorTextElement = modalBodyElement.querySelector('#director-text');
    directorTextElement.textContent = `Instructed by ${movie.director}`;

    const producerTextElement = modalBodyElement.querySelector('#producer-text');
    producerTextElement.textContent = `Produced by ${movie.producer}`;
    
    const releaseDateTextElement = modalBodyElement.querySelector('#release-date-text');
    releaseDateTextElement.textContent = `Release Date: ${movie.release_date}`;
    
    const runningTimeTextElement = modalBodyElement.querySelector('#running-time-text');
    runningTimeTextElement.textContent = `Running Time: ${movie.running_time} minutes`;
    
    const numTomatoes = movie.rt_score / 20.0;
    const RTScoreTextElement = modalBodyElement.querySelector('#rt-score-text');
    RTScoreTextElement.textContent = `Rotten Tomatoes score: ${movie.rt_score} (${numTomatoes}/5)`;
    displayTomatoScore(numTomatoes, modalBodyElement);

    createListOfArray(movie, 'people', modalBodyElement);
    createListOfArray(movie, 'species', modalBodyElement);
    createListOfArray(movie, 'locations', modalBodyElement);
    createListOfArray(movie, 'vehicles', modalBodyElement);
}

function createMovieDetailsModal(movie) {
    createModalHeaderDiv(movie);
    createModalBodyDiv(movie);
    movieModal.show();
}

function createMovieCard(movie) {
    const MAX_DESCRIPTION_LENGTH = 200;

    const card = document.createElement('div');
    card.setAttribute('class', 'card col-4 p-0');
    card.addEventListener('click', _ => createMovieDetailsModal(movie));

    const movieBanner = document.createElement('img');
    movieBanner.setAttribute('class', 'card-img-top movie-banner');
    movieBanner.setAttribute('src', movie.movie_banner);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');

    const movieTitle = document.createElement('h5');
    movieTitle.setAttribute('class', 'card-title');
    movieTitle.textContent = movie.title;
    
    const movieSubtitle = document.createElement('h6');
    movieSubtitle.setAttribute('class', 'card-subtitle mb-2 text-muted');
    movieSubtitle.textContent = movie.original_title_romanised;

    const movieDescription = document.createElement('p');
    movieDescription.setAttribute('class', 'card-text');
    const desc = movie.description.substring(0, MAX_DESCRIPTION_LENGTH);
    movieDescription.textContent = `${desc}...`;

    const movieFooter = document.createElement('p');
    movieFooter.setAttribute('class', 'card-text');

    const mutedFooter = document.createElement('small');
    mutedFooter.setAttribute('class', 'text-muted');
    mutedFooter.textContent = `Release year: ${movie.release_date}`;

    row.appendChild(card);
    card.appendChild(movieBanner);
    card.appendChild(cardBody);
    cardBody.appendChild(movieTitle);
    cardBody.appendChild(movieSubtitle);
    cardBody.appendChild(movieDescription);
    cardBody.appendChild(movieFooter);
    movieFooter.appendChild(mutedFooter);
}

function showErrorMessage(err) {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = 'ZHE GOOGLES DO THE NOTHING';
    app.appendChild(errorMessage);
    console.error(err);
}
