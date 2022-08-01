export const getCoinData = id =>
  fetch(`https://api.coinlore.net/api/ticker/?id=${id}`).then(res =>
    res.json(),
  );
