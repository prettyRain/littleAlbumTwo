/**
 * Created by prettyRain on 2018/9/18.
 */
//下载的
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//自己写的
var route = require('./controller');
//ejs 模板
app.set('view engine','ejs');
//静态页面
app.use(express.static('./public'));
app.use(express.static('./uploads'));


//首页
app.get('/',route.index);
//创建相册
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/addxiangce',route.addxiangce);
app.post('/addxiangce',route.postaddxiangce);
//查看个人相册
app.get('/album/:albumByName',route.albumByName);
//上传图片
app.get('/uppage',route.uppage);
app.post('/uppost',route.uppost);
//展示
app.get('/ablumAll',route.ablumAll);
//删除
app.get('/deletedir',route.deletedir);
//下载图片
app.post('/downphoto',route.downphoto);

app.use("/",route.errorpage);
app.listen(4000);