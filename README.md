# linkdrop

A tiny shared reading list. Paste a link, say why it is worth reading. Everyone with the address sees the 20 newest links, newest first.

One Node.js process and one PostgreSQL table. No framework, one dependency (`pg`).

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Run it locally

```bash
npm install
cp .env.example .env        # then edit PG_URL
export $(cat .env | xargs)
psql "$PG_URL" -f db/schema.sql
npm start
```

The app listens on port 3000. Open http://localhost:3000 and drop a link.

## Configuration

| Variable | What it is |
|---|---|
| `PG_URL` | PostgreSQL connection string, e.g. `postgresql://user:password@host:5432/linkdrop` |
| `HOST` | Interface to listen on (optional) |

## Deploy on the server (First time setup in Selfhost)
- Go to [selfhost dev console](https://console.selfhost.dev/).
- CLick on `Project` from side menu and then click on `New Project` button as shown in the below assets/image. 
![new project](assets/new-project.png)  
- On click of `New Project`
![create new project](assets/create-new-project.png)
- Click on `Deploy server` below to the 
- Now server is provisioning
![alt text](assets/image.png)
- Server is ready
![alt text](assets/image-1.png)
- You will be able to see the following screen. Choose anyone option which suites to the project. I have choosen to deploy code from GitHub Repository for Node and choose Database for PostgreSQL.  
![alt text](assets/image-2.png)  
- Now you can see the service running here.
![alt text](assets/image-3.png)
- Add environment variable 
![alt text](assets/image-4.png)
sample connection string 
`postgresql://username:password@<dbhostPublicIP>:5432/linkdrop` 
- Next step is to add the links table schema in DB using following command from you local machine.
`psql "postgresql://username:password@<dbhostPublicIP>:5432/linkdrop" -f db/schema.sql`
- You can access the service using the link in the overview section of the service.
- Once everything is good. You will have the following page.
![alt text](assets/image-5.png)

## Health check

`GET /healthz` answers `ok` once the process is up.