//Gére les connexions en mode asynchrone
import mysql from "mysql2/promise";

export async function GET() {
  let connection;

  try {
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ascfr_refonte",
      port: 3306,
    });

    const [rows] = await connection.execute("SELECT COUNT(*) as count FROM rencontre");

    return new Response(JSON.stringify({
      success: true,
      message: "Connexion réussie",
      matchCount: rows[0].count
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  } finally {
    if (connection) await connection.end();
  }
}