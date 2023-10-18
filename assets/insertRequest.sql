INSERT INTO
    'TRANSACTION_CATEGORIE' (nom, parent_id)
VALUES
    ("Revenu", NULL),
    ("Dépense", NULL),
    ("Etat", NULL),
    ("Salaire", 1),
    ("Virement Elena", 1),
    ("Autre", 1),
    ("Travail", 2),
    ("Logement", 2),
    ("Courses", 2),
    ("Activités", 2),
    ("Chats", 2),
    ("Frais Bancaires", 2),
    ("Autre", 2),
    ("Compte", 3),
    ("Epargne", 3);

INSERT INTO
    'COMPTE_CATEGORIE' (nom)
VALUES
    ("Compte courant"),
    ("Coffre"),
    ("Pocket"),
    ("Livret"),
    ("ETF"),
    ("Action");

INSERT INTO
    'COMPTE' (nom, categorie_id)
VALUES
    ("LCL", 1),
    ("Revolut", 1),
    ("Economie", 2),
    ("Arrondie", 2),
    ("Facture", 3),
    ("Livret Jeune", 4),
    ("Livret A", 4);