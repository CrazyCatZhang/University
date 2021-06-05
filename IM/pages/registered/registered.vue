<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="toLogin()"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
		</view>
		<view class="logo"><image src="../../static/images/sign/logo1.png" mode=""></image></view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" placeholder="请输入用户名" class="user" placeholder-style="color:#aaa;font-weight:400;" @input="getUser" />
					<view class="employ" v-if="useremploy">该用户名已被使用</view>
					<image src="../../static/images/sign/right1.png" mode="" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" class="email" placeholder-style="color:#aaa;font-weight:400;" @input="isEmail" />
					<view class="employ" v-if="emailemploy">该邮箱已被使用</view>
					<view class="invalid" v-if="invalid">无效邮箱</view>
					<image src="../../static/images/sign/right1.png" mode="" class="ok" v-if="isemail"></image>
				</view>
				<view class="inputs-div">
					<input :type="type" placeholder="请设置密码" class="pwd" placeholder-style="color:#aaa;font-weight:400;" @input="getPwd" />
					<image :src="lookurl" mode="" class="look" @tap="looks"></image>
				</view>
			</view>
		</view>
		<view :class="[{ submit: isok }, { submit1: !isok }]">注册</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 'password',
			isuser: false, //用户名是否可用
			isemail: false, //邮箱是否可用
			look: false, //是否显示密码
			invalid: false, //邮箱格式是否正确
			useremploy: false, //用户名是否已经被使用
			emailemploy: false, //邮箱是否已经被使用
			lookurl: '../../static/images/sign/biyan.png',
			email: '',
			user: '',
			pwd: '',
			isok: false
		};
	},
	methods: {
		//密码显示隐藏
		looks: function() {
			if (this.look) {
				this.type = 'password';
				this.look = !this.look;
				this.lookurl = '../../static/images/sign/biyan.png';
			} else {
				this.type = 'text';
				this.look = !this.look;
				this.lookurl = '../../static/images/sign/look.png';
			}
		},

		//判断邮箱格式是否正确
		isEmail: function(e) {
			let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			this.email = e.detail.value;
			if (this.email.length > 0) {
				if (reg.test(this.email)) {
					this.invalid = false;
				} else {
					this.invalid = true;
				}
			}
			this.isOk();
		},

		getUser: function(e) {
			this.user = e.detail.value;
			this.isOk();
		},

		getPwd: function(e) {
			this.pwd = e.detail.value;
			this.isOk();
		},

		//判断是否可以注册
		isOk: function() {
			if (this.isuser && this.isemail && this.pwd.length > 8) {
				this.isok = true;
			} else {
				this.isok = false;
			}
		},

		toLogin: function() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.logo {
	text-align: center;
	image {
		padding-top: 256rpx;
		width: 194rpx;
		height: 92rpx;
		margin: 0 auto;
	}
}

.main {
	padding: 54rpx $uni-spacing-row-lg 120rpx;

	.title {
		font-size: 56rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
	}

	.inputs {
		padding-top: 8rpx;

		input {
			padding-top: 40rpx;
			height: 88rpx;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 88rpx;
			border-bottom: 1px solid $uni-border-color;
		}
	}

	.inputs-div {
		position: relative;
	}

	.employ,
	.invalid {
		position: absolute;
		right: 0;
		top: 40rpx;
		font-size: $uni-font-size-base;
		font-weight: 500;
		color: $uni-color-warning;
		line-height: 88rpx;
	}

	.ok {
		position: absolute;
		right: 0;
		top: 76rpx;
		width: 38rpx;
		height: 30rpx;
	}

	.look {
		position: absolute;
		right: 0;
		top: 76rpx;
		width: 32rpx;
		height: 18rpx;
	}
}

.submit {
	width: 520rpx;
	height: 96rpx;
	margin: 0 auto;
	background-color: $uni-color-primary;
	box-shadow: 0 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
	border-radius: 48rpx;
	font-size: $uni-font-size-lg;
	font-weight: 500;
	color: $uni-text-color;
	line-height: 96rpx;
	text-align: center;
}

.submit1 {
	width: 520rpx;
	height: 96rpx;
	margin: 0 auto;
	background-color: rgba(39, 40, 50, 0.2);
	border-radius: 48rpx;
	font-size: $uni-font-size-lg;
	font-weight: 500;
	color: $uni-text-color-inverse;
	line-height: 96rpx;
	text-align: center;
}
</style>
