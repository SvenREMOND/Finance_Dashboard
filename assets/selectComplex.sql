-- SQLite
SELECT
    T.montant,
    T.date,
    CAT.nom AS parent,
    C.nom
FROM
    `TRANSACTION` T
    INNER JOIN `CATEGORIE` C ON T.categorie_id = C.id
    INNER JOIN `CATEGORIE` CAT ON C.parent_id = CAT.id
WHERE
    strftime ('%s', T.date) BETWEEN strftime ('%s', "2023-01-01") AND strftime  ('%s', "2023-03-01")
AND
    C.nom != "Epargne"