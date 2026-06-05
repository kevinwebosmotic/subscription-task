const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, maxlength: 120, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

customerSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Customer', customerSchema);
