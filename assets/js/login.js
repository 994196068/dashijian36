$(function() {

    //去注册点击事件

    $("#zhuce").on("click", function() {
        $(".form-boxa").hide()
        $(".form-boxb").show()
    })
    $("#denglu").on("click", function() {
        $(".form-boxa").show()
        $(".form-boxb").hide()
    })

    //从layui 中获取 furm对象
    var form = layui.form
        //从layui 中获取layer提示信息对象
    var layer = layui.layer

    // 通过fomr.verify() 函数自定有校验规则
    form.verify({
        //自定有了一个叫pwd的校验规则   
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        //校验两次密码是否一致的规则
        repwd: function(value) {
            //通过形参拿到确认密码框中的内容
            //还需要拿到密码框中的内容
            //然后进行一次等于判断
            //如果不相等 则return 一个提示消息
            var pwds = $(".form-boxb [name=password]").val()
            if (pwds !== value) {
                return "两次密码不一样！"
            }
        }
    })

    //监听注册表单的提交事件 
    $("#form_txt").on("submit", function(e) {

        //阻止表单的默认行为 
        e.preventDefault()
        var data = {
            username: $("#form_txt [name=username]").val(),
            password: $("#form_txt [name=password]").val()

        }
        $.post("/api/reguser", data,
            function(res) {
                if (res.status !== 0) {
                    //注册失败的提示信息
                    return layer.msg(res.message);
                }
                //注册成功的提示信息
                layer.msg("注册成功，请登录！")
                    //模拟点击事件实现跳转到登陆页面
                $("#denglu").click()
            })
    })

    //监听登录表单的提交事件
    $("#form_tet").submit(function(e) {
        //阻止表单的默认行为 
        e.preventDefault()
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！")
                }
                layer.msg("登录成功")
                    //将登陆成功得到的 token 字符串 保存到localStorage中
                localStorage.setItem("token", res.token)
                    // console.log(res.token);
                    //强行跳转到首页
                location.href = "/index.html"
            }
        })
    })
})