<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><view class="text">取消</view></view>
			<view class="top-bar-center"><view class="title">创建群聊</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image src="../../static/images/group/change.png" class="pen" @tap="upload"></image>
					<image :src="cropFilePath" class="img" @tap="upload"></image>
				</view>
				<!-- 群昵称 -->
				<view class="group-name">
					<input type="text" value="" class="group-name-input" placeholder="为群取个名字" placeholder-style="color:#aaa;font-weight:400;" v-model="name" />
				</view>
				<view class="title">用户</view>
			</view>
			<!-- 选择用户 -->
			<view class="friends">
				<view class="user" v-for="(item, index) in friends" :key="index" @tap="selectFriend(index)">
					<view class="selected" :class="{ isselected: item.selected }">
						<image src="../../static/images/group/choose.png" mode="" v-if="item.selected" class="selected-img"></image>
					</view>
					<image class="user-img" :src="item.imgurl" mode=""></image>
					<view class="name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<view class="bottom-btn btn1" :class="{ isselect: select && name.length > 0 }" @tap="submit">创建({{ selectedNum }})</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
export default {
	data() {
		return {
			uid: '',
			token: '',
			gimgurl: '/group/group.png',
			tempFilePath: '',
			cropFilePath: '../../static/images/group/group.png',
			headimg: '',
			selectedNum: 0,
			name: '',
			friends: [], //好友数组
			user: [] //已选择好友数组
		};
	},
	components: { ImageCropper },
	onLoad: function() {
		this.selectedNumber();
		this.getStorage();
		this.getFriends();
	},
	computed: {
		select: function() {
			if (this.selectedNum > 0) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//返回上一层
		backOne: function() {
			uni.navigateTo({
				url: '../index/index'
			});
		},
		//获取登录成功的本地缓存数据
		getStorage: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.token = value.token;
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
		//获取已选择个数
		selectedNumber: function() {
			for (var i = 0; i < this.friends.length; i++) {
				if (this.friends[i].selected) {
					this.selectedNum++;
				}
			}
		},
		//群头像裁剪
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
					url: 'group',
					name: this.uid + new Date().getTime(),
					token: this.token
				}, //传递参数
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					console.log(backstr);
					//获取群头像名称
					this.gimgurl = backstr;
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
		//动态选择好友
		selectFriend: function(index) {
			if (this.friends[index].selected) {
				this.friends[index].selected = false;
				this.selectedNum--;
			} else {
				this.friends[index].selected = true;
				this.selectedNum++;
			}
		},
		//好友获取
		getFriends: function() {
			uni.request({
				url: this.serverUrl + '/index/getfriend',
				data: {
					uid: this.uid,
					state: 0,
					token: this.token
				},
				method: 'POST',
				success: data => {
					this.refresh = true;
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						this.noone = false;
						if (res.length > 0) {
							for (var i = 0; i < res.length; i++) {
								res[i].selected = false;
								res[i].imgurl = this.serverUrl + res[i].imgurl;
								if (res[i].markname) {
									res[i].name = res[i].markname;
								}
								this.friends.push(res[i]);
							}
							// console.log(this.friends);
						} else {
							// this.noone = true;
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
		//创建提交
		submit: function() {
			//符合提交条件
			if (this.select && this.name.length > 0) {
				this.user.push(this.uid);
				for (var i = 0; i < this.friends.length; i++) {
					if (this.friends[i].selected) {
						this.user.push(this.friends[i].id);
					}
				}
				uni.request({
					url: this.serverUrl + '/group/creategroup',
					data: {
						uid: this.uid,
						token: this.token,
						name: this.name,
						imgurl: this.gimgurl,
						user: this.user
					},
					method: 'POST',
					success: data => {
						this.refresh = true;
						let status = data.data.status;
						if (status == 200) {
							//创建成功跳回首页
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
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.top-bar {
	background: rgba(255, 255, 255, 1);
	border-bottom: 1px solid $uni-border-color;
}

.main {
	display: flex;
	flex-direction: column;

	.top {
		position: fixed;
		padding-top: 148rpx;
		background-color: #ffffff;
		width: 100%;
		z-index: 100;
	}

	.group-img {
		position: relative;
		width: 196rpx;
		height: 196rpx;
		margin: 0 auto;
		background-color: #ffe431;
		box-shadow: 0 36rpx 40rpx 0 rgba(39, 40, 50, 0.1);
		border-radius: 40rpx;
		overflow: hidden;

		.img {
			width: 196rpx;
			height: 196rpx;
		}

		.pen {
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: 56rpx;
			height: 56rpx;
		}
	}

	.group-name {
		padding: 62rpx $uni-spacing-col-base 0;
	}

	.group-name-input {
		height: 92rpx;
		background-color: $uni-bg-color-grey;
		border-radius: 46rpx;
		text-align: center;
		font-size: 32rpx;
		color: $uni-text-color;
	}

	.title {
		padding: $uni-spacing-row-base $uni-spacing-col-base 20rpx;
		font-size: 44rpx;
		font-weight: 600;
		color: $uni-text-color;
		left: 60rpx;
	}

	.friends {
		padding: 600rpx $uni-spacing-col-base 100rpx;

		.user {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 120rpx;

			.selected {
				flex: none;
				width: 48rpx;
				height: 48rpx;
				margin-right: 30rpx;
				background-color: rgba(255, 228, 49, 0.5);
				border-radius: 24rpx;
				position: relative;

				.selected-img {
					position: absolute;
					width: 30rpx;
					height: 20rpx;
					left: 10rpx;
					top: 16rpx;
				}
			}

			.isselected {
				background-color: rgba(255, 228, 49, 1);
			}

			.user-img {
				flex: none;
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}

			.name {
				padding-left: 32rpx;
				font-size: 36rpx;
				color: $uni-text-color;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	}
}

.bottom-bar {
	background-color: rgba(250, 250, 250, 0.9);
	box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);

	.bottom-btn {
		margin: 0 $uni-spacing-col-base;
		background-color: $uni-bg-color-grey;
	}

	.isselect {
		background-color: $uni-color-primary;
	}
}
</style>
