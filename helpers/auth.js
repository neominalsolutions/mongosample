module.exports = function IsAuth(req, res, next) {

  console.log('req?.isAuthenticated', req?.isAuthenticated);


  if (req?.isAuthenticated()) {
    next(); // sürece devam et
  } else {
    res.redirect('/users/login')
  }
}


// module.exports = function IsAdmin(req, res, next) {

//   console.log('req?.isAuthenticated', req?.isAuthenticated);


//   if (req?.user?.role.includes('Admin')) {
//     next(); // sürece devam et
//   } else {
//     res.redirect('/users/login')
//   }
// }
