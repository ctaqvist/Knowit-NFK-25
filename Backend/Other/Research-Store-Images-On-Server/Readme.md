# How to Store Images on a Server

## Introduction
We need to store the pictures sent from the rover on the server. There are several ways to do this, such as storing them on the file system, in a database, or in the cloud.

We chose to store the images on the file system because it is simple and reliable. Cloud storage can be expensive and sometimes complex to integrate. Storing images in a database is generally not recommended when the number or size of the images grows significantly, as it can lead to performance issues and increased complexity.

## Solution

- All images will be stored in the /img directory.
- When the user sends an HTTP GET request to http://hostname/images, they receive a list of URLs. Each URL corresponds to a dynamically generated route for an image file.
- The application can then send a GET request to each of these URLs to retrieve the respective image file.

This approach also makes it easier to build a security layer on top of the endpoints, restricting access to authorized clients in the future.

## What to Do in the Future
### Issue:
All images are currently accessible to all users, and there is no way for clients to keep certain images private.
### Solution:
We can store images with unique IDs and link them to specific users or mark them as public for access by all users. Each user will only be able to access the images associated with their account in the database.