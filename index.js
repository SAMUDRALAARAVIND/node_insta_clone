const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const fileUpload = require("express-fileupload")
const { v4: uniqKeyGenerate } = require("uuid")
const UsersShema = require("./Users")
const path = require("path")
const PORT = 8080 || process.env.PORT

const uri = `mongodb+srv://Aravind:Aravind@cluster0.tjbxerd.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', true)
mongoose.connect(uri, (err) => {
    if(err) {
        console.log("Connection to mongodb failed")
    }
    else console.log("Connected to mongoDB successfully")
})

app.use(cors())
app.use(express.json())
app.use(fileUpload())


app.listen(PORT, () => {
    console.log("Running on PORT", PORT)
})

app.post("/uploads", (req, resp) => {
    const { name, Location: location, Description: description } = req.body
    const { files } = req.files
    const fragments = files.name.split(".")
    const fileExt = fragments[fragments.length - 1]
    const uniqKey = uniqKeyGenerate()
    const fileName = uniqKey + "." + fileExt
    if (['jpeg', 'jpg', 'png', 'svg'].includes(fileExt)) {
        files.mv("./uploads/" + fileName, async (err) => {
            if (err) {
                resp.json({ message: err })
            } else {
                const user = new UsersShema({
                    name,
                    location,
                    description,
                    file_name: fileName,
                    date: new Date()
                })
                try{
                    await user.save()
                    resp.json({message: 'Pushed data into Database successfully'})
                }
                catch(e){
                    resp.json({message: e})
                }
            }
        })
    }
    else{
        resp.json({message: "Please upload an image file"})
    }
    /*
      const post =new  PostSchema({
        name,
        location: Location,
        description: Description,
        fileName: uniqKey
      })
      post.save()
    
    */
})

app.get("/all", async (req, resp) => {
    try{
        const response = await UsersShema.find()
        resp.json({result: response})
    }
    catch(e){
        resp.json({message: e})
    }
})

app.get("/image/:filename", (req, resp) => {
    resp.sendFile(path.join(__dirname, `/uploads/${req.params.filename}`))
})

/*
Aravind: abcd.jpg || 12:00PM uploads > aksfjnjgkasdfgksakgfkgs.jpg
Sunil: abcd.jpg || 1:00PM uploads > jkadbhfiwbwirnwrjknjnsjfvn.jpg

*/
