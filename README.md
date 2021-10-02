
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

DOCKER TO RUN ROOT DIRECTORY
docker-compose up

DOCKER TO REMOVE 
docker-compose down -v

HEROKU TO RUN FRONTEND WEB
cd frontend
heroku login
heroku create
heroku container:login 
heroku container:push web --app radiant-anchorage-81110
heroku container:release web --app radiant-anchorage-81110


HEROKU TO RUN BACKEND WEB
cd backend
heroku login
heroku create
heroku container:login
heroku container:push web --app whispering-gorge-69756
heroku container:release web  --app whispering-gorge-69756

HEROKU USEFUL COMMANDS
heroku logs --tail --app radiant-anchorage-81110
heroku ps:scale web=2 --app radiant-anchorage-81110