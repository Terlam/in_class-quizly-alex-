const { GraphQLObjectType, GraphQLInputObjectType, GraphQLID, GraphQLString, 
    GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql');

const { User, Quiz, Question, Submission } = require('../models'); 

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User type',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        quizzes: {
            type:  new GraphQLList(QuizType), 
            resolve(parent, args) {
                return Quiz.find({userID: parent.id}) // Search through quiz model & look for user ID that matches the user's id (bring back all quizzes)
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType), 
            resolve(parent, args) {
                return Submission.find({userId: parent.id}) 
            }
        }
    })
})

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    description: 'Question type',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        correctAnswer: { type: GraphQLString },
        quizId: { type: GraphQLString },
        order: { type: GraphQLInt },
        quiz: {
            type: QuizType,
            resolve(parent, args) {
                return User.findById(parent.quizId)
            }
        }
    })
})

const QuestionInputType = new GraphQLInputObjectType({
    name: 'QuestionInput',
    description: 'Question input type',
    fields: () => ({
        title: { type: GraphQLString },
        order: { type: GraphQLInt },
        correctAnswer: { type: GraphQLString }
    })
})

const AnswerInputType = new GraphQLInputObjectType({
    name: 'AnswerInput',
    description: 'Answer input type', 
    fields: () => ({
        questionId: {type: GraphQLString },
        answer: {type: GraphQLString },
    })
})

const QuizType = new GraphQLObjectType({
    name: 'Quiz',
    description: 'Quiz type',
    fields: () => ({
        id: { type: GraphQLID },
        slug: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLString },
        user: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        },
        questions: { 
            type: new GraphQLList(QuestionType),
            resolve(parent, args) {
                return Question.find({ quizId: parent.id })
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parent, args) {
                return Submission.find({ quizId: parent.id })
            }
        },
        avgScore: {
            type: GraphQLFloat,
            async resolve(parent, args) {
                const submissionList = await Submission.find({ quizId: parent.id })
                let score = 0

                console.log(submissionList)
                for (const submission of submissionList) {
                        
                        score += submission.score
                }
                console.log(score,typeof(score), "👈🏾 score")
                 console.log(submissionList.length,"length of list")
                return (score / submissionList.length) || 0 // because you can't divide anything by zero (incase your submissionList is empty)
            }
        }
    })
})

const SubmissionType = new GraphQLObjectType({
    name: 'Submission',
    description: 'Submission Type',
    fields: () => ({
        id: {type: GraphQLID },
        quizId: { type: GraphQLString },
        userId: { type: GraphQLString },
        score: { type: GraphQLInt },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        },
        quiz: {
            type: QuizType,
            resolve(parent, args) {
                return Quiz.findById(parent.quizId)
            }
        }
    })
})

module.exports = {
    UserType,
    QuizType,
    QuestionType,
    QuestionInputType,
    AnswerInputType,
    SubmissionType
}