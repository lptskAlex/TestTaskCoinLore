export const getCoinsData = () =>
  fetch('https://api.coinlore.net/api/tickers/?limit=50').then(res =>
    res.json(),
  );
