# rekr
Rekr is lightning network application for podcast monetization and curation. It runs live today at [rekr.app](https://rekr.app)

## dev setup
```
git clone https://github.com/ryan-lingle/rekr.git
cd rekr
```
server setup
```
cd server
npm install
```
create and seed db
```
npx sequelize-cli db:create
npx sequelize-cli db:migrate
node src/seed.js
```
start the server
```
npm start
```
client setup
```
cd ../client
```
install client dependencies (they use different package managers ¯\_(ツ)_/¯ )
```
yarn install
```
start client
```
yarn start
```
