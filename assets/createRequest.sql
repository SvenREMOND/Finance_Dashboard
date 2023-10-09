CREATE TABLE
    IF NOT EXISTS "CATEGORIE" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "nom" TEXT NOT NULL,
        "parent_id" INTEGER,
        FOREIGN KEY ("parent_id") REFERENCES "CATEGORIE" ("id")
    );

CREATE TABLE
    IF NOT EXISTS "COMPTE" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "nom" TEXT NOT NULL,
        "description" TEXT
    );

CREATE TABLE
    IF NOT EXISTS "EPARGNE" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "nom" TEXT NOT NULL,
        "description" TEXT
    );

CREATE TABLE
    IF NOT EXISTS "TRANSACTION" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "montant" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "compte_id" INTEGER,
        "categorie_id" INTEGER,
        FOREIGN KEY ("compte_id") REFERENCES "COMPTE" ("id"),
        FOREIGN KEY ("categorie_id") REFERENCES "CATEGORIE" ("id")
    );

CREATE TABLE
    IF NOT EXISTS "INVESTISSEMENT" (
        "transaction_id" INTEGER NOT NULL,
        "epargne_id" INTEGER NOT NULL,
        "investi" INTEGER,
        PRIMARY KEY ("transaction_id", "epargne_id"),
        FOREIGN KEY ("transaction_id") REFERENCES "TRANSACTION" ("id"),
        FOREIGN KEY ("epargne_id") REFERENCES "EPARGNE" ("id")
    );