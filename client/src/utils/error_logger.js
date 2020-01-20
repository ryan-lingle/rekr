function errorLogger(body) {
  fetch(process.env.REACT_APP_ADMIN_ENDPOINT + "/error", {
    method: "POST",
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  })
};

export default errorLogger;
