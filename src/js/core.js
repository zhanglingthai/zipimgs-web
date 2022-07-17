//dropzone

Dropzone.autoDiscover = false;

var dropz = new Dropzone('div.dropzone', {
    url: 'https://fundscat.com/api/upload',
    autoProcessQueue: true,// 如果为false，文件将被添加到队列中，但不会自动处理队列。
    uploadMultiple: true, // 是否在一个请求中发送多个文件。
    parallelUploads: 32, // 并行处理多少个文件上传
    maxFiles: 32, // 用于限制此Dropzone将处理的最大文件数
    maxFilesize: 5,
    acceptedFiles: ".jpg,.gif,.png,.svg",
    dictDefaultMessage: `
    <div class="icon"><img src="./imgs/upload-solid.svg"></div>
    <div class="prompt">
        <p>拖入 或 点选 JPG PNG GIF SVG 图片</p>
        <p>单次限制 32张 X 5MB</p>
    </div>
    `,
    previewTemplate:document.querySelector('.resultbox').innerHTML,
    dictFallbackMessage: "你的浏览器不支持拖拉文件来上传",
    dictInvalidFileType:"文件内包含不支持的格式",
    dictMaxFilesExceeded: "文件数量过多",
    dictFileTooBig: "可添加的最大文件大小为{{maxFilesize}}Mb，当前文件大小为{{filesize}}Mb ",
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
        });
    },
    // sendingmultiple: function (file, xhr, formData) {// 在每个文件发送之前调用。获取xhr对象和formData对象作为第二和第三个参数，可以修改它们（例如添加CSRF令牌）或添加其他数据。
    //     $.each(submitParams, function (key, value) {
    //         formData.set(key, value);
    //     });
    // },
    // successmultiple: function (file, response) {// 该文件已成功上传。获取服务器响应作为第二个参数。
    // },
    // completemultiple: function (file, data) {
    // },
});