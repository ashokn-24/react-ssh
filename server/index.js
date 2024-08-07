// index.js

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const querystring = require("querystring");
const { PublicClientApplication } = require("@azure/msal-node");

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
const microsoftRedirectURI =
  "https://localhost:3000/authentication/login-callback";

const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_CLIENT_TENANT_ID}`,
    redirectUri: "https://localhost:5173",
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

const pca = new PublicClientApplication(msalConfig);

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
      return res.redirect(
        `${clientUri}/auth/login?success=false&error=${error}`
      );
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
        expiresIn: 60 * 5,
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

    res.redirect(`http://localhost:5173/profile?accessToken=${accessToken}`);
  } catch (error) {
    console.log(error);
  }
});

// Microsoft Oauth
app.get("/microsoft", (req, res) => {
  res.send('<a href="/microsoft/auth">Login with Microsoft</a>');
});

app.get("/signin-microsoft", (req, res) => {
  const authCodeUrlParameters = {
    scopes: ["user.read"],
    redirectUri: "https://localhost:5173",
  };

  pca
    .getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      console.log(response);
      res.redirect(response);
    })
    .catch((error) => console.log(JSON.stringify(error)));
});

app.get("/authentication/login-callback", (req, res) => {
  console.log("wlecome microsoft");
  res.send("microsoft");
});

app.get("/api/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.session.user);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("failed to log out");
    }
    res.redirect("http://localhost:5173");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
