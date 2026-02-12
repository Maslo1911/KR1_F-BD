const express = require('express');
const app = express();
const port = 3000;
let products = [
    {id: 1, name: 'Наушники', cost: 5000},
    {id: 2, name: 'Телефон', age: 30000},
    {id: 3, name: 'Чехол для телефона', age: 3000},
]
// Middleware для парсинга JSON
app.use(express.json());
// Главная страница
app.get('/', (req, res) => {
        res.send('Главная страница');
    });
// CRUD
app.post('/products', (req, res) => {
        const { name, cost } = req.body;
        const newProduct = {
            id: Date.now(),
            name,
            cost
        };
        products.push(newProduct);
        res.status(201).json(newProduct);
    });
app.get('/products', (req, res) => {
        res.send(JSON.stringify(products));
    });
app.get('/products/:id', (req, res) => {
        let product = products.find(p => p.id == req.params.id);
        res.send(JSON.stringify(product));
    });
app.patch('/products/:id', (req, res) => {
        const product = products.find(p => p.id == req.params.id);
        if (product) {
            const { name, price } = req.body;
            if (name !== undefined) product.name = name;
            if (price !== undefined) product.price = price;
            res.json(product);
        } else { //если поиск по id провалился, то выводит сообщение
            res.status(404).send('Товар не найден');
        }
    });
app.delete('/products/:id', (req, res) => {
        products = products.filter(p => p.id != req.params.id);
        res.send('Ok');
    });
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});