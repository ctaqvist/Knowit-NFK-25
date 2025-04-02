# Rover Application Backend

**Ticket:** High-level decision for local or public server  
**Date:** 2025-04-01  
**Author:** Emil Kronholm  

---

## Introduction

Should the backend server for the rover application be local or public? This document outlines a high-level decision regarding whether to host the server locally or publicly.

---

## Definition

- **Local:** A server running on the Knowit network, only accessible to devices connected to the same network. Not open to the internet.
- **Public:** A server accessible via the internet; any device can attempt to connect to it.

---

## Comparison: Local vs Public

### Simplicity

- **Local:** Easier to set up, but requires that the Knowit network/firewall allows communication between local devices.
- **Public:** Also easy to set up, but introduces challenges such as monitoring and authentication.

### Development Experience

- **Local:** Easy to turn on/off. Might be difficult for the rover/app to connect if the server is hosted on different devices each time.
- **Public:** Harder to update, but easier to connect to since it maintains a consistent IP.

### Security

- **Local:** Very secure out of the box.
- **Public:** Can be secure, but requires time and effort to configure correctly.

### Portability

- **Local:** Not portable (IP might change, and it requires manual startup).
- **Public:** Very portable; accessible from anywhere.

### Delay

- **Local:** May experience more delay (likely needs setup outside Knowit).
- **Public:** Likely less delay as it is accessible within the same network.  
  *(However, actual delay differences would require testing.)*

---

## Discussion

High-level requirements mention “long-distance” control. If the rover can only be operated within the Knowit network, does that meet the "long-distance" criteria?

- If we commit to a **local server**, the rover will not be operable outside of Knowit’s network.
- If the server is **local**, **Athina** won't be able to connect to it (unless Knowit sets up a VPN).

---

## Final Proposal

In the long term, the server should be **public**. This ensures:

- True long-distance control
- Full remote operation
- Consistent accessibility

To ensure security, we could whitelist a device’s MAC address for controlled access.

**However**, during development and early testing (e.g., for the MVP), we may run the server **locally** to simplify iteration.

---

## Final Verdict (11.21)

We have confirmed that the **Knowit network does not allow peer-to-peer (P2P)** communication. Therefore, we **cannot use a local server**.
