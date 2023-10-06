const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

db.serialize(() => {
	db.run(
		'CREATE TABLE IF NOT EXISTS "CATEGORIE" ("id" VARCHAR(42), "nom" VARCHAR(42), "parent_id" VARCHAR(42), PRIMARY KEY ("id"), FOREIGN KEY ("parent_id") REFERENCES "CATEGORIE" ("id"));'
	);
	db.run(
		'CREATE TABLE IF NOT EXISTS "COMPTE" ("id" VARCHAR(42), "nom" VARCHAR(42), "montant" VARCHAR(42), "date" VARCHAR(42), PRIMARY KEY ("id") );'
	);
	db.run(
		'CREATE TABLE IF NOT EXISTS "INVESTISSEMENT" ("id" VARCHAR(42), "nom" VARCHAR(42), "valeur" VARCHAR(42), "investi" VARCHAR(42), "date" VARCHAR(42), PRIMARY KEY ("id") ); '
	);
	db.run(
		'CREATE TABLE IF NOT EXISTS "TRANSACTION" ("id" VARCHAR(42), "montant" VARCHAR(42), "date" VARCHAR(42), "categorie_id" VARCHAR(42), PRIMARY KEY ("id"), FOREIGN KEY ("categorie_id") REFERENCES "CATEGORIE" ("id"));'
	);
});

db.close();

const server = http.createServer((req, res) => {
	// console.log(req);

	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
	res.end("Hello World");
});
server.listen(3000);
