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
