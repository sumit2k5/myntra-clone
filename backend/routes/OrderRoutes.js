const PDFDocument = require("pdfkit");
const { stringify } = require("csv-stringify");
const Product = require("../models/Product");
const express = require("express");
const Bag = require("../models/Bag");
const Order = require("../models/Order");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

const {
  sendNotification,
} = require("../services/NotificationService");

function genrateRandomTracking() {
  const carriers = ["Delhivery", "Bluedart", "Ecom Express", "XpressBees"];
  const statusOptions = [
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "In Transit",
  ];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune"];
  const randomcarrier = carriers[Math.floor(Math.random() * carriers.length)];
  const randomstatusOptions =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const randomlocations =
    locations[Math.floor(Math.random() * locations.length)];

  return {
    number: "TRK" + Math.floor(Math.random() * 10000000),
    carrier: randomcarrier,
    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    currentLocation: randomlocations,
    status: randomstatusOptions,
    timeline: [
      {
        status: "Order placed",
        location: "Warehouse",
        timestamp: new Date().toISOString(),
      },
      {
        status: randomstatusOptions,
        location: randomlocations,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
router.post("/create/:userId", async (req, res) => {
  let session;

  try {
    const userid = req.params.userId;

    session = await mongoose.startSession();
    session.startTransaction();

    const bag = await Bag.find({ userId: userid })
      .populate("productId")
      .session(session);
      console.log(JSON.stringify(bag, null, 2));

    if (bag.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "No item in the bag",
      });
    }

    // Validation
    for (const bagItem of bag) {

      if (!bagItem.productId) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: "A product in your bag no longer exists.",
        });
      }

      const latestProduct = await Product.findById(
        bagItem.productId._id
      ).session(session);

      if (!latestProduct) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: `${bagItem.productId.name} not found.`,
        });
      }

      if (!latestProduct.isAvailable) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: `${latestProduct.name} has been discontinued.`,
        });
      }

      if (latestProduct.stock < bagItem.quantity) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: `${latestProduct.name} has only ${latestProduct.stock} item(s) left.`,
        });
      }

      // Price Change Detection
      if (latestProduct.price !== bagItem.priceAtAdded) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          message: `Price of ${latestProduct.name} changed from ₹${latestProduct.price} to ₹${bagItem.priceAtAdded}. Please review your cart.`,
        });
      }
    }

    const orderitem = bag.map((item) => ({
      productId: item.productId._id,
      size: item.size,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const total = orderitem.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId: userid,
      date: new Date().toISOString(),
      status: "Processing",
      items: orderitem, // <-- fixed
      total,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      tracking: genrateRandomTracking(),
      auditLogs: [
  {
    action: "ORDER_CREATED",
    message: "Order created successfully.",
  },
],
    });

    await newOrder.save({ session });
    const currentUser = await User.findById(userid);

if (
  currentUser &&
  currentUser.notificationEnabled
) {
  await sendNotification(
    currentUser.expoPushToken,
    "Order Confirmed 🎉",
    "Your order has been placed successfully."
  );

  currentUser.lastNotification =
    new Date();

  await currentUser.save();
}

    await Bag.deleteMany(
      { userId: userid },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Order placed successfully",
    });

  } catch (error) {

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});
router.get("/user/:userid", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const sort = req.query.sort || "newest";

    const paymentStatus = req.query.paymentStatus;

    const status = req.query.status;

    const filter = {
      userId: req.params.userid,
    };

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (status) {
      filter.status = status;
    }

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("items.productId")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      orders,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
router.get("/export/csv/:userid", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userid,
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv"
    );

    res.setHeader("Content-Type", "text/csv");

    const stringifier = stringify({
      header: true,
      columns: [
        "Invoice ID",
        "Transaction ID",
        "Payment Method",
        "Payment Status",
        "Amount",
        "Order Status",
        "Date",
      ],
    });

    stringifier.pipe(res);

    orders.forEach((order) => {
      stringifier.write([
        order.invoiceId,
        order.transactionId,
        order.paymentMethod,
        order.paymentStatus,
        order.total,
        order.status,
        order.createdAt,
      ]);
    });

    stringifier.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
router.get("/receipt/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${order.invoiceId}.pdf`
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    const doc = new PDFDocument();

    doc.pipe(res);

    doc.fontSize(22).text(
      "MYNTRA RECEIPT",
      {
        align: "center",
      }
    );

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Invoice ID: ${order.invoiceId}`);
    doc.text(`Transaction ID: ${order.transactionId}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Order Status: ${order.status}`);
    doc.text(`Date: ${order.createdAt}`);

    doc.moveDown();

    doc.fontSize(16).text("Items");

    doc.moveDown();

    order.items.forEach((item) => {
      doc.text(
        `${item.productId.name} | Qty: ${item.quantity} | ₹${item.price}`
      );
    });

    doc.moveDown();

    doc.fontSize(16);

    doc.text(`Total : ₹${order.total}`);

    doc.moveDown();

    doc.text(
      `Generated At : ${new Date().toLocaleString()}`
    );

    doc.end();

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
module.exports = router;