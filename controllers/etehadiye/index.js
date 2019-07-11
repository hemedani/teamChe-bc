const { addEtehadiye, addOfficerToEtehadiye } = require("./AddEtehadiye");
const { etehadiyes } = require("./GetEtehadiye");
const { removeEtehadiye } = require("./RemoveEtehadiye");
const { updateEtehadiye, changeEtehadiyePic } = require("./SetEtehadiye");

const { uploadMiddleware } = require("../file/UploadMiddleware");

exports.etehadiyeRoutes = (app, jsonParser, requireAuth, CheckLevel, uploadWithExt) => {
  app.get("/api/etehadiyes", jsonParser, requireAuth, etehadiyes);
  app.post("/api/etehadiye/add", jsonParser, requireAuth, CheckLevel.checkAsOrg, addEtehadiye);
  app.post("/api/etehadiye/add/officer", jsonParser, requireAuth, CheckLevel.ckeckAdmin, addOfficerToEtehadiye);
  app.post("/api/etehadiye/update", jsonParser, requireAuth, CheckLevel.checkAsOrg, updateEtehadiye);
  app.put(
    "/api/etehadiye/change/pic",
    jsonParser,
    requireAuth,
    CheckLevel.checkAsOrg,
    uploadWithExt.single("file"),
    uploadMiddleware,
    changeEtehadiyePic
  );
  app.post("/api/etehadiye/remove", jsonParser, requireAuth, CheckLevel.checkAsOrg, removeEtehadiye);
};
