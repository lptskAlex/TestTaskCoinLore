export const getCoinData = index =>
  fetch(`https://api.coinlore.net/api/tickers/?start=${index}&limit=1`).then(
    res => res.json().then(result => result.data[0]),
  );
