const express = require("express");
const app = express();
const useragent = require("express-useragent");
const bodyParser = require("body-parser");
const { getCategories, addCategorie, getCompte, getEpargne, addCompte, addEpargne, addTransaction, addEtatCompte } = require("./server/request");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

// Création de la BDD si inexistante
db.serialize(() => {
	db.run(
		'CREATE TABLE IF NOT EXISTS "CATEGORIE" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "nom" TEXT NOT NULL, "parent_id" INT, FOREIGN KEY ("parent_id") REFERENCES "CATEGORIE" ("id"));'
	);
	db.run('CREATE TABLE IF NOT EXISTS "COMPTE" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "nom" TEXT NOT NULL, "description" TEXT);');
	db.run('CREATE TABLE IF NOT EXISTS "EPARGNE" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "nom" TEXT NOT NULL, "description" TEXT);');
	db.run(
		'CREATE TABLE IF NOT EXISTS "TRANSACTION" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "montant" INTEGER NOT NULL, "date" TEXT NOT NULL, "compte_id" INTEGER, "categorie_id" INTEGER, FOREIGN KEY ("compte_id") REFERENCES "COMPTE" ("id"), FOREIGN KEY ("categorie_id") REFERENCES "CATEGORIE" ("id"));'
	);
	db.run(
		'CREATE TABLE IF NOT EXISTS "INVESTISSEMENT" ("transaction_id" INTEGER NOT NULL, "epargne_id" INTEGER NOT NULL, "investi" INTEGER, PRIMARY KEY ("transaction_id", "epargne_id"), FOREIGN KEY ("transaction_id") REFERENCES "TRANSACTION" ("id"), FOREIGN KEY ("epargne_id") REFERENCES "EPARGNE" ("id"));'
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
app.get("/get-dates", (req, res) => {});

app.get("/get-comptes", (req, res) => {
	getCompte(res);
});

app.get("/get-epargnes", (req, res) => {
	getEpargne(res);
});

app.get("/get-categories", (req, res) => {
	getCategories(res);
});

// URLs d'ajout de données
app.post("/add-transaction", (req, res) => {
	let data = req.body;
	let categorie = data.transaction_categorie;
	let montant = data.transaction_montant;
	let date = data.transaction_date;

	addTransaction(montant, date, categorie, res);
});

app.post("/add-etat", (req, res) => {
	let data = req.body;
	let compte = data.etat_compte;
	let montant = data.etat_montant;
	let date = data.etat_date;

	addEtatCompte(montant, date, compte, res);
});

app.post("/add-account", (req, res) => {
	let data = req.body;
	let name = data.add_nom;
	let desc = data.add_description;
	if (data.add_account == "add_compte") {
		addCompte(name, desc, res);
	}
	if (data.add_account == "add_epargne") {
		addEpargne(name, desc, res);
	}

	res.status(500);
});

app.post("/add-categorie", (req, res) => {
	let data = req.body;
	let name = data.categorie_nom;
	let parent = data.categorie_parent == "" ? null : data.categorie_parent;
	addCategorie(name, parent, res);
});

// Lancement du serveur
app.listen(3000, () => {
	// console.log(`Example app listening on port ${port}`);
});
