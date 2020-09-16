const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");

const myData = dataService(
  "mongodb+srv://pgbnguyen:giabao2291999@cluster0-bozyp.mongodb.net/sample_supplies?retryWrites=true&w=majority"
);

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req, res) => {
  res.status(201).json(myData.addNewSale(req.body));
});

// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req, res) => {
  // Call the manager method
  let page = req.query.page;
  let perPage = req.query.perPage;
  myData
    .getAllSales(page, perPage)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(401).json({ message: `an error occurred: ${err}` });
    });
});

// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req, res) => {
  // Call the manager method
  myData
    .getSaleById(req.params.id)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(401).json({ message: `an error occurred: ${err}` });
    });
});

// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req, res) => {
  myData
    .updateSaleById(req.body, req.params.id)
    .then((data) => {
      res.status(200).json({ message: data });
    })
    .catch((err) => {
      res.status(401).json({ message: `an error occurred: ${err}` });
    });
});
// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req, res) => {
  myData
    .deleteSaleById(req.params.id)
    .then((data) => {
      res.status(200).json({ message: data });
    })
    .catch((err) => {
      res.status(401).json({ message: `an error occurred: ${err}` });
    });
});

// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// ************* Initialize the Service & Start the Server

myData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
