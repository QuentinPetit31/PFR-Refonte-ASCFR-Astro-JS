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

    // Vérification que la table contient bien des données
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM rencontre"
    );
    console.log("Nombre total de rencontres:", countResult[0].total);

    // Exécution de la requête SQL pour récupérer les matchs PL à venir
    // Exécution de la requête SQL pour récupérer les matchs PL à venir
    const [rows] = await connection.execute(
      "SELECT * FROM rencontre WHERE competition_rencontre = 'Premier League' OR competition_rencontre IS NULL ORDER BY date_rencontre ASC LIMIT 10"
    );

    console.log("Nombre de matchs récupérés:", rows.length);

    // Renvoi de la réponse HTTP au format JSON contenant les matchs
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Permet l'accès depuis n'importe quelle origine
      },
    });
  } catch (error) {
    // Si une erreur survient (connexion, requête SQL...), elle est attrapée ici
    console.error("Erreur lors de la récupération des matchs :", error);

    return new Response(
      JSON.stringify({
        message: "Erreur serveur : impossible de récupérer les matchs.",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } finally {
    // Fermeture de la connexion si elle a été ouverte
    if (connection) {
      await connection.end();
    }
  }
}
