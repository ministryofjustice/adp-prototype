require('mojular');
var $ = require('jquery');

Mojular.Modules.Tabs = {
  el: '.tabs .tab',

  init: function() {
    this.cacheEls();
    this.bindEvents();

    this.toggleTab(this.$tabs.filter('.active'));
  },

  bindEvents: function() {
    var _this = this;
    $('.tabs .tab > a').on('click', function(e) {
      e.preventDefault();
      _this.toggleTab($(this).parent());
    });
  },

  toggleTab: function($tab) {
    $tab
      .siblings('.tab')
      .removeClass('active');
    $tab
      .addClass('active');

    this.$panels.hide();

    if($tab.length < 1) {
      return;
    }

    var activePanelId = $tab.find('a').attr('href').split('#')[1];
    $('#' + activePanelId).addClass('active').show();
  },

  cacheEls: function() {
    this.$tabs = $(this.el);
    this.$panels = $('.tab-panel');
  }
};
