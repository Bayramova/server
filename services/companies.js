/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */

"use strict";

const Sequelize = require("sequelize");
const Company = require("../models/company");

const getCompanies = async (params, res) => {
  try {
    const page = params.page || 1;
    let limit = parseInt(params.limit, 10);
    if (isNaN(limit)) {
      limit = 5;
    } else if (limit > 50) {
      limit = 50;
    } else if (limit < 1) {
      limit = 1;
    }
    let offset = 0;
    const data = await Company.findAndCountAll();
    if (data) {
      offset = limit * (page - 1);
      const companies = await Company.findAll({
        limit,
        offset
      });
      if (companies) {
        const hasMore = page < Math.ceil(data.count / limit);
        return {
          companies,
          hasMore
        };
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

const getCompany = async (params, res) => {
  try {
    const company = await Company.findOne({
      where: {
        id: params.id
      }
    });
    if (company) {
      return company;
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

const searchCompanies = async (query, params, res) => {
  try {
    const page = params.page || 1;
    let limit = parseInt(params.limit, 10);
    if (isNaN(limit)) {
      limit = 5;
    } else if (limit > 50) {
      limit = 50;
    } else if (limit < 1) {
      limit = 1;
    }
    const filteredByName = Company.findAll({
      where: {
        name: {
          [Sequelize.Op.substring]: query
        }
      }
    });
    const filteredByService = Company.findAll({
      where: {
        services: {
          [Sequelize.Op.substring]: query
        }
      }
    });
    const filtered = [...filteredByName, ...filteredByService];
    const companies = filtered.slice(
      limit * (page - 1),
      limit * (page - 1) + limit
    );
    const hasMore = page < Math.ceil(filtered.length / limit);
    return {
      companies,
      hasMore
    };
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

module.exports = { getCompanies, getCompany, searchCompanies };
