import _ from 'lodash';
// import './musicPlayer.css';
import './musicPlayer.less';
import './musicPlayer.js';
import './background.js';
import './songList.js';
import Icon from './01.jpg';

function component() {
    var element = document.createElement('div');

    // Lodash（目前通过一个本地依赖引入）对于执行这一行是必需的
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    // element.classList.add('hello');

    // var myIcon = new Image();
    // myIcon.src = Icon;
    // element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());