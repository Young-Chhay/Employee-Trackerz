// Importing packages for uses 
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require("dotenv").config();

// starting connection to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // Enter your MySQL username,
    user: 'root',
    // Enter your MySQL password
    password: ' ',
    database: ' '
  },
  console.log(`Connected to the companyEmployees_db database.`)
);

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  successConnection();
});

// function after connection is established and welcome image shows 
successConnection = () => {
  console.log("*---------------------------------*")
  console.log("*                                 *")
  console.log("* ~Welcome to Employees Trackerz~ *")
  console.log("*                                 *")
  console.log("*---------------------------------*")
  promptUser();
};

// Inquirer prompts
const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'Please tell me what you like to do?',
      choices: [
        'View All Departments',
        'View All Employees',
        'View All Roles',
        'Add a Department',
        'Add an Employee',
        'Add a Role',
        'Update an Employee Role ',
        'Update an employee manager',
        'View employees by department',
        'Delete department',
        'Delete an employee',
        'Delete a role',
        'View department budgets',
        'Close app'
      ]
    }
  ]).then((answers) => {
    const { choices } = answers;

    if (choices === "View All Departments") {
      showDepartments();
    }

    if (choices === "View All Roles") {
      showRoles();
    }

    if (choices === "View All Employees") {
      showEmployees();
    }

    if (choices === "Add a Department") {
      addDepartment();
    }

    if (choices === "Add a Role") {
      addRole();
    }

    if (choices === "Add an Employee") {
      addEmployee();
    }

    if (choices === "Update an Employee Role") {
      updateEmployee();
    }

    if (choices === "Update an employee manager") {
      updateManager();
    }

    if (choices === "View employees by department") {
      employeeDepartment();
    }

    if (choices === "Delete department") {
      deleteDepartment();
    }

    if (choices === "Delete a role") {
      deleteRole();
    }

    if (choices === "Delete an employee") {
      deleteEmployee();
    }

    if (choices === "View department budgets") {
      viewBudget();
    }

    if (choices === "Close app") {
      connection.end()
    };
  });
};

// function to show all departments 
showDepartments = () => {
  console.log('Viewing all departments...\n');
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  connection.promise().query(sql)
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments)
      promptUser();
    }).catch();
};

// function to show all roles 
showRoles = () => {
  console.log('Viewing all roles...\n');
  const sql = `SELECT role.id, role.title, department.name AS department FROM role
                 INNER JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql)
    .then(([rows]) => {
      let allRoles = rows;
      console.log("\n");
      console.table(allRoles)
      promptUser();
    }).catch();
};

// function to show all employees 
showEmployees = () => {
  console.log('Viewing all employees...\n');
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee 
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(sql)
    .then(([rows]) => {
      let allEmployees = rows;
      console.log("\n");
      console.table(allEmployees)
      promptUser();
    }).catch();
};

// function to add a department 
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDept',
      message: "Enter new department you want to add",
      validate: addDept => {
        if (addDept) {
          return true;
        } else {
          console.log('Please enter a name for new department');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name)
                    VALUES (?)`;
      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log('Added brand new' + answer.addDept + " to departments!");

        showDepartments();
      });
    });
};

// function to add a role 
addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: "Enter new role you wish to add",
      validate: addRole => {
        if (addRole) {
          return true;
        } else {
          console.log('Please enter correct information to create a role');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "Please enter salary for this role?",
      validate: addSalary => {
        if (addSalary) {
          return true;
        } else {
          console.log('Please enter a standard salary in number format');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];

      // grab dept from department table
      const deptDataSQL = `SELECT name, id FROM department`;

      connection.promise().query(deptDataSQL).then(([rows]) => {
        let departments = rows;

        const dept = departments.map(({ name, id }) => ({ name: `${name}`, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'dept',
            message: "What department will this role be in?",
            choices: dept
          }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.promise().query(sql, params).then(() => {
              console.log('Added' + answer.role + " to roles!");

              showRoles();
            });
          });
      });
    });
};

