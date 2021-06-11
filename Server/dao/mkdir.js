//新建目录
const fs = require('fs');
const path = require('path');

exports.mkdirs = function (pathname, callback) {
    pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
    pathname = path.relative(__dirname, pathname);
    let folders = pathname.split(path.sep);
    let pre = "";
    folders.forEach(folder => {
        try {
            let _start = fs.statSync(path.join(__dirname, pre, folder));
            let hasMkdir = _start && _start.isDirectory();
            if (hasMkdir) {
                callback;
            }
        } catch (error) {
            try {
                fs.mkdirSync(path.join(__dirname, pre, folder));

                callback && callback(null);
            } catch (error) {
                callback && callback(error);
            }
        }
        pre = path.join(pre, folder);
    });
}