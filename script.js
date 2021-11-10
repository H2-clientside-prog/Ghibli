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

function createPeopleListOfMovie() {
    const moviePeopleListElement = document.createElement('div');
    moviePeopleListElement.setAttribute('class', 'col-4');

    const peopleListTitleElement = document.createElement('h4');
    // peopleListTitleElement.setAttribute('class', 'col-4');
    peopleListTitleElement.textContent = 'People in this movie';

    const unorderedListElement = document.createElement('ul');
    unorderedListElement.setAttribute('class', 'list-group list-group-flush');
    unorderedListElement.setAttribute('id', 'list-of-people');

    moviePeopleListElement.appendChild(peopleListTitleElement);
    moviePeopleListElement.appendChild(unorderedListElement);

    return moviePeopleListElement;
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

    const movieDetailsListRow = document.createElement('div');
    movieDetailsListRow.setAttribute('class', 'row');

    const moviePeopleListElement = createPeopleListOfMovie();

    movieContentColumnElement.appendChild(movieOriginalTitleElement);
    movieContentColumnElement.appendChild(movieSubtitleElement);
    movieContentColumnElement.appendChild(movieDescriptionElement);
    movieContentColumnElement.appendChild(movieDetailsListRow);
    movieDetailsListRow.appendChild(moviePeopleListElement);

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

function createPersonToMovie(person) {
    const unorderedListElement = document.querySelector('#list-of-people');

    const personElement = document.createElement('li');
    personElement.setAttribute('class', 'list-group-item');
    personElement.textContent = person.name;
    console.log(person.name);

    unorderedListElement.appendChild(personElement);
}

function createModalBodyDiv(movie) {
    const className = 'modal-body';
    const modalBodyElement = modalContent.querySelector(`.${className}`);

    const moveImageElement = modalBodyElement.querySelector('#movie-image');
    moveImageElement.setAttribute('src', movie.image);

    const movieOriginalTitleElement = modalBodyElement.querySelector('#movie-original-title');
    movieOriginalTitleElement.textContent = `${movie.original_title_romanised} (${movie.title})`;

    const movieSubtitleElement = modalBodyElement.querySelector('#movie-subtitle');
    movieSubtitleElement.textContent = `Instructed by ${movie.director}`;

    const movieDescriptionElement = modalBodyElement.querySelector('#movie-description');
    movieDescriptionElement.textContent = movie.description;
    
    const unorderedListElement = modalBodyElement.querySelector('#list-of-people');
    unorderedListElement.textContent = '';
    movie.people.forEach(person => {
        fetch(person)
            .then(blob => blob.json())
            .then(createPersonToMovie)
            .catch(console.error);


    });
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

// var request = new XMLHttpRequest();
// request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);

// request.onload = function() {
//     var data = JSON.parse(this.response);
//     if(request.status >= 200 && request.status < 400) {
//         data.forEach(movie => {
//             const card = document.createElement('div');
//             card.setAttribute('class', 'card');
//             card.addEventListener('click', () => console.log(`Clicked on ${movie.title} (${movie.id})`));

//             const h1 = document.createElement('h1');
//             h1.textContent = movie.title;

//             const p = document.createElement('p');
//             movie.description = movie.description.substring(0, 300);
//             p.textContent = `${movie.description}...`;

//             container.appendChild(card);
//             card.appendChild(h1);
//             card.appendChild(p);
//         });
//     }
//     else {
//         const errorMessage = document.createElement('marquee');
//         errorMessage.textContent = 'ZHE GOOGLES DO THE NOTHING';
//         app.appendChild(errorMessage);
//     }
// }
// request.send();
