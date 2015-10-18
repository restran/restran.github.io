<div class="copyright" >
  {% set current = date(Date.now(), "YYYY") %}
  &copy;&nbsp;{% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}
  <span itemprop="copyrightYear">{{ current }}</span>
  by
<!--   <span class="with-love">
    <i class="icon-next-heart"></i>
  </span> -->
  <span class="author" itemprop="copyrightHolder">{{ config.author }}, </span>
</div>

  <span>thanks to <a class="theme-link" href="http://hexo.io">Hexo</a> and   
  <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next">
    NexT{% if theme.scheme %}.{{ theme.scheme }}{% endif %}
  </a>
  </span>
<!-- <div class="powered-by">
  {{ __('footer.powered', '<a class="theme-link" href="http://hexo.io">Hexo</a>') }}
</div>

<div class="theme-info">
  {{ __('footer.theme') }} -
  <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next">
    NexT{% if theme.scheme %}.{{ theme.scheme }}{% endif %}
  </a>
</div> -->

{% block footer %}{% endblock %}
