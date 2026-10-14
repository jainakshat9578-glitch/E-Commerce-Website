import {Router} from "express"
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";
import { register,login, googleCallBack, getMe } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register",validateRegisterUser,register)

router.post("/login",validateLoginUser,login)

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))

router.get("/google/callback",
    passport.authenticate("google",// yehi code responsible haii server ke pass se auth code lekar 
    {
    session:false,
    failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"}), // jayega google ke pass and user ka data lekar aayega!!!
    googleCallBack   
)

router.get("/me",authenticateUser,getMe)

export default router;