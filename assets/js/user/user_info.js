$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须字 1 ~ 6 个字符之间 ！"
            }
        }

    })
    initUserInfo()
        //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！")
                }
                console.log(res);
                //调用form.val 快速为表单负值
                form.val("formUrseInfo", res.data)
            }
        })
    }

    //重置表单数据
    $("#btnReset").on("click", function(e) {
        //阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })
    $(".layui-form").on("submit", function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()
            //发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！")
                }
                return layer.msg("更新用户信息成功！")

                //调用父页面中的方法 重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})