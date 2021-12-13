module.exports = {
  DUPLICATE_ENTRY: {
    code: 11000,
    json: (err) => {
      return { error: "DUPLICATE_ENTRY", values: Object.keys(err.keyPattern) }
    }
  }
};