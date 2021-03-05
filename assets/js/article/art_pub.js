$(function() {
    var form = layui.form
    var layer = layui.layer


    // 初始化富文本编辑器
    initEditor()
        //调用加载文章数据方法
    initCate()
        //第一加载文章数据方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！")
                }

                //调用模板引擎 渲染分类的下拉菜单
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }

        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //选择封面按钮绑定点击事件处理函数
    $("#btnChooseImage").on("click", function() {
            $("#coverFile").click()
        })
        //监听coverFile change 事件函数 获取用户选择文件列表
    $("#coverFile").on("change", function(e) {
        //获取到文件列表数组
        var files = e.target.files
            //判断用户是否选择文件
        if (files.length === 0) {
            return
        }
        //根据文件 创建 对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    var art_state = "已发布"


    $("#btnSave2").on("click", function() {
        art_state = "草稿"
    })
    $("#foem-pub").on("submit", function(e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])
        fd.append("state", art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)
                publishArticle(fd)
            })
    })


    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("发表文章失败！")
                }
                layer.msg("发表文章成功！")
                location.href = "/article/art_list.html"
            }
        })
    }
})