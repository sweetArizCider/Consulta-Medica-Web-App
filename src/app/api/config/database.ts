import { Dialect, Sequelize } from 'sequelize';
import { config } from 'dotenv';
config();

const credentials = {
  database: process.env['PGDATABASE'] || '',
  username: process.env['PGUSER'] ?? '',
  password: process.env['PGPASSWORD'] ?? '',
  options: {
    host: process.env['PGHOST'] ?? '',
    port: Number(process.env['PGPORT']) ?? 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  },
};

let sequelizeInstance: Sequelize | null = null;

export const getSequelizeInstance = (): Sequelize => {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(
      credentials.database,
      credentials.username,
      credentials.password,
      {
        host: credentials.options.host,
        port: Number(credentials.options.port),
        dialect: credentials.options.dialect as Dialect,
        dialectOptions: credentials.options.dialectOptions,
      }
    );
  }
  return sequelizeInstance;
}

