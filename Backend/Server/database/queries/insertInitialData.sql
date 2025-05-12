-- insertInitialData.sql
INSERT OR IGNORE INTO role (role) VALUES ('admin'), ('user');
INSERT OR IGNORE INTO user (userId, username, password, email, roleId) VALUES (1, 'admin', '1234', 'admin@terrax9.se', 1);
INSERT OR IGNORE INTO user (userId, username, password, email, roleId) VALUES (2, 'user', '1234', 'user@terrax9.se', 2);
INSERT OR IGNORE INTO rover (roverId, rover_serial, password) VALUES (1, 'rover-001', '1234');
INSERT OR IGNORE INTO rover (roverId, rover_serial, password) VALUES (2, 'rover-002', '1234');
INSERT OR IGNORE INTO userRover (userRoverId, userId, roverId) VALUES (1, 1, 1);
