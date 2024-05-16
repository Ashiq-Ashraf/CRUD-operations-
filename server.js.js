const express = require('express');  // create express object from express module
const bodyParser = require('body-parser');  // create body parser object from body-parser package
const fs = require('fs');
const app = express();  // call express constructor to create express application object
const port = 3000;  //create a port number 
const path = require('path');





// http://localhost:3000/ashiq_proj2.html
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serving static files from 'public' folder
app.get('/', (request, response) => response.sendFile(path.join(__dirname, 'public', 'ashiq_proj2.html')));



// POST endpoint to add a new customer
app.post('/addCustomer', (req, res) => {
  const customerData = req.body;

  // Check if customerNumber already exists
  if (fs.existsSync(`customerdata/${customerData.customerNumber}.txt`)) {
    return res.status(400).json({ message: 'Customer number already exists' });
  }
 //if customer number doesnt exist create a file in the name of the customer number 
  fs.writeFile(`customerdata/${customerData.customerNumber}.txt`, JSON.stringify(customerData), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating customer record' });
    }
    res.status(200).json({ message: 'Customer record added successfully' });
  });
});

// POST endpoint to update customer data
app.post('/updateCustomer', (req, res) => {
  const customerData = req.body; // Define customerData here

  const customerNumber = req.body.customerNumber;

  if (!fs.existsSync(`customerdata/${customerNumber}.txt`)) {
    return res.status(400).json({ message: 'Customer does not exist' });
  }
 //if customer number exist update the customer record 
  fs.writeFile(`customerdata/${customerNumber}.txt`, JSON.stringify(customerData), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating customer record' });
    }
    res.status(200).json({ message: 'Customer record updated successfully' });
  });
});

//POST endpoint to delete customer
app.post('/deleteCustomer', (req, res) => {
  const customerNumber = req.body.customerNumber;

  if (!customerNumber) {
      return res.status(400).json({ message: 'Invalid customer number' });
  }

  const filePath = `customerdata/${customerNumber}.txt`;

  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Customer does not exist' });
  }
 //if xutomer number exist delete the customer data
  fs.unlink(filePath, (err) => {
      if (err) {
          return res.status(500).json({ message: 'Error deleting customer record' });
      }
      res.status(200).json({ message: 'Customer record deleted successfully' });
  });
});
// POST endpoint to find customer data
app.post('/findCustomer', (req, res) => {
  const customerNumber = req.body.customerNumber;

  if (!customerNumber) {
      return res.status(400).json({ message: 'Invalid customer number' });
  }

  const filePath = `customerdata/${customerNumber}.txt`;

  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Customer does not exist' });
  }
 //if customer number exist read the customer record and dsiplay it 
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error reading customer data' });
      }

      const customerData = JSON.parse(data);
      res.status(200).json({ message: 'Customer data retrieved successfully', customerData });
  });
});

//to show the server is running 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
