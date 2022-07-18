//dropzone

Dropzone.autoDiscover = false;

var dropzone = new Dropzone('div#dropzone', {
    url: 'https://fundscat.com/api/upload',
    method: "post",
    maxFiles: 50, // 用于限制此Dropzone将处理的最大文件数
    parallelUploads: 8, // 前端同时发送upload 数
    maxFilesize: 5, //单文件最大 5M
    acceptedFiles: ".jpg,.gif,.png,.svg",
    paramName: "file", //参数名
    filesizeBase: 1000,
    uploadMultiple: false, // 是否在一个请求中发送多个文件。
    addRemoveLinks: false,//每个预览添加删除按钮
    dictDefaultMessage: `
    <div class="icon"><img src="./imgs/upload-solid.svg"></div>
    <div class="prompt">
        <p>拖入 或 点选 JPG PNG GIF SVG 图片</p>
        <p>单次限制 50张 X 5MB</p>
    </div>
    `,//上传区域dom
    previewsContainer: document.querySelector('.resultbox ul'),
    previewTemplate: `
    <li>
        <div class="left">
            <div class="img-wrap"><img data-dz-thumbnail /></div>
            <div class="filename" data-dz-name></div>
            <div class="uploadsize" data-dz-size></div>
        </div>
        <div class="center">
            <div class="progress-wrap">
                <span class="progress-line" data-dz-uploadprogress></span>
                <span class="progress-per" data-dz-uploadprogress-per>0%...</span>
                <span class="progress-error" data-dz-errormessage></span>
            </div>
        </div>
        <div class="right" data-dz-complete>
            <div class="outputsize" data-dz-outputsize>0KB</div>
            <div class="ctrl">
            <!-- <a href="" data-dz-compare alt="对比图片" target="_blank">对比图片</a> -->
                <a href="" data-dz-outputurl alt="下载图片">下载图片</a>
            </div>
            <div class="proportion" data-dz-proportion>0%</div>
        </div>
    </li>
    `,
    autoProcessQueue: true,// 如果为false，文件将被添加到队列中，但不会自动处理队列。
    dictFallbackMessage: "你的浏览器不支持拖拉文件来上传",
    dictInvalidFileType: "图片仅支持jpg,gif,png,svg",
    dictMaxFilesExceeded: "图片数量超出{{maxFiles}}",
    dictFileTooBig: "图片最大支持{{maxFilesize}}Mb，当前图片为{{filesize}}Mb ",
    dictResponseError: "上传失败：{{statusCode}}",
    init: function () { // dropzone初始化时调用您可以在此处添加事件侦听器
        var myDropzone = this;

        //每次操作触发一次
        this.on("addedfiles", function (file) {
            $('.resultbox').show();
        });
        //总上传进度
        this.on("totaluploadprogress", (totalUploadProgress, totalBytes, totalBytesSent) => {
            console.log("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent)
        });
        //单个文件上传进度
        this.on("uploadprogress", (file, progress, bytesSent) => {
            if (file.previewElement) {
                if (progress == 100) {
                    for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress-per]")) {
                        node.textContent = `ZIPING IMG...`;
                    }
                } else {
                    for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress-per]")) {
                        node.textContent = `${progress.toFixed(2)}%`;
                    }
                }
            }
        });
        this.on("success", (file, response, e) => {
            console.log("success", file, response, e)
            if (file.previewElement) {
                for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress-per]")) {
                    node.textContent = `ZIP 成功`;
                }
                //做压缩后的文字处理跟链接处理

                if (response.success) {
                    const img = response.data[0];
                    for (let node of file.previewElement.querySelectorAll("[data-dz-outputsize]")) {
                        node.textContent = `${byteToKB(img.outputSize)}`;
                    }

                    for (let node of file.previewElement.querySelectorAll("[data-dz-proportion]")) {
                        node.textContent = `${getProportion(img.uploadSize, img.outputSize)}`;
                    }

                    for (let node of file.previewElement.querySelectorAll("[data-dz-compare]")) {
                        node.href = `/compare?uploadimg=${img.uploadPath}&outputimg=${img.outputPath}`;
                    }

                    for (let node of file.previewElement.querySelectorAll("[data-dz-outputurl]")) {
                        node.href = `${img.outputPath}`;
                        node.download = `${img.filename}`;
                    }

                } else {

                }
            }
        });

        this.on("complete", file => {
            console.log('complete', file)
            if (file.previewElement) {
                for (let node of file.previewElement.querySelectorAll("[data-dz-complete]")) {
                    node.style.display = `inline-block`;
                }
            }
        })

        this.on("error", (file, message) => {
            if (file.previewElement) {
                //改变进度条颜色
                for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress]")) {
                    node.style.backgroundColor = `#bbb`;
                }

                //隐藏进度条百分比
                for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress-per]")) {
                    node.style.display = `none`;
                }
            }
        })
    }
});

const byteToKB = (bytes) => {
    return `${(bytes / 1000).toFixed(2)} KB`;
}

//压缩前后对比率
const getProportion = (uploadSize, outputSize) => {
    return `-${100 - Math.floor((outputSize / uploadSize) * 100)} %`
}