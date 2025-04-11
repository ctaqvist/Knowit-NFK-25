# Ticket 21: Research Technology for Backend

## What stack to use on backend?

We have discussed some stacks to use on the server backend. Speed is important (but there are no planned CPU-heavy tasks that the server will handle). Fast development is also important as we are under a time limit. Handling many connections is not important, as we won't have many clients.

### C++

**Pros:** Extremely fast, we have internal skills for general C++ development.  
**Cons:** No experience with web frameworks.

### JavaScript & Node

**Pros:** Fast (although slower than C++), we have internal skills for JS, Node, Express. A lot of good packages available to speed up development. Easy to deploy and run.  
**Cons:** Slower than C++.

### Python

**Pros:** Fast development, many packages available.  
**Cons:** Comparatively slower than C++ and JS.

## Is speed important?

Speed is important because we need low latency. However, we don't plan to put any heavy computation on the server, it will mostly just be forwarding data. Therefore, all 3 languages should be fast enough and not affect the delay. Overall network delay and I/O is the bottleneck — not server CPU speed.

### Final proposal

We propose to use a Node.js server as backend server. This is because we have good internal skills with this and it should allow fast development time. Also, there are many good resources on the internet.
