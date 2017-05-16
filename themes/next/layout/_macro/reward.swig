{% if theme.alipay || theme.wechat_pay %}
<div class="reward-wrapper container">
  <div class="reward-comment">{{ page.reward_comment || theme.reward_comment }}</div>
  <a class="reward-btn" data-track="点击赞赏" href="#reward-qr">赞赏支持</a>
  <div id="reward-qr" style="display: none;" class="clearfix">
    <div class="reward-thanks">{{ theme.reward_thanks }}</div>
    {% if theme.wechat_pay %}
    <div class="wechat">
      <a href="{{ theme.wechat_pay }}" class="fancybox">
        <img src="{{ theme.wechat_pay }}" alt="{{ theme.author }} WeChat Pay" class="skip" title="微信打赏">
      </a>
    </div>
    {% endif %}

    {% if theme.alipay %}
    <div class="alipay">
      <a href="{{ theme.alipay }}" class="fancybox">
        <img src="{{ theme.alipay }}" alt="{{ theme.author }} Alipay" class="skip" title="支付宝打赏">
      </a>
    </div>
    {% endif %}
  </div>
<div>
{% endif %}