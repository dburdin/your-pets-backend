// const jwt = require("jsonwebtoken");

//* Дістати модель юзера
// const {
//   User: { User },
// } = require("../models");
//* ------------------------

// const { HttpError } = require("../helpers");

// const { SECRET_KEY } = process.env;

// const authenticate = async (req, res, next) => {
//   const { authorization = "" } = req.headers;
//   const [bearer, token] = authorization.split(" ");

//   if (bearer !== "Bearer" || token === "") {
//     next(HttpError(401));
//   }

//   try {
//     const { id } = jwt.verify(token, SECRET_KEY);
//* Тут знаходимо авторизованого
//     const user = await User.findById(id);
//* ------------------------

//     if (!user || !user.token || user.token !== token) {
//       next(HttpError(401));
//     }

//     req.user = user;

//     next();
//   } catch {
//     next(HttpError(401));
//   }
// };

// module.exports = authenticate;
