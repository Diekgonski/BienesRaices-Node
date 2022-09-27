# Bienes Raices - Proyecto

## Descripción: 

El proyecto consiste en una aplicación para publicar bienes raices, el objetivo es que el usuario pueda crear una cuenta, y pueda publicar sus propiedades, así mismo, pueda ver las propiedades de otros usuarios y contactarse con ellos para una posible compra. La aplicación es monolítica; para el front-end usa el template engine pug.js, TailwindCSS para el diseño  y Javascript Vanilla para la interacción de la aplicación con el usuario, y para el Back-end utiliza Node.js y el framework express.js, también Sequelize como ORM y base de datos MySQL.

## Herramientas Utilizadas

- Pug.js (HTML)
- TailwindCSS (CSS)
- Javascript
- Node.js (Javascript)
- Express.js
- Sequelize (ORM)
- MySQL (Database)

## Instalación

### Desarrollo

Se debe crear un archivo .env y poner los siguientes campos (Deben ser diligenciados): 

- DB_NOMBRE=
- DB_USER=
- DB_PASS=
- DB_HOST=

Para el envío de los Email's se debe crear una cuenta en mailtrap y poner las llaves que facilita la herramienta

- EMAIL_HOST=
- EMAIL_PORT=
- EMAIL_USER=
- EMAIL_PASS=

BACKEND_URL=http://localhost

JWT_SECRET=

Para instalar las dependencias:

```
npm install
npm start
```

Para correr TailwindCSS y webpack Ejecutar el siguiente comando:
```
npm run dev
```