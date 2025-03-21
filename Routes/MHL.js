const express = require("express");
const router = express.Router();
const{getMatch,postMatch}=require("../Controllers/MHlcontroller.js")

router.get("/get",getMatch);
router.post("/post",postMatch);


module.exports=router;