const bodyParser = require("body-parser");
const passportService = require("./service/passport");
const passport = require("passport");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const Authentication = require("./controllers/Authentication");
const CityController = require("./controllers/CityController");
const ParishController = require("./controllers/ParishController");
const WareTypeController = require("./controllers/WareTypeController");
const OptionController = require("./controllers/OptionController");
const InspectionController = require("./controllers/InspectionController");
const PromotionController = require("./controllers/PromotionController");
const WareOptionController = require("./controllers/WareOptionController");
const RateController = require("./controllers/RateController");
const VoteController = require("./controllers/VoteController");
const WareController = require("./controllers/WareController");
const CartController = require("./controllers/CartController");
const MassageController = require("./controllers/MassageController");
const PurchaseController = require("./controllers/PurchaseController");
const DeliveryController = require("./controllers/DeliveryController");
const StateController = require("./controllers/StateController");

const RasteController = require("./controllers/RasteController");
const OtaghAsnafController = require("./controllers/OtaghAsnafController");
const OtaghBazarganiController = require("./controllers/OtaghBazarganiController");

const ReportController = require("./controllers/ReportController");

const CheckLevel = require("./service/CheckLevel");

const { centerRoutes } = require("./controllers/center");
const { fileRoutes } = require("./controllers/file");
const { etehadiyeRoutes } = require("./controllers/etehadiye");

const storage = multer.diskStorage({
  destination: "./pic/orginal/",
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);

      cb(null, raw.toString("hex") + Date.now() + path.extname(file.originalname));
    });
  }
});

const upload = multer({ dest: "pic/orginal/" });

const uploadWithExt = multer({ storage: storage });

