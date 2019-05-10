/* eslint-disable consistent-return */

"use strict";

const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const {
  signUp,
  verifyEmail,
  signIn,
  getUserFromToken
} = require("../services/auth");
const { getUserData, editUserData } = require("../services/user");
const {
  getOrders,
  cancelOrder,
  changeOrderStatus
} = require("../services/orders");
const { leaveFeedback, getFeedbacks } = require("../services/feedbacks");

router.post("/signup", async (req, res) => {
  const response = await signUp(req.body, res);
  res.json(response);
});

router.post("/verifyEmail", async (req, res) => {
  const response = await verifyEmail(req.body, res);
  res.json(response);
});

router.post("/signin", async (req, res) => {
  const response = await signIn(req.body, res);
  res.json(response);
});

router.get("/user/from/token", checkAuth, async (req, res) => {
  const response = await getUserFromToken(req.id);
  res.json(response);
});

router.get("/user/:id", checkAuth, async (req, res) => {
  const response = await getUserData(req.params.id);
  res.json(response);
});

router.put("/user/:id/edit", checkAuth, async (req, res) => {
  const response = await editUserData(req.params.id, req.body, res);
  res.json(response);
});

router.get("/user/:id/orders", checkAuth, async (req, res) => {
  const response = await getOrders(req.params.id);
  res.json(response);
});

router.put("/cancel/:orderId", checkAuth, async (req, res) => {
  const response = await cancelOrder(req.params, req.id, res);
  res.json(response);
});

router.put("/change_status/:orderId", checkAuth, async (req, res) => {
  const response = await changeOrderStatus(req.params, req.id, res);
  res.json(response);
});

router.post("/leave_feedback", checkAuth, async (req, res) => {
  const response = await leaveFeedback(req.id, req.body, res);
  res.json(response);
});

router.get("/company/:id/feedbacks", async (req, res) => {
  const response = await getFeedbacks(req.params.id);
  res.json(response);
});

module.exports = router;
