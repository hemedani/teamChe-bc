const { changeUserPic } = require("./ChageUserPic");
const { changeOptionPic } = require("./ChangeOptionPic");
const { changeRastePic } = require("./ChangeRastePic");
const { changeWareTypePic } = require("./ChangeWareTypePic");
const { testReadFile } = require("./TestReadFile");
const { upload } = require("./Upload");

exports.fileRoutes = (app, requireAuth, uploadWithExt) => {
  app.put("/api/upload", requireAuth, uploadWithExt.single("file"), upload);
  app.put("/api/change/raste/pic", requireAuth, uploadWithExt.single("file"), changeRastePic);
  app.put("/api/change/waretype/pic", requireAuth, uploadWithExt.single("file"), changeWareTypePic);
  // app.put('/change/center/pic', requireAuth, uploadWithExt.single( 'file' ), changeCenterPic)
  app.put("/api/change/option/pic", requireAuth, uploadWithExt.single("file"), changeOptionPic);
  app.put("/api/change/user/pic", requireAuth, uploadWithExt.single("file"), changeUserPic);
  app.get("/api/read/file", testReadFile);
};
