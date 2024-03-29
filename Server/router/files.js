//引入附件上传插件
var multer = require('multer');
var mkdir = require('../dao/mkdir');

//控制文件存储
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //路径
        let url = req.body.url;
        mkdir.mkdirs('../data/' + url, err => {
            console.log(err);
        });
        cb(null, './data/' + url);
    },
    filename: function (req, file, cb) {
        let name = req.body.name;
        //正则匹配后缀名
        let type = file.originalname.replace(/.+\./, ".");
        cb(null, name + type);
    }
})

var upload = multer({ storage: storage })

module.exports = function (app) {
    //前端文件上传
    app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
        //获取路径
        let url = req.body.url;
        //获取文件名
        let name = req.files[0].filename;
        //拼接路径
        let imgurl = '/' + url + '/' + name;
        res.send(imgurl);
    })
}