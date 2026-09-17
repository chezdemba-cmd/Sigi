# Handoff : Sigi — outil d'agence pour campagnes WhatsApp

## Vue d'ensemble

Sigi est un outil **interne** utilisé par une agence de communication pour gérer les campagnes
promotionnelles WhatsApp de plusieurs clients (restaurants, salons de beauté, boutiques,
associations, événementiel, PME). Un seul compte administrateur pilote tous les clients.

Ce bundle couvre la totalité des interfaces : connexion, tableau de bord global, gestion des
clients, base de contacts avec import CSV, liste des campagnes, assistant de création en six
étapes, détail d'une campagne (envois, réponses, réservations, statistiques) et paramètres.

Sigi n'est **pas** un CRM, ni une marketplace, ni un portail destiné aux clients finaux.
L'architecture est volontairement plate : cinq sections, pas de niveaux de navigation
supplémentaires.

## À propos des fichiers de design

Les fichiers de ce bundle sont des **références de design réalisées en HTML** : des prototypes
qui montrent l'apparence et le comportement attendus. Ce n'est pas du code de production à
copier tel quel.

Le travail consiste à **recréer ces écrans dans l'environnement du codebase cible** (Next.js 16
App Router, React 19, TypeScript strict, Tailwind CSS, Supabase, Lucide React, Recharts, Zod,
React Hook Form — la stack définie pour Sigi), en suivant ses conventions établies. Si aucun
codebase n'existe encore, cette stack est celle à mettre en place.

`Sigi.dc.html` s'ouvre directement dans un navigateur (il charge `support.js`, présent dans le
bundle). Les icônes du prototype sont des `<symbol>` SVG inline qui reproduisent le trait de
**Lucide** : en production, importer les composants `lucide-react` correspondants.

## Fidélité

**Haute fidélité (hifi).** Couleurs, typographie, espacements, rayons, ombres et états
interactifs sont définitifs. Recréer l'UI au pixel près avec Tailwind et les composants du
codebase. Les graphiques du prototype sont des barres CSS : les remplacer par Recharts en
conservant les couleurs et proportions documentées ci-dessous.

Les données affichées sont fictives (contexte dakarois, montants en FCFA). Elles illustrent la
densité attendue, pas le contenu réel.

---

## Design tokens

### Couleurs

| Rôle | Hex |
|---|---|
| Bleu nuit (sidebar, boutons secondaires, texte fort) | `#14213D` |
| Bleu nuit survolé | `#1E3157` |
| Vert principal (envoi, succès, WhatsApp) | `#18A875` |
| Vert principal survolé | `#149063` |
| Vert succès foncé (texte sur fond vert clair) | `#0F7A55` |
| Violet secondaire | `#7357D9` |
| Violet foncé (texte, avatars) | `#5B3FC4` |
| Fond d'application | `#F6F7FB` |
| Cartes | `#FFFFFF` |
| Texte principal | `#172033` |
| Texte secondaire | `#667085` |
| Texte tertiaire / placeholders | `#98A2B3` |
| Texte intermédiaire (cellules de tableau) | `#475467` |
| Texte de tableau foncé | `#344054` |
| Orange attention | `#F59E0B` |
| Orange texte (sur fond crème) | `#8A5A04` |
| Orange icône | `#B45309` |
| Rouge erreur / STOP | `#DC3545` |
| Rouge texte foncé | `#B02A37` |

Fonds et bordures de statut (paires à respecter) :

| Statut | Fond | Texte | Bordure |
|---|---|---|---|
| Succès / valide / connecté | `#EAF7F1` | `#0F7A55` | `#BFE6D5` |
| Attention / démo / programmée | `#FEF6E7` | `#8A5A04` | `#F7E2B8` |
| Erreur / STOP / invalide | `#FDEBEC` | `#DC3545` | `#F4C7CB` |
| Neutre / terminée / brouillon | `#F1F3F9` | `#475467` | — |
| Violet (catégories, IA) | `#F1EEFC` | `#5B3FC4` | — |
| Bleu (client, habitué) | `#E7F0FF` | `#14213D` | — |
| Orange (restaurant, partenaire) | `#FFF1E6` | `#C2410C` | — |

