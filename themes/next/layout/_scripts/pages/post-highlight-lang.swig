
<script type="text/javascript">
    (function() {
        var items = $('figure.highlight');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var node = $(item);
            var className = node.attr('class');
            var classList = className.split(' ');
            var langName = '';
            if (classList.length > 1) {
                langName = classList[1];
            }
            node.attr('data-lang', langName);
        };
    })();
</script>
