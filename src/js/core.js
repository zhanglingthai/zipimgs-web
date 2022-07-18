//dropzone

Dropzone.autoDiscover = false;

var dropz = new Dropzone('div#dropzone', {
    url: 'https://fundscat.com/api/upload',
    method:"post",
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
                <span class="progress-error" data-dz-errormessage></span>
            </div>
        </div>
        <div class="right">
            <div class="outputsize">666kb</div>
            <div class="ctrl">
                <a href="">对比</a>
                <a href="">下载文件</a>
            </div>
            <div class="proportion">-99%</div>
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
        this.on("addedfile", function (file) {
            // var removeButton = Dropzone.createElement("<button class='btn btn-sm btn-block'>移除</button>");
            // removeButton.addEventListener("click", function (e) {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     myDropzone.removeFile(file);
            // });
            // file.previewElement.appendChild(removeButton);
            $('.resultbox').show();
        });
        this.on("sending", (data, xhr, formData) => {
            console.log("sending", data, xhr, formData)
        });
        // this.on("sendingmultiple", (file, xhr, formData) => {
        //     console.log("sendingmultiple", file, xhr, formData)
        // });
        // //所有文件上传进度
        // this.on("totaluploadprogress", (progress, byte, bytes) => {
        //     console.log("totaluploadprogress", progress, byte, bytes)
        // });
        // //单个文件上传进度
        // this.on("uploadprogress",(file, progress, bytesSent)=>{
        //     console.log('uploadprogress'+file, progress, bytesSent)
        // });
        // this.on("success", (files, response) => {
        //     console.log("success", files, response)
        // });
        // this.on("successmultiple", (files, response) => {
        //     console.log("successmultiple", files, response)
        // });
        // this.on("error", (files, response) => {
        //     console.log("error", files, response)
        // });
        // this.on("removedfile",(file)=>{

        // });
        // this.on("canceled",(file)=>{

        // });
        // this.on("canceledmultiple",(file)=>{

        // });
        // //生成预览
        // this.on("thumbnail",(file, dataUrl)=>{
        //     // console.log("thumbnail",file, dataUrl)
        // });
        // //开始上传流程
        // this.on("processing",file=>{
        //     console.log('processing')
        // });
        // this.on("complete",file =>{
        //     console.log('complete1',file)
        // })
    },
    sendingmultiple: function (file, xhr, formData) {// 在每个文件发送之前调用。获取xhr对象和formData对象作为第二和第三个参数，可以修改它们（例如添加CSRF令牌）或添加其他数据。
        console.log(file, xhr, formData)
        // $.each(submitParams, function (key, value) {
        //     formData.set(key, value);
        // });
    },
    successmultiple: function (file, response) {// 该文件已成功上传。获取服务器响应作为第二个参数。
        console.log(file, response)
    },
    completemultiple: function (file) {
        // console.log('completemultiple',file)
    },
    complete: function (file) {
        // console.log('complete',file)
    },
});