/* users */
INSERT INTO users (name, email, password)
VALUES ('Chris', 'chris@123.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Fred', 'fred@123.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Vic', 'vic@123.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

/* properties */
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'title', 'description', 'https:thumbnail', 'https:cover', 1, 1, 1, 1, 'Canada', 'orleans', 'ottawa', 'ON', '1231ps', true), 
(2, 'title', 'description', 'https:thumbnail', 'https:cover', 2, 2, 2, 2, 'USA', 'Miami', 'someplace', 'FL', '1312', true), 
(3, 'title', 'description', 'https:thumbnail', 'https:cover', 3, 3, 3, 3, 'Belgium', 'sure', 'whocares', 'TE', '131', false);

/* reservations */
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

/* property_reviews */
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 3,'test1'),
(2, 2, 2, 7,'test2'), 
(3, 3, 3, 5,'test3'); 