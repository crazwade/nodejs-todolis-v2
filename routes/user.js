import express from 'express';
//https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(
    import.meta.url);

const router = express.Router();

const users = [{
    account: 'admin',
    pwd: 'admin'
}];

const todolist = {
    admin: [{
        id: 0,
        content: '行動電源到了 7-11',
        timestamp: 1634751215749,
        list_status: 'Not done'
    }, {
        id: 1,
        content: '6am 起床出門辦資料',
        timestamp: 1634751216000,
        list_status: 'Not done'
    }, {
        id: 2,
        content: '找時間去打疫苗',
        timestamp: 1634751217000,
        list_status: 'Not done'
    }, {
        id: 5,
        content: '充電線到了 7-11',
        timestamp: 1634751219000,
        list_status: 'Done'
    }]
}

//get all users
router.get('/', (req, res) => {
    res.send(users);
})

//get users's list
router.get('/list/:id', (req, res) => {
    let user = req.params.id;

    let userTodolist = todolist[user];

    let data = {
        result: userTodolist,
        status: 0
    }

    res.send(data);
})

//login
router.post('/login', (req, res) => {
    let account = req.body.account;
    let password = req.body.pwd;
    const FindUser = users.find((user) => user.account == account);
    if (!FindUser) {
        res.json({
            status: 2
        })
    } else {
        if (FindUser.pwd == password) {
            res.json({
                status: 0,
                data: {
                    redirect: '/todolist/' + account
                }
            });
        } else {
            res.json({
                status: 1
            })
        }

    }
})

//register
router.post('/register', (req, res) => {
    let account = req.body.account;
    let password = req.body.pwd;
    const FindUser = users.find((user) => user.account == account);
    if (!FindUser) {
        let data = {
            account: account,
            pwd: password
        };
        let empty_data = [];

        users.push(data);
        todolist[`${account}`] = empty_data;

        res.redirect('/');
    } else {
        res.send("Account already exist");
    }
})

//new list
router.post('/:user', (req, res) => {
    let user = req.params.user;
    let id = getTodolistId(todolist[user]);
    let content = req.body.content;
    let timestamp = req.body.timestamp;
    let list_status = "Not done";

    let data = {
        result: {
            id: id,
            content: content,
            timestamp: timestamp,
            list_status: list_status
        },
        status: 0
    }

    todolist[user].push(data.result);
    res.send(data);
})

//del action
router.delete('/:user', (req, res) => {
    let user = req.params.user;
    let id = req.body.id;
    const FindId = todolist[user].findIndex(p => p.id == id)
    todolist[user].splice(FindId, 1)
    let data_status = {
        status: 0
    };
    res.send(data_status);
})

//put action
router.put('/:user', (req, res) => {
    let user = req.params.user;
    let id = req.body.id;
    let tmp_status = '';
    const FindId = todolist[user].findIndex(p => p.id == id)

    if (todolist[user][FindId].list_status === 'Done') {
        tmp_status = 'Not done';
    } else {
        tmp_status = 'Done';
    }
    todolist[user][FindId].list_status = tmp_status;

    let data_status = {
        status: 0,
        new_status: tmp_status
    };
    res.send(data_status);
})


export default router;


function getTodolistId(x) {
    if (x.length != 0) {
        let tmp_arr = [];
        for (let i = 0; i < x.length; i++) {
            tmp_arr.push(parseInt(x[i].id));
        }
        return Math.max(...tmp_arr) + 1;
    } else {
        return 0;
    }
}