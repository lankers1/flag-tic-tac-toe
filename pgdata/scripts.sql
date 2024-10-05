CREATE OR REPLACE VIEW public.generate_game AS
SELECT sixth.first_row_id,
  frc.name AS first_row,
  sixth.first_column_id,
  fcc.name AS first_column,
  sixth.second_row_id,
  src.name AS second_row,
  sixth.second_column_id,
  scc.name AS second_column,
  sixth.third_row_id,
  trc.name AS third_row,
  rc.related_id AS third_column_id,
  tcc.name AS third_column
FROM (
    SELECT fifth.first_row_id,
      fifth.first_column_id,
      fifth.second_row_id,
      fifth.second_column_id,
      rc_1.related_id AS third_row_id
    FROM (
        SELECT fourth.first_row_id,
          fourth.first_column_id,
          fourth.second_row_id,
          rc_2.related_id AS second_column_id
        FROM (
            SELECT third.first_row_id,
              third.first_column_id,
              rc_3.related_id AS second_row_id
            FROM (
                SELECT c.characteristic_id AS first_row_id,
                  rc_4.related_id AS first_column_id
                FROM characteristics c
                  JOIN related_characteristics rc_4 ON rc_4.id = c.characteristic_id
                WHERE c.difficulty = 'easy'::text
                ORDER BY (random())
                LIMIT 1
              ) third
              JOIN related_characteristics rc_3 ON rc_3.id = third.first_column_id
            WHERE rc_3.related_id <> third.first_row_id
            ORDER BY (random())
            LIMIT 1
          ) fourth
          JOIN related_characteristics rc_2 ON rc_2.id = fourth.second_row_id
        WHERE rc_2.related_id <> fourth.first_row_id
          AND rc_2.related_id <> fourth.second_row_id
          AND rc_2.related_id <> fourth.first_column_id
          AND (
            rc_2.related_id IN (
              SELECT related_characteristics.related_id
              FROM related_characteristics
              WHERE related_characteristics.id = fourth.first_row_id
                OR related_characteristics.id = fourth.second_row_id
              GROUP BY related_characteristics.related_id
              HAVING count(related_characteristics.related_id) > 1
            )
          )
        ORDER BY (random())
        LIMIT 1
      ) fifth
      JOIN related_characteristics rc_1 ON rc_1.id = fifth.second_column_id
    WHERE rc_1.related_id <> fifth.first_row_id
      AND rc_1.related_id <> fifth.second_row_id
      AND rc_1.related_id <> fifth.first_column_id
      AND rc_1.related_id <> fifth.second_column_id
      AND (
        rc_1.related_id IN (
          SELECT related_characteristics.related_id
          FROM related_characteristics
          WHERE related_characteristics.id = fifth.first_column_id
            OR related_characteristics.id = fifth.second_column_id
          GROUP BY related_characteristics.related_id
          HAVING count(related_characteristics.related_id) > 1
        )
      )
    ORDER BY (random())
    LIMIT 1
  ) sixth
  JOIN related_characteristics rc ON rc.id = sixth.third_row_id
  JOIN characteristics frc ON frc.characteristic_id = sixth.first_row_id
  JOIN characteristics fcc ON fcc.characteristic_id = sixth.first_column_id
  JOIN characteristics src ON src.characteristic_id = sixth.second_row_id
  JOIN characteristics scc ON scc.characteristic_id = sixth.second_column_id
  JOIN characteristics trc ON trc.characteristic_id = sixth.third_row_id
  JOIN characteristics tcc ON tcc.characteristic_id = rc.related_id
WHERE rc.related_id <> sixth.first_row_id
  AND rc.related_id <> sixth.second_row_id
  AND rc.related_id <> sixth.first_column_id
  AND rc.related_id <> sixth.second_column_id
  AND rc.related_id <> sixth.third_row_id
  AND (
    rc.related_id IN (
      SELECT related_characteristics.related_id
      FROM related_characteristics
      WHERE related_characteristics.id = sixth.first_row_id
        OR related_characteristics.id = sixth.second_row_id
        OR related_characteristics.id = sixth.third_row_id
      GROUP BY related_characteristics.related_id
      HAVING count(related_characteristics.related_id) > 2
    )
  )
ORDER BY (random())
LIMIT 1;
create or replace function get_flag_ids_on_char_id(ids int []) returns text [] language plpgsql as $$
declare flag_ids text [];
begin
SELECT array_agg(flag_id) AS results into flag_ids
FROM (
    SELECT flag_id,
      results
    FROM (
        SELECT flag_id,
          array_agg(characteristic_id) AS results
        FROM flag_characteristics
        GROUP BY flag_id
      ) r
    WHERE results @> ids
  ) r2;
return flag_ids;
end;
$$;
DO $BODY$
DECLARE omgjson json := '[{ "characteristic_id_1": 10, "characteristic_id_2": 12, "result": 79 }]';
i json;
BEGIN FOR i IN
SELECT *
FROM json_array_elements(omgjson) LOOP
INSERT INTO flag_characteristics (flag_id, characteristic_id)
SELECT flag_id,
  (i->>'result')::int as characteristic_id
FROM (
    SELECT flag_id,
      ARRAY_AGG(characteristic_id) as results
    FROM flag_characteristics
    WHERE characteristic_id = (i->>'characteristic_id_1')::int
      OR characteristic_id = (i->>'characteristic_id_2')::int
    GROUP BY flag_id
  ) r
WHERE cardinality(results) > 1;
END LOOP;
END;
$BODY$ language plpgsql
