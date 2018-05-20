<?php
if (!isset($_POST['name']) or empty($_POST['name'])) {
    $error1 = "Имя?<br>";
} else $error1 = NULL;

if (!isset($_POST['email']) or empty($_POST['email'])) {
    $error2 = "Email?<br>";
} else $error2 = NULL;

if (!isset($_POST['subject']) or empty($_POST['subject'])) {
    $error3 = "Тема?<br>";
} else $error3 = NULL;

if (!isset($_POST['message']) or empty($_POST['message'])) {
    $error4 = "Сообщение?<br>";
} else $error4 = NULL;

if (empty($error1) and empty($error2) and empty($error3) and empty($error4)) {
    $subject = $_POST['subject'];
    $name    = $_POST['name'];
    $email   = $_POST['email'];
    $message = "Имя: {$name}, email: {$email}, сообщение: {$_POST['message']}";
    if (mail("MyCourse@yandex.ru", $subject, $message)) {
        echo "Отправлено!";
    } else echo "Ошибка!";
} else {
    echo $error1.$error2.$error3.$error4;
}
?>