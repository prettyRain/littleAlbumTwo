/**
 * Created by prettyRain on 2018/9/18.
 */

var file = require('../models/file.js');
var path = require('path');
var fs = require('fs');

/**
 * 首页
 * @param req
 * @param res
 * @param next
 */
exports.index = function(req,res,next){
    file.index(function(err,arr){
        if(err){
            next();
            return;
        }
        res.render('index',{
            fiels:arr
        });
    });
}
/**
 * 添加相册页面
 * @param req
 * @param res
 * @param next
 */
exports.addxiangce = function(req,res,next){
    file.index(function(err,arr){
        if(err){
            next();
            return;
        }
        res.render('addxiangce',{
            fiels:arr
        });
    });
}
/**
 * 添加相册
 * @param req
 * @param res
 * @param next
 */
exports.postaddxiangce = function(req,res,next){
    var xcmingchen = req.body.xcmingchen;
    file.postaddxiangce(xcmingchen,function(err){
        if(err){
            next();
            return;
        }
        res.send('success');
    });
}
/**
 * 展示个人相册
 * @param req
 * @param res
 * @param next
 */
exports.albumByName = function(req,res,next){
    var name = req.params.albumByName;
    console.log(name);
    file.albumByName(name,function(err,files){
        if(err){
            next();
            return;
        }
        res.render('album',{
            fiels:files,
            name:name
        });
    });
}
/**
 * 上传图片页面
 * @param req
 * @param res
 * @param next
 */
exports.uppage = function(req,res,next){
    file.index(function(err,arr){
        if(err){
            next();
            return;
        }
        res.render('uppage',{
            fiels:arr
        });
    });
}
/**
 * 上传图片
 * @param req
 * @param res
 * @param next
 */
exports.uppost = function(req,res,next){
  file.uppost(req,function(err){
      if(err && err=="文件太大"){
          res.send("文件太大");
      }else if(err){
          res.send("上传失败");
      }else{
          res.send("上传成功");
      }
  })
}
/**
 * 展示所有相片
 * @param req
 * @param res
 * @param next
 */
exports.ablumAll = function(req,res,next){
    file.ablumAll(function(err,fiels){
        if(err){
            console.log(err);
            next();
            return;
        }
        res.render('ablumAll',{fiels:fiels})
    });
}
/**
 * 删除文件或文件夹
 * @param req
 * @param res
 * @param next
 */
exports.deletedir = function(req,res,next){
    console.log(req.query.arr);
    file.deletedir(req.query.arr,function(err){
        if(err){
            next();
            return;
        }
        res.send('success');
    })
}
/**
 * 下载图片
 * @param req
 * @param res
 * @param next
 */
exports.downphoto = function(req,res,next){
    var arr = req.body.arr;
  console.log(arr);
   
        var name = arr;
        var photoname = (name).replace(/[^x00-xff]+(\w+.\w+$)/,function(a,b){
            return b;
        });
        var urlpath = path.normalize(__dirname+"/../uploads/"+name);
    
        // 实现文件下载
        var filePath = urlpath;
        var stats = fs.statSync(filePath);
        if(stats.isFile()){
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename='+photoname,
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            next();
        }
    
}
/**
 * 错误页面
 * @param req
 * @param res
 * @param next
 */
exports.errorpage = function(req,res){
    res.render('errPage');
}