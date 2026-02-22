import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        username: {
          type: String,
          required: true,
          unique: true,
        },
        fullName: {
          type: String,
          required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        telephone: {
          type: String,
          required: false,
        },
        birthday: {
            type: Date,
            required: false,
        },  
        city: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: false,
        },
        role: {
            type: String,
            enum: ['athlete', 'coach', 'beginner'],
            default: 'athlete',
            required:false,
        },
        height : {
            type: Number,
            required: false,
        },
        weight : {
           type: Number,
           required: false,
        },
        age : {
            type: Number,
            required: false,
        },
        experience: {
           type: Number,
           required: false,
        },
        fitnessGoals: {
            type: String,
            required: false,
        },
        activityLevel: {
            type: String,
            required: false,
        },

        achievements: {
            achievements: [String],
            default: [],
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],

    },
    { timestamps: true },
)

export default mongoose.model('User', UserSchema)
