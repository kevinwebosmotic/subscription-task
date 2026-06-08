const Payment = require('./payment.model');

const POPULATE = [
  { path: 'customer_id', select: 'name email' },
  { path: 'plan_id',     select: 'name' },
];

function toDTO(doc) {
  if (!doc) return null;
  const obj  = doc.toJSON ? doc.toJSON() : doc;
  const cust = obj.customer_id;
  const plan = obj.plan_id;
  const sub  = obj.subscription_id;
  return {
    id:              obj.id,
    subscription_id: sub  ? (typeof sub  === 'object' ? sub.id  : String(sub))  : null,
    customer_id:     cust ? (typeof cust === 'object' ? cust.id : String(cust)) : null,
    plan_id:         plan ? (typeof plan === 'object' ? plan.id : String(plan)) : null,
    amount:          obj.amount,
    status:          obj.status,
    attempt_number:  obj.attempt_number,
    processed_at:    obj.processed_at,
    error_message:   obj.error_message,
    customer_name:   cust?.name,
    customer_email:  cust?.email,
    plan_name:       plan?.name,
  };
}

async function create({ subscription_id, customer_id, plan_id, amount, status, attempt_number, error_message }) {
  const doc = await Payment.create({
    subscription_id, customer_id, plan_id,
    amount, status, attempt_number,
    error_message: error_message || null,
  });
  return toDTO(await doc.populate(POPULATE));
}

async function findById(id) {
  try {
    const doc = await Payment.findById(id).populate(POPULATE);
    return toDTO(doc);
  } catch { return null; }
}

async function findAll({ customer_id, subscription_id, status, limit = 50, offset = 0 } = {}) {
  const filter = {};
  if (customer_id)     filter.customer_id     = customer_id;
  if (subscription_id) filter.subscription_id = subscription_id;
  if (status)          filter.status          = status;
  const docs = await Payment.find(filter)
    .populate(POPULATE).sort({ processed_at: -1 }).skip(offset).limit(limit);
  return docs.map(toDTO);
}

module.exports = { create, findById, findAll };
