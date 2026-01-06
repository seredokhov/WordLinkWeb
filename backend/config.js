import dotenv from 'dotenv';

dotenv.config();

const config = {
    app_name: process.env['APP_NAME'],
    port: process.env['PORT'] ?? 3000,
    db_url: process.env['DB_URL'] ?? 'mongodb://localhost:27017/wordlink',
    root: process.env['ADMIN_ROOT'] ?? 'Admin',
    password: process.env['ADMIN_PASSWORD'],
    token_expires: process.env['TOKEN_EXPIRES'] ?? '24h',
    secred_key: process.env['SECRET_KEY'],
    db_options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

export default config;
