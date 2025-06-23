export const prerender = false;

import type { APIRoute } from "astro";
import mysql from "mysql2/promise";

// Définition de l'interface pour le corps de la requête
interface ReservationRequestBody {
  matchId: number;
  memberNumber: string;
  name: string;
  firstname: string;
  email: string;
  phone: string;
  message?: string; // Optionnel
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Lecture et typage des données JSON envoyées dans la requête
    const body: ReservationRequestBody = await request.json();

    // Récupération des valeurs depuis le corps de la requête
    const { matchId, memberNumber, name, firstname, email, phone, message } = body;

    // Validation des champs obligatoires
    if (!matchId || !memberNumber || !name || !firstname || !email || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: "Tous les champs obligatoires doivent être remplis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root",
      database: "ascfr_refonte",
    });

    // Insertion des données dans la table `demande`
    await connection.execute(
      `INSERT INTO demande 
        (date_demande, commentaire_demande, message_demande, statut_demande, nom_demande, prenom_demande, email_demande, telephone_demande) 
        VALUES (NOW(), ?, ?, 'en attente', ?, ?, ?, ?)`,
      [
        message || "",
        `Demande pour le match ID ${matchId}`,
        name,
        firstname,
        email,
        phone,
      ]
    );

    await connection.end();

    // Réponse en cas de succès
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de l’ajout de la demande :", error);

    // Réponse en cas d'erreur
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
