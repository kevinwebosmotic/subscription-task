const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    customer_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    plan_id:           { type: mongoose.Schema.Types.ObjectId, ref: 'Plan',     required: true },
    status:            { type: String, enum: ['active', 'trialing', 'failed', 'suspended', 'cancelled'], default: 'active' },
    next_billing_date: { type: Date, required: true },
    retry_count:       { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'started_at', updatedAt: 'updated_at' } }
);

subscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
