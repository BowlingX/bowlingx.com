
<h2 class="bordered">Articles</h2>
<ul class="plain post-list">
  {% for post in site.posts %}
    <li>
      <time class="fade-out small-font">{{post.date | date: "%D"}}</time> 
      <h3 class="tight"><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt }}</p>
    </li>
  {% endfor %}
</ul>