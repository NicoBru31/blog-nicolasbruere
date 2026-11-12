---
title: Quelle est votre excuse pour ne pas utiliser Bun ?
description: Compatible Node, rapide, et un seul outil à la place de cinq. Et pourquoi Deno, qui avait presque tout, n'a pas eu le même succès.
pubDate: 2026-11-12
tags: [tooling]
draft: true
---

J'entends toujours les trois mêmes excuses, et je les ai eues moi-même : « ça va tout casser », « quelques secondes de gagnées, on s'en fiche », « encore un outil de plus ». Elles tombent toutes les trois, et chacune correspond à un point fort de Bun.

## « Ça va tout casser » : non, Bun est compatible Node

Il y a deux ans chez Braincube, on était sur Yarn v1. Lent en local, lent en CI. Passer à Yarn Berry ou pnpm voulait dire changer de lockfile pour toute l'équipe et toute la CI d'un coup.

Bun proposait autre chose : il sait écrire un `yarn.lock`.

```toml title="bunfig.toml"
[install.lockfile]
print = "yarn"
```

Avec ces deux lignes, j'utilisais `bun install` sur mon poste pendant que mes collègues et la CI restaient sur Yarn, sur le même fichier. Personne n'avait à le savoir. Résultat : aucune régression.

C'est le point le plus sous-estimé de Bun. Il ne vous demande pas de quitter l'écosystème Node : il garde le `package.json`, le dossier `node_modules`, le registre npm et les modules `node:*`. Vous pouvez l'adopter commande par commande, et revenir en arrière avec un `git checkout`.

Quelque temps après, j'ai créé un monorepo avec les workspaces de Bun. Bun a fonctionné comme prévu, et ça a été le premier pas vers une adoption globale de Bun chez Braincube. Aujourd'hui, nos apps et nos libs ont chacune leur monorepo sous Bun.

Au passage, les workspaces de Bun apportent les catalogs : on déclare une version une seule fois à la racine, et chaque package y fait référence.

```json title="package.json"
{
  "workspaces": {
    "packages": ["apps/*", "libs/*"],
    "catalog": {
      "react": "19.2.0",
      "typescript": "6.0.2"
    }
  }
}
```

```json title="apps/web/package.json"
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

Monter React dans tout le monorepo, c'est changer une ligne. Fini les packages qui dérivent chacun vers leur propre version.

## « Quelques secondes, on s'en fiche » : plus maintenant

Voici les chiffres publiés sur la page d'accueil de Bun, qui compare justement avec Yarn 1.22, notre Yarn v1 :

| Scénario                         | Bun 1.4 | Yarn 1.22 |
| -------------------------------- | ------- | --------- |
| CI sans cache (lockfile commité) | 0,95 s  | 17,6 s    |
| CI avec cache chaud              | 0,21 s  | 1,76 s    |
| Tout est déjà à jour             | 12 ms   | 211 ms    |

_Source : [bun.sh](https://bun.sh), app T3 d'environ 220 paquets, Linux x64 (EPYC 9R14), médiane de 3 runs._

![Quicksilver, le mutant des X-Men, qui court à toute vitesse](/posts/all-in-on-bun/quicksilver.png)

Seize secondes par install, ça paraît peu. Sauf qu'avec l'IA, les PR se multiplient, et chaque PR déclenche plusieurs runs de CI. Une équipe qui lance 100 runs par jour passe près d'une demi-heure de CI par jour rien qu'à installer des dépendances avec Yarn v1, contre moins de deux minutes avec Bun.

Et ce n'est pas que la CI. Un agent de code lance le lint, le type check et les tests en boucle, des dizaines de fois par tâche. Chaque seconde gagnée sur ces commandes est gagnée à chaque tour de boucle. Toujours d'après la page de Bun :

- `bun fmt` formate le dépôt de Prettier en 59,7 ms, contre 17,1 s pour Prettier.
- `bun check` vérifie la doc de MUI en 1,31 s, contre 10,28 s.

À l'heure où on ne compte plus les PR, tous les gains sont à prendre.

## « Encore un outil de plus » : non, un outil à la place de cinq

C'est le gain auquel je ne m'attendais pas. Bun ne s'ajoute pas à votre outillage, il le remplace :

| Rôle            | Habituellement   | Avec Bun      |
| --------------- | ---------------- | ------------- |
| Package manager | npm, Yarn, pnpm  | `bun install` |
| Tests           | Jest, Vitest     | `bun test`    |
| Formatage       | Prettier         | `bun fmt`     |
| Lint            | ESLint           | `bun lint`    |
| Type check      | `tsc`            | `bun check`   |
| Build           | esbuild, webpack | `bun build`   |

Moins d'outils, c'est surtout moins de fichiers de config. Ce blog n'a ni `.prettierrc`, ni `eslint.config.js`, ni `vitest.config.ts`. Tout tient dans un seul `bunfig.toml` :

```toml title="bunfig.toml"
[install]
exact = true

[test]
root = "./src"

[lint]
typeAware = true
ignorePatterns = ["src/routeTree.gen.ts", "dist/"]

[fmt]
printWidth = 100
semi = false
singleQuote = true
```

Un piège à connaître : `bun lint`, `bun fmt` et `bun check` lancent d'abord le script du même nom dans le `package.json` s'il existe. Si votre script `lint` appelle `bun lint`, il se rappelle lui-même en boucle. Ajoutez `--no-script` :

```json title="package.json"
{
  "scripts": {
    "format": "bun fmt --no-script",
    "lint": "bun lint --no-script --max-warnings 0",
    "check": "bun check --no-script",
    "test": "bun test"
  }
}
```

Côté tests, `bun test` vise la compatibilité avec Jest, et un fichier qui importe depuis `vitest` récupère ses fonctions depuis Bun. La doc reconnaît que tout n'est pas encore implémenté : pour une grosse suite Vitest, faites-la tourner en parallèle avant de basculer. **[TODO : ton retour sur une vraie suite Vitest]**

## Alors pourquoi Deno n'a pas eu ce succès ?

Deno avait presque tout, et bien avant Bun : formateur, linter, test runner et TypeScript natif dans un seul binaire, dès sa version 1.0 en 2020.

Mais Deno est né d'une conférence de Ryan Dahl, le créateur de Node, intitulée « 10 Things I Regret About Node.js ». Son but était de corriger Node en rompant avec lui : pas de `package.json`, pas de `node_modules`, des imports par URL. Techniquement, c'était défendable. En pratique, adopter Deno voulait dire réécrire son projet, pas changer un outil.

La compatibilité npm est arrivée petit à petit, jusqu'à Deno 2 fin 2024. Trop tard : Bun 1.0 était sorti un an plus tôt, présenté dès le départ comme un remplaçant direct de Node.

La leçon, c'est que pour un outil, le coût d'adoption compte plus que les fonctionnalités. Deno demandait de tout quitter d'un coup. Bun se contente d'une commande.

## Plus d'excuse

Commencez par `bun install` sur votre projet actuel. Si quelque chose casse, un `git checkout` et vous avez perdu cinq minutes. Sinon, essayez `bun test`, puis `bun fmt`, puis les autres. C'est exactement ce que j'ai fait.
