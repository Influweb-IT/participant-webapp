<iframe
  id="influweb-dashboard"
  src="/dashboard/?lang=it"
  width="100%"
  height="2400"
  scrolling="no"
  style="border:0; display:block; overflow:hidden;"
  title="Influweb Dashboard"
  loading="lazy">
</iframe>
<script>
(function() {
  var frame = document.getElementById('influweb-dashboard');
  function resize() {
    try {
      var h = frame.contentDocument.documentElement.scrollHeight;
      if (h > 100) frame.style.height = h + 'px';
    } catch(e) {}
  }
  frame.addEventListener('load', function() {
    resize();
    setTimeout(resize, 2000);
  });
})();
</script>
