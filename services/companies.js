/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */

"use strict";

const Sequelize = require("sequelize");
const Company = require("../models/company");

const getCompanies = async (query, params, res) => {
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
    offset = limit * (page - 1);
    let companies = await Company.findAndCountAll({
      limit,
      offset,
      where: {
        [Sequelize.Op.or]: [
          {
            name: {
              [Sequelize.Op.substring]: query
            }
          },
          {
            services: {
              [Sequelize.Op.substring]: query
            }
          }
        ]
      }
    });
    if (companies) {
      const hasMore = page < Math.ceil(companies.count / limit);
      companies = companies.rows;
      return {
        companies,
        hasMore
      };
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

module.exports = { getCompanies, getCompany };
