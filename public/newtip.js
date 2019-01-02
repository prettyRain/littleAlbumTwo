/**
 * Created by prettyRain on 2018/9/18.
 */

function alerttip(){
    var timer ;
    return function(content){
        window.clearTimeout(timer);
        timer = window.setTimeout(function(){
          $('body').append("<div class='tip'>"+content+"</div>");
          window.setTimeout(function(){
              $('.tip').remove();
          },1500)
        },1000)
    }
}