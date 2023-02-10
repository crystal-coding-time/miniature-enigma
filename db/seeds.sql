INSERT INTO department (name)
VALUES
    ('IT'),
    ('Sales'),
    ('Engineering'),
    ('Customer Service'),
    ('Data Science');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Cyber Secerity', 80000, 1),
    ('IT Specialist', 50000, 1),
    ('Customer Sales Solutions', 130000, 2),
    ('Sales Rep', 80000, 2),
    ('Data Engineer', 150000, 3),
    ('Software Engineer', 150000, 3),
    ('Call Center', 50000, 4),
    ('Customer Service', 65000, 4),
    ('Data Scientist', 120000, 5),
    ('Data Engineer', 120000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Terry', 'Atkins', 2, 2),
    ('Vinny', 'Clark', 5, 5),
    ('Kaine', 'Wallace', 1, 1),
    ('Jay', 'Bradley', 1, 2),
    ('Bob', 'Miller', 3, 2),
    ('Riley', 'Obrien', 1, 5),
    ('Izabella', 'Shaffer', 4, 1),
    ('Abi', 'Barr', 3, 2),
    ('Clayton', 'Molina', 2, 5),
    ('Polly', 'Hoover', 5, 1),
    ('Vinnie', 'Black', 3, 1),
    ('Hector', 'Franco', 4, 4),
    ('Gemma', 'Webster', 4, null),
    ('Aneesa', 'Howe', 2, null),
    ('Dan', 'Torres', 3, null),
    ('Malachy', 'Hampton', 5, null)