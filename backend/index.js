// const express =require('express');
// // const cors = require("cors");
// const app = express();
// // app.use(cors());
// const port = 3000;

// const dssv=require("./DSSV.json")

// app.get("/",(req, res)=>{
//     res.send("Xin chào đến với EXPRESS Backend");
// });

const express = require('express');
const fs = require('fs');
const cors = require("cors");
const app = express();
let corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
};
app.use(cors(corsOptions));

/////////////
// body-parser
var bodyparser = require('body-parser');
var urlParser = bodyparser.urlencoded({ extended: false });

const port = 3000;

const dssv = require('./DSSV.json');

app.get('/', (req, res) => {
    res.send('Welecome to EXPRESS backend!!');
});

//GET
app.get("/students", (req, res) => {
    res.send(Object.values(dssv));
});
app.get("/students/:MaSV", (req, res) => {
    console.log(req.params.mssv);
    let i = 0;
    for (i; i < dssv.length; i++) {
        if (dssv[i].MaSV == req.params.MaSV) break;
    }
    if (i < dssv.length) res.send(dssv[i]);
    else res.send("Not FOUND !!!");
});

//POST
//POST Thêm mới sv
app.post("/students", urlParser, (req, res) => {
    var sv = req.body;
    var result = dssv.find(item => item.MaSV === sv.MaSV);
    console.log(result);
    if (result != null || result != undefined) {
        var obj = {
            success: false, msg: "Mã SV bị trùng!"
        };
        res.send(obj);
    }
    else {
        // const rawData = fs.readFileSync('DSSV.json', {encoding:'utf-8'});
        dssv.push(sv);
        fs.writeFile('DSSV.json', JSON.stringify(dssv), err => {
           if(err){
            console.log(err);
           }
           else {
            console.log("OK");
           }
        });

        var obj = {
            success: true, msg: "Thêm mới thành công!"
        };
        res.send(obj);
    }

});


// Edit
app.put('/students/:MaSV', urlParser, (req, res) => {
    const mssv = req.params.MaSV; // get the mssv from the URL parameter
    const updatedStudent = req.body; // get the updated student data from the request body
  
    // Find the index of the student with the specified mssv value
    const index = dssv.findIndex(student => student.MaSV === mssv);
    console.log(index);
    if (index === -1) {
      // If the student is not found, send a 404 response
      res.status(404).send('Student not found');
    } else {
      // Update the properties of the student object at the specified index
      dssv[index].HoTen = updatedStudent.HoTen;
      dssv[index].Lop = updatedStudent.Lop;
      dssv[index].GioiTinh = updatedStudent.GioiTinh;
      dssv[index].NgaySinh = updatedStudent.NgaySinh;
  
      // Write the updated data to the JSON file
      fs.writeFile('DSSV.json', JSON.stringify(dssv), err => {
        if (err) {
          console.log(err);
          res.status(500).send('Server error');
        } else {
          res.send('Cập nhật thanh công!');
        }
      });
    }
  });


//Delete
app.delete("/students", urlParser, (req, res) => {
    var sv = req.body;
    var i = dssv.findIndex(item => item.MaSV === sv.MaSV);
    console.log(i);
    if (i != null || i != undefined) {
       dssv.splice(i,1);
       fs.writeFile('DSSV.json', JSON.stringify(dssv), err => {
        if(err){
         console.log(err);
        }
        else {
         console.log("OK");
        }
        var obj = {
            success: true, msg: "Xoá thành công!"
        };
        res.send(obj);
     });
    }
    

});



app.listen(port, () => console.log(`App is running at port ${port}`));