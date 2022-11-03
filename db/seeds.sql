use companyEmployees_db;

INSERT INTO department 
    (name)
VALUES 
    ('Marketing and Sales'),
    ('Human Resource'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role 
    (title, salary, department_id)
VALUES
('Full Stack Developer', 100000, 3),
('Software Engineer', 120000, 3),
('Human Resource Manager', 120000, 2), 
('Finanical Analyst', 80000, 4),
('Sales Manager',150000, 1),
('Marketing Coordinator', 70000, 1), 
('Salesperson I', 90000, 1),
('Lead Salesperson', 100000, 1),
('Financial Advisor', 120000, 4),
('Lawyer', 150000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Max', 'Verstappen', 1, null),
('Daniel', 'Ricciardo', 2, 1),
('Lando', 'Norris', 3, null),
('Sebastian', 'Vettel', 4, 3),
('Pierre', 'Gasly', 5, null),
('Sergio', 'Perez', 6, 5),
('Lewis', 'Hamilton', 7, 6),
('George', 'Russell', 8, 7);