Bordures et séparateurs : `#E8EAF2` (bordure de carte), `#E1E5F0` (bordure de champ),
`#EDEFF6` (séparateur de bloc / fond de segmented control), `#F1F3F9` (séparateur de ligne),
`#FBFCFE` (fond d'en-tête de tableau, survol de ligne), `#D6DCEC` (bordure survolée, pointillés),
`#CBD2E4` (cases à cocher vides).

Le vert ne doit pas dominer : il est réservé à l'envoi, la réussite et les fonctions liées à
WhatsApp. La sidebar est bleu nuit, les boutons secondaires bleu nuit, les catégories violettes.

### Typographie

Deux familles, chargées depuis Google Fonts :

- **Manrope** — 600 / 700 / 800. Titres, chiffres clés, noms de cartes. `letter-spacing` négatif :
  `-.03em` sur le titre de connexion (31px/800), `-.02em` sur les titres de page (20px/800) et les
  chiffres clés (31px/800), `-.01em` sur les noms de client (16px/700).
- **Inter** — 400 / 500 / 600 / 700. Tout le reste : corps, labels, tableaux, boutons.

Échelle réellement employée :

| Usage | Taille / graisse / famille |
|---|---|
| Accroche de connexion | 31px / 800 / Manrope |
| Titre de page (barre supérieure) | 20px / 800 / Manrope |
| Chiffre clé de carte KPI | 31px / 800 / Manrope |
| Chiffre de tunnel, de modale | 19–24px / 800 / Manrope |
| Titre de carte / de section | 15–16px / 700 / Manrope |
| Nom de client (carte) | 16px / 700 / Manrope |
| Corps de champ, textarea | 13,5px / 400 / Inter |
| Libellé de bouton | 12,5–14px / 600 / Inter |
| Cellule de tableau | 13px / 400–600 / Inter |
| Label de formulaire | 12,5–13px / 600 / Inter |
| Texte secondaire, méta | 12–12,5px / 400–500 / Inter |
| En-tête de colonne | 11,5px / 600 / Inter, `letter-spacing:.03em`, majuscules |
| Badge de statut | 11–11,5px / 700 / Inter |
| Label de champ en petites capitales (sidebar, modales) | 10–12px / 700 / Inter, `letter-spacing:.03–.12em` |

Chiffres dans les tableaux et les colonnes numériques : `font-variant-numeric: tabular-nums`.
Monospace (`ui-monospace, Menlo`) uniquement pour les clés API, URL de webhook, noms de colonnes
CSV et légendes de placeholder d'image.

### Espacement, rayons, ombres

- Grille d'espacement effective : 2, 3, 6, 7, 9, 10, 11, 13, 14, 16, 18, 20, 22, 26px.
  Padding de contenu principal : `26px`. Padding de carte : `17–20px`. Gap de grille : `13–18px`.
- Rayons : `6px` badge · `8–9px` petit bouton, item de nav · `10px` bouton, champ ·
  `11–12px` bloc interne, ligne de réponse · `13–14px` carte · `16px` modale ·
  `22px` cadre du simulateur téléphone · `999px` pastille de mode.
- Ombres : carte `0 1px 2px rgba(20,33,61,.05)` · carte survolée
  `0 6px 18px rgba(20,33,61,.08)` · bouton vert `0 1px 2px rgba(24,168,117,.4)` ·
  bouton nuit `0 1px 2px rgba(20,33,61,.18)` · onglet actif `0 1px 2px rgba(20,33,61,.08)` ·
  modale `0 24px 60px rgba(20,33,61,.3)`.
- Voile de modale : `rgba(20,33,61,.45)`, padding `24px`, contenu centré.
- Focus de champ : `border-color:#7357D9` + `box-shadow:0 0 0 3px rgba(115,87,217,.14)`.
  Champ en erreur : `border-color:#DC3545` + `box-shadow:0 0 0 3px rgba(220,53,69,.12)`.

### Animations

- Entrée de page : `sigiIn` — `opacity 0→1` + `translateY(6px)→0`, `250ms ease both`.
- Entrée de modale : même keyframe, `200ms`.
- Pastille de mode Démo dans la sidebar : `sigiPulse` — `opacity 1→.45→1`, `2,4s ease-in-out infinite`.
- Réduction de sidebar : `width .18s ease`. Bascule de switch : `background .18s`.
- Survols : `background .15s` / `border-color .15s`. Barre de progression : `width .3s ease`.
- Barres du tunnel : `height .3s`.

---

## Layout commun

Deux zones : sidebar fixe à gauche, colonne de contenu à droite.

**Sidebar** — `position:sticky; top:0; height:100vh`, fond `#14213D`.
Largeur `246px` déployée, `74px` réduite (transition 180ms).
De haut en bas : logo (carré `32px`, rayon `9px`, fond `#18A875`, lettre « S » Manrope 800 17px
blanche) + mot-clé « Sigi » (Manrope 800, 19px, blanc) + étiquette « AGENCE » (10px/700,
`#7E8CAE`, `letter-spacing:.08em`) ; puis les cinq entrées de navigation ; puis, poussé en bas
par `margin-top:auto` : le badge « Mode Démo actif », le bouton « Réduire », et la carte de
profil administrateur.

Entrée de navigation : `padding:10px 11px`, rayon `9px`, icône `19px` (trait 1,9), libellé 14px.
État inactif `color:#9AA7C4`, poids 500, fond transparent. État actif
`background:rgba(255,255,255,.12)`, `color:#FFFFFF`, poids 600.
Survol `background:rgba(255,255,255,.09)`.
Les cinq entrées, dans cet ordre : Tableau de bord (`layout-grid`), Clients (`users`),
Contacts (`contact`), Campagnes (`megaphone`), Paramètres (`sliders-horizontal`).
`/campagnes/nouvelle` et `/campagnes/[id]` gardent « Campagnes » actif.

Badge Démo de la sidebar : `background:rgba(245,158,11,.14)`,
`border:1px solid rgba(245,158,11,.35)`, pastille `7px` `#F59E0B` pulsée, texte 12px/600
`#FBBF4E`. Masqué en mode Réel.

Carte de profil : avatar rond `30px` `#7357D9`, initiales « AM » 12px/700 blanc ; nom 13px/600
blanc ; rôle 11px `#8E9CBC` ; icône `log-out` `16px` à droite. Bordure
`1px solid rgba(255,255,255,.1)`. Dans le prototype, un clic déconnecte (retour à `/login`).

En mode réduit, seules les icônes restent : tous les libellés textuels disparaissent.

**Barre supérieure** — `position:sticky; top:0; z-index:20`,
`background:rgba(255,255,255,.88)` + `backdrop-filter:blur(8px)`,
`border-bottom:1px solid #E8EAF2`, `padding:13px 26px`, `flex-wrap:wrap`.
À gauche : fil d'Ariane (12,5px `#667085`, uniquement sur `/campagnes/nouvelle` et
`/campagnes/[id]`), titre de page (Manrope 800, 20px), sous-titre contextuel (12,5px `#667085`).
À droite, dans cet ordre :

1. **Sélecteur de client actif** — `min-width:216px`, bordure `#E1E5F0`, rayon `10px`.
   Carré d'initiales `26px` fond `#EEF0F7` texte `#14213D` 11px/700 ; label « CLIENT ACTIF »
   10px/700 `#98A2B3` ; nom du client 13px/600 ; chevron bas `15px`.
   C'est le garde-fou anti-erreur d'envoi : il doit rester visible sur toutes les pages.
2. **Indicateur Démo / Réel** — pastille `border-radius:999px`, `padding:8px 12px`, 12,5px/600.
   Démo : fond `#FEF6E7`, texte `#8A5A04`, bordure `#F7E2B8`.
   Réel : fond `#EAF7F1`, texte `#0F7A55`, bordure `#BFE6D5`.
   Point de `7px` en `currentColor` à gauche du libellé.
3. **Notifications** — carré `38px`, rayon `10px`, icône `bell` `18px`, compteur rouge `#DC3545`
   en pastille `18px` avec bordure blanche `2px`, décalée de `-4px`.
4. **Action principale**, variable selon la page (voir tableau ci-dessous).

| Route | Libellé | Icône | Fond |
|---|---|---|---|
| `/dashboard` | Créer une campagne | `plus` | `#18A875` |
| `/clients` | Ajouter un client | `plus` | `#14213D` |
| `/contacts` | Importer des contacts | `upload` | `#18A875` |
| `/campagnes` | Créer une campagne | `plus` | `#18A875` |
| `/campagnes/nouvelle` | Enregistrer le brouillon | `copy` | `#14213D` |
| `/campagnes/[id]` | Dupliquer la campagne | `copy` | `#14213D` |
| `/parametres` | Tester les connexions | `zap` | `#14213D` |

**Bandeau Démo** — sous la barre supérieure, sur toutes les pages, tant que le mode Démo est
actif : fond `#FEF6E7`, bordure basse `#F7E2B8`, texte `#8A5A04` 13px, icône `alert-triangle`
`16px`. Contenu exact : **« Mode Démo »** puis « — aucun message réel ne sera envoyé. Les données
affichées sont simulées. » Lien à droite : « Configurer le mode Réel » (souligné, 600), qui mène
à `/parametres`.

**Contenu** — `padding:26px`, fond `#F6F7FB`, cartes blanches, grilles
`repeat(auto-fit, minmax(…, 1fr))`.

---

## Écrans

### 1. `/login` — Connexion

Deux colonnes égales sur toute la hauteur (`grid-template-columns:1fr 1fr`).

**Colonne gauche**, fond blanc, `padding:48px 8vw`, contenu centré verticalement :
logo (carré `38px` rayon `11px` `#18A875`, « S » Manrope 800 20px) + « Sigi » Manrope 800 23px,
puis `margin-bottom:44px`. Accroche : « Vos campagnes WhatsApp, simplement maîtrisées. »
(Manrope 800, 31px, `letter-spacing:-.03em`, `line-height:1.2`, `max-width:15em`).
Sous-texte 14,5px `#667085` : « Espace réservé à l'équipe de l'agence. Un seul compte
administrateur pilote les campagnes de tous les clients. »

Formulaire (`max-width:420px`, `gap:16px`) : champ **Adresse e-mail** ; champ **Mot de passe**
avec lien « Mot de passe oublié ? » (12,5px/600 `#7357D9`) aligné à droite du label, et bouton
œil (`eye`, carré `32px` rayon `8px`, survol `#F4F6FB`) qui bascule `type=password`/`text`.
Champs : `padding:12px 14px`, rayon `10px`, bordure `#E1E5F0`, 14px.

