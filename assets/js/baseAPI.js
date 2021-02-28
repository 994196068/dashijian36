//注意：每次调用 $.get() $.post() $.ajax() 的时候
//会先调用 ajaxPrefilter() 这个函数
//在这个函数中 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //在真正发送ajax请求前 统一拼接请求的根路径
    options.url = "http://ajax.frontend.itheima.net" + options.url
    console.log(options.url);
})