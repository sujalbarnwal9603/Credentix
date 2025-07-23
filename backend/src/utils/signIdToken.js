import fs from "fs"
import path from "path"
import { SignJWT, importPKCS8 } from "jose"

const privateKeyPath = path.resolve("src/keys/private.pem")
const privateKeyPEM = fs.readFileSync(privateKeyPath, "utf8")

const ALG = "RS256"

export const signIdToken = async (user, client_id) => {
  try {
    const privateKey = await importPKCS8(privateKeyPEM, ALG)
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = 60 * 15 // ✅ Fixed variable name (was expressIn)

    const jwt = await new SignJWT({
      sub: user._id.toString(),
      email: user.email,
      name: user.fullName,
      email_verified: user.isVerified,
      tenant: user.tenant?.name || user.tenant,
      role: user.role?.name || user.role,
    })
      .setProtectedHeader({ alg: ALG, typ: "JWT", kid: "credentix-key-1" })
      .setIssuedAt(now)
      .setExpirationTime(now + expiresIn)
      .setIssuer(process.env.ISSUER || "http://localhost:8000")
      .setAudience(client_id)
      .sign(privateKey)

    return jwt
  } catch (error) {
    console.error("❌ Error signing ID token:", error)
    throw new Error("Failed to sign ID token")
  }
}
