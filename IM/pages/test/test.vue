<template>
	<view>
		<view class="upload" @tap="upload">上传图片</view>
		<image v-for="{ item, index } in img" :key="index" :src="item"></image>
	</view>
</template>

<script>
import method from '../../commons/js/method.js';

export default {
	data() {
		return {
			id: '',
			img: []
		};
	},
	methods: {
		upload: function() {
			//获取当前时间
			let url = method.fileName(new Date());
			uni.chooseImage({
				count: 6, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: chooseImageRes => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					for (var i = 0; i < tempFilePaths.length; i++) {
						const uploadTask = uni.uploadFile({
							url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[i],
							name: 'file',
							formData: {
								url: url,
								name: new Date().getTime() + this.id + i
							},
							success: uploadFileRes => {
								let path = this.serverUrl  + uploadFileRes.data;
								this.img.push(path);
								console.log(this.img.length);
								console.log(uploadFileRes.data);
							}
						});

						uploadTask.onProgressUpdate(res => {
							console.log('上传进度' + res.progress);
							console.log('已经上传的数据长度' + res.totalBytesSent);
							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

							// // 测试条件，取消上传任务。
							// if (res.progress > 50) {
							// 	uploadTask.abort();
							// }
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.upload {
	padding-top: 40rpx;
	text-align: center;
}
</style>
