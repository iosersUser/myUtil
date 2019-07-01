/** 
一、一般的正则规定
^:匹配开头
$:匹配结尾
* ：可有可无，多了不限 ，等价于{0，}
+：至少一个，多了不限，等价于{1，}
？：可有可无，最多一次，等价于{0,1}


\：将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。例如， 'n' 匹配字符 'n'。'\n' 匹配换行符。序列 '\\' 匹配 "\"，而 '\(' 则匹配 "("。
{n}：匹配确定的n次
{n,}：至少匹配n次
{n,m}：至少匹配n次，最多匹配m次
.(点)：匹配除“\r\n”之外的任何单个字符
\b：单词边界
\B :匹配非单词边界
\d：匹配数字
\D：匹配非数字
\f：换页符
\n：换行
\r：回车
\t：制表符
\s : 空格，制表符，换行符等，等价于 [ \f\n\r\t\v]
\S : 匹配任何可见字符。等价于[^ \f\n\r\t\v]。
()：括号可以进行分组
\w：匹配包括下划线的任何单词字符
\W:匹配任何非单词字符。等价于“[^A-Za-z0-9_]”。

 */

/**
二、正则匹配
2.1 后缀名匹配
var str = fileName.replace(/.+\./,"")  
例如:
var fileName = '身份证.JPG'
str = fileName.replace(/.+\./,"") 
console.log(str,str.toLowerCase())   //JPG,jpg
2.2 文件名匹配
fileName.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1")
例如:
var fileName = '身份证.JPG'
str = fileName.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1")
console.log(str)   //身份证
2.3 匹配空格和换行符号  为<br>  &nbsp;


data.content = data.content.replace(/\r{0,}\n/g,"<br/>").replace(/\s/g,"&nbsp;")

 /([.\n\r]+)/g

*/
//数字的验证方式
ES.util.isNumber = function(str) {
   var reg = /^(-?\d+)(\.\d+)?$/;
   return reg.test(str)
}
//邮箱的验证
ES.util.isEmail = function (str) {
   var reg = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
   return reg.test(str)
}
//固定电话的验证
ES.util.isPhone = function (str) {
   var reg = /^(\d{3,4}-)?\d{6,8}(-\d{3})?$/;
   return reg.test(str)
}
//手机号码的验证
ES.util.isMobile = function (str) {
   var reg = /^\S*(13[0-9]|14[5-9]|15[0|1|2|3|5|6|7|8|9]|166|17[0-8]|18[0-9]|19[8|9])\d{8}$/;
   return reg.test(str)
}
//密码 最少6位最多20位
ES.util.isPassword = function (str) {
   var reg = /^[\s\S]{6,20}$/;
   return reg.test(str)
}
//邮编
ES.util.isZipcode = function (str) {
   var reg = /^[1-9][0-9]{5}$/;
   return reg.test(str)
}
//除了中文的验证
ES.util.exceptChinese = function (str) {
   var reg = /^[^\u4e00-\u9fa5]*$/;
   return reg.test(str);
}
//英文，数字的验证
ES.util.english = function (str) {
   var reg = /^([A-Za-z0-9 ,.']+\s?)*[A-Za-z0-9 ,.']/
   return reg.test(str);
}
//中文的验证
ES.util.chinese = function (str) {
   var reg = /[\u4e00-\u9fa5]/;
   return reg.test(str);
}
//自然数的验证
ES.util.isNatureNumber = function (str) {
   var reg = /^[0-9]*[1-9][0-9]*$/;
   return reg.test(str);
}
//浮点数字，保留三位小数
ES.util.isFloatNumThree = function (str) {
//  在js里面，如果小数点前面 没有任何的数字，那几默认是0  
// 相当于是   .123  解释为是  0.123
   var reg = /^[0-9]*.[0-9]{3}$/;     
   return reg.test(str);
}
//浮点数字，保留两位小数
ES.util.isFloatNumTwo = function (str) {
   var reg = /^[0-9]*.[0-9]{2}$/;
   return reg.test(str);
}
//身份证号的验证
ES.util.isIDCardNumber = function (str) {
   var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/
   return reg.test(str);
}
//版数字，第一个是汉字，以后全是字母数字5位   车牌号
ES.util.isPlateNumber = function (str) {
   var reg = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
   return reg.test(str);
}









































