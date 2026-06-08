const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  customer_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Customer',     required: true },
  plan_id:         { type: mongoose.Schema.Types.ObjectId, ref: 'Plan',         required: true },
  amount:          { type: Number, required: true },
  status:          { type: String, enum: ['success', 'failed'], required: true },
  attempt_number:  { type: Number, default: 1 },
  error_message:   { type: String, default: null },
  processed_at:    { type: Date, default: Date.now },
});

paymentSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
