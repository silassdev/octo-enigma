import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  emailVerified: Date,
  onboardingCompleted: { type: Boolean, default: false },
  jobTitle: String,
  company: String,
  phoneNumber: String,
  bio: String,
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);