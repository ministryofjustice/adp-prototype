var $ = require('jquery');
var now = require('lodash/date/now');

require('mojular');
require('mojular-moj-elements/assets/scripts/modules/skip-to-content');
require('./modules/file-upload');

Mojular.init();


$('.tabs').on('click', function(e) {
  var $target = $(e.target);

  if($target.is('a')) {
    $target.closest('.tabs').find('.tab').removeClass('active');
    $target.closest('.tab').addClass('active');
  }
});
