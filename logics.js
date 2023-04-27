function page_init() {
    // save/restore form values
    var storage_list = ['min','max','count','unique_once','unique_history','impermutable','sort'];
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
        if (typeof(ls) != 'undefined' && ls) {
            if (e.type == 'number') {
                e.value = ls;
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
    if (e) e.innerText = 'history('+history_list.length+'): ' + history_list.join(', ');
}

function generate() {
    // get parameters
    var p = {'min':0, 'max':0, 'count':0, 'unique_once':0, 'unique_history':0, 'impermutable':0, 'sort':0};
    var fract_digits = 0;
    for (var name in p) {
        var e = document.querySelector('#'+name);
        if (!e) continue;
        if (e.type == 'number') {
            p[name] = e.value;
            if (name == 'min' || name == 'max') {
            if ( p[name].indexOf('.') >= 0 )
                fract_digits = Math.max(fract_digits, p[name].length - p[name].indexOf('.') - 1);
            }
            if (p[name]) p[name] = parseFloat(p[name]);
            if (typeof(p[name]) != 'number') p[name] = 0;
        } else if (e.type == 'checkbox') {
            p[name] = e.checked;
        }
    }
    p.count = Math.abs(Math.round(p.count));
    // get results
    var rnd_list = [];
    if (typeof(history_list) != 'object') history_list = [];
    for (var cnt = p.count, rnd = 0; cnt--; ) {
        if (p.impermutable) {
            for (var tries = 1000; tries--; ) {
                rnd = Math.random()*(p.max - p.min) + p.min;
                rnd = rnd.toFixed(fract_digits);
//                console.log(rnd);
                var permutations = permute( rnd.split('') );
                var unique_permutations = [];
                for (var i = permutations.length, value = 0; i--; ) {
                    value = parseFloat(permutations[i].join(''));
//                    value = parseFloat(value.toFixed(fract_digits));
                    if (value >= p.min && value <= p.max ) unique_permutations.push(value);
                }
                unique_permutations = [...new Set(unique_permutations)];
//                console.log(unique_permutations);
                var permutation_found = 0;
                for (var i = unique_permutations.length; i--; ) {
                    if (history_list.includes(unique_permutations[i]) ||
                        rnd_list.includes(unique_permutations[i])) {
                        permutation_found = 1;
                        break;
                    }
                }
                if (!permutation_found) {
                    rnd = parseFloat(rnd);
                    rnd_list.push(rnd);
                    break;
                }
            }
        } else if (p.unique_once || p.unique_history) {
            for (var tries = 1000; tries--; ) {
                rnd = Math.random()*(p.max - p.min) + p.min;
                rnd = parseFloat( rnd.toFixed(fract_digits) );
                if (p.unique_once && rnd_list.includes(rnd)) continue;
                if (p.unique_history && history_list.includes(rnd)) continue;
                rnd_list.push(rnd);
                break;
            }
        } else {
            rnd = Math.random()*(p.max - p.min) + p.min;
            rnd = parseFloat( rnd.toFixed(fract_digits) );
            rnd_list.push(rnd);
        }
    }
    if (p.sort)
        rnd_list.sort(function(a,b){
            var a1 = typeof(a), b1 = typeof(b);
            return a1<b1 ? -1 : a1>b1 ? 1 : a<b ? -1 : a>b ? 1 : 0;
        });
    history_list = history_list.concat(rnd_list);
    // show results
    var e = document.querySelector('#results');
    if (e) e.innerText = rnd_list.join(', ');
}

function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}




page_init();
