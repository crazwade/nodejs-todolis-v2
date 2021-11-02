const user = getCookieUser();

window.onload = function() {
    let urlSpilt = (window.location.href).split('/')
    let userName = urlSpilt[urlSpilt.length - 1];
    let urlTodo = urlSpilt[urlSpilt.length - 2];
    if (user == userName) {
        document.getElementById('header').innerHTML = `${user} 的 Todo List</h1>`;
        getAlltodolist();
    } else if (user != userName && urlTodo == 'todolist') {
        alert('cookie 遺失，請重新登入');
        location.href = '/';
    }
}

//get user's todolist
function getAlltodolist() {
    fetch('/user/list/' + user)
        .then(res => res.json())
        .then(data => {
            if (data.status === 0) {
                todolist2 = new ReactiveList(data.result)
                todolist2.subscribe((items) => {
                    console.log('subscriber 9:', items.length);
                    reFreshPage(items)
                });
                reFreshPage(data.result)
            } else {
                alert('有東西壞掉了');
            }
        })
        .catch(err => console.log(err))
}

function reFreshPage(items) {
    document.getElementById('notdone').innerHTML = '';
    document.getElementById('done').innerHTML = '';
    if (items.length != 0) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].list_status == 'Not done') {
                document.getElementById('notdone').appendChild(innerHTMLFormat(items[i].id, items[i].content, 'not done'));
            } else {
                document.getElementById('done').appendChild(innerHTMLFormat(items[i].id, items[i].content, 'done'));
            }
        }
    } else {

    }
    const doneEvent = items.filter(items => items.list_status === 'Done')
    document.getElementById('done_count').innerHTML = `已經完成事項 (${doneEvent.length})`;
}

class ReactiveList {
    constructor(initValue = []) {
        this._items = initValue;
        this.subscribers = {};
        this.user = user;
        this.subscriberSeriesNumber = 0;
        this.action = 0;
    }
    _notify() {
        const { _items, subscribers } = this;
        for (let key in subscribers) {
            subscribers[key](_items);
        }
    }
    subscribe(callback) {
        const { subscribers } = this;
        const sn = this.subscriberSeriesNumber++;
        const key = `key${sn}`;
        const unsubscribe = () => {
            delete subscribers[key];
        };
        subscribers[key] = callback;
        return unsubscribe;
    }
    addItem(item) {

        const { _items } = this;
        this.action = 3;
        _items.push(item);
        this._notify();
    }

    //id instead index
    delItem(id) {
        let { _items } = this;
        let FindIndex = _items.findIndex(p => p.id == id)
        this.action = 1;
        this._items.splice(FindIndex, 1)[0];
        this._notify();
    }

    //id instead index
    putItem(data, id) {
        let { _items } = this;
        let status = data.new_status;
        let FindIndex = _items.findIndex(p => p.id == id)
        this.action = 2;

        _items[FindIndex].list_status = status

        this._notify();
    }
}

function todoFormat(id, content) {
    let tmp = `
        <div class='todo' id='${id}' draggable="true">
            <p onclick='changeStatus(${id})'>${content}</p>
            <button onclick='delTodo(${id})'><i class="fa">&#xf014;</i></button>
        </div>
    `;
    return tmp;
}

function login() {
    let data = {
        'account': document.getElementById('account').value,
        'pwd': document.getElementById('pwd').value
    }
    fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => loginValid(data, document.getElementById('account').value))
        .catch(err => console.log(err))
}

function loginValid(x, account) {
    let status = x.status;
    if (status == 0) {
        document.cookie = 'user=' + account;
        location.href = x.data.redirect;
    } else if (status == 1) {
        document.getElementById('error').innerHTML = 'forget password?';
    } else if (status == 2) {
        document.getElementById('error').innerHTML = 'User no found';
    }
}

//new todolist
function newAdd() {
    let content = document.getElementById('todoContent').value;
    let timestamp = Date.now();
    let list_status = 'Not done';

    let data = {
        "content": content,
        "timestamp": timestamp,
        "list_status": list_status
    }

    fetch('/user/' + user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 0) {
                todolist2.addItem(res.result);
                document.getElementById('todoContent').value = '';
            } else {
                alert('有問題，需要重新新增');
            }
        })
        .catch(err => console.log(err))
}

//del todolist
function delTodo(id) {

    const data = {
        "id": id
    }

    fetch('/user/' + user, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 0) {
                todolist2.delItem(id);
            } else {
                alert('有問題，需要重新刪除');
            }
        })
        .catch(err => console.log(err))

}

//change status
function changeStatus(id) {

    const data = {
        "id": id
    }

    fetch('/user/' + user, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 0) {
                todolist2.putItem(res, id)

            } else {
                alert('有問題，需要更改');
            }
        })
        .catch(err => console.log(err))


}

//get user account from cookie
function getCookieUser() {
    const value = `${document.cookie}`;
    const account = value.split('user=');
    return account[1];
}

function showhide() {
    if (document.getElementById('done').style.display == 'none') {
        document.getElementById('done_zoom').innerHTML = 'Hide';
        document.getElementById('done').style.display = "flex";
    } else {
        document.getElementById('done_zoom').innerHTML = 'Show';
        document.getElementById('done').style.display = "none"
    }
}

function innerHTMLFormat(id, content, list_status) {

    let tmp = document.createElement('div');
    tmp.setAttribute('class', 'todo draggable');

    if (list_status == 'not done') {
        tmp.setAttribute('draggable', 'true');
    } else {

    }

    tmp.setAttribute('id', id);
    tmp.innerHTML = `<p onclick='changeStatus(${id})'>${content}</p>
    <button onclick='delTodo(${id})'><i class="fa">&#xf014;</i></button>`;

    return tmp;
}

function signOut() {
    location.href = '/';
}