var jsonParser = bodyParser.json();

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = app => {
  app.post("/api/login", jsonParser, requireSignin, Authentication.login);
  app.post("/api/register", jsonParser, Authentication.register);
  app.post("/api/login/withmob", jsonParser, Authentication.loginWithMob);
  app.post("/api/login/with/captcha", jsonParser, Authentication.loginWithCaptcha);
  app.post("/api/login/acceptkey", jsonParser, Authentication.acceptKey);
  app.post("/api/user/remove", jsonParser, requireAuth, Authentication.removeUser);

  app.get("/api/users", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.users);
  app.get("/api/user/getown", requireAuth, Authentication.getOwnUser);
  app.get("/api/users/withlevel", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.getUsersWithLevel);
  app.post("/api/user/editown", jsonParser, requireAuth, Authentication.editOwnUser);
  app.post("/api/user/add/address", jsonParser, requireAuth, Authentication.addAddressToUser);
  app.post("/api/user/remove/address", jsonParser, requireAuth, Authentication.removeAddressFromUser);
  app.post("/api/user/edit", jsonParser, requireAuth, Authentication.editUser);
  app.post("/api/user/edit/pass", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.editUserPass);
  app.post("/api/user/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.addUser);
  app.post("/api/user/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.removeUser);
  app.post("/api/users/withsearch", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.getUsersWithSearch);

  centerRoutes(app, jsonParser, requireAuth, CheckLevel, uploadWithExt);
  fileRoutes(app, requireAuth, uploadWithExt);
  etehadiyeRoutes(app, jsonParser, requireAuth, CheckLevel, uploadWithExt);

  // ======================= {{ city Sections }} ================================================================
  app.get("/api/cities", jsonParser, CityController.cities);
  app.post("/api/city/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, CityController.addCity);
  app.post("/api/city/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, CityController.removeCity);

  // ======================= {{ parish Sections }} ================================================================
  app.get("/api/parishes", jsonParser, requireAuth, ParishController.parishes);
  app.post("/api/parish/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, ParishController.addParish);
  app.post("/api/parish/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, ParishController.removeParish);
  app.post("/api/parish/update", jsonParser, requireAuth, ParishController.updateParish);
  app.get("/api/parish/repair", ParishController.repairParish);

  // TODO check organization id with sended otagh asnag id (req.user.asOrganization with req.body.otaghAsnaf in checklevel.chechAsOrg) ==================
  // ======================= {{ rastes Sections }} ================================================================
  app.get("/api/rastes", jsonParser, requireAuth, RasteController.Rastes);
  app.post("/api/raste/add", jsonParser, requireAuth, CheckLevel.checkAsOrg, RasteController.addRaste);
  app.post("/api/raste/update", jsonParser, requireAuth, CheckLevel.checkAsOrg, RasteController.updateRaste);
  app.post("/api/raste/remove", jsonParser, requireAuth, CheckLevel.checkAsOrg, RasteController.removeRaste);

  // ======================= {{ otaghAsnafs Sections }} ================================================================
  app.get("/api/otaghAsnafs", jsonParser, OtaghAsnafController.OtaghAsnafs);
  app.get("/api/get/otagh/asnaf", jsonParser, OtaghAsnafController.getOtaghAsnaf);
  app.post("/api/otaghAsnaf/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, OtaghAsnafController.addOtaghAsnaf);
  app.post("/api/otaghAsnaf/update", jsonParser, requireAuth, CheckLevel.ckeckAdmin, OtaghAsnafController.updateOtaghAsnaf);
  app.post(
    "/api/otaghAsnaf/add/operator",
    jsonParser,
    requireAuth,
    CheckLevel.ckeckAdmin,
    OtaghAsnafController.addOperatorAs
  );
  app.post("/api/otaghAsnaf/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, OtaghAsnafController.removeOtaghAsnaf);

  // ======================= {{ reports Sections }} ================================================================
  app.get("/api/reports", jsonParser, ReportController.reports);
  app.get("/api/report", jsonParser, ReportController.report);
  app.post("/api/report/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, ReportController.addReport);
  app.post("/api/report/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, ReportController.removeReport);

  // ======================= {{ otaghBazarganis Sections }} ================================================================
  app.get("/api/otaghBazarganis", jsonParser, OtaghBazarganiController.OtaghBazarganis);
  app.post(
    "/api/otaghBazargani/add",
    jsonParser,
    requireAuth,
    CheckLevel.ckeckAdmin,
    OtaghBazarganiController.addOtaghBazargani
  );
  app.post(
    "/api/otaghBazargani/update",
    jsonParser,
    requireAuth,
    CheckLevel.ckeckAdmin,
    OtaghBazarganiController.updateOtaghBazargani
  );
  app.post(
    "/api/otaghBazargani/remove",
    jsonParser,
    requireAuth,
    CheckLevel.ckeckAdmin,
    OtaghBazarganiController.removeOtaghBazargani
  );

  app.get("/api/wareTypes", jsonParser, WareTypeController.wareTypes);
  app.post("/api/wareType/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareTypeController.addWareType);
  app.post("/api/wareType/update", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareTypeController.updateWareType);
  app.post("/api/wareType/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareTypeController.removeWareType);

  app.get("/api/ware/next", jsonParser, WareController.nextWare);
  app.get("/api/ware/wares", jsonParser, WareController.wares);
  app.get("/api/ware/previous", jsonParser, WareController.previousWare);
  app.get("/api/ware/getbyid", jsonParser, WareController.ware);
  app.get("/api/wares/get/center", jsonParser, WareController.centerWares);
  app.post("/api/ware/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareController.addWare);
  app.post("/api/ware/edit", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareController.updateWare);
  app.post("/api/ware/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareController.removeWare);

  // ======================= {{ Inspection Sections }} ================================================================
  app.post("/api/inspection/add", jsonParser, requireAuth, CheckLevel.checkOfficer, InspectionController.addInspection);
  app.get("/api/inspection/inspections", jsonParser, requireAuth, CheckLevel.checkOfficer, InspectionController.inspections);
  app.get("/api/inspection/inspection", jsonParser, requireAuth, CheckLevel.checkOfficer, InspectionController.inspection);

  // ======================= {{ Options Sections }} ================================================================
  app.get("/api/options", jsonParser, OptionController.options);
  app.get("/api/yourOption", jsonParser, OptionController.yourOption);
  app.post("/api/option/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, OptionController.addOption);
  app.post("/api/option/update", jsonParser, requireAuth, CheckLevel.ckeckAdmin, OptionController.updateOption);
  app.post("/api/option/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, OptionController.removeOption);

  app.get("/api/option/ware/options", jsonParser, WareOptionController.wareOptions);
  app.get("/api/option/ware/option", jsonParser, WareOptionController.wareOption);
  app.post("/api/option/ware/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareOptionController.addWareOption);
  app.post("/api/option/ware/update", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareOptionController.updateWareOption);
  app.post("/api/option/ware/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, WareOptionController.removeWareOption);

  // ======================= {{ Promotion Sections }} ================================================================
  app.get("/api/promotions", jsonParser, PromotionController.promotions);
  app.get("/api/yourPromotion", jsonParser, PromotionController.yourPromotion);
  app.get("/api/promotion/paginate", jsonParser, requireAuth, CheckLevel.ckeckAdmin, PromotionController.promotionsPaginate);
  app.post("/api/promotion/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, PromotionController.addPromotion);
  app.post("/api/promotion/update", jsonParser, requireAuth, CheckLevel.ckeckAdmin, PromotionController.updatePromotion);
  app.post("/api/promotion/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, PromotionController.removePromotion);

  // ======================= {{ Massages Sections }} ================================================================
  app.get("/api/massages", jsonParser, requireAuth, CheckLevel.ckeckAdmin, MassageController.massages);
  app.post("/api/massage/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, MassageController.addMassage);
  app.post("/api/massage/read", jsonParser, requireAuth, CheckLevel.ckeckAdmin, MassageController.readMassage);
  app.post("/api/massage/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, MassageController.removeMassage);

  app.get("/api/rates", jsonParser, RateController.rates);
  app.get("/api/rates/ware", jsonParser, RateController.wareRates);
  app.get("/api/rates/yourrate", jsonParser, requireAuth, RateController.yourRate);
  app.get("/api/rates/your/ware/rate", jsonParser, requireAuth, RateController.yourWareRate);
  app.get("/api/rates/notaccepted", jsonParser, requireAuth, RateController.notAcceptedRate);
  app.post("/api/rates/acceptRate", jsonParser, requireAuth, RateController.acceptRate);
  app.post("/api/rates/set/reply", jsonParser, requireAuth, CheckLevel.ckeckAdmin, RateController.replyRate);
  app.post("/api/rates/deniedRate", jsonParser, requireAuth, CheckLevel.ckeckAdmin, RateController.deniedRate);
  app.post("/api/rates/just/denied", jsonParser, requireAuth, CheckLevel.ckeckAdmin, RateController.justDeniedRate);
  app.post("/api/rates/addtext", jsonParser, requireAuth, RateController.addTextRate);
  app.post("/api/rates/addtext/with/centerid", jsonParser, requireAuth, RateController.addTextRateWithCenterId);
  app.post("/api/rates/add/ware/text", jsonParser, requireAuth, RateController.addTextRateToWare);
  app.post("/api/rates/change/ware/rate", jsonParser, requireAuth, RateController.changeWareRate);

  app.post("/api/vote/add", jsonParser, requireAuth, VoteController.addVote);

  app.get("/api/deliveries", jsonParser, DeliveryController.deliveries);
  app.post("/api/delivery/add", jsonParser, requireAuth, CheckLevel.ckeckAdmin, DeliveryController.AddDelivery);
  app.post("/api/delivery/update", jsonParser, requireAuth, CheckLevel.ckeckAdmin, DeliveryController.updateDelivery);
  app.post("/api/delivery/remove", jsonParser, requireAuth, CheckLevel.ckeckAdmin, DeliveryController.removeDelivery);

  app.get("/api/carts/get/cart", jsonParser, requireAuth, CartController.getCart);
  app.post("/api/carts/add/to/cart", jsonParser, requireAuth, CartController.addToCart);
  app.post("/api/carts/remove/from/cart", jsonParser, requireAuth, CartController.removeFromCart);
  app.post("/api/carts/add/to/address", jsonParser, requireAuth, CartController.addAddressToCart);
  app.post("/api/carts/final/register", jsonParser, requireAuth, CartController.finalRegister);

  app.post("/api/purchase/register", jsonParser, requireAuth, PurchaseController.registerPurchase);
  app.get("/api/purchase/get/purchase", jsonParser, requireAuth, PurchaseController.getPurchase);
  app.get("/api/purchase/get/own/purchases", jsonParser, requireAuth, PurchaseController.getOwnPurchases);
  app.get(
    "/api/purchase/get/all/purchases",
    jsonParser,
    requireAuth,
    CheckLevel.ckeckAdmin,
    PurchaseController.getAllPurchases
  );
  app.post("/api/purchase/send/zarinpal", jsonParser, PurchaseController.payPurchase);
  app.post("/api/purchase/check/zarinpal", jsonParser, PurchaseController.checkPay);

  app.get("/api/states", jsonParser, StateController.states);
  app.post("/api/state/add", jsonParser, requireAuth, StateController.AddState);
  app.post("/api/state/update", jsonParser, requireAuth, StateController.updateState);
  app.post("/api/state/remove", jsonParser, requireAuth, StateController.removeState);

  // count methods

  app.get("/api/user/get/count", jsonParser, requireAuth, CheckLevel.ckeckAdmin, Authentication.usersCount);

  // ======================= {{ Fixed Method Sections }} ================================================================
};
