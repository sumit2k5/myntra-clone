const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const TimelineSchema = new mongoose.Schema({
  status: String,
  location: String,
  timestamp: String,
});

const TrackingSchema = new mongoose.Schema({
  number: String,
  carrier: String,
  estimatedDelivery: String,
  currentLocation: String,
  status: String,
  timeline: [TimelineSchema],
});

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  size: String,
  price: Number,
  quantity: Number,
});

// ✅ MOVE THIS HERE (before OrderSchema)
const AuditLogSchema = new mongoose.Schema({
  action: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  message: String,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    date: String,

    status: String,

    items: [OrderItemSchema],

    total: Number,

    shippingAddress: String,

    paymentMethod: String,

    tracking: TrackingSchema,

    invoiceId: {
      type: String,
      default: () => uuidv4(),
    },

    transactionId: {
      type: String,
      default: () => uuidv4(),
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Success",
    },

    receiptGenerated: {
      type: Boolean,
      default: false,
    },

    auditLogs: [AuditLogSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);