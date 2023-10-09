const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

function getCompte(res) {
	db.all("SELECT * FROM COMPTE", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function getDate(res) {
	db.all("SELECT DISTINCT date FROM 'TRANSACTION';", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function getCategories(res) {
	db.all("SELECT * FROM 'CATEGORIE';", (err, data) => {
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

module.exports = {
	getCategories,
	addCategorie,
};
