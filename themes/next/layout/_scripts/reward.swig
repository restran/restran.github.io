<script type="text/javascript">
  $(".reward-wrapper .reward-btn").fancybox({
      maxWidth: 650,
      maxHeight: 350,
      fitToView: true,
      autoSize: true,
      closeClick: false,
      openEffect: 'none',
      closeEffect: 'none',
      helpers: {
        title: {
            type: 'inside'
        },
        overlay: {
            locked: false
        }
      }
  });

  $("[data-track]").on("click", function() {
      var label = $(this).data("track");
      window._hmt && window._hmt.push(['_trackEvent', label, 'click']);
  });
</script>