État d'erreur documenté dans la maquette : bordure `#DC3545` et message 12,5px `#DC3545` avec
icône `alert-triangle` `14px` — « Mot de passe incorrect. 2 tentatives restantes avant blocage
temporaire. » À l'implémentation, cet état n'apparaît qu'après un échec réel.

Bouton **« Se connecter »** : pleine largeur, `padding:13px`, rayon `10px`, fond `#18A875`,
14,5px/600 blanc. Sous le bouton, mention de sécurité 12,5px `#667085` avec icône `shield`
`15px` verte : « Connexion chiffrée. Accès journalisé conformément au RGPD. »

**Colonne droite**, fond `#14213D`, `padding:48px 6vw`. Illustration abstraite : motif de
rayures SVG en `pattern` (lignes de 5px, rotation 35°, `#FFFFFF` à 7 % d'opacité), en
`position:absolute; inset:0`, `opacity:.5`. Par-dessus : surtitre « MODE DÉMO DISPONIBLE »
(11px/700, `letter-spacing:.12em`, `#18A875`) ; titre « Testez un envoi complet sans brancher un
seul compte Meta. » (Manrope 700, 23px, blanc) ; trois blocs
`background:rgba(255,255,255,.07)`, bordure `rgba(255,255,255,.1)`, rayon `13px`,
icône verte `19px` + titre 13,5px/600 blanc + description 12,5px `#9AA7C4` :

1. `sparkles` — « Messages générés puis validés par vous » / « Trois variantes proposées, toujours modifiables avant envoi. »
2. `shield` — « Consentement tracé, STOP respecté » / « Toute désinscription bloque immédiatement les envois et rappels. »
3. `users` — « Un client, un cloisonnement strict » / « Contacts, identifiants et statistiques ne se croisent jamais. »

La connexion réussie redirige vers `/dashboard`. Toutes les routes de l'espace principal sont
protégées.

### 2. `/dashboard` — Tableau de bord

Sous-titre de page : « Vue globale de l'agence — 12 clients ».

**Barre de filtres** : segmented control `30 jours` / `7 jours` / `Trimestre`
(conteneur `#EDEFF6` rayon `10px` `padding:3px` ; segment actif fond blanc + ombre) ;
filtre « Tous les clients » (bouton bordé, icône `filter` + chevron) ;
à droite « Synchronisé il y a 4 min » (12,5px `#98A2B3`).

**Sept cartes KPI** en `repeat(auto-fit, minmax(190px, 1fr))`, gap `13px`.
Structure : label 12,5px/600 `#667085` + icône `15px` ; valeur Manrope 800 31px ; note 12px.

| Carte | Valeur | Note |
|---|---|---|
| Clients actifs (`users`) | 12 | sur 14 comptes ouverts |
| Contacts consentants (`shield`) | 8 472 | 93 % de la base totale |
| Messages envoyés (`message-square`) | 24 318 | 97,2 % livrés (vert, icône `trending-up`) |
| Réponses à traiter (`bell`) | 23 | dont 5 demandes de réservation |
| Réservations (`calendar`) | 216 | valeur estimée 4,3 M FCFA |
| Taux de réponse (`trending-up`) | 18,4 % | +2,1 pts vs période précédente |
| Désinscriptions STOP (`ban`) | 148 | 0,6 % des envois — exclues automatiquement |

La carte « Réponses à traiter » est la seule accentuée : fond
`linear-gradient(#FFFDF8,#fff)`, bordure `#F3D9A6`, label, valeur et note en `#8A5A04`.
Elle est cliquable et mène au détail de campagne, onglet Réponses.

**Ligne suivante**, grille `2fr 1fr` :

- **Graphique d'activité** — « Activité des 12 dernières semaines ». Barres empilées, hauteur de
  zone `180px`, gap `10px`. Trois séries : Envoyés `#14213D`, Réponses `#18A875`,
  Réservations `#7357D9`. Légende en haut à droite (carrés `9px` rayon `3px` + libellé 12px).
  Axe sous le graphe : `Semaine 27` / `Semaine 32` / `Semaine 38` (10,5px `#98A2B3`,
  séparé par `border-top:1px solid #EDEFF6`). Valeurs (en % de hauteur, envoyés/réponses/
  réservations) : 34/9/3, 41/11/4, 29/7/2, 52/14/5, 47/12/5, 61/17/7, 55/15/6, 68/19/8, 73/21/9,
  64/18/7, 81/24/11, 88/27/12. À porter en `BarChart` empilé Recharts.
- **Réponses prioritaires** — titre + sous-titre « Classées automatiquement, à valider par vous ».
  Trois lignes cliquables (bordure `#EDEFF6`, rayon `11px`, survol bordure `#D6DCEC` +
  fond `#FBFCFE`) : rond de catégorie `32px` + nom 13,5px/600 + badge de catégorie +
  extrait 12,5px `#667085` tronqué sur une ligne. Puis un bouton pleine largeur
  « Voir les 23 réponses » (fond `#F4F6FB`, 13px/600 `#14213D`).
  Contenu : STOP `+221 77 812 44 09` « Désinscription appliquée — Boutique Kora » ·
  Réservation `Fatou Ndiaye` « Bonjour, une table pour 4 samedi 20h ? » ·
  Question prix `Mariama Sow` « Le brunch est à combien par personne ? »

**Dernière ligne**, grille `2fr 1fr` :

- **Campagnes récentes** — quatre lignes (carré d'initiales `34px` aux couleurs du client, nom
  13,5px/600, méta « client · N destinataires » 12px, badge de statut à droite), séparées par
  `1px solid #F1F3F9`. Lien « Tout voir » (12,5px/600 `#7357D9`) en haut à droite.
- **Alerte de configuration** — carte bordée `#F3D9A6` : icône `alert-triangle` sur carré
  `#FEF6E7`, titre « 2 clients sans configuration WhatsApp », texte « Les Jardins d'Almadies et
  Pâtisserie Bamboo restent en mode Démo jusqu'au test de connexion. », bouton nuit
  « Ouvrir les clients ».
- **Activité récente** — quatre entrées : pastille `7px` colorée + texte 12,5px dont le fait est
  en 600 `#172033`. Vert : « 1 248 messages envoyés — Brunch de la Teranga · il y a 26 min ».
  Rouge : « 3 STOP traités — rappels annulés · il y a 1 h ».
  Violet : « 412 contacts importés — Boutique Kora · hier 17:40 ».
  Gris : « Client créé — Studio Néré · hier 09:12 ».

### 3. `/clients` — Clients

Sous-titre : « 12 clients actifs, 2 archivés ».

**Barre d'outils** : champ de recherche « Rechercher un client… » (icône `search` `16px`,
`flex:1 1 260px`, `max-width:380px`), filtre « Tous les secteurs », filtre « Actifs »,
et à droite « 4 clients affichés ».

**Cartes clients** en `repeat(auto-fill, minmax(330px, 1fr))`, gap `15px`.
Survol : bordure `#D6DCEC` + ombre `0 6px 18px rgba(20,33,61,.08)`.

Structure d'une carte, de haut en bas :

