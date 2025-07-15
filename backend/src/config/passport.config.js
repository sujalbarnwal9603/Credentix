import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {User} from "../models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

// Serialize user to save in session

passport.use(
    
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async(accessToken, refreshToken, profile, done)=>{
            try{
                const email= profile.emails[0].value;
                let user = await User.findOne({ email});

                if(!user){
                    user= await User.create({
                        fullName: profile.displayName,
                        email,
                        password: "google-oauth", // dummy password for OAuth users
                        tenant: process.env.DEFAULT_TENANT_ID /* assign a default tenant ID */,
                        role: process.env.DEFAULT_ROLE_ID /* assign a default role ID */,
                        isVerified:true, // assuming Google users are verified
                    });
                }

                return done(null, user);
            }catch(error){
                return done(error, null);
            }
        }
    )
);

export default passport;