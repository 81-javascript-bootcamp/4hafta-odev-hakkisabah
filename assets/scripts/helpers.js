export const searchMovieByTitle = (movie, searchValue) => {
    return movie.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
}

export const makeBgActive = (movie) => {
    document.querySelector(`tr[data-id='${movie.id}']`).style.background = "#0f6674";
}

export const resetBg = (element, child) => {
    element.querySelectorAll(child).forEach((item) => {
        item.style.background = "transparent";
    });
};