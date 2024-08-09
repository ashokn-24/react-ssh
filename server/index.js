// index.js

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { ConfidentialClientApplication } = require("@azure/msal-node");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const graphMeEndpoint = "https://graph.microsoft.com/v1.0/me";
const microsoftRedirectURI = "http://localhost:3000/auth/microsoft/callback"; // https://localhost:3000/authentication/login-callback
const clientUri = "http://localhost:5173";

const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/consumers`, // MICROSOFT_CLIENT_TENANT_ID
    redirectUri: microsoftRedirectURI,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    tokenRenewalOffsetSeconds: 300,
  },
};

const pca = new ConfidentialClientApplication(msalConfig);

// Routes
app.get("/auth/google", (req, res) => {
  const scope = ["profile", "email"];
  try {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: scope,
    });

    res.redirect(url);
  } catch (error) {
    console.log(error);
  }
});

app.get("/auth/google/callback", async (req, res) => {
  const { code, error } = req.query;

  try {
    if (error) {
      return res.redirect(`${clientUri}/?success=false&error=${error}`);
    }

    const { tokens } = await client.getToken(code);

    if (!tokens || !tokens.id_token) {
      return res.status(400).send("Failed to retrieve tokens.");
    }

    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    req.session.user = {
      displayName: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    //authentication
    const accessToken = jwt.sign(
      req.session.user,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      req.session.user,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("rftkn", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.redirect(`${clientUri}/profile?accessToken=${accessToken}`);
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.status(500).send("Authentication failed.");
  }
});

// Microsoft Oauth
app.get("/auth/microsoft", (req, res) => {
  const authCodeUrlParameters = {
    scopes: ["user.read"],
    redirectUri: microsoftRedirectURI,
  };

  pca
    .getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      res.redirect(response);
    })
    .catch((error) => {
      console.error("Error generating Microsoft auth URL:", error);
      res.status(500).send("Failed to initiate Microsoft authentication.");
    });
});

//https://localhost:3000/signin-microsoft
app.get("/auth/microsoft/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error("Microsoft OAuth error:", error);
    return res.redirect(`${clientUri}/?success=false&error=${error}`);
  }

  const tokenRequest = {
    code,
    redirectUri: microsoftRedirectURI,
    scopes: ["user.read"],
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  };

  try {
    const response = await pca.acquireTokenByCode(tokenRequest);

    if (!response.accessToken) {
      throw new Error("Access token is missing from the response.");
    }

    // const data = response.idTokenClaims;
    // console.log("Access Token:", response.accessToken);
    // console.log(response);

    const userResponse = await fetch(graphMeEndpoint, {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });
    const userPfp = await fetch(`${graphMeEndpoint}/me/photo/$value`, {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });

    const buffer = await userPfp.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    if (!userResponse.ok) {
      throw new Error(`Microsoft Graph API error: ${userResponse.status}`);
    }

    const userProfile = await userResponse.json();

    console.log(userProfile);

    req.session.user = {
      displayName: userProfile.displayName,
      email: userProfile.mail,
      picture: imageUrl,
    };

    const accessToken = jwt.sign(
      req.session.user,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      req.session.user,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("rftkn", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.redirect(`${clientUri}/profile?accessToken=${accessToken}`);
  } catch (error) {
    console.error("Error during Microsoft OAuth callback:", error);
    res.status(500).send("Authentication failed.");
  }
});

app.get("/api/profile", (req, res) => {
  if (!req.session || !req.session.user) {
    console.warn("User is not authenticated or session does not exist.");
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.session.user);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Failed to log out.");
    }
    res.clearCookie("rftkn");
    res.redirect("http://localhost:5173");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
