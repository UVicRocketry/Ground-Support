# Installation Guide

This section goes over instruction for the developer and non-software engineer installation process

<div id='developer-installation'/>

## Developer installation

This section will go over environment dependencies and setup.

### Requirements

**NodeJS**

If you do not have Node please go to https://nodejs.org/en/download/ and install the latest stable version.

you can test if the installation worked by typing the commands

```bash
npm -v
```

```bash
node --version
```

If they don't give you errors then installation of node was successful. 

**TypeScript**

```bash
npm i -g typescript
```

verify installation

```bash
tsc --version
```

**Rust**

Go to [rust](https://doc.rust-lang.org/book/ch01-01-installation.html) and follow the instructions to install rust.

**Docker**

Go to the [Docker Desktop documentation](https://docs.docker.com/desktop/install/linux-install) and follow the installation instructions for your OS. Docker desktop contains the Docker Engine and other Docker software required for running Ground Support in a container.

**MongoDB Atlas**

One option for database hosting is using cloud resources, if you prefer not to use cloud tool or need offline capabilities skip this and use the local database hoster `mongodb compass`. Our  database will be hosted by MongoDB itself on MongoDB Atlas.

First go to [Atlas sign in](https://account.mongodb.com/account/login) and sign up for an account.

### Dev Environment Setup

Now if you haven't already you can clone the repository

```bash
git clone https://github.com/UVicRocketry/Ground-Support.git
```
**Server Environment File**

In the `/services/server` directory create a `.env` file. If not called exactly `.env`, create one and copy and paste

```ts
MONGO_USERNAME = ''
MONGO_PASSWORD = ''
MONGO_DB_STRING = ''
SERVER_PORT = ''
```

**Create Remote Database**

To use the app you must first create a remote database for your environment to do this go to mongoBD Atlas and create a new database.

<p align="center">
    <img src="./assets/Create%20a%20database.png" width="300"/>
</p>

Select the free option

<p align="center">
    <img src="./assets/select-free-database.png" width="300"/>
</p>

Select the AWS hosting service with a North american Server. And Name your cluster `GroundSupport`

Create an Admin User with the credentials

> Username: SupportAdmin

> Password: UVR2015

In the `.env` file fill in the password and username with the credentials above

<p align="center">
    <img src="./assets/admin-user-creation.png" width=300/>
</p>

**Network Access**

In Here you can setup which IP addresses can access your database. For now click add new IP address and select `add current ip address` button.

⚠️ Do not click allow access anywhere. That is reserved for the production version.

<p align="center">
    <img src="./assets/add-new-ip.png" width=300/>
</p>

Next click on the database tab on the left and click the `Connect` button for the `GroundSupport` database.

A popup will appear, click `connect your application`. This will give you a **Connection String**. All connection strings are different.

<p align="center">
    <img src="./assets/connect-database.png" width=300/>
</p>

The connection string will look something like this

`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@groundsupport.${MONGO_DB_STRING}.mongodb.net/`;

Copy the part in the place of `${MONGO_DB_STRING}` and paste it into the `.env` file in the `MONGO_DB_STRING` variable.

**Create Local Database**

If you are JJ and scared of Hosting your data you can install a local database for development

To do that you will need mongo DBs data management application `Compass` to get it go to:
[Download](https://www.mongodb.com/try/download/community) and install the newest community addition.

Go through the installer. Choose the `Complete` option

<p align="center">
    <img src="./assets/local-ds-installation.png" width=300/>
</p>

Copy this Path

<p align="center">
    <img src="./assets/local-ds-path.png" width=300/>
</p>

alter the path to `MongoDB/Server/6.0/bin`

Navigate to that path in your favorite terminal

copy connection string into `.env` file


#### Docker Dev Setup

From the project root, run the following in a terminal
```bash
$ docker compose up --build 
```

This command will build and run the Ground Support container. Unless removed, the Ground Support container will persist and can be started and stopped as needed. After the initial build, the `--build` flag can be omitted when starting the container.

Once running, the Ground Support client will be available at `localhost:3000`, and the container will update when changes are made to the local source.

If developing through Docker, a local dev setup is not required.

#### Local Dev Setup

**Dependencies**

Next to get everything set up all node module dependencies must be installed.

To do this run

```bash 
npm install && cd client && npm --force install && cd ../services/server && npm i
```
There is currently a bug when installing the dependencies for the client, the library `react-material-file-upload` was installed using `--force`. Therefore `--force` flag is necessary to install.

This will install and update all dependencies and setup the environment variables

Now for telemetry

First navigate to `/services/telemetry/` and install all rust dependencies with

```bash
cargo build
```

**Backend**

`Navigate` to ./services/server

```bash
npm run server
```

**Frontend**

`Navigate` to ./client/src

```bash
npm start
```


**Telemetry Backend**

TBD (@JackCotter) once rust backend is more functional

## Non-technical installation

### 1. Install WSL
1. `Open terminal`
2. `wsl --install or wsl --install -d Ubuntu --web-download`
   
### 2. Install Docker
1. `sudo apt-get update` 
2. `sudo apt-get install ca-certificates curl gnupg lsb-release` 
3. `sudo mkdir -p /etc/apt/keyrings` 
4. `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg` 
5. `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null` 
6. `sudo apt-get update` 
7. `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin`
   
### 3.Git Install
1. `sudo apt-get install git`
2. `git config --global user.name "Your Name"`
3. `git config --global user.email "youremail@domain.com"`

### 4.Install Rust
1. `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. `sudo apt-get update`
3. `sudo apt install build-essential`
   
### 5.Install Ground-Support
1. `https://github.com/UVicRocketry/Ground-Support.git`
   
### 6.Docker Start Up
1. `sudo service docker start`
2. `docker compose build`
3. `docker compose up`


