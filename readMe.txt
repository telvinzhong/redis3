To run this program, clone the repository and run:

cd redis3
npm install (will install all dependencies locally)
npm start (will begin the program and connect to port 3000)

The application should be running on http://localhost:3000 from any browser.

The redis data structure chosen is sorted set to retain the order that users and emails are added
in while also maintaing the benefits of faster speed. The interface will allow creation, deletion,
and updating of user and their contact information.