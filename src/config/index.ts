import 'dotenv/config';

export const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL || '',
};
