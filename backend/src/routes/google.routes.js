import { Router } from "express";
import passport from "passport";

const router = Router();

// Step 1: Redirect to Google for authentication

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false // Disable session for stateless authentication
    })
);


// Step 2: Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, // Disable session for stateless authentication
  }),
  async (req, res) => {
    try {
      const user = req.user
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      // Optional: Save the refresh token in the user document
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      // ✅ Redirect to frontend with tokens
      res.redirect(`http://localhost:3000/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`)
    } catch (error) {
      console.error("OAuth callback error:", error)
      res.redirect("/login")
    }
  },
)

export default router;