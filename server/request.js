const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

function getCategories(res) {
	db.all("SELECT * FROM CATEGORIE;", (err, data) => {
		if (err) res.status(500).json(err);

		let categories = {};
		data.forEach((row) => {
			if (row.parent_id == null) {
				categories[row.id] = {};
				categories[row.id].nom = row.nom;
				categories[row.id].child = [];
			}
		});
		data.forEach((row) => {
			if (row.parent_id != null) {
				categories[row.parent_id].child.push(row);
			}
		});

		res.status(200).json(categories);
	});
}

function addCategorie(name, parent, res) {
	db.run(
		"INSERT INTO CATEGORIE (nom, parent_id) VALUES ($name, $parent);",
		{
			$name: name,
			$parent: parent,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function getCompte(res) {
	db.all("SELECT * FROM COMPTE", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function addCompte(name, desc, res) {
	db.run(
		"INSERT INTO COMPTE (nom, description) VALUES ($name, $desc);",
		{
			$name: name,
			$desc: desc,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function getEpargne(res) {
	db.all("SELECT * FROM EPARGNE", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function addEpargne(name, desc, res) {
	db.run(
		"INSERT INTO EPARGNE (nom, description) VALUES ($name, $desc);",
		{
			$name: name,
			$desc: desc,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function addTransaction(montant, date, cat, res) {
	db.run(
		"INSERT INTO 'TRANSACTION' (montant, date, categorie_id) VALUES ($montant, $date, $categorie);",
		{
			$montant: montant,
			$date: date,
			$categorie: cat,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function addEtatCompte(montant, date, compte, res) {
	db.run(
		"INSERT INTO 'TRANSACTION' (montant, date, compte_id) VALUES ($montant, $date, $compte);",
		{
			$montant: montant,
			$date: date,
			$compte: compte,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function addInvesstissement(epargne, valeur, date, invest, res) {
	db.run(
		"INSERT INTO 'TRANSACTION' (montant, date) VALUES ($montant, $date);",
		{
			$montant: valeur,
			$date: date,
		},
		function (err) {
			if (err) res.status(500).json(err);

			db.run(
				"INSERT INTO 'INVESTISSEMENT' (transaction_id, epargne_id, investi) VALUES ($transaction, $epargne, $investi);",
				{
					$transaction: this.lastID,
					$epargne: epargne,
					$investi: invest,
				},
				(err) => {
					if (err) res.status(500).json(err);

					res.redirect("/add-data");
				}
			);
		}
	);
}

// addInvesstissement(1, 200, "01-2023");

function getDate(res) {
	db.all("SELECT DISTINCT date FROM 'TRANSACTION';", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

module.exports = {
	getCategories,
	addCategorie,
	getCompte,
	addCompte,
	getEpargne,
	addEpargne,
	addTransaction,
	addEtatCompte,
	addInvesstissement,
	getDate,
};
