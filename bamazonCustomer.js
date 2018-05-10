module.exports = {
 customer: function() {
	 var inquirer = require("inquirer");
	 const dbModule = require('./dbConnection');
	 let connection = dbModule.connect(); 
	 connection.connect(function(err) {
		 if (!err) {
			 selectProduct();
			 }
	});

function catalogProducts(product, catalog) {
  var total=catalog.length;
  for (var i = 0; i < total; i++) {
    if (catalog[i].item_id === product) {
      return catalog[i];
    }
  }
  return null;
}

function selectProduct() {
  connection.query("SELECT * FROM products", function(err, res) {
 inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "Enter product number you want to buy or -999 for quit",
        validate: function(item) {
          return !isNaN(item) || item=='-999';
        }
      }
    ])
    .then(function(item) {
      isterminate(item.choice);
      var choiceId = parseInt(item.choice);
      var product = catalogProducts(choiceId, res);
      if (!product) {
        console.log("\n this product has sold out.");
        selectProduct();
      }
      else {
		  InputProductQuantity(product);
      }
    });  });
}



function InputProductQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "count",
        message: "Input the product quanity",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      isterminate(val.count);
      var quantity = parseInt(val.count);
      if (quantity > product.stock_quantity) {
        console.log("\n Insufficient quantity!");
        selectProduct();
      }
      else {
        connection.query(
	  "UPDATE products SET stock_quantity = '{quanity}' WHERE item_id = 'product.item_id{}'",
    function(err, res) {
      console.log("\n Added");
      selectProduct();
    }
  );
      }
    });
}



function isterminate(choice) {
  if (choice.toLowerCase() === "q") {
    console.log("Thank you!");
    process.exit(0);
  }
}

}}
