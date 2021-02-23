<?php
$image=imagecreate(256,256);
imagecolorallocate($image,192,192,192);

$font = "arial.ttf";

$bg_color=imagecolorallocate($image,184,184,184);
$bg_color1=imagecolorallocate($image,160,160,160);
$text_color=imagecolorallocate($image,0,0,0);
$xy_color=imagecolorallocate($image,128,0,0);
$s_color=imagecolorallocate($image,0,0,256);


imagepolygon($image, array(65,1,192,1,192,254,65,254), 4, $bg_color1);
imagepolygon($image, array(1,65,1,192,254,192,254,65), 4, $bg_color1);
imagepolygon($image, array(1,127,1,128,254,128,254,127), 4, $bg_color1);
imagepolygon($image, array(127,1,128,1,128,254,127,254), 4, $bg_color1);



imagepolygon($image, array(1,1,1,254,254,254,254,1), 4, $text_color);
putenv('GDFONTPATH=' . realpath('.'));

if ( isset($_GET["i"]) )
	imagefttext($image, 150, 0, ( $_GET["i"] < 10 ? 74 : 20 ) , 200, $bg_color, $font,  $_GET["i"] );




imagefttext($image, 12, 0, 30, 50, $text_color, $font, "This is map fragment:" );
imagefttext($image, 20, 0, 60, 100, $xy_color, $font, 'x: '.$_GET["x"].'m' );
imagefttext($image, 20, 0, 60, 140, $xy_color, $font, 'y: '.$_GET["y"].'m' );
imagefttext($image, 16, 0, 60, 240, $s_color, $font, 'scale: '.$_GET["s"].'m / px' );

header('Content-Type: image/png;');
imagepng($image);
?>