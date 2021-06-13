<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-center"><view class="title">详情</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head" v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
					<image :src="cropFilePath" class="user-img" v-if="id != uid" mode=""></image>
				</view>
				<view class="row" @tap="modify('explain', '签名', user.explain, false)" v-if="id == uid">
					<view class="title">签名</view>
					<view class="cont">{{ user.explain }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">签名</view>
					<view class="cont">{{ user.explain }}</view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">{{ changeTime(user.time) }}</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('name', '昵称', user.name, false)" v-if="id == uid">
					<view class="title">昵称</view>
					<view class="cont">{{ user.name }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" v-if="id != uid" @tap="modify('markname', '昵称', markname, false)">
					<view class="title">昵称</view>
					<view class="cont">{{ markname }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id == uid">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{ array[index] }}</view>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" v-if="id == uid">
							<view class="uni-input">{{ date }}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{ date }}</view>
					</view>
					<view class="more" v-if="id == uid"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('phone', '电话', user.phone, false)" v-if="id == uid">
					<view class="title">电话</view>
					<view class="cont">{{ user.phone }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('电话', dataArr.tell, false)" v-if="id != uid">
					<view class="title">电话</view>
					<view class="cont">{{ user.phone }}</view>
				</view>
				<view class="row" @tap="modify('email', '邮箱', user.email, true)" v-if="id == uid">
					<view class="title">邮箱</view>
					<view class="cont">{{ user.email }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('邮箱', dataArr.mail, true)" v-if="id != uid">
					<view class="title">邮箱</view>
					<view class="cont">{{ user.email }}</view>
				</view>
			</view>
			<view class="column" v-if="id == uid" @tap="modify('pwd', '密码', '', true)">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">*********</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="bt2" v-if="id == uid" @tap="quit">退出登录</view>
			<view class="bt2" v-if="id != uid" @tap="deleteFriend">删除好友</view>
		</view>
		<view class="modify" :style="{ bottom: -widHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">{{ modifyTitle }}</view>
				<view class="define" @tap="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<input type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400;" :style="{ display: ispwd }" />
				<textarea value="" placeholder="" v-model="data" class="modify-content" />
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import myfun from '../../commons/js/method.js';

export default {
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			id: '',
			uid: '',
			myname: '',
			token: '',
			user: '',
			markname: '',
			cropFilePath: '../../static/images/img/three.png',
			array: ['男', '女', '未知'],
			index: 0,
			date: currentDate,
			tempFilePath: '',
			headimg: '',
			modifyTitle: '', //修改标题
			data: '', //修改签名内容
			olddata: '', //原始数据
			pwd: undefined, //原密码
			type: '', //修改项
			ispwd: false, //是否需要原密码
			animationData: {}, //动画
			isModify: false, //动画开关
			widHeight: '1000' //页面高度
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	components: { ImageCropper },
	onReady: function() {
		this.getElementStyle();
	},
	onLoad: function(e) {
		this.id = e.id;
		this.getStorage();
		this.getUser();
		this.getMarkName();
	},
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取登录成功的本地缓存数据
		getStorage: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.token = value.token;
					this.myname = value.name;
				} else {
					//如果没有数据缓存就跳转到登录界面去
					uni.navigateTo({
						url: '../login/login'
					});
				}
			} catch (e) {
				// error
			}
		},
		//获取用户信息
		getUser: function() {
			uni.request({
				url: this.serverUrl + '/user/detail',
				data: {
					id: this.id,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						//处理头像链接
						this.cropFilePath = this.serverUrl + res.imgurl;
						//处理简介
						if (typeof res.explain == 'undefined') {
							res.explain = '这个人很懒 什么都没有留下~';
						}
						//处理markname
						if (this.markname.length == 0) {
							this.markname = res.name;
						}
						//处理生日
						if (typeof res.birth == 'undefined') {
							this.date = '0000-00-00';
						} else {
							this.date = myfun.detailTime1(res.birth);
						}
						//处理电话
						if (typeof res.phone == 'undefined') {
							res.phone = 1110;
						}
						this.sexJudge(res.sex);
						this.user = res;
						// console.log(this.user);
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 300) {
						//token过期跳回登录页面
						uni.navigateTo({
							url: '../login/login?name=' + this.myname
						});
					}
				}
			});
		},
		//性别判断
		sexJudge: function(e) {
			if (e == 'female') {
				this.index = 1;
			} else if (e == 'male') {
				this.index = 0;
			} else {
				this.index = 2;
			}
		},
		//获取好友昵称
		getMarkName: function() {
			if (this.id != this.uid) {
				uni.request({
					url: this.serverUrl + '/user/getmarkname',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token
					},
					method: 'POST',
					success: data => {
						// console.log(data);
						let status = data.data.status;
						if (status == 200) {
							let res = data.data.result;
							// console.log(res);
							// this.markname = res.markname;
							if (typeof res.markname != 'undefined') {
								//如果存在
								this.markname = res.markname;
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳回登录页面
							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							});
						}
					}
				});
			}
		},
		//时间处理
		changeTime: function(date) {
			return myfun.detailTime(date);
		},
		//性别选择器
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			let oldindex = this.index;
			this.index = e.target.value;
			if (this.index != oldindex) {
				let sex = 'asexual';
				if (this.index == 0) {
					sex = 'male';
				} else if (this.index == 1) {
					sex = 'female';
				}
				this.update(sex, 'sex', undefined);
			}
		},
		//日期选择器
		bindDateChange: function(e) {
			let olddate = this.date;
			this.date = e.target.value;
			if (this.date != olddate) {
				this.update(this.date, 'birth', undefined);
			}
		},
		//获取日期
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},

		//头像裁剪
		upload() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					this.tempFilePath = res.tempFilePaths.shift();
				}
			});
		},
		confirm(e) {
			this.tempFilePath = '';
			this.cropFilePath = e.detail.tempFilePath;
			this.headimg = e.detail.tempFilePath;

			uni.uploadFile({
				url: this.serverUrl + '/files/upload', //'后端地址上传图片接口地址',
				filePath: this.cropFilePath,
				name: 'file',
				fileType: 'image',
				formData: {
					url: 'user',
					name: this.uid,
					token: this.token
				}, //传递参数
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					console.log(backstr);
					//本地存储用户信息修改
					try {
						uni.setStorageSync('user', { id: this.uid, name: this.myname, imgurl: backstr, token: this.token });
					} catch (e) {
						// error
						console.log('数据存储出错');
					}
					//修改头像保存到数据库
					this.update(backstr, 'imgurl', undefined);
				},

				fail(e) {
					console.log('this is errormes ' + e.message);
				}
			});
		},
		cancel() {
			console.log('canceled');
			this.tempFilePath = '';
		},
		//修改数据
		update: function(d, type, pwd) {
			uni.request({
				url: this.serverUrl + '/user/update',
				data: {
					id: this.uid,
					data: d,
					type: type,
					pwd: pwd,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						console.log(data.data);
						this.user[type] = d;
						if (type == 'pwd') {
							//清除缓存
							uni.removeStorage({
								key: 'storage_key',
								success: function(res) {
									console.log('success');
								}
							});
							//用户需要重新登录
							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							});
						}
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 400) {
						//密码匹配失败
						uni.showToast({
							title: '输入原始密码错误！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 600) {
						//修改项已被占用
						uni.showToast({
							title: '已被占用！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 300) {
						//token过期跳回登录页面
						uni.navigateTo({
							url: '../login/login?cgpwd=' + this.myname
						});
					}
				}
			});
		},
		//获取页面高度
		getElementStyle: function() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.modify')
				.boundingClientRect(data => {
					this.widHeight = data.height;
				})
				.exec();
		},

		//修改项弹框
		modify: function(t, type, data, ispwd) {
			if (ispwd) {
				this.ispwd = 'block';
				this.pwd = '0';
			} else {
				this.ispwd = 'none';
				this.pwd = undefined;
			}
			//获取修改项
			this.type = t;
			this.modifyTitle = type;
			this.olddata = data;
			this.data = data;
			this.isModify = !this.isModify;
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});

			if (this.isModify) {
				animation.bottom(0).step();
			} else {
				animation.bottom(-this.widHeight).step();
			}

			this.animationData = animation.export();
		},
		//弹框修改确定
		modifySubmit: function() {
			//提交修改
			if (this.data.length > 0 && this.data != this.olddata) {
				// console.log(this.pwd + ',' + this.data + ',' + this.type);
				if (this.type == 'markname') {
					this.updateFriendName();
					this.markname = this.data;
				} else if (this.type == 'emial') {
					let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if (reg.test(this.data)) {
						this.update(this.data, this.type, this.pwd);
						//前端替换修改
						// this.user[this.type] = this.data;
					} else {
						uni.showToast({
							title: '邮箱格式错误！',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					this.update(this.data, this.type, this.pwd);
					//前端替换修改
					// this.user[this.type] = this.data;
				}
			}
			//关闭弹出层
			this.modify();
		},
		//好友昵称修改
		updateFriendName: function() {
			if (this.data.length > 0 && this.data != this.olddata) {
				uni.request({
					url: this.serverUrl + '/user/markname',
					data: {
						uid: this.uid,
						fid: this.id,
						name: this.data,
						token: this.token
					},
					method: 'POST',
					success: data => {
						// console.log(data);
						let status = data.data.status;
						if (status == 200) {
							console.log('ok');
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳回登录页面
							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							});
						}
					}
				});
			}
		},
		//退出登录
		quit: function() {
			uni.removeStorage({
				key: 'storage_key',
				success: function(res) {
					console.log('success');
				}
			});
			uni.navigateTo({
				url: '../login/login'
			});
		},
		//删除好友
		deleteFriend: function() {
			uni.showModal({
				title: '提示',
				content: '确定删除该好友吗？',
				success: res => {
					if (res.confirm) {
						// console.log('用户点击确定');
						uni.request({
							url: this.serverUrl + '/friend/deletefriend',
							data: {
								uid: this.uid,
								fid: this.id,
								token: this.token
							},
							method: 'POST',
							success: data => {
								// console.log(data);
								let status = data.data.status;
								if (status == 200) {
									//删除成功 跳回首页
									uni.navigateTo({
										url: '../index/index'
									});
								} else if (status == 500) {
									uni.showToast({
										title: '服务器出错啦！',
										icon: 'none',
										duration: 2000
									});
								} else if (status == 300) {
									//token过期跳回登录页面
									uni.navigateTo({
										url: '../login/login?name=' + this.myname
									});
								}
							}
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1px solid $uni-border-color;
}

.main {
	padding-top: 118rpx;
	display: flex;
	flex-direction: column;

	.column {
		display: flex;
		flex-direction: column;
		padding-top: 12rpx;
		border-bottom: 1px solid $uni-border-color;
		width: 100%;

		.row {
			display: flex;
			flex-direction: row;
		}

		.title {
			flex: none;
			padding: 0 $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 112rpx;
		}

		.head {
			height: 148rpx;
			display: flex;
			align-items: center;
		}

		.user-head {
			flex: auto;
		}

		.user-img {
			margin-top: 22rpx;
			width: $uni-img-size-lg;
			height: $uni-img-size-lg;
			border-radius: $uni-border-radius-base;
		}

		.cont {
			flex: auto;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
			line-height: 112rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.more {
			flex: none;
			height: 112rpx;
			display: flex;
			align-items: center;

			image {
				width: 80rpx;
				height: 28rpx;
			}
		}
	}

	.bt2 {
		margin-top: 160rpx;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
	}
}

//修改弹框
.modify {
	position: fixed;
	z-index: 1002;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #ffffff;

	.modify-header {
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1px solid $uni-border-color;

		.close {
			padding: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}

		.title {
			flex: auto;
			text-align: center;
			font-size: 40rpx;
			color: $uni-text-color;
			line-height: 88rpx;
		}

		.define {
			padding-right: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-color-success;
			line-height: 44rpx;
		}
	}

	.modify-main {
		display: flex;
		padding: $uni-spacing-col-base;
		flex-direction: column;

		.modify-pwd {
			margin-bottom: $uni-spacing-col-base;
			padding: 0 20rpx;
			box-sizing: border-box;
			width: 100%;
			height: 88rpx;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 88rpx;
		}

		.modify-content {
			padding: 16rpx 20rpx;
			box-sizing: border-box;
			flex: auto;
			width: 100%;
			height: 386rpx;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}
}
</style>
