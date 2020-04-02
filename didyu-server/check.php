<?php
$servername = "localhost";
$username = "root";
$password = "didyuroot";
$dbname = "didyu_v2";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$to_email = 'nireshkumar27@gmail.com';
$subject = 'Testing PHP Mail';
$message = 'This mail is sent using the PHP mail function';
$headers = 'From: noreply@didyu.com.au';
$res = mail($to_email,$subject,$message,$headers);
echo '<pre>';
var_dump($res);
exit;
?>