// function to add an employee 
addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "Please enter employee's first name?",
      validate: addFirst => {
        if (addFirst) {
          return true;
        } else {
          console.log('Please enter a respond for first name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Please enter employee's last name?",
      validate: addLast => {
        if (addLast) {
          return true;
        } else {
          console.log('Please enter a respond for last name');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      let firstName = answer.first_name;
      let lastName = answer.last_name;
      // const params = [answer.fistName, answer.lastName]

      // grab roles from roles table
      const roleDataSQL = `SELECT role.id, role.title FROM role`;

      connection.promise().query(roleDataSQL).then(([rows]) => {
        let allRoles = rows
        const roles = allRoles.map(({ id, title }) => ({ name: `${title}`, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: "What is the role for this employee?",
            choices: roles
          }
        ])
          .then(roleChoice => {
            let role = roleChoice.role;
            // params.push(role);

            const managerSql = `SELECT * FROM employee`;

            connection.promise().query(managerSql).then(([rows]) => {
              let employees = rows
              const managers = employees.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

              managers.unshift({ name: "None", value: null });

              // console.log(managers);

              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                .then(managerChoice => {
                  let employee = {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: role,
                    manager_id: managerChoice.manager
                  }

                  const sql = `INSERT INTO employee SET ?`;

                  connection.promise().query(sql, employee)
                    .then(([rows]) => {
                      let allEmployees = rows;
                      console.log("\n");
                      console.table(allEmployees)

                      showEmployees();
                    }).catch();
                });
            }).catch();
          });
      }).catch();
    });
};

// function to update an employee 
updateEmployee = () => {
  // get employees from employee table 
  const employeeSQL = `SELECT * FROM employee`;

  connection.promise().query(employeeSQL).then(([rows]) => {
    let employeeData = rows;
    const employees = employeeData.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        const roleDataSQL = `SELECT * FROM role`;

        connection.promise().query(roleDataSQL).then(([rows]) => {
          let selectedEmployee = rows

          const roles = selectedEmployee.map(({ id, title }) => ({ name: `${title}`, value: id }));

          inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's new role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              let employee = params[0]
              params[0] = role
              params[1] = employee


              // console.log(params)

              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

              connection.promise().query(sql, params).then(() => {
                if (err) throw err;
                console.log("Employee has been updated!");

                showEmployees();
              }).catch()
            });
        });
      });
  });
};

// function to update an employee 
updateManager = () => {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql).then(([rows])=> {
    let managerChoice = rows;
    const employees = managerChoice.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

        connection.promise().query(managerSql).then(([rows]) => {
          let managerChoiced = rows
          const managers = managerChoiced.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: "Who is the employee's manager?",
              choices: managers
            }
          ])
            .then(managerChoice => {
              const manager = managerChoice.manager;
              params.push(manager);

              let employee = params[0]
              params[0] = manager
              params[1] = employee


              // console.log(params)

              const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

              connection.promise().query(sql, params).then(() => {
                console.log("Employee has been updated!");

                showEmployees();
              }).catch()

            });
        });
      });
  });
};

// function to view employee by department
employeeDepartment = () => {
  console.log('Showing employee by departments...\n');
  const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql).then(([rows]) => {
    console.table(rows);
    promptUser();
  });
};

// function to delete department
deleteDepartment = () => {
  const deptSql = `SELECT * FROM department`;

  connection.promise().query(deptSql).then(([rows]) => {
    let departments = rows
    const dept = departments.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'dept',
        message: "What department do you want to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!");

          showDepartments();
        });
      });
  });
};

// function to delete a role from table
deleteRole = () => {
  const roleDataSQL = `SELECT * FROM role`;

  connection.promise().query(roleDataSQL).then(([rows]) => {
    let roles = rows;
    const roleChoices = roles.map(({ id, title }) => ({ 
      name: title, 
      value: id 
    }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: "What role do you want to delete?",
        choices: roleChoices
      }
    ])
      .then(roleChoice => {
        const roleSelect = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.promise().query(sql, roleSelect).then(() => {
          console.log("Successfully deleted!");

          showRoles();
        }).catch()
      });
  });
};

// function to delete an employee from table 
deleteEmployee = () => {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql).then(([rows]) => {
    let employeesData = rows

    const employees = employeesData.map(({ id, first_name, last_name }) => ({ name: first_name + last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to delete?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;

        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.promise().query(sql, employee).then(() => {
          console.log("Successfully Deleted!");

          showEmployees();
        }).catch()
      });
  });
};

// view department budget 
viewBudget = () => {
  console.log('Showing budget by department...\n');

  const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  role  
                 JOIN department ON role.department_id = department.id GROUP BY  department_id`;

  connection.promise().query(sql).then(([rows]) => {
    console.table(rows);

    promptUser();
  }).catch()
};
