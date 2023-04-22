function page_init() {
    // save/restore form values
    var storage_list = ['min','max','count','unique','unique_digits','sort'];
    for (var i = storage_list.length; i--;) {
        var ls = localStorage.getItem(storage_list[i]);
        var e = document.querySelector('#'+storage_list[i]);
        if (!e) continue;
        var f_ls_update = function(event) {
            var e = event.target;
            if (e.type == 'number') localStorage.setItem(e.id, e.value);
            else if (e.type == 'checkbox') localStorage.setItem(e.id, e.checked ? 1 : 0);
        };
        e.addEventListener("keyup", f_ls_update);
        e.addEventListener("change", f_ls_update);
        if (typeof(ls) != 'undefined') {
            if (e.type == 'number') {
                if (ls) ls = parseFloat(''+ls);
                if (typeof(ls) == 'number') e.value = ''+ls;
            } else if (e.type == 'checkbox') {
                e.checked = parseInt(ls) ? true : false;
            }
        }
    }
    // add some actions for the buttons
    var e = document.querySelector('#generate');
    if (e && typeof(generate) == 'function') e.addEventListener("click", generate);
    e = document.querySelector('#clear');
    if (e && typeof(clear_history) == 'function') e.addEventListener("click", clear_history);
    e = document.querySelector('#history');
    if (e && typeof(show_history) == 'function') e.addEventListener("click", show_history);
    // init vars
    history_list = [];
}

function clear_history() {
    // do an action
    history_list = [];
    // show results
    var e = document.querySelector('#results');
    if (e) e.innerText = 'history was cleared';
}

function show_history() {
    // show results
    var e = document.querySelector('#results');
    if (e) e.innerText = 'history: ' + history_list.join(', ');
}

function generate() {
    // get parameters
    var p = {'min':0, 'max':0, 'count':0, 'unique':0, 'unique_digits':0, 'sort':0};
    for (var name in p) {
        var e = document.querySelector('#'+name);
        if (!e) continue;
        if (e.type == 'number') {
            p[name] = e.value;
            if (p[name]) p[name] = parseFloat(p[name]);
            if (typeof(p[name]) != 'number') p[name] = 0;
        } else if (e.type == 'checkbox') {
            p[name] = e.checked;
        }
    }
    p.count = Math.abs(Math.round(p.count));
    // get results
    var rnd_list = [];
    var unique_list = [];
    var fract_digits = 0;
    if ( (''+p.min).indexOf('.') >= 0 )
        fract_digits = (''+p.min).length - (''+p.min).indexOf('.') - 1;
    if ( (''+p.max).indexOf('.') >= 0 )
        fract_digits = Math.max(fract_digits, (''+p.max).length - (''+p.max).indexOf('.') - 1);
    for (var i = p.count, rnd = 0; i--; ) {
        if (p.unique) {
            if (0/*p.unique_digits*/) {
                // TODO
                for (var tries = 1000; tries--; ) {
                    rnd = Math.random() * (p.max - p.min) + p.min;
                    rnd = rnd.toFixed(fract_digits);
                    if (!unique_list.includes(rnd)) {
                        history_list.push( parseFloat(rnd) );
                        unique_list.push(''+rnd);
                        break;
                    }
                }
            } else {
                for (var tries = 1000; tries--; ) {
                    rnd = Math.random() * (p.max - p.min) + p.min;
                    rnd = parseFloat( rnd.toFixed(fract_digits) );
                    if (!history_list.includes(rnd)) {
                        history_list.push(rnd);
                        rnd_list.push(rnd);
                        break;
                    }
                }
            }
        } else {
            rnd = Math.random() * (p.max - p.min) + p.min;
            rnd = parseFloat( rnd.toFixed(fract_digits) );
            history_list.push(rnd);
            rnd_list.push(rnd);
        }
    }
    if (p.sort)
        rnd_list.sort(function(a,b){
            var a1 = typeof(a), b1 = typeof(b);
            return a1<b1 ? -1 : a1>b1 ? 1 : a<b ? -1 : a>b ? 1 : 0;
        });
    // show results
    var e = document.querySelector('#results');
    if (e) e.innerText = rnd_list.join(', ');
}

page_init();