1. En-tête : carré d'initiales `42px` rayon `11px` (couleurs par secteur) ; nom
   Manrope 700 16px ; méta « Secteur · ton <ton> » 12,5px `#667085` ; bouton `more-horizontal`
   (carré `30px`, survol `#F4F6FB`) pour Modifier / Archiver / Tester.
2. Rangée de badges (11,5px/600, rayon `7px`) : état WhatsApp (avec point `6px`), mode
   Démo/Réel, statut.
3. Trois chiffres séparés par `border-top`/`border-bottom` `#F1F3F9`, `padding:13px 0` :
   contacts, campagnes, réservations (Manrope 800 18px + label 11,5px `#667085`).
4. Actions : **Ouvrir** (bouton nuit), **Tester WhatsApp** (bordé, icône `zap`),
   **Modifier** (bordé, icône `pencil`), et à droite la dernière activité (11,5px `#98A2B3`).

Données de la maquette :

| Client | Secteur | Ton | WhatsApp | Mode | Contacts | Campagnes | Résa. | Activité |
|---|---|---|---|---|---|---|---|---|
| Le Balafon | Restaurant | chaleureux | Connecté | Réel | 1 412 | 9 | 86 | il y a 26 min |
| Studio Néré | Salon de beauté | premium | Connecté | Réel | 742 | 6 | 54 | il y a 3 h |
| Boutique Kora | Prêt-à-porter | direct | Jeton à renouveler (orange) | Réel | 2 318 | 12 | 41 | hier 17:40 |
| Les Jardins d'Almadies | Événementiel | institutionnel | Non configuré (rouge) | Démo | 318 | 2 | 0 | il y a 6 j |

Dernière tuile de la grille : **état d'ajout**, bordure `1.5px dashed #D6DCEC`, rayon `14px`,
`min-height:210px`, centrée — carré vert `38px` avec `plus`, titre « Ajouter un client »,
description « Nom, secteur, ton de communication et identifiants WhatsApp propres au client. »
Survol : bordure `#18A875`, fond `#FBFDFC`.

Champs attendus dans le formulaire client (hors maquette, à implémenter) : nom commercial, logo,
secteur, description, ton de communication, adresse, téléphone, e-mail, site, horaires, lien de
réservation, couleurs de marque, consignes destinées au générateur, statut, mode, et la
configuration Meta propre au client (Phone Number ID, WhatsApp Business Account ID, Access Token,
Webhook Verify Token, statut de connexion, date du dernier test). Les secrets restent côté
serveur et sont **toujours masqués** dans l'interface.

### 4. `/contacts` — Contacts

Sous-titre : « 8 472 contacts consentants sur 9 104 ».

**Quatre cartes de synthèse** (`minmax(178px, 1fr)`, rayon `13px`, `padding:15px`) : label
12,5px/600 `#667085`, valeur Manrope 800 26px colorée, note 12px.
Consentement valide **8 472** (`#0F7A55`) / 93 % · Désinscrits (STOP) **148** (`#DC3545`) /
exclus d'office · À vérifier **312** (`#B45309`) / preuve manquante ·
Numéros invalides **172** (`#475467`) / format international.

**Carte de tableau** : en-tête de filtres (`padding:15px 18px`, bordure basse `#EDEFF6`) avec
recherche « Nom, prénom ou numéro… » (fond `#F6F7FB`), filtres « Client : Le Balafon »,
« Catégorie », « Consentement », puis à droite « Modèle CSV » (icône `download`) et « Exporter ».

Tableau `min-width:900px` dans un conteneur `overflow-x:auto`.
En-têtes sur fond `#FBFCFE`, 11,5px/600 `#667085`, `letter-spacing:.03em` :
CONTACT · TÉLÉPHONE · CATÉGORIE · CONSENTEMENT · SOURCE · STATUT · (actions).
Lignes séparées par `1px solid #F1F3F9`, survol `#FBFCFE`, `padding:12px 18px`.
Cellule CONTACT : avatar rond `30px` `#EEF0F7` + nom 600 + « ajouté le JJ/MM/AAAA »
11,5px `#98A2B3`. Téléphone en `tabular-nums`. Catégorie et statut en badges
(le statut porte un point `6px`).

| Contact | Téléphone | Catégorie | Consentement | Source | Statut |
|---|---|---|---|---|---|
| Fatou Ndiaye | +221 77 412 08 55 | VIP | 04/03/2026 | Formulaire en salle | Valide |
| Mariama Sow | +221 78 220 91 04 | Habituée | 18/01/2026 | Carte de fidélité | Valide |
| Ousmane Diop | +221 76 118 33 27 | Prospect | — | Import CSV | À vérifier |
| Awa Ba | +221 77 812 44 09 | Habituée | 22/02/2026 | Formulaire en salle | Désinscrite |
| Ibrahima Fall | +221 70 904 12 66 | Nouveau client | 09/09/2026 | QR code en boutique | Valide |
| Khady Sarr | +221 77 55 0 12 | Prospect | 08/09/2026 | Import CSV | Numéro invalide |
| Moussa Diallo | +221 78 661 77 31 | Partenaire | 11/12/2025 | Contrat signé | Valide |

Pied de tableau (`border-top:1px solid #EDEFF6`) : à gauche, en vert `#0F7A55` 12,5px/600 avec
icône `shield` — « Aucun contact ne peut être ajouté sans consentement tracé. » ; à droite
« 1–7 sur 1 412 » et un bouton « Suivant ».

Catégories prévues : VIP, Habitué, Prospect, Nouveau client, Partenaire, Personnalisée.
Statuts : Consentement valide, Désinscrit, Numéro invalide, À vérifier.
Actions attendues : ajout manuel, modification, import CSV, téléchargement du modèle, export,
recherche, filtres, changement de catégorie, désinscription, anonymisation.

**Modale d'import CSV** — ouverte par l'action principale de la page.
`max-width:760px`, `max-height:88vh`, `overflow:auto`, rayon `16px`.
En-tête : titre « Importer des contacts » (Manrope 700 17px) + badge « Étape 6 sur 8 —
récapitulatif » + bouton `x`. Le parcours complet comporte huit étapes : dépôt du fichier,
association des colonnes, vérification des numéros, choix du client propriétaire, source du
consentement, détection des doublons, récapitulatif, confirmation. La maquette montre le
récapitulatif.

Corps : bloc de fichier (`#F6F7FB`, icône `upload` verte) — « contacts-balafon-sept.csv »,
« 512 lignes · client propriétaire : Le Balafon · source : formulaire en salle », lien
« Remplacer » ; puis quatre compteurs (`minmax(150px,1fr)`, Manrope 800 24px) :
**412** contacts valides (vert) · **58** doublons ignorés (neutre) · **27** numéros invalides
(orange) · **15** sans consentement (rouge) ; puis le bloc **CORRESPONDANCE DES COLONNES**
(trois lignes `nom_complet → Nom + Prénom`, `tel → Téléphone international`,
`date_accord → Date du consentement`, source en monospace `#667085`, chevron, cible en 600) ;
puis une alerte rouge : « 15 lignes seront refusées : aucune preuve de consentement. Un contact
sans consentement tracé ne peut pas être importé. »

Pied (`#FBFCFE`, bordure haute) : « Annuler » à gauche, « 412 contacts seront ajoutés à Le
Balafon » au centre, « Confirmer l'import » (vert) à droite.

