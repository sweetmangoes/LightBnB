const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

pool.query(`SELECT title FROM properties LIMIT 10;`).then((response) => {
  // console.log(response);
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
*/

const getUserWithEmail = (options, limit = 1) => {
  const queryString = `
    Select * 
    FROM users
    WHERE email = $1; 
  `;

  const data = [`${options}`];

  return pool
    .query(queryString, data)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message; 
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
*/

const getUserWithId = (options, limit = 1) => {

  const queryString = `
    Select * 
    FROM users
    WHERE id = $1; 
  `;

  const data = [`${options}`]

  return pool
    .query(queryString, data)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err.message; 
    });
};

exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
*/

const addUser = (options, limit = 1) => {
  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3); 
  `;

  const data = [`${options.name}`, `${options.email}`, `${options.password}`];

  return pool
    .query(queryString, data)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err.message; 
    });
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
*/

/*
get user with reservations:    1 | Devin Sanders        | tristanjacobs@gmail.com
guest_id: that basically the user.id which is I guess to be the cookie. 

use this query has a template:
SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;
*/

const getAllReservations = (options, limit = 1) => {
  const queryString = `
    SELECT reservations.id, properties.title, properties.cost_per_night, 
    reservations.start_date,
    properties.thumbnail_photo_url, 
    properties.number_of_bathrooms, 
    properties.number_of_bedrooms,
    properties.parking_spaces,
    AVG(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT 10;
  `;

  const data = [`${options}`];

  return pool
    .query(queryString, data)
    .then((result) => {
      console.log(result.rows); 
      return result.rows;
    })
    .catch((err) => {
      return err.message; 
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err.message; 
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
