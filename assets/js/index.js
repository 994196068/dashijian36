$(function() {

    //调用 getUserInfo 函数获取用户信息
    getUserInfo()
        //点击按钮退出功能函数
    var layer = layui.layer

    $("#btnlogout").on("click", function() {
        //退出提示框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清空token里存储的数据
            localStorage.removeItem("token")
                //重新跳转到登录页面
            location.href = "/login.html"
                // layui自带关闭询问框
            layer.close(index);

        });
    })
})

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            //调用 renderAvatar 函数 渲染用户头像
            renderAvatar(res.data)
        },
        //不管成功还是失败最终都会调用 complete 函数
        // complete: function(res) {
        //     // console.log(res);
        //     //在 complete回调函数中， 可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //强制清空token里存储的数据
        //         localStorage.removeItem("token")
        //             //强制重新跳转到登录页面
        //         location.href = "/login.html"
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username

    //设置欢迎的文本

    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)

    if (user.user_pic !== null) {
        //渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        //渲染文本头像
        $(".layui-nav-img").hide()
        var first = name[0].toUpperCase()
        $(".text-avatar").html(first).show()
    }
}