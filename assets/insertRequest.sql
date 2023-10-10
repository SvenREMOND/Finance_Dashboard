INSERT INTO
    'CATEGORIE' (nom, parent_id)
VALUES
    ("Revenu", NULL),
    ("Dépense", NULL),
    ("Salaire", 1),
    ("Virement Elena", 1),
    ("Autre", 1),
    ("Travail", 2),
    ("Logement", 2),
    ("Courses", 2),
    ("Activités", 2),
    ("Chats", 2),
    ("Frais Bancaires", 2),
    ("Autre", 2);

INSERT INTO
    'COMPTE' (nom, description)
VALUES
    ("LCL", "Compte courant"),
    ("Revolut", "Compte courant"),
    ("Facture", "Pocket Revolut"),
    ("Economie", "Coffre Revolut"),
    ("Arrondie", "Coffre Revolut");