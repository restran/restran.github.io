<!doctype html>
<html class="theme-next {% if theme.use_motion %}use-motion{% endif %} {% if theme.scheme %}theme-next-{{ theme.scheme | lower }}{% endif %}">
<head>
  {% include '_partials/head.swig' %}
  {% include '_scripts/analytics.swig' %}
  <title>{% block title %}{% endblock %}</title>
</head>

<body itemscope itemtype="http://schema.org/WebPage" lang="{{ config.language }}">
  {% include '_partials/old-browsers.swig' %}

  {% if page.type === 'snippets' %}
    {% set with_snippets = 'with-snippets' %}
  {% else %}
    {% set with_snippets = '' %}
  {% endif %}

  <div class="container one-column {% block page_class %}{% endblock %}">
    <header id="header" class="header" itemscope itemtype="http://schema.org/WPHeader">
      <div class="header-inner {{ with_snippets }}"> {%- include '_partials/header.swig' %} </div>
    </header>

    <main id="main" class="main">
      {% block snippets-sidebar %}{% endblock %}

      <div class="main-inner">

        <div id="content" class="content {{ with_snippets }}">
          {% block content %}{% endblock %} 
        </div>

        {% if page.type != 'snippets' %}
          {% if page.comments %}
            <div class="comments" id="comments">
              {% if theme.disqus_shortname %}
                <div id="disqus_thread">
                  <noscript>Please enable JavaScript to view the <a href="//disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
                </div>
              {% endif %}
            </div>
          {% endif %}
        {% endif %}
      </div>
      {% if page.type != 'snippets' %}
        {% block sidebar %}{% endblock %}
      {% endif %}
    </main>

    {% include '_scripts/google-adsense.swig' %}
    
    {% if page.type != 'snippets' %}
        <footer id="footer" class="footer">
          <div class="footer-inner"> {% include '_partials/footer.swig' %} </div>
        </footer>
    {% endif %}
    <div class="back-to-top"></div>
  </div>

  <script type="text/javascript" src="{{ url_for(theme.vendors) }}/jquery/index.js?v=2.1.3"></script>

  {# LazyLoad #}
  <script type="text/javascript" src="{{ url_for(theme.js) }}/lazyload.js"></script>
  <script type="text/javascript">
    $(function () {
      $("#posts").find('img').lazyload({
        placeholder: "{{ url_for(theme.images) }}/loading.gif",
        effect: "fadeIn",
        load: function (element_left) {
          // 图片加载后，修改 img 的父节点 a 的 href
          // 确保 fancybox 上面的图片显示正确
          var node = $(this);
          node.parent().attr('href', node.attr('data-original'));
        }
      });
    });
  </script>
  

  {# Use echo to lazyload, works at IE8+
  <script type="text/javascript" src="{{ url_for(theme.vendors) }}echo/echo.min.js"></script>
  <script type="text/javascript">
    echo.init({
    offset: 100,
    throttle: 250,
    unload: false,
    callback: function (element, op) {
      console.log(element, 'has been', op + 'ed')
    }
  });
  </script>
  #}

  {% block script_pre_extra %}{% endblock %}

  {# This block is used to set options before any other scripts run #}
  {% block script_extra_before %}{% endblock %}
  {% block comment_system %}
    {% include '_scripts/comments/disqus.swig' %}
  {% endblock %}
  {% include '_scripts/fancy-box.swig' %}
  {% include '_scripts/helpers.swig' %}
  {% include '_scripts/motion.swig' %}
  {% if theme.leancloud_visitors.enable %}
    {% include '_scripts/lean-analytics.swig' %}
  {% endif %}

  <script type="text/javascript" src="{{ url_for(theme.js) }}/nav-toggle.js?v={{ theme.version }}"></script>
  <script type="text/javascript" src="{{ url_for(theme.vendors) }}/fastclick/lib/fastclick.min.js?v=1.0.6"></script>

  {% block script_extra %}{% endblock %}

  <script type="text/javascript">
    $(document).ready(function () {
      if (CONFIG.sidebar === 'always') {
        displaySidebar();
      }
      if (isMobile()) {
        FastClick.attach(document.body);
      }
    });
  </script>

{#
  <!-- {% include '_scripts/mathjax.swig' %} -->
  <!-- {% block comment_system %}{% endblock %} -->
  <!-- {% include '_scripts/baidushare.swig' %} -->
#}
</body>
</html>
