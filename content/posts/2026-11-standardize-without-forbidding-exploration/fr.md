---
title: Standardiser sans s'interdire d'explorer
description: J'ai fait entrer TypeScript et Jotai chez Braincube. L'un est devenu un standard, l'autre a fait de moi « monsieur Jotai ».
pubDate: 2026-11-17
tags: [tooling]
---

J'ai fait entrer deux outils chez Braincube.

Le premier, c'est TypeScript. En 2021, aucun de nos projets front n'était typé. Aujourd'hui, presque tous le sont, et personne ne voudrait revenir en arrière.

Le second, c'est Jotai. Je l'ai introduit à la même époque, sur la même application, avec la même conviction. Résultat : je suis devenu « monsieur Jotai », et plus personne n'osait toucher un fichier qui l'importait sans passer par moi.

Même curiosité, même envie de bien faire, et deux issues opposées. J'ai mis du temps à comprendre ce qui les séparait. Ce billet, c'est ma tentative de l'expliquer.

## Explorer fait partie du travail

Je passe une bonne partie de mon temps à faire de la veille et à tester des outils. Ce blog en est l'exemple : il existe en partie parce que je voulais essayer le lint et le formatter de Bun, TanStack Start, Redact et TanStack Markdown. (Je suis un grand fan du travail de Tanner Linsley et de ses équipes.)

On réduit souvent le métier de dev à écrire du code et corriger des bugs, ou, en 2026, à les faire écrire par une IA. Je pense que la différence entre un bon dev et un dev moyen se joue en bonne partie ailleurs : **savoir repérer ce qui coince, et trouver le bon outil pour le débloquer.**

Voilà à quoi ça ressemble concrètement.

## Le JSON qui faisait peur

En 2021, à mon arrivée chez Braincube, je travaillais sur une application qu'on va appeler Charts. Elle affiche les données des utilisateurs sous forme de graphiques configurables.

À l'époque, c'est le backend qui calculait le rendu. Chaque action dans l'interface déclenchait un appel API, qui renvoyait la configuration complète du graphique : un gros objet JSON, plein de champs qui dépendaient les uns des autres. Un timeplot, par exemple, peut tracer plusieurs fonctions, chacune avec son style et sa couleur de points. Une heatmap n'a ni l'un ni l'autre.

Dans une base de code en JavaScript, rien n'empêchait d'écrire ça :

```js
// Rien ne dit que ce graphique n'est pas une heatmap…
chart.pointStyle = 'circle'
// …ni que `series` existe bien dans cette réponse.
const values = chart.series[0].values
```

Ça passait en dev, et ça cassait parfois en prod. On pouvait continuer à croiser les doigts à chaque release, mais c'est un pari qu'on finit toujours par perdre.

J'ai donc cherché un outil qui nous garantisse trois choses :

1. Que l'objet manipulé respecte bien le format renvoyé par l'API.
2. Qu'on ne puisse pas le modifier d'une façon que le type de graphique interdit.
3. En bonus, que ces erreurs apparaissent dans l'IDE, pas au runtime.

En 2026, la réponse paraît évidente : TypeScript, plus un validateur runtime comme Zod ou Valibot pour le premier point. Le deuxième se règle avec une union discriminée :

```ts
type Chart =
  | { type: 'timeplot'; pointStyle: PointStyle; pointColor: string; series: Series[] }
  | { type: 'heatmap'; colorScale: ColorScale; series: Series[] }

const heatmap: Chart = { type: 'heatmap', colorScale, series }
heatmap.pointStyle = 'circle'
// ❌ Erreur dans l'IDE : une heatmap n'a pas de `pointStyle`
```

Mais en 2021, ce n'était pas si évident. Valibot n'existait pas, Zod avait à peine un an, et TypeScript devenait tout juste le standard qu'il est aujourd'hui. Il y avait d'autres candidats sérieux :

- **Flow**, ou **JSDoc avec `// @ts-check`**, qui avaient l'avantage de ne pas obliger à renommer les fichiers.
- **Elm** ou **ReScript**, qui garantissent encore plus, mais au prix d'un nouveau langage pour toute l'équipe.

Plutôt que de choisir au feeling, j'ai posé des critères :

- une communauté active et en croissance ;
- une mise en place simple ;
- la rétrocompatibilité avec le code existant ;
- une adoption incrémentale possible.

J'ai testé chaque option contre cette grille, puis j'ai présenté à mon responsable le problème, la solution retenue et la grille elle-même. Il a validé, et TypeScript a commencé à se diffuser chez Braincube.

Aujourd'hui, presque tous nos projets ont été migrés. Sur les projets en TypeScript, on a nettement gagné en temps de développement, et le nombre de bugs a nettement baissé par rapport aux projets restés en JS.

## Le revers : une stack éclatée

L'exploration a un coût, que je n'ai compris qu'avec le temps, en passant de start-ups à des PME.

