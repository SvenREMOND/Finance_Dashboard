INSERT INTO
    `COMPTE` (`nom`, `categorie_id`)
VALUES
    ("S&P 500", 5),
    ("World", 5),
    ("Stocks 600", 5),
    ("Amazon", 6);

INSERT INTO
    `TRANSACTION` (
        montant,
        date,
        categorie_id,
        compte_id,
        investissement
    )
VALUES
    (1600, "2023-01-01", 4, NULL, NULL),
    (1600, "2023-02-01", 4, NULL, NULL),
    (1600, "2023-03-01", 4, NULL, NULL),
    (1600, "2023-04-01", 4, NULL, NULL),
    (1600, "2023-05-01", 4, NULL, NULL),
    (100, "2023-01-01", 14, NULL, NULL),
    (200, "2023-02-01", 14, NULL, NULL),
    (400, "2023-03-01", 14, NULL, NULL),
    (200, "2023-04-01", 14, NULL, NULL),
    (100, "2023-05-01", 14, NULL, NULL),
    (100, "2023-01-01", 7, NULL, NULL),
    (200, "2023-02-01", 9, NULL, NULL),
    (400, "2023-03-01", 8, NULL, NULL),
    (200, "2023-04-01", 7, NULL, NULL),
    (100, "2023-05-01", 9, NULL, NULL),
    (100, "2023-01-01", 15, 2, NULL),
    (200, "2023-02-01", 15, 7, NULL),
    (400, "2023-03-01", 15, 8, NULL),
    (200, "2023-04-01", 15, 10, NULL),
    (100, "2023-05-01", 15, 8, 200);