var scene = document.querySelector('a-scene');
var cylinder = document.createElement('a-cylinder');
cylinder.setAttribute('color', '#FF9500');
cylinder.setAttribute('height', '2');
cylinder.setAttribute('radius', '0.75');
cylinder.setAttribute('position', '3 1 0');
scene.appendChild(cylinder);

var t = 0;
function render() {
  t += 0.01;
  requestAnimationFrame(render);
  cylinder.setAttribute('position', '3 '+(Math.sin(t*2)+1)+' 0');
}
render();