### 5. `/campagnes` — Liste des campagnes

Sous-titre : « 4 en cours, 2 programmées ».

Barre : segmented control `Toutes` / `En cours` / `Programmées` / `Brouillons` ;
filtres « Tous les clients » et « Mode : tous » ; à droite, bascule de vue
`Tableau` / `Calendrier`.

Tableau `min-width:1020px` : CAMPAGNE · CLIENT · ENVOI · AUDIENCE · LIVRÉS · RÉPONSES · RÉSA. ·
STOP · STATUT. Les quatre colonnes numériques sont alignées à droite en `tabular-nums` ;
RÉPONSES en 600, RÉSA. en `#0F7A55` 600, STOP en `#DC3545`.
Cellule CAMPAGNE : nom en 600 puis, en 11,5px `#98A2B3`, « type · mode » où le mode est en 600
et coloré (`#0F7A55` pour Réel, `#8A5A04` pour Démo). Lignes cliquables vers le détail.

| Campagne | Client | Envoi | Audience | Livrés | Rép. | Résa. | STOP | Statut |
|---|---|---|---|---|---|---|---|---|
| Brunch de la Teranga | Le Balafon | 18 sept. 10:00 | 1 248 | 1 214 | 229 | 86 | 3 | En cours |
| Offre soin -20 % septembre | Studio Néré | 09 sept. 09:00 | 642 | 631 | 104 | 54 | 2 | Terminée |
| Arrivage wax premium | Boutique Kora | 21 sept. 18:00 | 2 104 | — | — | — | — | Programmée |
| Appel aux bénévoles | Association Teranga | 12 sept. 14:00 | 318 | 318 | 41 | 0 | 0 | Simulation |
| Menu de la Tabaski | Le Balafon | — | 1 180 | — | — | — | — | Brouillon |
| Relance clientes inactives | Studio Néré | 02 sept. 11:00 | 288 | 274 | 33 | 12 | 6 | Terminée |
| Vente privée fin de saison | Boutique Kora | 29 août 17:00 | 1 940 | 1 702 | 188 | 29 | 11 | Échec partiel |

Statuts et couleurs : Brouillon et Terminée → neutre ; Programmée et Simulation → orange ;
En cours → vert ; Échec / Échec partiel → rouge ; Suspendue → neutre.
Actions attendues : créer, ouvrir, modifier un brouillon, dupliquer, suspendre si possible,
archiver.

### 6. `/campagnes/nouvelle` — Assistant de création

Fil d'Ariane « Campagnes › Nouvelle campagne ».

**Indicateur d'étapes**, carte pleine largeur : six pastilles en `flex:1 1 140px` —
rond `22px` (numéro, ou `✓` pour une étape franchie) + libellé 12,5px/600.
Étape courante : fond `#EAF7F1`, bordure `#BFE6D5`, rond `#18A875` blanc, texte `#0F7A55`.
Étape franchie : rond `#D7E4DF` texte `#0F7A55`, libellé `#475467`.
Étape à venir : rond `#EDEFF6`, texte `#98A2B3`.
Sous les pastilles, barre de progression `height:4px` fond `#EDEFF6`, remplissage `#18A875`
à `étape / 6` (transition 300ms).

Étapes : 1 Informations · 2 Audience · 3 Message · 4 Visuel · 5 Programmation · 6 Vérification.

Corps en grille `1.55fr 1fr` : le formulaire de l'étape à gauche, l'aperçu téléphone à droite
en `position:sticky; top:96px`. En bas du formulaire, « Précédent » (bordé) et « Continuer »
(nuit, aligné à droite).

**Étape 1 — Informations.** Neuf champs en `repeat(auto-fit, minmax(220px, 1fr))` :
Client (Le Balafon), Nom interne (Brunch de la Teranga), Objectif (Remplir le service du
dimanche), Type de campagne (Promotion), Offre (Buffet à volonté, enfants -50 %), Date ou
période (Dimanche 20 septembre, 11h–16h), Lieu (Corniche Ouest, Dakar), Prix
(12 000 FCFA / personne), Lien (lebalafon.sn/brunch).

**Étape 2 — Audience.** Intro : « Base du client Le Balafon uniquement. Les exclusions sont
recalculées à l'instant de l'envoi. » Puces de catégories cliquables (case `16px` rayon `5px`,
cochée `#18A875` avec `check` blanc ; sélectionnée : fond `#F7FCFA`, bordure `#18A875`, texte
`#0F7A55`) : VIP 212 ✓, Habitués 689 ✓, Nouveaux clients 567 ✓, Prospects 402, Partenaires 38.
Puis le décompte, en lignes séparées : « Contacts dans les catégories retenues » **1 468** ·
« — désinscrits STOP » **12** (rouge) · « — sans consentement tracé » **147** (orange) ·
« — numéros invalides » **61** · et, sur fond `#EAF7F1`, « Destinataires estimés »
**1 248** (Manrope 800 20px `#0F7A55`).

**Étape 3 — Message.** Intro : « Le ton "chaleureux" du Balafon et l'offre renseignée à
l'étape 1 sont transmis au générateur. »
Trois modes de rédaction : **Générer trois propositions** (bouton vert, icône `sparkles`),
**Utiliser un gabarit** (bordé), **Rédiger manuellement** (bordé).
Trois variantes en cartes sélectionnables (`minmax(178px,1fr)`, rayon `12px`, bordure `1.5px` ;
sélectionnée : fond `#F7FCFA`, bordure `#18A875`, titre `#0F7A55` + `check` vert) :
*Directe*, *Chaleureuse* (sélectionnée par défaut), *Premium*.
Puis l'éditeur, bordé rayon `12px` : barre de variables (`{{prenom}}`, `{{client}}`,
`{{date}}` en badges violets) + compteur « 428 / 1 024 caractères » aligné à droite ;
textarea `min-height:148px`, 13,5px, `line-height:1.6` ; pied sur `#FBFCFE` avec icône `shield`
verte — « Mention ajoutée automatiquement et non supprimable : **« Répondez STOP pour ne plus
recevoir nos messages. »** »

Contenu par défaut du message : « Bonjour {{prenom}} 👋 Le Balafon vous invite à son brunch de la
Teranga, dimanche 20 septembre de 11h à 16h. Buffet sénégalais à volonté, 12 000 FCFA par
personne, enfants -50 %. Réservez votre table : lebalafon.sn/brunch »

Règles : la mention STOP est obligatoire et non supprimable ; un avertissement s'affiche si le
texte est trop long ; si la clé du générateur est absente ou l'appel échoue, basculer
automatiquement sur les gabarits internes.

**Étape 4 — Visuel.** Trois champs (Format accepté : JPG, PNG, WebP · Recadrage : 1:1 —
1080 × 1080 · Poids final : 186 Ko (WebP)) puis une zone de dépôt
`1.5px dashed #D6DCEC` rayon `12px`, `padding:22px`, centrée : carré vert `38px` avec `image`,
« Glissez le visuel ici », « JPG, PNG ou WebP — conversion WebP et compression automatiques. »,
et l'état rempli en 12px/600 `#0F7A55` : « brunch-teranga.jpg · 2,4 Mo → 186 Ko en WebP ».
Survol : bordure `#18A875`, fond `#FBFDFC`.

