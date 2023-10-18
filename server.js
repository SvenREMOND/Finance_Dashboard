const express = require("express");
const app = express();
const useragent = require("express-useragent");
const bodyParser = require("body-parser");
const {
	getTransactionCategories,
	addTransactionCategorie,
	addCompte,
	getDate,
	getEvolDepenseRevenuEtat,
	getPatrimoine,
	getRevenuMoy,
	getDepenseMoy,
	addCompteCategorie,
	getCompteCategories,
} = require("./server/request");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

// Création de la BDD si inexistante
db.serialize(() => {
	db.run(
		`
        CREATE TABLE
            IF NOT EXISTS "TRANSACTION_CATEGORIE" (
                "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "nom" TEXT NOT NULL,
                "parent_id" INTEGER,
                FOREIGN KEY ("parent_id") REFERENCES "CATEGORIE" ("id")
            );
        `
	);

	db.run(
		`
        CREATE TABLE
            IF NOT EXISTS "COMPTE_CATEGORIE" (
                "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "nom" TEXT NOT NULL
            );
            `
	);

	db.run(
		`
        CREATE TABLE
            IF NOT EXISTS "COMPTE" ( -- Compte (courrants, coffres, pocket) + Epargne (livrets, ETFs, actions) 
                "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "nom" TEXT NOT NULL,
                "categorie_id" INTEGER NOT NULL,
                FOREIGN KEY ("categorie_id") REFERENCES "COMPTE_CATEGORIE" ("id")
            );
            `
	);

	db.run(
		`
        CREATE TABLE
            IF NOT EXISTS "TRANSACTION" ( -- Dépenses, Revenus, État
                "id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "montant" INTEGER NOT NULL,
                "date" TEXT NOT NULL,
                "categorie_id" INTEGER NOT NULL,
                "compte_id" INTEGER,
                "investissement" INTEGER,
                FOREIGN KEY ("categorie_id") REFERENCES "TRANSACTION_CATEGORIE" ("id"),
                FOREIGN KEY ("compte_id") REFERENCES "COMPTE" ("id")
            );
        `
	);
});
db.close();

// Définition du dossier des assets (css, js, img ...)
app.use(express.static("public"));

// Mise en place de la récupération des data POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Fonction renvoyant l'html au serveur
 *
 * @param {Response} res http res object
 * @param {String} page page demandé
 */
function sendFile(res, page) {
	res.sendFile(page + ".html", { root: __dirname + "/pages/" }, function (err) {
		if (err) {
			console.log(err);
		}
	});
}

// Pages de l'appli
app.get("/", (req, res) => {
	var ua = useragent.parse(req.headers["user-agent"]);
	if (ua.isMobile) res.redirect("/add-data");

	sendFile(res, "index");
});

app.get("/add-data", (req, res) => {
	sendFile(res, "forms");
});

// URLs de récupération des données
app.get("/get-dates", (req, res) => {
	getDate(res);
});

app.get("/get-transaction-categories", (req, res) => {
	getTransactionCategories(res);
});

app.get("/get-compte-categories", (req, res) => {
	getCompteCategories(res);
});

// Donnée des kpi
app.get("/data/kpi/patrimoine", (req, res) => {
	let data = req.query;
	getPatrimoine(data.startDate, data.endDate, res);
});

app.get("/data/kpi/revenu-moyen", (req, res) => {
	let data = req.query;
	getRevenuMoy(data.startDate, data.endDate, res);
});

app.get("/data/kpi/depense-moyen", (req, res) => {
	let data = req.query;
	getDepenseMoy(data.startDate, data.endDate, res);
});

// Donnée des graphs
app.get("/data/graph/evol-depense-revenu-etat", (req, res) => {
	let data = req.query;
	getEvolDepenseRevenuEtat(data.startDate, data.endDate, res);
});

// URLs d'ajout de données
app.post("/add-transaction", (req, res) => {
	let data = req.body;

	// TODO : Formulaire complet (ajout des champs au formulaire + ajout dans BDD)
});

app.post("/add-account", (req, res) => {
	let data = req.body;
	let name = data.add_nom;
	let cat = data.categorie;
	addCompte(name, cat, res);

	res.status(500);
});

app.post("/add-transaction-categorie", (req, res) => {
	let data = req.body;
	let name = data.categorie_nom;
	let parent = data.categorie_parent == "" ? null : data.categorie_parent;
	addTransactionCategorie(name, parent, res);
});

app.post("/add-compte-categorie", (req, res) => {
	let data = req.body;
	let name = data.categorie_nom;
	addCompteCategorie(name, res);
});

// Lancement du serveur
app.listen(3000, () => {
	// console.log(`Example app listening on port ${port}`);
});
