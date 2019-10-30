cmp.ready(function() {
    context();
});


function  context(){
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj2 = new Object();
    obj2.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj2.data = {
        'type':'post',
        'message_id' : 'gtpt',
        'branch' : 'shoukuan',
        'loginname' : loginname,
        //'password' : password
    };
    obj2.successFun = 'selectShoukuanSucess';
    ajaxJson_v1(obj2);
}

function selectShoukuanSucess(data){
            
            var xinxi = data.zhanghao.DATA;
          
             var json =data.zhuanzhang.DATA 
             json =JSON.parse(json)

            console.log(json)
            
            var  areacity = xinxi.areacity ==undefined ? "" :  xinxi.areacity;
            var  accountname = xinxi.accountname ==undefined ? "" :  xinxi.accountname;
            var  accountcode = xinxi.accountcode ==undefined ? "" :  xinxi.accountcode;
            var  accountbank = xinxi.accountbank ==undefined ? "" :  xinxi.accountbank;
            
            var html = '';
            html += '<div class="basecontent1">';
            html += '<div class="ub baseline">';
            html += '一、收款账户信息';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti" >';
            html += '所属城市&nbsp;：';
            html += '</div>';
            html += '<div class="ziti" id="areacity">'+areacity;
            html += '</div>';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti">';
            html += '账号名称&nbsp;：';
            html += accountname;
            html += '</br><span style="margin-top:0.1em">银行账号&nbsp;：'+accountcode+'</span>';
            html += '</br><span >开户银行&nbsp;：';
            html += accountbank+'</span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti">';
            html += '注：转款时的账户名称请务必';
            html += '<span style="color:red">写全称</span>，含“（有限合伙）”字眼。</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            
             html += '<div class= "jiange"></div>';
            html += '<div class="basecontent1">';
            html += '<div class="ub baseline">';
            html += '二、转账要求';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti">';
            html += '1、为保障代持协议、返本及收益获取的账号一致性，需<span style="color:red">使用个人固定跟投账户进行转账</span>（可于“跟投详情—个人信息查询”处查看）';
            html += '</div>';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti">';
            html += '2、为便于跟投人进行批量实缴项目的转账操作，请跟投人按本批项目的合计实缴金额<span style="color:red">一次性转账</span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti">';
            html += '3、银行转账确认单请截图发送至邮箱进行报备：集团——跟投管理部部门邮箱(雅居乐地产集团-运营中心-跟投管理部) gtxz@agile.com.cn；区域——根据区域要求进行报备';
            html += '</div>';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti">';
            html += '4、个人实缴到账信息通常1个工作日后于跟投系统内进行体现，员工可进行查看';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            
            var confirmamount=0;
            var confirmamounts=0;
            var applyMount = 0;
            var applyMounts = 0;
            var mounts = 0;
            var add4yue = false;
            var first=0;
            var payBatch=0;
            var fact_amounts = 0;
            var m=0;
            var yue=0;
            var tishi ="";
            var startd=0;
            var endd=0;
            var shijian = false;
            var jiezhi=true;
            var applyMount2=0;
            var confirmamount2=0;
            var fact_amounts2=0;
            var applyMounts2 = 0;
            var confirmamounts2 = 0;
            var mounts2 = 0;
            var applyMount3=0;
            var confirmamount3=0;
            var fact_amounts3=0;
            
             html += '<div class = "jiange"></div>';
            html += '<div class="basecontent1">';
            html += '<div class="baseline">';
            html += '三、本次转账信息';
            html += '</div>';
            html += '<div class="t_black">';
            html += '<div class="ziti" id = "shuoming">1、实缴时间：<span style="color:red">6月25-27日<span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="ub t_black">';
            html += '<div class="ziti" id = "">2、实缴金额及明细：';
            html += '</div>';
            html += '</div>';
            html += '<div class="bziti" width="96%" style="margin-left:2%;overflow:auto;margin-right:2%" >';
            html += '<table width="100%"  cellspacing="0"  id="projectTable">';  
            html += '<tr bgcolor="#00AEE1">';  
            html += '<td width="18%"  style = " border-right: 1px solid #FFFFFF; color:#FFFFFF">所属区域</td>'; 
            html += '<td width="25%"  style = " border-right: 1px solid #FFFFFF;  color:#FFFFFF">项目名称</td>'; 
            html += '<td width="18%"  style = " border-right: 1px solid #FFFFFF;  color:#FFFFFF">认购金额</td>'; 
            html += '<td width="18%"  style = " border-right: 1px solid #FFFFFF; color:#FFFFFF">确认金额</td>'; 
            html += '<td width="18%"  style = " border-right: 1px solid #FFFFFF; color:#FFFFFF">待实缴金额</td>'; 
            html += '</tr>';
            for(var i=0;i<json.length;i++){
                 var apply_amount =json[i].apply_amount==undefined ?'0':json[i].apply_amount 
                 payBatch = json[i].payBatch;
                 
                 if(payBatch!=undefined){
                    m = payBatch.substring(4,6);
                   if(m<10){
                       m=m.substring(1,2);
                    } 
                    var intmantime =json[i].intmantime; 
              
                      if(intmantime!=undefined){
                            //console.log(payBatch)
                            //console.log(intmantime);
                            //console.log()
                           endd= intmantime.substring(8,10); 
                           startd=endd-2;
                           if(startd.toString().length == 1){
                               startd = "0"+startd;
                           }  
                       }
              
                   if( apply_amount!=0&&first==0){
                       first=payBatch;
                   }  
                  }
                  
                  if(first!=0&&payBatch>first&&add4yue==false){
                      yue = m-1;
                      intmantime =json[i-1].intmantime; 
              
                      if(intmantime!=undefined){
                           endd= intmantime.substring(8,10); 
                           startd=endd-2;
                           if(startd.toString().length == 1){
                               startd = "0"+startd;
                           }  
                       }
                      if(shijian==true){
                            tishi += '1、实缴时间：<span style="color:red">6月25-27日</span>';
                      }else{
                            tishi += '1、实缴时间：<span style="color:red">6月25-27日</span>';
  
                      }
                      if(applyMount != "0" && applyMount2 != "0"){
                          html +="<tr>"
                           html +="<td colspan='2' style='font-weight:bold ;   border-bottom: 1px solid #E8E8E8'>"+"8月实缴合计（万）</td>" 
                           html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+applyMount+"</td>" 
                           html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+confirmamount+"</td>" 
                           html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+fact_amounts+"</td>" 
                           html +="</tr>"
                      }
                                           
                     //applyMount=0;
                     //confirmamount=0
                     //fact_amounts=0;
                     add4yue =true
                      var intmantime =json[i].intmantime; 
                      if(intmantime!=undefined){
                           endd= intmantime.substring(8,10); 
                           startd=endd-2;
                           if(startd.toString().length == 1){
                               startd = "0"+startd;
                           }  
                       }
                   }
                   if(m == "10" && apply_amount != "0"){
                        html +="<tr>"
                           var projectCompany =json[i].projectCompany==undefined ?'-':json[i].projectCompany 
                           
                           projectCompany = projectCompany.substring(0,projectCompany.length-2);
                           
                           
                         html +="<td  style='  border-bottom: 1px solid #E8E8E8'>"+projectCompany +"</td>"
                          var p_name =json[i].p_name==undefined ?'-':json[i].p_name
                         html +="<td style='  border-bottom: 1px solid #E8E8E8'>"+p_name+"</td>"
                         var apply_amount =json[i].apply_amount==undefined ?'0':json[i].apply_amount 
                         html +="<td style='  border-bottom: 1px solid #E8E8E8'>"+apply_amount+"</td>"
                              
                      
                         var confirm_amount =json[i].confirm_amount==undefined ?'0':json[i].confirm_amount 
                         html +="<td style='  border-bottom: 1px solid #E8E8E8'>"+confirm_amount+"</td>"
                         var fact_amount =0;
                         if(confirm_amount!=0){
                              fact_amount =json[i].fact_amount==undefined ?'0':json[i].fact_amount
                          shijian =true;
                         }
                         html +=" <td style='  border-bottom: 1px solid #E8E8E8'>"+fact_amount+"</td>" 
                         html +="</tr style='  border-bottom: 1px solid #E8E8E8'>"
                        
                       applyMount +=    Number(apply_amount);
                       applyMounts +=  Number(apply_amount);
                       
                       confirmamount += Number(confirm_amount)
                       confirmamounts += Number(confirm_amount)
                         
                       fact_amounts += Number(fact_amount);
                       mounts += Number(fact_amount);
                   }
            }
            
                 
            for(var i=0;i<json.length;i++){
                 var apply_amount =json[i].apply_amount==undefined ?'0':json[i].apply_amount 
                 payBatch = json[i].payBatch;
                 
                 if(payBatch!=undefined){
                    m = payBatch.substring(4,6);
                   if(m<10){
                       m=m.substring(1,2);
                    } 
                    var intmantime =json[i].intmantime; 
              
                      if(intmantime!=undefined){
                            //console.log(payBatch)
                            //console.log(intmantime);
                            //console.log()
                           endd= intmantime.substring(8,10); 
                           startd=endd-2;
                           if(startd.toString().length == 1){
                               startd = "0"+startd;
                           }  
                       }
              
                   if( apply_amount!=0&&first==0){
                       first=payBatch;
                   }  
                  }
                  
                  if(first!=0&&payBatch>first&&add4yue==false){
                      yue = m-1;
                      intmantime =json[i-1].intmantime; 
              
                      if(intmantime!=undefined){
                           endd= intmantime.substring(8,10); 
                           startd=endd-2;
                           if(startd.toString().length == 1){
                               startd = "0"+startd;
                           }  
                       }
                      if(shijian==true){
                            tishi += '1、实缴时间：<span style="color:red">6月25-27日</span>';
                      }else{
                            tishi += '1、实缴时间：<span style="color:red">6月25-27日</span>';
  
                      }
                     
                     applyMount2=0;
                     confirmamount2=0
                     fact_amounts2=0;
                     add4yue =true
                      var intmantime =json[i].intmantime; 
                      if(intmantime!=undefined){
                           endd= intmantime.substring(8,10); 
                           startd=endd-2;
                           if(startd.toString().length == 1){
                               startd = "0"+startd;
                           }  
                       }
                   }
                   if(m == "11" && apply_amount != "0"){
                        html +="<tr>"
                           var projectCompany =json[i].projectCompany==undefined ?'-':json[i].projectCompany 
                           
                           projectCompany = projectCompany.substring(0,projectCompany.length-2);
                           
                           
                         html +="<td  style='  border-bottom: 1px solid #E8E8E8'>"+projectCompany +"</td>"
                          var p_name =json[i].p_name==undefined ?'-':json[i].p_name
                         html +="<td style='  border-bottom: 1px solid #E8E8E8'>"+p_name+"</td>"
                         var apply_amount =json[i].apply_amount==undefined ?'0':json[i].apply_amount 
                         html +="<td style='  border-bottom: 1px solid #E8E8E8'>"+apply_amount+"</td>"
                              
                      
                         var confirm_amount =json[i].confirm_amount==undefined ?'0':json[i].confirm_amount 
                         html +="<td style='  border-bottom: 1px solid #E8E8E8'>"+confirm_amount+"</td>"
                         var fact_amount =0;
                         if(confirm_amount!=0){
                              fact_amount =json[i].fact_amount==undefined ?'0':json[i].fact_amount
                          shijian =true;
                         }
                         html +=" <td style='  border-bottom: 1px solid #E8E8E8'>"+fact_amount+"</td>" 
                         html +="</tr style='  border-bottom: 1px solid #E8E8E8'>"
                        
                       applyMount2 +=    Number(apply_amount);
                       applyMounts2 +=  Number(apply_amount);
                       
                       confirmamount2 += Number(confirm_amount)
                       confirmamounts2 += Number(confirm_amount)
                         
                       fact_amounts2 += Number(fact_amount);
                       mounts2 += Number(fact_amount);
                   }
            }
            if(applyMount != "0" && applyMount2 != "0"){
                html +="<tr>"
                 html +="<td colspan='2' style='font-weight:bold ;   border-bottom: 1px solid #E8E8E8'>"+"9月实缴合计（万）</td>" 
                 html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+applyMount2+"</td>" 
                 html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+confirmamount2+"</td>" 
                 html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+fact_amounts2+"</td>" 
                 html +="</tr>"
            }   
            applyMount3 = applyMount + applyMount2
            confirmamount3 = confirmamount + confirmamount2
            fact_amounts3 = fact_amounts + fact_amounts2
            html +="<tr>"
                     html +="<td colspan='2' style='font-weight:bold ;   border-bottom: 1px solid #E8E8E8'>"+"总实缴合计（万）</td>" 
                     html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+applyMount3+"</td>" 
                     html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+confirmamount3+"</td>" 
                     html +=" <td style='color:red;  border-bottom: 1px solid #E8E8E8'>"+fact_amounts3+"</td>" 
                     html +="</tr>"
            if(shijian==true){
                if(payBatch>first){
                    tishi+="，<span style='color: red'>6月25-27日</span>"
                }else{
                    yue= m;
                     tishi += '1、实缴时间：<span style="color:red">6月25-27日</span>';
                 }
            }else{
                if(payBatch>first){
                    tishi+="1、实缴时间：<span style='color: red'>6月25-27日</span>"
                }else{
                    yue= m;
                     tishi += '1、实缴时间：<span style="color:red">6月25-27日</span>';
                 }
            }
            html += '</table>';  
            html += '</div>';
            html += '</div>'; 
           
            $("#gt_userinfo_content #boxcontent").html(html);
            
        }