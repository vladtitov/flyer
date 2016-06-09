<?php
header('Access-Control-Allow-Origin: *');
$folders=array('ChristmasCards'=>'Christmas Crads','NFLTeam'=>'NFL Team');
$ar = array();
foreach($folders as $folder=>$name) $ar = array_merge($ar,getFiles($folder,$name));
$out = new stdClass();
$out->images = $ar;
header('Content-Type: application/json');
echo json_encode($ar);

function getFiles($folder,$name){
    $ar=array();
    foreach(scandir('images/'.$folder) as $file) if(strpos($file,'.jpg')!==FALSE){

        $img= new stdClass();
        $img->price = rand(1,20).'.99';
        $img->sale = ($img->price<5);
        $cat1= rand(1,10);
        $cat2=rand(1,10);
        $img->cats = ($cat1===$cat2)?$cat1.'':$cat1.','.$cat2;
        $img->name=$name;
        $img->thumb='images/'.$folder.'/'.$file;
        $img->large='images/'.$folder.'/OriginalFiles/'.$file;

    $ar[]=$img;
    }
    return $ar;
}