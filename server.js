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
        password: 'W@lker!',
        database: 'tracker_db'
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
                employeeInfomation();
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

