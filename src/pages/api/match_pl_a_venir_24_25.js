import mysql from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ascfr",
    port: 3306,
  });

  const [rows] = await connection.execute("SELECT * FROM match_pl_24_25");

  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
