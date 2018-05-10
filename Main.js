var inquirer = require("inquirer");
const managerModule=require('./bamazonManager');
const customerModule=require('./bamazonCustomer');
mainMenu();
function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      choices: ["Customer View","Manager", "Quit"],
      message: "What would you like to Navigate?"
    })
    .then(function(val) {
      switch (val.choice) {
        case "Customer View":
           customerModule.customer();
          break;
		case "Manager":
          managerModule.manager();
          break;
        default:
          process.exit(0);
          break;
      }
    });

}