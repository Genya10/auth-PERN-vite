import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  password: "16082013",
  host: "localhost",
  port: "5432",
  database: "auth-vite",
});

export default pool;