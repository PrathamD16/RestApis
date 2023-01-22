const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./Schema");
const { get } = require("http");
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;


mongoose.connect(
  "mongodb+srv://PrathamD16:PrathamD16@cluster0.6bgxuwg.mongodb.net/?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log(`Connection Successfull`);
});

app.get("/products", async (req, res) => {
  Product.find()
    .then((x) => res.status(200).json(x))
    .catch(() => {
      "No Products";
    });
});

app.post("/products", (req, res) => {
  const pid = req.body.pid;
  const name = req.body.name;
  const price = Number(req.body.price);
  const newProduct = new Product({
    pid,
    name,
    price,
  });

  newProduct
    .save()
    .then(() => res.json("Product Added Successfully"))
    .catch((err) => res.status(400).json(err));
});

//Get product detail using attribute
app.get("/products/:pid", getProduct, async(req, res) => {
  // res.send(JSON.stringify(res.product.price));
  // res.send(res.product) //Gets whole document
  res.send(res.product.name)  //gets single attribute
});

//Updating a product
app.patch("/products/:pid",getProduct,async (req,res)=>{
  if(req.body.name != null){
    res.product.name = req.body.name
  }
  if(req.body.price != null){
    res.product.price = Number(req.body.price)
  }

  try{
    const updateProduct = await res.product.save()
    res.status(201).json('Product details updated successfully!!')
  }catch(err){
    res.status(400).json('Error occured while updating')
  }

})

//For deleting a product using a document attribute
app.delete("/products/:pid",deleteProduct,(req, res) => {
//   try{
//       await res.product.deleteOne({pid:req.params.pid})
//       res.json('Product deleted Successfully')
//   } catch(err){
//       res.status(500).json('Error on server side')
//   }
});

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.find({ pid: req.params.pid })
    if (product.length == 0) {
      res.status(404).json("Product Not Found!!!");
    } 
    else {
      await Product.deleteOne({ pid: req.params.pid });
      res.status(201).json("Product Deleted Successfully");
    }
  } catch (err) {
    return res.status(500).json("Error on server");
  }
  next();
}

async function getProduct(req, res, next) {
  let product;
  try {
    // product = await Product.findById(req.params.id)
    product = await Product.findOne({pid:req.params.pid});
    if (product.length == 0) {
      return res.status(404).json("Product Not Found");
    }
  } catch (err) {
    return res.status(500).json("Error on server");
  }
  res.product = product;
  next();
}

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

