$(function() {
    var form = layui.form
    var layer = layui.layer

    var laypage = layui.laypage
        //定义一个请求数据参数对象将来数据的时候，

    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)


        var y = dt.getFullYear()

        var m = padZero(dt.getMonth() + 1)

        var d = padZero(dt.getDate())



        var hh = padZero(dt.getHours())

        var mm = padZero(dt.getMinutes())

        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + "-" + hh + ":" + mm + ":" + ss
    }

    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    //需要将参数对象发送到服务器
    var q = {
        pagenum: 1, //页码值，默认第一页
        pagesize: 2, //每页显示多少几条数据，默认显示两条数据
        cate_id: "", //文章分类的 Id
        state: "", //文章的发布状态
    }

    initTable()
    initCate()
        //定义获取文章数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章信息失败！")
                }
                // layer.msg("获取文章成功！")
                //  使用模板引擎渲染数据
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
                    //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取列表失败！")
                }

                //调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res)

                $("[name=cate_id]").html(htmlStr)

                form.render()
            }
        })
    }
    $("#form-search").on("submit", function(e) {
            e.pervavntDefault()


            var cate_id = $("[name=cate_id]").val()
            var state = $("[name=state]").val()

            q.cate_id = cate_id
            q.state = state

            initTable()
        })
        //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: "pageBox", //分页容器
            count: total, //总数据条数
            limit: q.pagesize, //每天显示几条数据
            curr: q.pagenum, //默认页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候 触发jump回调
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                if (!first) {
                    initTable()
                }
            }
        })


    }

    //删除数据函数
    $("tbody").on("click", ".btn-delete", function() {
        //获取到当前页面上文章删除按钮的个数
        var len = $(".btn-delete").length
            //获取到文章ID
        var id = $(this).attr("data-id")
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg("删除文章失败！")

                    layer.msg("删除文章成功！")

                    if (len === 1) q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    initTable()
                }
            })
            layer.close(index);
        });
    })
})