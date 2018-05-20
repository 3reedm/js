<?php
if (!isset($_POST['name']) or empty($_POST['name'])) {
    $error1 = "Имя?<br>";
} else $error1 = NULL;

if (!isset($_POST['email']) or empty($_POST['email'])) {
    $error2 = "Email?<br>";
} else $error2 = NULL;

if (!isset($_POST['number']) or empty($_POST['number'])) {
    $error3 = "Номер?<br>";
} else $error3 = NULL;

if (!isset($_POST['address'])) {
    $error4 = "Адрес?<br>";
} else $error4 = NULL;

if (empty($error1) and empty($error2) and empty($error3) and empty($error4)) {
    $number = $_POST['number'];
    $name    = $_POST['name'];
    $email   = $_POST['email'];
    $address  = $_POST['address'];
    $subject = 'Покупка';
    $message = "Имя: {$name}, email: {$email}, Номер телефона: {$number}, Товары: {$_POST['message']}, Адрес: {$address}";
    if (mail("MyCourse@yandex.ru", $subject, $message)) {
        echo "Заказ оформлен, ждите звонка оператора!";
    } else echo "Ошибка!";
} else {
    echo $error1.$error2.$error3.$error4;
}
?>