
SETUP 
git clone https://github.com/KillianFrappartDev/GroupChat.git
cd GroupChat/frontend && npm install
cd GroupChat/backend && npm install
cd coworking/frontend && npm start
cd coworking/backend && npm start

USEFUL COMMANDS
TO KILL PORT 5000 
sudo lsof -i :5000
kill -9 PID

POST http://localhost:5000/api/users/login
{
    "email" : "andrewvu0203@gmail.com",
    "password" : "andrewvu"
}

PUT http://localhost:5000/api/users/forrest
{
    "id" : "612465467652f61e242d89a6",
    "forrest" : "20"
}

Docker:
At the root directory you can run

Build the new image and spin up the two containers:
```bash
docker-compose up -d --build
```

-d: Run containers in the background
---build: Build images before starting containers.

```bash
docker-compose down -v 
```
-v: Remove named volumes declared in the `volumes`
