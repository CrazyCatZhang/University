<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img" v-if="relation == 0 || relation == 1" @tap="userDetail"><image src="../../static/images/userhome/more.png" mode=""></image></view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-white" :animation="animationData4"></view>
			<image :src="user.imgurl" mode="aspectFill" class="bg-img"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{ background: sexBg }" :animation="animationData3"><image :src="seximg" mode=""></image></view>
				<image :src="user.imgurl" mode="aspectFill" class="user-img" :animation="animationData2"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{ markname }}</view>
				<view class="nick">昵称：{{ user.name }}</view>
				<view class="intro">{{ user.explain }}</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" @tap="addFriendBtn" v-if="relation == 2">加为好友</view>
			<view class="bottom-btn btn1" v-if="relation == 1">发送消息</view>
		</view>
		<view class="add-misg" :style="{ height: addHeight + 'px', bottom: -addHeight + 'px' }" :animation="animationData">
			<view class="name">{{ user.name }}</view>
			<textarea v-model="msg" maxlength="120" placeholder="" class="add-main" />
		</view>
		<view class="add-bt bottom-bar" :animation="animationData1">
			<view class="close btn1" @tap="addFriendAnimat">取消</view>
			<view class="send btn1" @tap="addSubmit">发送</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '', //对象
			uid: '', //用户id
			// fid: '',
			token: '', //token
			user: {},
			myname: '',
			markname: '',
			msg: '', //请求信息
			seximg: '../../static/images/userhome/asexual.png', //性别
			sexBg: 'rgba(39, 40, 50, 1)', //性别颜色
			relation: '', //用户关系 0表示自己 1表示好友 2表示陌生人
			addHeight: '', //add版块高度
			animationData: {}, //动画
			animationData1: {}, //动画
			animationData2: {}, //动画
			animationData3: {}, //动画
			animationData4: {}, //动画
			isAdd: false
		};
	},
	onLoad: function(e) {
		this.id = e.id;
		this.getStorage();
		this.getUser();
		this.judgeFriend();
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
						res.imgurl = this.serverUrl + res.imgurl;
						//处理简介
						if (typeof res.explain == 'undefined') {
							res.explain = '这个人很懒 什么都没有留下~';
						}
						//处理markname
						if (this.markname.length == 0) {
							this.markname = res.name;
						}
						this.sexJudge(res.sex);
						this.user = res;
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
				this.seximg = '../../static/images/userhome/female.png';
				this.sexBg = 'rgba(255, 93, 91, 1)';
			} else if (e == 'male') {
				this.seximg = '../../static/images/userhome/male.png';
				this.sexBg = 'rgba(87, 153, 255, 1)';
			} else {
				this.seximg = '../../static/images/userhome/asexual.png';
				this.sexBg = 'rgba(39, 40, 50, 1)';
			}
		},
		//判断是否为好友
		judgeFriend: function() {
			if (this.id == this.uid) {
				this.relation = 0;
			} else {
				//如果不是自己，进行后端访问验证
				uni.request({
					url: this.serverUrl + '/search/isfriend',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						if (status == 200) {
							//好友
							this.relation = 1;
							this.getMarkName();
						} else if (status == 400) {
							//陌生人
							this.relation = 2;
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
		//获取好友昵称
		getMarkName: function() {
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
		},

		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取页面高度
		getElementStyle: function() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.bg')
				.boundingClientRect(data => {
					console.log('得到布局位置信息' + JSON.stringify(data));
					console.log('节点离页面顶部的距离为' + data.top);
					this.addHeight = data.height - 186;
				})
				.exec();
		},
		//添加好友动画
		addFriendAnimat: function() {
			this.isAdd = !this.isAdd;
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation1 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation2 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation3 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});
			var animation4 = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease'
			});

			if (this.isAdd) {
				animation.bottom(0).step();
				animation1.bottom(0).step();
				animation2
					.width(120)
					.height(120)
					.step();
				animation3.opacity(0).step();
				animation4.backgroundColor('rgba(255,228,49,0.6)').step();
			} else {
				animation.bottom(-this.addHeight).step();
				animation1.bottom(-100).step();
				animation2
					.width()
					.height()
					.step();
				animation3.opacity(1).step();
				animation4.backgroundColor('rgba(255,228,49,0)').step();
			}

			this.animationData = animation.export();
			this.animationData1 = animation1.export();
			this.animationData2 = animation2.export();
			this.animationData3 = animation3.export();
			this.animationData4 = animation4.export();
		},
		//添加好友按钮
		addFriendBtn: function() {
			// this.fid = fid;
			this.msg = this.myname + '请求添加好友~';
			this.addFriendAnimat();
		},
		//确定添加好友
		addSubmit: function() {
			if (this.msg.length > 0) {
				this.addFriendAnimat();
				uni.request({
					url: this.serverUrl + '/friend/applyfriend',
					data: {
						uid: this.uid,
						fid: this.id,
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

		//跳转到用户详情页
		userDetail: function() {
			uni.navigateTo({
				url: '../userdetails/userdetails?id=' + this.id
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.bg {
	position: fixed;
	z-index: -2;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	.bg-white {
		width: 100%;
		height: 100%;
		// background-color: #eee;
	}

	.bg-img {
		position: absolute;
		z-index: -1;
		left: -10rpx;
		top: -10rpx;
		width: 110%;
		height: 110%;
		filter: blur(16px);
		opacity: 0.4;
	}
}

.main {
	padding-top: 240rpx;
	text-align: center;

	.user-header {
		position: relative;
		width: 412rpx;
		height: 412rpx;
		margin: 0 auto;

		.sex {
			position: absolute;
			z-index: 11;
			bottom: 22rpx;
			right: 22rpx;
			width: 64rpx;
			height: 64rpx;
			// background-color: rgba(255, 93, 91, 1);
			border-radius: $uni-border-radius-circle;

			image {
				padding: 16rpx;
				width: 32rpx;
				height: 32rpx;
			}
		}

		.user-img {
			z-index: 10;
			top: 0;
			width: 400rpx;
			height: 400rpx;
			border-radius: 48rpx;
			border: 6rpx solid rgba(255, 255, 255, 1);
			box-shadow: 0 36rpx 40rpx 0 rgba(39, 40, 50, 0.1);
		}
	}

	.user-imf {
		padding-top: 42rpx;

		.name {
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}

		.nick {
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 40rpx;
		}

		.intro {
			padding: 20rpx 100rpx;
			font-size: $uni-font-size-base;
			font-weight: 300;
			color: $uni-text-color;
			line-height: 48rpx;
		}
	}
}

.bottom-bar {
	.bottom-btn {
		margin: 0 $uni-spacing-col-base;
		background-color: $uni-color-primary;
	}
}

.add-misg {
	position: fixed;
	// bottom: 0;
	width: 100%;
	box-sizing: border-box;
	padding: 0 56rpx;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 40rpx 40rpx 0 0;

	.name {
		padding: 168rpx 0 40rpx;
		font-size: 52rpx;
		color: $uni-text-color;
		line-height: 74rpx;
	}

	.add-main {
		padding: 18rpx 22rpx;
		box-sizing: border-box;
		width: 100%;
		height: 420rpx;
		background-color: $uni-bg-color-grey;
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 44rpx;
	}
}

.add-bt {
	bottom: -200rpx;
	z-index: 100;
	display: flex;

	.close {
		// flex: 0;
		width: 172rpx;
		background-color: $uni-bg-color-hover;
		margin-left: $uni-spacing-col-base;
	}

	.send {
		margin: 0 $uni-spacing-col-base;
		flex: auto;
		background-color: $uni-color-primary;
	}
}
</style>