**Étape 5 — Programmation.** Intro : « Le rappel ne cible jamais les personnes ayant répondu,
réservé ou envoyé STOP. » Champs : Envoi (Programmé — 18 sept. à 10:00), Fuseau horaire
(GMT (Dakar)), Rappel (Activé, +48 h), Message du rappel (Variante courte du message principal),
Exclusions du rappel (Répondants, réservations, désinscrits), Volume estimé (1 248 puis ~980 au
rappel).

**Étape 6 — Vérification.** Six blocs de récapitulatif (`#F6F7FB`, rayon `11px`) :
CLIENT `Le Balafon` · MODE (coloré selon Démo/Réel) · DESTINATAIRES `1 248` · EXCLUS `220` ·
ENVOI `18 sept. 10:00 GMT` · RAPPEL `+48 h, sans les répondants`.
Puis une alerte orange : « 12 contacts désinscrits ont été automatiquement exclus. 147 contacts
sans consentement tracé ne sont pas ciblés. »
Puis **« Programmer la campagne »** (vert, `padding:12px 18px`, icône `check`) qui ouvre la
modale de confirmation, et « Revenir à la programmation » (bordé) qui ramène à l'étape 5.

**Aperçu du message** (colonne de droite, sticky). En-tête : « Aperçu du message » + badge
« Simulation » + note « Rendu approximatif, mis à jour en direct. »
Simulateur : cadre `border:8px solid #14213D`, rayon `22px`, fond `#ECE5DD`, `max-width:300px`.
Barre de contact `#14213D` : avatar `28px` aux couleurs du client + nom 12,5px/600 blanc +
« compte professionnel » 10,5px `#9AA7C4`. Bulle blanche rayon `12px`,
`box-shadow:0 1px 1px rgba(0,0,0,.12)` : placeholder d'image (rayures SVG 45°, `#EEF1F7` +
`#C9D2E3`, `height:96px`) avec légende monospace 9,5px « visuel du brunch · 1080×1080 » ;
texte du message 12px `line-height:1.5` `#111B21` avec la variable résolue surlignée
(fond `#F1EEFC`, texte `#5B3FC4`) ; lien en `#5B3FC4` ; mention STOP 10,5px `#667085` séparée
par `border-top:1px solid #F1F3F9` ; heure `10:00` + double `check` vert à droite.

Sous le simulateur, trois contrôles en vert : « Mention STOP présente », « Longueur adaptée
(428 caractères) », « Variable {{prenom}} résolue pour tous ».

Le simulateur sert uniquement à la prévisualisation ; il ne prétend pas reproduire WhatsApp.

**Modale de confirmation d'envoi** — `max-width:470px`. Son contenu dépend du mode :

| | Mode Démo | Mode Réel |
|---|---|---|
| Icône | `alert-triangle` sur `#FEF6E7`, `#B45309` | `alert-triangle` sur `#EAF7F1`, `#0F7A55` |
| Titre | « Programmer en mode Démo ? » | « Envoyer réellement à 1 248 contacts ? » |
| Corps | « Aucun message réel ne sera envoyé. La progression des statuts, les réponses et les réservations seront simulées et identifiées comme telles. » | « Les messages partiront vers de vrais numéros WhatsApp. Les contacts désinscrits seront de nouveau exclus au moment exact de l'envoi. » |
| Bouton | « Programmer la simulation » (`#14213D`) | « Confirmer l'envoi réel » (`#18A875`) |

Dans les deux cas, un récapitulatif `#F6F7FB` rappelle Client / Destinataires / Envoi, et un
bouton « Annuler » occupe le tiers gauche du pied (`flex:1` contre `flex:1.4`).

### 7. `/campagnes/[id]` — Détail d'une campagne

Fil d'Ariane « Campagnes › Brunch de la Teranga ».

**En-tête de campagne** : carré d'initiales `40px`, nom Manrope 700 17px, badge de statut
(« En cours »), badge de mode, puis méta 12,5px `#667085` — « Le Balafon · promotion · envoyée
le 18 sept. à 10:00 · rappel programmé le 20 sept. à 10:00 ». À droite : « Suspendre le rappel »
et « Archiver » (boutons bordés).

**Tunnel de performance** : six colonnes (`flex:1 1 0`, `min-width:112px`) dans un conteneur
`overflow-x:auto`. Chaque colonne : barre haute rayon `10px 10px 0 0`, puis valeur Manrope 800
19px, libellé 12px `#667085`, pourcentage 11,5px `#98A2B3`.

| Étape | Valeur | % | Hauteur | Couleur |
|---|---|---|---|---|
| Destinataires | 1 248 | 100 % | 92px | `#14213D` |
| Envoyés | 1 248 | 100 % | 92px | `#1E3157` |
| Livrés | 1 214 | 97,3 % | 84px | `#2C4270` |
| Lus | 1 016 | 81,4 % | 68px | `#18A875` |
| Réponses | 229 | 18,4 % | 34px | `#7357D9` |
| Réservations | 86 | 6,9 % | 20px | `#5B3FC4` |

**Onglets** : conteneur `#EDEFF6` rayon `11px` `padding:4px` ; onglet actif fond blanc + ombre,
texte `#172033` ; inactif `#667085`. Cinq onglets : Vue d'ensemble, Envois, **Réponses**
(actif par défaut), Réservations, Statistiques.

**Onglet Réponses** — grille `1.6fr 1fr`.

Colonne gauche, carte « Réponses reçues » + badge orange « 23 à traiter » + filtre
« Toutes catégories ». Chaque réponse : avatar `34px`, nom 13,5px/600, badge de catégorie,
horodatage 11,5px `#98A2B3` aligné à droite, texte 13px `#344054` `line-height:1.55`, puis les
actions en boutons 12px/600.

| Contact | Catégorie | Reçu | Message | Actions |
|---|---|---|---|---|
| Awa Ba · +221 77 812 44 09 | STOP | il y a 12 min | « STOP » | « Désinscription appliquée » (rouge, non actionnable) · « Voir l'historique » |
| Fatou Ndiaye | Réservation | il y a 28 min | « Bonjour, une table pour 4 personnes samedi vers 20h, c'est possible ? » | « Créer la réservation » (vert) · « Répondre » · « Reclasser » |
| Mariama Sow | Question prix | il y a 41 min | « Le brunch est à combien par personne ? Et pour les enfants ? » | « Répondre » (nuit) · « Marquer comme traitée » |
| Ibrahima Fall | Intéressé | il y a 1 h | « Ça m'intéresse, je vous confirme demain. » | « Marquer comme traitée » · « Relancer » |
| Moussa Diallo | Question horaire | il y a 2 h | « Jusqu'à quelle heure on peut arriver ? » | « Répondre » (nuit) · « Marquer comme traitée » |

La ligne STOP a un fond `#FFFBFB` qui la distingue.

Colonne droite : carte d'alerte bordée `#F4C7CB` — « 3 désinscriptions STOP » / « Traitées avant
toute classification. Les rappels correspondants sont annulés, ces contacts ne recevront plus
aucune campagne. » ; puis « Réservations générées » : Fatou Ndiaye · Sam. 20 sept. 20:00 ·
4 personnes · **À confirmer** ; Cheikh Gueye · Dim. 21 sept. 12:30 · 2 personnes ·
**Confirmée** ; Adja Thiam · Dim. 21 sept. 13:00 · 6 personnes · **Confirmée** ; et un total
« Valeur estimée — 612 000 FCFA ».

