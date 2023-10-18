CREATE TABLE
    IF NOT EXISTS "TRANSACTION_CATEGORIE" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "nom" TEXT NOT NULL,
        "parent_id" INTEGER,
        FOREIGN KEY ("parent_id") REFERENCES "CATEGORIE" ("id")
    );

CREATE TABLE
    IF NOT EXISTS "COMPTE_CATEGORIE" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "nom" TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS "COMPTE" ( -- Compte (courrants, coffres, pocket) + Epargne (livrets, ETFs, actions) 
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "nom" TEXT NOT NULL,
        "categorie_id" INTEGER NOT NULL,
        FOREIGN KEY ("categorie_id") REFERENCES "COMPTE_CATEGORIE" ("id")
    );

CREATE TABLE
    IF NOT EXISTS "TRANSACTION" ( -- Dépenses, Revenus, État
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "montant" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "categorie_id" INTEGER NOT NULL,
        "compte_id" INTEGER,
        "investissement" INTEGER,
        FOREIGN KEY ("categorie_id") REFERENCES "TRANSACTION_CATEGORIE" ("id"),
        FOREIGN KEY ("compte_id") REFERENCES "COMPTE" ("id")
    );