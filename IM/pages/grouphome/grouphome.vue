<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back1.png" mode="" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/images/group/more1.png" mode=""></image></view>
			</view>
		</view>
		<view class="top-bar bgbar" :animation="animationData">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/images/group/more.png" mode=""></image></view>
			</view>
		</view>
		<view class="bg"><image :src="gimg" mode="aspectFill" class="bg-img"></image></view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">今天很好</view>
					<view class="time">2021/06/13</view>
					<view class="notice">
						光阴荏苒，可浪漫总那么悠长，总有人加倍爱你，光阴荏苒，可浪漫总那么悠长，总有人加倍爱你，光阴荏苒，可浪漫总那么悠长，总有人加倍爱你，光阴荏苒，可浪漫总那么悠长，总有人加倍爱你。
					</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">管理群成员</view>
						<image src="../../static/images/common/more.png" mode="aspectFit" class="more-img"></image>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item, index) in groupmember" :key="index">
							<view class="imgs">
								<image src="../../static/images/group/delete.png" mode="aspectFill" class="delete"></image>
								<image :src="item.imgurl" mode="aspectFit" class="user-img"></image>
							</view>
							<view class="name">{{ item.name }}</view>
						</view>
						<view class="member-li">
							<view class="imgs"><image src="../../static/images/group/add.png" mode="aspectFit" class="user-add"></image></view>
							<view class="name">邀请</view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="row" @tap="modify('gname', '群名称', '今天很好', true)">
						<view class="title">群名称</view>
						<view class="cont">今天很好</view>
						<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
					</view>
					<view class="row">
						<view class="title">群头像</view>
						<view class="cont">
							<view class="user-head">
								<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
								<image :src="gimg" @tap="upload" class="group-img"></image>
							</view>
							<!-- <image :src="gimg" mode="aspectFill" class="group-img"></image> -->
						</view>
						<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
					</view>
					<view class="row" @tap="modify('gnotice', '群公告', '世界那么大，爱你的人总会知道怎么爱你', true)">
						<view class="title">群公告</view>
						<view class="cont">世界那么大，爱你的人总会知道怎么爱你</view>
						<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
					</view>
					<view class="row" @tap="modify('giname', '群内昵称', 'Gideon', true)">
						<view class="title">群内昵称</view>
						<view class="cont">Gideon</view>
						<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
					</view>
					<view class="row">
						<view class="title">消息免打扰</view>
						<view class="cont"></view>
						<view class="more"><switch :checked="swit" @change="switchChange" color="rgba(255, 228, 49, 1)" class="switch" /></view>
					</view>
				</view>
				<view class="bt2">解散群</view>
			</view>
		</view>
		<view class="modify" :style="{ bottom: -widHeight + 'px' }" :animation="animationData1">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<textarea value="" placeholder="" v-model="data" class="modify-content" />
			</view>
		</view>
	</view>
</template>

<script>
import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
import datas from '../../commons/js/datas.js';

