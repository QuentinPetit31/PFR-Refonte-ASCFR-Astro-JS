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

    // Exécution de la requête SQL pour récupérer tous les matchs
    const [rows] = await connection.execute("SELECT * FROM match_pl_24_25");

    // Renvoi de la réponse HTTP au format JSON contenant les lignes récupérées
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Si une erreur survient (connexion, requête SQL...), elle est attrapée ici
    console.error("Erreur lors de la récupération des matchs :", error);

    return new Response(
      JSON.stringify({
        message: "Erreur serveur : impossible de récupérer les matchs.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    // Fermeture de la connexion si elle a été ouverte
    if (connection) {
      await connection.end();
    }
  }
}
