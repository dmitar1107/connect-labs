<?php
	
	header("Cache-Control: max-age=28800");
	header("Content-Type: image/png");
  function imageCreateCorners($sourceImageFile, $radius, $w, $h) {
    # test source image
    
      $res =true;
      $src = $sourceImageFile;
   

    # create corners
    if ($res) {

      $q = 10; # change this if you want
      $radius *= $q;

      # find unique color
      do {
        $r = rand(0, 255);
        $g = rand(0, 255);
        $b = rand(0, 255);
        }
      while (imagecolorexact($src, $r, $g, $b) < 0);

      $nw = $w*$q;
      $nh = $h*$q;

      $img = imagecreatetruecolor($nw, $nh);
      $alphacolor = imagecolorallocatealpha($img, $r, $g, $b, 127);
      imagealphablending($img, false);
      imagesavealpha($img, true);
      imagefilledrectangle($img, 0, 0, $nw, $nh, $alphacolor);

      imagefill($img, 0, 0, $alphacolor);
      imagecopyresampled($img, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);

      imagearc($img, $radius-1, $radius-1, $radius*2, $radius*2, 180, 270, $alphacolor);
      imagefilltoborder($img, 0, 0, $alphacolor, $alphacolor);
      imagearc($img, $nw-$radius, $radius-1, $radius*2, $radius*2, 270, 0, $alphacolor);
      imagefilltoborder($img, $nw-1, 0, $alphacolor, $alphacolor);
      imagearc($img, $radius-1, $nh-$radius, $radius*2, $radius*2, 90, 180, $alphacolor);
      imagefilltoborder($img, 0, $nh-1, $alphacolor, $alphacolor);
      imagearc($img, $nw-$radius, $nh-$radius, $radius*2, $radius*2, 0, 90, $alphacolor);
      imagefilltoborder($img, $nw-1, $nh-1, $alphacolor, $alphacolor);
      imagealphablending($img, true);
      imagecolortransparent($img, $alphacolor);

      # resize image down
      $dest = imagecreatetruecolor($w, $h);
      imagealphablending($dest, false);
      imagesavealpha($dest, true);
      imagefilledrectangle($dest, 0, 0, $w, $h, $alphacolor);
      imagecopyresampled($dest, $img, 0, 0, 0, 0, $w, $h, $nw, $nh);

      # output image
      $res = $dest;
      imagedestroy($src);
      imagedestroy($img);
      }

    return $res;
    }
	$count = $_REQUEST["count"];
	$friend_id = $_REQUEST["friend_id"];
	$photo_url = $_REQUEST['photo_url'];
	// check for cached file
	
	//$cached_data = file_get_contents("../../img/markers/cache/" . $friend_id . "_" . $count . ".png");
	
	if ($cached_data) {
		
		echo $cached_data;
		
	} else {
	
		$fb_image = imageCreateCorners(@imagecreatefromstring(file_get_contents($photo_url . "?type=square")), 5, 43, 43);
		$label_image = @imagecreatefrompng("../../images/marker_dot.png");
		
		// bottom layer
			
		$marker_image = @imagecreatefrompng("../../images/marker_bg.png");
		
		$image_width = 60;
		$image_height = 71;
		
		$image = @imagecreatetruecolor($image_width, $image_height);
			
		$background_color = imagecolorallocatealpha($image, 255, 255, 255, 127);
		imagefill($image, 0, 0, $background_color);
		
		imagesavealpha($image, true);
		
		// combine layers
		
		imagecopy($image, $marker_image, 0, 0, 0, 0, $image_width, $image_height);
		//imagecopyresized($image, roundCorners($fb_image,8, $background_color, 50,50), 4, 14, 0, 0, 43, 43, 50, 50);
		imagecopyresized($image, $fb_image, 4, 14, 0, 0, 43, 43, 43, 43);
		
		if ($count > 1) {
			
			imagecopy($image, $label_image, 0, 0, 0, 0, $image_width, $image_height);
			
			// text layer
			
			$text_color = imagecolorallocate($image, 255, 255, 255);
			
			$text_length = strlen((string)$count);
			
			if ($text_length <= 1) {
				imagestring($image, 3, 44, 5,  $count, $text_color);
			} else if ($text_length == 2) {
				imagestring($image, 3, 48-(strlen((string)$count)*4), 5,  $count, $text_color);
			} else {
				imagestring($image, 2, 50-(strlen((string)$count)*4), 5,  $count, $text_color);
			}
			
		}
		
		// cache image
		
		//imagepng($image,"../../images/markers/cache/" . $friend_id . "_" . $count . ".png", 9);
		imagepng($image);
		
		// clean up
		
		imagedestroy($marker_image);
		imagedestroy($fb_image);
		imagedestroy($label_image);
		imagedestroy($image);
		
	}
	
?>