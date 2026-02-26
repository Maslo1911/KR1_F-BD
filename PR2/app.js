const express = require('express');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require("cors");
const app = express();
const port = 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API управления товарами',
            version: '1.0.0',
            description: 'Простое API для управления товарами',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - cost
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         cost:
 *           type: number
 *           description: Цена товара
 *         quantity:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: "d5fE_S"
 *         name: "iPhone 15"
 *         category: "Телефоны"
 *         description: "Самый приятный и удобный смартфон на рынке"
 *         cost: 50000
 *         quantity: 10
 */

let products = [
    {
        id: nanoid(6),
        category: "Наушники",
        description: "Отличные наушники с активным шумоподавлением",
        name: 'AirPods',
        cost: 20000,
        quantity: 100
    },
    {
        id: nanoid(6),
        category: "Телефоны",
        description: "Мощный смартфон нового поколения для любых задач",
        name: 'Samsung Galaxy S24',
        cost: 40000,
        quantity: 50
    },
    {
        id: nanoid(6),
        category: "Чехлы",
        description: "Силиконовый чехол отлично защитить ваш телефон",
        name: 'Чехол для Samsung Galaxy S24',
        cost: 3000,
        quantity: 200
    },
    {
        id: nanoid(6),
        category: "Чехлы",
        description: "Силиконовый чехол отлично защитить ваш телефон",
        name: 'Чехол для iPhone 15',
        cost: 5000,
        quantity: 150
    },
    {
        id: nanoid(6),
        category: "Телефоны",
        description: "Самый приятный и удобный смартфон на рынке",
        name: 'iPhone 15',
        cost: 50000,
        quantity: 10
    },
    {
        id: nanoid(6),
        category: "Наушники",
        description: "Наушники для тех, кто ценит идеальный звук",
        name: 'Marshall Major IV',
        cost: 15000,
        quantity: 30
    },
    {
        id: nanoid(6),
        category: "Планшеты",
        description: "Выгодный баланс размера и мощности",
        name: 'iPad 5',
        cost: 25000,
        quantity: 20
    },
    {
        id: nanoid(6),
        category: "Игровые консоли",
        description: "Погружение в игры нового поколения с 4K",
        name: 'PlayStation 5 Slim',
        cost: 55000,
        quantity: 8
    },
    {
        id: nanoid(6),
        category: "Мониторы",
        description: "Изогнутый экран 144Гц для геймеров и дизайнеров",
        name: 'Samsung Odyssey G5',
        cost: 28000,
        quantity: 12
    },
    {
        id: nanoid(6),
        category: "Фотокамеры",
        description: "Компактная беззеркалка для ведения влогов",
        name: 'Sony ZV-E10',
        cost: 72000,
        quantity: 5
    },
]


app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для получения пользователя из списка
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

// Главная страница
app.get('/', (req, res) => {
        res.send('Главная страница');
    });
// CRUD

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

app.post('/products', (req, res) => {
        const { name, cost, category, description, quantity } = req.body;
        const newProduct = {
            id: nanoid(6),
            name: name ? name.trim() : "Без названия",
            cost: Number(cost) || 0,
            category: category || "Общее",
            description: description || "",
            quantity: Number(quantity) || 0
        };
        products.push(newProduct);
        res.status(201).json(newProduct);
    });
app.get('/products', (req, res) => {
        res.json(products);
    });

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Обновленный товар
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 *
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */

app.get('/products/:id', (req, res) => {
        const id = req.params.id;
        const product = findProductOr404(id, res);
        if (!product) return;
        res.json(product);
    });
app.patch('/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;

    // Проверяем наличие хотя бы одного поля для обновления
    const { name, cost, category, description, quantity } = req.body;

    if (!name && !cost && !category && !description && quantity === undefined) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    // Обновляем только те поля, которые пришли в запросе
    if (name !== undefined) product.name = name.trim();
    if (cost !== undefined) product.cost = Number(cost);
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (quantity !== undefined) product.quantity = Number(quantity);

    res.json(product);
    });
app.delete('/products/:id', (req, res) => {
        const id = req.params.id;
        const exists = products.some((p) => p.id === id);
        if (!exists) return res.status(404).json({ error: "product not found" });
        products = products.filter((p) => p.id !== id);
        // Правильнее 204 без тела
        res.status(204).send();
    });

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});
// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});