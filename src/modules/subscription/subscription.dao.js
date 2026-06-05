const Subscription = require('./subscription.model');

const POPULATE = [
  { path: 'customer_id', select: 'name email' },
  { path: 'plan_id',     select: 'name price interval' },
];

function toDTO(doc) {
  if (!doc) return null;
  const obj  = doc.toJSON ? doc.toJSON() : doc;
  const cust = obj.customer_id;
  const plan = obj.plan_id;
  return {
    id:                obj.id,
    customer_id:       typeof cust === 'object' ? cust.id  : String(cust || ''),
    plan_id:           typeof plan === 'object' ? plan.id  : String(plan || ''),
    status:            obj.status,
    next_billing_date: obj.next_billing_date,
    retry_count:       obj.retry_count,
    started_at:        obj.started_at,
    updated_at:        obj.updated_at,
    customer_name:     cust?.name,
    customer_email:    cust?.email,
    plan_name:         plan?.name,
    price:             plan?.price,
    interval:          plan?.interval,
  };
}

async function create({ customer_id, plan_id, status, next_billing_date }) {
  const doc = await Subscription.create({ customer_id, plan_id, status, next_billing_date });
  return toDTO(await doc.populate(POPULATE));
}

async function findById(id) {
  try {
    const doc = await Subscription.findById(id).populate(POPULATE);
    return toDTO(doc);
  } catch { return null; }
}

async function findAll({ status, customer_id, limit = 50, offset = 0 } = {}) {
  const filter = {};
  if (status)      filter.status      = status;
  if (customer_id) filter.customer_id = customer_id;
  const docs = await Subscription.find(filter)
    .populate(POPULATE).sort({ started_at: -1 }).skip(offset).limit(limit);
  return docs.map(toDTO);
}

async function findDue() {
  const docs = await Subscription.find({
    status:            { $in: ['active', 'trialing', 'failed'] },
    next_billing_date: { $lte: new Date() },
  }).populate(POPULATE);
  return docs.map(toDTO);
}

async function updateById(id, fields) {
  try {
    const doc = await Subscription.findByIdAndUpdate(id, fields, { new: true }).populate(POPULATE);
    return toDTO(doc);
  } catch { return null; }
}

module.exports = { create, findById, findAll, findDue, updateById };
