const request=require('@eff-org/request')
module.exports=function(){
    return request({
        url:"/project/template"
    })
}