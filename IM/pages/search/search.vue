<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/search/search.png" mode="" class="search-img"></image>
				<input type="search" placeholder="搜索用户或群" class="search" placeholder-style="color:#aaa;font-weight:400;" @input="search" />
			</view>
			<view class="top-bar-right"><view class="text" @tap="backOne">取消</view></view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length > 0">用户</view>
				<view class="list user" v-for="(item, index) in userarr" :key="index">
					<navigator :url="'../userhome/userhome?id=' + item._id" hover-class="none"><image :src="item.imgurl" mode=""></image></navigator>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip === 1">发消息</view>
					<view class="right-bt add" v-if="item.tip === 0" @tap="addFriendBtn(item._id)">加好友</view>
				</view>
			</view>
		</view>
		<!-- 添加好友弹出层 -->
		<view class="modify" :style="{ bottom: -widHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">添加好友</view>
				<view class="define" @tap="addSubmit">确定</view>
			</view>
			<view class="modify-main"><textarea value="" placeholder="" v-model="msg" class="modify-content" /></view>
		</view>
	</view>
</template>

<script>
import datas from '../../commons/js/datas.js';
import myfun from '../../commons/js/method.js';

export default {
	data() {
		return {
			userarr: [],
			uid: '',
			fid: '',	//当前用户点击添加好友的id
			token: '',
			myname: '',
			msg: '', //添加好友信息
			animationData: {}, //动画
			isModify: false, //动画开关
			widHeight: '' //页面高度
		};
	},
	onLoad: function() {
		this.getStorage();
	},
	onReady: function() {
		this.getElementStyle();
	},
	methods: {
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
		//获取关键词
		search: myfun.debounce(function(e) {
			this.userarr = [];
			let searchval = e.detail.value;
			if (searchval.length > 0) {
				this.searchUser(searchval);
			}
		}, 500),
		search1: function(e) {
			this.userarr = [];
			let searchval = e.detail.value;
			if (searchval.length > 0) {
				this.searchUser(searchval);
			}
		},
		//寻找关键词所匹配的用户
		searchUser: function(e) {
			uni.request({
				url: this.serverUrl + '/search/user',
				data: {
					data: e,
					token: this.token
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					//访问后端成功
					if (status == 200) {
						let arr = data.data.result;
						for (var i = 0; i < arr.length; i++) {
							this.isFriend(arr[i],e);
							// if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
							// 	this.isFriend(arr[i]);
							// }
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
		},
		//判断是否为好友
		isFriend: function(arr, e) {
			let tip = 0;
			let exp = eval('/' + e + '/g');
			if (arr._id == this.uid) {
				tip = 2;
				arr.tip = tip;
				arr.imgurl = this.serverUrl + arr.imgurl;
				arr.name = arr.name.replace(exp, "<span style = 'color:#4AAAFF;'>" + e + '</span>');
				arr.email = arr.email.replace(exp, "<span style = 'color:#4AAAFF;'>" + e + '</span>');
				this.userarr.push(arr);
			} else {
				uni.request({
					url: this.serverUrl + '/search/isfriend',
					data: {
						uid: this.uid,
						fid: arr._id,
						token: this.token
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							//是好友
							tip = 1;
						} else if (status == 400) {
							//不是好友
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
						arr.tip = tip;
						arr.imgurl = this.serverUrl + arr.imgurl;
						arr.name = arr.name.replace(exp, "<span style = 'color:#4AAAFF;'>" + e + '</span>');
						arr.email = arr.email.replace(exp, "<span style = 'color:#4AAAFF;'>" + e + '</span>');
						this.userarr.push(arr);
					}
				});
			}
		},
		//修改项弹框
		modify: function(type, data, ispwd) {
			if (ispwd) {
				this.ispwd = 'block';
			} else {
				this.ispwd = 'none';
			}
			this.modifyTitle = type;
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
			this.modify();
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
		//添加好友按钮
		addFriendBtn: function(fid) {
			this.fid = fid;
			this.msg = this.myname + '请求添加好友~';
			this.modify();
		},
		//确定添加好友
		addSubmit: function() {
			if (this.msg.length > 0) {
				this.modify();
				uni.request({
					url: this.serverUrl + '/friend/applyfriend',
					data: {
						uid: this.uid,
						fid: this.fid,
						token: this.token,
						msg: this.msg
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						console.log(status);
						//访问后端成功
						if (status == 200) {
							//是好友
							uni.showToast({
								title: '好友请求发送成功',
								icon: 'none',
								duration: 2000
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
			}
		},
		//返回首页
		backOne: function() {
			uni.navigateBack({
				delta: 1
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

	.search-div {
		position: absolute;
		left: 0;
		// top: 0;
		width: 100%;
		z-index: -1;
		box-sizing: border-box;
		padding: 14rpx 118rpx 14rpx 32rpx;
	}

	.search {
		padding: 0 60rpx 0 12rpx;
		height: 60rpx;
		background-color: $uni-bg-color-grey;
		border-radius: 10rpx;
	}

	.search-img {
		position: absolute;
		right: 130rpx;
		top: 22rpx;
		width: 40rpx;
		height: 40rpx;
	}
}

.main {
	padding: 88rpx $uni-spacing-col-base;

	.result {
		padding-top: $uni-spacing-col-base;

		.title {
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}

		.list {
			width: 100%;
			height: 80rpx;
			padding: 20rpx 0;

			image {
				float: left;
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
		}

		.names {
			float: left;
			padding-left: $uni-spacing-col-base;
		}

		.name {
			font-size: 36rpx;
			color: $uni-text-color;
			line-height: 50rpx;
		}

		.email {
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			line-height: 28rpx;
		}

		.right-bt {
			float: right;
			width: 120rpx;
			height: 48rpx;
			border-radius: 24rpx;
			font-size: $uni-font-size-sm;
			line-height: 48rpx;
			margin-top: 16rpx;
			text-align: center;
		}

		.send {
			background-color: $uni-color-primary;
			color: $uni-text-color;
		}

		.add {
			background-color: rgba(74, 170, 255, 0.1);
			color: $uni-color-success;
		}
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
