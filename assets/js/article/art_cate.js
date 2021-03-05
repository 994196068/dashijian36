$(function() {


    var layer = layui.layer
        // var form = layui.form
    initArtCatelist()

    function initArtCatelist() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }
    var indexAdd = null
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })

    //通过代理的形式来给动态添加orm-add的元素添加点击事件
    $("body").on("submit", "#form-add", function(e) {
            e.preventDefault()
            $.ajax({
                method: "POST",
                url: "/my/article/addcates",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("新增分类失败!")
                    }
                    initArtCatelist()
                    layer.msg("新增分类成功！")

                    //根据索引关闭对应的弹出层
                    layer.close(indexAdd)
                }
            })
        })
        //通过代理的形式来给动态添加btn-edit的元素添加点击事件
    var indexEdit = null
    $("tbody").on("click", ".btn-edit", function() {
            //这是一个弹出层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '修改文章分类',
                content: $("#dialog-edit").html()
            });
            var id = $(this).attr("data-id")
            $.ajax({
                method: "GET",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    console.log(res);
                    // form.val("form-edit", res.data)
                    layui.form.val("form-edit", res.data)
                }
            })
        })
        //给动态生成的元素用事件委托的形式来绑定事件
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("修改分类失败！")

                }
                //提示信息 关闭弹出层 刷新数据
                layer.msg("修改分类成功！")
                layer.close(indexEdit)
                initArtCatelist()
            }
        })
    })
    $("tbody").on("click", ".btn-delete", function() {
        console.log("ok");
        var id = $(this).attr("data-id")
            //提示用户是否要删除
        console.log(id + "id");
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        console.log(res.status + "换取数据状态");
                        return layer.msg("删除分类失败！")
                    }
                    console.log(res.status);
                    layer.msg("删除分类成功！")
                    layer.close(index)
                    initArtCatelist()
                }
            })
        })
    })
})