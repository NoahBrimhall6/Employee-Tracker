const inquirer = require('inquirer');

function options() {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: [
        'view all departments', 
        'view all roles', 
        'view all employees', 
        'add a department', 
        'add a role', 
        'add an employee', 
        'update an employee role',
        'quit']
    }
  ]).then((ans) => {
    switch (ans.options) {
      case 'view all departments':
        console.log('viewing all departments');
        options();
        break;

      case 'view all roles':
        console.log('viewing all roles');
        options();
        break;

      case 'view all employees':
        console.log('viewing all employees');
        options();
        break;

      case 'add a department':
        console.log('adding a department');
        options();
        break;

      case 'add a role':
        console.log('adding a role');
        options();
        break;

      case 'add an employee':
        console.log('adding an employee');
        options();
        break;

      case 'update an employee role':
        console.log('updateing and employee role');
        options();
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

options();