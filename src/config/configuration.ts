export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  zonaHoraria: process.env.ZONA_HORARIA || 'America/Lima',
  clave_encriptacion: process.env.CLAVE_ENCRIPTACION || 'zxcvbnm741852963',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_DATABASE || '',
  },
});
