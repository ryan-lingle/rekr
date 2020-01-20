function toSats(int, withSats=true) {
  if (int) {
    return parseInt(int).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0}) + (withSats ? " sats" : "");
  } else {
    return 0 + (withSats ? " sats" : "");
  };
}

export default toSats;
