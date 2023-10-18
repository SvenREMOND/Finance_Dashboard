const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

function getTransactionCategories(res) {
	db.all("SELECT * FROM TRANSACTION_CATEGORIE;", (err, data) => {
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

function getCompteCategories(res) {
	db.all("SELECT * FROM COMPTE_CATEGORIE;", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function addTransactionCategorie(name, parent, res) {
	db.run(
		"INSERT INTO TRANSACTION_CATEGORIE (nom, parent_id) VALUES ($name, $parent);",
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

function addCompteCategorie(name, res) {
	db.run(
		"INSERT INTO COMPTE_CATEGORIE (nom) VALUES ($name);",
		{
			$name: name,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function addCompte(name, cat, res) {
	db.run(
		"INSERT INTO COMPTE (nom, categorie_id) VALUES ($name, $cat);",
		{
			$name: name,
			$cat: cat,
		},
		(err) => {
			if (err) res.status(500).json(err);

			res.redirect("/add-data");
		}
	);
}

function getDate(res) {
	db.all("SELECT DISTINCT date FROM 'TRANSACTION';", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function getEvolDepenseRevenuEtat(startDate, endDate, res) {
	db.all(
		"SELECT T.date, T.montant, CAT.nom AS `categorie` FROM `TRANSACTION` T INNER JOIN `TRANSACTION_CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `TRANSACTION_CATEGORIE` CAT ON C.parent_id = CAT.id WHERE (strftime ('%s', T.date) BETWEEN strftime ('%s', '" +
			startDate +
			"') AND strftime  ('%s', '" +
			endDate +
			"')) AND C.nom != 'Epargne' ORDER BY T.date ASC;",
		(err, data) => {
			if (err) res.status(500).json(err);
			let result = {};

			let dates = data.map((val) => {
				let date = new Date(Date.UTC(val.date.split("-")[0], parseInt(val.date.split("-")[1], 10) - 1));
				return new Intl.DateTimeFormat("fr-FR", {
					year: "numeric",
					month: "short",
				}).format(date);
			});
			dates = dates.filter(onlyUnique);
			result.labels = dates;

			let datasets = [];
			let depense = {};
			depense.label = "Dépense";
			depense.type = "bar";
			depense.data = [];
			data.forEach((row) => {
				if (row.categorie == depense.label) depense.data.push(row.montant);
			});
			datasets.push(depense);

			let revenue = {};
			revenue.label = "Revenu";
			revenue.type = "bar";
			revenue.data = [];
			data.forEach((row) => {
				if (row.categorie == revenue.label) revenue.data.push(row.montant);
			});
			datasets.push(revenue);

			let etat = {};
			etat.label = "Etat";
			etat.type = "line";
			etat.data = [];
			data.forEach((row) => {
				if (row.categorie == etat.label) etat.data.push(row.montant);
			});
			datasets.push(etat);

			result.datasets = datasets;

			res.status(200).json(result);
		}
	);
}

function getPatrimoine(startDate, endDate, res) {
	db.all(
		"SELECT SUM(T.montant) AS 'patrimoine' FROM `TRANSACTION` T INNER JOIN `TRANSACTION_CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `TRANSACTION_CATEGORIE` CAT ON C.parent_id = CAT.id WHERE strftime ('%s', T.date) == strftime ('%s', '" +
			endDate +
			"') AND CAT.id == 3;",
		(err, data) => {
			if (err) res.status(500).json(err);

			res.status(200).json(data[0].patrimoine);
		}
	);
}

function getRevenuMoy(startDate, endDate, res) {
	db.all(
		"SELECT AVG(T.montant) AS 'revenu' FROM `TRANSACTION` T INNER JOIN `TRANSACTION_CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `TRANSACTION_CATEGORIE` CAT ON C.parent_id = CAT.id WHERE (strftime ('%s', T.date) BETWEEN strftime ('%s', '" +
			startDate +
			"') AND strftime ('%s', '" +
			endDate +
			"')) AND CAT.id == 1;",
		(err, data) => {
			if (err) res.status(500).json(err);

			res.status(200).json(data[0].revenu);
		}
	);
}

function getDepenseMoy(startDate, endDate, res) {
	db.all(
		"SELECT AVG(T.montant) AS 'depense' FROM `TRANSACTION` T INNER JOIN `TRANSACTION_CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `TRANSACTION_CATEGORIE` CAT ON C.parent_id = CAT.id WHERE (strftime ('%s', T.date) BETWEEN strftime ('%s', '" +
			startDate +
			"') AND strftime ('%s', '" +
			endDate +
			"')) AND CAT.id == 2;",
		(err, data) => {
			if (err) res.status(500).json(err);

			res.status(200).json(data[0].depense);
		}
	);
}

module.exports = {
	getTransactionCategories,
	getCompteCategories,
	addTransactionCategorie,
	addCompteCategorie,
	addCompte,
	getDate,
	getEvolDepenseRevenuEtat,
	getPatrimoine,
	getRevenuMoy,
	getDepenseMoy,
};

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
}
