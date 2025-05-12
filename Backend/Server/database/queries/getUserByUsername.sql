-- getUserByUsername.sql
SELECT user.*, role.role as roleName 
FROM user
JOIN role ON role.roleId = user.roleId
WHERE username = ?;
