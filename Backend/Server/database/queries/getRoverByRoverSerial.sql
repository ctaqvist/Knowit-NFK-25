--getRoverByRoverSerial.sql
SELECT * FROM rover
WHERE rover_serial = ?;