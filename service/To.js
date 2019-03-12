// to.js
exports.To = (promise) => {
  return promise
    .then(data => [null, data])
    .catch(err => [err]);
}
