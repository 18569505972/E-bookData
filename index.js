var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var userData = require('./configs/config').userData;
var user = mongoose.model('user', userData);
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//获取收藏列表
app.get('/getCollection', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    user.find({ nickNm: req.query.nickNm }, { _id: 0, updated_at: 0 }, function(err, data) {
        if (err) {
            res.end(JSON.stringify({ message: '服务器异常', err: err, status: 0 }));
            return;
        };
        res.end(JSON.stringify(data));
    });
})
//删除收藏列表delectCollection
app.get('/delectCollection', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    user.find({ nickNm: req.query.nickNm }, { _id: 0, updated_at: 0 }, function(err, data) {
        if (err) {
            res.end(JSON.stringify({ message: '服务器异常', err: err, status: 0 }));
            return;
        };
        var arr = [];
        console.log(req.query.delectall)
        if (req.query.delectall == "all") {
            console.log('111')
            user.update({ nickNm: req.query.nickNm }, { $set: { store: arr} }, function(err) {
                if (err) {
                    res.end(JSON.stringify({ message: '服务器异常', err: err, status: 0 }));
                    return;
                };
                res.end(JSON.stringify({ 'message': '删除成功', 'err': null, status: 1 }));
            });
        } else {
            console.log('222')
            var delectall = req.query.delectall;
            if (delectall.indexOf(',') > 0) {
                delectall = delectall.split(',')
            } else{
                delectall = [delectall];
            }
            for(var i=0;i<delectall.length;i++){
                var obj={'title':delectall[i]};
                user.update({ nickNm: req.query.nickNm }, {$pull:{store:{title:delectall[i]}}}, function(err) {
                if (err) {
                    res.end(JSON.stringify({ message: '服务器异常', err: err, status: 0 }));
                    return;
                };
                res.end(JSON.stringify({ 'message': '删除成功', 'err': null, status: 1 }));
            });
            }
        }
    });
})
//收藏列表写入
app.get('/saveCollection', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    user.find({ nickNm: req.query.name }, null, function(err, data) {
        if (err) {
            res.end(JSON.stringify({ message: '服务器异常', err: err, status: 0 }));
            return;
        };
        if (data.length == 0) {
            var arr = [];
            arr.push({ title: req.query.title, imgUrl: req.query.imgUrl, bookNm: req.query.bookNm });
            new user({ //实例化对象，新建数据
                nickNm: req.query.name,
                store: arr,
                updated_at: new Date().toLocaleString()
            }).save(function(err, user, count) { //保存数据
                res.end(JSON.stringify({ 'message': '用户信息采集成功', 'err': null, status: 1 }));
            });
        } else {
            var obj = { title: req.query.title, imgUrl: req.query.imgUrl, bookNm: req.query.bookNm };
            var updateflag = true;
            for (var i = 0; i < data[0].store.length; i++) {
                if (data[0].store[i].title == req.query.title) {
                    updateflag = false;
                }
            }
            var arr = data[0].store;
            arr.push(obj)
            console.log('arr' + arr)
            if (updateflag) {
                user.update({ nickNm: req.query.name }, { $set: { store: arr } }, function(err) {
                    if (err) {
                        res.end(JSON.stringify({ message: '服务器异常', err: err, status: 0 }));
                        return;
                    };
                    res.end(JSON.stringify({ 'message': '收藏成功', 'err': null, status: 1 }));
                });
            } else {
                res.end(JSON.stringify({ 'message': '已收藏过书籍', 'err': null, status: 2 }));
            }
        }
    });
})
//最近更新
app.get('/latest', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    var stream = fs.createReadStream('./data/index/latestList.json');
    var data = "";
    stream.on('data', function(chrunk) {
        data += chrunk;
    });
    stream.on('end', function() {
        res.end(data)
    });
})
//推荐列表
app.get('/recommend', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    var stream = fs.createReadStream('./data/index/recommendList.json');
    var data = "";
    stream.on('data', function(chrunk) {
        data += chrunk;
    });
    stream.on('end', function() {
        res.end(data)
    });
})
//分类列表
app.get('/class', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    var stream = fs.createReadStream('./data/index/all.json');
    var data = "";
    stream.on('data', function(chrunk) {
        data += chrunk;
    });
    stream.on('end', function() {
        res.end(data)
    });
})
//分类书籍列表
app.get('/bookList', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    var stream = fs.createReadStream('./data/class/' + req.query.type + '.json');
    var data = "";
    stream.on('data', function(chrunk) {
        data += chrunk;
    });
    stream.on('end', function() {
        res.end(data)
    });
})
//章节列表
app.get('/detail', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    var exists = fs.existsSync('./data/detail/' + req.query.title + '/' + req.query.title + '.json');
    if (exists) {
        var stream = fs.createReadStream('./data/detail/' + req.query.title + '/' + req.query.title + '.json');
        var data = "";
        stream.on('data', function(chrunk) { //将数据分为一块一块的传递
            data += chrunk;
        });
        stream.on('end', function() {
            res.end(data)
        });
    } else {
        res.end(JSON.stringify({ message: '书籍已下架', status: 3 }));
    }
})
//章节内容
app.get('/section', urlencodedParser, function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); //设置response编码为utf-8
    console.log(req.query.title)
    var exists = fs.existsSync('./data/section/' + req.query.title + '/' + req.query.section + '.txt');
    if (exists) {
        var stream = fs.createReadStream('./data/section/' + req.query.title + '/' + req.query.section + '.txt');
        var data = "";
        stream.on('data', function(chrunk) { //将数据分为一块一块的传递
            data += chrunk;
        });
        stream.on('end', function() {
            res.end(data)
        });
        fs.readFile('. / data / section / ' + req.query.title + ' / ' + req.query.section + '.txt ', 'utf-8', function(err, data) {
            if (err) {
                console.error(err);
            } else {
                res.end(data);
            }
        })
    } else {
        res.end(JSON.stringify({ message: '书籍已下架', err: '书籍已下架', status: 0 }));
    }
})
var server = app.listen(3001, function() {
    var address = server.address().address;
    var port = server.address().port;
    console.log("服务地址为：", address, port)
})