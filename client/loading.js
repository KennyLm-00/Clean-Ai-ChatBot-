document.addEventListener('DOMContentLoaded', function() {
  const loadingElement = document.getElementById('loading');

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      loadingElement.style.visibility = 'visible';
      setTimeout(() => {
        window.location.href = event.target.href;
      }, 800);
    });
  });
});

