<?php 

/*
Plugin Name: Random Line
Description: Вывод случайной строки из поста на страницу
Version: 1.0
Author: Tatiana
*/

// Генерация случайной строки
function random_string() {
	global $wpdb;
	
	$table_name = $wpdb->prefix . "my_random_string";
	$result = $wpdb->get_results("SELECT post_text FROM $table_name");

	foreach ($result as $key => $v) {
		$post_text = $v->post_text;
	};

	$post_mass_string = explode(".", $post_text);
	$rand_key = array_rand($post_mass_string);
	$random_string = $post_mass_string[$rand_key];

	return $random_string;
}

// Вывод строки поста на страницу
function html_string_code() {
	$random_string = random_string();
	echo '<style type="text/css">
		#myDIV {
			--div-width: 100px;
			position: absolute;
			color: coral;
			transition: 0.5s transform;
			z-index: 5;
			font-size: 1em;
			display: none;
		}			
	</style>

	<div id="myDIV">'
		.$random_string.
	'</div>

	<script type="text/javascript">
		const height = document.documentElement.clientHeight;
		const width = document.documentElement.clientWidth; 
		const box = document.getElementById("myDIV");

        window.addEventListener("scroll", function() {
			let randY = Math.floor((Math.random() * height) + 1);
			let randX = Math.floor((Math.random() * width) + 1);
			box.style.display = "block";
			box.style.transform = `translate(${randX}px, ${randY}px)`;
			this.removeEventListener("scroll", arguments.callee);
		});
    </script>';
}

// Добавление текста поста в таблицу
// dbDelta в Zeal
function insert_in_db($post_text) {
	global $wpdb;
	$table_name = $wpdb->prefix . "my_random_string";

	if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
		$sql = "CREATE TABLE " . $table_name . " (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		post_text text NOT NULL,
		UNIQUE KEY id (id)		
		);";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}

	$wpdb->insert($table_name, array( 
		'post_text' => $post_text,		
	));
}

// Удаление записей из таблицы
function delete_in_db() {
	global $wpdb;

	$table_name = $wpdb->prefix . "my_random_string";
	$result = $wpdb->get_results("DELETE FROM $table_name");
}

// Вывод постов в Админку
function html_post() {
	global $wpdb;

	$table_name = $wpdb->posts;
	$result = $wpdb->get_results("SELECT * FROM $table_name WHERE post_type='post'");
	$i = 1;

	echo "
	<div class='wrap'>
		<h2>Список постов</h2>
		<table class='wp-list-table widefat striped'>
			<tr>
				<th><strong>№</strong></th>
				<th><strong>Заголовок</strong></th>
				<th><strong>Текст поста</strong></th>				
				<th></th>
			</tr>";

	foreach ($result as $key => $v) {
		echo '<tr><th>'
		.$i++.
		'</th><th>'
			.$v->post_title.
		'</th><th>'
			.substr(strip_tags($v->post_content), 0, 100).
		'...</th>
		<th>
		<form action="" method="post">
			<input type="hidden" name="form-post-title" value="'.$v->post_title.'">
			<input type="hidden" name="form-post-text" value="'.$v->post_content.'">
			<input type="submit" name="form-choice" value="Выбрать" class="button">
		</form>
		</th>
		</tr>';
	}
	echo "</table></div>";

	if(!$result) {
		echo "<h3><center>Пока постов нет<center></h3>";
	}
}

// Добавление текста поста в БД
function choice_post() {
	global $wpdb;

	if(isset($_POST['form-choice'])) {
		
		$table_name = $wpdb->prefix . "my_random_string";
		delete_in_db();

		$post_text = trim(strip_tags($_POST['form-post-text']));
		insert_in_db($post_text);

		echo '<div id="message" class="updated"><p>Выбран пост с Заголовком --> '.$_POST['form-post-title'].'</p></div>';
	}
}

// Функции для Страницы
function random_string_page() {	
	html_string_code();
}

// Функции для Админки
function add_my_setting_random_string() {
	html_post();
	choice_post();
}

// Создание пунка меню в Админку
add_action('admin_menu', function() {
	add_menu_page( 'Случайная строка', 'Строчки', 'manage_options', 'my-random-string-options', 'add_my_setting_random_string', 'dashicons-admin-post', 65); 
});

// Выполнение функции после тега body
add_action('wp_body_open', 'random_string_page');
?>
