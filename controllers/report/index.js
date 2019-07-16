const { reports, report } = require("./GetReports");
const { addReport } = require("./AddReport");
const { removeReport } = require("./RemoveReports");

exports.reportRoutes = (app, jsonParser, requireAuth, CheckLevel) => {
  app.get("/api/reports", jsonParser, requireAuth, CheckLevel.allOrganic, reports);
  app.get("/api/report", jsonParser, requireAuth, CheckLevel.allOrganic, report);
  app.post("/api/report/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, addReport);
  app.post("/api/report/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, removeReport);
};
