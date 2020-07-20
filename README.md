Forex Currency Exchange Rate Viewer

The application provides Historical and Real-Time exchange rates for currency pairs as well as percentage change in the rate over a duration.
The currency rate data has been sourced from an external API.

Technology stack:
1. Flask Framework for Backend (Python 3.6)
2. Cassandra Database
3. React, Javascript for Frontend 
4. RESTful API endpoints
5. JSON
6. Docker (Cassandra is dockerized)

Processing:
The application fetches the delta historical data from an external API during startup and stores in Cassandra Cluster database. 
The Historical requests for data and rate change are served by RESTful endpoints in Flask and the response is evalualted from stored database records.

Usage Instructions:

Cassandra Deployment Instructions:
- Pull Cassandra Image from Docker Hub
Pull Cassandra Official Docker Image (https://hub.docker.com/_/cassandra)
     $ docker pull cassandra 

- Create a network for our Cassandra container. Let’s call it “cassandra-net”
    $ docker network create cassandra-net

- Create and run the container on port 9042 using the following command
    $ docker run --name cassandra_cont  -p 9042:9042 --network cassandra-net -d cassandra:latest

- Connect to Cassandra from cqlsh
    $ docker run -it --network cassandra-net --rm cassandra cqlsh cassandra_cont 

 - Container shell access 
    $ docker exec -it cassandra_cont  bash


Database Schema:
1. CREATE KEYSPACE forexapi WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'}  AND durable_writes = true;

2. CREATE TABLE forexapi.lastloadinfo (
    lastloaddate date PRIMARY KEY
)

3. CREATE TABLE forexapi.histdata (
    base_curr text,
    rate_date date,
    target_curr text,
    rate double,
    PRIMARY KEY (base_curr, rate_date, target_curr)
)

CREATE TABLE forexapi.currencies (
    currency_name text PRIMARY KEY
)


Web Interface:
![WebAppInterface](https://user-images.githubusercontent.com/63558030/87901169-4e544380-ca24-11ea-98ad-326098cf5488.JPG)
![Historical](https://user-images.githubusercontent.com/63558030/87901097-1f3dd200-ca24-11ea-9c0c-cd6ef0a5479e.JPG)
![RateChange](https://user-images.githubusercontent.com/63558030/87901168-4e544380-ca24-11ea-912e-be671bd35afa.JPG)
![LiveRates](https://user-images.githubusercontent.com/63558030/87901166-4dbbad00-ca24-11ea-98b0-9296032629a6.JPG)



