// src/pages/api/check-reservations.js
import mysql from "mysql2/promise";

export async function GET() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root", 
      password: "",
      database: "ascfr_refonte",
      port: 3306,
    });

    // Requête pour récupérer les réservations complètes
    const [reservations] = await connection.execute(`
      SELECT 
        u.prenom_utilisateur,
        u.nom_utilisateur,
        u.email_utilisateur,
        a.numero_adherent,
        a.telephone_adherent,
        r.adversaire_rencontre,
        r.date_rencontre,
        d.message_demande,
        d.date_demande,
        d.statut_demande
      FROM utilisateur u
      JOIN adherent a ON u.id_utilisateur = a.id_utilisateur
      JOIN adherer ad ON u.id_utilisateur = ad.id_utilisateur AND a.id_adherent = ad.id_adherent
      JOIN formuler f ON a.id_adherent = f.id_adherent
      JOIN demande d ON f.id_demande = d.id_demande
      JOIN cibler c ON d.id_demande = c.id_demande
      JOIN rencontre r ON c.id_rencontre = r.id_rencontre
      ORDER BY d.date_demande DESC
    `);

    return new Response(JSON.stringify({
      success: true,
      count: reservations.length,
      reservations: reservations
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