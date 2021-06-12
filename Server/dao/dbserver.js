//引入加密文件
var bcrypt = require('../dao/bcrypt');

//引入token
var jwt = require('../dao/jwt');

var dbmodel = require('../model/dbmodel');
var User = dbmodel.model('User');
var Friend = dbmodel.model('Friend');
var Group = dbmodel.model('Group');
var GroupUser = dbmodel.model('GroupUser');
var Message = dbmodel.model('Message');
var GroupMsg = dbmodel.model('GroupMsg');


//新建用户
exports.buildUser = function (name, mail, pwd, res) {
    //密码加密
    let password = bcrypt.encryption(pwd);

    let data = {
        name: name,
        email: mail,
        pwd: password,
        time: new Date(),
    }

    let user = new User(data);

    user.save(function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200 });
        }
    })
}

//匹配用户表项目
exports.countUerValues = function (data, type, res) {
    let wherestr = {};
    wherestr[type] = data;

    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    })
}

//用户验证
exports.userMatch = function (data, pwd, res) {
    let wherestr = { $or: [{ 'name': data }, { 'email': data }] };
    let out = {
        'name': 1,
        'imgurl': 1,
        'pwd': 1
    };
    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            if (result == '') {
                res.send({ status: 400 });
            }
            result.map(function (e) {
                const pwdMatch = bcrypt.verification(pwd, e.pwd);
                if (pwdMatch) {
                    let token = jwt.generateToken(e._id);
                    let back = {
                        id: e._id,
                        name: e.name,
                        imgurl: e.imgurl,
                        token: token,
                    };
                    res.send({ status: 200, back });
                } else {
                    res.send({ status: 400 });
                }
            })
        }
    })
}

//搜索用户
exports.searchUser = function (data, res) {
    let wherestr;
    if (data == 'yike') {
        wherestr = {};
    } else {
        wherestr = { $or: [{ 'name': { $regex: data } }, { 'email': { $regex: data } }] };
    }

    let out = {
        'name': 1,
        'email': 1,
        'imgurl': 1,
    }

    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    })
}

//判断是否为好友
exports.isFriend = function (uid, fid, res) {
    let wherestr = {
        'userID': uid,
        'friendID': fid,
        'state': 0
    };
    Friend.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            if (result) {
                //是好友
                res.send({ status: 200 });
            } else {
                //不是好友
                res.send({ status: 400 });
            }
        }
    })
}

//搜索群
exports.searchGroup = function (data, res) {
    let wherestr;
    if (data == 'yike') {
        wherestr = {};
    } else {
        wherestr = { 'name': { $regex: data } };
    }

    let out = {
        'name': 1,
        'imgurl': 1,
    }

    Group.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    })
}

//判断是否在群内
exports.isInGroup = function (uid, gid, res) {
    let wherestr = {
        'userID': uid,
        'groupID': gid,
    };
    GroupUser.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            if (result) {
                //在群内
                res.send({ status: 200 });
            } else {
                //不在群内
                res.send({ status: 400 });
            }
        }
    })
}

//用户详情
exports.userDetails = function (id, res) {
    let wherestr = { '_id': id };
    let out = { 'pwd': 0 };
    User.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    })
}

//用户修改
function update(data, update, res) {
    User.findByIdAndUpdate(data, update, function (err, resu) {
        if (err) {
            //修改失败
            res.send({ status: 500 });
        } else {
            //修改成功
            res.send({ status: 200 });
        }
    })
}

