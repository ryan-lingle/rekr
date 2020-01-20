# rekr-client
This is the repo for the rekr client, the rekr server repo can be [found here](https://github.com/ryan-lingle/rekr-server).

A demo for this application (with fake data) can be found at [staging.rekr.app](https://staging.rekr.app) (give the servers a second to wake up).

## dev setup
first, clone and set up rekr-server
```
git clone https://github.com/ryan-lingle/rekr-server.git
cd rekr-server
```
install dependencies
```
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
clone and enter client directory
```
git clone https://github.com/ryan-lingle/rekr-client.git
cd rekr-client
```
install client dependencies (they use different package managers oops lol)
```
yarn install
```
start client
```
yarn start
```
