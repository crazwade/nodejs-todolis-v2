# Todolist 規格書

# 1. 系統功能架構
使用Nodejs+Express架構的「待辦清單」

## 1.1 作業流程說明
登入 - 登入後為帳號名稱 

    * (成功) 進入待辦清單
    
    * (失敗) 重新登入
![](https://i.imgur.com/BD61yrs.png)


註冊

    * (成功) 登入
    
    * (失敗) 回傳失敗原因
![](https://i.imgur.com/fru8QRH.png)


待辦清單

    * (操作) 新增 / 刪除 / 修改 / 更改狀態
![](https://i.imgur.com/adkE7OF.png)

    
# 2. 功能規格說明

## 2.1 Json 資料格式

### User
```json
{
    "account": "jacky",
    "pwd": "12345678"
}
```
### Todolist
```json
{
    "jacky": [
        {
            "id":0,
            "content": "早上7點 跟tuna一起吃早餐 約王品",
            "timestamp": 1634751215749,
            "list_status": "Not done"
        },
        //...
    ],
    //...
}
```

## 2.2 資料命名
| 名稱 | 顯示說明           | json來源 |
| -------- | ------------ | -------- |
| account |使用者帳號 | user |
| pwd |使用者密碼 | user |
| id |代辦事項的id | todolist |
| content |待辦內容 | todolist |
| timestamp |寫入時間 | todolist |
| list_status |待辦事項狀態 | todolist |

# 3. API
## 註冊
### Request

```javascript
client.post('/user/register', {
    'account': 'jacky',
    'pwd': '12345678'
});
```
### Response

|status|狀態|備註|
|-|-|-|
|0|註冊成功|重導向至主頁面|

```json
    status : 0 //成功註冊
    status : 1 //使用者已經存在
```
```javascript
const response = {
    status: 0,
    data: {
        redirect: '/'
    }
};
```

## 登入
### Request

```javascript
client.post('/user/login', {
    'account': 'jacky',
    'pwd': '12345678'
});
```
### Response

|status|狀態|備註|
|-|-|-|
|0|登入成功|重導向至工作頁面|

```json
    status : 0 //成功登入
    status : 1 //忘記密碼
    status : 2 //使用者不存在
```
```javascript
const response = {
    status: 0,
    data: {
        redirect: '/todolist/' + account
    }
};
```

## 新增 待辦事項
### Request

```javascript
client.post('/user/:user', {
    'content': "這是內容",
    'timestamp': 2134564987,
    'list_status':'Not done'
});
```
### Response

```json
    status : 0 //新增成功
    status : 1 //新增失敗
```
```javascript
const response = {
    status: 0,
    result: {
            id: 0,
            content: "這是內容",
            timestamp: 123456789,
            list_status: 'Not done'
        }
};
```

## 更新 待辦事項
### Request

```javascript
client.put('/user/:user', {
    'id': 0
});
```
### Response

```json
    status : 0 //更新成功
    status : 1 //更新失敗
```
```javascript
const response = {
    status:0,
    new_status:'Done'
};
```

## 刪除 待辦事項
### Request

```javascript
client.delete('/user/:user', {
    'id':2
});
```
### Response

```json
    status : 0 //刪除成功
    status : 1 //刪除失敗
```
```javascript
const response = {
    status:0
};
```