exports.userUpdate = function (data, res) {
    let updatestr = {};

    //判断是否有密码项
    if (typeof (data.pwd) != 'undefined') {
        // res.send("fusasfafasf");
        //有密码进行匹配
        User.find({ '_id': data.id }, { 'pwd': 1 }, function (err, result) {
            if (err) {
                res.send({ status: 500 });
            } else {
                if (result == '') {
                    res.send({ status: 400 });
                }
                result.map(function (e) {
                    const pwdMatch = bcrypt.verification(data.pwd, e.pwd);
                    if (pwdMatch) {
                        //密码验证成功
                        if (data.type == 'pwd') {
                            //密码加密
                            let password = bcrypt.encryption(data.data);
                            updatestr[data.type] = password;
                            update(data.id, updatestr, res);
                        } else {
                            //邮箱匹配
                            updatestr[data.type] = data.data;
                            User.countDocuments(updatestr, function (err, result) {
                                if (err) {
                                    res.send({ status: 500 });
                                } else {
                                    //没有匹配项 可以修改
                                    if (result == 0) {
                                        update(data.id, updatestr, res);
                                    } else {
                                        //邮箱已存在
                                        res.send({ status: 600 });
                                    }
                                }
                            })
                        }

                    } else {
                        //密码匹配失败
                        res.send({ status: 400 });
                    }
                })
            }
        })
    } else if (data.type == 'name') {
        //如果是用户名先进行匹配
        updatestr[data.type] = data.data;
        User.countDocuments(updatestr, function (err, result) {
            if (err) {
                res.send({ status: 500 });
            } else {
                //没有匹配项 可以修改
                if (result == 0) {
                    update(data.id, updatestr, res);
                } else {
                    //用户名已存在
                    res.send({ status: 300 });
                }
            }
        })
    } else {
        //一般项修改
        updatestr[data.type] = data.data;
        update(data.id, updatestr, res);
    }
}

//获取好友昵称
exports.getMarkName = function (data, res) {
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid,
    };

    let out = {
        'markname': 1
    };

    Friend.findOne(wherestr, out, function (err, result) {
        if (err) {
            //获取失败
            res.send({ status: 500 });
        } else {
            //获取成功
            res.send({ status: 200, result });
        }
    })
}

//修改好友备注
exports.friendMarkName = function (data, res) {
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid,
    };

    let updatestr = {
        'markname': data.name
    };

    Friend.updateOne(wherestr, updatestr, function (err, result) {
        if (err) {
            //修改失败
            res.send({ status: 500 });
        } else {
            //修改成功
            res.send({ status: 200 });
        }
    })
}


//好友操作
//添加好友表
exports.buildFriend = function (uid, fid, state, res) {
    let data = {
        userID: uid,
        friendID: fid,
        state: state,
        time: new Date(),
        lastTime: new Date(),
    }

    let friend = new Friend(data);

    friend.save(function (err, result) {
        if (err) {
            // res.send({ status: 500 });
            console.log('申请好友表出错');
        } else {
            // res.send({ status: 200 });
        }
    })
}

//好友最后通讯时间
exports.upFriendLastTime = function (data) {
    let wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] };
    let updatestr = { 'lastTime': new Date() };
    Friend.updateMany(wherestr, updatestr, function (err, result) {
        if (err) {
            console.log('更新好友最后通讯时间出错');
        } else {
            // res.send({ status: 200 });
        }
    })
}

//添加一对一消息
exports.insertMsg = function (uid, fid, msg, type, res) {
    let data = {
        userID: uid,
        friendID: fid,
        message: msg,
        types: type,
        time: new Date(),
        state: 1,
    }

    let message = new Message(data);

    message.save(function (err, result) {
        if (err) {
            if (res) {
              res.send({ status: 500 });  
            }
        } else {
            if (res) {
               res.send({ status: 200 }); 
            }
        }
    })
}

//好友申请
exports.applyFriend = function (data, res) {
    //判断是否已经申请过
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid,
    };
    Friend.countDocuments(wherestr, (err, result) => {
        if (err) {
            res.send({ status: 500 });
        } else {
            //如果result = 0 为初次申请
            if (result == 0) {
                this.buildFriend(data.uid, data.fid, 2);
                this.buildFriend(data.fid, data.uid, 1);
            } else {
                //已经申请过好友
                this.upFriendLastTime(data);
            }
            //添加消息
            this.insertMsg(data.uid, data.fid, data.msg, 0, res);
        }
    });
}

//更新好友状态
exports.updateFriendState = function (data, res) {
    //修改项
    let wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] };
    Friend.updateMany(wherestr, { 'state': 0 }, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200 });
        }
    })
}

//拒绝好友或删除好友
exports.deleteFriend = function (data, res) {
    //修改项
    let wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] };
    Friend.deleteMany(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200 });
        }
    })
}