**Autres onglets** : carte unique avec titre, quatre blocs de statistiques (`#F6F7FB`, rayon
`12px`, valeur Manrope 800 22px) et une note en pied.

| Onglet | Statistiques | Note |
|---|---|---|
| Vue d'ensemble | Message principal 428 car. (mention STOP incluse) · Visuel 186 Ko (WebP 1080 × 1080) · Rappel +48 h (20 sept. 10:00) · Incidents 0 (aucun rejet Meta) | « Le message principal a été validé manuellement avant envoi. Aucun incident bloquant signalé par Meta. » |
| Envois | Envoyés 1 248 (100 %) · Livrés 1 214 (97,3 %) · Lus 1 016 (81,4 %) · Échecs 34 (numéros hors service) | « Chaque envoi conserve l'identifiant de message Meta. Les statuts sont mis à jour par webhook. » |
| Réservations | Total 86 · Confirmées 61 (71 %) · À confirmer 19 (action requise) · Valeur estimée 612 k FCFA | « Une réservation peut être créée directement depuis une réponse reçue. » |
| Statistiques | Livraison 97,3 % (+0,4 pt) · Lecture 81,4 % (+3,1 pts) · Réponse 18,4 % (+2,2 pts) · Désinscriptions 0,24 % (-0,1 pt) | « Comparaison avec la moyenne des campagnes du même client sur les 90 derniers jours. » |

Catégories de réponses à gérer : Intéressé, Réservation, Question prix, Question lieu,
Question horaire, Demande d'information, Réclamation, STOP, Autre. Chaque réponse peut être lue,
classée automatiquement, corrigée manuellement, marquée comme traitée, associée à une
réservation, ou recevoir une réponse de l'administrateur.

Statuts de réservation : À confirmer, Confirmée, Honorée, Annulée, Absente.

### 8. `/parametres` — Paramètres

Sous-titre : « Configuration globale de l'agence ».
Deux colonnes `repeat(auto-fit, minmax(360px, 1fr))`.

**Mode Démo** — carte avec icône orange, titre, et un switch à droite : piste `46px × 26px`
rayon `14px`, `padding:3px`, pastille blanche `20px` avec ombre ; `justify-content:flex-end` et
fond `#F59E0B` quand le mode Démo est actif, `flex-start` et `#18A875` sinon.
Texte : « Toute l'application fonctionne sans clé Claude ni configuration Meta. Les envois,
réponses, réservations et statistiques sont simulés et identifiés comme tels en base. Aucun appel
n'est émis vers Meta. »
Bloc « PASSAGE EN MODE RÉEL » (`#F6F7FB`) avec trois prérequis, cochés ou non :
Configuration Meta complète (✓ vert), Test de connexion réussi — requis (✗ gris),
Confirmation explicite de l'administrateur (✗ gris).

**Connexions** — trois lignes séparées par `#F1F3F9` : nom 13,5px/600, clé masquée en monospace
12px, date du dernier test 11,5px `#98A2B3`, badge de statut avec point, bouton « Tester ».

| Service | Valeur affichée | Dernier test | Statut |
|---|---|---|---|
| Claude API | `sk-ant-•••••••••••••••••4f2a` | 14 sept. 08:45 | Connecté (vert) |
| WhatsApp Business Cloud | `Phone Number ID 1029•••••41 · token •••••` | 12 sept. 16:02 | Test réussi (vert) |
| Webhook Verify Token | `Non renseigné` | Aucun test effectué | Non configuré (orange) |

Pied de carte, en 12,5px `#667085` avec icône `shield` verte : « Les clés sont conservées côté
serveur et ne sont jamais renvoyées au navigateur. »

**Profil administrateur** — avatar `44px` `#7357D9` « AM », nom « Aïssatou Mbaye »,
« aissatou@agence-teranga.sn · compte unique », puis trois lignes :
Dernière connexion « 14 sept. 08:42 · Dakar » · Double authentification « Activée » (vert) ·
Journal d'audit « Consulter » (violet, cliquable).

**RGPD** — icône `shield` sur carré vert, quatre engagements cochés :
« Aucun contact importé sans source ni date de consentement. » ·
« Désinscription appliquée immédiatement, avant toute classification. » ·
« Suppression = anonymisation. Une trace non identifiante évite la réimportation. » ·
« Cloisonnement strict des données entre clients. »
Deux boutons bordés : « Exporter le registre », « Politique de conservation ».

**Webhooks** — label « URL DE RÉCEPTION » puis l'URL en monospace 12px dans un bloc `#F6F7FB`
avec icône `copy` : `https://sigi.agence-teranga.sn/api/whatsapp/webhook`.
En dessous, icône `clock` + « Aucun événement reçu — vérification en attente côté Meta. »

Sections attendues au-delà de la maquette : Notifications, Sécurité. États à couvrir pour
chaque intégration : Connecté, Non configuré, Test réussi, Erreur, Mode simulation.

---

## Interactions et comportements

Implémentés dans le prototype :

- **Navigation** — sidebar, fil d'Ariane, lignes de tableau cliquables, cartes KPI « Réponses à
  traiter » et « Campagnes récentes » vers le détail, bouton de profil vers la déconnexion.
- **Réduction de la sidebar** — le bouton « Réduire » passe la largeur de `246px` à `74px` et
  masque tous les libellés.
- **Sélecteur de client** — cycle sur `Tous les clients → Le Balafon → Studio Néré → Boutique
  Kora → Association Teranga`. En production : menu déroulant avec recherche.
- **Bascule Démo / Réel** — commutable depuis la pastille de la barre supérieure comme depuis le
  switch des paramètres. Elle modifie : le bandeau permanent, le badge de sidebar, le libellé du
  bloc MODE de l'étape 6, et l'intégralité de la modale de confirmation (titre, corps, couleur et
  libellé du bouton).
- **Assistant** — clic direct sur une pastille d'étape, ou « Précédent » / « Continuer » ;
  la barre de progression suit. Les variantes de message sont sélectionnables.
