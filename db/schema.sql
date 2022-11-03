DROP DATABASE IF EXISTS companyEmployees_db;
CREATE DATABASE companyEmployees_db;
USE companyEmployees_db; 

-- create department table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- create role table
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL, 
    salary INT NOT NULL,
    department_id INT,
    INDEX dep_ind (department_id),
    FOREIGN KEY (department_id) 
    REFERENCES department(id) 
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT, 
    INDEX role_ind (role_id),
    FOREIGN KEY (role_id) 
    REFERENCES role(id) 
    ON DELETE SET NULL,
    INDEX manager_ind (manager_id),
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id) 
    ON DELETE SET NULL
);