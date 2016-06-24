<?php
         foreach(scandir('.') as $file){
         echo($file);
          if(strpos($file,'.JPG')!==FALSE){
          echo(' it is '.$file);
         rename($file,substr($file,0,3).'.jpg');

         }
        }
  ?>