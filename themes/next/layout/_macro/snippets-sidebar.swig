{% macro render(is_post) %}
  <aside id="snippets-sidebar" class="snippets-sidebar">
    <div class="sidebar-inner">
      <div class="list">
          <h2>
haha
          </h2>
          {% set posts = site.pages.find({type: 'snippets'}) %}
          <ul class="menu-root">
            {% for p in posts %}
                {% set fileName = p.path %}
                <li>
                    <a href="/{{ fileName }}" class="sidebar-link {{ page.title === p.title ? 'current' : '' }}">{{ p.title }}</a>
                  </li>
            {% endfor %}
          </ul>
      </div>
    </div>
  </aside>
{% endmacro %}
