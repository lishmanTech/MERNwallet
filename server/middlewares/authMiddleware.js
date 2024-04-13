const jwt = require("jsonwebtoken")

//decode token 

// module.exports = function (req, res, next){
//   try {
//       const token = req.headers.authorization.split("")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.body.userId = decoded.userId;
//       next();
//   } catch (error) {
//      res.send({
//         message: error.message,
//         success: false,
//      });
//   }
// }
module.exports = async (req, res, next) => {
   try {
     const token = req.headers["authorization"].split(" ")[1];
     jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
       if (err) {
         return res.status(200).send({
           message: "Auth Fialed",
           success: false,
         });
       } else {
         req.body.userId = decode.userId;
         next();
       }
     });
   } catch (error) {
     console.log(error);
     res.status(401).send({
       message: "Auth Failed",
       success: false,
     });
   }
 };
 