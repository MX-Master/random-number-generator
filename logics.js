function page_init() {
    // save/restore form values
    var storage_list = ['min','max','count','unique','sort'];
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
    // do a calulations on button click
    var e = document.querySelector('#generate');
    if (e && typeof(generate) == 'function') e.addEventListener("click", generate);
}

function generate() {
    // get parameters
    var p = {'min':0, 'max':0, 'count':0, 'unique':0, 'sort':0};
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
    var fract_digits = 0;
    if ( (''+p.min).indexOf('.') >= 0 )
        fract_digits = (''+p.min).length - (''+p.min).indexOf('.') - 1;
    if ( (''+p.max).indexOf('.') >= 0 )
        fract_digits = Math.max(fract_digits, (''+p.max).length - (''+p.max).indexOf('.') - 1);
    for (var i = p.count, rnd = 0; i--; ) {
        if (p.unique) {
            for (tries = 1000; tries--; ) {
                rnd = Math.random() * (p.max - p.min) + p.min;
                rnd = parseFloat( rnd.toFixed(fract_digits) );
                if (!rnd_list.includes(rnd)) {rnd_list.push(rnd); break;}
            }
        } else {
            rnd = Math.random() * (p.max - p.min) + p.min;
            rnd = parseFloat( rnd.toFixed(fract_digits) );
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
