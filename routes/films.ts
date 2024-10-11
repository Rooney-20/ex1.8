import { Router } from "express";
import { NewFilm } from "../types";
import {
    readAllfilms,
    readOneFilm,
    createOneFilm,
    deleteOneFilm,
    updateOneFilm
} from "../services/films";


const router = Router();


//router to filter films by minimum duration
router.get("/", (req, res) => {

    const minimumDuration = Number(req.query["minimum-duration"]);
    const films = readAllfilms(minimumDuration);
    return res.json(films);
    
});

//router to get a specific film
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const film = readOneFilm(id);
    if(!film) {
        return res.sendStatus(404);
    } else {
        return res.json(film);
    }
});

//router to add a new film
router.post("/", (req, res) => {
    const body: unknown = req.body;
    if (
        !body ||
        typeof body !== "object" ||
        !("title" in body) ||
        !("director" in body) ||
        !("duration" in body) ||
        typeof body.title !== "string" ||
        typeof body.director !== "string" ||
        typeof body.duration !== "number" ||
        !body.title.trim() ||
        !body.director.trim() ||
        body.duration <= 0 ||

        ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
        ("description" in body && (typeof body.description !== "string" || !body.description.trim()))
    ) {
        return res.sendStatus(400);
    }

    const { title, director, duration} = body as NewFilm;


    const newFilm = createOneFilm({ title, director, duration});


    return res.status(201).json(newFilm);
});

//router to delete a film using his id
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    
    const deletedFilms = deleteOneFilm(id);
    if(!deletedFilms) {
        return res.sendStatus(404);
    }
    return res.json(deletedFilms); 
});

//router to UPDATE a film
router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);

    const body : unknown = req.body;

    if (
        !body ||
        typeof body !== "object" ||
        ("title" in body &&
            (typeof body.title !== "string" || !body.title.trim())) ||
        ("director" in body &&
            (typeof body.director !== "string" || !body.director.trim())) ||
        ("duration" in body &&
            (typeof body.duration !== "number" || body.duration <= 0 )) ||
        ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
        ("description" in body && (typeof body.description !== "string" || !body.description.trim()))
    ) {
        return res.sendStatus(400);
    }

    const { title, director, duration}: Partial<NewFilm> = body;

    const updatedFilm = updateOneFilm(id, { title, director, duration});
    if(!updatedFilm) {
        return res.sendStatus(404);
    }

    return res.json(updatedFilm);
});

//router to put
router.put("/:id", (req, res) => {
    const body: unknown = req.body;

    //this if is to verify that all the parameters are given
    if (
        !body ||
        typeof body !== "object" ||
        !("title" in body) ||
        !("director" in body) ||
        !("duration" in body) ||
        typeof body.title !== "string" ||
        typeof body.director !== "string" ||
        typeof body.duration !== "number" ||
        !body.title.trim() ||
        !body.director.trim() ||
        body.duration <= 0 ||

        ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0)) ||
        ("description" in body && (typeof body.description !== "string" || !body.description.trim()))
    ) {
        return res.sendStatus(400);
    }

    const id = Number(req.params.id);
    

        const { title, director, duration} = body as Partial<NewFilm>;

        const updatedFilm = updateOneFilm(id, { title, director, duration});

        if(!updatedFilm) { //if the film is not found create a new one
            const { title, director, duration} = body as NewFilm;

            const newFilm = createOneFilm({ title, director, duration});

          return res.json(newFilm);
        }

        return res.json(updatedFilm);

});

export default router;