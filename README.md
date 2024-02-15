# RemoteBanList

## What this application Does

Pull in bans from a remote source, and ban users who join that are on that list

## What it does NOT do

Export local bans to a remote source

# Requirements

- NodeJS 18 or Higher
- PM2 (Optional)

# How to Run

Create a file called `.env` and paste in the following info, Filling in your server RCON information:

```env
HOST=<host>
PORT=<port>
PASSWORD=<password>
REMOTE=[link to remote ban.cfg (OPTIONAL)]
```

Install the dependencies

```
> npm i
```

Start the application

```
With NPM
> npm start
With PM2
> pm2 start
```
