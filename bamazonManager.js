module.exports = {
 manager: function() {
	 var inquirer = require("inquirer");
	 const dbModule = require('./dbConnection');
	 let connection = dbModule.connect();  
	 connection.connect(function(err) {
		 if (!err) {
			 getMenus();
		 }
});

function getMenus() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    menuOptions(res);
  });
}

function menuOptions(products) {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
      message: "What would you like to do?"
    })
    .then(function(val) {
      switch (val.choice) {
        case "View Products for Sale":
          console.table(products);
          getMenus();
          break;
        case "View Low Inventory":
          loadLowInventory();
          break;
        case "Add to Inventory":
          addToInventory(products);
          break;
        case "Add New Product":
          newProductConfirmation(products);
          break;
        default:
          console.log("Goodbye!");
          process.exit(0);
          break;
      }
    });
}

function loadLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
    console.table(res);
    getMenus();
  });
}

function addToInventory(inventory) {
  console.table(inventory);
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like add to?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(function(val) {
      var choiceId = parseInt(val.choice);
      var product = totalCatalog(choiceId, inventory);
      if (product) {
        promptManagerForQuantity(product);
      }
      else {
        console.log("\nThat item is not in the inventory.");
        getMenus();
      }
    });
}

function promptManagerForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);
      addQuantity(product, quantity);
    });
}

function addQuantity(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = '{product.stock_quantity + quantity}' WHERE item_id = '{quantity, product.item_id}'",
    function(err, res) {
      console.log("\nSuccessfully added " + quantity + " " + product.product_name + "'s!\n");
      getMenus();
    }
  );
}

function newProductConfirmation(products) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "What is the name of the product you would like to add?"
      },
      {
        type: "list",
        name: "department_name",
        choices: allDept(products),
        message: "Which department does this product fall into?"
      },
      {
        type: "input",
        name: "price",
        message: "How much does it cost?",
        validate: function(val) {
          return val > 0;
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How many do we have?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(newItem);
}

function newItem(product) {
  connection.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
    [product.product_name, product.department_name, product.price, product.quantity],
    function(err, res) {product
      if (err) throw err;
      console.log(product.product_name + " ADDED TO BAMAZON!\n");
      getMenus();
    }
  );
}

function allDept(products) {
  var departments = [];
  for (var i = 0; i < products.length; i++) {
    if (departments.indexOf(products[i].department_name) === -1) {
      departments.push(products[i].department_name);
    }
  }
  return departments;
}

function totalCatalog(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}

}}
