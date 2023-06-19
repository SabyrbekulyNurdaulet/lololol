const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../src/modules/images/avatars/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const storageItem = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../src/modules/images/items/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  } 
});

const uploadItem = multer({ storage: storageItem });

require('dotenv').config();

const app = express();

const port = 8080;
const dbUri = "mongodb+srv://admin:admin@loginreg.buu74fw.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'token');
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/items', async (req, res) => {
  const client = await MongoClient.connect(dbUri);
  const db = client.db('mongodblol');
  const books = db.collection('Items');

  const data = await books.find({}).toArray();

  res.json(data);
});

app.post('/login', async (req, res) => {
  const { email, password} = req.body;

  try {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('mongodblol');
    const users = db.collection('Users');

    const user = await users.findOne({ email });  

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = user.password === password;

    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ _id: user._id, email: user.email, name: user.name, img: user.img }, "token");

    res.json({ token, name: user.name, img: user.img });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/register', upload.single("img"), async (req, res) => {
  const { email, password, name } = req.body;
  const img = req.file.filename;

  const client = await MongoClient.connect(dbUri);
  const db = client.db('mongodblol');
  const users = db.collection('Users');

  const existingUser = await users.findOne({ email });

  if (existingUser) {
      return res.status(401).json({ error: 'User already exists' });
  }

  const result = await users.insertOne({ email, password, name, img });

  const token = jwt.sign({ _id: result.insertedId, email, name, img }, "token");

  res.json({ token });
});

app.post('/items', uploadItem.single("img"), async (req, res) => {
  const { title } = req.body;
  const img = req.file.filename;

  const client = await MongoClient.connect(dbUri);
  const db = client.db("mongodblol");
  const items = db.collection("Items");

  const result = await items.insertOne({ title, img });

  const token = jwt.sign({ _id: result.insertedId, title, img }, "tooken");

  res.json({ token });
});

app.post('/avatar', verifyToken, upload.single('img'), async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('mongodblol');
    const users = db.collection('Users');

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { img: req.file.filename } },
      { returnOriginal: false }
    );

    const updatedUser = result.value;

    res.json({ img: updatedUser.img });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/avatar', verifyToken, async (req, res) => {
  try {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('mongodblol');
    const users = db.collection('Users');
    
    const { _id } = req.user;
    
    await users.updateOne({ _id: new ObjectId(_id) }, { $unset: { img: "" } });
    
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/items/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('mongodblol');
    const items = db.collection('Items');

    const result = await items.deleteOne({ title });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
