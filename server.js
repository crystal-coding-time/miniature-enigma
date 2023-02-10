// Requirements
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { CallTracker } = require('assert');

require('dotenv').config()

//Connects to the database

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    });

// connects to the mysql database

connection.connect(function (err) {
    if (err) return console.log(err);
    InquirerPrompt();
})

// Inquirer prompt messages
const InquirerPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update all departments',
                'Update employee infomation',
                'Exit'
            ]
        }
    ])

        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                showDepartments();
            }

            if (choices === "View all roles") {
                showRoles();
            }

            if (choices === "View all employees") {
                showEmployees();
            }

            if (choices === "Add department") {
                addDepartments();
            }

            if (choices === "Add role") {
                addRoles();
            }

            if (choices === "Add employee") {
                addEmployees();
            }

            if (choices === "Update all departments") {
                allDepartments();
            }

            if (choices === "Update employee infomation") {
                updateEmployee();
            }

            if (choices === "Exit") {
                connection.end();
            }
        });
};

// Departments infomation
showDepartments = () => {
    console.log('All departments are showing.');
    const mysql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        InquirerPrompt();
    });
}

// Show roles
showRoles = () => {
    console.log('Show all roles.');

    const mysql = `SELECT roles.id, roles.title, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`;

    connection.query(mysql, (err, rows) => {
        console.table(rows);
        InquirerPrompt();
    })
};

// Add roles infomation
addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: "What do you want to add?",

        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is your yearly salary?',
        }

    ])
        .then(answer => {
            const parameters = [answer.roles, answer.salary];
            const roles_var = `SELECT name, id FROM department`;

            connection.query(roles_var, (err, data) => {
                if (err) return console.log(err);
                const department_var = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department_var',
                        message: "What department is this role in?",
                        choices: department_var
                    }
                ])
                    .then(department_varChoice => {
                        const department_var = department_varChoice.department_var;
                        parameters.push(department_var);
                        const mysql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

                        connection.query(mysql, parameters, (err, result) => {
                            if (err) return console.log(err);
                            console.log('Added' + answer.roles + "to roles");
                            showRoles();
                        });
                    });
            });
        });
};

// Show employees
showEmployees = () => {
    console.log('All employees are showing.');
    const mysql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(mgr.first_name, mgr.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;

    connection.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        InquirerPrompt();
    });
};

// Update employees
updateEmployee = () => {
    const employeemysql = `SELECT * FROM employee`;

    connection.query(employeemysql, (err, data) => {

        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do we want to update?',
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const parameters = [];
                parameters.push(employee);

                const role_var = `SELECT * FROM role`;

                connection.query(role_var, (err, data) => {
                    if (err) return console.log(err);
                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the new role?',
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            parameters.push(role);
                            let employee = parameters[0]
                            parameters[0] = role
                            parameters[1] = employee
                            const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            connection.query(mysql, parameters, (err, result) => {
                                if (err) return console.log(err);
                                console.log('Role has been updated.');

                                showEmployees();
                            })
                        })
                })
            })
    })
};

// Update/Add Department
addDepartments = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What department do you want to add?',
        }
    ])
        .then(answer => {
            const mysql = `INSERT INTO department (name) VALUES (?)`;
            connection.query(mysql, answer.department, (err, results) => {
                if (err) return console.log(err);
                console.log('Added' + answer.department + "to departments");

                showDepartments();
            });
        });
}
// Add employees
addEmployees = ()  => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Your First Name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Your Last Name?',
        }
    ])
    .then(answer => {
        const parameters = [answer.first_name, answer.last_name]
        const roles_var = `SELECT roles.id, roles.title FROM roles`;

        connection.query(roles_var, (err, data) => {
            if(err) return console.log(err);
            const roles = data.map(({ id, title }) => ({ name:title, value:id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is your role?',
                    choices: roles
                }
            ])
            .then(rolesChoice => {
                const role = rolesChoice.roles;
                parameters.push(roles);

                showEmployees();

           })
        });
    });
};

function findEmployees() {
    return connection.promise().query(`SELECT * FROM employee`);
}

// Function to update an employee 
updateEmployee = () => {
// get employees from employee table 
findEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));

    inquirer.prompt([
    {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employeeChoices,
    }
    ])
    .then(empChoice => {
        const employee = empChoice.name;
        const parameters = []; 
        parameters.push(employee);

        const roleSql = `SELECT * FROM role`;

        connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 

        const roles = data.map(({ id, title }) => ({ 
            name: title, 
            value: id 
        }));
        
            inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
            },
            ])
            .then(roleChoice => {
            const role = roleChoice.role;
            parameters.push(role); 
            
            let employee = parameters[0]
            parameters[0] = role
            parameters[1] = employee 
            

                // console.log(parameters)

                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(sql, parameters, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated!");
            
                showEmployees();
        });
        });
    });
    });
});
};