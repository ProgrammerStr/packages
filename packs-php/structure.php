<?php 

  mkdir('Front');
  mkdir('Front/sass');
  mkdir('Front/js');
  mkdir('Front/css');
  mkdir('Back');
  mkdir('Back/sql');
  mkdir('Back/php');
  $index = fopen('Front/index.html', 'w');

  echo "Structure Create";