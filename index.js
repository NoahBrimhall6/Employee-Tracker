const inquirer = require('inquirer');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'chowda',
    database: 'employees_db'
  },
  console.log('Connected to the employees_db database.')
);

// Initial Inquirer Prompt
function options() {
  inquirer
    .prompt({
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
        'view all departments', 
        'view all roles', 
        'view all employees', 
        'add a department', 
        'add a role', 
        'add an employee', 
        'update an employee role',
        'quit'
        ]
    })
    .then(ans => {
      switch (ans.menu) {
        case 'view all departments':
          view('departments');
          break;

        case 'view all roles':
          view('roles');
          break;

        case 'view all employees':
          view('employees');
          break;

        case 'add a department':
          add('departments');
          break;

        case 'add a role':
          add('roles');
          break;

        case 'add an employee':
          add('employees');
          break;

        case 'update an employee role':
          update();
          break;

        case 'quit': 
          console.log('goodbye');
          break;

        default: 
          console.log('Error: Unable to find inquirer choice');
          options();
          break;
      }
  });
};

// Displays database tables
function view(table) {
  var query = `SELECT * FROM ${table}`;

  if (table == 'roles') {
    query = `SELECT roles.id AS ID, roles.title AS Role, roles.salary AS Salary, departments.name AS Department 
             FROM roles JOIN departments ON roles.department_id = departments.id`;

  } else if (table == 'employees') {
    query = `SELECT employees.id AS ID, employees.first_name AS First, employees.last_name AS Last, 
             employees.manager_id AS Manager, roles.title AS Role, roles.salary AS Salary, departments.name AS Department 
             FROM ((employees JOIN roles ON employees.role_id = roles.id) JOIN departments ON roles.department_id = departments.id)`;

  } else if (table == 'departments') {
    query = 'SELECT departments.id AS ID, departments.name AS Department FROM departments';
  }

  db.query(query, (err, results) => {
    console.table(results);
    options();
  });
};

// Adds a new row to database tables
function add(table) {
  var query = `INSERT INTO ${table}`;
  
  // Add row to 'departments' table
  if (table == 'departments') {
    inquirer
      .prompt({
        type: 'input',
        name: 'name',
        message: 'Enter a new department.'
      }).then(ans => {
        query = `${query} (name) VALUES ('${ans.name}')`;
        db.query(query, (err, results) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Updated ${table}`);
            view('departments');
          }
        });
      });
  
  // Add row to 'roles' table    
  } else if (table == 'roles') {
    db.query('SELECT * FROM departments', (err, response) => {
      var departments = response.map(dep => dep.name);

      inquirer  
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter a new role.' 
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role.'
          },
          {
            type: 'list',
            name: 'department',
            message: 'Select a department for this role',
            choices: departments
          }
        ]).then(ans => {
          db.query(`SELECT * FROM departments WHERE departments.name = '${ans.department}'`, (err, response) => {
            query = `${query} (title, salary, department_id) VALUES ('${ans.title}','${ans.salary}',${response[0].id})`;
            db.query(query, (err, response) => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Updated ${table}`);
                view('roles');
              }
            });
          });
        });
    });

  // Add row to 'employees' table  
  } else if (table == 'employees') {
    db.query('SELECT * FROM roles', (err, response) => {
      var roles = response.map(m => m.title);
      db.query('SELECT * FROM employees', (err, response) => {
        var employees = response.map(m => `${m.first_name} ${m.last_name}`);

        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first',
              message: 'Enter first name.'
            },
            {
              type: 'input',
              name: 'last',
              message: 'Enter last name.'
            },
            {
              type: 'list',
              name: 'role',
              message: 'Select a role',
              choices: roles
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Select a manager for this employee',
              choices: employees
            }
          ]).then(ans => {
            db.query(`SELECT * FROM roles WHERE roles.title = '${ans.role}'`, (err, response) => {
              var roleId = response[0].id;
              var names = ans.manager.split(' ');
              db.query(`SELECT * FROM employees WHERE first_name = '${names[0]}' && last_name = '${names[1]}'`, (err, response) => {
                var managerId = response[0].id;
                query = `${query} (first_name, last_name, role_id, manager_id) VALUES ('${ans.first}','${ans.last}',${roleId},${managerId})`;
                db.query(query, (err, response) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(`Updated employees`);
                    view('employees');
                  }
                });
              });       
            });
          });
      });
    });
  }
};

// Updates employee role
function update() {
  db.query('SELECT * FROM employees', (err, response) => {
    var employees = response.map(emp => `${emp.first_name} ${emp.last_name}`);
    db.query('SELECT * FROM roles', (err, response) => {
      var roles = response.map(role => role.title);

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Select an employee',
            choices: employees
          },
          {
            type: 'list',
            name: 'role',
            message: 'Select a new role',
            choices: roles
          } 
        ]).then(ans => {
          db.query(`SELECT * FROM roles WHERE roles.title = '${ans.role}'`, (err, response) => {
            var names = ans.employee.split(' ');
            
            db.query(`UPDATE employees SET role_id = ${response[0].id} WHERE first_name = '${names[0]}' && last_name = '${names[1]}'`, (err, response) => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Updated ${ans.employee}s role to ${ans.role}`);
                view('employees');
              }
            });
          });
        });
    });
  });
};

options();



