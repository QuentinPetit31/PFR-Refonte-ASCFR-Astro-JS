import mysql from "mysql2/promise";
export const prerender = false;
export async function POST({ request }) {
  let connection;

  try {
    console.log("Début du traitement de la demande");

    // Récupération et parsing des données
    const { matchId, memberNumber, name, firstname, email, phone, message } =
      await request.json();
    // console.log("Données brutes reçues:", bodyText);

    // let data;
    // try {
    //   data = JSON.parse(bodyText);
    //   console.log("Données JSON parsées:", data);
    // } catch (jsonError) {
    //   console.error("Erreur lors du parsing JSON:", jsonError);
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "Format de données invalide",
    //       error: jsonError.message,
    //     }),
    //     { status: 400, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // Récupération des champs du formulaire
    // const { matchId, memberNumber, name, firstname, email, phone, message } =
    //   data;

    // Validation des données
    if (!matchId || !memberNumber || !name || !firstname || !email || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Tous les champs obligatoires doivent être remplis",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ascfr_refonte",
      port: 3306,
    });

    // Début de la transaction
    await connection.beginTransaction();
    console.log("Transaction démarrée");

    try {
      // Créer une nouvelle demande
      const [demandeResult] = await connection.execute(
        "INSERT INTO demande (date_demande, commentaire_demande, message_demande, statut_demande, nom_demande, prenom_demande, email_demande, telephone_demande) VALUES (NOW(), ?, ?, 'en attente', ?, ?, ?, ?)",
        [
          message || "",
          `Demande pour le match ID ${matchId}`,
          name,
          firstname,
          email,
          phone,
        ]
      );

      const demandeId = demandeResult.insertId;
      console.log("Nouvelle demande créée avec ID:", demandeId);

      // Lier la demande à l'adhérent
      await connection.execute(
        "INSERT INTO formuler (id_adherent, id_demande) VALUES (?, ?)",
        [memberNumber, demandeId]
      );
      console.log("Relation formuler créée");

      // Lier la demande au match
      await connection.execute(
        "INSERT INTO cibler (id_rencontre, id_demande) VALUES (?, ?)",
        [matchId, demandeId]
      );
      console.log("Relation cibler créée");

      // Mettre à jour le nombre de places (utilisation du FOR UPDATE pour éviter les conditions de course)
      await connection.execute(
        "UPDATE rencontre SET placesDisp_rencontre = placesDisp_rencontre - 1 WHERE id_rencontre = ? AND placesDisp_rencontre > 0",
        [matchId]
      );
      console.log("Nombre de places mis à jour");

      // Si tout s'est bien passé, valider la transaction
      await connection.commit();
      console.log("Transaction validée avec succès");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Demande de réservation enregistrée avec succès",
          demandeId: demandeId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (transactionError) {
      // En cas d'erreur, annuler toutes les opérations
      await connection.rollback();
      console.error("Transaction annulée:", transactionError);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur lors du traitement de la demande",
          error: transactionError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Erreur générale:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Une erreur s'est produite",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("Connexion fermée");
      } catch (closeError) {
        console.error(
          "Erreur lors de la fermeture de la connexion:",
          closeError
        );
      }
    }
  }
}
