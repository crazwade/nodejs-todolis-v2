import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/user.js';
import path from 'path';

//https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000
    //get json
app.use(bodyParser.json());
//get post value
app.use(express.urlencoded({ extended: false }))
    //public folder
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     console.log(req.path, req.method)
//     next();
// })

//首頁 page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html', function(err) {
        if (err) res.send(400)
    })
})

//註冊 page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/view/register.html', function(err) {
        if (err) res.send(400)
    })
})

//作業區 page
app.get('/todolist/:user', (req, res) => {
    res.sendFile(__dirname + '/view/todolist.html', function(err) {
        if (err) res.send(400)
    })
})

//user '/user' do the action
app.use('/user', usersRouter)

app.listen(PORT, () => console.log(`running on port: ${PORT}`))