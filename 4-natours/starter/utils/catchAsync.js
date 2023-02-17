module.exports = (asyFn) => {
  const fn = (req, res, next) => {
    asyFn(req, res, next).catch(next);
  };
  return fn;
};
