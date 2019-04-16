/* eslint-disable no-shadow */

"use strict";

const Company = require("../models/company");
const Service = require("../models/service");

const search = async (query, res) => {
  try {
    const companies = await Company.findAll();
    const services = await Service.findAll();
    const service = services.find(service =>
      service.title.toLowerCase().includes(query)
    );
    const serviceId = service ? service.id : "";
    const filtered = companies.filter(
      company =>
        company.name.toLowerCase().includes(query) ||
        company.services.includes(serviceId)
    );
    return filtered;
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

module.exports = { search };
