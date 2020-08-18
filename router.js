const crawlerModule = require('./crawlerModule/crawler');

module.exports = (app) => {
  app.get("/api/crawler", async (req, res) => {
    await crawlerModule.crawler(res, req.query);
  });
  app.use('*', (req, res) => {
    res.status(404).json({Errpr: 'Invalid Route'});
  });
}