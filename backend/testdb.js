const db = require("./backend/db.js");
sql="SELECT * FROM students ORDER BY MaSV LIMIT 10,5";
db.query(sql).then((data)=>{
    conlose.log(data);
}).catch((err)=>{
    console.log(err);
})