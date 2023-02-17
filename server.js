import express from "express";
import bcrypt from "bcrypt";

import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
import e from "express";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqODeKN5_6y-p2S5ZlIwREHmQSCj_K-aY",
  authDomain: "ecom-node.firebaseapp.com",
  projectId: "ecom-node",
  storageBucket: "ecom-node.appspot.com",
  messagingSenderId: "759601451761",
  appId: "1:759601451761:web:a5ba11f17a4961e2c54f50"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

// inisiate server
const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json()); // enable form sharing

//routes
//home route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" });
})


//signup
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root: "public" });
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac } = req.body;

    // form validate
    if (name.length < 3) {
        res.json({"alert": "name must be 3 letters long "})
    } else if (!email) {
        res.json({"alert": " enter valid email "})
    } else if (password.length < 8) {
        res.json({"alert": "password must have 8 letters "})
    } else if (!Number(number) || number.length < 10) {
        res.json({"alert": " enter valid mobile no. "})
    } else if (!tac) {
        res.json({"alert": " plese agree to our term and condition "})
    } else {
        // store the data in db
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                return res.json({ 'alert': 'email already exists' })
            } else{
                // encript the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;

                        // set the doc
                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller,
                            })
                        })
                    });
                })
            }
        })
    }
})

// login route
app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: "public" })
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;

    if(!email.value.length || !password.value.length){
       return res.json({'alert':'fill all inputs'});
    } 

    const users = collection (db, "users");

    getDoc(doc(users, email))
    .then(user => {
        if(!email.exists()){
            return res.json({'alert':'email does not exists'});
        }else {
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data  = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller
                    })
                } else{
                    return res.json({'alert':'password is incorrect'});
                }
            })
        }
    })
     

})

// seller route
app.get('/seller', (req, res) => {
    res.sendFile("seller.html", { root: "public" })
})

app.post('/seller', (req, res) => {
    let {name, address, about, number,email} = req.body;
    console.log(req.body);
    if(!name.length || !address.length || !about.length || number.length < 10 || !Number(number)){
        return  res.json({'alert':'some information(s) is/are incorrect'});
    } else{
        // update seller status
        const sellers = collection(db, "sellers");
        setDoc(doc(sellers, email), req.body)
        .then(data => {
            const users = collection(db, "users");
            updateDoc(doc(users, email), {
                seller: true
            })
            .then(data => {
                res.json({'seller': true})
            })
        })
    }
})

// dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile("dashboard.html", { root: "public" })
})


// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root: "public" })
})

app.use((req, res) => {
    res.redirect('/404');
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})
