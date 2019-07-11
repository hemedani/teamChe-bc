const { addCenter, addPicToCenter, addOptions, addCenterByOfficer } = require("./AddCenter");
const {
  fixOfficeDoctors,
  fixedStaticMaps,
  fixOtherAddressId,
  fixCenterFullPath,
  fixOtaghBazargani,
  fixOtaghAsnafForCenter,
  fixCity
} = require("./CenterFixes");
const { centersCount, centers, getCentersWithParams, center, getEditedCenter } = require("./GettingCenters");
const { protectedCenters, updateProtectedCenter, addBusinessLicense, addLicensePic } = require("./GuildManagement");
const { addQualityRate, addPriceRate, addSalesmanRate, setExpertRate } = require("./ManageRates");
const { removeAOtherAddFromCenter, removeCenter, deletePicCenter } = require("./RemoveCenter");
const {
  addOnePicToCenter,
  updateCenter,
  setLocationForCenter,
  setOtherAddresses,
  setCenterLikes,
  setOwner
} = require("./SettingCenters");
const { uploadMiddleware } = require("../file/UploadMiddleware");

// const { addCenter, addPicToCenter, addOptions } = AddCenter;
// const {
//   fixOfficeDoctors,
//   fixedStaticMaps,
//   fixOtherAddressId,
//   fixCenterFullPath,
//   fixOtaghBazargani,
//   fixOtaghAsnafForCenter,
//   fixCity
// } = CenterFixes;
// const { centersCount, centers, getCentersWithParams, center, getEditedCenter } = GettingCenters;
// const { protectedCenters, updateProtectedCenter, addBusinessLicense, addLicensePic } = GuildManagement;
// const { addQualityRate, addPriceRate, addSalesmanRate, setExpertRate } = ManageRates;
// const { removeAOtherAddFromCenter, removeCenter, deletePicCenter } = RemoveCenter;
// const {
//   addOnePicToCenter,
//   updateCenter,
//   setLocationForCenter,
//   setOtherAddresses,
//   setCenterLikes,
//   setOwner
// } = SettingCenters;

// module.exports = {
//   addCenter,
//   addPicToCenter,
//   addOptions,

//   addQualityRate,
//   addPriceRate,
//   addSalesmanRate,
//   setExpertRate,

//   fixOfficeDoctors,
//   fixedStaticMaps,
//   fixOtherAddressId,
//   fixCenterFullPath,
//   fixOtaghBazargani,
//   fixOtaghAsnafForCenter,
//   fixCity
// };

exports.centerRoutes = (app, jsonParser, requireAuth, CheckLevel, uploadWithExt) => {
  app.get("/api/centers", jsonParser, centers);
  app.get("/api/protected/centers", jsonParser, requireAuth, CheckLevel.checkOfficer, protectedCenters);
  app.get("/api/center", jsonParser, center);
  app.get("/api/center/edited", jsonParser, requireAuth, CheckLevel.ckeckAdmin, getEditedCenter);
  app.post("/api/center/set/location", jsonParser, requireAuth, CheckLevel.checkOfficer, setLocationForCenter);
  app.post("/api/center/update/protected", jsonParser, requireAuth, CheckLevel.checkOfficer, updateProtectedCenter);
  app.get("/api/centers/params", jsonParser, getCentersWithParams);
  app.post("/api/center/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, addCenter);
  app.post("/api/center/add/pic", jsonParser, requireAuth, CheckLevel.ckeckAdmin, addPicToCenter);
  app.post("/api/center/add/business/license", jsonParser, requireAuth, CheckLevel.ckeckAdmin, addBusinessLicense);
  app.post("/api/center/edit", jsonParser, requireAuth, CheckLevel.ckeckAdmin, updateCenter);
  app.post("/api/center/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, removeCenter);
  app.post("/api/center/setexpertrate", jsonParser, requireAuth, CheckLevel.ckeckAdmin, setExpertRate);
  app.post("/api/center/addqualityrate", jsonParser, requireAuth, addQualityRate);
  app.post("/api/center/addpricerate", jsonParser, requireAuth, addPriceRate);
  app.post("/api/center/addsalesmanrate", jsonParser, requireAuth, addSalesmanRate);
  app.post("/api/center/addoptiontocenter", jsonParser, requireAuth, CheckLevel.ckeckAdmin, addOptions);
  app.post("/api/add/center/by/officer", jsonParser, requireAuth, CheckLevel.onlyOfficerEt, addCenterByOfficer);
  app.post("/api/center/set/address", jsonParser, requireAuth, CheckLevel.ckeckAdmin, setOtherAddresses);
  app.post("/api/center/set/owner", jsonParser, requireAuth, CheckLevel.ckeckAdmin, setOwner);
  app.post("/api/center/set/like", jsonParser, requireAuth, setCenterLikes);
  app.post("/api/center/delete/pic", jsonParser, requireAuth, CheckLevel.ckeckAdmin, deletePicCenter);
  app.get("/api/center/fix/other/address", jsonParser, fixOtherAddressId);
  app.post("/center/remove/other/address", jsonParser, requireAuth, CheckLevel.ckeckAdmin, removeAOtherAddFromCenter);
  app.put(
    "/api/center/add/one/pic",
    jsonParser,
    requireAuth,
    CheckLevel.ckeckAdmin,
    uploadWithExt.single("file"),
    uploadMiddleware,
    addOnePicToCenter
  );
  app.get("/api/centers/fix/office/doctors", jsonParser, fixOfficeDoctors);
  app.get("/api/centers/fix/static/map", jsonParser, fixedStaticMaps);
  app.get("/api/centers/fix/full/path", jsonParser, fixCenterFullPath);
  app.get("/api/fixed/centers/otagh/bazargani", fixOtaghBazargani);
  app.get("/api/fixed/centers/otagh/asnaf", fixOtaghAsnafForCenter);

  app.get("/api/center/get/count", jsonParser, requireAuth, CheckLevel.ckeckAdmin, centersCount);
};
