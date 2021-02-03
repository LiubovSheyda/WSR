<?php 
/**
 * Functions and definitions
 *
 * @package WordPress
 * @subpackage Wordsmith
 * @since Wordsmith 1.0
 */


/*add_action('wp_print_styles', 'theme_name_scripts');
add_action( 'wp_enqueue_scripts', 'theme_name_scripts' );

function theme_name_scripts() {
	wp_enqueue_style( 'base', get_template_directory_uri() . '/css/base.css', array(),'1.1','all' );
	wp_enqueue_style( 'vendor', get_template_directory_uri() . '/css/vendor.css', array(),'1.1','all' );
	wp_enqueue_style( 'style', get_template_directory_uri() . '/style.css', array('base', 'vendor'),'1.1','all' );

	wp_enqueue_script( 'script-name', get_template_directory_uri() . '/js/example.js', array(), '1.0.0', true );
}*/

	// Чтобы Меню отображалось в Консоли - Внешний вид и можно было его редактировать
	add_theme_support( 'menus' );

?>