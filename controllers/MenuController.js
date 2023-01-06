import Menu from "../models/MenuModel.js";
import path from "path";
import fs from "fs";
export const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.findAll();
        res.json(menu);
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(menu[0]);
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const addMenu = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "Tidak ada gambar yang diupload"});
    const name = req.body.name;
    const price= req.body.price;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];
 
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Image"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Ukuran image harus kurang dari 5 MB"});
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Menu.create({name: name, price: price, image: fileName, url: url});
            res.status(201).json({msg: "Data Restoran Berhasil Ditambahkan!"});
        } catch (error) {
            console.log(error.message);
        }
    })
 
}
 
export const updateMenu = async(req, res)=>{
    const menu = await Menu.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!menu) return res.status(404).json({msg: "Data tidak ditemukan!"});
     
    let fileName = "";
    if(req.files === null){
        fileName = menu.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];
 
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Image"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Ukuran image harus kurang dari 5 MB"});
 
        const filepath = `./public/images/${menu.image}`;
        fs.unlinkSync(filepath);
 
        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.name;
    const price= req.body.price;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
     
    try {
        await Menu.update({name: name, price: price, image: fileName, url: url},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Update product sukses!"});
    } catch (error) {
        console.log(error.message);
    }
}
 
export const deleteMenu = async(req, res)=>{
    const menu = await Menu.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!menu) return res.status(404).json({msg: "Data tidak ditemukan!"});
 
    try {
        const filepath = `./public/images/${menu.image}`;
        fs.unlinkSync(filepath);
        await Menu.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Delete data restoran berhasil"});
    } catch (error) {
        console.log(error.message);
    }
}