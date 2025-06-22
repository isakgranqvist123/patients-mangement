# Patients mangement app

In order to start the app do the following:

create a .env file in the backend directory with the following values:

PORT=3000<br/>
MONGO_URI=mongodb+srv://<username>:<password>@<host>/<collection>?retryWrites=true&w=majority<br/>
JWT_SECRET=<your_jwt_secret_here><br/>

Run the following commands in the backend directory:<br>
npm install<br/>
npm run dev

open frontend/config/index.ts and replace API_BASE_URL with http://localhost:3000/api/v1
then run the following commands:

npm install<br/>
npm run dev

open browser
