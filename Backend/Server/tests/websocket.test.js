import http, { get } from 'http';
import expressApp from '../api/app.js';
import initializeWebSocketServer from '../communication/websocketServer.js';
import {getUserRoverDict} from '../communication/websocketServer.js';
import WebSocket from 'ws';
import { createTokenForUser, createTokenForRover } from '../tokenGenerator.js';

let server;
let wss;
let port = 8085;

beforeAll((done) => {
    server = http.createServer(expressApp);
    server.listen(port, () => {
        wss = initializeWebSocketServer(server);
        done();
    });
});

afterAll((done) => {
    wss.close(() => {
        server.close(done);
    });
});

describe('WebSocket Server', () => {
    test('user and rover connect, then user sends connect command to rover and dict is updated', (done) => {
        Promise.all([
            createTokenForUser('user'),
            createTokenForRover('rover-001')
        ]).then(([userToken, roverToken]) => {
            const wsUser = new WebSocket(`ws://localhost:${port}?token=${userToken}`);
            const wsRover = new WebSocket(`ws://localhost:${port}?token=${roverToken}`);

            let userReady = false;
            let roverReady = false;

            function tryProceed() {
                if (userReady && roverReady) {
                    // Both connections are ready, user sends connect command
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-001", command: "connect"
                        }));
                    }, 100);
                }
            }

            wsUser.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !userReady) {
                expect(msg.response).toBe('success');
                userReady = true;
                tryProceed();
                } else if (msg.response === 'success' && userReady) {
                    // This is the response to the connect command
                    setTimeout(() => {
                        const userRoverDict = getUserRoverDict();
                        expect(Object.values(userRoverDict)).toContain('rover-001');
                        wsUser.close();
                        wsRover.close();
                        done();
                    }, 100);
                }
            });

            wsRover.on('message', (data) => {
                const msg = JSON.parse(data);
                expect(msg.response).toBe('success');
                if (msg.response === 'success') {
                    roverReady = true;
                    tryProceed();
                }
            });

            wsUser.on('error', done);
            wsRover.on('error', done);
        });
    });

    test('user connects to rover-001, then tries to connect to rover-002 and receives error', (done) => {
        console.log("Test started lets fucking go!")
        Promise.all([
            createTokenForUser('user'),
            createTokenForRover('rover-001'),
            createTokenForRover('rover-002')
        ]).then(([userToken, roverToken, rover2Token]) => {
            const wsUser = new WebSocket(`ws://localhost:${port}?token=${userToken}`);
            const wsRover = new WebSocket(`ws://localhost:${port}?token=${roverToken}`);
            const wsRover2 = new WebSocket(`ws://localhost:${port}?token=${rover2Token}`);

            let userReady = false;
            let roverReady = false;
            let rover2Ready = false;
            let step = 0;

            function tryProceed() {
                if (userReady && roverReady && rover2Ready) {
                    // All connections are ready, proceed with first connection attempt
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-001", command: "connect"
                        }));
                    }, 100);
                }
            }

            wsUser.on('message', (data) => {
                const msg = JSON.parse(data);
                console.log("User received message: ", msg)
                if (msg.response === 'success' && !userReady) {
                    // Initial connection success
                    expect(msg.response).toBe('success');
                    userReady = true;
                    console.log('User is ready, tries to connect to rover-001');
                    tryProceed();
                    return;
                } else if (msg.response === 'success' && step === 0) {
                    console.log('User got success message for rover-001');
                    // First rover connection success
                    expect(msg.response).toBe('success');
                    step = 1;
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-002", command: "connect"
                        }));
                    }, 100);
                } else if (msg.response === 'error' && step === 1) {
                    // Should receive error for second connection attempt
                    expect(msg.response).toBe('error');
                    expect(msg.message).toMatch(/already connected to a rover/);
                    const userRoverDict = getUserRoverDict();
                    expect(Object.values(userRoverDict)).toContain('rover-001');
                    expect(Object.values(userRoverDict)).not.toContain('rover-002');
                    wsUser.close();
                    wsRover.close();
                    wsRover2.close();
                    done();
                } else {
                    // This should not happen
                    fail('This shouldnt happen, user should not receive this message');
                    wsUser.close();
                    wsRover.close();
                    wsRover2.close();
                    done();
                }
            });

            wsRover.on('message', (data) => {
                const msg = JSON.parse(data);
                expect(msg.response).toBe('success');
                if (!roverReady) {
                    roverReady = true;
                    tryProceed();
                }
            });

            wsRover2.on('message', (data) => {
                const msg = JSON.parse(data);
                expect(msg.response).toBe('success');
                if (!rover2Ready) {
                    rover2Ready = true;
                    tryProceed();
                }
            });

            wsUser.on('error', done);
            wsRover.on('error', done);
            wsRover2.on('error', done);
        });
    });

    test('user connects to rover-001 and sends message "hi", only rover-001 receives it', (done) => {
        Promise.all([
            createTokenForUser('user'),
            createTokenForRover('rover-001'),
            createTokenForRover('rover-002')
        ]).then(([userToken, roverToken, rover2Token]) => {
            const wsUser = new WebSocket(`ws://localhost:${port}?token=${userToken}`);
            const wsRover = new WebSocket(`ws://localhost:${port}?token=${roverToken}`);
            const wsRover2 = new WebSocket(`ws://localhost:${port}?token=${rover2Token}`);

            let userReady = false;
            let roverReady = false;
            let rover2Ready = false;
            let step = 0;
            let rover1ReceivedHi = false;
            let rover2ReceivedHi = false;

            function tryProceed() {
                if (userReady && roverReady && rover2Ready) {
                    // All connections are ready, user connects to rover-001
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-001", command: "connect"
                        }));
                    }, 100);
                }
            }

            wsUser.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !userReady) {
                    userReady = true;
                    tryProceed();
                } else if (msg.response === 'success' && step === 0) {
                    // Connected to rover-001, now send "hi"
                    step = 1;
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-001",
                            command: "message",
                            message: "hi"
                        }));
                    }, 100);
                }
            });

            wsRover.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !roverReady) {
                    roverReady = true;
                    tryProceed();
                } else if (msg.command === 'message' && msg.message === 'hi') {
                    rover1ReceivedHi = true;
                    // Wait a bit to ensure rover2 does not receive the message
                    setTimeout(() => {
                        expect(rover1ReceivedHi).toBe(true);
                        expect(rover2ReceivedHi).toBe(false);
                        wsUser.close();
                        wsRover.close();
                        wsRover2.close();
                        done();
                    }, 200);
                }
            });

            wsRover2.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !rover2Ready) {
                    rover2Ready = true;
                    tryProceed();
                } else if (msg.command === 'message' && msg.message === 'hi') {
                    rover2ReceivedHi = true;
                }
            });

            wsUser.on('error', done);
            wsRover.on('error', done);
            wsRover2.on('error', done);
        });
    });

    test('user disconnects from rover-001, then tries to connect to rover-002 and succeeds', (done) => {
        Promise.all([
            createTokenForUser('user'),
            createTokenForRover('rover-001'),
            createTokenForRover('rover-002')
        ]).then(([userToken, roverToken, rover2Token]) => {
            const wsUser = new WebSocket(`ws://localhost:${port}?token=${userToken}`);
            const wsRover = new WebSocket(`ws://localhost:${port}?token=${roverToken}`);
            const wsRover2 = new WebSocket(`ws://localhost:${port}?token=${rover2Token}`);
            let userReady = false;
            let roverReady = false;
            let rover2Ready = false;
            let step = 0;
            function tryProceed() {
                if (userReady && roverReady && rover2Ready) {
                    // All connections are ready, user connects to rover-001
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-001", command: "connect"
                        }));
                    }, 100);
                }
            }
            wsUser.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !userReady) {
                    userReady = true;
                    tryProceed();
                } else if (msg.response === 'success' && step === 0) {
                    // Connected to rover-001, now disconnect
                    step = 1;
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-001", command: "disconnect"
                        }));
                    }, 100);
                } else if (msg.response === 'success' && step === 1) {
                    // Disconnected from rover-001, now connect to rover-002
                    step = 2;
                    setTimeout(() => {
                        wsUser.send(JSON.stringify({
                            rover_id: "rover-002", command: "connect"
                        }));
                    }, 100);
                } else if (msg.response === 'success' && step === 2) {
                    // Successfully connected to rover-002
                    const userRoverDict = getUserRoverDict();
                    expect(Object.values(userRoverDict)).toContain('rover-002');
                    expect(Object.values(userRoverDict)).not.toContain('rover-001');
                    wsUser.close();
                    wsRover.close();
                    wsRover2.close();
                    done();
                }
            });
            wsRover.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !roverReady) {
                    roverReady = true;
                    tryProceed();
                }
            });
            wsRover2.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !rover2Ready) {
                    rover2Ready = true;
                    tryProceed();
                }
            });
            wsUser.on('error', done);
            wsRover.on('error', done);
            wsRover2.on('error', done);
        });
    });

    test('user1 connects to rover-001, then user2 tries to connect to same rover and receives error', (done) => {
        createTokenForUser('admin').then(user1Token => {
            console.log("User1 token is: ", user1Token)
            return Promise.all([
                Promise.resolve(user1Token),
                createTokenForUser('user'),
                createTokenForRover('rover-001')
            ]);
        }).then(([user1Token, user2Token, roverToken]) => {
            const wsUser1 = new WebSocket(`ws://localhost:${port}?token=${user1Token}`);
            const wsUser2 = new WebSocket(`ws://localhost:${port}?token=${user2Token}`);
            const wsRover = new WebSocket(`ws://localhost:${port}?token=${roverToken}`);

            let user1Ready = false;
            let user2Ready = false;
            let roverReady = false;
            let step = 0;

            function tryProceed() {
                if (user1Ready && user2Ready && roverReady) {
                    // All connections are ready, user1 connects to rover-001
                    setTimeout(() => {
                        wsUser1.send(JSON.stringify({
                            rover_id: "rover-001", command: "connect"
                        }));
                    }, 100);
                }
            }

            wsUser1.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !user1Ready) {
                    user1Ready = true;
                    tryProceed();
                } else if (msg.response === 'success' && step === 0) {
                    // user1 connected to rover-001, now user2 tries to connect
                    step = 1;
                    setTimeout(() => {
                        wsUser2.send(JSON.stringify({
                            rover_id: "rover-001", command: "connect"
                        }));
                    }, 100);
                }
            });

            wsUser2.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !user2Ready) {
                    user2Ready = true;
                    tryProceed();
                } else if (msg.response === 'error' && step === 1) {
                    expect(msg.response).toBe('error');
                    wsUser1.close();
                    wsUser2.close();
                    wsRover.close();
                    done();
                }
            });

            wsRover.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.response === 'success' && !roverReady) {
                    roverReady = true;
                    tryProceed();
                }
            });

            wsUser1.on('error', done);
            wsUser2.on('error', done);
            wsRover.on('error', done);
        });
    });
});
