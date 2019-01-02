/**
 * Created by prettyRain on 2018/9/18.
 */

var fs = require('fs');
var path = require('path');
var dt = require('silly-datetime');
var formidable = require('formidable');
exports.index = index;
exports.postaddxiangce = postaddxiangce;
exports.albumByName = albumByName;
exports.uppost = uppost;
exports.ablumAll = ablumAll;
exports.deletedir = deletedir;
function index(callback){
   
    fs.readdir('./uploads',function(err,files){
        if(err){
            callback("错误",null);
            return;
        }
        var arr = [];
        (function showdir(i){
            if(i == files.length){
                callback(null,arr);
                //记得要停止
                return;
            }
            fs.stat('./uploads/'+files[i],function(err,stats){
                if(err){
                    callback('错误',null);
                    return;
                }
                if(stats.isDirectory()){
                    arr.push(files[i]);
                }
                showdir(i+1);
            });
        })(0);
    });
}

function postaddxiangce(name,callback){

    fs.mkdir('./uploads/'+name,function(err){
        if(err){
            callback("错误");
            return;
        };
        callback();
    })
}

function albumByName(name,callback){
    fs.readdir('./uploads/'+name,function(err,files){
        if(err){
            callback("错误",null);
            return;
        }
        var arr = [];
        (function showfiles(i){
            if(files.length == i){
                callback(null,arr);
                return;
            }
            fs.stat('./uploads/'+name+"/"+files[i],function(err,stats){
                if(err){
                    callback("错误",null);
                    return;
                }
                if(stats.isFile()){
                    arr.push(files[i]);
                }
                showfiles(i+1);
            });
        })(0);
    })
}

function uppost(req,callback){
    var form = new formidable.IncomingForm()
    form.encoding = 'utf-8';
    form.uploadDir = "./tempup";
    form.parse(req, function(err, fields, files) {
        if(err){
            callback("错误");
            return;
        }
        var photoname = dt.format(new Date(),'YYYYMMDDHHmmss')+(parseInt(Math.random()*(9999-1000))+1000) + path.extname(files.photo.name);
        var newpath = "./uploads/"+fields.albumname+"/"+photoname;
        var oldpath = "./"+files.photo.path;
       
        if(files.photo.size > 1024*1024){
            fs.unlink(oldpath,function(err){
                if(err){
                    callback("错误");
                    return;
                }
            });
            callback("文件太大");
            return;
        }
        fs.rename(oldpath,newpath,function(err){
            if(err){
                console.log(err);
                callback("错误");
                return;
            }
            callback();
        });
        
    });
}

function ablumAll(callback){
    fs.readdir('./uploads',function(err,files){
        if(err){
            callback("1",null);
            return;
        }
        var arr = [];
        
        (function showarr(i){
            if(i == files.length){
                callback(null,arr);
                return;
            }
            console.log(i);
            fs.stat('./uploads/'+files[i],function(err,stats){
                if(err){
                    console.log(err);
                    callback("2",null);
                    return;
                }else {
                    if (stats.isDirectory()) {
                        fs.readdir('./uploads/' + files[i], function (err, newfiles) {
                            (function newshow(j) {
                                if (j == newfiles.length) {
                                    showarr(i + 1);
                                    return;
                                }
                                fs.stat('./uploads/' + files[i] + "/" + newfiles[j], function (err, stats) {
                                    if (err) {
                                        callback("3", null);
                                        return;
                                    }
                                    if (stats.isFile()) {
                                        arr.push(files[i] + "/" + newfiles[j]);
                                    }
                                    newshow(j + 1);
                                });
                            })(0)
                        })
                    } else {
                        showarr(i + 1);
                    }
                }
            });
        })(0);
    });
}

function deletedir(arr,callback){
    (function listarr(k){
        if(arr.length == k){
            callback();
            return;
        }
        fs.stat("./uploads/"+arr[k],function(err,stats){
            if(stats.isDirectory()){
                fs.readdir('./uploads/'+arr[k],function(err,files){
                    (function deletefile(i){
                        if(i == files.length){
                            fs.rmdir('./uploads/'+arr[k],function(err){
                                if(err){
                                    callback("1");
                                }
                            })
                            listarr(k+1);
                            return;
                        }
                        fs.unlink('./uploads/'+arr[k]+'/'+files[i],function(err){
                            if(err){
                                callback("2");
                            }
                            deletefile(i+1);
                        });
                    })(0)
                });
            
            }else if(stats.isFile()){
                fs.unlink('./uploads/'+arr[k],function(err){
                    if(err){
                        callback('3');
                        return;
                    }
                    listarr(k+1);
                });
            }
        })
    })(0);
    
    
}


