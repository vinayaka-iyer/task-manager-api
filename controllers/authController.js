const User = require('../models/User')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'my_jwt_secret'


const register = async (req, res) => {
    const {username, password} = req.body
    if (!username || !password){
        return res.status(400).json({
            message: 'Username and Password is required'
        })
    }

    try {
        const existingUser = await User.findOne({username})
        if (existingUser){
            return res.status(400).json({message: 'Username already exists', user: existingUser.username})
        }
        const user = new User({username, password})
        await user.save()
        res.status(201).json({message: 'User resgisted successfully.'})
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message})
    }
}

const login = async (req, res) => {
    const {username, password} = req.body
    if (!username || !password){
        return res.status(400).json({
            message: 'Username and Password is required'
        })
    }
    try {
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json({message: 'Invalid username or password'})
        }

        const isMatch = await user.comparePassword(password)
        if( !isMatch ){
            return res.status(400).json({message: 'Invalid username or password'})
        }

        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            },
            JWT_SECRET,
            { expiresIn: '30d' })
        res.status(200).json({ message: 'Login successful', token });


    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message})
    }
}

module.exports = {login, register}