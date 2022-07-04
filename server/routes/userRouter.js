const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const upload = require("../middleware/image_uploading");

router.post("/register", upload.single("image"), userCtrl.register); // body : firstName, lastName, email, password -> accesstoken

router.post("/login", userCtrl.login); // body : email, password -> accesstoken

router.get("/logout", userCtrl.logout); // -> msg

router.get("/refresh_token", userCtrl.refreshToken); // -> accesstoken

router.get("/getInfo", auth, userCtrl.getInfo);

module.exports = router;
