const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

function getCompte() {
	let data = [];
	db.serialize(() => {
		db.each("SELECT * FROM COMPTE", (err, row) => {
			if (err) console.log(err);
			data.push(row);
		});
	});
	return data;
}

function getDate() {
	let data = [];
	db.serialize(() => {
		db.each("SELECT DISTINCT date FROM 'TRANSACTION';", (err, row) => {
			if (err) console.log(err);
			data.push(row);
		});
	});
	return data;
}

function addCompte(name, desc = "") {
	db.serialize(() => {
		db.run(
			"INSERT INTO COMPTE (nom, description) VALUES ($name, $desc);",
			{
				$name: name,
				$desc: desc,
			},
			(res, err) => {
				if (err) console.log(err);
			}
		);
	});
}

module.exports = {
	getCompte,
	getDate,
	addCompte,
};