Je l'ai vécu : passer d'un projet en TypeScript à un autre en Flow, d'une API GraphQL à une API REST, d'une suite de tests Cypress à une autre en Playwright, le tout dans la même journée, c'est une gymnastique épuisante. Et même à l'heure de l'IA, c'est plus simple et moins cher d'avoir les mêmes skills et les mêmes plugins sur tous les projets.

Un exemple récent m'a convaincu. Pour accélérer nos CI, j'ai désactivé l'isolation de Vitest sur tous les projets front de Braincube. En substance :

```ts
// La config Vitest partagée par tous nos projets front
export default defineConfig({
  test: {
    isolate: false,
  },
})
```

Une ligne, plus la correction de deux ou trois tests qui dépendaient de l'isolation. Certains jobs sont passés de 20 à 5 minutes, et on gagne plus de 5 heures de CI par jour. Le goulot d'étranglement n'est même plus l'exécution des tests, mais le téléchargement de l'image Docker et l'installation des dépendances.

Ça n'a été possible que parce que tous nos projets front utilisent Vitest. Imaginons maintenant qu'un tiers soit sur Jest, un tiers sur Vitest et un tiers sur `bun test` :

- trois fichiers de config à maintenir, au minimum ;
- trois documentations à fouiller pour trouver l'équivalent de cette optimisation, s'il existe ;
- trois librairies à mettre à jour, chacune avec ses breaking changes ;
- dans un monorepo comme le nôtre, des `node_modules` plus lourds et des installs plus longues en CI.

Le gain ne tiendrait plus en une ligne.

Il y a aussi un coût plus discret, que j'ai vu à chaque fois : **chaque techno finit par avoir son expert.** Les autres ne se forment pas ; ils vont voir l'expert quand ça coince. Le savoir se concentre sur quelques personnes, et c'est rarement bon signe pour une entreprise. Avec une seule techno par besoin, tout le monde apprend la même chose.

## Monsieur Jotai

Ce qui m'amène au deuxième outil.

Toujours sur Charts, j'ai poussé l'utilisation de Jotai pour la gestion d'état. J'étais convaincu que c'était la bonne solution pour ce problème-là.

Sauf que Braincube avait déjà Redux (en perte de vitesse), Zustand et `React.createContext` pour ce rôle. Jotai est devenu une quatrième façon de faire la même chose. Et je suis devenu « monsieur Jotai » : personne n'osait toucher un fichier qui importait la lib sans me consulter d'abord.

C'est exactement le problème que je viens de décrire. Et c'est moi qui l'avais créé.

## Ce qui sépare les deux

Avec le recul, Jotai n'était pas un mauvais choix technique. La différence avec TypeScript est ailleurs.

**TypeScript comblait un vide ; Jotai s'ajoutait à une pile.** Il n'existait aucune solution de typage chez Braincube : TypeScript n'entrait en concurrence avec rien. Jotai, lui, arrivait sur un problème déjà résolu trois fois.

**TypeScript visait toute l'entreprise ; Jotai, une seule application.** Avec sa grille de critères et sa validation, TypeScript était dès le départ un candidat au standard. Jotai répondait au besoin d'une application, sans chemin pour devenir commun, ni pour remplacer ce qui existait.

D'où la règle que j'applique maintenant : **explorer, c'est individuel ; adopter, c'est collectif.** Je teste tout ce qui m'intrigue, sur un side project, une branche, ou ce blog. Mais avant qu'un outil entre dans un projet partagé, je me pose cinq questions :

1. **Qu'est-ce qu'il remplace ?** Si la réponse est « rien, il s'ajoute », il faut une très bonne raison.
2. **A-t-il vocation à aller partout ?** Un outil qui reste sur un seul projet devient vite une île.
3. **Qui d'autre que moi saura le maintenir dans un an ?**
4. **Pourra-t-on en changer facilement ?** Une migration vers une nouvelle techno est d'autant plus simple que la stack est déjà harmonisée : on remplace un seul outil, au même endroit, plutôt que trois variantes éparpillées.
5. **Comment vais-je l'expliquer à l'équipe et la former ?** Un outil adopté sans être expliqué, c'est un expert de plus. Une doc, une démo, quelques sessions de pair programming : l'adoption commence vraiment quand les autres savent s'en servir sans moi.

Bun a suivi ce chemin, comme je le raconte [dans mon précédent billet](/fr/posts/all-in-on-bun). Il a commencé sur mon seul poste, sans rien changer pour les autres puisqu'il savait écrire un `yarn.lock`. Il a fait ses preuves sur un monorepo, puis il est devenu le standard de nos apps et de nos libs. L'exploration a nourri l'harmonisation, au lieu de la fragmenter.

## Les deux vont ensemble

Standardiser n'est pas l'ennemi de la curiosité : c'est ce qui la rend rentable. Une stack commune transforme une bonne idée en une ligne de config qui profite à tout le monde. Et explorer n'est pas l'ennemi de la stack commune : c'est comme ça qu'elle évolue.

Le piège, c'est de confondre les deux étapes, et d'adopter un outil alors qu'on ne fait encore que l'explorer.
