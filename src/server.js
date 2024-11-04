import crypto from 'crypto';
import express from 'express';
import multer from 'multer';

import rapid from './call_api.js';
import renderer from './model_maker.js';

import dotenv from 'dotenv';
dotenv.config();

//basic in memory database
function setDb() {
    const database = {};

    const set = (key, value) => {
        database[key] = value;
    };

    const get = (key) => {
        return database[key];
    };

    return {
        set,
        get
    }
}

global.database = setDb();

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set('view engine', 'ejs')
app.use(express.static("public"));

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const name = crypto.randomBytes(16).toString('hex');

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;

        const apiResponse = await rapid.callAPI(fileBuffer, fileName);
        const model = await renderer.createModel(apiResponse);
        database.set(name, {
            name: name,
            'model-default': model.replace("./public/", ""),
            'model-ios': model.replace("./public/", ""),
            'sky-dome': 'sky.hdr',
            'alt': name,
        })

        req.file.buffer = null;

        res.status(200).send(`${process.env.URL}/${name}`);
    } catch (error) {
        console.error('Erro ao enviar a foto:', error);
        res.status(500).json({ message: 'Erro ao enviar a foto.', error });
    }
})

app.get('/:model', (req, res) => {
    var path = req.path.replace('/', '')

    const data = database.get(path)

    if (!data) {
        res.redirect('/')
        return
    }

    res.render("engine.ejs", {
        TITLE: data["name"],
        DEFAULT_MODEL: data["model-default"],
        IOS_MODEL: data["model-ios"],
        SKYBOX: data["sky-dome"],
        ALT: data["alt"],
        URL: process.env.URL
    })
})

app.listen(port, () => {
    console.log(`Running at port ${port}`)
})