//npm install express mongoose body-parser cors

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas 연결 URL
const mongoDBUrl = 'mongodb+srv://taehwan011:tYESpuMTHdqzEM2K@cluster0.xbeufo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Mongoose를 사용하여 MongoDB에 연결
mongoose.connect(mongoDBUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected!');
});

// 스키마 정의
const cartItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// POST 요청을 처리하는 엔드포인트
app.post('/add-to-cart', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const newItem = new CartItem({ name, price, image });
    await newItem.save();
    res.send('Item added to cart!');
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).send('Error adding item to cart');
  }
});

// GET 요청을 처리하여 장바구니 아이템을 불러오는 엔드포인트
app.get('/get-cart-items', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching cart items:', err);
    res.status(500).send('Error fetching cart items');
  }
});

// DELETE 요청을 처리하여 장바구니 아이템을 삭제하는 엔드포인트
app.delete('/remove-from-cart/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    await CartItem.findByIdAndDelete(itemId);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).send('Error removing item from cart');
  }
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});