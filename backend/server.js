const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:8081",
  credentials: true,
}));

app.use(express.json());

const RecentlyViewedRoutes = require("./routes/RecentlyViewedRoutes");
const userrouter = require("./routes/Userroutes");
const categoryrouter = require("./routes/Categoryroutes");
const productrouter = require("./routes/Productroutes");
const Bagroutes = require("./routes/Bagroutes");
const Wishlistroutes = require("./routes/Wishlistroutes");
const OrderRoutes = require("./routes/OrderRoutes");
const SavedRoutes = require("./routes/SavedRoutes");
const RecommendationRoutes = require("./routes/RecommendationRoutes");
const NotificationRoutes = require("./routes/NotificationRoutes");
require("./jobs/CartReminderJob");
app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.use("/recently-viewed", RecentlyViewedRoutes);
console.log(userrouter);
app.use("/user", userrouter);
app.use("/category", categoryrouter);
app.use("/product", productrouter);
app.use("/bag", Bagroutes);
app.use("/wishlist", Wishlistroutes);
app.use("/Order", OrderRoutes);
app.use("/saved", SavedRoutes);
app.use("/recommendations", RecommendationRoutes);
app.use("/notification", NotificationRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.log);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
app.post("/hello", (req, res) => {
  console.log("HELLO HIT");
  res.json({ message: "Hello Working" });
});