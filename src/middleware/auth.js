const jwt = require('jsonwebtoken');
const unprotectedRoutes = [ '/auth/login', '/auth/register', 'graphql' ]

const authenticate = async (req, res, next) => {
    const token = req.cookies?.jwtToken || ""

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.verifiedUser = verified
        console.log('user Verification Successful', verified)
        next()
    } catch (err) {
        console.log('User Verification failed', err)

        if (unprotectedRoutes.includes(req.path)) {
            next()
        }else{
            res.redirect('/auth/login')
        }
    }
}

module.exports = { authenticate }