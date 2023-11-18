const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ dest: __dirname + "/public/images" });

let nextConstellationId = 1; // Initialize the next available ID

let constellations = [
    {
        id: nextConstellationId++,
        name: "Orion",
        year: "Ancient times",
        myth: "In Greek mythology, Orion was a giant hunter. He was placed in the stars by Zeus after his death.",
        culture: "Greek",
        appearance: "Orion is easily recognizable by the three aligned stars forming his belt and the bright stars Betelgeuse and Rigel.",
        distance_from_earth_miles: 1344,
        img: "images/Orion.jpg"
      },
      {
        id: nextConstellationId++,
        name: "Ursa Major",
        year: "Ancient times",
        myth: "In Greek mythology, Ursa Major represents Callisto, a nymph who was transformed into a bear by Zeus to protect her from his jealous wife Hera.",
        culture: "Greek",
        appearance: "Ursa Major, also known as the Big Dipper, consists of seven bright stars that form a distinct ladle or saucepan shape.",
        distance_from_earth_miles: 1228,
        img: "images/Ursa.jpg"
      },
      {
        id: nextConstellationId++,
        name: "Crux",
        year: "Modern",
        myth: "No specific myth, but Crux is known as the Southern Cross and is prominent in the southern hemisphere.",
        culture: "Southern Hemisphere cultures",
        appearance: "Crux is a small but distinctive constellation in the shape of a cross. It is visible in the southern hemisphere.",
        distance_from_earth_miles: 2800,
        img: "images/Crux.jpg"
      },
      {
        id: nextConstellationId++,
        name: "Draco",
        year: "Ancient times",
        myth: "In Greek mythology, Draco represents a dragon that guarded the golden apples in the Garden of the Hesperides.",
        culture: "Greek",
        appearance: "Draco is a long, winding constellation featuring a dragon. It is circumpolar, meaning it never sets from certain latitudes.",
        distance_from_earth_miles: 3094,
        img: "images/Draco.jpg"
      },
      {
        id: nextConstellationId++,
        name: "Cygnus",
        year: "Ancient times",
        myth: "In Greek mythology, Cygnus represents Zeus in the form of a swan. It is also associated with the story of Orpheus and his lyre.",
        culture: "Greek",
        appearance: "Cygnus is shaped like a cross or a swan with outstretched wings. The bright star Deneb is part of this constellation.",
        distance_from_earth_miles: 2300,
        img: "images/Cygnus.jpg"
      },
      {
        id: nextConstellationId++,
        name: "Leo",
        year: "Ancient times",
        myth: "In Greek mythology, Leo is associated with the Nemean Lion, a beast slain by Hercules as one of his twelve labors.",
        culture: "Greek",
        appearance: "Leo is a zodiacal constellation featuring a distinctive backward question mark shape known as the Sickle. It contains the bright star Regulus.",
        distance_from_earth_miles: 2310,
        img: "images/Leo.jpg"
      }
];

const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().required(),
    year: Joi.string().required(),
    myth: Joi.string().required(),
    culture: Joi.string().required(),
    appearance: Joi.string().required(),
    distance_from_earth_miles: Joi.number().required()
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/constellations', (req, res) => {
    res.json(constellations);
});

app.get('/api/constellation/:id', (req, res) => {
    const constellationId = parseInt(req.params.id);
    const constellation = constellations.find(c => c.id === constellationId);

    if (constellation) {
        res.json(constellation);
    } else {
        res.status(404).json({ error: 'Constellation not found' });
    }
});

app.post('/api/constellations', upload.single('img'), async (req, res) => {
    try {
        const validatedData = schema.validate(req.body);

        if (validatedData.error) {
            throw new Error(validatedData.error.details[0].message);
        }

        const imagePath = req.file ? `/images/${req.file.filename}` : null;

        const newConstellation = {
            id: nextConstellationId++,
            ...validatedData.value,
            img: imagePath,
        };

        constellations.push(newConstellation);

        res.json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/delete-constellation/:id', (req, res) => {
    const constellationId = parseInt(req.params.id);
    const index = constellations.findIndex(c => c.id === constellationId);

    if (index !== -1) {
        res.json({ message: 'Constellation deleted successfully' });
        constellations.splice(index, 1);
    } else {
        res.status(404).json({ error: 'Constellation not found' });
    }
});

app.put('/api/update-constellation/:id', upload.single('img'), async (req, res) => {
    try {
        const constellationId = parseInt(req.params.id);
        const constellationToUpdate = constellations.find(c => c.id === constellationId);

        if (!constellationToUpdate) {
            throw new Error('Constellation not found');
        }

        const validatedData = schema.validate(req.body);

        if (validatedData.error) {
            throw new Error(validatedData.error.details[0].message);
        }

        const imagePath = req.file ? `/images/${req.file.filename}` : null;

        Object.assign(constellationToUpdate, validatedData.value, { img: imagePath });

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
