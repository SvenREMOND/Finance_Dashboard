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
			$date: date + "-01",
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
			$date: date + "-01",
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
			$date: date + "-01",
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

function getDate(res) {
	db.all("SELECT DISTINCT date FROM 'TRANSACTION';", (err, data) => {
		if (err) res.status(500).json(err);

		res.status(200).json(data);
	});
}

function getGraph1(startDate, endDate, res) {
	db.all(
		"SELECT T.date, T.montant, CAT.nom AS `categorie` FROM `TRANSACTION` T INNER JOIN `CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `CATEGORIE` CAT ON C.parent_id = CAT.id WHERE strftime ('%s', T.date) BETWEEN strftime ('%s', '" +
			startDate +
			"') AND strftime  ('%s', '" +
			endDate +
			"') AND C.nom != 'Epargne' ORDER BY T.date ASC;",
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
		"SELECT SUM(T.montant) AS 'patrimoine' FROM `TRANSACTION` T INNER JOIN `CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `CATEGORIE` CAT ON C.parent_id = CAT.id WHERE strftime ('%s', T.date) == strftime ('%s', '" +
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
		"SELECT AVG(T.montant) AS 'revenu' FROM `TRANSACTION` T INNER JOIN `CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `CATEGORIE` CAT ON C.parent_id = CAT.id WHERE (strftime ('%s', T.date) BETWEEN strftime ('%s', '" +
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
		"SELECT AVG(T.montant) AS 'depense' FROM `TRANSACTION` T INNER JOIN `CATEGORIE` C ON T.categorie_id = C.id INNER JOIN `CATEGORIE` CAT ON C.parent_id = CAT.id WHERE (strftime ('%s', T.date) BETWEEN strftime ('%s', '" +
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
	getGraph1,
	getPatrimoine,
	getRevenuMoy,
	getDepenseMoy,
};

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
}
