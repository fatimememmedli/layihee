// const jwt = require("jsonwebtoken");
// const userAuthMidd=(req, res, next) =>{
//     const token =req.headers.authorization.split(" ")[1]
//     console.log(token)
//     jwt.verify(token, process.env.TOKEN, (err, user) => {
//             console.log(err)
//             if (err) return res.sendStatus(403)
//             req.user = user
//             next()
//           })
// }
// module.exports= userAuthMidd