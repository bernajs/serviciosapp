<?php
if (isset($_FILES['myFile'])) {
    $filename = md5(date("Y-m-d H:i:s")).".jpg";
    move_uploaded_file($_FILES['myFile']['tmp_name'],"../tmp/".$filename);
    echo $filename;
}
?>