/* EFA · Les 15 situations de l'enquête anonyme des organisations.
   L'ordre est figé : le service garde les réponses sous la forme "010010…" (une lettre par question, dans cet ordre).
   Pour changer une phrase, gardez le même identifiant et le même sens ; pour une nouvelle situation, créez une version 2. */
window.EFA_ENQUETE = [
  ["avance", "J’ai demandé une avance sur salaire au cours des 6 derniers mois."],
  ["court", "Il m’arrive souvent d’être à court d’argent avant la fin du mois."],
  ["dettes", "J’ai une dette envers un collègue, un prêteur ou un commerçant."],
  ["retenues", "Une retenue sur mon salaire rembourse un crédit."],
  ["irregulier", "Mes revenus changent d’un mois à l’autre (commissions, ventes, primes)."],
  ["urgences", "Cette année, une dépense imprévue (maladie, décès, accident) m’a mis en difficulté."],
  ["proches", "Les demandes de mes proches pèsent sur mon budget."],
  ["pics", "La rentrée scolaire, les fêtes ou les funérailles me mettent en difficulté chaque année."],
  ["tontines", "Je cotise à une tontine ou à un groupe d’épargne."],
  ["arnaques", "J’ai subi une arnaque, ou des frais de mobile money que je n’attendais pas."],
  ["retraite", "Je partirai à la retraite dans les 10 prochaines années."],
  ["primes", "Quand je reçois une prime, elle est dépensée en quelques semaines."],
  ["epargne", "On m’a proposé une épargne salariale ou un fonds que je comprends mal."],
  ["logement", "J’ai un projet de terrain ou de maison."],
  ["jeunes", "C’est mon premier emploi, ou je l’occupe depuis moins de 2 ans."]
];
/* Part de « oui » → importance de la situation dans le programme : 1 peu, 2 une partie, 3 beaucoup (0 = non retenue) */
window.EFA_ENQUETE_NIVEAU = function (part) { return part >= 0.5 ? 3 : part >= 0.25 ? 2 : part >= 0.1 ? 1 : 0; };
