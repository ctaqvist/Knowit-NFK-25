-- getUserRovers.sql
SELECT * FROM rover
JOIN userRover ON rover.roverId = userRover.roverId
WHERE userRover.userId = ?;
