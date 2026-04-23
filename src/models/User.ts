import mongoose, { Schema, models } from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
}, { timestamps: true })

// hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

const User = models.User || mongoose.model('User', UserSchema)
export default User