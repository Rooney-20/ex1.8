import path from "node:path";

import { Film, NewFilm } from "../types";
import { parse, serialize } from "../utils/json";
const jsonDbPath = path.join(__dirname, "/../data/drinks.json");


const defaultFilms : Film[] = [
    {
        id: 1,
        title: "Inception",
        director: "Christopher Nolan",
        duration: 148
    },
    {
        id: 2,
        title: "The Matrix",
        director: "Lana Wachowski, Lilly Wachowski",
        duration: 136,
        description: "A computer hacker learns from mysterious rebels about the true nature of his reality...",
        imageUrl: "https://example.com/matrix.jpg"
    },
    {
        id: 3,
        title: "Interstellar",
        director: "Christopher Nolan",
        duration: 169,
        description : "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival...",
        imageUrl: "https://example.com/interstellar.jpg"
    }
];


function readAllfilms(minimumDuration: number): Film[] {
    const films = parse(jsonDbPath, defaultFilms);
    if(!minimumDuration) {
        return films;
    }
    const minimumDurationNumber = Number(minimumDuration);
    const filteredFilms = films.filter((film) => {
        return film.duration <= minimumDurationNumber;
    });
    return filteredFilms;
}

function readOneFilm(id: number): Film | undefined {
    const films = parse(jsonDbPath, defaultFilms);
    const film = films.find((film) => film.id === id);
    if(!film) {
        return undefined;
    }
    return film;
}

function createOneFilm(newFilm: NewFilm): Film {
    const films = parse(jsonDbPath, defaultFilms);
    const nextId = films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;
    const createdfilm = {
        id: nextId,
        ...newFilm
    };
    films.push(createdfilm);
    serialize(jsonDbPath, films);
    return createdfilm;
}

function deleteOneFilm(filmId: number): Film | undefined {
    const films = parse(jsonDbPath, defaultFilms);
    const filmIndex = films.findIndex((film) => film.id === filmId);
    if(filmIndex === -1) {
        return undefined;
    }
    const deletedFilm = films.splice(filmIndex, 1)[0];
    serialize(jsonDbPath, films);
    return deletedFilm;
}

function updateOneFilm(filmId: number, newFilm: Partial<NewFilm>): Film | undefined {
    const films = parse(jsonDbPath, defaultFilms);
    const film = films.find((film) => film.id === filmId);
    if(!film) {
        return undefined;
    }
    if (newFilm.title !== undefined) {
        film.title = newFilm.title;
    }
    if(newFilm.director !== undefined) {
        film.director = newFilm.director;
    }
    if(newFilm.duration !== undefined) {
        film.duration = newFilm.duration;
    }
    serialize(jsonDbPath, films);

    return film;
}

export {
    readAllfilms,
    readOneFilm,
    createOneFilm,
    deleteOneFilm,
    updateOneFilm
};