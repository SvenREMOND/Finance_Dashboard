const express = require("express");
const app = express();
const useragent = require("express-useragent");
const { getDate } = require("./server/request");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

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

app.use(express.static("public"));

app.get("/", (req, res) => {
	var ua = useragent.parse(req.headers["user-agent"]);
	if (ua.isMobile) res.redirect("/add-data");

	sendFile(res, "index");
});

app.get("/add-data", (req, res) => {
	sendFile(res, "forms");
});

app.get("/get-dates", (req, res) => {
	res.json(getDate());
});

app.listen(3000, () => {
	// console.log(`Example app listening on port ${port}`);
});

function sendFile(res, page) {
	res.sendFile(page + ".html", { root: __dirname + "/pages/" }, function (err) {
		if (err) {
			console.log(err);
		}
	});
}