export default {
	data() {
		return {
			gid: '',
			gimg: '',
			swit: false,
			groupmember: [],
			top: 0,
			animationData: {}, //动画
			tempFilePath: '',
			headimg: '',
			modifyTitle: '', //修改标题
			data: '', //修改签名内容
			olddata: '', //原始数据
			type: '', //修改项
			animationData1: {}, //动画
			isModify: false, //动画开关
			widHeight: '1000' //页面高度
		};
	},
	onLoad: function(e) {
		this.gid = e.gid;
		this.gimg = e.gimg;
		this.getMember();
	},
	onReady: function() {
		this.getTop();
	},
	components: { ImageCropper },
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//滑块监听
		switchChange: function(e) {
			console.log('switch1 发生 change 事件，携带值为', e.target.value);
		},
		//获取群成员
		getMember: function() {
			let members = datas.friends();
			for (var i = 0; i < members.length; i++) {
				members[i].imgurl = '../../static/images/img/' + members[i].imgurl;
				this.groupmember.push(members[i]);
			}
			// console.log(this.groupmember[0].imgurl);
		},
		//获取距离顶部高度
		getTop: function() {
			// console.log(this.top);
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.main-inner')
				.boundingClientRect(data => {
					this.top = data.top;
					// console.log(this.top);
				})
				.exec();
		},
		//顶部切换动画
		addAnimat: function() {
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'linear'
			});
			if (this.top < 60) {
				animation.opacity(1).step();
			} else {
				animation.opacity(0).step();
			}
			this.animationData = animation.export();
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
			this.gimg = e.detail.tempFilePath;
			this.headimg = e.detail.tempFilePath;

			// uni.uploadFile({
			// 	url: this.serverUrl + '/files/upload', //'后端地址上传图片接口地址',
			// 	filePath: this.cropFilePath,
			// 	name: 'file',
			// 	fileType: 'image',
			// 	formData: {
			// 		url: 'user',
			// 		name: this.uid,
			// 		token: this.token
			// 	}, //传递参数
			// 	success: uploadFileRes => {
			// 		var backstr = uploadFileRes.data;
			// 		console.log(backstr);
			// 		//本地存储用户信息修改
			// 		try {
			// 			uni.setStorageSync('user', { id: this.uid, name: this.myname, imgurl: backstr, token: this.token });
			// 		} catch (e) {
			// 			// error
			// 			console.log('数据存储出错');
			// 		}
			// 		//修改头像保存到数据库
			// 		this.update(backstr, 'imgurl', undefined);
			// 	},

			// 	fail(e) {
			// 		console.log('this is errormes ' + e.message);
			// 	}
			// });
		},
		cancel() {
			console.log('canceled');
			this.tempFilePath = '';
		},
		//修改项弹框
		modify: function(t, type, data, ispwd) {
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
		
			this.animationData1 = animation.export();
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
						this.update(this.data, this.type);
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
					this.update(this.data, this.type);
					//前端替换修改
					// this.user[this.type] = this.data;
				}
			}
			//关闭弹出层
			this.modify();
		},
	},
	onPageScroll: function() {
		this.getTop();
		this.addAnimat();
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.clear {
	clear: both;
}

.bg {
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	height: 100%;
	background-color: #ffffff;

	.bg-img {
		width: 100%;
		height: 750rpx;
	}
}

.bgbar {
	opacity: 0;
	background-color: #ffffff;
}

.main {
	padding-top: 360rpx;

	.main-inner {
		width: 100%;
		min-height: 720rpx;
		background-color: #ffffff;
		border-radius: 40rpx 40rpx 0 0;
	}

	.inf {
		padding: $uni-spacing-row-base $uni-spacing-col-base 40rpx $uni-spacing-col-base;
		box-sizing: border-box;
		border-bottom: 1px solid #eee;

		.name {
			float: left;
			font-size: 48rpx;
			font-weight: 600;
			color: #272832;
			line-height: 66rpx;
		}

		.time {
			float: right;
			font-size: 28rpx;
			color: rgba(39, 40, 50, 0.5);
			line-height: 66rpx;
		}

		.notice {
			padding-top: 20rpx;
			font-size: 28rpx;
			color: #272832;
			line-height: 40rpx;
			clear: both;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}

	.member {
		border-bottom: 1px solid #eee;

		.top {
			padding: $uni-spacing-row-base $uni-spacing-col-base 0;
			box-sizing: border-box;
			width: 100%;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.title {
				flex: 1;
				font-size: 36rpx;
				font-weight: 600;
				color: #272832;
			}

			.more {
				float: right;
				padding-right: 20rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.6);
			}

			.more-img {
				width: 16rpx;
				height: 28rpx;
			}
		}

		.member-ls {
			width: 100%;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
		}

		.member-li {
			padding-bottom: 32rpx;
			width: 20%;
			float: left;
			text-align: center;

			.imgs {
				display: inline-block;
				position: relative;
				width: 104rpx;
				height: 104rpx;
				border-radius: 20rpx;
				background-color: $uni-color-primary;
			}

			.user-img {
				width: 104rpx;
				height: 104rpx;
				border-radius: 20rpx;
			}

			.delete {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: -16rpx;
				right: -16rpx;
				z-index: 10;
			}

			.name {
				padding: 0 8rpx;
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}

			.user-add {
				width: 104rpx;
				height: 104rpx;
				padding: 32rpx;
				box-sizing: border-box;
			}
		}
	}

	.mitem {
		display: flex;
		flex-direction: column;
		padding-top: 22rpx;
		width: 100%;
		border-bottom: 1px solid #eee;

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
			height: 112rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.group-img {
			width: 80rpx;
			height: 80rpx;
			border-radius: 20rpx;
			margin: 16rpx 0 0 0;
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

		.switch {
			margin-right: 22rpx;
		}
	}

	.bt2 {
		margin-top: 80rpx;
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
