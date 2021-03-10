module.exports = {
    "type": "postgres",
    "url": process.env.DATABASE_URL,
    "host": "localhost",
    "port": 5432,
    "synchronize": true,
    "logging": true,
    "entities": ["src/entities/**/*.ts", "dist/entities/**/*.js"]
}