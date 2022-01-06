~~~~~ NOTE

SETUP 
git clone https://github.com/KillianFrappartDev/GroupChat.git
cd GroupChat/frontend && npm install
cd GroupChat/backend && npm install
cd frontend && npm start
cd backend && npm start

USEFUL COMMANDS
TO KILL PORT 5000 
sudo lsof -i :5000
kill -9 PID

5 NOTES
for joined groups : change fetchGroups() to fetchJoinedGroups()
mongodb schema for message ->
mongodb schema for group's role ->
mongodb for orphaned -> https://stackoverflow.com/questions/34464861/pre-and-post-remove-middleware-not-firing/34464916#34464916




~~~~~ HTTPS


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





~~~~~ DEPLOYMENT

DOCKER TO RUN ROOT DIRECTORY
docker-compose up

DOCKER TO REMOVE 
docker-compose down -v

HEROKU TO RUN FRONTEND WEB
cd frontend
heroku login
[heroku create]
heroku container:login 
heroku container:push web --app online-coworking
heroku container:release web --app online-coworking

HEROKU TO RUN BACKEND WEB
cd backend
heroku login
[heroku create]
heroku container:login
heroku container:push web --app whispering-gorge-69756
heroku container:release web  --app whispering-gorge-69756

HEROKU USEFUL COMMANDS
heroku logs --tail --app online-coworking
heroku ps:scale web=2 --app online-coworking

