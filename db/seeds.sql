INSERT INTO departments (department, id)
VALUES ('Engineering', 001),
       ('Finance',002),
       ('Manufacturing', 003),
       ('Marketing', 004);

INSERT INTO roles (title, salary, department_id, id)
VALUES ('Chocolate Engineer', 150000, 001, 001),
       ('Candy Engineer', 120000, 001, 002),
       ('Accountant', 170000, 002, 003),
       ('Candyman', 500000, 003, 004),
       ('Candymaker', 50000, 003, 005),
       ('President of Marketing', 250000, 004, 006),
       ('Assistant to the President of Marketing', 100000, 004, 007),
       ('Marketing Analyst', 100000, 004, 008);

INSERT INTO employees (first_name, last_name, role_id, manager_id, id)
VALUES ('Lisa', 'Simpson', 006, 002, 001),
       ('William', 'Wonka', 004, NULL, 002),
       ('John', 'Smith', 002, 004, 003),
       ('Jane', 'Doe', 001, 002, 004),
       ('Mclovin', NULL, 007, 001, 005),
       ('Noah', 'Brimhall', 008, 001, 006),
       ('Todd', 'Jones', 005, 002, 007),
       ('Oscar', 'Martinez', 003, 002, 008);
       