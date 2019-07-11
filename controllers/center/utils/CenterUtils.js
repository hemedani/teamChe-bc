const download = require("image-downloader");
const uuidv4 = require("uuid/v4");

// TODO whenever i can i want to change static map to open street map ==================
const StaticMapApi = "AIzaSyCxOHHEJ0dio2EAIAxeKzUnPimk7GNJpn0";

// https://static-maps.yandex.ru/1.x/?lang=en-US&ll=32.810152,39.889847&%20\%20size=450,450&z=16&l=map&pt=32.810152,39.889847,pm2rdl
const YandexStaticMapUrl = (lat, lng) =>
  `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&%20\%20size=450,450&z=16&l=map&pt=${lng},${lat},pm2rdl`;

const GoogleStaticMapUrl = (lat, lng) =>
  `https://maps.googleapis.com/maps/api/staticmap?language=fa&center=${lat},${lng}&zoom=16&size=640x400&maptype=roadmap&markers=icon:https://pasteboard.co/IagJJEM.png%7C${lat},${lng}&key=${StaticMapApi}`;

const updateStaticMap = async (lat, lng) => {
  const staticMapImgName = `${uuidv4()}.png`;

  const mapOptions = {
    url: YandexStaticMapUrl(lat, lng),
    dest: `./pic/maps/${staticMapImgName}`
  };

  try {
    await download.image(mapOptions);
  } catch (error) {
    console.log("==================");
    console.log("error", error);
    console.log("==================");
  }

  return staticMapImgName;
};

module.exports = {
  StaticMapApi,
  YandexStaticMapUrl,
  GoogleStaticMapUrl,
  updateStaticMap
};

// db.createUser( { user: "SydAdmin", pwd: "1195Blue20Shah509@#5543MahSOS", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ] })

// db.createUser( { user: "TeamCheAdmin", pwd: "Blue1195ShahBottle509", roles: [ { role: "readWrite", db: "TeamChe" }, { role: "read", db: "reporting" } ] })

// sudo ln -s /etc/nginx/sites-available/teamche.com.conf /etc/nginx/sites-enabled/teamche.com.conf
