const axios = require('axios')
const { GraphQLID } = require('graphql')

const userData = async (req, res, next) => {
    if (!req.verifiedUser) {
        next()
        return
    }

    const query = `
        query user($id: ID!) { 
            user( id: $id ) {
                id,
                quizzes {
                    id,
                    slug,
                    title,
                    description,
                    questions {
                        title,
                        order,
                        correctAnswer
                    },
                    submissions {
                        score,
                        userId
                    },
                    avgScore
                },
                submissions {
                    id,
                    userId,
                    quiz {
                        title
                    }
                    avgScore
                }
            } 
        }`
    console.log(req.verifiedUser.user._id)
    let data = {}
    try {
        data = await axios.post(process.env.GRAPHQL_ENDPOINT, 
        { 
            query,
            variables: {
                id: req.verifiedUser.user._id
            }
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }); 
    } catch(e) {
        e.response.data.errors.forEach(err => console.log(err.message, err.locations) )
    }

    req.verifiedUser.user.quizzes = data.data.data.user?.quizzes ?? []
    req.verifiedUser.user.submissions = data.data.data.user?.submissions ?? []

    next()
}

module.exports = { userData }

