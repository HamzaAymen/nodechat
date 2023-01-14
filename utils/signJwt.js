import jwt from "jsonwebtoken";

const signJWT = (user, res) => {
  const { userId, username } = user;

  const payload = { userId, username };
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "14d",
  });

  res.cookie("token", accessToken, {
    httpOnly: true, // This Boolean parameter flags the cookie to be only used by the web server.
    maxAge: 1000 * 3600 * 24 * 14, // maxAge for the browser to handle expiration after 14 days
  });
};

export { signJWT };
