{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}
{% import '_macro/sidebar.swig' as sidebar_template %}
{% import '_macro/snippets.swig' as snippets_template %}
{% import '_macro/snippets-sidebar.swig' as snippets_sidebar_template %}

{% block title %} {{ page.title|escape }} | {{ config.title|escape }} {% endblock %}

{% block page_class %}page-post-detail{% endblock %}

{% block snippets-sidebar %}
  {% if page.type === "snippets" %}
    {{ snippets_sidebar_template.render(true) }}
  {% endif %}
{% endblock %}

{% block content %}

  <div id="posts" class="posts-expand">
   {% if page.type == "snippets" %}
    {{ snippets_template.render(page) }}
   {% else %}
    {{ post_template.render(page) }}

    <div class="post-spread">
      {% if theme.jiathis %}
        {% include '_partials/share/jiathis.swig' %}
      {% elseif theme.duoshuo_shortname and theme.duoshuo_share %}
        {% include '_partials/share/duoshuo_share.swig' %}
      {% endif %}
    </div>
    {% endif %}
  </div>

{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(true) }}
{% endblock %}


{% block script_extra %}
  {% include '_scripts/pages/post-details.swig' %}
{% endblock %}
