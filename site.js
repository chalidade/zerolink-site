// ZeroLink — shared by docs/index.html and docs/en/index.html.

// Isi dengan tautan Google Form untuk menampilkan tautan "Beri rating" di footer.
var FORM_URL = '';
if (FORM_URL) {
  var f = document.getElementById('form-link');
  f.href = FORM_URL;
  f.hidden = false;
}

if ('IntersectionObserver' in window) {
  // Story: the beat crossing the middle of the screen lights up and swaps the sticky phone's screen.
  var beats = document.querySelectorAll('.beat');
  var screens = document.querySelectorAll('.story-phone img');
  var story = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = Array.prototype.indexOf.call(beats, e.target);
      beats.forEach(function (b, j) { b.classList.toggle('on', j === i); });
      screens.forEach(function (s, j) { s.classList.toggle('on', j === i); });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  beats.forEach(function (b) { story.observe(b); });
} else {
  document.querySelectorAll('.beat').forEach(function (b) { b.classList.add('on'); });
}
