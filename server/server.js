const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("server/finance.sqlite");

const server = http.createServer((req, res) => {
	// console.log(req);

	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
	res.end("Hello World");
});

server.listen(3000);

// db.serialize(() => {
// 	db.run("CREATE TABLE lorem (info TEXT)");

// 	const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
// 	for (let i = 0; i < 10; i++) {
// 		stmt.run("Ipsum " + i);
// 	}
// 	stmt.finalize();

// 	db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
// 		console.log(row.id + ": " + row.info);
// 	});
// });

// db.close();
