require('mojular');
var $ = require('jquery');

Mojular.Modules.Tabs = {
  el: '.tabs .tab',

  init: function() {
    this.cacheEls();
    this.bindEvents();

    var $panels = this.$tabs
      .filter(function() {
        return !$(this).is('.active')
      })
      .find('a')
      .map(function() { return this.href.split('#')[1] })
      .map(function(i, id) {
        return $('#' + id);
      });

    $panels.each(function() {
      $(this).hide();
    });
  },

  toggleTab: function($tab) {
    $tab
      .siblings('.tab')
      .removeClass('active');
    $tab
      .addClass('active');

    var activePanelId = $tab.find('a').attr('href').split('#')[1];

    this.$panels.hide();
    $('#' + activePanelId).show();
  },

  bindEvents: function() {
    var _this = this;
    $('.tabs').on('click', function(e) {
      e.preventDefault();
      var $tab = $(e.target).parent();

      if($tab.is('.tab')) {
        _this.toggleTab($tab);
      }
    });
  },

  cacheEls: function() {
    this.$tabs = $(this.el);
    this.$panels = $('.tab-panel');
  }
}
