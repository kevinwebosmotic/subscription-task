const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, maxlength: 120, trim: true },
    description: { type: String, default: null },
    price:       { type: Number, required: true },
    interval:    { type: String, enum: ['monthly', 'yearly'], required: true },
    trial_days:  { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

planSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Plan', planSchema);
