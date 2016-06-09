﻿<!DOCTYPE html>
<html ln="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Kiosk 1080">
    <meta name="author" content="Vlad">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <title>Kiosk</title>
    <link href="libs/reset.css" rel="stylesheet" />
    <link href="libs/bootstrap.css" rel="stylesheet" />
    <link href="kiosk.css" rel="stylesheet" />
    <link href="libs/font-awesome.css" rel="stylesheet" type="text/css"/>
    <script src="libs/jquery-2.1.0.min.js"></script>
    <script src="libs/underscore-min.js"></script>
    <script src="libs/svgjs.js"></script>

    <!--<script src="js/kiosk/Kiosk.js"></script>-->
<!--<link href="css/kiosk1920.css" rel="stylesheet" />-->
<style>

    .hide{
        display: none;
    }

    body{

    }



</style>
</head>
<body>
<div id="Templates" class="hidden"> </div>
<div id="container">

    <section id="u-header" class="banner-color view-port">
        <style>
            #u-header>div{
                display: inline-block;
            }
            #brand-logo img{
                height: 30px;
            }

        </style>

    </section>
    <section id="mainview" >

    </section>
    <script src="https://code.createjs.com/createjs-2015.11.26.min.js"></script>

    <script src="ImagesLibrary.js"></script>
    <script src="ImagesRow.js"></script>
    <script src="Gallery4.js"></script>
    <script>
        $(document).ready(function(){
            console.log($(window ).width()+'x'+$(window ).height());
            var width  = $(window ).width();
            var height  = $(window ).height();

            var cols = 5;
            var rows = 7;
            if(width<500){
                rows=5;
                cols=4;
            }



            var options={
                canvasWidth:width,
                canvasHeight:height,
                getimages:'getimages.php',
                thumbSize:100,
                thumbDistance:120,
                rowHeight:120,
                rowWidth:width+50,
               // rows:5,
              //  cols:4,
                 rows:7,
                 cols:5,
                prviewPaddingX:10,
                prviewPaddingY:10,
                previwWidth:width-20,
                previwHeight:height -20
            }

            var gal = new hallmark.App($('#mainview'),options);
        })
    </script>
</div>
</body>
</html>
