/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */

"use strict";

const Company = require("../models/company");
const Service = require("../models/service");

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

    // TODO представь что у тебя 100000 компаний и сервисов. Какова будет нагрузка на сервер
    // старайся делать поиск и фильртацию с помощью sql, ну или в твоём случае siqualize
    // это критично
    const data = await Company.findAll();
    if (data) {
      const services = await Service.findAll();
      if (services) {
        const service = services.find(service =>
          service.title.toLowerCase().includes(query)
        );
        const serviceId = service ? service.id : "";
        const filtered = data.filter(
          company =>
            company.name.toLowerCase().includes(query) ||
            company.services.includes(serviceId)
        );
        const companies = filtered.slice(
          limit * (page - 1),
          limit * (page - 1) + limit
        );
        const hasMore = page < Math.ceil(filtered.length / limit);
        return {
          companies,
          hasMore
        };
      }
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

module.exports = { getCompanies, getCompany, searchCompanies };
