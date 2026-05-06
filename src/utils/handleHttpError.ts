export function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "La requête est invalide ou mal formulée.";
    case 401:
      return "Authentification requise pour accéder à cette ressource.";
    case 403:
      return "Vous n'êtes pas autorisé à accéder à cette ressource.";
    case 404:
      return "La ressource demandée est introuvable.";
    case 408:
      return "Le délai d'attente de la requête a expiré.";
    case 409:
      return "Un conflit empêche le traitement de la requête.";
    case 410:
      return "La ressource demandée n'est plus disponible.";
    case 413:
      return "La taille de la requête dépasse la limite autorisée.";
    case 415:
      return "Le format de la requête n'est pas supporté.";
    case 422:
      return "Les données fournies ne sont pas valides.";
    case 429:
      return "Trop de requêtes ont été envoyées en peu de temps.";
    case 500:
      return "Une erreur interne est survenue sur le serveur.";
    case 501:
      return "La fonctionnalité demandée n'est pas prise en charge.";
    case 502:
      return "Le serveur a reçu une réponse invalide d'un service tiers.";
    case 503:
      return "Le service est temporairement indisponible.";
    case 504:
      return "Le serveur n'a pas répondu dans les délais impartis.";
    default:
      return "Une erreur inattendue est survenue.";
  }
}
