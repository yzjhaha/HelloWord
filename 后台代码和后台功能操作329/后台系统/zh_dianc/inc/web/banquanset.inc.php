<?php
global $_GPC, $_W;
$GLOBALS['frames'] = $this->getMainMenu();
 $item=pdo_get('wpdc_system',array('uniacid'=>$_W['uniacid']));
//  $item=pdo_get('wpdc_system',array('uniacid'=>$_W['uniacid']));
// // print_r($item);die;
    if(checksubmit('submit')){
    		$data['link_name']=$_GPC['link_name'];
    		$data['link_logo']=$_GPC['link_logo'];
    		$data['bq_logo']=$_GPC['bq_logo'];
    		$data['bq_name']=$_GPC['bq_name'];
    		$data['tz_name']=$_GPC['tz_name'];
    		$data['tz_appid']=trim($_GPC['tz_appid']);
    		$data['support']=$_GPC['support'];
            $data['uniacid']=$_W['uniacid'];
            if($_GPC['id']==''){                
                $res=pdo_insert('wpdc_system',$data);
                if($res){
                    message('添加成功',$this->createWebUrl('banquanset',array()),'success');
                }else{
                    message('添加失败','','error');
                }
            }else{
                $res = pdo_update('wpdc_system', $data, array('id' => $_GPC['id']));
                if($res){
                    message('编辑成功',$this->createWebUrl('banquanset',array()),'success');
                }else{
                    message('编辑失败','','error');
                }
            }
        }
include $this->template('web/banquanset');