//按需求获取用户列表
exports.getUsers = function (data, res) {
    let query = Friend.find({});
    //查询条件
    query.where({ 'userID': data.uid, 'state': data.state });
    //查询friendID 关联的user对象
    query.populate('friendID');
    //排序方式 最后通讯时间倒序排列
    query.sort({ 'lastTime': -1 });
    //查询结果
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return {
                id: ver.friendID._id,
                name: ver.friendID.name,
                markname: ver.markname,
                imgurl: ver.friendID.imgurl,
                lastTime: ver.lastTime,
                type: 0
            }
        });
        res.send({ status: 200, result });
    }).catch(function (err) {
        res.send({ status: 500 });
    })
}

//按需求获取一条一对一消息
exports.getLastMsg = function (data, res) {
    let query = Message.findOne({});
    //查询条件
    query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] });
    //排序方式 最后通讯时间倒序排列
    query.sort({ 'time': -1 });
    //查询结果
    query.exec().then(function (ver) {
        let result = {
            message: ver.message,
            time: ver.time,
            types: ver.types,
        }
        res.send({ status: 200, result });
    }).catch(function (err) {
        res.send({ status: 500 });
    })
}

//汇总一对一未读消息数
exports.unReadMsg = function (data, res) {
    //汇总条件
    let wherestr = {
        'userID': data.fid,
        'friendID': data.uid,
        'state': 1
    };
    Message.countDocuments(wherestr, (err, result) => {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    });
}

//一对一消息状态修改
exports.updateMsg = function (data, res) {
    //修改项条件
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid,
        'state': 1
    };
    let updatestr = { 'state': 0 };
    Message.updateMany(wherestr, updatestr, (err, result) => {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    });
}


//按需求获取群列表
exports.getGroup = function (id, res) {
    //id为用户所在的群
    let query = GroupUser.find({});
    //查询条件
    query.where({ 'userID': id });
    //查找群id 所关联的user对象
    query.populate('groupID');
    //排序方式 最后通讯时间倒序排列
    query.sort({ 'time': -1 });
    //查询结果
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return {
                id: ver.groupID._id,
                name: ver.groupID.name,
                markname: ver.name,
                imgurl: ver.groupID.imgurl,
                lastTime: ver.lastTime,
                tip: ver.tip,
                type: 1
            }
        });
        res.send({ status: 200, result });
    }).catch(function (err) {
        res.send({ status: 500 });
    })
}

//按需求获取群消息
exports.getLastGroupMsg = function (gid, res) {
    let query = GroupMsg.findOne({});
    //查询条件
    query.where({ 'groupID': gid });
    //关联的user对象
    query.populate('userID');
    //排序方式 最后通讯时间倒序排列
    query.sort({ 'time': -1 });
    //查询结果
    query.exec().then(function (ver) {
        let result = {
            message: ver.message,
            time: ver.time,
            types: ver.types,
            name: ver.userID.name
        }
        res.send({ status: 200, result });
    }).catch(function (err) {
        res.send({ status: 500 });
    })
}

//群消息状态修改
exports.updateGroupMsg = function (data, res) {
    //修改项条件
    let wherestr = {
        'userID': data.uid,
        'groupID': data.gid,
    };
    let updatestr = { 'tip': 0 };
    Message.updateOne(wherestr, updatestr, (err, result) => {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200, result });
        }
    });
}

//消息操作
//分页获取数据 一对一聊天数据
exports.chatMsg = function (data, res) {
    //跳过的条数
    var skipNum = data.nowPage * data.pageSize;
    let query = Message.find({});
    //查询条件
    query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] });
    //排序方式 最后通讯时间倒序排列
    query.sort({ 'time': -1 });
    //关联的user对象
    query.populate('userID');
    //跳过条数
    query.skip(skipNum);
    //一页的条数
    query.limit(data.pageSize);
    //查询结果
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return {
                id: ver._id,
                message: ver.message,
                time: ver.time,
                types: ver.types,
                fromId: ver.userID._id,
                imgurl: ver.userID.imgurl,
            }
        });
        res.send({ status: 200, result });
    }).catch(function (err) {
        console.log(err);
        res.send({ status: 500 });
    })
}