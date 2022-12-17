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

/*

Query works:  
// QUERYSTRING
SELECT city, owner_id, properties.id, title, cost_per_night, 
AVG(property_reviews.rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
WHERE

//CONDITIONAL ARRAY
properties.owner_id = 69 
AND city LIKE '%o%' 
AND cost_per_night >= 1
AND cost_per_night <= 9000

GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 3

ORDER BY cost_per_night
LIMIT 10;


challenge: 
- if an owner_id is passed in, only return properties belonging to that owner.
- if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range. (HINT: The database stores amounts in cents, not dollars!)
- if a minimum_rating is passed in, only return properties with a rating equal to or higher than that.
*/

const getAllProperties = function (options, limit = 10) {
  
  // const queryParams = [];
  const conditionsArray = []; 

  // 2
  let queryString = `
    SELECT city, owner_id, properties.id, title, 
    cost_per_night, avg(property_reviews.rating) as average_rating,
    properties.thumbnail_photo_url, 
    properties.number_of_bathrooms, 
    properties.number_of_bedrooms,
    properties.parking_spaces
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
  `;

  
  // owner_id - if an owner_id is passed in, only return properties belonging to that owner.
  if(options.owner_id){
    conditionsArray.push(`properties.owner_id = ${options.owner_id}`);
  }
  
  // city - 
  if (options.city) {
    conditionsArray.push(`city LIKE '%${options.city}%'`)
    // queryString += `WHERE city LIKE $${queryParams.length} `; // AFTER CONDITIONS ARRAY
  }
  
  // Minimum price
  if (options.minimum_price_per_night) {
    conditionsArray.push(`cost_per_night >= ${options.minimum_price_per_night * 100}`);
    // queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  
  // Maximum price - 
  if (options.maximum_price_per_night) {
    conditionsArray.push(`cost_per_night <= ${options.maximum_price_per_night * 100}`);
    // queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  
  // where check
  if (conditionsArray.length > 0 ) {
    queryString += `WHERE `
    queryString +=  conditionsArray.join(' AND ');
  }
  
  queryString += `
  GROUP BY properties.id`;
  
  // Minimum rating - if a minimum_rating is passed in, only return properties with a rating equal to or higher than that.
  if (options.minimum_rating) {
    queryString += ` HAVING avg(property_reviews.rating) >=${options.minimum_rating}`;
    // queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  queryString += `
  ORDER BY cost_per_night
  LIMIT ${limit};
  `;

  // 5
  console.log(`queryString; `, queryString);

  console.log(`conditionalArray; `, conditionsArray);

  // // 6
  return pool.query(queryString)
    .then((res) => {
      return res.rows
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
