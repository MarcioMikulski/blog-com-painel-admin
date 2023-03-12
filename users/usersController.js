const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");







router.get("/admin/users/index", adminAuth, (req, res) => {
    User.findAll().then(users => {
    res.render("admin/users/index", {users: users});
});

});

router.get("/admin/users/create", adminAuth, (req, res) => {
res.render("admin/users/create");

});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
            //res.json({email, password});
            
            User.create({
                email: email,
                password: hash
        
            }).then(() => {
                res.redirect("/");
        
            }).catch((err) => {
                res.redirect("/");
            });

        }else{
            res.redirect("/admin/users/create");
        }
    });

});

router.get("/login", (req, res) => {
    res.render("admin/users/login");

});

router.post("/admin/users/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){// se existe um usuario com esse email
            //validar senha
            var correct = bcrypt.compareSync(password, user.password);
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles/index");
            }else{
                res.redirect("/admin/users/login");
            }

        }else{
            res.redirect("/admin/users/login");
        }
    });
});

router.get("/admin/users/index", adminAuth, (req, res) => {
res.render("admin/users/index");

});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});


module.exports = router;