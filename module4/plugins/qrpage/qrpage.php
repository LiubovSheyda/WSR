<?php 

/*
Plugin Name: QRPage
Description:  Шорткод  ​[qrpage]. Вывод изображения с QR-кодом, который содержит ссылку на текущую страницу
Version: 1.0
Author: Tatiana
*/

// Подключение  библиотеки QRCode
function my_scripts_file() {
	$script_url = plugins_url( '/js/qrcode.js', __FILE__ );
	wp_enqueue_script('custom-script', $script_url, array('jquery'));
}

// Объявление стилей
function style_declaration() {
	echo '<style type="text/css">
		#qrcode {
			width:100px; 
			height:100px; 
			margin-top:15px;
		}			
	</style>';
}

// Вывод qr-кода на страницу
function html_qrpage() {
	$url_current_page = get_permalink();

	echo '<div id="qrcode"></div>

	<script type="text/javascript">
		var qrcode = new QRCode(document.getElementById("qrcode"), {
			width : 100,
			height : 100
		});
		
		qrcode.makeCode("'.$url_current_page.'");	
    </script>';
}

// Функции для генерации qr-кода
function qrpage_shortcode() {
	ob_start();

	style_declaration();	
	html_qrpage();
	
	return ob_get_clean();
}

// Функция для подключения файла
add_action( 'wp_enqueue_scripts', 'my_scripts_file' );

// Вызов функции по шорткоду
add_shortcode('qrpage', 'qrpage_shortcode');
?>
