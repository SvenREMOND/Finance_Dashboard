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

module.exports = {
	getCompte,
};
