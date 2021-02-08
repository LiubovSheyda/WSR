<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since Twenty Nineteen 1.0
 */

// запускает отдельные станицы

?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php

			echo "This file page.php";

		
			?>

		</main><!-- #main -->
	</div><!-- #primary -->


<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	

	<div class="entry-content">
		<?php
		the_title();
		
		the_content();
		
		?>
	</div><!-- .entry-content -->
	
</article><!-- #post-<?php the_ID(); ?> -->
