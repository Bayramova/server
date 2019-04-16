/* eslint-disable no-unused-vars */
const Company = require("../models/company");

const GET_REQUEST_COMPANIES = "GET_REQUEST_COMPANIES";
const GET_SUCCESS_COMPANIES = "GET_SUCCESS_COMPANIES";
const GET_FAILURE_COMPANIES = "GET_FAILURE_COMPANIES";
module.exports = socket => {
  const getCompanies = async data => {
    try {
      const companies = await Company.findAll();
      if (companies) {
        socket.emit(GET_SUCCESS_COMPANIES, companies.json());
      }
    } catch (err) {
      socket.emit(GET_FAILURE_COMPANIES, err);
    }
  };
  console.log("Socket connection started!");
  socket.on(GET_REQUEST_COMPANIES, getCompanies);
};