- **Onglets du détail** — changent le contenu de la zone inférieure.
- **Modales** — import CSV (depuis l'action principale de `/contacts`) et confirmation d'envoi
  (depuis l'étape 6). Fermeture par la croix, « Annuler », ou le bouton de validation.
- **Affichage / masquage du mot de passe** sur `/login`.
- **Survols** — lignes de tableau `#FBFCFE`, cartes clients ombre portée, boutons bordés bordure
  `#C7CEE0`, boutons pleins teinte plus foncée, items de nav `rgba(255,255,255,.09)`.

À implémenter côté application (documenté ici, non simulé) :

- États de chargement et squelettes pour chaque tableau et chaque carte de statistiques.
- États vides : aucun client, aucun contact, aucune campagne, aucune réponse, aucun résultat de
  recherche, API non configurée.
- États d'erreur : échec de chargement, échec d'appel Meta, import CSV invalide.
- Validation de formulaire (Zod + React Hook Form) sur le client, le contact, chaque étape de
  l'assistant.
- Actions interdites : ajout d'un contact sans consentement, envoi réel sans test de connexion
  réussi, envoi à un contact désinscrit.
- Responsive mobile — **non dessiné dans cette maquette**. Attendu : sidebar remplacée par un
  menu compact, tableaux transformés en cartes, formulaires sur une colonne, actions principales
  accessibles au pouce, cibles tactiles de 44px minimum.

Microtextes à reprendre tels quels : « Créer une campagne », « Importer des contacts »,
« Générer trois propositions », « Vérifier avant l'envoi », « Aucun message réel ne sera
envoyé », « 12 contacts désinscrits ont été automatiquement exclus », « Ce contact a répondu STOP
et ne peut plus recevoir de campagne », « Votre campagne est programmée », « Cette suppression
anonymisera les données personnelles ».

## Règles métier non négociables

Ces règles ne sont pas des choix de design : elles conditionnent la crédibilité de l'outil et sa
conformité.

1. **STOP est prioritaire.** La détection (`STOP`, `Stop`, `stop`, `Arrêtez`, `Désinscrire`,
   `Ne plus recevoir`, `Terminer`) s'exécute **avant** toute classification automatique.
   Elle déclenche : désinscription immédiate, blocage de tout envoi futur, annulation des rappels
   programmés, enregistrement de la date et de la source, alerte dans l'interface. Aucune
   classification automatique ne peut annuler cette décision.
2. **Exclusion au moment de l'envoi.** Les contacts désinscrits sont exclus à l'instant réel de
   l'envoi, même s'ils étaient éligibles à la création de la campagne. Cas de test obligatoire :
   un contact reçoit le message principal, répond STOP avant le rappel, et ne doit jamais
   recevoir le rappel.
3. **Cloisonnement strict par client.** Contacts, catégories, campagnes, identifiants Meta,
   réponses, réservations, statistiques et historique de consentement d'un client ne doivent
   jamais être accessibles depuis un autre. Cas de test obligatoire : une campagne du client A ne
   doit jamais utiliser les contacts, les identifiants ou les statistiques du client B.
4. **Pas de contact sans consentement tracé** — source et date obligatoires à l'import comme à
   la saisie manuelle.
5. **Jamais de faux succès en mode Réel.** Et en mode Démo, aucun appel vers Meta.
6. **Secrets côté serveur uniquement** — jamais exposés au navigateur, aux logs ni aux réponses
   d'API ; toujours masqués dans l'interface.
7. **Suppression = anonymisation.** Conserver les statistiques indispensables et une trace non
   directement identifiable de la désinscription, pour éviter une réimportation accidentelle.
8. **API WhatsApp Business Cloud officielle exclusivement.** Pas d'automatisation WhatsApp Web,
   pas de scraping, aucune bibliothèque non officielle.

## État à gérer

État d'interface visible dans le prototype :

| Variable | Valeurs | Déclencheurs |
|---|---|---|
| `route` | login, dashboard, clients, contacts, campagnes, nouvelle, detail, parametres | navigation, connexion, déconnexion |
| `clientActif` | identifiant de client, ou « tous » | sélecteur de la barre supérieure |
| `modeDemo` | booléen | pastille de la barre supérieure, switch des paramètres |
| `sidebarReduite` | booléen | bouton « Réduire » (à persister) |
| `etapeAssistant` | 1 à 6 | pastilles, Précédent, Continuer |
| `variantePicked` | 1 à 3 | cartes de variantes |
| `ongletDetail` | overview, envois, reponses, reservations, stats | onglets |
| `modale` | null, csv, confirmation | actions principales, étape 6 |
| `motDePasseVisible` | booléen | bouton œil |

Côté données, le modèle attendu couvre au minimum : `admin_users`, `clients`,
`client_integrations`, `contacts`, `contact_categories`, `contact_category_links`,
`consent_records`, `campaigns`, `campaign_audiences`, `campaign_messages`,
`campaign_recipients`, `outbound_messages`, `inbound_messages`, `conversations`, `reservations`,
`unsubscribe_records`, `webhook_events`, `audit_logs`, `app_settings`.
Chaque table métier : `id` UUID, `client_id` quand pertinent, `created_at`, `updated_at`,
`created_by` quand pertinent. Prévoir index, clés étrangères, contraintes, unicité du numéro par
client, Row Level Security et migrations reproductibles.

## Assets

Aucun asset binaire. Tout est vectoriel ou typographique :

- **Icônes** — 28 symboles SVG inline dans `Sigi.dc.html`, dessinés au trait de Lucide
  (`stroke-width` 1,9 à 2,2, bouts et jointures arrondis, `fill:none`). Équivalents
  `lucide-react` : `layout-grid`, `users`, `contact`, `megaphone`, `sliders-horizontal`, `bell`,
  `plus`, `search`, `filter`, `check`, `alert-triangle`, `x`, `upload`, `download`, `calendar`,
  `message-square`, `image`, `clock`, `shield`, `sparkles`, `panel-left`, `more-horizontal`,
  `trending-up`, `chevron-down`, `chevron-right`, `ban`, `eye`, `pencil`, `archive`, `zap`,
  `copy`, `log-out`.
- **Logo Sigi** — `sigi-logo.jpg` (fourni dans ce bundle). Marque en deux parties : un pictogramme
  « S » composé d'une boucle verte et d'une bulle de conversation bleu nuit, suivi du mot-symbole
  « Sigi » en bleu nuit dont les deux points du `i` sont orange.
  Couleurs de la marque : vert `#157A5F`, bleu nuit `#233657`, orange `#F4511E`, fond crème `#FAF7F1`.
  Elles sont compatibles avec la palette de l'application ; l'orange de la marque reste un accent
  d'identité et ne doit pas être confondu avec l'orange d'attention `#F59E0B` de l'interface.
  **Le fichier livré est un JPG à fond crème** : il n'a pas de canal alpha (le fichier « sans fond »
  fourni porte un damier peint dans l'image, ce n'est pas de la transparence). Demander à l'agence
  un SVG ou un PNG réellement transparent avant l'intégration.
  Usages dans la maquette : sur `/login`, le logo complet à `height:62px` sur fond blanc
  (avec `mix-blend-mode:multiply` pour neutraliser le fond crème du JPG) ; dans la sidebar bleu
  nuit, seul le pictogramme, recadré dans une tuile de `34px` rayon `9px` sur fond `#FAF7F1`
  (recadrage CSS : image `86 × 86px` en `position:absolute; left:-2px; top:-26px` dans un conteneur
  `overflow:hidden`). Avec un SVG, remplacer ces recadrages par le pictogramme seul, et poser le
  pictogramme directement sur le bleu nuit sans tuile crème.
- **Illustration de connexion** — motif de rayures SVG généré en `<pattern>`, pas d'image.
- **Placeholder de visuel** dans le simulateur — rayures SVG à 45° avec légende monospace.
  À remplacer par l'upload réel de la campagne.
- **Polices** — Manrope (600/700/800) et Inter (400/500/600/700), Google Fonts.

## Fichiers

- `Sigi.dc.html` — le prototype complet : les huit écrans, les deux modales, les états
  interactifs. S'ouvre directement dans un navigateur.
- `support.js` — runtime nécessaire à l'ouverture du prototype. Aucune valeur pour la
  production.
- `sigi-logo.jpg` — le logo fourni par l'agence, tel qu'utilisé dans le prototype.

Les données de démonstration (clients, contacts, campagnes, réponses, réservations, intégrations)
sont déclarées en tête du bloc de logique de `Sigi.dc.html` : elles donnent la forme et la
densité attendues de chaque jeu de données.
