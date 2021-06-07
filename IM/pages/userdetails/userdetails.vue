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
					<view class="user-head">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('签名', dataArr.sign, false)">
					<view class="title">签名</view>
					<view class="cont">{{ dataArr.sign }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">{{ changeTime(dataArr.registered) }}</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('昵称', dataArr.name, false)">
					<view class="title">昵称</view>
					<view class="cont">{{ dataArr.name }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{ array[index] }}</view>
						</picker>
					</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{ date }}</view>
						</picker>
					</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('电话', dataArr.tell, false)">
					<view class="title">电话</view>
					<view class="cont">{{ dataArr.tell }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
				<view class="row" @tap="modify('邮箱', dataArr.mail, true)">
					<view class="title">邮箱</view>
					<view class="cont">{{ dataArr.mail }}</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="column">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">*********</view>
					<view class="more"><image src="../../static/images/common/more.png" mode="aspectFit"></image></view>
				</view>
			</view>
			<view class="bt2">退出登录</view>
		</view>
		<view class="modify" :style="{ bottom: -widHeight + 'px' }" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">签名</view>
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
			dataArr: {
				name: '小明',
				sign:
					'有时会讨厌不甘平庸却又不好好努力的自己 觉得自己不够好 羡慕别人闪闪发光 我们试着长大 做努力爬的蜗牛或坚持飞的笨鸟 一路跌跌撞撞，然后遍体鳞伤 总有一天你会站在最亮的地方 活成自己曾经渴望的模样',
				registered: new Date(),
				sex: '男',
				birth: '1998-04-12',
				tell: '124142351515',
				mail: 'safadda@163.com'
			},
			cropFilePath: '../../static/images/img/three.png',
			array: ['男', '女'],
			index: 0,
			date: currentDate,
			tempFilePath: '',
			modifyTitle: '', //修改标题
			data: '修改的内容', //修改签名内容
			pwd: '', //原密码
			ispwd: false, //是否需要原密码
			animationData: {}, //动画
			isModify: false, //动画开关
			widHeight: '' //页面高度
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
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//时间处理
		changeTime: function(date) {
			return myfun.detailTime(date);
		},
		//性别选择器
		bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
		},
		//日期选择器
		bindDateChange: function(e) {
			this.date = e.target.value;
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

			uni.uploadFile({
				url: '后端地址上传图片接口地址',
				filePath: this.cropFilePath,
				name: 'file',
				fileType: 'image',
				//formData:{},传递参数
				success: uploadFileRes => {
					var backstr = uploadFileRes.data;
					//自定义操作
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
