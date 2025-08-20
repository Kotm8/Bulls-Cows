Как запустить:
создать .env файлы в /client и /server
в файле /client .env написать
```
VITE_API_URL=http://localhost:3000
```

в файле /server .env написать
```
PORT=3000
FRONTEND_URL=http://localhost:5173
COOKIE_SECRET=cookieSecret
COOKIE_NAME=cookieName
NODE_ENV=development


DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=name
```
запустить бэкенд с командой
```
npm start
```
Запустить фронтенд с командой 
```
npm run dev
```
