# MarketPlacer Code Exercise

<img width="100%" alt="Screenshot 2024-08-04 at 7 28 38 AM" src="https://github.com/user-attachments/assets/8cca835d-4661-4a0e-a945-5ed2934afef3">

### Version

```
  NodeJS v17.9.0
  TypeScript 5.54
```

### Installation

```
  git clone git@github.com:rickdtrick/mp-cli.git
  cd mp-cli
```

#### Setup

```
  npm install
  npm run build
```

#### Note: Running npm run build clears the data

### Run the app

```
  npm start
```

### Run Test Suite

```
  npm test
```

### Dev Notes
- `/src/data` contains JSON files which then is copied on `/dist/src/data` after `npm run build` which acts as a _database_ for the app
- `/src/models` simple implementation of an ORM, like with ActiveRecord or Prisma.io

#### Other considerations
If I had control with the `price` datatype, I would have it saved as a whole number in [BPS Format](https://www.investopedia.com/ask/answers/what-basis-point-bps/) (`10.00` is saved as `1000`)
instead of float/string because it might lead to rounding issues due to [floating-point ](https://floating-point-gui.de/).
