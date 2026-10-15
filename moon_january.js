(function() {
    'use strict';
    var k, aa = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a
    };

    function ba(a) {
        a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c && c.Math == Math) return c
        }
        throw Error("a");
    }
    var ca = ba(this);

    function da(a, b) {
        if (b) a: {
            var c = ca;a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                if (!(e in c)) break a;
                c = c[e]
            }
            a = a[a.length - 1];d = c[a];b = b(d);b != d && b != null && aa(c, a, {
                configurable: !0,
                writable: !0,
                value: b
            })
        }
    }
    var ea = typeof Object.create == "function" ? Object.create : function(a) {
            function b() {}
            b.prototype = a;
            return new b
        },
        fa;
    if (typeof Object.setPrototypeOf == "function") fa = Object.setPrototypeOf;
    else {
        var ha;
        a: {
            var ia = {
                    a: !0
                },
                ka = {};
            try {
                ka.__proto__ = ia;
                ha = ka.a;
                break a
            } catch (a) {}
            ha = !1
        }
        fa = ha ? function(a, b) {
            a.__proto__ = b;
            if (a.__proto__ !== b) throw new TypeError("b`" + a);
            return a
        } : null
    }
    var la = fa;

    function ma(a, b) {
        a.prototype = ea(b.prototype);
        a.prototype.constructor = a;
        if (la) la(a, b);
        else
            for (var c in b)
                if (c != "prototype")
                    if (Object.defineProperties) {
                        var d = Object.getOwnPropertyDescriptor(b, c);
                        d && Object.defineProperty(a, c, d)
                    } else a[c] = b[c];
        a.rb = b.prototype
    }

    function na(a) {
        function b(d) {
            return a.next(d)
        }

        function c(d) {
            return a.throw(d)
        }
        return new Promise(function(d, e) {
            function f(g) {
                g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
            }
            f(a.next())
        })
    }

    function m(a) {
        return na(a())
    }
    da("globalThis", function(a) {
        return a || ca
    });
    da("Symbol.dispose", function(a) {
        return a ? a : Symbol("Symbol.dispose")
    });

    function oa(a, b) {
        a instanceof String && (a += "");
        var c = 0,
            d = !1,
            e = {
                next: function() {
                    if (!d && c < a.length) {
                        var f = c++;
                        return {
                            value: b(f, a[f]),
                            done: !1
                        }
                    }
                    d = !0;
                    return {
                        done: !0,
                        value: void 0
                    }
                }
            };
        e[Symbol.iterator] = function() {
            return e
        };
        return e
    }
    da("Array.prototype.values", function(a) {
        return a ? a : function() {
            return oa(this, function(b, c) {
                return c
            })
        }
    });
    da("Promise.prototype.finally", function(a) {
        return a ? a : function(b) {
            return this.then(function(c) {
                return Promise.resolve(b()).then(function() {
                    return c
                })
            }, function(c) {
                return Promise.resolve(b()).then(function() {
                    throw c;
                })
            })
        }
    });
    da("Array.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (c < 0 && (c = Math.max(c + e, 0)); c < e; c++) {
                var f = d[c];
                if (f === b || Object.is(f, b)) return !0
            }
            return !1
        }
    });
    da("Object.values", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push(b[d]);
            return c
        }
    });
    da("Object.entries", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
            return c
        }
    });
    da("String.prototype.matchAll", function(a) {
        return a ? a : function(b) {
            if (b instanceof RegExp && !b.global) throw new TypeError("c");
            var c = new RegExp(b, b instanceof RegExp ? void 0 : "g"),
                d = this,
                e = !1,
                f = {
                    next: function() {
                        if (e) return {
                            value: void 0,
                            done: !0
                        };
                        var g = c.exec(d);
                        if (!g) return e = !0, {
                            value: void 0,
                            done: !0
                        };
                        g[0] === "" && (c.lastIndex += 1);
                        return {
                            value: g,
                            done: !1
                        }
                    }
                };
            f[Symbol.iterator] = function() {
                return f
            };
            return f
        }
    });
    da("AggregateError", function(a) {
        function b(c, d) {
            d = Error(d);
            "stack" in d && (this.stack = d.stack);
            this.errors = c;
            this.message = d.message
        }
        if (a) return a;
        ma(b, Error);
        b.prototype.name = "AggregateError";
        return b
    });
    da("Promise.any", function(a) {
        return a ? a : function(b) {
            b = b instanceof Array ? b : Array.from(b);
            return Promise.all(b.map(function(c) {
                return Promise.resolve(c).then(function(d) {
                    throw d;
                }, function(d) {
                    return d
                })
            })).then(function(c) {
                throw new AggregateError(c, "All promises were rejected");
            }, function(c) {
                return c
            })
        }
    });
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    var pa = pa || {},
        qa = this || self;

    function ra(a) {
        var b = typeof a;
        b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
        return b == "array" || b == "object" && typeof a.length == "number"
    }

    function sa(a) {
        var b = typeof a;
        return b == "object" && a != null || b == "function"
    }

    function ta(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }

    function ua(a, b, c) {
        if (!a) throw Error();
        if (arguments.length > 2) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(b, e)
            }
        }
        return function() {
            return a.apply(b, arguments)
        }
    }

    function va(a, b, c) {
        va = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ta : ua;
        return va.apply(null, arguments)
    }

    function wa(a, b) {
        a = a.split(".");
        var c = qa;
        a[0] in c || typeof c.execScript == "undefined" || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift());) a.length || b === void 0 ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
    }

    function xa(a) {
        return a
    }

    function ya(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.rb = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a;
        a.nh = function(d, e, f) {
            for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
            return b.prototype[e].apply(d, g)
        }
    };
    var za = class {
            constructor() {
                this.state = 0;
                this.H = !1
            }
            update(a) {
                this.state === 0 && (this.o(), this.state = 1);
                this.state !== 1 || this.H || this.g() || this.Oa(a);
                (this.H || this.g()) && this.state !== 2 && (this.state = 2)
            }
            g() {
                return !1
            }
            then(a) {
                return new p([this, a instanceof Function ? new q(a) : a])
            }
            o() {}
            Oa() {}
        },
        Aa = class extends za {
            constructor(a) {
                super();
                this.T = a
            }
            o() {
                this.action = this.T()
            }
            Oa(a) {
                let b;
                (b = this.action) == null || b.update(a)
            }
            g() {
                return this.action !== void 0 && this.action.state === 2
            }
        },
        q = class extends za {
            constructor(a) {
                super();
                this.i = a
            }
            o() {
                this.i();
                this.H = !0
            }
        },
        r = class extends za {
            constructor(a) {
                super();
                this.j = a;
                this.i = 0
            }
            Oa(a) {
                this.i += a
            }
            g() {
                return this.i >= this.j
            }
        },
        p = class extends za {
            constructor(a) {
                super();
                this.actions = a;
                this.i = 0
            }
            Oa(a) {
                let b;
                (b = this.actions[this.i]) == null || b.update(a);
                let c;
                ((c = this.actions[this.i]) == null ? 0 : c.state === 2) && this.i++
            }
            g() {
                return this.i >= this.actions.length
            }
            then(a) {
                this.actions.push(a instanceof Function ? new q(a) : a);
                return this
            }
        },
        t = class extends za {
            constructor(a) {
                super();
                this.actions = a
            }
            Oa(a) {
                for (const b of this.actions) b.update(a)
            }
            g() {
                return this.actions.every(a =>
                    a.state === 2)
            }
        };
    var Ba;

    function Ca(a, b, c) {
        return a + c * (b - a)
    };

    function Da(a, b, c, d) {
        this.x1 = a;
        this.y1 = b;
        this.x2 = c;
        this.y2 = d
    }
    Da.prototype.equals = function(a) {
        return this.x1 == a.x1 && this.y1 == a.y1 && this.x2 == a.x2 && this.y2 == a.y2 && !0
    };

    function Ea(a, b) {
        if (b == 0) return 0;
        if (b == 1) return 1;
        let c = Ca(0, a.x1, b),
            d = Ca(a.x1, a.x2, b);
        a = Ca(a.x2, 1, b);
        c = Ca(c, d, b);
        d = Ca(d, a, b);
        return Ca(c, d, b)
    }

    function Fa(a, b) {
        let c = b;
        if (c <= 0) return 0;
        if (c >= 1) return 1;
        let d = 0,
            e = 1,
            f = 0;
        for (var g = 0; g < 8; g++) {
            f = Ea(a, c);
            const h = (Ea(a, c + 1E-6) - f) / 1E-6;
            if (Math.abs(f - b) < 1E-6) return c;
            if (Math.abs(h) < 1E-6) break;
            else f < b ? d = c : e = c, c -= (f - b) / h
        }
        for (g = 0; Math.abs(f - b) > 1E-6 && g < 8; g++) f < b ? (d = c, c = (c + e) / 2) : (e = c, c = (c + d) / 2), f = Ea(a, c);
        return c
    };
    const Ga = (a, b, c, d) => {
        const e = new Da(a, b, c, d);
        return f => {
            f = Fa(e, f);
            if (f == 0) f = 0;
            else if (f == 1) f = 1;
            else {
                var g = Ca(0, e.y1, f),
                    h = Ca(e.y1, e.y2, f),
                    l = Ca(e.y2, 1, f);
                g = Ca(g, h, f);
                h = Ca(h, l, f);
                f = Ca(g, h, f)
            }
            return f
        }
    };
    var Ha = Ga(.25, .1, .25, 1),
        Ia = a => a,
        Ja = Ga(.4, 0, 1, 1),
        Ka = Ga(.7, 0, .84, 0),
        La = Ga(0, 0, .6, 1),
        Ma = a => 1 - (1 - a) * (1 - a),
        Na = Ga(.175, .885, .32, 1.275),
        Oa = Ga(.25, 1, .5, 1),
        Pa = Ga(.16, 1, .3, 1);

    function v(a, b) {
        a.u = b;
        return a
    }
    var Qa = class extends za {
            constructor(a, b, c) {
                super();
                this.j = a;
                this.from = b;
                this.N = c;
                this.i = 0;
                this.u = Ia
            }
            o() {
                this.j === 0 && this.v(this.from, this.N, this.u(1))
            }
            Oa(a) {
                this.i += a;
                this.v(this.from, this.N, this.u(Math.min(1, this.i / this.j)))
            }
            g() {
                return this.i >= this.j
            }
        },
        w = class extends Qa {
            constructor(a, b, c, d) {
                super(a, b, c);
                this.T = d
            }
            v(a, b, c) {
                this.T(Ca(a, b, c))
            }
        };
    var Ra = class {
        g() {
            return !0
        }
    };
    var Sa = class extends Ra {
        contains() {
            return !1
        }
    };
    const Ta = Array.prototype.indexOf ? function(a, b) {
        return Array.prototype.indexOf.call(a, b, void 0)
    } : function(a, b) {
        if (typeof a === "string") return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
        for (let c = 0; c < a.length; c++)
            if (c in a && a[c] === b) return c;
        return -1
    };

    function Ua(a) {
        const b = Math.random;
        for (let c = a.length - 1; c > 0; c--) {
            const d = Math.floor(b() * (c + 1)),
                e = a[c];
            a[c] = a[d];
            a[d] = e
        }
    };
    /*

     Copyright Google LLC
     SPDX-License-Identifier: Apache-2.0
    */
    let Va = globalThis.trustedTypes,
        Wa;

    function Xa() {
        let a = null;
        if (!Va) return a;
        try {
            const b = c => c;
            a = Va.createPolicy("goog#html", {
                createHTML: b,
                createScript: b,
                createScriptURL: b
            })
        } catch (b) {}
        return a
    }

    function Ya() {
        Wa === void 0 && (Wa = Xa());
        return Wa
    };
    var Za = class {
        constructor(a) {
            this.g = a
        }
        toString() {
            return this.g + ""
        }
    };

    function $a(a) {
        const b = Ya();
        return new Za(b ? b.createScriptURL(a) : a)
    };
    var ab = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;

    function bb(a) {
        if (ab.test(a)) return a
    };

    function cb(a, b = `unexpected value ${a}!`) {
        throw Error(b);
    };
    var eb = class {
        constructor(a) {
            this.g = a
        }
        toString() {
            return this.g + ""
        }
    };

    function fb(a) {
        const b = Ya();
        return new eb(b ? b.createHTML(a) : a)
    }

    function gb(a) {
        if (a instanceof eb) return a.g;
        throw Error("d");
    };

    function hb(a) {
        var b = window;
        a = bb(a);
        a !== void 0 && b.open(a, void 0, void 0)
    }

    function ib(a = document) {
        let b;
        const c = (b = a.querySelector) == null ? void 0 : b.call(a, "script[nonce]");
        return c == null ? "" : c.nonce || c.getAttribute("nonce") || ""
    };

    function jb(a) {
        var b = kb`//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
        if (b instanceof Za) b = b.g;
        else throw Error("d");
        a.src = b;
        (b = ib(a.ownerDocument)) && a.setAttribute("nonce", b)
    };

    function lb(a, b, c) {
        b = String(b);
        let d = c;
        b.toLowerCase() === "inserthtml" && (d = gb(c));
        return a.execCommand(b, !1, d)
    };

    function mb(a, b, c) {
        for (const d in a) b.call(c, a[d], d, a)
    }
    const nb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

    function ob(a, b) {
        let c, d;
        for (let e = 1; e < arguments.length; e++) {
            d = arguments[e];
            for (c in d) a[c] = d[c];
            for (let f = 0; f < nb.length; f++) c = nb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    };

    function pb(a) {
        if (a.Ya && typeof a.Ya == "function") return a.Ya();
        if (typeof Map !== "undefined" && a instanceof Map || typeof Set !== "undefined" && a instanceof Set) return Array.from(a.values());
        if (typeof a === "string") return a.split("");
        if (ra(a)) {
            var b = [],
                c = a.length;
            for (var d = 0; d < c; d++) b.push(a[d]);
            return b
        }
        b = [];
        c = 0;
        for (d in a) b[c++] = a[d];
        return b
    }

    function qb(a) {
        if (a.Vb && typeof a.Vb == "function") return a.Vb();
        if (!a.Ya || typeof a.Ya != "function") {
            if (typeof Map !== "undefined" && a instanceof Map) return Array.from(a.keys());
            if (!(typeof Set !== "undefined" && a instanceof Set)) {
                if (ra(a) || typeof a === "string") {
                    var b = [];
                    a = a.length;
                    for (var c = 0; c < a; c++) b.push(c);
                    return b
                }
                b = [];
                c = 0;
                for (const d in a) b[c++] = d;
                return b
            }
        }
    }

    function rb(a, b, c) {
        if (a.forEach && typeof a.forEach == "function") a.forEach(b, c);
        else if (ra(a) || typeof a === "string") Array.prototype.forEach.call(a, b, c);
        else {
            const d = qb(a),
                e = pb(a),
                f = e.length;
            for (let g = 0; g < f; g++) b.call(c, e[g], d && d[g], a)
        }
    };
    var sb = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");

    function tb(a, b) {
        if (a) {
            a = a.split("&");
            for (let c = 0; c < a.length; c++) {
                const d = a[c].indexOf("=");
                let e, f = null;
                d >= 0 ? (e = a[c].substring(0, d), f = a[c].substring(d + 1)) : e = a[c];
                b(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
            }
        }
    };

    function ub(a) {
        this.j = this.v = this.o = "";
        this.N = null;
        this.H = this.i = "";
        this.u = !1;
        let b;
        a instanceof ub ? (this.u = a.u, vb(this, a.o), this.v = a.v, this.j = a.j, wb(this, a.N), this.i = a.i, xb(this, yb(a.g)), this.H = a.H) : a && (b = String(a).match(sb)) ? (this.u = !1, vb(this, b[1] || "", !0), this.v = zb(b[2] || ""), this.j = zb(b[3] || "", !0), wb(this, b[4]), this.i = zb(b[5] || "", !0), xb(this, b[6] || "", !0), this.H = zb(b[7] || "")) : (this.u = !1, this.g = new Ab(null, this.u))
    }
    ub.prototype.toString = function() {
        const a = [];
        var b = this.o;
        b && a.push(Bb(b, Cb, !0), ":");
        var c = this.j;
        if (c || b == "file") a.push("//"), (b = this.v) && a.push(Bb(b, Cb, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.N, c != null && a.push(":", String(c));
        if (c = this.i) this.j && c.charAt(0) != "/" && a.push("/"), a.push(Bb(c, c.charAt(0) == "/" ? Db : Eb, !0));
        (c = this.g.toString()) && a.push("?", c);
        (c = this.H) && a.push("#", Bb(c, Fb));
        return a.join("")
    };
    ub.prototype.resolve = function(a) {
        const b = new ub(this);
        let c = !!a.o;
        c ? vb(b, a.o) : c = !!a.v;
        c ? b.v = a.v : c = !!a.j;
        c ? b.j = a.j : c = a.N != null;
        var d = a.i;
        if (c) wb(b, a.N);
        else if (c = !!a.i) {
            if (d.charAt(0) != "/")
                if (this.j && !this.i) d = "/" + d;
                else {
                    var e = b.i.lastIndexOf("/");
                    e != -1 && (d = b.i.slice(0, e + 1) + d)
                } e = d;
            if (e == ".." || e == ".") d = "";
            else if (e.indexOf("./") != -1 || e.indexOf("/.") != -1) {
                d = e.lastIndexOf("/", 0) == 0;
                e = e.split("/");
                const f = [];
                for (let g = 0; g < e.length;) {
                    const h = e[g++];
                    h == "." ? d && g == e.length && f.push("") : h == ".." ? ((f.length > 1 ||
                        f.length == 1 && f[0] != "") && f.pop(), d && g == e.length && f.push("")) : (f.push(h), d = !0)
                }
                d = f.join("/")
            } else d = e
        }
        c ? b.i = d : c = a.g.toString() !== "";
        c ? xb(b, yb(a.g)) : c = !!a.H;
        c && (b.H = a.H);
        return b
    };

    function vb(a, b, c) {
        a.o = c ? zb(b, !0) : b;
        a.o && (a.o = a.o.replace(/:$/, ""))
    }

    function wb(a, b) {
        if (b) {
            b = Number(b);
            if (isNaN(b) || b < 0) throw Error("e`" + b);
            a.N = b
        } else a.N = null
    }

    function xb(a, b, c) {
        b instanceof Ab ? (a.g = b, Gb(a.g, a.u)) : (c || (b = Bb(b, Hb)), a.g = new Ab(b, a.u))
    }

    function zb(a, b) {
        return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
    }

    function Bb(a, b, c) {
        return typeof a === "string" ? (a = encodeURI(a).replace(b, Ib), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
    }

    function Ib(a) {
        a = a.charCodeAt(0);
        return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
    }
    var Cb = /[#\/\?@]/g,
        Eb = /[#\?:]/g,
        Db = /[#\?]/g,
        Hb = /[#\?@]/g,
        Fb = /#/g;

    function Ab(a, b) {
        this.i = this.g = null;
        this.j = a || null;
        this.o = !!b
    }

    function Jb(a) {
        a.g || (a.g = new Map, a.i = 0, a.j && tb(a.j, function(b, c) {
            a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
        }))
    }
    k = Ab.prototype;
    k.add = function(a, b) {
        Jb(this);
        this.j = null;
        a = Kb(this, a);
        let c = this.g.get(a);
        c || this.g.set(a, c = []);
        c.push(b);
        this.i += 1;
        return this
    };
    k.remove = function(a) {
        Jb(this);
        a = Kb(this, a);
        return this.g.has(a) ? (this.j = null, this.i -= this.g.get(a).length, this.g.delete(a)) : !1
    };
    k.clear = function() {
        this.g = this.j = null;
        this.i = 0
    };

    function Lb(a, b) {
        Jb(a);
        b = Kb(a, b);
        return a.g.has(b)
    }
    k.forEach = function(a, b) {
        Jb(this);
        this.g.forEach(function(c, d) {
            c.forEach(function(e) {
                a.call(b, e, d, this)
            }, this)
        }, this)
    };
    k.Vb = function() {
        Jb(this);
        const a = Array.from(this.g.values()),
            b = Array.from(this.g.keys()),
            c = [];
        for (let d = 0; d < b.length; d++) {
            const e = a[d];
            for (let f = 0; f < e.length; f++) c.push(b[d])
        }
        return c
    };
    k.Ya = function(a) {
        Jb(this);
        let b = [];
        if (typeof a === "string") Lb(this, a) && (b = b.concat(this.g.get(Kb(this, a))));
        else {
            a = Array.from(this.g.values());
            for (let c = 0; c < a.length; c++) b = b.concat(a[c])
        }
        return b
    };
    k.set = function(a, b) {
        Jb(this);
        this.j = null;
        a = Kb(this, a);
        Lb(this, a) && (this.i -= this.g.get(a).length);
        this.g.set(a, [b]);
        this.i += 1;
        return this
    };
    k.get = function(a, b) {
        if (!a) return b;
        a = this.Ya(a);
        return a.length > 0 ? String(a[0]) : b
    };
    k.toString = function() {
        if (this.j) return this.j;
        if (!this.g) return "";
        const a = [],
            b = Array.from(this.g.keys());
        for (let d = 0; d < b.length; d++) {
            var c = b[d];
            const e = encodeURIComponent(String(c));
            c = this.Ya(c);
            for (let f = 0; f < c.length; f++) {
                let g = e;
                c[f] !== "" && (g += "=" + encodeURIComponent(String(c[f])));
                a.push(g)
            }
        }
        return this.j = a.join("&")
    };

    function yb(a) {
        const b = new Ab;
        b.j = a.j;
        a.g && (b.g = new Map(a.g), b.i = a.i);
        return b
    }

    function Kb(a, b) {
        b = String(b);
        a.o && (b = b.toLowerCase());
        return b
    }

    function Gb(a, b) {
        b && !a.o && (Jb(a), a.j = null, a.g.forEach(function(c, d) {
            var e = d.toLowerCase();
            if (d != e && (this.remove(d), this.remove(e), c.length > 0)) {
                this.j = null;
                d = this.g;
                var f = d.set;
                e = Kb(this, e);
                var g = c.length;
                if (g > 0) {
                    const h = Array(g);
                    for (let l = 0; l < g; l++) h[l] = c[l];
                    g = h
                } else g = [];
                f.call(d, e, g);
                this.i += c.length
            }
        }, a));
        a.o = b
    }
    k.extend = function(a) {
        for (let b = 0; b < arguments.length; b++) rb(arguments[b], function(c, d) {
            this.add(d, c)
        }, this)
    };

    function Mb(a) {
        const b = new XMLHttpRequest;
        b.open("GET", a);
        return new Promise((c, d) => {
            b.send();
            b.onreadystatechange = () => {
                if (b.readyState == 4)
                    if (b.status == 200 && b.responseText) a: {
                        var e = b.responseText;e.startsWith(")]}'\n") && (e = e.substring(5));
                        let f = {};
                        try {
                            f = JSON.parse(e)
                        } catch (g) {
                            d(e);
                            break a
                        }
                        f.hasOwnProperty("ddllog") && (f = f.ddllog);f.hasOwnProperty("__err__") ? d(f.__err__) : c(f)
                    }
                else d(b)
            }
        })
    }

    function Nb(a, b, c = () => {}, d = !1) {
        d = d ? "//www.google.com" : "";
        d = new ub("ddllog".startsWith("/") ? `${d}${"ddllog"}` : `${d}/async/${"ddllog"}`);
        xb(d, b);
        d = d.toString();
        a.g++;
        c(a.g);
        return Mb(d).catch(e => a.g < 1 ? a.i(2E3 * Math.pow(2, a.g - 1)).then(() => Nb(a, b, c)) : Promise.reject(e)).finally(() => a.g = 0)
    }
    class Ob {
        constructor(a) {
            this.g = 0;
            this.i = a
        }
    };
    class Pb extends Ob {
        constructor() {
            super(a => new Promise(b => setTimeout(b, a)))
        }
    };

    function Qb(a) {
        if (!a.o) {
            a.o = !0;
            for (const b of a.u) b()
        }
    }
    class Rb {
        constructor(a) {
            this.j = a;
            this.o = !1;
            this.u = []
        }
        i() {}
        H() {
            this.o = !1;
            this.u = []
        }
    };

    function Sb() {
        this.o = this.o;
        this.H = this.H
    }
    Sb.prototype.o = !1;
    Sb.prototype.dispose = function() {
        this.o || (this.o = !0, this.Wa())
    };
    Sb.prototype[Symbol.dispose] = function() {
        this.dispose()
    };
    Sb.prototype.Wa = function() {
        if (this.H)
            for (; this.H.length;) this.H.shift()()
    };

    function Tb(a, b) {
        this.type = a;
        this.currentTarget = this.target = b;
        this.defaultPrevented = !1
    }
    Tb.prototype.preventDefault = function() {
        this.defaultPrevented = !0
    };
    var Ub = function() {
        if (!qa.addEventListener || !Object.defineProperty) return !1;
        var a = !1,
            b = Object.defineProperty({}, "passive", {
                get: function() {
                    a = !0
                }
            });
        try {
            const c = () => {};
            qa.addEventListener("test", c, b);
            qa.removeEventListener("test", c, b)
        } catch (c) {}
        return a
    }();
    var Vb, Wb;
    a: {
        for (var Xb = ["CLOSURE_FLAGS"], Yb = qa, Zb = 0; Zb < Xb.length; Zb++)
            if (Yb = Yb[Xb[Zb]], Yb == null) {
                Wb = null;
                break a
            } Wb = Yb
    }
    var $b = Wb && Wb[610401301];
    Vb = $b != null ? $b : !1;
    var ac;
    const bc = qa.navigator;
    ac = bc ? bc.userAgentData || null : null;

    function cc(a) {
        return Vb ? ac ? ac.brands.some(({
            brand: b
        }) => b && b.indexOf(a) != -1) : !1 : !1
    }

    function dc(a) {
        var b;
        a: {
            if (b = qa.navigator)
                if (b = b.userAgent) break a;b = ""
        }
        return b.indexOf(a) != -1
    };

    function ec() {
        return Vb ? !!ac && ac.brands.length > 0 : !1
    }

    function fc() {
        return ec() ? cc("Chromium") : (dc("Chrome") || dc("CriOS")) && !(ec() ? 0 : dc("Edge")) || dc("Silk")
    };
    var gc = ec() ? !1 : dc("Trident") || dc("MSIE");

    function hc(a, b) {
        Tb.call(this, a ? a.type : "");
        this.relatedTarget = this.currentTarget = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
        this.key = "";
        this.keyCode = 0;
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.state = null;
        this.pointerId = 0;
        this.pointerType = "";
        this.kb = null;
        if (a) {
            const c = this.type = a.type,
                d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
            this.target = a.target || a.srcElement;
            this.currentTarget = b;
            b = a.relatedTarget;
            b || (c == "mouseover" ?
                b = a.fromElement : c == "mouseout" && (b = a.toElement));
            this.relatedTarget = b;
            d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
            this.button = a.button;
            this.keyCode = a.keyCode || 0;
            this.key = a.key || "";
            this.ctrlKey = a.ctrlKey;
            this.altKey = a.altKey;
            this.shiftKey =
                a.shiftKey;
            this.metaKey = a.metaKey;
            this.pointerId = a.pointerId || 0;
            this.pointerType = a.pointerType;
            this.state = a.state;
            this.kb = a;
            a.defaultPrevented && hc.rb.preventDefault.call(this)
        }
    }
    ya(hc, Tb);
    hc.prototype.preventDefault = function() {
        hc.rb.preventDefault.call(this);
        const a = this.kb;
        a.preventDefault ? a.preventDefault() : a.returnValue = !1
    };
    var ic = "closure_listenable_" + (Math.random() * 1E6 | 0);

    function jc(a) {
        return !(!a || !a[ic])
    };
    var kc = 0;

    function lc(a, b, c, d, e) {
        this.listener = a;
        this.proxy = null;
        this.src = b;
        this.type = c;
        this.capture = !!d;
        this.Jb = e;
        this.key = ++kc;
        this.Ab = this.Eb = !1
    }

    function mc(a) {
        a.Ab = !0;
        a.listener = null;
        a.proxy = null;
        a.src = null;
        a.Jb = null
    };

    function nc(a) {
        this.src = a;
        this.g = {};
        this.i = 0
    }
    nc.prototype.add = function(a, b, c, d, e) {
        const f = a.toString();
        a = this.g[f];
        a || (a = this.g[f] = [], this.i++);
        const g = oc(a, b, d, e);
        g > -1 ? (b = a[g], c || (b.Eb = !1)) : (b = new lc(b, this.src, f, !!d, e), b.Eb = c, a.push(b));
        return b
    };
    nc.prototype.remove = function(a, b, c, d) {
        a = a.toString();
        if (!(a in this.g)) return !1;
        const e = this.g[a];
        b = oc(e, b, c, d);
        return b > -1 ? (mc(e[b]), Array.prototype.splice.call(e, b, 1), e.length == 0 && (delete this.g[a], this.i--), !0) : !1
    };

    function pc(a, b) {
        const c = b.type;
        if (!(c in a.g)) return !1;
        var d = a.g[c];
        const e = Ta(d, b);
        let f;
        (f = e >= 0) && Array.prototype.splice.call(d, e, 1);
        f && (mc(b), a.g[c].length == 0 && (delete a.g[c], a.i--));
        return f
    }

    function qc(a) {
        let b = 0;
        for (const c in a.g) {
            const d = a.g[c];
            for (let e = 0; e < d.length; e++) ++b, mc(d[e]);
            delete a.g[c];
            a.i--
        }
    }

    function oc(a, b, c, d) {
        for (let e = 0; e < a.length; ++e) {
            const f = a[e];
            if (!f.Ab && f.listener == b && f.capture == !!c && f.Jb == d) return e
        }
        return -1
    };
    var rc = "closure_lm_" + (Math.random() * 1E6 | 0),
        sc = {},
        tc = 0;

    function uc(a, b, c, d, e) {
        if (d && d.once) return vc(a, b, c, d, e);
        if (Array.isArray(b)) {
            for (let f = 0; f < b.length; f++) uc(a, b[f], c, d, e);
            return null
        }
        c = wc(c);
        return jc(a) ? xc(a, b, c, sa(d) ? !!d.capture : !!d, e) : yc(a, b, c, !1, d, e)
    }

    function yc(a, b, c, d, e, f) {
        if (!b) throw Error("g");
        const g = sa(e) ? !!e.capture : !!e;
        let h = zc(a);
        h || (a[rc] = h = new nc(a));
        c = h.add(b, c, d, g, f);
        if (c.proxy) return c;
        d = Ac();
        c.proxy = d;
        d.src = a;
        d.listener = c;
        if (a.addEventListener) Ub || (e = g), e === void 0 && (e = !1), a.addEventListener(b.toString(), d, e);
        else if (a.attachEvent) a.attachEvent(Bc(b.toString()), d);
        else if (a.addListener && a.removeListener) a.addListener(d);
        else throw Error("h");
        tc++;
        return c
    }

    function Ac() {
        function a(c) {
            return b.call(a.src, a.listener, c)
        }
        const b = Cc;
        return a
    }

    function vc(a, b, c, d, e) {
        if (Array.isArray(b)) {
            for (let f = 0; f < b.length; f++) vc(a, b[f], c, d, e);
            return null
        }
        c = wc(c);
        return jc(a) ? a.Na.add(String(b), c, !0, sa(d) ? !!d.capture : !!d, e) : yc(a, b, c, !0, d, e)
    }

    function Dc(a, b, c, d, e) {
        if (Array.isArray(b))
            for (let f = 0; f < b.length; f++) Dc(a, b[f], c, d, e);
        else(d = sa(d) ? !!d.capture : !!d, c = wc(c), jc(a)) ? a.Na.remove(String(b), c, d, e) : a && (a = zc(a)) && (b = a.g[b.toString()], a = -1, b && (a = oc(b, c, d, e)), (c = a > -1 ? b[a] : null) && Ec(c))
    }

    function Ec(a) {
        if (typeof a === "number" || !a || a.Ab) return !1;
        const b = a.src;
        if (jc(b)) return pc(b.Na, a);
        var c = a.type;
        const d = a.proxy;
        b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Bc(c), d) : b.addListener && b.removeListener && b.removeListener(d);
        tc--;
        (c = zc(b)) ? (pc(c, a), c.i == 0 && (c.src = null, b[rc] = null)) : mc(a);
        return !0
    }

    function Bc(a) {
        return a in sc ? sc[a] : sc[a] = "on" + a
    }

    function Cc(a, b) {
        if (a.Ab) a = !0;
        else {
            b = new hc(b, this);
            const c = a.listener,
                d = a.Jb || a.src;
            a.Eb && Ec(a);
            a = c.call(d, b)
        }
        return a
    }

    function zc(a) {
        a = a[rc];
        return a instanceof nc ? a : null
    }
    var Fc = "__closure_events_fn_" + (Math.random() * 1E9 >>> 0);

    function wc(a) {
        if (typeof a === "function") return a;
        a[Fc] || (a[Fc] = function(b) {
            return a.handleEvent(b)
        });
        return a[Fc]
    };
    var Gc = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? a => a && AsyncContext.Snapshot.wrap(a) : a => a;

    function Hc() {
        Sb.call(this);
        this.Na = new nc(this);
        this.La = this;
        this.ha = null
    }
    ya(Hc, Sb);
    Hc.prototype[ic] = !0;
    Hc.prototype.addEventListener = function(a, b, c, d) {
        uc(this, a, b, c, d)
    };
    Hc.prototype.removeEventListener = function(a, b, c, d) {
        Dc(this, a, b, c, d)
    };
    Hc.prototype.dispatchEvent = function(a) {
        var b, c = this.ha;
        if (c)
            for (b = []; c; c = c.ha) b.push(c);
        c = this.La;
        const d = a.type || a;
        if (typeof a === "string") a = new Tb(a, c);
        else if (a instanceof Tb) a.target = a.target || c;
        else {
            var e = a;
            a = new Tb(d, c);
            ob(a, e)
        }
        e = !0;
        let f, g;
        if (b)
            for (g = b.length - 1; g >= 0; g--) f = a.currentTarget = b[g], e = Ic(f, d, !0, a) && e;
        f = a.currentTarget = c;
        e = Ic(f, d, !0, a) && e;
        e = Ic(f, d, !1, a) && e;
        if (b)
            for (g = 0; g < b.length; g++) f = a.currentTarget = b[g], e = Ic(f, d, !1, a) && e;
        return e
    };
    Hc.prototype.Wa = function() {
        Hc.rb.Wa.call(this);
        this.Na && qc(this.Na);
        this.ha = null
    };

    function xc(a, b, c, d, e) {
        return a.Na.add(String(b), c, !1, d, e)
    }

    function Ic(a, b, c, d) {
        b = a.Na.g[String(b)];
        if (!b) return !0;
        b = b.concat();
        let e = !0;
        for (let f = 0; f < b.length; ++f) {
            const g = b[f];
            if (g && !g.Ab && g.capture == c) {
                const h = g.listener,
                    l = g.Jb || g.src;
                g.Eb && pc(a.Na, g);
                e = h.call(l, d) !== !1 && e
            }
        }
        return e && !d.defaultPrevented
    };

    function Jc() {
        Hc.call(this);
        this.headers = new Map;
        this.i = !1;
        this.g = null;
        this.T = "";
        this.j = this.N = this.u = this.v = !1;
        this.Da = null;
        this.ta = "";
        this.Fa = !1
    }
    ya(Jc, Hc);
    var Kc = /^https?$/i,
        Lc = ["POST", "PUT"];

    function Mc(a, b) {
        if (a.g) throw Error("i`" + a.T + "`" + b);
        a.T = b;
        a.v = !1;
        a.i = !0;
        a.g = new XMLHttpRequest;
        a.g.onreadystatechange = Gc(va(a.od, a));
        try {
            a.N = !0, a.g.open("GET", String(b), !0), a.N = !1
        } catch (e) {
            Nc(a);
            return
        }
        b = new Map(a.headers);
        const c = Array.from(b.keys()).find(e => "content-type" == e.toLowerCase()),
            d = qa.FormData && !1;
        !(Ta(Lc, "GET") >= 0) || c || d || b.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        for (const [e, f] of b) a.g.setRequestHeader(e, f);
        a.ta && (a.g.responseType = a.ta);
        "withCredentials" in
        a.g && a.g.withCredentials !== a.Fa && (a.g.withCredentials = a.Fa);
        try {
            Oc(a), a.u = !0, a.g.send(""), a.u = !1
        } catch (e) {
            Nc(a)
        }
    }

    function Nc(a) {
        a.i = !1;
        a.g && (a.j = !0, a.g.abort(), a.j = !1);
        Pc(a);
        Qc(a)
    }

    function Pc(a) {
        a.v || (a.v = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"))
    }
    k = Jc.prototype;
    k.abort = function() {
        this.g && this.i && (this.i = !1, this.j = !0, this.g.abort(), this.j = !1, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Qc(this))
    };
    k.Wa = function() {
        this.g && (this.i && (this.i = !1, this.j = !0, this.g.abort(), this.j = !1), Qc(this, !0));
        Jc.rb.Wa.call(this)
    };
    k.od = function() {
        this.o || (this.N || this.u || this.j ? Rc(this) : this.Xf())
    };
    k.Xf = function() {
        Rc(this)
    };

    function Rc(a) {
        if (a.i && typeof pa != "undefined")
            if (a.u && (a.g ? a.g.readyState : 0) == 4) setTimeout(a.od.bind(a), 0);
            else if (a.dispatchEvent("readystatechange"), (a.g ? a.g.readyState : 0) == 4) {
            a.i = !1;
            try {
                try {
                    var b = (a.g ? a.g.readyState : 0) > 2 ? a.g.status : -1
                } catch (f) {
                    b = -1
                }
                a: switch (b) {
                    case 200:
                    case 201:
                    case 202:
                    case 204:
                    case 206:
                    case 304:
                    case 1223:
                        var c = !0;
                        break a;
                    default:
                        c = !1
                }
                var d;
                if (!(d = c)) {
                    var e;
                    if (e = b === 0) {
                        let f = String(a.T).match(sb)[1] || null;
                        !f && qa.self && qa.self.location && (f = qa.self.location.protocol.slice(0, -1));
                        e = !Kc.test(f ? f.toLowerCase() : "")
                    }
                    d = e
                }
                d ? (a.dispatchEvent("complete"), a.dispatchEvent("success")) : Pc(a)
            } finally {
                Qc(a)
            }
        }
    }

    function Qc(a, b) {
        if (a.g) {
            Oc(a);
            const c = a.g;
            a.g = null;
            b || a.dispatchEvent("ready");
            try {
                c.onreadystatechange = null
            } catch (d) {}
        }
    }

    function Oc(a) {
        a.Da && (clearTimeout(a.Da), a.Da = null)
    }
    k.isActive = function() {
        return !!this.g
    };

    function Sc(a) {
        if (a.g && a.g.state == "running" && !a.H) {
            a.H = !0;
            for (let b = 0; b < a.T.length; b++) a.T[b]()
        }
    }

    function Tc(a) {
        a.g && (a.i == null ? Uc(a) : a.i.playbackState === void 0 ? Uc(a) : a.i.playbackState !== a.i.PLAYING_STATE && a.i.playbackState !== a.i.FINISHED_STATE && Uc(a))
    }

    function Vc(a) {
        var b = Wc;
        if (Xc && !b.g) {
            b.g = new(window.AudioContext || window.webkitAudioContext);
            b.j = b.g.createGain();
            b.j.connect(b.g.destination);
            for (let c in b.u) b.u[c].g = b.g;
            for (let c in b.o) Yc(b.o[c], b.g, b.j);
            b.g.onstatechange = () => {
                Sc(b)
            };
            Sc(b);
            Tc(b);
            vc(a, "click pointerup mousedown mouseup touchstart touchend".split(" "), () => {
                b.g && (b.g.resume(), Tc(b))
            }, !0)
        }
    }

    function Zc(a, b) {
        a.T.push(b);
        a.H && b()
    }

    function Uc(a) {
        if (a.g) {
            a.i = a.g.createBufferSource();
            var b = a.g.createBuffer(1, 1, 22050);
            a.i.buffer = b;
            a.i.connect(a.g.destination);
            a.i.start(0);
            for (const c of a.ha) c()
        }
    }

    function $c() {
        var a = Wc;
        let b = Promise.resolve();
        a.v && a.g && (b = a.g.resume());
        a.v = !1;
        return b
    }
    class ad {
        constructor() {
            var a = x;
            this.u = bd;
            this.o = a;
            this.g = null;
            this.ha = [];
            this.j = null;
            this.H = this.v = this.N = !1;
            this.T = [];
            this.i = null
        }
        destroy() {
            this.g && (this.g.close(), this.g = null)
        }
        reset() {
            for (let a in this.u) this.u[a].u = [];
            for (let a in this.o) cd(this.o[a])
        }
        isMuted() {
            return this.N && !!this.j && this.j.gain.value == 0
        }
    }
    var Xc = !(!window.AudioContext && !window.webkitAudioContext) && !!window.GainNode;

    function Yc(a, b, c) {
        a.g = b;
        a.H = c
    }

    function cd(a, b) {
        dd(a);
        if (b !== void 0 && a.g) {
            if (a.j[b]) {
                try {
                    a.j[b].node.stop(0)
                } catch (d) {}
                var c = (a.g.currentTime * 1E3 - a.j[b].qd) % a.u;
                delete a.j[b];
                return [c]
            }
            return []
        }
        b = [];
        for (c in a.j) b = b.concat(cd(a, c));
        return b
    }

    function dd(a) {
        if (a.g)
            for (const d in a.j) {
                var b = a,
                    c = a.j[d];
                !c.Uf && b.g !== null && b.g.currentTime * 1E3 > c.qd + b.u && delete a.j[d]
            }
    }

    function ed(a) {
        !a.i && a.g && a.g.createGain && (a.i = a.g.createGain())
    }

    function fd(a, b) {
        if (!b) {
            ed(a);
            if (!a.i) return;
            b = a.i
        }
        a = [b].concat(a.T, a.H);
        for (b = 0; b < a.length - 1; b++) a[b].connect(a[b + 1])
    }

    function gd(a) {
        ed(a);
        a.i && a.g && a.i.gain.setValueAtTime(.01, a.g.currentTime)
    }

    function hd(a, b, c) {
        ed(a);
        a.i && a.g && (a.i.gain.setValueAtTime(a.i.gain.value, a.g.currentTime), a.i.gain.exponentialRampToValueAtTime(b, a.g.currentTime + c))
    }
    var y = class {
        constructor(a, b) {
            this.ha = bd.jc;
            this.v = a;
            this.u = b;
            this.j = {};
            this.o = this.H = this.g = this.i = null;
            this.T = [];
            this.N = 0
        }
        play(a = 0, b = !1, c = 0, d, e = 0, f) {
            if (!this.g || !this.H) return -1;
            dd(this);
            f = f === void 0 ? this.g.currentTime + a / 1E3 : f;
            d || (d = this.g.createBufferSource(), d.playbackRate.setValueAtTime(1, this.g.currentTime));
            ed(this);
            this.o && d.connect(this.o);
            this.i ? (this.o ? this.o.connect(this.i) : d.connect(this.i), fd(this)) : this.o ? fd(this, this.o) : fd(this, d);
            this.o = null;
            d.loop = b;
            try {
                d.buffer = this.ha.N
            } catch (h) {
                return -1
            }
            a =
                this.v / 1E3;
            const g = this.u / 1E3 / d.playbackRate.value;
            b ? (d.loopStart = a + (e ? e / 1E3 : c / 1E3), d.loopEnd = a + g, d.start(f, a + c / 1E3)) : d.start(f, a + c / 1E3, g);
            e = this.N++;
            this.j[e] = {
                node: d,
                qd: f * 1E3 - c,
                Uf: b
            };
            return e
        }
        setPlaybackRate(a, b) {
            dd(this);
            if (b !== void 0) {
                if (this.j[b]) try {
                    this.j[b].node.playbackRate.value = a
                } catch (c) {}
            } else
                for (let c in this.j) this.setPlaybackRate(a, c)
        }
    };
    const id = document.createElement("audio");
    var jd = typeof id.canPlayType === "function" && id.canPlayType("audio/ogg") != "" ? ".ogg" : ".mp3",
        kd = class extends Rb {
            constructor() {
                super("./audio" + jd);
                this.g = this.N = null;
                this.v = 0
            }
            i() {
                if (this.v != 0) return Promise.resolve();
                if (!this.g) return Promise.reject(Error("k"));
                // Звукового файла у игры нет (а на хостинге VK аудиофайлы запрещены), поэтому вместо audio.ogg/audio.mp3
                // создаётся тишина в памяти. Длина покрывает все звуки спрайта (~270 c); низкая частота - чтобы буфер был маленьким.
                let b;
                try {
                    b = this.g.createBuffer(1, 3E3 * 280, 3E3)
                } catch (c) {
                    b = this.g.createBuffer(1, this.g.sampleRate, this.g.sampleRate)
                }
                this.N = b;
                this.v = 3;
                Qb(this);
                return Promise.resolve()
            }
        };

    function ld(a, ...b) {
        for (const [c, d] of b) {
            b = c;
            const e = d,
                f = a.style;
            f && b in f && f.setProperty(b, String(e))
        }
    };
    var pd = a => m(function*() {
        const b = typeof a === "string" ? a : a.value;
        var c;
        if (!(c = yield md(b)))
            if (lb) {
                typeof a === "string" ? (nd || (nd = document.createElement("input"), nd.readOnly = !0, ld(nd, ["position", "absolute"], ["opacity", 0], ["left", 0], ["top", 0], ["pointer-events", "none"]), document.body.appendChild(nd)), nd.value = a, c = nd) : c = a;
                c !== document.activeElement && c.focus();
                const e = c.contentEditable,
                    f = c.readOnly;
                c.contentEditable = "true";
                c.readOnly = !1;
                const g = document.createRange();
                g.selectNodeContents(c);
                const h = window.getSelection();
                h.removeAllRanges();
                h.addRange(g);
                try {
                    c.select(), c.setSelectionRange(0, c.value.length)
                } catch (l) {}
                c.contentEditable = e;
                c.readOnly = f;
                try {
                    var d = lb(document, "copy")
                } catch (l) {
                    d = !1
                }
                window.getSelection().removeAllRanges();
                c.blur();
                nd && (nd.remove(), nd = null);
                c = d
            } else c = !1;
        return c || (yield od()) && (yield md(b)) ? Promise.resolve() : Promise.reject()
    });
    const md = a => m(function*() {
            return navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(a).then(() => !0, () => !1) : !1
        }),
        qd = a => m(function*() {
            switch (a.state) {
                case "granted":
                    return !0;
                case "denied":
                    return !1
            }
            return new Promise(b => {
                a.onchange = () => b(qd(a))
            })
        }),
        od = () => m(function*() {
            return navigator.permissions && navigator.permissions.query ? qd(yield navigator.permissions.query({
                name: "clipboard-write"
            })) : !1
        });
    let nd = null;

    function rd(a, b) {
        a.ya.style.display = b ? "block" : "none"
    }
    var td = class {
        constructor(a, b) {
            this.ya = sd();
            this.ya.style.top = "10px";
            this.ya.style.right = "10px";
            this.ya.style.width = "52px";
            this.ya.style.height = "52px";
            this.ya.style.cursor = "pointer";
            this.ya.style.position = "absolute";
            this.ya.style.pointerEvents = "all";
            this.ya.style.background = "transparent";
            this.ya.style.display = "none";
            this.ya.setAttribute("role", "button");
            this.ya.setAttribute("aria-label", "Close");
            this.ya.tabIndex = 0;
            uc(this.ya, "click", b);
            uc(this.ya, "keydown", c => {
                c.keyCode !== 32 && c.keyCode !== 13 || b()
            });
            a.appendChild(this.ya)
        }
    };
    const sd = () => {
        var a = 52 * (window.devicePixelRatio || 1);
        const b = document.createElement("canvas");
        b.width = a;
        b.height = a;
        const c = b.getContext("2d");
        c.fillStyle = "rgba(0,0,0,.3)";
        c.arc(a / 2, a / 2, a / 2, 0, 2 * Math.PI);
        c.fill();
        c.strokeStyle = "#fff";
        c.lineWidth = a / 52 * 3.5;
        const d = a / 52 * 2;
        c.beginPath();
        c.moveTo(a / 4 + d, a / 4 + d);
        c.lineTo(3 * a / 4 - d, 3 * a / 4 - d);
        c.stroke();
        c.beginPath();
        c.moveTo(3 * a / 4 - d, a / 4 + d);
        c.lineTo(a / 4 + d, 3 * a / 4 - d);
        c.stroke();
        return b
    };
    // Статистика дудла уходила на /gen_204 серверов Google; вне Google она не нужна, поэтому отключена.
    var wd = () => {};

    function xd() {
        const a = document.getElementById("hplogo"),
            b = document.getElementById("ddlDomRoot"),
            c = document.getElementById("ctaRoot"),
            d = document.getElementById("ddlContentRoot");
        if (a === null || b === null || c === null || d === null) throw Error("l");
        return {
            scale: 1,
            orientation: "landscape-primary",
            isFullscreen: !1,
            Kb: !1,
            width: 960,
            height: 540,
            oa: a,
            ka: b,
            Ia: c,
            Ga: d
        }
    };
    class yd {
        constructor() {
            this.g = navigator.userAgent;
            this.url = new ub(location.href)
        }
    }
    var z = new yd;

    function zd() {
        var a;
        if (a = navigator.platform === "MacIntel") a = navigator.maxTouchPoints > 1;
        return a
    }

    function Ad() {
        return z.g.includes("iPad") || z.g.includes("iPhone") || z.g.includes("iPod") || zd()
    }

    function Bd() {
        return z.g.toLowerCase().includes("gsa") || z.g.includes("GoogleApp")
    }

    function Cd() {
        return Bd() && Ad()
    }

    function Dd() {
        return Ad() || z.g.includes("Android") || z.g.includes("Mobile") || z.g.includes("Silk") || z.g.includes("UCBrowser") || z.g.includes("UCWEB")
    }

    function Ed() {
        return document.documentElement.id === "sdoodles"
    }

    function Fd() {
        return z.url.i.includes("/logos/") && z.url.i.includes(".html")
    }

    function Gd() {
        return !!document.getElementById("fkbx") || Hd()
    }

    function Hd() {
        const a = z.url.g.get("ntp");
        return a === "1" || a === "2"
    }

    function Id() {
        return z.url.g.get("fpdoodle") === "1" && !!document.getElementById("fpdoodle")
    }

    function Jd() {
        return !!document.querySelector("body#iframedoodle")
    }

    function Kd() {
        return zd() && !(Ed() && !Dd()) && !Gd() && !Id() && !Fd()
    };
    let Ld;

    function Md() {
        Ld || (Ld = new Nd);
        return Ld.g
    }
    var Nd = class {
        constructor() {
            var a = new URLSearchParams(location.search),
                b, c;
            const d = (c = (b = a.get("hl")) == null ? void 0 : b.toLowerCase()) != null ? c : "ru";
            var e, f;
            b = (f = (e = a.get("gl")) == null ? void 0 : e.toLowerCase()) != null ? f : "us";
            a: {
                switch (a.get("cta")) {
                    case "a":
                        e = 2;
                        break a;
                    case "s":
                        e = 1;
                        break a;
                    case "n":
                        e = 3;
                        break a
                }
                e = void 0
            }
            f = a.get("se") === "1";
            var g;
            c = (g = a.get("ved")) != null ? g : void 0;
            let h;
            g = (h = a.get("sved")) != null ? h : void 0;
            let l;
            a = (l = a.get("ei")) != null ? l : void 0;
            this.g = {
                hl: d,
                gl: b,
                uh: f,
                kd: e,
                xh: c,
                wh: g,
                qh: a
            }
        }
    };

    function Od() {
        const a = Md().kd;
        return a ? a === 2 : !Gd()
    }
    var Pd = () => {
        if (Jd()) throw Error("d");
        return Id() || Fd() || Dd() && !zd()
    };

    function Qd() {
        const a = Md().kd;
        if (a !== void 0) switch (a) {
            case 2:
            case 1:
                return !1;
            case 3:
                return !0;
            default:
                cb(a, void 0)
        }
        return Id() && !Gd() && !(Ad() && !Cd())
    }

    function Rd() {
        // Лайтбокс (серая подложка и кнопка-крестик) отключён: на десктопе игра, как и на телефоне, показывается прямо на странице.
        return !1
    };

    function Sd(a) {
        a.g ? a.g = !1 : (a.u.requestAnimationFrame(() => {
            Sd(a)
        }), a.loop(Date.now()))
    }
    var Td = class {
        constructor(a) {
            var b = window;
            this.H = a;
            this.u = b;
            this.o = 0;
            this.j = this.started = this.g = this.i = !1
        }
        start() {
            this.o = Date.now();
            const a = !this.g && !this.i;
            this.g = !1;
            this.started = this.i = !0;
            this.j = !1;
            a && Sd(this)
        }
        pause() {
            this.i && (this.j = !0, this.i = !1, this.g = !0)
        }
        resume() {
            this.j && this.start()
        }
        loop(a) {
            var b = a - this.o;
            b < 0 || (b = Math.min(b, 50), this.o = a, this.H(b))
        }
    };

    function Ud(a) {
        qa.setTimeout(() => {
            throw a;
        }, 0)
    };

    function Vd(a) {
        return m(function*() {
            return new Promise(b => {
                setTimeout(() => {
                    b(void 0)
                }, a)
            })
        })
    };

    function Wd(a) {
        Qd() ? setTimeout(() => {
            Xd(a)
        }, 300) : (Yd(a), Kd() && z.g.includes("Safari") ? a.j = uc(a.Ia, "click", () => {
            Xd(a)
        }, !0) : a.j = vc(a.Ia, "click", () => {
            Xd(a)
        }, !0))
    }

    function Xd(a) {
        return m(function*() {
            a.N && (yield Zd(a));
            return a.v()
        })
    }

    function Yd(a) {
        Od() && (a.H.start(), a.i && a.o && a.i.classList.add(a.o))
    }

    function Zd(a) {
        return m(function*() {
            if (a.u) return a.u;
            a.Ia.classList.remove(a.g.Pc);
            a.u = Vd(500);
            yield a.u;
            a.i && a.i.remove();
            a.Ia.remove()
        })
    }
    var $d = class {
        constructor(a, b, c, d, e, f = !0) {
            this.i = b;
            this.o = c;
            this.T = d;
            this.v = e;
            this.N = f;
            this.Va = 1;
            this.u = null;
            this.g = {
                lc: "hplogocta",
                Pc: "showCta",
                Ac: "ctaHideDuringLightbox"
            };
            this.Ia = a.Ia;
            this.Ia.classList.add(this.g.lc);
            Qd() || this.Ia.classList.add(this.g.Pc);
            b && (this.Ia.appendChild(b), b.tabIndex = -1, b.ariaHidden = "true");
            this.H = new Td(g => {
                this.T(g)
            });
            Wd(this)
        }
    };
    var ae = RegExp("[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]"),
        be = RegExp("^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*[\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc]"),
        ce = /^http:\/\/.*/,
        de = /\s+/,
        ee = /[\d\u06f0-\u06f9]/;
    var fe = ["Moz", "ms", "O", "webkit"],
        ge = (a, b, c) => {
            if (a) {
                for (const d of fe) a.style[d + b] = c;
                a.style[b.charAt(0).toLowerCase() + b.substr(1)] = c
            }
        },
        he = ["", "moz", "ms", "o", "webkit"],
        ie = (a, b) => {
            if (!a) return null;
            for (const d of he) {
                var c = b;
                d.length > 0 && (c = b.charAt(0).toUpperCase() + b.substr(1));
                c = d + c;
                if (typeof a[c] != "undefined") return c
            }
            return null
        },
        je = () => window.google && window.google.doodle !== void 0 ? window.google.doodle : null,
        ke = (a, b) => {
            const c = je();
            return c && c[a] != void 0 ? c[a] : b
        },
        le = a => {
            je() || (window.google.doodle = {});
            window.google.doodle.pvc = a
        };

    function me(a) {
        return a.indexOf("//") == 0 ? "https:" + a : a
    }

    function ne(a) {
        return me(ke("shortlink", null) || "//www.google.com/?doodle=" + a)
    }
    var oe = () => {
            const a = ke("doodle_args", {}).is_dogfood;
            return a != null ? a : !1
        },
        pe = ke("hl", "ru"),
        qe = ke("gl", ""),
        re = RegExp("^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i").test(pe);
    let se = null,
        te = null,
        ue = null;
    var ve = () => {
            ue || (window.google && window.google.kEI && window.google.kEI.length ? ue = window.google.kEI : Jd() && Lb(z.url.g, "ei") && (ue = z.url.g.get("ei")));
            return ue
        },
        we = () => {
            if (!se) {
                const a = document.getElementById("hplogoved");
                a ? se = a.getAttribute("data-ved") : Jd() && Lb(z.url.g, "ved") && (se = z.url.g.get("ved"))
            }
            return se
        },
        xe = a => `${"./"}${"./".endsWith("/")?"":"/"}${a}`;
    const ye = Ad() && z.g.includes("OS 12_");

    function ze(a, b, c) {
        a.style.position = "absolute";
        a.style.top = "0";
        a.style.left = "0";
        a.style.width = "100%";
        a.style.height = "100%";
        a.style.direction = "ltr";
        a.dataset.width = b.toString();
        a.dataset.height = c.toString()
    }

    function Ae(a, b = !1) {
        const c = a.g.parentElement ? a.g.parentElement.offsetWidth : a.oa.offsetWidth,
            d = a.g.parentElement ? a.g.parentElement.offsetHeight : a.oa.offsetHeight;
        a.j && (window.scrollX === 0 && window.scrollY === 0 || window.scrollTo(0, 0));
        if (c !== a.u || d !== a.o || a.i.isFullscreen !== a.H || b) {
            b = Number(a.g.dataset.width);
            var e = Number(a.g.dataset.height);
            if (Jd()) throw Error("d");
            var f = Pd() && Dd() && (Dd() && !zd() || Ed() && !Dd() || Gd() || Id() || Fd()) && !Cd() && !zd() && a.i.orientation === "landscape-primary" ? b < e !== c < d : !1;
            var g = (a.i.Kb =
                    f) ? Math.min(c / e, d / b) : Math.min(c / b, d / e),
                h = g * b,
                l = g * e;
            a.i.scale = g;
            g = `scale(${g}, ${g})`;
            var n = (h - b) / 2;
            var u = (l - e) / 2;
            var J = f ? Math.abs(c - l) / 2 : Math.abs(c - h) / 2,
                ja = f ? Math.abs(d - h) / 2 : Math.abs(d - l) / 2;
            f ? (f = (h - l) / 2, h = n - f + J, u = u + f + ja, g += "rotate(90deg)") : (h = J + n, u += ja);
            ge(a.g, "TransformOrigin", "center center");
            ge(a.g, "Transform", g);
            ld(a.g, ["position", "absolute"], ["width", `${b}px`], ["height", `${e}px`], ["left", `${h}px`], ["top", `${u}px`]);
            ye && a.j && (b = document.documentElement, e = b.getBoundingClientRect(), e.width === c &&
                e.height === d || ld(b, ["width", `${c}px`], ["height", `${d}px`]));
            a.j && !z.g.includes("CriOS") && c > 0 && document.body.clientWidth !== c && (document.body.clientWidth < document.body.scrollWidth && (document.body.style.width = `${Math.min(document.body.scrollWidth,c)}px`), document.body.clientWidth > c && (document.body.style.width = `${c}px`));
            a.j && ld(a.oa, ["height", "100%"], ["width", "100%"]);
            a.u = c;
            a.o = d;
            a.H = a.i.isFullscreen
        }
    }
    var Be = class {
        constructor(a) {
            this.i = a;
            this.o = this.u = 0;
            this.H = !1;
            this.oa = a.oa;
            this.g = document.querySelector("#uidsdoodle") ? a.oa : a.ka;
            ze(this.g, a.width, a.height);
            this.j = Pd();
            window.addEventListener("resize", () => {
                Ae(this)
            })
        }
        setSize(a, b) {
            this.g.dataset.width = a.toString();
            this.g.dataset.height = b.toString()
        }
    };
    var A = class {};

    function Ce(a, b) {
        const c = b.constructor;
        a.g.set(c, b);
        a.i && a.i && a.i.i.add(c, a);
        return b
    }
    var B = class {
        constructor(...a) {
            this.g = new Map;
            for (const b of a) Ce(this, b)
        }
        get(a) {
            const b = this.g.get(a);
            if (b) return b;
            throw Error("n`" + a);
        }
    };
    const De = new Set;
    var Fe = class {
        constructor() {
            this.g = new Map
        }
        find(a) {
            return Ee(a.map(b => this.g.get(b) || De))
        }
        clear() {
            this.g.clear()
        }
        add(a, b) {
            let c = this.g.get(a);
            c || (c = new Set, this.g.set(a, c));
            c.add(b)
        }
        remove(a, b) {
            let c;
            (c = this.g.get(a)) == null || c.delete(b)
        }
    };

    function Ee(a) {
        if (a.length === 0) return [];
        if (a.length === 1) return Array.from(a[0]);
        const b = [];
        for (const c of a[0]) {
            let d = !0;
            for (let e = 1; e < a.length; e++) a[e].has(c) || (d = !1);
            d && b.push(c)
        }
        return b
    };
    var Ge = class extends A {
            constructor(a) {
                super();
                this.g = a
            }
        },
        He = class extends A {
            constructor(a = []) {
                super();
                this.children = a
            }
        };

    function Ie(a) {
        return (a = a.g.get(He)) ? a.children : []
    };

    function C(a, b) {
        b.i = a;
        var c = a.i;
        for (const d of b.g.keys()) c.add(d, b);
        for (const d of Ie(b)) C(a, d)
    }

    function Je(a, b) {
        b.i = void 0;
        var c = a.i;
        for (const d of b.g.keys()) c.remove(d, b);
        for (const d of Ie(b)) Je(a, d)
    }
    var Ke = class {
        constructor() {
            this.g = [];
            this.i = new Fe
        }
        find(...a) {
            return this.i.find(a)
        }
        update(a) {
            for (const b of this.g) b.update(a)
        }
    };
    var Le = class {
        constructor(a) {
            this.g = a
        }
    };

    function Me(a, b) {
        if (a.length !== 1) throw a = `Expected 1 but found ${a.length}.`, b = b ? `${b} (${a})` : a, Error(b);
        return a[0]
    };
    var Ne = class extends A {
        constructor(a = [], b = !1) {
            super();
            this.actions = a;
            this.jg = b
        }
    };

    function Oe(a, ...b) {
        let c = a.g.get(Ne);
        c || (c = Ce(a, new Ne));
        c.actions.push(...b)
    };
    var Pe = class extends Le {
        update(a) {
            for (const b of this.g.find(Ne)) {
                const {
                    actions: c,
                    jg: d
                } = b.get(Ne);
                for (let e = c.length - 1; e >= 0; e--) c[e].update(a), c[e].state === 2 && c.splice(e, 1);
                c.length === 0 && d && Je(this.g, b)
            }
        }
    };
    var Qe = class extends Qa {
        constructor(a, b, c, d) {
            super(a, b, c);
            this.T = d
        }
        v(a, b, c) {
            this.T.set(Ca(a.x, b.x, c), Ca(a.y, b.y, c))
        }
    };

    function Re(a) {
        let b;
        (b = a.i) == null || Je(b, a);
        for (const c of Ie(a)) Re(c)
    };

    function Se(a, b) {
        a.x = b.x;
        a.y = b.y
    }

    function Te(a, b) {
        a.x *= b;
        a.y *= b;
        return a
    }

    function Ue(a) {
        const b = a.length();
        if (b === 0) throw Error("o");
        a.x /= b;
        a.y /= b;
        a.x = a.x;
        a.y = a.y;
        return a
    }
    var D = class {
            constructor(a = 0, b = 0) {
                this.x = a;
                this.y = b
            }
            set(a, b) {
                this.x = a;
                this.y = b;
                return this
            }
            add(a) {
                this.x += a.x;
                this.y += a.y;
                return this
            }
            sub(a) {
                this.x -= a.x;
                this.y -= a.y;
                return this
            }
            length() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            }
            transform(a) {
                const b = a.b * this.x + a.d * this.y + a.f;
                this.x = a.a * this.x + a.c * this.y + a.e;
                this.y = b;
                return this
            }
            W() {
                return new D(this.x, this.y)
            }
        },
        Ve = class {
            constructor() {
                this.a = 1;
                this.c = this.b = 0;
                this.d = 1;
                this.f = this.e = 0
            }
            identity() {
                this.a = 1;
                this.c = this.b = 0;
                this.d = 1;
                this.f = this.e = 0;
                return this
            }
            set(a,
                b, c, d, e, f) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.e = e;
                this.f = f;
                return this
            }
            W() {
                return (new Ve).set(this.a, this.b, this.c, this.d, this.e, this.f)
            }
        };

    function We(a, b = new Ve) {
        const c = a.scale,
            d = a.position,
            e = Math.sin(a.rotation);
        a = Math.cos(a.rotation);
        return b.set(c.x * a, c.x * e, -c.y * e, c.y * a, d.x, d.y)
    }
    var E = class extends A {
        constructor(a = new D, b = 0, c = new D(1, 1)) {
            super();
            this.position = a;
            this.rotation = b;
            this.scale = c
        }
    };

    function Xe(a, b = new Ve) {
        var c = a;
        for (We(a.get(E), b);;) {
            c = c.g.get(Ge);
            if (!c) break;
            c = c.g;
            var d = c.g.get(E);
            if (!d) break;
            a = b;
            d = We(d, Ye);
            const e = d.b * a.a + d.d * a.b,
                f = d.a * a.c + d.c * a.d,
                g = d.b * a.c + d.d * a.d,
                h = d.a * a.e + d.c * a.f + d.e,
                l = d.b * a.e + d.d * a.f + d.f;
            a.a = d.a * a.a + d.c * a.b;
            a.b = e;
            a.c = f;
            a.d = g;
            a.e = h;
            a.f = l
        }
        return b
    }
    const Ye = new Ve;
    var Ze = class extends A {},
        F = class extends A {
            constructor(a, b = 0, c = 0, d = new D(0, 0), e) {
                super();
                this.Xa = a;
                this.Yb = b;
                this.g = c;
                this.offset = d;
                this.alpha = 1;
                this.i = e !== void 0 ? e : $e++
            }
        },
        $e = 0;

    function af(a, b) {
        return new bf(a.g[cf(b)].g, new D(b[1], b[2]), new D(b[3], b[4]))
    }
    var bf = class {
        constructor(a, b, c) {
            this.j = a;
            this.i = b;
            this.g = c
        }
    };

    function df(a, b, c = !0, d = 12) {
        a = new ef(ff(a, b), c);
        a.framesPerSecond = d;
        return a
    }

    function gf(a, b) {
        const c = df(a, b, !0, 18);
        a = new F(af(a, b[0]));
        return {
            animation: c,
            Ff: a
        }
    }
    var ef = class extends A {
            constructor(a, b = !0) {
                super();
                this.i = a;
                this.index = this.g = 0;
                this.loop = !0;
                this.j = !1;
                this.offset = new D(0, 0);
                this.framesPerSecond = 12;
                this.o = null;
                this.loop = b
            }
            reset() {
                this.g = this.index = 0
            }
        },
        hf = class {
            constructor(a) {
                this.Xa = a
            }
        };

    function ff(a, b) {
        const c = [];
        for (const d of b) c.push(new hf(af(a, d)));
        return c
    };
    let jf;

    function kf(a) {
        if (jf === void 0) throw Error();
        return af(jf, a)
    };

    function lf(a) {
        a.sort((b, c) => {
            b = b.get(F);
            c = c.get(F);
            return b.Yb - c.Yb || b.g - c.g || b.i - c.i
        })
    }

    function mf(a, b = new Ve) {
        a = Me(a.g.find(Ze), "Can't find camera");
        const c = a.get(E);
        c.position.x = -c.position.x;
        c.position.y = -c.position.y;
        c.rotation = -c.rotation;
        Xe(a, b);
        c.position.x = -c.position.x;
        c.position.y = -c.position.y;
        c.rotation = -c.rotation
    }
    var nf = class extends Le {
            constructor(a, b) {
                super(a);
                this.i = b;
                this.j = new Ve;
                this.o = new Ve
            }
            update() {
                const a = this.i;
                a.save();
                a.clearRect(0, 0, a.canvas.width, a.canvas.height);
                mf(this, this.j);
                var b = this.g.find(F);
                lf(b);
                for (const d of b)
                    if (b = d.get(F), b.alpha !== 0) {
                        this.i.globalAlpha = b.alpha;
                        var c = this.j;
                        this.i.setTransform(c.a, c.b, c.c, c.d, c.e, c.f);
                        c = Xe(d, this.o);
                        this.i.transform(c.a, c.b, c.c, c.d, c.e, c.f);
                        this.i.translate(b.offset.x, b.offset.y);
                        b.Xa instanceof bf && (b = b.Xa, this.i.drawImage(b.j, b.i.x, b.i.y, b.g.x,
                            b.g.y, 0, 0, b.g.x, b.g.y))
                    } a.restore()
            }
        },
        of = class extends Le {
            update(a) {
                for (const b of this.g.find(ef)) {
                    const c = b.get(ef),
                        d = c.framesPerSecond === 0 ? Infinity : 1E3 / c.framesPerSecond;
                    let e = c.i[c.index];
                    if (!c.j)
                        for (c.g += a; c.g >= d;) c.index++, c.index >= c.i.length && (c.index = c.loop ? 0 : c.i.length - 1, c.o && c.o()), c.g -= d, e = c.i[c.index];
                    b.get(F).Xa = e.Xa;
                    b.get(F).offset = c.offset
                }
            }
        };

    function pf(a) {
        var b = a.Ga.getBoundingClientRect();
        const c = a.j.Kb ? b.height : b.width;
        b = a.j.Kb ? b.width : b.height;
        const [d, e] = a.getSize();
        a.ta = d / c;
        a.v = e / b
    }
    var qf = class {
        constructor(a) {
            this.j = a;
            this.o = [];
            this.g = this.i = null;
            this.T = this.N = 0;
            this.ha = this.u = !1;
            this.H = [];
            this.v = this.ta = 1;
            this.Ga = this.j.Ga;
            this.Da = [this.Ga];
            uc(window, "resize", () => {
                pf(this)
            });
            a = () => {
                vc(window, "resize", () => {
                    pf(this)
                })
            };
            window.hasOwnProperty("screen") && window.screen.hasOwnProperty("orientation") && !Ad() ? uc(screen.orientation, "change", a) : uc(window, "orientationchange", a);
            pf(this)
        }
        handleEvent(a) {
            pf(this);
            var b = a.kb;
            var c = void 0;
            b = (b = b || window.event) ? (c = c || b.targetTouches && b.targetTouches[0] ||
                b.changedTouches && b.changedTouches[0]) && c.pageX !== void 0 ? [c.pageX, c.pageY] : b.clientX !== void 0 ? [b.clientX + (document.dir == "rtl" ? -1 : 1) * (document.body.scrollLeft || document.documentElement.scrollLeft || 0), b.clientY + (document.body.scrollTop || document.documentElement.scrollTop || 0)] : b.pageX !== void 0 ? [b.pageX, b.pageY] : [0, 0] : [0, 0];
            c = this.Ga.getBoundingClientRect();
            if (this.j.Kb) {
                var d = c.right - b[0];
                b[0] = b[1] - c.top;
                b[1] = d
            } else b[0] -= c.left, b[1] -= c.top;
            b[0] *= this.ta;
            b[1] *= this.v;
            c = b[1];
            this.N = b[0];
            this.T = c;
            a = a.type;
            if (!this.ha || a.indexOf("mouse") !== 0) {
                b = {
                    touchstart: "mousedown",
                    touchend: "mouseup",
                    touchmove: "mousemove"
                };
                a in b && (this.ha = !0, a = b[a]);
                c = a;
                a = this.N;
                b = this.T;
                if (!this.u && c === "mousedown")
                    for (this.u = !0, d = 0; d < this.H.length; d++) this.H[d]();
                if (c === "mousedown") {
                    if (!this.i)
                        for (c = 0; c < this.o.length; c++)
                            if (d = this.o[c], d.i.contains(a, b)) {
                                this.g = this.i = d;
                                d.g("mousedown", a, b);
                                break
                            }
                } else if (c === "mouseup") this.i ? (this.i.g("mouseup", a, b), this.i = null) : this.g && this.g.g("mouseup", a, b);
                else if (c === "mousemove" || c === "areamove") {
                    d =
                        null;
                    for (let e = 0; e < this.o.length; e++) {
                        const f = this.o[e];
                        if (f.i.contains(a, b)) {
                            d = f;
                            break
                        }
                    }
                    this.g !== d && (this.g && this.g.g("mouseout", a, b), d && d.g("mouseover", a, b), this.g = d);
                    if (c === "mousemove")
                        for (this.i && this.i.g("mousemove", a, b), c = 0; c < this.o.length; c++) d = this.o[c], d !== this.i && d.i.contains(a, b) && d.g("mousemove", a, b)
                } else c === "mouseout" ? (this.g && this.g.g("mouseout", a, b), this.g = this.i = null) : c === "contextmenu" && this.g && this.g.g("contextmenu", a, b);
                a = this.g && this.g.i.g() ? "pointer" : "default";
                for (const e of this.Da) e.style.cursor =
                    a
            }
        }
        getSize() {
            return [this.j.width, this.j.height]
        }
    };
    (() => {
        const a = new Sa;
        a.contains = () => !0;
        a.g = () => !1;
        return a
    })();
    const rf = document[ie(document, "exitFullscreen")],
        sf = ie(document, "fullscreenElement"),
        tf = ie(document, "fullscreenEnabled");

    function uf(a) {
        a.i && window.screen.orientation && window.screen.orientation.lock && window.screen.orientation.lock(a.i).catch(() => {})
    }

    function vf(a, b) {
        a.i = b;
        a.g.orientation = b;
        document[sf] && uf(a)
    }
    var xf = class {
        constructor(a) {
            this.g = a;
            this.i = null;
            this.oa = a.oa;
            a = ie(this.oa, "requestFullscreen");
            this.o = this.oa[a];
            a = !(!document[tf] || !rf);
            if (Jd()) throw Error("d");
            if (this.j = (Ad() ? !1 : Id() && !(Cd() || Bd() && !Ad()) || Fd() && Dd()) && a) document.body.style.margin = "0", ld(this.oa, ["overflow", "visible"], ["width", "100%"], ["height", "100%"]), document.body.scrollLeft = 0, uc(window, "scroll", wf, !0)
        }
    };
    const wf = a => {
        a.preventDefault();
        a.stopPropagation();
        return !1
    };

    function yf() {
        let a, b;
        const c = new Promise((d, e) => {
            a = d;
            b = e
        });
        return new zf(c, a, b)
    }

    function Af(a) {
        a.g = !0;
        a.i && (clearTimeout(a.i), a.i = void 0)
    }
    var zf = class {
        constructor(a, b, c) {
            this.promise = a;
            this.o = b;
            this.j = c;
            this.g = !1
        }
        resolve(a) {
            this.g || (Af(this), this.o(a))
        }
        reject(a) {
            this.g || (Af(this), this.j(a))
        }
    };
    let Bf;
    const Cf = {
        jh: "resizeComplete",
        Hg: "hibernate",
        mh: "wake"
    };

    function Df() {
        Bf || (Bf = new Ef);
        return Bf
    }

    function Ff(a) {
        var b = Df();
        uc(b.g, "hibernate", a)
    }

    function Gf(a) {
        var b = Df();
        uc(b.g, "wake", a)
    }
    var Ef = class {
        constructor() {
            Md();
            this.i = a => {
                Object.values(Cf).includes(a.data.cmd) && this.g.dispatchEvent(new CustomEvent(a.data.cmd, a.data))
            };
            this.g = document.createElement("div");
            window.addEventListener("message", this.i)
        }
        destroy() {
            window.removeEventListener("message", this.i);
            var a = this.g;
            if (a)
                if (jc(a)) a.Na && qc(a.Na);
                else if (a = zc(a)) {
                var b = 0;
                for (const c in a.g) {
                    const d = a.g[c].concat();
                    for (let e = 0; e < d.length; ++e) Ec(d[e]) && ++b
                }
            }
        }
    };

    function Hf(a) {
        Sb.call(this);
        this.i = a;
        this.g = {}
    }
    ya(Hf, Sb);
    var If = [];

    function Jf(a, b, c, d, e) {
        Array.isArray(c) || (c && (If[0] = c.toString()), c = If);
        for (let f = 0; f < c.length; f++) {
            const g = uc(b, c[f], d || a.handleEvent, e || !1, a.i || a);
            if (!g) break;
            a.g[g.key] = g
        }
    }

    function Kf(a) {
        mb(a.g, function(b, c) {
            this.g.hasOwnProperty(c) && Ec(b)
        }, a);
        a.g = {}
    }
    Hf.prototype.Wa = function() {
        Hf.rb.Wa.call(this);
        Kf(this)
    };
    Hf.prototype.handleEvent = function() {
        throw Error("p");
    };

    function Lf(a, b, c) {
        new Mf(a, b, c)
    }

    function Nf(a) {
        var b = window.agsa_ext;
        if (!a.ta && !a.o && b && b.getPageVisibility) return b.getPageVisibility() === "hidden";
        b = document[a.o];
        return document[a.ta] || b === "hidden"
    }

    function Of(a) {
        a.N ? Pf(a) : Bd() && !Ad() && Qf(a, () => {
            Pf(a)
        })
    }

    function Rf(a) {
        Jf(a.T, document, "mousedown mouseout touchstart mouseup mousemove touchend touchmove contextmenu keypress keydown keyup".split(" "), () => void Sf(a), !0);
        Jf(a.T, window, ["orientationchange", "resize"], () => void Sf(a), !0)
    }

    function Tf(a) {
        const b = a.g || a.i || a.v;
        a.j && !b ? (a.j = !1, a.Fa(), Uf(a)) : !a.j && b && (a.j = !0, a.Da())
    }

    function Uf(a) {
        a.timeout && clearTimeout(a.timeout);
        a.timeout = setTimeout(() => {
            a.timeout = void 0;
            a.i = Date.now() - a.H >= a.ha;
            a.i || Uf(a);
            Tf(a)
        }, Math.max(100, a.ha - (Date.now() - a.H)))
    }

    function Sf(a) {
        a.H = Date.now();
        a.i = !1;
        Tf(a)
    }

    function Pf(a) {
        a.u = () => {
            a.g = Nf(a);
            a.g ? Tf(a) : Sf(a)
        };
        const b = window.agsa_ext;
        a.N ? document.addEventListener(a.N, a.u, !1) : b && b.registerPageVisibilityListener && (le(() => {
            a.u && a.u()
        }), b.registerPageVisibilityListener("google.doodle.pvc();"))
    }

    function Qf(a, b) {
        window.agsa_ext ? b() : setTimeout(() => {
            Of(a)
        }, 100)
    }
    var Mf = class {
        constructor(a, b, c) {
            this.ha = a;
            this.Da = b;
            this.Fa = c;
            this.i = !1;
            this.u = () => {};
            this.v = !1;
            this.H = Date.now();
            this.ta = ie(document, "hidden");
            this.N = (this.o = ie(document, "visibilityState")) ? this.o.replace(/state$/i, "change").toLowerCase() : null;
            this.j = this.g = Nf(this);
            this.T = new Hf;
            Of(this);
            Rf(this);
            Ff(() => {
                this.v = !0;
                Tf(this)
            });
            Gf(() => {
                this.v = !1;
                Tf(this)
            });
            Uf(this)
        }
    };

    function Vf(a, b) {
        const c = document.createElement("div");
        c.classList.add("lightboxContainer");
        c.classList.add("lightboxBackground");
        a.oa.appendChild(c);
        const d = document.createElement("div");
        d.classList.add("lightboxContentContainer");
        c.appendChild(d);
        b.classList.add("lightboxContent");
        ld(b, ["position", "relative"], ["left", "50%"], ["top", "50%"]);
        d.appendChild(b);
        b = new td(b, () => {
            Wf(a)
        });
        c.appendChild(b.ya);
        window.addEventListener("resize", () => {
            a.i()
        });
        return {
            ya: b,
            ab: c,
            Ub: d
        }
    }

    function Wf(a) {
        m(function*() {
            a.g && (document.body.classList.remove("ddlLightboxNoScroll"), Ec(a.j), a.oa.classList.remove("lightboxMode"), a.ab.classList.remove("lightboxBackground"), a.ab.classList.remove("lightboxEnabled"), a.g = !1, a.u(), rd(a.ya, !1), Dd() || !z.g.includes("Safari") || z.g.includes("Chrome") || (a.oa.style.display = "none", a.oa.offsetWidth, a.oa.style.display = "block"), yield Vd(0))
        })
    }

    function Xf(a) {
        return m(function*() {
            a.g || (yield Vd(0), document.body.classList.add("ddlLightboxNoScroll"), a.oa.classList.add("lightboxMode"), a.ab.classList.add("lightboxBackground"), a.ab.getBoundingClientRect(), a.ab.classList.add("lightboxEnabled"), a.g = !0, a.i(), a.j = uc(document, "keydown", b => {
                b.keyCode === 27 && Wf(a)
            }), rd(a.ya, !0), yield Vd(500))
        })
    }
    var Yf = class {
        constructor(a, b, c, d, e = () => {}, f = () => {}) {
            this.oa = a;
            this.o = b;
            this.i = e;
            this.j = null;
            this.g = !1;
            this.i = e;
            this.u = f;
            const {
                ya: g,
                ab: h,
                Ub: l
            } = Vf(this, b);
            this.ya = g;
            this.ab = h;
            this.Ub = l;
            this.setSize(c, d)
        }
        setSize(a, b) {
            ld(this.Ub, ["max-width", `${a}px`], ["max-height", `${b}px`]);
            ld(this.o, ["width", `${a}px`], ["height", `${b}px`])
        }
    };
    const Zf = [5, 6, 7, 8, 9, 11, 12, 16, 17, 18];
    let $f = 0,
        ag = 0,
        bg = !1,
        G = {},
        cg = [];
    var H = (a, b, c = !1) => {
            G[a] = b;
            c && !cg.includes(a) && cg.push(a)
        },
        I = a => {
            var b = Date.now();
            G.dt = b - ag;
            ag = b;
            a == 0 && ($f = b);
            G.e = a;
            G.t = $f == 0 ? -1 : Math.floor(b - $f);
            G.l = Ed() ? 0 : 1;
            b = [];
            for (var c in G) G.hasOwnProperty(c) && b.push(c + ":" + G[c]);
            c = b.join(",");
            b = a == 10;
            var d = Zf.indexOf(a) >= 0;
            Gd() && (c += "&ntp=1");
            b ? (b = we()) && (c += `&ved=${b}`) : d && (te || ((b = document.getElementById("hplogoshareved")) ? te = b.getAttribute("data-ved") : Jd() && Lb(z.url.g, "sved") && (te = z.url.g.get("sved"))), (b = te) && (c += `&ved=${b}`));
            c.search("&ei=") == -1 && (c +=
                "&ei=", (b = ve()) && (c += b));
            for (window.google && window.google.log ? window.google.log("doodle", c) : wd(c); cg.length > 0;) delete G[cg.pop()];
            bg || a != 0 || Qd() || (bg = !0, I(10))
        };

    function dg(a) {
        I(3);
        var b = ke("url", "");
        a && (b = new ub(b), b.g.set("q", a), b.g.remove("kgmid"), b.g.remove("si"), b = b.toString());
        (a = b) && eg(a, !0)
    }
    var eg = fg;

    function fg(a, b = !1) {
        (b = (b = b && !Cd()) || Hd()) ? hb(a): (b = window.top.location, a = bb(a), a !== void 0 && b.assign(a))
    };
    var gg = a => {
            if (Ad() && (Id() || Fd()))
                for (const b of a) uc(b, "touchmove", c => {
                    c.scale !== 1 && c.preventDefault()
                }, {
                    passive: !1
                })
        },
        hg = a => {
            for (const b of a) uc(b, "contextmenu", c => {
                c.preventDefault()
            }, {
                passive: !1
            })
        };
    let ig = null;

    function jg(a) {
        m(function*() {
            if (a.doodle && z.url.g.get("ddllb") === "1") {
                var b = a.j;
                b.j !== void 0 && b.j !== null && Ec(b.j);
                yield Xd(b)
            }
        })
    }

    function kg(a) {
        return m(function*() {
            if (Kd())
                if (a.g.Ef) fg(a.g.Ef, !1);
                else {
                    var b = a.g.Yc,
                        c = new ub("/");
                    c.g.set("fpdoodle", "1");
                    c.g.set("doodle", String(b));
                    pe && c.g.set("hl", pe);
                    qe && c.g.set("gl", qe);
                    eg(c.toString(), !1)
                }
            else if (!Gd() || Qd()) a.setSize(a.g.width, a.g.height), a.T.start(), a.Fa = !0, a.ta = !0, a.oa.removeAttribute("title"), b = a.doodle, b.Ga.appendChild(b.i), K(b.i.querySelector(".ddl-frame-month"), 30, 120, 30), yield lg(a), I(0), Ae(a.o, !0), b = a.doodle, (c = b.u) != null && (c.isVisible = !1, c.i.pause()), Rd() || (b.u =
                void 0, c = b.o.g, c.j.g[cf(c.g.Oc)].H()), mg(b)
        })
    }

    function ng(a, b) {
        const c = b ? 0 : -1,
            d = b ? "false" : "true";
        for (const e of a.ka.children) e instanceof HTMLElement && (e.tabIndex = c, e.ariaHidden = d);
        a = a.j;
        b = !b;
        a.Ia.tabIndex = b ? 0 : -1;
        a.Ia.ariaHidden = b ? "false" : "true"
    }

    function og(a) {
        gg([document, a.oa, a.ka, a.Ga]);
        hg([a.oa, a.ka, a.Ga]);
        Jf(a.N, a.oa, "touchend", () => {
            var b = a.fullscreen;
            b.j && !document[sf] && (b.o.call(b.oa), uf(b), b.g.isFullscreen = !!document[sf])
        })
    }

    function pg(a) {
        Jf(a.N, a.ka, ["mousedown", "mouseout", "touchstart"], b => {
            a.u.handleEvent(b)
        });
        Jf(a.N, document, ["mouseup", "mousemove", "touchend", "touchmove", "contextmenu"], b => {
            a.u.handleEvent(b)
        })
    }

    function qg(a) {
        for (const b of a.nb) {
            let c, d;
            (d = (c = b).g) == null || d.call(c, a.i)
        }
    }

    function lg(a) {
        return m(function*() {
            if (a.v) return rg(a);
            ng(a, !0);
            pf(a.u)
        })
    }

    function rg(a) {
        return m(function*() {
            a.H = new Yf(a.oa, a.ka, a.g.width, a.g.height, () => {
                Ae(a.o, !0);
                pf(a.u)
            }, () => {
                a.Zb()
            });
            yield sg(a);
            a.ka.addEventListener("click", () => tg(a))
        })
    }

    function ug(a, b) {
        a.ha = b
    }

    function sg(a) {
        return m(function*() {
            var b = a.j;
            b.Va !== 0 && b.Ia.classList.add(b.g.Ac);
            b = a.Da;
            if (b.Va !== 0)
                for (const e of b.ka.children) e.classList.contains(b.g) || e.classList.remove("contentHide");
            a.setSize(a.g.width, a.g.height);
            let c, d;
            (c = a.ha) == null || (d = c.rh) == null || d.call(c);
            ng(a, !0);
            a.oa.removeAttribute("title");
            yield Xf(a.H)
        })
    }

    function tg(a) {
        return m(function*() {
            let b;
            (b = a.H) != null && b.g || (yield sg(a), a.resume())
        })
    }
    var wg = class {
        constructor(a, b, c) {
            this.g = a;
            this.ta = this.Fa = !1;
            this.ha = null;
            this.nb = [];
            Gd() && !Qd() && (a.Qa.wg = !1);
            this.i = xd();
            this.oa = this.i.oa;
            this.La = this.oa.title;
            this.Ga = this.i.Ga;
            this.ka = this.i.ka;
            this.i.width = this.g.width;
            this.i.height = this.g.height;
            (this.v = Rd()) && this.ka.classList.add("domRootLightboxed");
            let d;
            Lf((d = a.Jf) != null ? d : 6E4, () => {
                this.pause()
            }, () => {
                this.ac()
            });
            this.N = new Hf(this);
            this.u = new qf(this.i);
            this.fullscreen = new xf(this.i);
            vf(this.fullscreen, this.g.orientation);
            this.o = new Be(this.i);
            this.ya = new td(this.ka, () => {
                var e = this.fullscreen;
                rf.call(document);
                e.g.isFullscreen = !!document[sf]
            });
            this.ya.ya.classList.add("closeFullscreenBtn");
            this.j = new $d(this.i, this.g.Qa.fg, this.g.Qa.Bf, () => {}, () => kg(this), this.g.Qa.wg !== !1 && !this.v && !Kd());
            this.Da = new vg(this.i.ka, this.j.g.lc, this.g.Qa.Va);
            this.T = new Td(e => {
                this.update(e)
            });
            ng(this, Qd());
            og(this);
            Ae(this.o);
            a = this.i.Ga;
            if (!this.i.oa || !a) throw console.error("Unable to render the Doodle. This is expected during unit tests but may be a cause for concern elsewhere."),
                Error();
            pg(this);
            qg(this);
            this.doodle = new b(this, ...c);
            this.setSize(this.g.Qa.width, this.g.Qa.height);
            Gd() && !Qd() && this.oa.addEventListener("click", () => {
                const e = new URL("https://www.google.com/webhp"),
                    f = e.searchParams;
                f.set("ddllb", "1");
                f.set("doodle", this.g.Yc);
                pe && f.set("hl", pe);
                qe && f.set("gl", qe);
                fg(e.toString(), !0)
            })
        }
        setSize(a, b) {
            this.i.width = a;
            this.i.height = b;
            this.o.setSize(a, b);
            let c;
            (c = this.H) == null || c.setSize(a, b);
            Ae(this.o, !0)
        }
        ac() {
            let a;
            !this.v || ((a = this.H) == null ? 0 : a.g) ? this.resume() : Yd(this.j)
        }
        resume() {
            pf(this.u);
            this.Fa && this.ta ? (Gd() && ig && (Ec(ig), ig = null), this.T.start()) : Yd(this.j);
            this.doodle.ac()
        }
        pause() {
            this.T.pause();
            var a = this.j;
            a.i && a.o && a.i.classList.remove(a.o);
            a.H.pause();
            a = this.doodle;
            a.g && a.g.pause && a.g.pause();
            var b = Wc;
            !b.v && b.g && b.g.suspend();
            b.v = !0;
            let c;
            (c = a.u) == null || c.pause()
        }
        update(a) {
            rd(this.ya, !!document[sf]);
            this.doodle.Oa(a)
        }
        Zb() {
            this.pause();
            ng(this, !1);
            this.oa.setAttribute("title", this.La);
            var a = this.j;
            a.Va !== 0 && (a.Ia.classList.remove(a.g.Ac), Yd(a));
            a = this.Da;
            if (a.Va !== 0)
                for (const d of a.ka.children) d.classList.contains(a.g) ||
                    d.classList.add("contentHide");
            Ae(this.o, !0);
            this.setSize(this.g.Qa.width, this.g.Qa.height);
            let b, c;
            (b = this.ha) == null || (c = b.Zb) == null || c.call(b)
        }
    };
    class vg {
        constructor(a, b, c) {
            this.ka = a;
            this.g = b;
            this.Va = c
        }
    };

    function xg(a) {
        return a instanceof eb ? a : fb(String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"))
    };

    function kb(a, ...b) {
        if (b.length === 0) return $a(a[0]);
        let c = a[0];
        for (let d = 0; d < b.length; d++) c += encodeURIComponent(b[d]) + a[d + 1];
        return $a(c)
    };

    function yg(a, b) {
        b = String(b);
        a.contentType === "application/xhtml+xml" && (b = b.toLowerCase());
        return a.createElement(b)
    }

    function zg() {
        this.g = qa.document || document
    }
    zg.prototype.appendChild = function(a, b) {
        a.appendChild(b)
    };
    zg.prototype.contains = function(a, b) {
        if (!a || !b) return !1;
        if (a.contains && b.nodeType == 1) return a == b || a.contains(b);
        if (typeof a.compareDocumentPosition != "undefined") return a == b || !!(a.compareDocumentPosition(b) & 16);
        for (; b && a != b;) b = b.parentNode;
        return b == a
    };
    var Bg = a => {
            let b, c;
            const d = new Promise((e, f) => {
                b = e;
                c = f
            });
            if (window.WebFontConfig && a) {
                for (const e of a) Ag(e);
                return d
            }
            wa("WebFontConfig.active", b);
            wa("WebFontConfig.inactive", c);
            wa("WebFontConfig.timeout", 6E4);
            wa("WebFontConfig.google.families", a);
            a = yg(document, "SCRIPT");
            jb(a);
            a.type = "text/javascript";
            a.async = !0;
            (document.getElementById("xjsc") || document.body).appendChild(a);
            return d
        },
        Ag = a => {
            a = a.toLowerCase().replace(/ /g, "");
            const b = document.documentElement.classList;
            for (const c of b.values())
                if (c.search(`wf-${a}-w+-active`)) break
        };
    class Cg extends Rb {
        constructor(a) {
            super(a);
            this.g = new Image
        }
        i() {
            if (this.g.src) return Promise.resolve(this.g);
            let a;
            const b = new Promise(d => a = d),
                c = () => {
                    Qb(this);
                    a(this.g)
                };
            this.g.crossOrigin = "Anonymous";
            this.g.decode ? (this.g.src = this.j, this.g.decode().then(c, () => {
                this.g.removeAttribute("crossOrigin");
                this.g.src = this.j;
                this.g.decode().then(c, () => {
                    c()
                })
            })) : (this.g.onload = c, this.g.onerror = () => {
                this.g.removeAttribute("crossOrigin");
                this.g.removeAttribute("onerror");
                this.g.src = this.g.src
            }, this.g.src = this.j);
            (this.g.complete || this.g.readyState == "complete") && c();
            return b
        }
        H() {
            super.H();
            this.g = new Image
        }
    };
    !dc("Android") || fc();
    fc();
    dc("Safari") && (fc() || (ec() ? 0 : dc("Coast")) || (ec() ? 0 : dc("Opera")) || (ec() ? 0 : dc("Edge")) || (ec() ? cc("Microsoft Edge") : dc("Edg/")) || ec() && cc("Opera"));
    var Dg = {},
        Eg = null;
    var Fg = typeof Uint8Array !== "undefined",
        Gg = !gc && typeof btoa === "function";
    var Hg = typeof qa.BigInt === "function" && typeof qa.BigInt(0) === "bigint";
    const Ig = Number.MIN_SAFE_INTEGER.toString(),
        Jg = Hg ? BigInt(Number.MIN_SAFE_INTEGER) : void 0,
        Kg = Number.MAX_SAFE_INTEGER.toString(),
        Lg = Hg ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;

    function Mg(a, b) {
        if (a.length > b.length) return !1;
        if (a.length < b.length || a === b) return !0;
        for (let c = 0; c < a.length; c++) {
            const d = a[c],
                e = b[c];
            if (d > e) return !1;
            if (d < e) return !0
        }
    };
    var Ng = typeof Symbol === "function" && typeof Symbol() === "symbol",
        Og = new Set;

    function Pg(a, b, c = !1, d = !1) {
        a = typeof Symbol === "function" && typeof Symbol() === "symbol" ? d && Symbol.for && a ? Symbol.for(a) : a != null ? Symbol(a) : Symbol() : b;
        c && Og.add(a);
        return a
    }
    var Qg = Pg("jas", void 0, !0, !0),
        Rg = Pg(void 0, "2ex"),
        Sg = Pg(void 0, Symbol(), !0);
    var Tg = Ng ? a => a[Qg] | 0 : a => a.Xb | 0,
        Ug = Ng ? (a, b) => {
            a[Qg] = b
        } : (a, b) => {
            a.Xb !== void 0 ? a.Xb = b : Object.defineProperties(a, {
                Xb: {
                    value: b,
                    configurable: !0,
                    writable: !0,
                    enumerable: !1
                }
            })
        };
    var Vg = {},
        Wg = {};

    function Xg(a) {
        return !(!a || typeof a !== "object" || a.g !== Wg)
    }

    function Yg(a) {
        return a !== null && typeof a === "object" && !Array.isArray(a) && a.constructor === Object
    }

    function Zg(a) {
        return !Array.isArray(a) || a.length ? !1 : Tg(a) & 1 ? !0 : !1
    };
    let $g = void 0;

    function ah(a) {
        switch (typeof a) {
            case "number":
                return isFinite(a) ? a : String(a);
            case "bigint":
                return (Hg ? a >= Jg && a <= Lg : a[0] === "-" ? Mg(a, Ig) : Mg(a, Kg)) ? Number(a) : String(a);
            case "boolean":
                return a ? 1 : 0;
            case "object":
                if (a)
                    if (Array.isArray(a)) {
                        if (Zg(a)) return
                    } else if (Fg && a != null && a instanceof Uint8Array) {
                    if (Gg) {
                        for (var b = "", c = 0, d = a.length - 10240; c < d;) b += String.fromCharCode.apply(null, a.subarray(c, c += 10240));
                        b += String.fromCharCode.apply(null, c ? a.subarray(c) : a);
                        a = btoa(b)
                    } else {
                        b === void 0 && (b = 0);
                        if (!Eg) {
                            Eg = {};
                            c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
                            d = ["+/=", "+/", "-_=", "-_.", "-_"];
                            for (var e = 0; e < 5; e++) {
                                var f = c.concat(d[e].split(""));
                                Dg[e] = f;
                                for (var g = 0; g < f.length; g++) {
                                    var h = f[g];
                                    Eg[h] === void 0 && (Eg[h] = g)
                                }
                            }
                        }
                        b = Dg[b];
                        c = Array(Math.floor(a.length / 3));
                        d = b[64] || "";
                        for (e = f = 0; f < a.length - 2; f += 3) {
                            var l = a[f],
                                n = a[f + 1];
                            h = a[f + 2];
                            g = b[l >> 2];
                            l = b[(l & 3) << 4 | n >> 4];
                            n = b[(n & 15) << 2 | h >> 6];
                            h = b[h & 63];
                            c[e++] = g + l + n + h
                        }
                        g = 0;
                        h = d;
                        switch (a.length - f) {
                            case 2:
                                g = a[f + 1], h = b[(g & 15) << 2] || d;
                            case 1:
                                a = a[f], c[e] = b[a >> 2] + b[(a & 3) << 4 | g >> 4] + h + d
                        }
                        a = c.join("")
                    }
                    return a
                }
        }
        return a
    };

    function bh(a, b, c, d, e) {
        if (a != null) {
            if (Array.isArray(a)) a = Zg(a) ? void 0 : e && Tg(a) & 2 ? a : ch(a, b, c, d !== void 0, e);
            else if (Yg(a)) {
                const f = {};
                for (let g in a) f[g] = bh(a[g], b, c, d, e);
                a = f
            } else a = b(a, d);
            return a
        }
    }

    function ch(a, b, c, d, e) {
        const f = d || c ? Tg(a) : 0,
            g = d ? !!(f & 32) : void 0;
        d = Array.prototype.slice.call(a);
        for (let h = 0; h < d.length; h++) d[h] = bh(d[h], b, c, g, e);
        c && ((a = (b = xa(Sg)) ? a[b] : void 0) && (d[Sg] = Array.prototype.slice.call(a)), c(f, d));
        return d
    }

    function dh(a) {
        return a.nd === Vg ? a.toJSON() : ah(a)
    }

    function eh(a) {
        return ch(a, dh, void 0, void 0, !1)
    };

    function fh(a, b, c, d) {
        if (c === -1) return null;
        const e = c + (b & 512 ? 0 : -1),
            f = a.length - 1;
        if (e >= f && b & 256) return a[f][c];
        if (d && b & 256 && (b = a[f][c], b != null)) {
            if (a[e] != null && Rg != null) {
                var g;
                a = (g = $g) != null ? g : $g = {};
                g = a[Rg] || 0;
                g >= 4 || (a[Rg] = g + 1, g = Error(), g.__closure__error__context__984382 || (g.__closure__error__context__984382 = {}), g.__closure__error__context__984382.severity = "incident", Ud(g))
            }
            return b
        }
        if (e <= f) return a[e]
    }

    function gh(a, b) {
        a = a.g;
        b = fh(a, Tg(a), b);
        b = b == null || typeof b === "string" ? b : void 0;
        return b != null ? b : ""
    };

    function hh(a) {
        return a
    }
    let ih;
    var kh = class {
        constructor(a) {
            a: {
                if (a == null) {
                    var b = 96;
                    a = []
                } else {
                    if (!Array.isArray(a)) throw Error("s");
                    b = Tg(a);
                    if (b & 2048) throw Error("v");
                    if (b & 64) break a;
                    var c = a;
                    b |= 64;
                    var d = c.length;
                    if (d && (--d, Yg(c[d]))) {
                        b |= 256;
                        c = d - (b & 512 ? 0 : -1);
                        if (c >= 1024) throw Error("x");
                        b = b & -33521665 | (c & 1023) << 15
                    }
                }
                Ug(a, b)
            }
            this.g = a
        }
        toJSON() {
            const a = !ih;
            try {
                return a && (ih = eh), jh(this)
            } finally {
                a && (ih = void 0)
            }
        }
        hasExtension(a) {
            if (a.g) {
                var b = a.g;
                a = a.i;
                var c = this.g,
                    d = Tg(c),
                    e = fh(c, d, a, !0);
                var f = d;
                if (e != null && typeof e === "object" && e.nd === Vg) b =
                    e;
                else if (Array.isArray(e)) {
                    var g = Tg(e);
                    let h = g;
                    h === 0 && (h |= f & 32);
                    h |= f & 2;
                    h !== g && Ug(e, h);
                    b = new b(e)
                } else b = void 0;
                b !== e && b != null && (e = d & 512 ? 0 : -1, f = a + e, g = c.length - 1, f >= g && d & 256 ? c[g][a] = b : f <= g ? (c[f] = b, d & 256 && (c = c[g], a in c && delete c[a])) : b !== void 0 && (g = d >> 15 & 1023 || 536870912, a >= g ? b != null && (c[g + e] = {
                    [a]: b
                }, Ug(c, d | 256)) : c[f] = b));
                a = b !== void 0
            } else a = a.g ? a.j(this, a.g, a.i, !0) : a.j(this, a.i, null, !0), a = (a === null ? void 0 : a) !== void 0;
            return a
        }
    };
    kh.prototype.nd = Vg;
    kh.prototype.toString = function() {
        try {
            return ih = hh, jh(this).toString()
        } finally {
            ih = void 0
        }
    };

    function jh(a) {
        var b = a.g;
        a = ih(b);
        {
            b = a !== b;
            let n = a.length;
            if (n) {
                var c = a[n - 1],
                    d = Yg(c);
                d ? n-- : c = void 0;
                var e = a;
                if (d) {
                    b: {
                        var f = c;
                        var g;
                        var h = !1;
                        if (f)
                            for (let u in f)
                                if (isNaN(+u)) {
                                    let J;
                                    ((J = g) != null ? J : g = {})[u] = f[u]
                                } else if (d = f[u], Array.isArray(d) && (Zg(d) || Xg(d) && d.size === 0) && (d = null), d == null && (h = !0), d != null) {
                            let J;
                            ((J = g) != null ? J : g = {})[u] = d
                        }
                        h || (g = f);
                        if (g)
                            for (let u in g) {
                                h = g;
                                break b
                            }
                        h = null
                    }
                    f = h == null ? c != null : h !== c
                }
                for (; n > 0; n--) {
                    g = e[n - 1];
                    if (!(g == null || Zg(g) || Xg(g) && g.size === 0)) break;
                    var l = !0
                }
                if (e !== a || f || l) {
                    if (!b) e =
                        Array.prototype.slice.call(e, 0, n);
                    else if (l || f || h) e.length = n;
                    h && e.push(h)
                }
                l = e
            } else l = a
        }
        return l
    };
    var lh = class extends kh {};
    var nh = () => {
        // Запрос /async/ddllog (служебный лог Google) отключён: вне google.com он всегда отвечает 404.
        return Promise.resolve();
        var a = mh;
        if (we() && ve()) return Promise.resolve();
        a = `_fmt:jspb,doodle:${a},slot:0,` + "type:3,cta:1";
        Gd() && (a += ",ntp:1");
        we() && (a += ",impr:0");
        const b = new Ab;
        b.add("async", a);
        return Nb(new Pb, b, void 0, !1).then(c => {
            c = new lh(c);
            if (!we() && gh(c, 2)) {
                const d = gh(c, 2);
                se = (new ub(d)).g.get("ved", "")
            }!ve() && gh(c, 3) && (ue = gh(c, 3))
        }).catch(() => Promise.resolve())
    };

    function oh(a, b) {
        b = b.getBoundingClientRect();
        const c = b.width > b.height;
        if (b.width === b.height) throw Error("z");
        return c === !1 ? new D((a.pageX - b.x) / (b.width / 540), (a.pageY - b.y) / (b.height / 960)) : c ? new D((b.height - a.pageY + b.y) / (b.height / 540), (a.pageX - b.x) / (b.width / 960)) : new D((a.pageY - b.y) / (b.height / 540), (b.width - a.pageX + b.x) / (b.width / 960))
    };
    var qh = (a, b, c) => {
            if (!ph) return b;
            let d;
            try {
                d = window.localStorage.getItem(a)
            } catch (e) {
                return b
            }
            if (d == null) return b;
            a = JSON.parse(d);
            return c && !c(a) ? b : a
        },
        rh = (a, b) => {
            if (ph) try {
                window.localStorage.setItem(a, JSON.stringify(b))
            } catch (c) {}
            // Копия в хранилище VK: на хостинге VK адрес игры меняется с каждой выкладкой, и localStorage обнуляется (см. vk.js).
            window.loonaVK && window.loonaVK.save(a, JSON.stringify(b))
        },
        ph = !!self.localStorage;
    var sh = {
        ad: ["ca"],
        ae: ["ar", "en", "fa", "hi", "ur"],
        af: ["ps", "fa"],
        ag: ["en"],
        al: ["sq", "en"],
        am: ["hy", "ru"],
        ao: ["pt-PT"],
        ar: ["es-419", "es"],
        as: ["en"],
        at: ["de"],
        au: ["en"],
        az: ["az", "ru"],
        ba: ["bs", "hr", "sr"],
        bd: ["bn", "en"],
        be: ["nl", "de", "en", "fr"],
        bf: ["fr"],
        bg: ["bg"],
        bh: ["ar", "en"],
        bi: ["fr"],
        bj: ["fr"],
        bn: ["ms", "en", "zh-CN"],
        bo: ["es-419", "es"],
        br: ["pt-BR", "en"],
        bs: ["en"],
        bt: ["en"],
        bw: ["tn", "en"],
        by: ["be", "ru"],
        bz: ["en", "es", "es-419"],
        ca: ["en", "fr", "fr-CA"],
        cd: ["fr", "sw"],
        cf: ["fr"],
        cg: ["fr"],
        ch: ["de", "en",
            "fr", "it"
        ],
        ci: ["fr"],
        ck: ["en"],
        cl: ["es-419", "es"],
        cm: ["fr", "en"],
        cn: ["zh-CN"],
        co: ["es-419", "es"],
        cr: ["es-419", "en", "es"],
        cu: ["es-419", "es"],
        cv: ["pt-PT"],
        cy: ["en", "el", "tr"],
        cz: ["cs"],
        de: ["de", "en", "fr"],
        dj: ["fr", "ar", "so"],
        dk: ["da"],
        dm: ["en"],
        "do": ["es-419", "es"],
        dz: ["fr", "ar"],
        ec: ["es-419", "es"],
        ee: ["et", "ru"],
        eg: ["ar", "en"],
        es: ["es", "ca", "en", "eu", "gl"],
        et: ["am", "en", "so"],
        fi: ["fi", "sv"],
        fj: ["en"],
        fr: ["fr"],
        ga: ["fr"],
        ge: ["ka", "en"],
        gg: ["en", "fr"],
        gh: ["en"],
        gi: ["en", "es", "it", "pt-PT"],
        gl: ["da", "en"],
        gm: ["en", "wo"],
        gr: ["el"],
        gt: ["es-419", "es"],
        gy: ["en"],
        hk: ["zh-TW", "en", "zh-CN", "zh-HK"],
        hn: ["es-419", "es"],
        hr: ["hr"],
        ht: ["fr", "en", "ht"],
        hu: ["hu"],
        id: ["id", "en", "nl"],
        ie: ["en-GB", "ga"],
        il: ["iw", "ar", "en"],
        im: ["en"],
        "in": "en bn gu hi kn ml mr ne or pa ta te".split(" "),
        iq: ["ar", "en"],
        is: ["is", "en"],
        it: ["it", "en"],
        je: ["en", "fr"],
        jm: ["en"],
        jo: ["ar", "en"],
        jp: ["ja"],
        ke: ["sw", "en"],
        kg: ["ky", "ru"],
        kh: ["km", "en"],
        ki: ["en"],
        kr: ["ko"],
        kw: ["ar", "en"],
        kz: ["kk", "ru"],
        la: ["lo", "en"],
        lb: ["ar", "en", "fr", "hy"],
        lk: ["en",
            "si", "ta"
        ],
        ls: ["st", "en", "zu"],
        lt: ["lt"],
        lu: ["de", "fr"],
        lv: ["lv", "lt", "ru"],
        ly: ["ar", "en", "it"],
        ma: ["fr", "ar"],
        md: ["ro", "ro-MD", "ru"],
        me: ["sr-ME", "bs", "sr"],
        mg: ["mg", "fr"],
        mk: ["mk"],
        ml: ["fr"],
        mm: ["my", "en"],
        mn: ["mn"],
        mt: ["mt", "en"],
        mu: ["en", "fr"],
        mv: ["en"],
        mw: ["ny", "en"],
        mx: ["es-419", "es"],
        my: ["en", "ms"],
        mz: ["pt-PT", "ny", "sn", "sw"],
        na: ["en", "af", "de"],
        ne: ["fr"],
        ng: ["en"],
        ni: ["es-419", "en", "es"],
        nl: ["nl", "en"],
        no: ["no", "nn"],
        np: ["ne", "en"],
        nr: ["en"],
        nu: ["en"],
        nz: ["en-GB"],
        om: ["ar", "en"],
        pa: ["es-419",
            "en", "es"
        ],
        pe: ["es-419", "es"],
        pg: ["en"],
        ph: ["en"],
        pk: ["en", "pa", "ur"],
        pl: ["pl"],
        pn: ["en"],
        pr: ["es-419", "en", "es"],
        ps: ["ar", "en"],
        pt: ["pt-PT"],
        py: ["es-419", "es"],
        qa: ["ar", "en"],
        ro: ["ro", "de", "hu"],
        rs: ["sr", "sr-Latn"],
        ru: ["ru"],
        rw: ["en", "fr", "sw"],
        sa: ["ar", "en"],
        sb: ["en"],
        sc: ["crs", "en", "fr"],
        se: ["sv"],
        sg: ["en", "ms", "ta", "zh-CN"],
        si: ["sl"],
        sk: ["sk", "hu"],
        sl: ["en"],
        sm: ["it"],
        sn: ["fr", "wo"],
        so: ["so", "ar", "en"],
        sr: ["nl", "en"],
        st: ["pt-PT"],
        sv: ["es-419", "es"],
        td: ["fr", "ar"],
        tg: ["fr"],
        th: ["th", "en"],
        tj: ["tg",
            "ru"
        ],
        tl: ["pt-PT", "en", "id"],
        tm: ["tk", "ru", "uz"],
        tn: ["ar", "fr"],
        to: ["en"],
        tr: ["tr"],
        tt: "en es es-419 fr hi zh-TW".split(" "),
        tw: ["zh-TW", "en"],
        tz: ["sw", "en"],
        ua: ["uk", "ru"],
        ug: ["en"],
        uk: ["en-GB"],
        us: ["en", "es", "es-419", "zh-CN"],
        uy: ["es-419", "es"],
        uz: ["uz", "ru"],
        vc: ["en"],
        ve: ["es-419", "es"],
        vi: ["en"],
        vn: ["vi", "en", "fr", "zh-TW"],
        vu: ["en", "fr"],
        ws: ["en"],
        za: ["en", "af", "st", "tn", "zu"],
        zm: ["en", "ny", "sn"],
        zw: ["en", "ny", "sn", "tn", "zu"]
    };
    let th = null;

    function uh() {
        th || (th = new vh);
        return th
    }

    function wh(a, b, c, d) {
        const e = `${b}-${c}`;
        if (d.includes(e)) return a.hl = b, e;
        if (b && d.includes(b)) return a.hl = b;
        if (c && sh[c])
            for (const f of sh[c])
                if (d.includes(f)) return a.hl = f, a.hl;
        return d.includes("en") ? (a.hl = "en", a.hl) : a.hl = null
    }

    function xh(a, b) {
        if (!a.Ka) throw Error("A");
        a = a.Ka[b] === void 0 ? "" : a.Ka[b];
        let c = b = 0,
            d = !1;
        const e = a.split(de);
        for (let f = 0; f < e.length; f++) {
            const g = e[f];
            be.test(g) ? (b++, c++) : ce.test(g) ? d = !0 : ae.test(g) ? c++ : ee.test(g) && (d = !0)
        }
        b = c == 0 ? d ? 1 : 0 : b / c > .4 ? -1 : 1;
        return b === 1 ? "\u202a" + a + "\u202c" : b === -1 ? "\u202b" + a + "\u202c" : a
    }

    function yh() {
        var a = uh();
        return a.Ka !== void 0 && a.Ka.share_msg2 !== void 0
    }
    const ruMessages = {
        "intro_01_jan2": "Наступил январь, и над горизонтом снова восходит Луна.",
        "intro_02": "Она бросает вызов каждому, кто решится сыграть с ней в игру лунных фаз.",
        "intro_03": "Собирайте комбинации из фаз, окрашивайте карты в свой цвет и набирайте очки.",
        "intro_04": "Ваш ход!",
        "skip": "Пропустить",
        "loading": "Загрузка...",
        "jan": "Январь",
        "october": "Октябрь",
        "november": "Ноябрь",
        "december": "Декабрь",
        "february": "Февраль",
        "march": "Март",
        "tutorial_01": "Сыграйте с Луной! Выкладывайте карты по очереди и составляйте комбинации из лунных фаз.",
        "tutorial_02": "Это растущий серп — одна из восьми фаз Луны.",
        "tutorial_03": "Положите такую же фазу на соседнюю клетку, чтобы составить пару.",
        "tutorial_04": "Пара одинаковых фаз приносит 1 очко.",
        "tutorial_05": "Это последняя четверть. Противоположная ей фаза — первая четверть.",
        "tutorial_06": "Положите первую четверть рядом: вместе они складываются в полнолуние.",
        "tutorial_07": "Полнолуние приносит 2 очка.",
        "tutorial_08": "Фазы, идущие подряд, образуют лунный цикл.",
        "tutorial_09": "Положите убывающий серп между ними, чтобы замкнуть цикл.",
        "tutorial_10": "Лунный цикл приносит по 1 очку за каждую карту.",
        "tutorial_11": "Одна карта может войти сразу в несколько комбинаций.",
        "tutorial_12": "Попробуйте составить несколько комбинаций одним ходом.",
        "tutorial_13": "Положите полнолуние на отмеченную клетку.",
        "tutorial_14": "Карты из ваших комбинаций окрашиваются в ваш цвет.",
        "tutorial_15": "В конце игры каждая карта вашего цвета на поле приносит бонусное очко.",
        "landingpage_rules": "Правила всегда можно открыть снова с помощью этой кнопки.",
        "rules_title": "Правила",
        "rules_instruction1": "По очереди с Луной выкладывайте карты на поле.",
        "rules_instruction2": "Составляйте комбинации с соседними картами, чтобы набирать очки и окрашивать карты в свой цвет.",
        "rules_match": "Комбинации",
        "rules_phasepair_title": "Пара фаз",
        "rules_phasepair_points": "1 очко",
        "rules_fullmoon_title": "Полнолуние",
        "rules_fullmoon_points": "2 очка",
        "rules_cycle_title": "Лунный цикл",
        "rules_cycle_points": "1 очко за карту",
        "bonus_title": "Бонус",
        "bonus_instruction": "В конце игры каждая карта вашего цвета на поле приносит +1 очко.",
        "gameplay_phasepair": "Пара фаз!",
        "gameplay_fullmoonpair": "Полнолуние!",
        "gameplay_lunarcycle_3": "Лунный цикл из 3 фаз!",
        "gameplay_lunarcycle_4": "Лунный цикл из 4 фаз!",
        "gameplay_lunarcycle_5": "Лунный цикл из 5 фаз!",
        "gameplay_lunarcycle_6": "Лунный цикл из 6 фаз!",
        "gameplay_lunarcycle_7": "Лунный цикл из 7 фаз!",
        "gameplay_lunarcycle_8": "Полный лунный цикл из 8 фаз!",
        "gameplay_bonuspoints": "Бонусные очки!",
        "new_moon": "Новолуние",
        "waxing_crescent": "Растущий серп",
        "first_quarter": "Первая четверть",
        "waxing_gibbous": "Растущая Луна",
        "full_moon": "Полнолуние",
        "waning_gibbous": "Убывающая Луна",
        "third_quarter": "Последняя четверть",
        "waning_crescent": "Убывающий серп",
        "wildcardintro2": "У вас появилась особая карта!",
        "wildcardintro3": "Нажмите на неё, чтобы узнать, что она умеет.",
        "wildcard_finish": "Сила особой карты применена!",
        "wildcard_warning": "Сыграть эту карту?",
        "win_subtitle": "Особая карта",
        "play": "Играть",
        "cancel": "Отмена",
        "learn_more": "Подробнее",
        "continue": "Продолжить",
        "wc_jan_aquarius_name": "Водолей",
        "wc_jan_aquarius_mechanic": "В конце игры вы получаете 10 бонусных очков.",
        "wc_jan_aquarius_popup1": "Водолей приносит вам 10 бонусных очков!",
        "wc_jan_aquarius_description": "Водолей — одно из зодиакальных созвездий. С древности его изображают человеком, льющим воду из кувшина.",
        "wc_jan_aquarius_query": "созвездие Водолей",
        "wc_jan_lightvenus_name": "Свет Венеры",
        "wc_jan_lightvenus_mechanic": "В конце игры ваши бонусные очки удваиваются.",
        "wc_jan_lightvenus_popup1": "Свет Венеры удвоит ваши бонусные очки!",
        "wc_jan_lightvenus_description": "Венера — самый яркий объект ночного неба после Луны. Её часто называют утренней или вечерней звездой.",
        "wc_jan_lightvenus_query": "планета Венера",
        "wc_jan_moonapogee_name": "Апогей Луны",
        "wc_jan_moonapogee_mechanic": "До конца игры каждая комбинация Луны приносит ей только 1 очко.",
        "wc_jan_moonapogee_popup1": "Луна в апогее: теперь её комбинации приносят лишь 1 очко!",
        "wc_jan_moonapogee_description": "Апогей — точка орбиты, в которой Луна дальше всего от Земли. В это время она кажется чуть меньше и тусклее.",
        "wc_jan_moonapogee_query": "апогей Луны",
        "wc_jan_wolfmoon_name": "Волчья Луна",
        "wc_jan_wolfmoon_mechanic": "Выберите группу карт Луны и заберите её себе.",
        "wc_jan_wolfmoon_popup1": "Волчья Луна: выберите карту Луны, чтобы забрать всю её группу!",
        "wc_jan_wolfmoon_description": "Волчьей Луной называют первое полнолуние года. Считается, что в январские ночи особенно часто слышен вой волков.",
        "wc_jan_wolfmoon_query": "Волчья Луна",
        "leveltitle": "Уровень %NUMBER%",
        "results_matchstars": "Звёзды за матч",
        "results_totalstars": "Всего звёзд",
        "results_win": "Победа!",
        "lose_title": "Луна победила",
        "tie_subtitle": "Ничья!",
        "progress_title": "Побеждайте Луну, чтобы получать звёзды и открывать особые карты.",
        "win_keeplaying_02": "Продолжайте играть, чтобы открыть новые особые карты!",
        "win_keeplaying_03": "Все особые карты открыты! Продолжайте играть и копите звёзды.",
        "playagain": "Играть снова",
        "try_again": "Попробовать снова",
        "search": "Поиск",
        "search_query": "фазы Луны",
        "share": "Поделиться",
        "share_msg": "Я играю с Луной в игру лунных фаз в дудле Google!",
        "share_msg2": "Играю с Луной в дудле Google! Уровень {{LEVEL}}, очки: {{SCORE}}\n{{STARS}}\n{{WILDCARDS}}\n{{LINK}}",
        "share_modal_share": "Поделиться",
        "share_modal_button_close": "Закрыть",
        "share_modal_label_facebook": "Facebook",
        "share_modal_button_facebook": "Поделиться в Facebook",
        "share_modal_label_twitter": "X",
        "share_modal_button_twitter": "Поделиться в X",
        "share_modal_click_link": "Нажмите на ссылку, чтобы скопировать её",
        "share_modal_button_copied": "Ссылка скопирована",
        "mute_button_mute": "Выключить звук",
        "mute_button_unmute": "Включить звук"
};
    var vh = class {
        constructor() {
            this.hl = null
        }
        load(a, b, c, d) {
            this.hl = "ru";
            this.Ka = Object.assign({}, ruMessages);
            return Promise.resolve();
            a = wh(this, a, b, c);
            if (a == null) return Promise.resolve();
            const e = `${d}messages.${a}.nocache.json`,
                f = new Jc;
            f.ta = "text";
            return new Promise((g, h) => {
                xc(f, "success", () => {
                    try {
                        var l = f.g ? f.g.responseText : ""
                    } catch (n) {
                        l = ""
                    }
                    this.Ka = JSON.parse(l.substring(5));
                    g()
                });
                xc(f, "error", h);
                Mc(f, e)
            })
        }
    };
    var zh = {},
        Ah = {};

    function Bh() {
        throw Error("B");
    }
    Bh.prototype.hd = null;
    Bh.prototype.toString = function() {
        return this.Qb
    };
    Bh.prototype.vd = function() {
        if (this.Fb !== zh) throw Error("C");
        return fb(this.toString())
    };

    function Ch() {
        Bh.call(this)
    }
    ya(Ch, Bh);
    Ch.prototype.Fb = zh;

    function Dh(a) {
        if (a != null) switch (a.hd) {
            case 1:
                return 1;
            case -1:
                return -1;
            case 0:
                return 0
        }
        return null
    }

    function L(a) {
        return a != null && a.Fb === zh ? a : a instanceof eb ? M(gb(a).toString()) : M(String(String(a)).replace(Eh, Fh), Dh(a))
    }
    var M = function(a) {
        function b(c) {
            this.Qb = c
        }
        b.prototype = a.prototype;
        return function(c, d) {
            c = new b(String(c));
            d !== void 0 && (c.hd = d);
            return c
        }
    }(Ch);

    function Gh(a) {
        let b = String(a);
        a == null ? (a = "_", b = "null") : a = typeof a === "number" ? "#" : ":";
        return `${b.length}${a}${b}`
    }

    function Hh(a) {
        return Ih(String(a), () => "").replace(Jh, "&lt;")
    }
    const Kh = RegExp.prototype.hasOwnProperty("sticky"),
        Lh = new RegExp((Kh ? "" : "^") + "(?:!|/?([a-zA-Z][a-zA-Z0-9:-]*))", Kh ? "gy" : "g");

    function Ih(a, b) {
        const c = [],
            d = a.length;
        let e = 0,
            f = [],
            g, h, l = 0;
        for (; l < d;) {
            switch (e) {
                case 0:
                    var n = a.indexOf("<", l);
                    if (n < 0) {
                        if (c.length === 0) return a;
                        c.push(a.substring(l));
                        l = d
                    } else c.push(a.substring(l, n)), h = n, l = n + 1, Kh ? (Lh.lastIndex = l, n = Lh.exec(a)) : (Lh.lastIndex = 0, n = Lh.exec(a.substring(l))), n ? (f = ["<", n[0]], g = n[1], e = 1, l += n[0].length) : c.push("<");
                    break;
                case 1:
                    n = a.charAt(l++);
                    switch (n) {
                        case "'":
                        case '"':
                            let u = a.indexOf(n, l);
                            u < 0 ? l = d : (f.push(n, a.substring(l, u + 1)), l = u + 1);
                            break;
                        case ">":
                            f.push(n);
                            c.push(b(f.join(""),
                                g));
                            e = 0;
                            f = [];
                            h = g = null;
                            break;
                        default:
                            f.push(n)
                    }
                    break;
                default:
                    throw Error();
            }
            e === 1 && l >= d && (l = h + 1, c.push("<"), e = 0, f = [], h = g = null)
        }
        return c.join("")
    }

    function Mh(a, b) {
        a = a.replace(/<\//g, "<\\/").replace(/\]\]>/g, "]]\\>");
        return b ? a.replace(/{/g, " \\{").replace(/}/g, " \\}").replace(/\/\*/g, "/ *").replace(/\\$/, "\\ ") : a
    }

    function N(a) {
        return a != null && a.Fb === zh ? String(Hh(a.Qb)).replace(Nh, Fh) : String(a).replace(Eh, Fh)
    }

    function Oh(a) {
        return a != null && a.Fb === Ah ? Mh(a.Qb, !1) : a == null ? "" : Mh(String(a), !0)
    }
    const Ph = {
        "\x00": "&#0;",
        "\t": "&#9;",
        "\n": "&#10;",
        "\v": "&#11;",
        "\f": "&#12;",
        "\r": "&#13;",
        " ": "&#32;",
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#39;",
        "-": "&#45;",
        "/": "&#47;",
        "<": "&lt;",
        "=": "&#61;",
        ">": "&gt;",
        "`": "&#96;",
        "\u0085": "&#133;",
        "\u00a0": "&#160;",
        "\u2028": "&#8232;",
        "\u2029": "&#8233;"
    };

    function Fh(a) {
        return Ph[a]
    }
    const Qh = {
        "\x00": "\\0 ",
        "\b": "\\8 ",
        "\t": "\\9 ",
        "\n": "\\a ",
        "\v": "\\b ",
        "\f": "\\c ",
        "\r": "\\d ",
        '"': "\\22 ",
        "&": "\\26 ",
        "'": "\\27 ",
        "(": "\\28 ",
        ")": "\\29 ",
        "*": "\\2a ",
        "/": "\\2f ",
        ":": "\\3a ",
        ";": "\\3b ",
        "<": "\\3c ",
        "=": "\\3d ",
        ">": "\\3e ",
        "@": "\\40 ",
        "\\": "\\5c ",
        "{": "\\7b ",
        "}": "\\7d ",
        "\u0085": "\\85 ",
        "\u00a0": "\\a0 ",
        "\u2028": "\\2028 ",
        "\u2029": "\\2029 "
    };

    function Rh(a) {
        return Qh[a]
    }
    const Eh = /[\x00\x22\x26\x27\x3c\x3e]/g,
        Nh = /[\x00\x22\x27\x3c\x3e]/g,
        Sh = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g,
        Th = /^[a-zA-Z0-9+\/_-]+={0,2}$/;

    function Uh(a) {
        a = String(a);
        return Th.test(a) ? a : "zSoyz"
    }
    const Jh = /</g;
    /*
     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    function Vh(a, b) {
        var c = Ba || (Ba = new zg);
        if ((a = a(b || Wh, void 0)) && a.g) return a.g();
        a = Xh(a);
        b = c.g;
        c = yg(b, "DIV");
        if (c.nodeType === 1 && /^(script|style)$/i.test(c.tagName)) throw Error("d");
        c.innerHTML = gb(a);
        if (c.childNodes.length == 1) c = c.removeChild(c.firstChild);
        else {
            for (a = b.createDocumentFragment(); c.firstChild;) a.appendChild(c.firstChild);
            c = a
        }
        return c
    }

    function O(a, b) {
        b = a(b || Wh, void 0);
        a = Ba || (Ba = new zg);
        b && b.g ? a = b.g() : (a = yg(a.g, "DIV"), b = Xh(b), a.innerHTML = gb(b));
        a.childNodes.length == 1 && (b = a.firstChild, b.nodeType == 1 && (a = b));
        return a
    }

    function Xh(a) {
        return sa(a) ? a.vd && (a = a.vd(), a instanceof eb) ? a : xg("zSoyz") : xg(String(a))
    }
    const Wh = {};

    function Yh(a) {
        a = a || {};
        var b = a.xg;
        a = M;
        b = '<button class="' + N("ddl-mute-button") + '"' + (b != null ? " ssk='" + N(Gh("xBJMqe") + b) + "'" : "") + '><div class="' + N("ddl-mute-button-mute-icon") + '">';
        var c = M('<svg height="100%" viewBox="0 96 960 960" width="100%"><path d="M560 925v-68.666q94.667-27.334 154-105Q773.334 673.667 773.334 575t-59-176.667q-59.001-78-154.334-104.667V225q124 28 202 125.5T840 575q0 127-78 224.5T560 925ZM120 696V456h160l200-200v640L280 696H120Zm426.666 45.333v-332Q599 428 629.5 474T660 576q0 55-30.833 100.833-30.834 45.834-82.501 64.5Z"/></svg>');
        b = b + c + '</div><div class="' + N("ddl-mute-button-unmute-icon") + '">';
        c = M('<svg height="100%" viewBox="0 96 960 960" width="100%"><path d="m612.667 734-47.334-47.333 110.667-110-110.667-110 47.334-47.334 110 110.667 110-110.667L880 466.667l-110.667 110 110.667 110L832.667 734l-110-110.667-110 110.667ZM120 696V456h160l200-200v640L280 696H120Z"/></svg>');
        return a(b + c + "</div></button>")
    };
    const Zh = uh();
    var $h = class {
        constructor() {
            this.audio = Wc;
            this.g = O(Yh);
            this.j = this.g.querySelector(".ddl-mute-button-mute-icon");
            this.o = this.g.querySelector(".ddl-mute-button-unmute-icon");
            this.i = [];
            this.g.addEventListener("click", a => {
                a.stopPropagation();
                if (a = this.isMuted()) {
                    var b = this.audio;
                    b.j && b.g && b.j.gain.setValueAtTime(1, b.g.currentTime);
                    b.N = !1
                } else b = this.audio, b.j && b.g && b.j.gain.setValueAtTime(0, b.g.currentTime), b.N = !0;
                this.update(!a);
                for (const c of this.i) c(!a)
            });
            Zc(this.audio, () => {
                this.update(this.isMuted())
            });
            this.update(this.isMuted())
        }
        isMuted() {
            return !this.audio.g ||
                !this.audio.H || this.audio.isMuted()
        }
        update(a) {
            const b = a ? this.o : this.j;
            (a ? this.j : this.o).style.display = "none";
            b.style.display = "";
            this.g.title = xh(Zh, a ? "mute_button_unmute" : "mute_button_mute")
        }
        addListener(a) {
            this.i.push(a)
        }
    };

    function ai(a) {
        return new Promise(b => {
            setTimeout(b, a)
        })
    };

    function bi(a) {
        const b = a.Nf,
            c = a.Kf,
            d = a.Lf,
            e = a.Mf,
            f = a.Of,
            g = a.Pf,
            h = a.vg,
            l = a.If;
        a = a.Sf;
        return M('<div class="' + N("ddl-share-modal") + '"><div class="' + N("ddl-modal-overlay") + '"></div><div class="' + N("ddl-modal-dialog") + '" role="dialog" aria-modal="true" aria-label="' + N(b) + '"><div class="' + N("ddl-modal-header") + '"><div class="' + N("ddl-modal-header-text") + '">' + L(b) + '</div><button class="' + N("ddl-modal-close") + '" title="' + N(c) + '">' + M('<div class="' + N("ddl-modal-close-icon") + '"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#444746"/></svg></div>') +
            '</button></div><div class="' + N("ddl-modal-content") + '"><div class="' + N("ddl-modal-buttons") + '"><div class="' + N("ddl-modal-button-container") + '"><button class="' + N("ddl-share-facebook") + '" title="' + N(e) + '">' + M('<div class="' + N("ddl-share-facebook-icon") + '"><svg width="19" height="35" viewBox="0 0 19 35"><path d="M5.81384 35V19.6874H0.25V13.3532H5.81384V8.52552C5.81384 3.03358 9.08538 0 14.0907 0C16.4874 0 18.9959 0.427988 18.9959 0.427988V5.82064H16.2328C13.5108 5.82064 12.6617 7.5099 12.6617 9.24454V13.3532H18.7391L17.7675 19.6874H12.6617V35H5.81384Z" fill="#fff"/></svg></div>') +
            '</button><div class="' + N("ddl-modal-button-label") + '" aria-hidden="true">' + L(d) + '</div></div><div class="' + N("ddl-modal-button-container") + '"><button class="' + N("ddl-share-twitter") + '" title="' + N(g) + '">' + M('<div class="' + N("ddl-share-twitter-icon") + '"><svg width="32" height="32" viewBox="0 0 32 33"><path d="M19.0443 13.731L30.9571 0H28.1341L17.7903 11.9224L9.52875 0H0L12.4931 18.0288L0 32.4278H2.82309L13.7464 19.8373L22.4713 32.4278H32L19.0437 13.731H19.0443ZM15.1777 18.1876L13.9119 16.3924L3.84029 2.10729H8.1764L16.3043 13.6358L17.5701 15.431L28.1355 30.4163H23.7994L15.1777 18.1883V18.1876Z" fill="#fff"/></svg></div>') +
            '</button><div class="' + N("ddl-modal-button-label") + '" aria-hidden="true">' + L(f) + '</div></div></div><div class="' + N("ddl-modal-copy-link-container") + '"><button class="' + N("ddl-modal-copy-link") + '" aria-label="' + N(l) + '">' + M('<div class="' + N("ddl-modal-copy-link-icon") + '" aria-hidden="true"><svg width="48" height="48" viewBox="0 0 48 48"><path d="M23 27H19C17.35 27 16 25.65 16 24C16 22.35 17.35 21 19 21H23V19H19C16.24 19 14 21.24 14 24C14 26.76 16.24 29 19 29H23V27ZM29 19H25V21H29C30.65 21 32 22.35 32 24C32 25.65 30.65 27 29 27H25V29H29C31.76 29 34 26.76 34 24C34 21.24 31.76 19 29 19ZM28 23H20V25H28V23Z"/></svg></div>') +
            '<div class="' + N("ddl-modal-share-link") + '">' + L(h) + '</div></button><div class="' + N("ddl-modal-help-text") + '" aria-hidden="true">' + L(l) + '</div></div></div><div class="' + N("ddl-modal-snack-bar") + '" role="alert">' + L(a) + "</div></div></div>")
    };
    var ci = (a, b) => {
            oe() || (I(9), a = a.indexOf("//") == 0 ? "https:" + a : a, window.location = "http://www.google.com/doodles/_SHARE?description=" + encodeURIComponent(b) + "&url=" + encodeURIComponent(a))
        },
        di = () => window.agsa_ext != null && window.agsa_ext.share != null,
        ei = (a, b) => {
            !oe() && di() && (I(15), window.agsa_ext.share(b + " " + a, null))
        },
        fi = (a, b, c = null) => {
            if (Dd() && navigator.share) try {
                navigator.share({
                    text: b,
                    url: a
                }).then(() => {
                    I(17)
                })
            } catch (d) {
                d instanceof DOMException && d.name === "AbortError" || (Cd() && !Fd() ? ci(a, b) : di() ? ei(a, b) : c())
            } else Cd() &&
                !Fd() ? ci(a, b) : di() ? ei(a, b) : c()
        },
        gi = a => m(function*() {
            if (oe()) return Promise.reject();
            I(16);
            return pd(a)
        });
    var hi = ["Google Sans", "Google Sans Text"];
    const ii = uh();

    function ji(a, b, c) {
        let d;
        (d = a.querySelector(`.${b}`)) == null || d.addEventListener("click", c)
    }

    function ki(a, b) {
        m(function*() {
            yield gi(b);
            a.i.focus();
            const c = a.g.querySelector(".ddl-modal-dialog");
            c.classList.add("ddl-with-snack-bar", "ddl-link-copied");
            yield ai(2400);
            c.classList.remove("ddl-link-copied");
            yield ai(400);
            c.classList.remove("ddl-with-snack-bar")
        })
    }
    var li = class {
        constructor(a, b, c, d, e = () => {}, f = () => {}) {
            this.oa = a;
            this.o = e;
            this.j = f;
            this.g = O(bi, {
                Nf: xh(ii, "share_modal_share"),
                Kf: xh(ii, "share_modal_button_close"),
                Lf: xh(ii, "share_modal_label_facebook"),
                Mf: xh(ii, "share_modal_button_facebook"),
                Of: xh(ii, "share_modal_label_twitter"),
                Pf: xh(ii, "share_modal_button_twitter"),
                vg: c,
                If: xh(ii, "share_modal_click_link"),
                Sf: xh(ii, "share_modal_button_copied")
            });
            this.i = this.g.querySelector(".ddl-modal-copy-link");
            ji(this.g, "ddl-modal-close", () => {
                this.close()
            });
            ji(this.g,
                "ddl-modal-overlay", () => {
                    this.close()
                });
            ji(this.g, "ddl-share-facebook", () => {
                var g = me(ke("facebook_link", null) || ne(d));
                if (!oe()) {
                    g = g.indexOf("//") == 0 ? "https:" + g : g;
                    var h = {
                        app_id: "738026486351791",
                        href: g,
                        hashtag: "#GoogleDoodle"
                    };
                    g = new Ab;
                    for (var l in h) g.add(l, h[l]);
                    l = new ub("https://www.facebook.com/dialog/share");
                    xb(l, g);
                    hb(l.toString());
                    I(5)
                }
            });
            ji(this.g, "ddl-share-twitter", () => {
                var g = me(ke("twitter_link", null) || ne(d));
                oe() || (g = g.indexOf("//") == 0 ? "https:" + g : g, g = "text=" + encodeURIComponent(b + "\n" + g),
                    hb("http://twitter.com/intent/tweet?" + g), I(6))
            });
            ji(this.g, "ddl-modal-copy-link-container", () => {
                ki(this, c);
                I(16)
            })
        }
        close() {
            const a = this;
            return m(function*() {
                a.g.classList.add("ddl-closing");
                yield ai(150);
                a.g.remove();
                a.g.classList.remove("ddl-closing");
                a.j()
            })
        }
    };

    function cf(a) {
        return typeof a === "number" ? a : a[0]
    }

    function mi(a, b) {
        const c = a.g[cf(b)];
        return (new Promise(d => {
            c.o ? d() : c.u.push(d);
            c.i()
        })).then(() => {})
    }

    function ni(a, b) {
        return Promise.all(b.map(c => mi(a, c))).then(() => {})
    }

    function oi(a, b, c = 1) {
        const d = b[5] || 1;
        a = a.i[cf(b)];
        return `${c*a[0]/d}px ${c*a[1]/d}px`
    }

    function pi(a, b) {
        const c = b[5] || 1;
        return `url(${a.g[cf(b)].j}) ${`${-(1*b[1]/c)}px ${-(1*b[2]/c)}px`}/${oi(a,b,1)} no-repeat`
    }
    var ri = class {
        constructor() {
            var a = qi;
            this.g = [];
            this.i = [];
            for (const c of a) {
                a = new Cg("./" + c.filename);
                var b = c.size;
                this.g.push(a);
                this.i.push(b)
            }
        }
        getSize(a) {
            return {
                width: a[3],
                height: a[4]
            }
        }
    };

    function K(a, b, c, d, e = 10) {
        for (a.style.fontSize = b + "px";
            (a.offsetWidth > c || a.offsetHeight > d) && b > e;) b--, a.style.fontSize = b + "px"
    };
    var si = class extends Hc {
        constructor() {
            const a = document.createElement("video");
            a.setAttribute("webkit-playsinline", "");
            a.setAttribute("playsinline", "");
            a.preload = "none";
            a.muted = !0;
            a.controls = !1;
            a.disablePictureInPicture = !0;
            a.style.position = "absolute";
            a.style.left = "0";
            a.style.top = "0";
            a.style.width = "100%";
            a.style.height = "100%";
            super();
            this.g = a;
            this.loaded = this.N = !1;
            this.i = this.j = this.u = this.v = null
        }
        load(a) {
            if (!this.T) {
                let b = () => {};
                this.T = new Promise(f => {
                    b = f
                });
                let c = null;
                const d = () => {
                    c !== null && (clearInterval(c),
                        c = null);
                    this.loaded = !0;
                    b(this)
                };
                c = setInterval(() => {
                    this.g.readyState === this.g.HAVE_ENOUGH_DATA && d()
                }, 32);
                const e = () => {
                    this.g.removeEventListener("error", e);
                    d()
                };
                this.g.addEventListener("canplaythrough", () => {
                    this.g.removeEventListener("error", e);
                    d()
                });
                this.g.addEventListener("error", e);
                this.g.src = a;
                this.g.preload = "auto";
                this.g.load()
            }
            return this.T
        }
        play() {
            this.u = new Promise(d => {
                this.v = () => {
                    d();
                    this.u = this.v = null
                }
            });
            this.i = new Promise(d => {
                this.j = () => {
                    d();
                    this.i = this.j = null
                }
            });
            const a = () => {
                this.g.removeEventListener("timeupdate",
                    a);
                Ic(this, "play", !0, {});
                let d;
                (d = this.v) == null || d.call(this)
            };
            this.g.addEventListener("timeupdate", a);
            const b = () => {
                this.g.removeEventListener("ended", b);
                this.N = !1;
                Ic(this, "ended", !0, {});
                let d;
                (d = this.j) == null || d.call(this)
            };
            this.g.addEventListener("ended", b);
            const c = d => {
                this.g.removeEventListener("error", c);
                this.N = !1;
                console.error("playback failed", this.g.src, d);
                Ic(this, "play", !0, {});
                let e;
                (e = this.v) == null || e.call(this);
                Ic(this, "ended", !0, {});
                let f;
                (f = this.j) == null || f.call(this)
            };
            this.g.addEventListener("error",
                c);
            this.N = !0;
            this.g.play().catch(c);
            return {
                hg: this.u,
                rd: this.i
            }
        }
        hg() {
            return this.u
        }
        rd() {
            return this.i
        }
        pause() {
            this.g.pause()
        }
        resume() {
            return this.N ? this.g.play() : Promise.resolve()
        }
    };
    let ti = void 0;

    function ui(a) {
        ti ? console.error("Attempted to overwrite monthly sprites") : ti = a
    }

    function vi() {
        if (!ti) throw Error("D");
        return ti
    }
    var Xi = class {
        constructor() {
            var a = {
                BACK: wi,
                Gg: xi,
                Pb: [12, 927, 203, 50, 50],
                Rb: [1, 0, 1283, 653, 653],
                Gc: [1, 656, 1283, 653, 653],
                Ig: yi,
                Jg: zi,
                Kg: Ai,
                Lg: Bi,
                Mg: Ci,
                Ng: Di,
                Og: Ei,
                Pg: Fi,
                Qg: Gi,
                Rg: Hi,
                Sg: Ii,
                Tg: Ji,
                Ug: Ki,
                Vg: Li,
                Wg: Mi,
                Xg: Ni,
                Yg: Oi,
                Zg: Pi,
                ah: Qi,
                dh: Ri,
                eh: Si,
                fh: Ti,
                hh: Ui,
                ih: Vi,
                Pe: [23, 390, 122, 111, 58],
                Qe: [23, 273, 61, 131, 58],
                Re: [23, 273, 122, 114, 58],
                Se: [23, 0, 0, 270, 131],
                Te: [23, 273, 0, 133, 58],
                We: [14, 1910, 0, 113, 113],
                df: [14, 0, 0, 188, 188],
                jf: [14, 1528, 191, 188, 188],
                Sb: [1, 0, 0, 1980, 1280]
            };
            this.j = Wi;
            this.i = a;
            this.o = {
                zd: [
                    [2, 0, 0, 265,
                        189
                    ],
                    [2, 268, 0, 265, 189],
                    [2, 268, 0, 265, 189],
                    [2, 268, 0, 265, 189],
                    [2, 536, 0, 265, 189],
                    [2, 536, 0, 265, 189],
                    [2, 536, 0, 265, 189],
                    [2, 804, 0, 265, 189],
                    [2, 804, 0, 265, 189],
                    [2, 804, 0, 265, 189],
                    [2, 1072, 0, 265, 189]
                ],
                mc: [
                    [3, 0, 0, 265, 189],
                    [3, 268, 0, 265, 189],
                    [3, 268, 0, 265, 189],
                    [3, 268, 0, 265, 189],
                    [3, 536, 0, 265, 189],
                    [3, 536, 0, 265, 189],
                    [3, 536, 0, 265, 189],
                    [3, 804, 0, 265, 189],
                    [3, 804, 0, 265, 189],
                    [3, 804, 0, 265, 189],
                    [3, 1072, 0, 265, 189],
                    [3, 1072, 0, 265, 189],
                    [3, 1072, 0, 265, 189],
                    [3, 0, 192, 265, 189],
                    [3, 0, 192, 265, 189],
                    [3, 0, 192, 265, 189],
                    [3, 268, 192, 265, 189],
                    [3,
                        268, 192, 265, 189
                    ],
                    [3, 268, 192, 265, 189],
                    [3, 536, 192, 265, 189],
                    [3, 536, 192, 265, 189],
                    [3, 536, 192, 265, 189],
                    [3, 804, 192, 265, 189]
                ],
                Ad: [
                    [4, 0, 0, 265, 189],
                    [4, 268, 0, 265, 189],
                    [4, 268, 0, 265, 189],
                    [4, 268, 0, 265, 189],
                    [4, 536, 0, 265, 189],
                    [4, 536, 0, 265, 189],
                    [4, 536, 0, 265, 189],
                    [4, 804, 0, 265, 189],
                    [4, 804, 0, 265, 189],
                    [4, 804, 0, 265, 189],
                    [4, 1072, 0, 265, 189],
                    [4, 1072, 0, 265, 189],
                    [4, 1072, 0, 265, 189],
                    [4, 1072, 0, 265, 189],
                    [4, 1340, 0, 265, 189]
                ],
                zc: [
                    [13, 0, 0, 150, 150],
                    [13, 153, 0, 150, 150],
                    [13, 306, 0, 150, 150],
                    [13, 459, 0, 150, 150],
                    [13, 612, 0, 150, 150],
                    [13, 765,
                        0, 150, 150
                    ],
                    [13, 918, 0, 150, 150],
                    [13, 1071, 0, 150, 150],
                    [13, 1224, 0, 150, 150],
                    [13, 1377, 0, 150, 150],
                    [13, 1530, 0, 150, 150],
                    [13, 1683, 0, 150, 150],
                    [13, 1836, 0, 150, 150],
                    [13, 0, 153, 150, 150],
                    [13, 153, 153, 150, 150],
                    [13, 306, 153, 150, 150],
                    [13, 459, 153, 150, 150],
                    [13, 612, 153, 150, 150],
                    [13, 765, 153, 150, 150],
                    [13, 918, 153, 150, 150],
                    [13, 1071, 153, 150, 150],
                    [13, 1224, 153, 150, 150],
                    [13, 1377, 153, 150, 150],
                    [13, 1530, 153, 150, 150],
                    [13, 1683, 153, 150, 150],
                    [13, 1836, 153, 150, 150],
                    [13, 0, 306, 150, 150],
                    [13, 153, 306, 150, 150],
                    [13, 306, 306, 150, 150],
                    [13, 459, 306, 150,
                        150
                    ],
                    [13, 1530, 0, 150, 150],
                    [13, 612, 306, 150, 150],
                    [13, 765, 306, 150, 150],
                    [13, 918, 306, 150, 150],
                    [13, 1071, 306, 150, 150],
                    [13, 1224, 306, 150, 150],
                    [13, 1377, 306, 150, 150],
                    [13, 1530, 306, 150, 150],
                    [13, 1683, 306, 150, 150],
                    [13, 1836, 306, 150, 150]
                ],
                Bc: [
                    [5, 0, 0, 265, 189],
                    [5, 268, 0, 265, 189],
                    [5, 268, 0, 265, 189],
                    [5, 536, 0, 265, 189],
                    [5, 536, 0, 265, 189],
                    [5, 804, 0, 265, 189],
                    [5, 804, 0, 265, 189],
                    [5, 804, 0, 265, 189],
                    [5, 1072, 0, 265, 189],
                    [5, 1072, 0, 265, 189],
                    [5, 1072, 0, 265, 189],
                    [5, 0, 192, 265, 189],
                    [5, 0, 192, 265, 189],
                    [5, 0, 192, 265, 189],
                    [5, 268, 192, 265, 189],
                    [5,
                        268, 192, 265, 189
                    ],
                    [5, 268, 192, 265, 189],
                    [5, 536, 192, 265, 189],
                    [5, 536, 192, 265, 189],
                    [5, 536, 192, 265, 189],
                    [5, 804, 192, 265, 189],
                    [5, 804, 192, 265, 189],
                    [5, 1072, 192, 265, 189]
                ],
                Cc: [
                    [7, 0, 0, 265, 189],
                    [7, 268, 0, 265, 189],
                    [7, 536, 0, 265, 189],
                    [7, 536, 0, 265, 189],
                    [7, 0, 192, 265, 189],
                    [7, 0, 192, 265, 189],
                    [7, 268, 192, 265, 189],
                    [7, 268, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265,
                        189
                    ],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 536, 192, 265, 189],
                    [7, 268, 192, 265, 189],
                    [7, 268, 192, 265, 189],
                    [7, 0, 192, 265, 189],
                    [7, 0, 192, 265, 189],
                    [7, 536, 0, 265, 189],
                    [7, 536, 0, 265, 189],
                    [7, 0, 0, 265, 189]
                ],
                Dc: [
                    [8, 0, 0, 265, 189],
                    [8, 268, 0, 265, 189],
                    [8, 536, 0, 265, 189],
                    [8, 804, 0, 265, 189],
                    [8, 804, 0, 265, 189],
                    [8, 0, 192, 265, 189],
                    [8, 0, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 268, 192, 265, 189],
                    [8, 0, 192, 265, 189],
                    [8, 0, 192, 265, 189],
                    [8, 536, 192, 265, 189],
                    [8, 536, 192, 265, 189],
                    [8, 268,
                        0, 265, 189
                    ],
                    [8, 268, 0, 265, 189],
                    [8, 0, 0, 265, 189]
                ],
                Td: [
                    [9, 0, 0, 530, 379],
                    [9, 533, 0, 530, 379],
                    [9, 533, 0, 530, 379],
                    [9, 1066, 0, 530, 379],
                    [9, 1066, 0, 530, 379],
                    [9, 0, 382, 530, 379],
                    [9, 0, 382, 530, 379],
                    [9, 533, 382, 530, 379],
                    [9, 533, 382, 530, 379],
                    [9, 533, 382, 530, 379],
                    [9, 1066, 382, 530, 379],
                    [9, 1066, 382, 530, 379],
                    [9, 0, 764, 530, 379],
                    [9, 533, 764, 530, 379],
                    [9, 533, 764, 530, 379],
                    [9, 1066, 764, 530, 379],
                    [9, 1066, 764, 530, 379],
                    [9, 1066, 764, 530, 379],
                    [9, 0, 1146, 530, 379],
                    [9, 0, 1146, 530, 379],
                    [9, 533, 1146, 530, 379],
                    [9, 533, 1146, 530, 379],
                    [9, 1066, 1146, 530, 379]
                ],
                Ec: [
                    [10, 0, 0, 265, 189],
                    [10, 268, 0, 265, 189],
                    [10, 268, 0, 265, 189],
                    [10, 268, 0, 265, 189],
                    [10, 536, 0, 265, 189],
                    [10, 536, 0, 265, 189],
                    [10, 536, 0, 265, 189],
                    [10, 804, 0, 265, 189],
                    [10, 804, 0, 265, 189],
                    [10, 804, 0, 265, 189],
                    [10, 1072, 0, 265, 189],
                    [10, 1072, 0, 265, 189],
                    [10, 1072, 0, 265, 189],
                    [10, 1340, 0, 265, 189]
                ],
                Ae: [
                    [0, 0, 0, 100, 100],
                    [0, 103, 0, 100, 100],
                    [0, 206, 0, 100, 100],
                    [0, 309, 0, 100, 100],
                    [0, 412, 0, 100, 100],
                    [0, 515, 0, 100, 100],
                    [0, 618, 0, 100, 100],
                    [0, 721, 0, 100, 100],
                    [0, 824, 0, 100, 100],
                    [0, 927, 0, 100, 100],
                    [0, 1030, 0, 100, 100],
                    [0, 1133, 0, 100, 100],
                    [0, 1236,
                        0, 100, 100
                    ],
                    [0, 1339, 0, 100, 100],
                    [0, 0, 103, 100, 100],
                    [0, 103, 103, 100, 100],
                    [0, 206, 103, 100, 100],
                    [0, 309, 103, 100, 100],
                    [0, 412, 103, 100, 100],
                    [0, 515, 103, 100, 100],
                    [0, 618, 103, 100, 100],
                    [0, 721, 103, 100, 100],
                    [0, 824, 103, 100, 100],
                    [0, 927, 103, 100, 100],
                    [0, 1030, 103, 100, 100],
                    [0, 1133, 103, 100, 100],
                    [0, 1236, 103, 100, 100],
                    [0, 1339, 103, 100, 100],
                    [0, 0, 206, 100, 100],
                    [0, 103, 206, 100, 100],
                    [0, 206, 206, 100, 100],
                    [0, 309, 206, 100, 100],
                    [0, 412, 206, 100, 100],
                    [0, 515, 206, 100, 100],
                    [0, 618, 206, 100, 100],
                    [0, 721, 206, 100, 100],
                    [0, 824, 206, 100, 100],
                    [0, 927, 206,
                        100, 100
                    ],
                    [0, 1030, 206, 100, 100],
                    [0, 1133, 206, 100, 100],
                    [0, 1236, 206, 100, 100],
                    [0, 1339, 206, 100, 100],
                    [0, 0, 309, 100, 100],
                    [0, 103, 309, 100, 100],
                    [0, 206, 309, 100, 100],
                    [0, 309, 309, 100, 100],
                    [0, 412, 309, 100, 100],
                    [0, 515, 309, 100, 100],
                    [0, 618, 309, 100, 100],
                    [0, 721, 309, 100, 100],
                    [0, 824, 309, 100, 100],
                    [0, 927, 309, 100, 100],
                    [0, 1030, 309, 100, 100],
                    [0, 1133, 309, 100, 100],
                    [0, 1236, 309, 100, 100],
                    [0, 1339, 309, 100, 100],
                    [0, 0, 412, 100, 100],
                    [0, 103, 412, 100, 100],
                    [0, 206, 412, 100, 100],
                    [0, 309, 412, 100, 100],
                    [0, 412, 412, 100, 100],
                    [0, 515, 412, 100, 100],
                    [0, 618, 412,
                        100, 100
                    ],
                    [0, 721, 412, 100, 100],
                    [0, 824, 412, 100, 100],
                    [0, 927, 412, 100, 100],
                    [0, 1030, 412, 100, 100],
                    [0, 1133, 412, 100, 100],
                    [0, 1236, 412, 100, 100],
                    [0, 1339, 412, 100, 100],
                    [0, 1339, 412, 100, 100]
                ],
                Rc: [
                    [14, 1910, 116, 113, 113],
                    [14, 1910, 232, 113, 113],
                    [14, 1910, 348, 113, 113],
                    [14, 1910, 464, 113, 113],
                    [14, 955, 573, 113, 113],
                    [14, 1071, 573, 113, 113],
                    [14, 1187, 573, 113, 113],
                    [14, 1303, 573, 113, 113],
                    [14, 1419, 573, 113, 113],
                    [14, 1535, 573, 113, 113],
                    [14, 1651, 573, 113, 113],
                    [14, 1767, 573, 113, 113],
                    [14, 1883, 580, 113, 113],
                    [14, 955, 689, 113, 113],
                    [14, 1071, 689, 113,
                        113
                    ],
                    [14, 1187, 689, 113, 113],
                    [14, 1303, 689, 113, 113],
                    [14, 1910, 0, 113, 113]
                ],
                Xe: [
                    [15, 0, 0, 113, 113],
                    [15, 116, 0, 113, 113],
                    [15, 232, 0, 113, 113],
                    [15, 348, 0, 113, 113],
                    [15, 464, 0, 113, 113],
                    [15, 580, 0, 113, 113],
                    [15, 696, 0, 113, 113],
                    [15, 812, 0, 113, 113],
                    [15, 0, 116, 113, 113],
                    [15, 116, 116, 113, 113],
                    [15, 232, 116, 113, 113],
                    [15, 348, 116, 113, 113],
                    [15, 464, 116, 113, 113],
                    [15, 580, 116, 113, 113],
                    [15, 696, 116, 113, 113],
                    [15, 812, 116, 113, 113],
                    [15, 0, 232, 113, 113],
                    [15, 116, 232, 113, 113],
                    [15, 232, 232, 113, 113],
                    [15, 348, 232, 113, 113],
                    [15, 464, 232, 113, 113],
                    [15, 580,
                        232, 113, 113
                    ],
                    [15, 696, 232, 113, 113],
                    [15, 812, 232, 113, 113],
                    [15, 0, 348, 113, 113],
                    [15, 116, 348, 113, 113],
                    [15, 232, 348, 113, 113],
                    [15, 348, 348, 113, 113],
                    [15, 464, 348, 113, 113],
                    [15, 580, 348, 113, 113]
                ],
                Ye: [
                    [16, 0, 0, 113, 113],
                    [16, 116, 0, 113, 113],
                    [16, 232, 0, 113, 113],
                    [16, 348, 0, 113, 113],
                    [16, 464, 0, 113, 113],
                    [16, 580, 0, 113, 113],
                    [16, 696, 0, 113, 113],
                    [16, 812, 0, 113, 113],
                    [16, 928, 0, 113, 113],
                    [16, 1044, 0, 113, 113],
                    [16, 0, 116, 113, 113],
                    [16, 116, 116, 113, 113],
                    [16, 232, 116, 113, 113],
                    [16, 348, 116, 113, 113],
                    [16, 464, 116, 113, 113],
                    [16, 580, 116, 113, 113],
                    [16,
                        696, 116, 113, 113
                    ],
                    [16, 812, 116, 113, 113],
                    [16, 928, 116, 113, 113],
                    [16, 1044, 116, 113, 113],
                    [16, 0, 232, 113, 113],
                    [16, 116, 232, 113, 113],
                    [16, 232, 232, 113, 113],
                    [16, 348, 232, 113, 113],
                    [16, 464, 232, 113, 113],
                    [16, 580, 232, 113, 113],
                    [16, 696, 232, 113, 113],
                    [16, 812, 232, 113, 113],
                    [16, 928, 232, 113, 113],
                    [16, 1044, 232, 113, 113],
                    [16, 0, 348, 113, 113],
                    [16, 116, 348, 113, 113],
                    [16, 232, 348, 113, 113],
                    [16, 348, 348, 113, 113],
                    [16, 464, 348, 113, 113],
                    [16, 580, 348, 113, 113],
                    [16, 696, 348, 113, 113],
                    [16, 812, 348, 113, 113],
                    [16, 928, 348, 113, 113]
                ],
                Ze: [
                    [17, 0, 0, 113, 113],
                    [17,
                        116, 0, 113, 113
                    ],
                    [17, 232, 0, 113, 113],
                    [17, 348, 0, 113, 113],
                    [17, 464, 0, 113, 113],
                    [17, 580, 0, 113, 113],
                    [17, 696, 0, 113, 113],
                    [17, 0, 116, 113, 113],
                    [17, 116, 116, 113, 113],
                    [17, 232, 116, 113, 113],
                    [17, 348, 116, 113, 113],
                    [17, 464, 116, 113, 113],
                    [17, 580, 116, 113, 113],
                    [17, 696, 116, 113, 113],
                    [17, 0, 232, 113, 113],
                    [17, 116, 232, 113, 113],
                    [17, 232, 232, 113, 113],
                    [17, 348, 232, 113, 113],
                    [17, 464, 232, 113, 113],
                    [17, 580, 232, 113, 113],
                    [17, 696, 232, 113, 113],
                    [17, 0, 348, 113, 113],
                    [17, 116, 348, 113, 113],
                    [17, 232, 348, 113, 113],
                    [17, 348, 348, 113, 113],
                    [17, 464, 348, 113, 113],
                    [17, 580, 348, 113, 113],
                    [17, 696, 348, 113, 113],
                    [17, 0, 464, 113, 113],
                    [17, 116, 464, 113, 113],
                    [17, 232, 464, 113, 113],
                    [17, 348, 464, 113, 113],
                    [17, 464, 464, 113, 113],
                    [17, 580, 464, 113, 113],
                    [17, 696, 464, 113, 113],
                    [17, 0, 580, 113, 113],
                    [17, 116, 580, 113, 113],
                    [17, 232, 580, 113, 113],
                    [17, 348, 580, 113, 113],
                    [17, 464, 580, 113, 113],
                    [17, 580, 580, 113, 113],
                    [17, 696, 580, 113, 113],
                    [17, 0, 696, 113, 113],
                    [17, 116, 696, 113, 113],
                    [17, 232, 696, 113, 113],
                    [17, 348, 696, 113, 113],
                    [17, 464, 696, 113, 113],
                    [17, 580, 696, 113, 113],
                    [17, 696, 696, 113, 113]
                ],
                Sc: [
                    [14, 191, 0, 188, 188],
                    [14, 382, 0, 188, 188],
                    [14, 573, 0, 188, 188],
                    [14, 764, 0, 188, 188],
                    [14, 955, 0, 188, 188],
                    [14, 1146, 0, 188, 188],
                    [14, 1337, 0, 188, 188],
                    [14, 1528, 0, 188, 188],
                    [14, 1719, 0, 188, 188],
                    [14, 0, 191, 188, 188],
                    [14, 191, 191, 188, 188],
                    [14, 382, 191, 188, 188],
                    [14, 573, 191, 188, 188],
                    [14, 764, 191, 188, 188],
                    [14, 955, 191, 188, 188],
                    [14, 1146, 191, 188, 188],
                    [14, 1337, 191, 188, 188],
                    [14, 0, 0, 188, 188]
                ],
                ef: [
                    [18, 0, 0, 188, 188],
                    [18, 191, 0, 188, 188],
                    [18, 382, 0, 188, 188],
                    [18, 573, 0, 188, 188],
                    [18, 764, 0, 188, 188],
                    [18, 955, 0, 188, 188],
                    [18, 1146, 0, 188, 188],
                    [18, 1337, 0, 188, 188],
                    [18,
                        1528, 0, 188, 188
                    ],
                    [18, 1719, 0, 188, 188],
                    [18, 0, 191, 188, 188],
                    [18, 191, 191, 188, 188],
                    [18, 382, 191, 188, 188],
                    [18, 573, 191, 188, 188],
                    [18, 764, 191, 188, 188],
                    [18, 955, 191, 188, 188],
                    [18, 1146, 191, 188, 188],
                    [18, 1337, 191, 188, 188],
                    [18, 1528, 191, 188, 188],
                    [18, 1719, 191, 188, 188],
                    [18, 0, 382, 188, 188],
                    [18, 191, 382, 188, 188],
                    [18, 382, 382, 188, 188],
                    [18, 573, 382, 188, 188],
                    [18, 764, 382, 188, 188],
                    [18, 955, 382, 188, 188],
                    [18, 1146, 382, 188, 188],
                    [18, 1337, 382, 188, 188],
                    [18, 1528, 382, 188, 188],
                    [18, 1719, 382, 188, 188]
                ],
                ff: [
                    [19, 0, 0, 188, 188],
                    [19, 191, 0, 188, 188],
                    [19, 382, 0, 188, 188],
                    [19, 573, 0, 188, 188],
                    [19, 764, 0, 188, 188],
                    [19, 955, 0, 188, 188],
                    [19, 0, 191, 188, 188],
                    [19, 191, 191, 188, 188],
                    [19, 382, 191, 188, 188],
                    [19, 573, 191, 188, 188],
                    [19, 764, 191, 188, 188],
                    [19, 955, 191, 188, 188],
                    [19, 0, 382, 188, 188],
                    [19, 191, 382, 188, 188],
                    [19, 382, 382, 188, 188],
                    [19, 573, 382, 188, 188],
                    [19, 764, 382, 188, 188],
                    [19, 955, 382, 188, 188],
                    [19, 0, 573, 188, 188],
                    [19, 191, 573, 188, 188],
                    [19, 382, 573, 188, 188],
                    [19, 573, 573, 188, 188],
                    [19, 764, 573, 188, 188],
                    [19, 955, 573, 188, 188],
                    [19, 0, 764, 188, 188],
                    [19, 191, 764, 188, 188],
                    [19, 382, 764, 188,
                        188
                    ],
                    [19, 573, 764, 188, 188],
                    [19, 764, 764, 188, 188],
                    [19, 955, 764, 188, 188],
                    [19, 0, 955, 188, 188],
                    [19, 191, 955, 188, 188],
                    [19, 382, 955, 188, 188],
                    [19, 573, 955, 188, 188],
                    [19, 764, 955, 188, 188],
                    [19, 955, 955, 188, 188],
                    [19, 0, 1146, 188, 188],
                    [19, 191, 1146, 188, 188],
                    [19, 382, 1146, 188, 188],
                    [19, 573, 1146, 188, 188],
                    [19, 764, 1146, 188, 188]
                ],
                hf: [
                    [20, 0, 0, 188, 188],
                    [20, 191, 0, 188, 188],
                    [20, 382, 0, 188, 188],
                    [20, 573, 0, 188, 188],
                    [20, 764, 0, 188, 188],
                    [20, 955, 0, 188, 188],
                    [20, 1146, 0, 188, 188],
                    [20, 1337, 0, 188, 188],
                    [20, 1528, 0, 188, 188],
                    [20, 1719, 0, 188, 188],
                    [20,
                        0, 191, 188, 188
                    ],
                    [20, 191, 191, 188, 188],
                    [20, 382, 191, 188, 188],
                    [20, 573, 191, 188, 188],
                    [20, 764, 191, 188, 188],
                    [20, 955, 191, 188, 188],
                    [20, 1146, 191, 188, 188],
                    [20, 1337, 191, 188, 188],
                    [20, 1528, 191, 188, 188],
                    [20, 1719, 191, 188, 188],
                    [20, 0, 382, 188, 188],
                    [20, 191, 382, 188, 188],
                    [20, 382, 382, 188, 188],
                    [20, 573, 382, 188, 188],
                    [20, 764, 382, 188, 188],
                    [20, 955, 382, 188, 188],
                    [20, 1146, 382, 188, 188],
                    [20, 1337, 382, 188, 188],
                    [20, 1528, 382, 188, 188],
                    [20, 1719, 382, 188, 188],
                    [20, 0, 573, 188, 188],
                    [20, 191, 573, 188, 188],
                    [20, 382, 573, 188, 188],
                    [20, 573, 573, 188, 188],
                    [20, 764, 573, 188, 188],
                    [20, 955, 573, 188, 188],
                    [20, 1146, 573, 188, 188],
                    [20, 1337, 573, 188, 188],
                    [20, 1528, 573, 188, 188],
                    [20, 1719, 573, 188, 188],
                    [20, 0, 764, 188, 188],
                    [20, 191, 764, 188, 188],
                    [20, 382, 764, 188, 188],
                    [20, 573, 764, 188, 188],
                    [20, 764, 764, 188, 188],
                    [20, 955, 764, 188, 188],
                    [20, 1146, 764, 188, 188],
                    [20, 1337, 764, 188, 188],
                    [20, 1528, 764, 188, 188]
                ],
                Tc: [
                    [14, 191, 0, 188, 188],
                    [14, 1719, 191, 188, 188],
                    [14, 0, 382, 188, 188],
                    [14, 191, 382, 188, 188],
                    [14, 382, 382, 188, 188],
                    [14, 573, 382, 188, 188],
                    [14, 764, 382, 188, 188],
                    [14, 955, 382, 188, 188],
                    [14, 1146, 382,
                        188, 188
                    ],
                    [14, 1337, 382, 188, 188],
                    [14, 1528, 382, 188, 188],
                    [14, 1719, 382, 188, 188],
                    [14, 0, 573, 188, 188],
                    [14, 191, 573, 188, 188],
                    [14, 382, 573, 188, 188],
                    [14, 573, 573, 188, 188],
                    [14, 764, 573, 188, 188],
                    [14, 1528, 191, 188, 188]
                ],
                kf: [
                    [21, 0, 0, 188, 188],
                    [21, 191, 0, 188, 188],
                    [21, 382, 0, 188, 188],
                    [21, 573, 0, 188, 188],
                    [21, 764, 0, 188, 188],
                    [21, 0, 191, 188, 188],
                    [21, 191, 191, 188, 188],
                    [21, 382, 191, 188, 188],
                    [21, 573, 191, 188, 188],
                    [21, 764, 191, 188, 188],
                    [21, 0, 382, 188, 188],
                    [21, 191, 382, 188, 188],
                    [21, 382, 382, 188, 188],
                    [21, 573, 382, 188, 188],
                    [21, 764, 382, 188, 188],
                    [21, 0, 573, 188, 188],
                    [21, 191, 573, 188, 188],
                    [21, 382, 573, 188, 188],
                    [21, 573, 573, 188, 188],
                    [21, 764, 573, 188, 188],
                    [21, 0, 764, 188, 188],
                    [21, 191, 764, 188, 188],
                    [21, 382, 764, 188, 188],
                    [21, 573, 764, 188, 188],
                    [21, 764, 764, 188, 188],
                    [21, 0, 955, 188, 188],
                    [21, 191, 955, 188, 188],
                    [21, 382, 955, 188, 188],
                    [21, 573, 955, 188, 188],
                    [21, 764, 955, 188, 188],
                    [21, 0, 1146, 188, 188],
                    [21, 191, 1146, 188, 188],
                    [21, 382, 1146, 188, 188],
                    [21, 573, 1146, 188, 188],
                    [21, 764, 1146, 188, 188],
                    [21, 0, 1337, 188, 188],
                    [21, 191, 1337, 188, 188],
                    [21, 382, 1337, 188, 188]
                ],
                lf: [
                    [22, 0, 0, 188, 188],
                    [22, 191, 0, 188, 188],
                    [22, 382, 0, 188, 188],
                    [22, 573, 0, 188, 188],
                    [22, 764, 0, 188, 188],
                    [22, 955, 0, 188, 188],
                    [22, 0, 191, 188, 188],
                    [22, 191, 191, 188, 188],
                    [22, 382, 191, 188, 188],
                    [22, 573, 191, 188, 188],
                    [22, 764, 191, 188, 188],
                    [22, 955, 191, 188, 188],
                    [22, 0, 382, 188, 188],
                    [22, 191, 382, 188, 188],
                    [22, 382, 382, 188, 188],
                    [22, 573, 382, 188, 188],
                    [22, 764, 382, 188, 188],
                    [22, 955, 382, 188, 188],
                    [22, 0, 573, 188, 188],
                    [22, 191, 573, 188, 188],
                    [22, 382, 573, 188, 188],
                    [22, 573, 573, 188, 188],
                    [22, 764, 573, 188, 188],
                    [22, 955, 573, 188, 188],
                    [22, 0, 764, 188, 188],
                    [22, 191, 764, 188,
                        188
                    ],
                    [22, 382, 764, 188, 188],
                    [22, 573, 764, 188, 188],
                    [22, 764, 764, 188, 188],
                    [22, 955, 764, 188, 188],
                    [22, 0, 955, 188, 188],
                    [22, 191, 955, 188, 188],
                    [22, 382, 955, 188, 188],
                    [22, 573, 955, 188, 188],
                    [22, 764, 955, 188, 188],
                    [22, 955, 955, 188, 188],
                    [22, 0, 1146, 188, 188],
                    [22, 191, 1146, 188, 188],
                    [22, 382, 1146, 188, 188],
                    [22, 573, 1146, 188, 188],
                    [22, 764, 1146, 188, 188]
                ]
            };
            this.g = {
                Oc: 0,
                wd: 1,
                fe: 2,
                he: 3,
                le: 4,
                oe: 5,
                qe: 6,
                re: 7,
                te: 8,
                ue: 9,
                we: 10,
                xe: 11,
                xd: 12,
                Qc: 13,
                Ge: 14,
                He: 15,
                Ie: 16,
                Je: 17,
                Ke: 18,
                Le: 19,
                Me: 20,
                Ne: 21,
                Oe: 22,
                lh: 23
            }
        }
    };

    function P(a, b) {
        return m(function*() {
            const c = yf(),
                d = a.then(() => void c.resolve());
            Oe(b, d);
            return c.promise
        })
    }

    function Q(a, b) {
        return m(function*() {
            return P(new r(a), b)
        })
    };

    function Yi(a, b = 24, c = !1, d = !1, e = !0) {
        const f = vi().j;
        b = df(f, a, c, b);
        b.j = d;
        e && (b.offset.x = -a[0][3] / 2, b.offset.y = -a[0][4] / 2);
        return b
    }

    function Zi(a, b) {
        Ce(a, b);
        Ce(a, new F(b.i[0].Xa));
        return b
    }

    function $i(a) {
        return new Promise(b => {
            a.o = b
        })
    }

    function aj(a, b, c = 1E3) {
        a.style.visibility = "visible";
        const d = Number(window.getComputedStyle(a).opacity) || 0;
        return P(new w(c * (1 - d), d, 1, e => {
            a.style.opacity = `${e}`
        }), b)
    }

    function bj(a, b, c = 500) {
        return m(function*() {
            const d = Number(window.getComputedStyle(a).opacity) || 0;
            yield P(new w(c * d, d, 0, e => {
                a.style.opacity = `${e}`
            }), b);
            a.style.visibility = "hidden"
        })
    }

    function cj(a) {
        a.style.visibility = "visible";
        a.style.opacity = "0";
        a.style.transform = "scale(1.05)";
        a.style.filter = "blur(5)px";
        return new t([new w(150, 0, 1, b => {
            a.style.opacity = `${b}`
        }), v(new w(400, 1.05, 1, b => {
            a.style.transform = `scale(${b})`
        }), La), v(new w(400, 5, 0, b => {
            a.style.filter = `blur(${b}px)`
        }), Ga(.32, 0, .67, 0))])
    }

    function dj(a) {
        return new p([new t([v(new w(400, 1, 1.05, b => {
            a.style.transform = `scale(${b})`
        }), La), v(new w(400, 0, 5, b => {
            a.style.filter = `blur(${b}px)`
        }), La), new p([new r(200), new w(200, 1, 0, b => {
            a.style.opacity = `${b}`
        })])]), new q(() => {
            a.style.visibility = "hidden"
        })])
    }

    function ej(a, b, c = Pa, d = new D(0, 0)) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        e.setAttribute("cx", `${a.x}`);
        e.setAttribute("cy", `${a.y}`);
        e.setAttribute("r", "0");
        e.classList.add("ddl-progress-star-circle");
        b.appendChild(e);
        return new p([new t([v(new w(3E3, 0, 200, f => {
            e.setAttribute("r", `${f}`)
        }), c), v(new w(3E3, 1, 0, f => {
            e.style.opacity = `${f}`
        }), c), new w(3E3, 4, 48, f => {
            e.setAttribute("stroke-width", `${f}px`)
        }), v(new w(3E3, 0, 5, f => {
            e.style.filter = `blur(${f}px)`
        }), c), v(new w(3E3,
            a.x, a.x + d.x, f => {
                e.setAttribute("cx", `${f}`)
            }), c), v(new w(3E3, a.y, a.y + d.y, f => {
            e.setAttribute("cy", `${f}`)
        }), c)]), new q(() => {
            e.remove()
        })])
    };
    class fj extends ad {}
    var bd = {};
    bd.jc = new kd;
    var x = {};
    x.kc = new y(0, 1E3);
    x.yd = new y(74342.3515625, 508.2080078125);
    x.ub = new y(2E3, 1342.3330078125);
    x.Bd = new y(19342.33203125, 4E3);
    x.Cd = new y(24342.33203125, 4E3);
    x.Dd = new y(29342.33203125, 4E3);
    x.Ed = new y(34342.33203125, 4E3);
    x.Fd = new y(39342.33203125, 4E3);
    x.Gd = new y(44342.33203125, 4E3);
    x.Hd = new y(4342.3330078125, 2E3);
    x.nc = new y(7342.3330078125, 2E3);
    x.oc = new y(10342.3330078125, 2E3);
    x.qc = new y(13342.3330078125, 2E3);
    x.Id = new y(16342.3330078125, 2E3);
    x.Jd = new y(49342.33203125, 4E3);
    x.rc = new y(254530.484375, 4E3);
    x.Kd = new y(54342.33203125, 4E3);
    x.Ld = new y(59342.33203125, 2E3);
    x.tc = new y(62342.33203125, 2E3);
    x.uc = new y(65342.33203125, 2E3);
    x.wc = new y(68342.3359375, 1995.9580078125);
    x.Md = new y(71338.2890625, 2004.06201171875);
    x.Nd = new y(75850.5625, 1016.4169921875);
    x.xc = new y(81847.4375, 12743.375);
    x.Od = new y(95590.8125, 14E3);
    x.yc = new y(110590.8125, 5061.97900390625);
    x.Pd = new y(206640.453125, 3500);
    x.Qd = new y(120152.7890625, 28E3);
    x.Rd = new y(149152.796875, 17614.6875);
    x.Sd = new y(167767.484375, 20872.978515625);
    x.Fc = new y(189640.453125, 16E3);
    x.Ud = new y(211140.453125, 3500);
    x.Vd = new y(215640.453125, 3500);
    x.Wd = new y(220140.453125, 3500);
    x.Xd = new y(224640.453125, 3500);
    x.Yd = new y(229140.453125, 3500);
    x.Zd = new y(233640.453125, 3500);
    x.ye = new y(238140.453125, 3500);
    x.ze = new y(77866.9765625, 682.875);
    x.Be = new y(242640.453125, 1375);
    x.Hc = new y(245015.453125, 1377.6669921875);
    x.Ic = new y(247393.125, 1387.35400390625);
    x.Jc = new y(249780.484375, 1375);
    x.Ce = new y(252155.484375, 1375);
    x.Kc = new y(259530.484375, 2750);
    x.De = new y(263280.46875, 1250);
    x.Lc = new y(265530.46875, 1250);
    x.Mc = new y(267780.46875, 1403.0830078125);
    x.Nc = new y(270183.5625, 1250);
    x.Ee = new y(272433.5625, 1250);
    x.Fe = new y(79549.8515625, 1297.5830078125);
    x.Ue = new y(274683.5625, 1250);
    x.Ve = new y(276933.5625, 1250);
    x.mf = new y(279183.5625, 21818.20703125);
    x.nf = new y(116652.7890625, 2500);
    x.qf = new y(302001.78125, 6E3);
    x.rf = new y(309001.78125, 6E3);
    x.Uc = new y(316001.78125, 1500);
    x.Vc = new y(318501.78125, 12307.7080078125);
    x.tf = new y(331809.46875, 6162.6669921875);
    x.uf = new y(338972.15625, 5490.3330078125);
    x.vf = new y(345462.46875, 4926.60400390625);
    x.wf = new y(351389.09375, 3000.02099609375);
    x.xf = new y(355389.09375, 2494.22900390625);
    (function() {
        var a = fj;
        a.Za = void 0;
        a.ld = function() {
            return a.Za ? a.Za : a.Za = new a
        }
    })();
    const gj = new URLSearchParams(window.location.search);
    var mh = ke("id", "376116040");
    const hj = new Map([
        ["350977392", "october"],
        ["372679826", "november"],
        ["372680007", "december"],
        ["376116040", "jan"],
        ["376116041", "february"],
        ["376116085", "march"]
    ]);
    var ij = hj.get(mh);

    function jj(a, b = mh) {
        return b && b !== "350977392" ? `ddl-${b}-${a}` : `ddl-${a}`
    }
    var kj = jj("has_seen_tutorial"),
        lj = [...hj.keys()].map(a => jj("has_seen_tutorial", a)).filter(a => qh(a, null) !== null).length,
        mj = jj("has_seen_wildcard_tutorial"),
        nj = jj("has_played_wildcard_tutorial"),
        oj = jj("unlocked_wildcards"),
        pj = [kj, mj, nj, oj],
        qj = gj.has("debugGame") && !1,
        rj = gj.has("resetStorage") && !1,
        sj = gj.has("debugBoard") && !1,
        tj = gj.has("debugMatches") && !1;

    function R() {
        uj === void 0 && (uj = new vj);
        return uj
    }

    function wj(a, b, c, d) {
        gd(b);
        Oe(a.actions, new p([new r(c), new q(() => {
            hd(b, 1, d / 1E3)
        })]))
    }

    function S(a, b, c = 0) {
        m(function*() {
            const d = b.play(c);
            yield Q(b.u + c, a.actions);
            cd(b, `${d}`)
        })
    }

    function xj(a, b, c, d = 0) {
        m(function*() {
            if (a.g !== void 0) {
                const e = a.g;
                c !== void 0 && (hd(e, .01, c / 1E3), yield Q(c, a.actions));
                cd(e)
            }
            c !== void 0 && wj(a, b, d, c);
            b.play(d, !0);
            a.g = b
        })
    }

    function yj(a, b) {
        m(function*() {
            if (a.g !== void 0) {
                var c = a.g;
                a.g = void 0;
                b !== void 0 && (hd(c, .01, b / 1E3), yield Q(b, a.actions));
                cd(c)
            }
        })
    }
    var vj = class {
            constructor() {
                this.i = new Ke;
                this.actions = new B;
                C(this.i, this.actions);
                this.i.g = [new Pe(this.i)]
            }
            update(a) {
                this.i.update(a)
            }
        },
        uj = void 0;
    var T = class extends A {
            constructor(a, b) {
                super();
                this.el = a;
                a.style.position = "absolute";
                a.style.left = "0";
                a.style.top = "0";
                this.g = !b || b.pos.x === 0 && b.pos.y === 0 ? "" : `translate(${b.pos.x}${b.Gb}, ${b.pos.y}${b.Gb}) `
            }
        },
        zj = class extends Le {
            update() {
                var a = Me(this.g.find(Ze)),
                    b = new Ve,
                    c = a.get(E);
                c.position.x = -c.position.x;
                c.position.y = -c.position.y;
                c.rotation = -c.rotation;
                Xe(a, b);
                c.position.x = -c.position.x;
                c.position.y = -c.position.y;
                c.rotation = -c.rotation;
                for (const e of this.g.find(T)) {
                    a = e.get(T);
                    c = a.el;
                    const f =
                        Xe(e);
                    var d = b.W();
                    const g = d.b * f.a + d.d * f.b,
                        h = d.a * f.c + d.c * f.d,
                        l = d.b * f.c + d.d * f.d,
                        n = d.a * f.e + d.c * f.f + d.e,
                        u = d.b * f.e + d.d * f.f + d.f;
                    d.a = d.a * f.a + d.c * f.b;
                    d.b = g;
                    d.c = h;
                    d.d = l;
                    d.e = n;
                    d.f = u;
                    c.style.transform = `${a.g}matrix(${d.a},${d.b},${d.c},${d.d},${d.e},${d.f}) translateZ(0)`
                }
            }
        };

    function Aj(a, b, c) {
        return m(function*() {
            const d = Zi(a.j, Yi(b)),
                e = a.j.get(E);
            e.rotation = -Bj[c];
            Se(e.position, (new D(a.u.width / 2, a.u.height / 2)).add(Cj[c]));
            a.j.get(F).Yb = 2;
            yield $i(d)
        })
    }

    function Dj(a, b, c) {
        return m(function*() {
            var d = a.v;
            d !== b && (a.v = b, yield a.H, d = a.T.get(d).get(b), a.H = Aj(a, d, c != null ? c : a.position), yield a.H)
        })
    }

    function Ej(a, b, c, d) {
        return m(function*() {
            const e = a.position;
            e !== b && (a.position = b, yield Dj(a, 0, e), yield Fj(a, e, b, c), yield Dj(a, d, b))
        })
    }

    function Gj(a) {
        return m(function*() {
            yield Ej(a, 0, 2500, 1)
        })
    }

    function Hj(a) {
        return m(function*() {
            yield Ej(a, 2, 2500, 5)
        })
    }

    function Ij(a) {
        return m(function*() {
            yield Ej(a, 1, 1500, 1)
        })
    }

    function Fj(a, b, c, d) {
        return m(function*() {
            if (b !== c) {
                var e = a.background.get(E),
                    f = Bj[c],
                    g = e.rotation,
                    h = (f - g) / (f - Bj[b]),
                    l = a.N.get(F);
                f = [v(new w(d * h, g, f, n => {
                    e.rotation = n
                }), Ha)];
                c !== 2 && b !== 2 || f.push(new w(d * h, 1 - h, 1, n => {
                    n = c === 2 ? n : 1 - n;
                    l.alpha = n < .3 ? 0 : (n - .3) / .7
                }));
                yield P(new t(f), a.background)
            }
        })
    }
    var Jj = class {
        constructor(a) {
            this.g = new Ke;
            this.position = 1;
            this.v = 0;
            this.H = Promise.resolve();
            this.i = vi();
            var b = this.i.o,
                c = b.Cc.slice(0, 29),
                d = b.Cc.slice(29),
                e = b.Dc.slice(0, 29),
                f = b.Dc.slice(29);
            this.T = new Map([
                [0, new Map([
                    [1, b.Bc],
                    [5, b.Ad]
                ])],
                [1, new Map([
                    [0, b.Bc.slice().reverse()],
                    [2, c],
                    [3, e],
                    [4, b.Ec]
                ])],
                [2, new Map([
                    [1, d]
                ])],
                [3, new Map([
                    [1, f]
                ])],
                [4, new Map([
                    [1, b.Ec.slice().reverse()]
                ])],
                [5, new Map([
                    [6, b.zd],
                    [0, b.mc]
                ])],
                [6, new Map([
                    [0, b.mc]
                ])]
            ]);
            this.o = a.querySelector(".ddl-background-inner");
            b = a.querySelector(".ddl-background-stars");
            b.style.background = pi(this.i.j, this.i.i.Sb);
            b.style.width = `${this.i.i.Sb[3]}px`;
            b.style.height = `${this.i.i.Sb[4]}px`;
            a = a.querySelector(".ddl-background-moon-canvas");
            b = this.i.j;
            a.width = this.i.i.Rb[3];
            a.height = this.i.i.Rb[4];
            a.style.width = `${a.width/2}px`;
            a.style.height = `${a.height/2}px`;
            this.u = a;
            c = this.g;
            d = new Pe(this.g);
            e = new zj(this.g);
            f = new of(this.g);
            var g = this.g;
            var h = a.getContext("2d");
            c.g = [d, e, f, new nf(g, h)];
            C(this.g, new B(new E, new Ze));
            this.background = new B(new E(new D(0, 0), Bj[this.position]),
                new T(this.o));
            this.o.style.position = "";
            this.o.style.left = "";
            this.o.style.top = "";
            C(this.g, this.background);
            c = new F(af(b, this.i.i.Rb), 0);
            c.alpha = 0;
            this.N = new B(new E, c);
            C(this.g, this.N);
            C(this.g, new B(new E, new F(af(b, this.i.i.Gc), 1)));
            this.j = new B(new E(new D(a.width / 2, a.height / 2), 0, new D(2, 2)));
            C(this.g, this.j)
        }
        update(a) {
            this.g.update(a)
        }
    };
    let Lj;
    const Bj = [-Math.PI / 2, 0, Math.PI / 2],
        Cj = [new D(-80, 0), new D(0, 80), new D(80, 0)];
    var Mj = {
        new_moon: {
            type: "moon",
            id: "new_moon",
            value: 0
        },
        waxing_crescent: {
            type: "moon",
            id: "waxing_crescent",
            value: 1
        },
        first_quarter: {
            type: "moon",
            id: "first_quarter",
            value: 2
        },
        waxing_gibbous: {
            type: "moon",
            id: "waxing_gibbous",
            value: 3
        },
        full_moon: {
            type: "moon",
            id: "full_moon",
            value: 4
        },
        waning_gibbous: {
            type: "moon",
            id: "waning_gibbous",
            value: 5
        },
        third_quarter: {
            type: "moon",
            id: "third_quarter",
            value: 6
        },
        waning_crescent: {
            type: "moon",
            id: "waning_crescent",
            value: 7
        }
    };
    let Nj = void 0;

    function Oj(a) {
        Nj ? console.error("Attempted to overwrite MOON_CARD_ASSETS.") : Nj = a
    }
    let Pj = void 0;

    function Qj(a) {
        Pj ? console.error("Attempted to overwrite WILDCARD_DEFINITIONS.") : Pj = a
    };
    const Rj = uh();

    function U(a) {
        return xh(Rj, a)
    }
    const Sj = (new Map([
            ["am", "Ethiopic"],
            ["ar", "Arabic"],
            ["bn", "Bengali"],
            ["fa", "Arabic"],
            ["gu", "Gujarati"],
            ["hi", "Devanagari"],
            ["hy", "Armenian"],
            ["iw", "Hebrew"],
            ["ja", "JP"],
            ["ka", "Georgian"],
            ["km", "Khmer"],
            ["kn", "Kannada"],
            ["ko", "KR"],
            ["lo", "Lao"],
            ["ml", "Malayalam"],
            ["mr", "Devanagari"],
            ["my", "Myanmar"],
            ["ne", "Devanagari"],
            ["pa", "Gurmukhi"],
            ["si", "Sinhala"],
            ["ta", "Tamil"],
            ["te", "Telugu"],
            ["th", "Thai"],
            ["ur", "Arabic"],
            ["zh-CN", "SC"],
            ["zh-HK", "HK"],
            ["zh-TW", "TC"]
        ])).get(pe),
        Tj = Sj ? `Noto Sans ${Sj}` : "Noto Sans",
        Uj = "af az bs ca cs da de en en-GB es es-419 et eu fi fil fr fr-CA gl hr hu id is it kk ky lt lv ms nl no pl pt-BR pt-PT ro sk sl sq sr sv sw tr uz vi zu".split(" ").includes(pe);
    var Vj = Uj ? "Josefin Sans" : Tj,
        Wj = Uj ? 200 : 100;
    let Xj;
    var Yj = (Xj = (new Map([
            ["Josefin Sans", 3],
            ["Noto Sans", 0],
            ["Noto Sans Arabic", 3],
            ["Noto Sans Armenian", 0],
            ["Noto Sans Bengali", 4],
            ["Noto Sans Devanagari", 4],
            ["Noto Sans Ethiopic", 0],
            ["Noto Sans Georgian", 0],
            ["Noto Sans Gujarati", 4],
            ["Noto Sans Gurmukhi", 4],
            ["Noto Sans HK", -2],
            ["Noto Sans Hebrew", 0],
            ["Noto Sans JP", -2],
            ["Noto Sans KR", -2],
            ["Noto Sans Kannada", 8],
            ["Noto Sans Khmer", 0],
            ["Noto Sans Lao", 0],
            ["Noto Sans Malayalam", 4],
            ["Noto Sans Myanmar", 2],
            ["Noto Sans SC", -2],
            ["Noto Sans Sinhala", 0],
            ["Noto Sans TC",
                -2
            ],
            ["Noto Sans Tamil", 4],
            ["Noto Sans Telugu", 5],
            ["Noto Sans Thai", 3]
        ])).get(Vj)) != null ? Xj : 0,
        Zj = (new Map([
            ["Noto Sans", 1.2],
            ["Noto Sans Arabic", 1.6],
            ["Noto Sans Myanmar", 1.6]
        ])).get(Vj),
        ak = (new Map([
            ["Noto Sans Georgian", 1.2],
            ["Noto Sans Myanmar", 1.3]
        ])).get(Vj);
    const bk = "\u1040\u1041\u1042\u1043\u1044\u1045\u1046\u1047\u1048\u1049".split("");

    function ck(a) {
        if (pe !== "my") return a;
        const b = [];
        for (const c of a) c >= "0" && c <= "9" ? b.push(bk[c.charCodeAt(0) - 48]) : b.push(c);
        return b.join("")
    };
    var dk = class extends A {
            constructor(a, b) {
                super();
                this.Oa = a;
                this.value = b;
                this.i = !0;
                this.g = !1
            }
            set(a) {
                this.j = this.value;
                this.g = !0;
                this.value = a
            }
            get() {
                return this.value
            }
            update(a) {
                this.g && (this.Oa(a, this.value, this.j), this.g = !1, this.j = void 0)
            }
        },
        ek = class extends Le {
            constructor(a, ...b) {
                super(a);
                this.i = [];
                this.i.push(dk, ...b)
            }
            update() {
                for (const a of this.i)
                    for (const b of this.g.find(a, T)) {
                        const c = b.get(a);
                        c.i && c.update(b)
                    }
            }
        };

    function fk(a, b, c) {
        c.scale.set(a.x / b.x, a.y / b.y);
        return new V(a, b)
    }
    var V = class extends A {
            constructor(a, b) {
                super();
                this.Ca = a;
                this.g = b;
                this.Ca.W()
            }
        },
        gk = class extends Le {
            update() {
                for (const a of this.g.find(V, E)) {
                    const b = a.get(E).scale,
                        c = a.get(V);
                    b.set(c.Ca.x / c.g.x, c.Ca.y / c.g.y)
                }
            }
        };

    function hk(a) {
        const b = a.width;
        a = a.height;
        return M('<button class="' + N("ddl-card") + '" style="width: ' + N(Oh(b)) + "px; height: " + N(Oh(a)) + 'px;">' + M('<div class="' + N("ddl-card-border") + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 298 294"><circle fill="none" stroke="#fff" stroke-width="1.87px" cx="282" cy="278" r="15"/><circle fill="none" stroke="#fff" stroke-width="1.87px" cx="282" cy="16" r="15"/><circle fill="none" stroke="#fff" stroke-width="1.87px" cx="16" cy="278" r="15"/><circle fill="none" stroke="#fff" stroke-width="1.87px" cx="16" cy="16" r="15"/><path fill="none" stroke="#fff" stroke-width="1.87px" fill-rule="evenodd" d="M36.544,8.544H261.456a26,26,0,0,1,26,26V259.456a26,26,0,0,1-26,26H36.544a26,26,0,0,1-26-26V34.544A26,26,0,0,1,36.544,8.544Z"/></svg></div>') +
            '<div class="' + N("ddl-card-inner") + '"><div class="' + N("ddl-card-front") + '"><div class="' + N("ddl-card-face") + " " + N("ddl-card-default") + '"></div><div class="' + N("ddl-card-face") + " " + N("ddl-card-light") + '"></div><div class="' + N("ddl-card-face") + " " + N("ddl-card-dark") + '"></div></div><div class="' + N("ddl-card-back") + '"></div></div></button>')
    }

    function ik(a) {
        var b = a.yg,
            c = a.Db;
        a = a.buttons;
        b = '<div class="' + N("ddl-card-modal-container") + '"><div class="' + N("ddl-card-modal") + '"><div class="' + N("ddl-card-modal-inner-container") + '"><div class="' + N("ddl-card-modal-card-container") + '"></div><span class="' + N("ddl-card-modal-card-title") + '"></span><span class="' + N("ddl-card-modal-card-subtitle") + '">' + L(b) + '</span><div class="' + N("ddl-card-modal-card-description-container") + '"><span class="' + N("ddl-card-modal-card-description") + '"></span></div>' + (c ?
            '<span class="' + N("ddl-card-modal-buttons-title") + '">' + L(c) + "</span>" : '<div class="' + N("ddl-card-modal-card-info-container") + '"><span class="' + N("ddl-card-modal-card-info") + '"></span></div>') + '<div class="' + N("ddl-card-modal-buttons-container") + '">';
        c = [];
        for (const [d, e] of a.entries()) c.push({
            key: d,
            value: e
        });
        a = c.length;
        for (let d = 0; d < a; d++) {
            const e = c[d];
            b += '<button class="' + N("ddl-card-modal-button") + " " + N("ddl-button") + '" data-id="' + N(e.key) + '">' + L(e.value) + "</button>"
        }
        return M(b + "</div></div></div></div>")
    };

    function jk(a, b) {
        const c = a.get(T).el;
        c.querySelector(".ddl-card-inner").style.transform = `rotateY(${b}deg)`;
        const d = a.get(W);
        d.Sa = b;
        let e;
        b !== 180 && (a = d.type === "moon" ? a.get(kk).definition.id : a.get(lk).definition.Ka.title) && (e = U(a));
        e ? (c.setAttribute("aria-label", e), c.setAttribute("title", e)) : (c.removeAttribute("aria-label"), c.removeAttribute("title"))
    }

    function mk(a, b, c, d, e, f) {
        a.g.get(W);
        Se(a.get(E).position, b);
        jk(a, d);
        Se(a.get(V).Ca, c);
        C(e, a);
        a = a.get(T).el;
        f.appendChild(a)
    }
    var W = class extends A {
            constructor(a, b) {
                super();
                this.id = a;
                this.type = b;
                this.Sa = 0
            }
        },
        kk = class extends A {
            constructor(a, b) {
                super();
                this.value = a;
                this.definition = b
            }
        };

    function nk(a, b) {
        const c = a.definition;
        return ok(c.id, c, a, c.mb, c.Cb, void 0, void 0, b)
    }
    var lk = class extends A {
        constructor(a) {
            super();
            this.definition = a;
            this.Ob = !1
        }
    };

    function ok(a, b, c, d, e, f, g, h) {
        const l = vi().j,
            n = new D(d[3], d[4]),
            u = O(hk, {
                width: n.x,
                height: n.y
            });
        u.querySelector(".ddl-card-default").style.background = pi(l, d);
        u.querySelector(".ddl-card-back").style.background = pi(l, e);
        f && (u.querySelector(".ddl-card-light").style.background = pi(l, f));
        g && (u.querySelector(".ddl-card-dark").style.background = pi(l, g));
        d = new E;
        a = new B(new W(a, b.type), d, fk(h.W(), n.W(), d), new T(u, {
            pos: new D(-50, -50),
            Gb: "%"
        }), new pk, new qk);
        Ce(a, c);
        return a
    }
    var pk = class extends dk {
            constructor() {
                super((a, b, c) => void rk(a, b, c), !1)
            }
        },
        qk = class extends dk {
            constructor() {
                super((a, b, c) => void sk(a, b, c), !0)
            }
        };

    function rk(a, b, c) {
        if (a.i && b !== c) {
            c = Me(a.i.find(Ne));
            var d = a.get(T).el.querySelector(".ddl-card-border");
            a = void 0;
            a = b ? new p([new w(100, 0, 1, e => {
                d.style.opacity = `${e}`
            }), new t([new w(200, 10, 0, e => {
                d.style.filter = `drop-shadow(0 0 10px #fff) blur(${e}px)`
            }), new w(200, 1.45, 1.27, e => {
                d.style.transform = `scale(${e})`
            })])]) : new p([new t([new w(200, 0, 10, e => {
                d.style.filter = `drop-shadow(0 0 10px #fff) blur(${e}px)`
            }), new w(200, 1.27, 1.45, e => {
                d.style.transform = `scale(${e}, ${e})`
            })]), new w(100, 1, 0, e => {
                d.style.opacity =
                    `${e}`
            })]);
            Oe(c, a)
        }
    }

    function sk(a, b, c) {
        if (a.i && b !== c) {
            c = Me(a.i.find(Ne));
            var d = a.get(T).el;
            Oe(c, b ? new p([new w(250, .25, 1, e => {
                d.style.filter = `contrast(${e})`
            })]) : new p([new w(250, 1, .25, e => {
                d.style.filter = `contrast(${e})`
            })]))
        }
    };
    var tk = class {
        constructor(a, b, c, d = !1) {
            this.o = a;
            this.i = b;
            this.g = c;
            this.u = d;
            this.j = this.o * this.i + this.g
        }
    };

    function uk(a, b) {
        switch (a) {
            case "pair":
            case "full_moon":
                return vk(b[0], b[1]);
            case "run":
                return wk(b);
            default:
                cb(a, `Unknown card set type: ${a}`)
        }
    }

    function xk(a) {
        switch (a.type) {
            case "pair":
            case "full_moon":
                a.O.sort((d, e) => {
                    d = d.get(W).id;
                    e = e.get(W).id;
                    return d < e ? -1 : d > e ? 1 : 0
                });
                break;
            case "run":
                const b = a.O[0].get(kk).value,
                    c = a.O[1].get(kk).value;
                (b > c && b !== 7 && c !== 0 || b === 0 && c === 7) && a.O.reverse();
                break;
            default:
                throw Error("E`" + a.type);
        }
    }
    var yk = class {
        constructor(a, b, c) {
            this.type = a;
            this.O = b;
            this.V = c;
            this.points = new tk(0, 1, 0);
            a === "run" && b.length >= 3 || ["pair", "full_moon"].includes(a);
            xk(this);
            this.id = uk(this.type, this.O);
            this.tiles = b.map(d => d.get(W).va)
        }
    };

    function vk(a, b) {
        return [a, b].map(c => c.get(W).id).sort((c, d) => c < d ? -1 : c > d ? 1 : 0).reduce((c, d) => `${c},${d}`)
    }

    function wk(a) {
        return a.map(b => b.get(W).id).reduce((b, c) => `${b},${c}`)
    };

    function zk() {
        var a = M,
            b = '<button class="' + N("ddl-tile") + '">';
        var c = M('<div class="' + N("ddl-tile-border") + "\"><svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='none' stroke='#fff' stroke-width='3' stroke-dasharray='8,4' stroke-dashoffset='0' stroke-linecap='butt'/></svg></div>");
        return a(b + c + "</button>")
    };

    function Ak(a, b, c) {
        const d = vi(),
            e = d.j,
            f = new D(d.i.Pb[3], d.i.Pb[4]);
        b = new E(b.W());
        const g = Vh(zk);
        g.style.background = pi(e, d.i.Pb);
        g.style.width = `${f.x}px`;
        g.style.height = `${f.y}px`;
        return new B(new X(a), b, fk(c.W(), f.W(), b), new T(g, {
            pos: new D(-50, -50),
            Gb: "%"
        }), new Bk)
    }
    var X = class extends A {
            constructor(a) {
                super();
                this.id = a;
                this.g = !0
            }
        },
        Bk = class extends dk {
            constructor() {
                super((a, b) => {
                    a = a.get(T).el;
                    b ? a.classList.add("ddl-tile-selectable") : a.classList.remove("ddl-tile-selectable")
                }, !1)
            }
        };

    function Ck(a, b) {
        return [a, b].map(c => c.get(X).id).sort().join(",")
    }

    function Dk(a, b) {
        const c = a.get(E).position.W(),
            d = b.get(E).position.W(),
            e = Te(c.W().add(d), .5);
        c.sub(e);
        d.sub(e);
        const f = document.createElementNS("http://www.w3.org/2000/svg", "g");
        f.appendChild(Ek(["ddl-connection-empty"], c, d));
        return new B(new Fk(f, a, b), new E(e), new T(f))
    }

    function Gk(a, b) {
        var c;
        (c = a.vb) == null || c.remove();
        a.vb = void 0;
        if (b !== void 0) {
            a: {
                c = a.hc;
                var d = a.bc.get(E).position.W(),
                    e = c.get(E).position.W();
                switch (b) {
                    case "pair":
                        c = Hk(Ik(d, e, -5), 3);
                        d = Hk(Ik(d, e, 5), 3);
                        e = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        e.classList.add("ddl-connection-phase-pair");
                        e.appendChild(c);
                        e.appendChild(d);
                        c = e;
                        break a;
                    case "full_moon":
                        c = new D(0, 0);
                        d = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        d.classList.add("ddl-connection-fullmoon-pair");
                        d.appendChild(Hk(c,
                            5));
                        c = d;
                        break a;
                    case "run":
                        d = e.sub(d);
                        c = d.length() * .5;
                        d = Ue(d);
                        c = Ek(["ddl-connection-lunar-cycle"], Te(d.W(), -c), Te(d.W(), -c));
                        break a;
                    default:
                        throw Error("E`" + b);
                }
            }
            c.style.opacity = "0";a.Zc.appendChild(c);a.vb = c
        }
        a.type = b
    }
    var Fk = class extends A {
        constructor(a, b, c) {
            super();
            this.Zc = a;
            this.bc = b;
            this.hc = c;
            this.id = Ck(b, c)
        }
    };

    function Ek(a, b, c) {
        const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
        d.classList.add(...a);
        d.setAttribute("x1", `${b.x}`);
        d.setAttribute("y1", `${b.y}`);
        d.setAttribute("x2", `${c.x}`);
        d.setAttribute("y2", `${c.y}`);
        return d
    }

    function Hk(a, b) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", `${a.x}`);
        c.setAttribute("cy", `${a.y}`);
        c.setAttribute("r", `${b}`);
        return c
    }

    function Ik(a, b, c) {
        var d = new D(0, 0);
        a = a.W().sub(b);
        a = new D(-a.y, a.x);
        Ue(a);
        Te(a, c);
        return d.W().add(a)
    };
    var Lk = class extends Aa {
        constructor(a, b, c) {
            super(() => this.create());
            this.U = a;
            this.i = b;
            this.j = c
        }
        create() {
            const a = this.U.get(E).position,
                b = this.U.get(V).Ca,
                c = this.U.get(W).Sa,
                d = this.U.get(T).el;
            d.classList.add("ddl-card-selected");
            const e = [],
                f = [];
            Jk(a, this.i.pos) || f.push(v(new Qe(this.j * .7, a.W(), this.i.pos, a), La));
            Jk(b, this.i.size) || f.push(v(new Qe(this.j * .7, b.W(), this.i.size, b), La));
            f.length > 0 && e.push(new t(f));
            Kk(c, this.i.Sa) || e.push(v(new w(this.j * .3, c, this.i.Sa, g => {
                jk(this.U, g)
            }), La));
            e.push(new q(() => {
                d.classList.remove("ddl-card-selected")
            }));
            return new p(e)
        }
    };

    function Jk(a, b) {
        return Kk(a.x, b.x, .001) && Kk(a.y, b.y, .001)
    }

    function Kk(a, b, c = .001) {
        return Math.abs(a - b) <= c
    };

    function Mk(a, b, c) {
        C(a.j, b);
        c.appendChild(b.get(T).el)
    }

    function Nk(a) {
        if (sj)
            for (const b of a.tiles.values()) b.get(T).el.addEventListener("mouseover", () => {
                var c = b.get(X).id;
                console.log(`tile: ${c}`);
                c = Ok(a, c);
                a.o.push(...c);
                for (const d of c.map(e => e.get(T).el)) d.style.filter = "drop-shadow(0 0 10px #f00)"
            }), b.get(T).el.addEventListener("mouseout", () => {
                for (const c of a.o.map(d => d.get(T).el)) c.style.filter = "";
                a.o = []
            })
    }

    function Pk(a, b) {
        return m(function*() {
            for (var c of a.g.tiles) {
                var d = Ak(c.id, new D(c.pos.x, c.pos.y), a.tileSize.W()),
                    e = d.get(X);
                a.tiles.set(e.id, d);
                Mk(a, d, a.u)
            }
            for (const [l, n] of Object.entries(a.g.neighbors)) {
                c = l;
                d = n.map(u => a.tiles.get(u));
                a.neighbors.set(c, d);
                c = a.tiles.get(c);
                for (var f of d) d = Ck(c, f), a.i.has(d) || (e = Dk(c, f), a.i.set(d, e), Mk(a, e, a.H))
            }
            const g = a.j.find(Fk).map(l => l.get(Fk).Zc),
                h = a.j.find(X, T).map(l => l.get(T).el);
            f = [...g, ...h];
            for (const l of f) l.style.opacity = "0";
            Nk(a);
            yield P(new p([new p([new w(200,
                0, 1, l => {
                    for (const n of h) n.style.opacity = `${l}`
                }), new w(200, 0, 1, l => {
                for (const n of g) n.style.opacity = `${l}`
            })])]), b)
        })
    }

    function Qk(a, b) {
        return a.i.get(b)
    }

    function Ok(a, b) {
        return a.neighbors.get(b)
    }

    function Rk(a) {
        return new D(a.g.cardSize, a.g.cardSize)
    }

    function Sk(a) {
        return new D(a.g.cardExpandedSize, a.g.cardExpandedSize)
    }

    function Tk(a, b, c, d) {
        return m(function*() {
            b.get(X).U = c;
            c.get(W).va = b;
            S(R(), x.Fe);
            const e = new Lk(c, {
                pos: b.get(E).position,
                size: new D(a.g.cardSize, a.g.cardSize),
                Sa: 0
            }, 700);
            yield P(e, d)
        })
    }

    function Uk(a) {
        a = a.get(X);
        if (a.U) {
            var b = a.U;
            a.U = void 0;
            b.get(W).va = void 0;
            return b
        }
    }
    var Vk = class {
        constructor(a, b, c, d) {
            this.g = a;
            this.u = b;
            this.H = c;
            this.j = d;
            this.neighbors = new Map;
            this.tiles = new Map;
            this.i = new Map;
            this.o = [];
            this.tileSize = new D(this.g.tileSize, this.g.tileSize)
        }
    };
    var Wk = {
            bigWheel: {
                id: "bigWheel",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 89,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 182,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 273,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 364,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 455,
                        y: 356
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 89,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 273,
                        y: 490
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 89,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 89,
                        y: 629
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 182,
                        y: 629
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 364,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 455,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "5"],
                    1: ["0", "2", "7"],
                    2: ["1", "3"],
                    3: ["2",
                        "4", "7"
                    ],
                    4: ["3", "6"],
                    5: ["0", "7", "8"],
                    6: ["4", "7", "9"],
                    7: "1 3 5 6 8 9 11 13".split(" "),
                    8: ["5", "7", "10"],
                    9: ["6", "7", "14"],
                    10: ["8", "11"],
                    11: ["7", "10", "12"],
                    12: ["11", "13"],
                    13: ["7", "12", "14"],
                    14: ["9", "13"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            board3x3: {
                id: "board3x3",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 174,
                        y: 396
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 270,
                        y: 396
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 366,
                        y: 396
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 174,
                        y: 492
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 270,
                        y: 492
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 366,
                        y: 492
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 174,
                        y: 588
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 270,
                        y: 588
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 366,
                        y: 588
                    }
                }],
                neighbors: {
                    0: ["1", "3"],
                    1: ["0", "2", "4"],
                    2: ["1", "5"],
                    3: ["0", "4", "6"],
                    4: ["1", "3", "5", "7"],
                    5: ["2", "4", "8"],
                    6: ["3", "7"],
                    7: ["4", "6", "8"],
                    8: ["5", "7"]
                },
                cardSize: 74,
                cardExpandedSize: 84,
                tileSize: 50
            },
            board3x4: {
                id: "board3x4",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 122,
                        y: 376
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 221,
                        y: 376
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 320,
                        y: 376
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 418,
                        y: 376
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 122,
                        y: 487
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 221,
                        y: 487
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 320,
                        y: 487
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 418,
                        y: 487
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 122,
                        y: 598
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 221,
                        y: 598
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 320,
                        y: 598
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 418,
                        y: 598
                    }
                }],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "2", "5"],
                    2: ["1", "3", "6"],
                    3: ["2", "7"],
                    4: ["0", "5", "8"],
                    5: ["1", "4", "6", "9"],
                    6: ["2", "5", "7", "10"],
                    7: ["3", "6", "11"],
                    8: ["4", "9"],
                    9: ["5", "8", "10"],
                    10: ["6", "9", "11"],
                    11: ["7", "10"]
                },
                cardSize: 74,
                cardExpandedSize: 84,
                tileSize: 50
            },
            board4x3: {
                id: "board4x3",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 180,
                            y: 356
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 271,
                            y: 356
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 362,
                            y: 356
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 180,
                            y: 447
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 271,
                            y: 447
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 362,
                            y: 447
                        }
                    },
                    {
                        id: "6",
                        pos: {
                            x: 180,
                            y: 538
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 271,
                            y: 538
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 362,
                            y: 538
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 180,
                            y: 629
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 271,
                            y: 629
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 362,
                            y: 629
                        }
                    }
                ],
                neighbors: {
                    0: ["1", "3"],
                    1: ["0", "2", "4"],
                    2: ["1", "5"],
                    3: ["0", "4", "6"],
                    4: ["1", "3", "5", "7"],
                    5: ["2", "4", "8"],
                    6: ["3", "7", "9"],
                    7: ["4", "6", "8", "10"],
                    8: ["5", "7", "11"],
                    9: ["6", "10"],
                    10: ["7", "9", "11"],
                    11: ["8", "10"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            board4x4: {
                id: "board4x4",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 227,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 318,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 227,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 136,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 409,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "2", "5"],
                    2: ["1", "3", "6"],
                    3: ["2", "7"],
                    4: ["0", "5", "8"],
                    5: ["1", "4", "6", "9"],
                    6: ["2", "5", "7", "10"],
                    7: ["3", "6", "11"],
                    8: ["4", "9", "12"],
                    9: ["5", "8", "10", "13"],
                    10: ["6", "9", "11", "14"],
                    11: ["7", "10", "15"],
                    12: ["8", "13"],
                    13: ["9", "12", "14"],
                    14: ["10", "13", "15"],
                    15: ["11", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            board4x5: {
                id: "board4x5",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 91,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 182,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 273,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 364,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 455,
                        y: 356
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 91,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 182,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 273,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 364,
                        y: 447
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 91,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 182,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 273,
                        y: 538
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 364,
                        y: 538
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 91,
                        y: 629
                    }
                }, {
                    id: "16",
                    pos: {
                        x: 182,
                        y: 629
                    }
                }, {
                    id: "17",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }, {
                    id: "18",
                    pos: {
                        x: 364,
                        y: 629
                    }
                }, {
                    id: "19",
                    pos: {
                        x: 455,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "5"],
                    1: ["0", "2", "6"],
                    2: ["1", "3", "7"],
                    3: ["2", "4", "8"],
                    4: ["3", "9"],
                    5: ["0", "6", "10"],
                    6: ["1", "5", "7", "11"],
                    7: ["2", "6", "8", "12"],
                    8: ["3", "7", "9", "13"],
                    9: ["4", "8", "14"],
                    10: ["5", "11", "15"],
                    11: ["6", "10", "12",
                        "16"
                    ],
                    12: ["7", "11", "13", "17"],
                    13: ["8", "12", "14", "18"],
                    14: ["9", "13", "19"],
                    15: ["10", "16"],
                    16: ["11", "15", "17"],
                    17: ["12", "16", "18"],
                    18: ["13", "17", "19"],
                    19: ["14", "18"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            bow: {
                id: "bow",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 89,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 455,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 182,
                        y: 402
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 364,
                        y: 402
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 89,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 182,
                        y: 493
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 273,
                        y: 493
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 364,
                        y: 493
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 89,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 182,
                        y: 584
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 364,
                        y: 584
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 89,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 455,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["2", "4"],
                    1: ["3", "5"],
                    2: ["0", "4", "7"],
                    3: ["1", "5", "7"],
                    4: ["0", "2", "6", "9"],
                    5: ["1", "3", "8", "10"],
                    6: ["4", "7", "9"],
                    7: "2 3 6 8 11 12".split(" "),
                    8: ["5", "7", "10"],
                    9: ["4", "6", "11", "13"],
                    10: ["5", "8", "12", "14"],
                    11: ["7", "9", "13"],
                    12: ["7", "10", "14"],
                    13: ["9", "11"],
                    14: ["10", "12"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            bridge: {
                id: "bridge",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 111,
                        y: 396
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 207,
                        y: 396
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 333,
                        y: 396
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 429,
                        y: 396
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 111,
                        y: 492
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 207,
                        y: 492
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 333,
                        y: 492
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 429,
                        y: 492
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 111,
                        y: 588
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 207,
                        y: 588
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 333,
                        y: 588
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 429,
                        y: 588
                    }
                }],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "5"],
                    2: ["3", "6"],
                    3: ["2", "7"],
                    4: ["0", "5", "8"],
                    5: ["1", "4", "6", "9"],
                    6: ["2", "5", "7", "10"],
                    7: ["3", "6", "11"],
                    8: ["4", "9"],
                    9: ["5", "8"],
                    10: ["6", "11"],
                    11: ["7", "10"]
                },
                cardSize: 74,
                cardExpandedSize: 84,
                tileSize: 50
            },
            center_ring: {
                id: "center_ring",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 136,
                        y: 629
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 409,
                        y: 629
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 272,
                        y: 493
                    }
                }],
                neighbors: {
                    0: ["1", "4", "12"],
                    1: ["0", "2"],
                    2: ["1", "3"],
                    3: ["2", "5", "12"],
                    4: ["0",
                        "6"
                    ],
                    5: ["3", "7"],
                    6: ["4", "8"],
                    7: ["5", "11"],
                    8: ["6", "9", "12"],
                    9: ["8", "10"],
                    10: ["9", "11"],
                    11: ["7", "10", "12"],
                    12: ["0", "3", "8", "11"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            chutes_and_ladders: {
                id: "chutes_and_ladders",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 91,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 273,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 455,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 182,
                        y: 405
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 364,
                        y: 405
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 91,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 273,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 182,
                        y: 496
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 364,
                        y: 496
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 91,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 273,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 182,
                        y: 587
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 364,
                        y: 587
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 91,
                        y: 629
                    }
                }, {
                    id: "16",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }, {
                    id: "17",
                    pos: {
                        x: 455,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "3", "5"],
                    1: ["0", "2", "6"],
                    2: ["1", "4", "7"],
                    3: ["0", "5"],
                    4: ["2", "7"],
                    5: ["0", "3", "6", "10"],
                    6: "1 5 7 8 9 11".split(" "),
                    7: ["2", "4", "6", "12"],
                    8: ["6", "11"],
                    9: ["6", "11"],
                    10: ["5", "11", "13", "15"],
                    11: "6 8 9 10 12 16".split(" "),
                    12: ["7", "11", "14", "17"],
                    13: ["10", "15"],
                    14: ["12", "17"],
                    15: ["10", "13", "16"],
                    16: ["11", "15", "17"],
                    17: ["12", "14", "16"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            columns4x4: {
                id: "columns4x4",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 227,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 318,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 227,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 136,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 409,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["4"],
                    1: ["5"],
                    2: ["6"],
                    3: ["7"],
                    4: ["0", "8"],
                    5: ["1", "9"],
                    6: ["2", "10"],
                    7: ["3", "11"],
                    8: ["4", "12"],
                    9: ["5", "13"],
                    10: ["6", "14"],
                    11: ["7", "15"],
                    12: ["8"],
                    13: ["9"],
                    14: ["10"],
                    15: ["11"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            connected_diamonds: {
                id: "connected_diamonds",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 190,
                        y: 335
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 357,
                        y: 335
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 108,
                        y: 378
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 271,
                        y: 378
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 441,
                        y: 378
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 190,
                        y: 423
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 357,
                        y: 423
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 190,
                        y: 535
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 357,
                        y: 535
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 108,
                        y: 578
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 271,
                        y: 578
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 441,
                        y: 578
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 190,
                        y: 623
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 357,
                        y: 623
                    }
                }],
                neighbors: {
                    0: ["2", "3"],
                    1: ["3", "4"],
                    2: ["0", "5"],
                    3: ["0", "1", "5", "6"],
                    4: ["1", "6"],
                    5: ["2", "3", "7"],
                    6: ["3", "4", "8"],
                    7: ["5", "9", "10"],
                    8: ["6", "10", "11"],
                    9: ["7", "12"],
                    10: ["7", "8", "12", "13"],
                    11: ["8", "13"],
                    12: ["9", "10"],
                    13: ["10", "11"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            connected_rings: {
                id: "connected_rings",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 227,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 318,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 227,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 136,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 409,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1",
                        "4", "5"
                    ],
                    1: ["0", "2"],
                    2: ["1", "3"],
                    3: ["2", "6", "7"],
                    4: ["0", "8"],
                    5: ["0", "6", "9"],
                    6: ["3", "5", "10"],
                    7: ["3", "11"],
                    8: ["4", "12"],
                    9: ["5", "10", "12"],
                    10: ["6", "9", "15"],
                    11: ["7", "15"],
                    12: ["8", "9", "13"],
                    13: ["12", "14"],
                    14: ["13", "15"],
                    15: ["10", "11", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            connected_squares: {
                id: "connected_squares",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 227,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 318,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 227,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 136,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 409,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "5"],
                    2: ["3", "6"],
                    3: ["2", "7"],
                    4: ["0", "5", "8"],
                    5: ["1", "4", "6"],
                    6: ["2", "5", "7"],
                    7: ["3", "6", "11"],
                    8: ["4", "9", "12"],
                    9: ["8", "10", "13"],
                    10: ["9", "11", "14"],
                    11: ["7", "10", "15"],
                    12: ["8", "13"],
                    13: ["9", "12"],
                    14: ["10",
                        "15"
                    ],
                    15: ["11", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            diamond: {
                id: "diamond",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 273,
                        y: 401
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 182,
                        y: 447
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 364,
                        y: 447
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 89,
                        y: 496
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 273,
                        y: 496
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 455,
                        y: 496
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 182,
                        y: 538
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 364,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 273,
                        y: 581
                    }
                }],
                neighbors: {
                    0: ["1", "2"],
                    1: ["0", "3", "4"],
                    2: ["0", "4", "5"],
                    3: ["1", "6"],
                    4: ["1", "2", "6", "7"],
                    5: ["2", "7"],
                    6: ["3", "4", "8"],
                    7: ["4", "5", "8"],
                    8: ["6", "7"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            drop: {
                id: "drop",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 319,
                        y: 446.2109375
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 269,
                        y: 358.7109375
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 219,
                        y: 621.2890625
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 369,
                        y: 533.7109375
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 217,
                        y: 446.2890625
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 169,
                        y: 533.7109375
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 269,
                        y: 533.7109375
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 317,
                        y: 620.2890625
                    }
                }],
                neighbors: {
                    0: ["6", "3", "1"],
                    1: ["0", "4"],
                    2: ["6", "7", "5"],
                    3: ["0", "6", "7"],
                    4: ["1", "6", "5"],
                    5: ["2", "4", "6"],
                    6: "023457".split(""),
                    7: ["2", "3", "6"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            face: {
                id: "face",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 91,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 182,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 273,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 364,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 455,
                        y: 356
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 91,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 273,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 91,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 182,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 364,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 91,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 182,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 364,
                        y: 629
                    }
                }, {
                    id: "16",
                    pos: {
                        x: 455,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1",
                        "5"
                    ],
                    1: ["0", "2"],
                    2: ["1", "3", "6"],
                    3: ["2", "4"],
                    4: ["3", "7"],
                    5: ["0", "8"],
                    6: ["2", "9", "10"],
                    7: ["4", "11"],
                    8: ["5", "9", "12"],
                    9: ["6", "8", "10", "13"],
                    10: ["6", "9", "11", "15"],
                    11: ["7", "10", "16"],
                    12: ["8", "13"],
                    13: ["9", "12", "14"],
                    14: ["13", "15"],
                    15: ["10", "14", "16"],
                    16: ["11", "15"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            jar: {
                id: "jar",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 444,
                            y: 500.5
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 369,
                            y: 625.5
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 169,
                            y: 625.5
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 94,
                            y: 500.5
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 469,
                            y: 400.5
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 219,
                            y: 525.5
                        }
                    },
                    {
                        id: "6",
                        pos: {
                            x: 319,
                            y: 525.5
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 269,
                            y: 625.5
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 69,
                            y: 400.5
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 184,
                            y: 354.5
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 270,
                            y: 354.5
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 356,
                            y: 354.5
                        }
                    }, {
                        id: "12",
                        pos: {
                            x: 269,
                            y: 443.078125
                        }
                    }, {
                        id: "13",
                        pos: {
                            x: 356,
                            y: 441.5
                        }
                    }, {
                        id: "14",
                        pos: {
                            x: 184,
                            y: 441.5
                        }
                    }
                ],
                neighbors: {
                    0: ["4", "6"],
                    1: ["7"],
                    2: ["7"],
                    3: ["8", "5"],
                    4: ["0", "11"],
                    5: ["3", "7", "6", "14"],
                    6: ["0", "5", "7", "13"],
                    7: ["1", "2", "5", "6"],
                    8: ["3", "9"],
                    9: ["8", "14", "10"],
                    10: ["9", "13", "14", "11"],
                    11: ["4", "10", "13"],
                    12: ["14", "13"],
                    13: ["6", "10", "11",
                        "12"
                    ],
                    14: ["5", "9", "10", "12"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            jewel: {
                id: "jewel",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 140,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 231,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 313,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 404,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 89,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 182,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 273,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 364,
                        y: 447
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 227,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 181,
                        y: 629
                    }
                }, {
                    id: "14",
                    pos: {
                        x: 272,
                        y: 629
                    }
                }, {
                    id: "15",
                    pos: {
                        x: 363,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "4", "5"],
                    1: ["0", "2", "6"],
                    2: ["1", "3", "6"],
                    3: ["2", "7", "8"],
                    4: ["0", "5", "9"],
                    5: ["0", "4", "9"],
                    6: ["1", "2", "10", "11"],
                    7: ["3", "8", "12"],
                    8: ["3", "7", "12"],
                    9: ["4", "5", "10", "13"],
                    10: ["6", "9", "13", "14"],
                    11: ["6", "12", "14", "15"],
                    12: ["7", "8", "11", "15"],
                    13: ["9", "10", "14"],
                    14: ["10", "11", "13", "15"],
                    15: ["11", "12", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            lotus: {
                id: "lotus",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 182,
                            y: 356
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 364,
                            y: 356
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 89,
                            y: 402
                        }
                    },
                    {
                        id: "3",
                        pos: {
                            x: 455,
                            y: 402
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 182,
                            y: 447
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 364,
                            y: 447
                        }
                    }, {
                        id: "6",
                        pos: {
                            x: 89,
                            y: 493
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 273,
                            y: 493
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 455,
                            y: 493
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 182,
                            y: 538
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 364,
                            y: 538
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 89,
                            y: 584
                        }
                    }, {
                        id: "12",
                        pos: {
                            x: 455,
                            y: 584
                        }
                    }, {
                        id: "13",
                        pos: {
                            x: 182,
                            y: 629
                        }
                    }, {
                        id: "14",
                        pos: {
                            x: 273,
                            y: 629
                        }
                    }, {
                        id: "15",
                        pos: {
                            x: 364,
                            y: 629
                        }
                    }
                ],
                neighbors: {
                    0: ["4"],
                    1: ["5"],
                    2: ["4", "6"],
                    3: ["5", "8"],
                    4: ["0", "2", "7", "9"],
                    5: ["1", "3", "7", "10"],
                    6: ["2", "9", "11"],
                    7: ["4", "5", "14"],
                    8: ["3", "10", "12"],
                    9: ["4",
                        "6", "13"
                    ],
                    10: ["5", "8", "15"],
                    11: ["6", "13"],
                    12: ["8", "15"],
                    13: ["9", "11", "14"],
                    14: ["7", "13", "15"],
                    15: ["10", "12", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            oh: {
                id: "oh",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 355
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 409,
                        y: 355
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 227,
                        y: 400
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 318,
                        y: 400
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 134,
                        y: 492
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 270,
                        y: 492
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 409,
                        y: 492
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 227,
                        y: 583
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 318,
                        y: 583
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 136,
                        y: 628
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 409,
                        y: 628
                    }
                }],
                neighbors: {
                    0: ["4"],
                    1: ["6"],
                    2: ["3", "4"],
                    3: ["2", "6"],
                    4: ["0", "2", "5", "7", "9"],
                    5: ["4", "6"],
                    6: ["1", "3", "5", "8", "10"],
                    7: ["4", "8"],
                    8: ["6", "7"],
                    9: ["4"],
                    10: ["6"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            outer_ring: {
                id: "outer_ring",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 182,
                            y: 356
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 273,
                            y: 356
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 364,
                            y: 356
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 182,
                            y: 447
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 364,
                            y: 447
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 182,
                            y: 538
                        }
                    }, {
                        id: "6",
                        pos: {
                            x: 364,
                            y: 538
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 182,
                            y: 629
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 273,
                            y: 629
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 364,
                            y: 629
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 91,
                            y: 403
                        }
                    },
                    {
                        id: "11",
                        pos: {
                            x: 91,
                            y: 494
                        }
                    }, {
                        id: "12",
                        pos: {
                            x: 91,
                            y: 585
                        }
                    }, {
                        id: "13",
                        pos: {
                            x: 455,
                            y: 403
                        }
                    }, {
                        id: "14",
                        pos: {
                            x: 455,
                            y: 494
                        }
                    }, {
                        id: "15",
                        pos: {
                            x: 455,
                            y: 585
                        }
                    }
                ],
                neighbors: {
                    0: ["1", "3", "10"],
                    1: ["0", "2"],
                    2: ["1", "4", "13"],
                    3: ["0", "5", "11"],
                    4: ["2", "6", "14"],
                    5: ["3", "7", "11"],
                    6: ["4", "9", "14"],
                    7: ["5", "8", "12"],
                    8: ["7", "9"],
                    9: ["6", "8", "15"],
                    10: ["0", "11"],
                    11: ["3", "5", "10", "12"],
                    12: ["7", "11"],
                    13: ["2", "14"],
                    14: ["4", "6", "13", "15"],
                    15: ["9", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            plusSign: {
                id: "plusSign",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 227,
                        y: 447
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 318,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 227,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "3"],
                    1: ["0", "4"],
                    2: ["3", "6"],
                    3: ["0", "2", "4", "7"],
                    4: ["1", "3", "5", "8"],
                    5: ["4", "9"],
                    6: ["2", "7"],
                    7: ["3", "6", "8", "10"],
                    8: ["4", "7", "9", "11"],
                    9: ["5", "8"],
                    10: ["7", "11"],
                    11: ["8", "10"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            pyramid: {
                id: "pyramid",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 270,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 225,
                        y: 447
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 316,
                        y: 447
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 178,
                        y: 538
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 270,
                        y: 538
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 362,
                        y: 538
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 132,
                        y: 629
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 225,
                        y: 629
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 316,
                        y: 629
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 407,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "2", "4"],
                    1: ["0", "3", "7"],
                    2: ["0", "5", "8"],
                    3: ["1", "6"],
                    4: ["0", "7", "8"],
                    5: ["2", "9"],
                    6: ["3", "7"],
                    7: ["1", "4", "6", "8"],
                    8: ["2", "4", "7", "9"],
                    9: ["5",
                        "8"
                    ]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            rain: {
                id: "rain",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 369,
                        y: 552.5
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 269,
                        y: 402.5
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 169,
                        y: 552.5
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 269,
                        y: 627.5
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 119,
                        y: 352.5
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 169,
                        y: 452.5
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 69,
                        y: 452.5
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 419,
                        y: 352.5
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 369,
                        y: 452.5
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 469,
                        y: 452.5
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 269,
                        y: 552.5
                    }
                }],
                neighbors: {
                    0: ["1", "3", "10"],
                    1: ["0", "2", "10"],
                    2: ["1", "3", "10"],
                    3: ["0", "2"],
                    4: ["5", "6"],
                    5: ["4", "6"],
                    6: ["4", "5"],
                    7: ["8", "9"],
                    8: ["7", "9"],
                    9: ["7", "8"],
                    10: ["0", "2", "1"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            rings: {
                id: "rings",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 136,
                            y: 356
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 227,
                            y: 356
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 318,
                            y: 356
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 409,
                            y: 356
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 136,
                            y: 447
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 227,
                            y: 447
                        }
                    }, {
                        id: "6",
                        pos: {
                            x: 318,
                            y: 447
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 409,
                            y: 447
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 136,
                            y: 538
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 227,
                            y: 538
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 318,
                            y: 538
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 409,
                            y: 538
                        }
                    }, {
                        id: "12",
                        pos: {
                            x: 136,
                            y: 629
                        }
                    }, {
                        id: "13",
                        pos: {
                            x: 227,
                            y: 629
                        }
                    },
                    {
                        id: "14",
                        pos: {
                            x: 318,
                            y: 629
                        }
                    }, {
                        id: "15",
                        pos: {
                            x: 409,
                            y: 629
                        }
                    }
                ],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "2"],
                    2: ["1", "3"],
                    3: ["2", "7"],
                    4: ["0", "8"],
                    5: ["6", "9"],
                    6: ["5", "10"],
                    7: ["3", "11"],
                    8: ["4", "12"],
                    9: ["5", "10"],
                    10: ["6", "9"],
                    11: ["7", "15"],
                    12: ["8", "13"],
                    13: ["12", "14"],
                    14: ["13", "15"],
                    15: ["11", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            rows3x4: {
                id: "rows3x4",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 122,
                        y: 376
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 221,
                        y: 376
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 320,
                        y: 376
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 418,
                        y: 376
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 122,
                        y: 487
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 221,
                        y: 487
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 320,
                        y: 487
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 418,
                        y: 487
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 122,
                        y: 598
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 221,
                        y: 598
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 320,
                        y: 598
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 418,
                        y: 598
                    }
                }],
                neighbors: {
                    0: ["1"],
                    1: ["0", "2"],
                    2: ["1", "3"],
                    3: ["2"],
                    4: ["5"],
                    5: ["4", "6"],
                    6: ["5", "7"],
                    7: ["6"],
                    8: ["9"],
                    9: ["8", "10"],
                    10: ["9", "11"],
                    11: ["10"]
                },
                cardSize: 74,
                cardExpandedSize: 84,
                tileSize: 50
            },
            snowflake: {
                id: "snowflake",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 154,
                        y: 375
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 386,
                        y: 375
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 270,
                        y: 395
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 174,
                        y: 491
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 270,
                        y: 491
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 366,
                        y: 491
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 270,
                        y: 587
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 154,
                        y: 607
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 386,
                        y: 607
                    }
                }],
                neighbors: {
                    0: ["4"],
                    1: ["4"],
                    2: ["4"],
                    3: ["4"],
                    4: "01235678".split(""),
                    5: ["4"],
                    6: ["4"],
                    7: ["4"],
                    8: ["4"]
                },
                cardSize: 74,
                cardExpandedSize: 84,
                tileSize: 50
            },
            snowflake_hard: {
                id: "snowflake_hard",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 91,
                            y: 355
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 182,
                            y: 355
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 364,
                            y: 355
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 455,
                            y: 355
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 273,
                            y: 400
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 182,
                            y: 446
                        }
                    }, {
                        id: "6",
                        pos: {
                            x: 364,
                            y: 446
                        }
                    },
                    {
                        id: "7",
                        pos: {
                            x: 91,
                            y: 495
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 273,
                            y: 495
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 455,
                            y: 495
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 182,
                            y: 537
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 364,
                            y: 537
                        }
                    }, {
                        id: "12",
                        pos: {
                            x: 273,
                            y: 580
                        }
                    }, {
                        id: "13",
                        pos: {
                            x: 91,
                            y: 628
                        }
                    }, {
                        id: "14",
                        pos: {
                            x: 182,
                            y: 628
                        }
                    }, {
                        id: "15",
                        pos: {
                            x: 364,
                            y: 628
                        }
                    }, {
                        id: "16",
                        pos: {
                            x: 455,
                            y: 628
                        }
                    }
                ],
                neighbors: {
                    0: ["1", "5"],
                    1: ["0"],
                    2: ["3"],
                    3: ["2", "6"],
                    4: ["5", "6"],
                    5: ["0", "4", "7", "8"],
                    6: ["3", "4", "8", "9"],
                    7: ["5", "10"],
                    8: ["5", "6", "10", "11"],
                    9: ["6", "11"],
                    10: ["7", "8", "12", "13"],
                    11: ["8", "9", "12", "16"],
                    12: ["10", "11"],
                    13: ["10", "14"],
                    14: ["13"],
                    15: ["16"],
                    16: ["11", "15"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            squared_corners: {
                id: "squared_corners",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 136,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 356
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 136,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 227,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 136,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 318,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 136,
                        y: 629
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 409,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "2", "5"],
                    2: ["1", "3"],
                    3: ["2", "6"],
                    4: ["0", "5", "7"],
                    5: ["1", "4", "8"],
                    6: ["3", "9"],
                    7: ["4", "10"],
                    8: ["5", "9", "12"],
                    9: ["6", "8", "13"],
                    10: ["7", "11"],
                    11: ["10", "12"],
                    12: ["8", "11", "13"],
                    13: ["9", "12"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            squares: {
                id: "squares",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 136,
                            y: 356
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 222,
                            y: 356
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 328,
                            y: 356
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 414,
                            y: 356
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 136,
                            y: 442
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 222,
                            y: 442
                        }
                    }, {
                        id: "6",
                        pos: {
                            x: 328,
                            y: 442
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 414,
                            y: 442
                        }
                    },
                    {
                        id: "8",
                        pos: {
                            x: 136,
                            y: 543
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 222,
                            y: 543
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 328,
                            y: 543
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 414,
                            y: 543
                        }
                    }, {
                        id: "12",
                        pos: {
                            x: 136,
                            y: 629
                        }
                    }, {
                        id: "13",
                        pos: {
                            x: 222,
                            y: 629
                        }
                    }, {
                        id: "14",
                        pos: {
                            x: 328,
                            y: 629
                        }
                    }, {
                        id: "15",
                        pos: {
                            x: 414,
                            y: 629
                        }
                    }
                ],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "5"],
                    2: ["3", "6"],
                    3: ["2", "7"],
                    4: ["0", "5"],
                    5: ["4", "1"],
                    6: ["2", "7"],
                    7: ["3", "6"],
                    8: ["9", "12"],
                    9: ["8", "13"],
                    10: ["11", "14"],
                    11: ["10", "15"],
                    12: ["8", "13"],
                    13: ["9", "12"],
                    14: ["10", "15"],
                    15: ["11", "14"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            trampoline: {
                id: "trampoline",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 190,
                        y: 350
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 357,
                        y: 350
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 271,
                        y: 393
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 357,
                        y: 438
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 190,
                        y: 438
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 190,
                        y: 530
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 357,
                        y: 530
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 271,
                        y: 573
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 190,
                        y: 618
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 357,
                        y: 618
                    }
                }],
                neighbors: {
                    0: ["1", "2"],
                    1: ["0", "2"],
                    2: ["0", "1", "3", "4"],
                    3: ["2", "5"],
                    4: ["2", "6"],
                    5: ["3", "7"],
                    6: ["4", "7"],
                    7: ["5", "6", "8", "9"],
                    8: ["7", "9"],
                    9: ["7", "8"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            tree: {
                id: "tree",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 273,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 182,
                        y: 447
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 273,
                        y: 447
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 364,
                        y: 447
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 89,
                        y: 538
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 182,
                        y: 538
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 273,
                        y: 538
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 364,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "2", "3"],
                    1: ["0", "2", "4", "5"],
                    2: ["0", "1", "3", "6"],
                    3: ["0", "2", "7", "8"],
                    4: ["1", "5"],
                    5: ["1", "4", "6"],
                    6: ["2", "5", "7", "9"],
                    7: ["3", "6", "8"],
                    8: ["3", "7"],
                    9: ["6"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            ufo: {
                id: "ufo",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 89,
                        y: 353
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 273,
                        y: 353
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 457,
                        y: 353
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 182,
                        y: 447
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 273,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 364,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 89,
                        y: 538
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 182,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 273,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 364,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 457,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["3"],
                    1: ["3", "4", "5"],
                    2: ["5"],
                    3: ["0", "1", "4", "6", "7"],
                    4: ["1", "3", "5", "8"],
                    5: ["1", "2", "4", "9", "10"],
                    6: ["3", "7"],
                    7: ["3", "6", "8"],
                    8: ["4", "7", "9", "11"],
                    9: ["5", "8", "10"],
                    10: ["5",
                        "9"
                    ],
                    11: ["8"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            umbrella: {
                id: "umbrella",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 272,
                        y: 359.2109375
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 178,
                        y: 360.2109375
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 366,
                        y: 360.2109375
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 366,
                        y: 446.7109375
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 457,
                        y: 446.7890625
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 178,
                        y: 446.7109375
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 81,
                        y: 446.7890625
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 272,
                        y: 534.2109375
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 271,
                        y: 620.7890625
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 178,
                        y: 620.7890625
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 272,
                        y: 446.7109375
                    }
                }],
                neighbors: {
                    0: ["1", "2", "5",
                        "3", "10"
                    ],
                    1: ["0", "6"],
                    2: ["0", "4"],
                    3: ["0", "4", "10"],
                    4: ["2", "3"],
                    5: ["0", "6", "10"],
                    6: ["1", "5"],
                    7: ["8", "10"],
                    8: ["7", "9"],
                    9: ["8"],
                    10: ["0", "7", "3", "5"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            wave: {
                id: "wave",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 125,
                        y: 450
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 200,
                        y: 400
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 275,
                        y: 450
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 350,
                        y: 400
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 425,
                        y: 450
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 125,
                        y: 575
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 200,
                        y: 525
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 275,
                        y: 575
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 350,
                        y: 525
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 425,
                        y: 575
                    }
                }],
                neighbors: {
                    0: ["1",
                        "5"
                    ],
                    1: ["0", "2"],
                    2: ["1", "3", "7"],
                    3: ["2", "4"],
                    4: ["3", "9"],
                    5: ["6", "0"],
                    6: ["5", "7"],
                    7: ["6", "8", "2"],
                    8: ["7", "9"],
                    9: ["8", "4"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            wheel: {
                id: "wheel",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 227,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 318,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 134,
                        y: 447
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 409,
                        y: 447
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 272,
                        y: 493
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 134,
                        y: 538
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 409,
                        y: 538
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 227,
                        y: 629
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 318,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "2", "4"],
                    1: ["0", "3", "4"],
                    2: ["0", "4", "5"],
                    3: ["1",
                        "4", "6"
                    ],
                    4: "01235678".split(""),
                    5: ["2", "4", "7"],
                    6: ["3", "4", "8"],
                    7: ["4", "5", "8"],
                    8: ["4", "6", "7"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            wheel_square: {
                id: "wheel_square",
                tiles: [{
                        id: "0",
                        pos: {
                            x: 88,
                            y: 356
                        }
                    }, {
                        id: "1",
                        pos: {
                            x: 227,
                            y: 356
                        }
                    }, {
                        id: "2",
                        pos: {
                            x: 318,
                            y: 356
                        }
                    }, {
                        id: "3",
                        pos: {
                            x: 458,
                            y: 356
                        }
                    }, {
                        id: "4",
                        pos: {
                            x: 134,
                            y: 447
                        }
                    }, {
                        id: "5",
                        pos: {
                            x: 409,
                            y: 447
                        }
                    }, {
                        id: "6",
                        pos: {
                            x: 272,
                            y: 493
                        }
                    }, {
                        id: "7",
                        pos: {
                            x: 134,
                            y: 538
                        }
                    }, {
                        id: "8",
                        pos: {
                            x: 409,
                            y: 538
                        }
                    }, {
                        id: "9",
                        pos: {
                            x: 88,
                            y: 629
                        }
                    }, {
                        id: "10",
                        pos: {
                            x: 227,
                            y: 629
                        }
                    }, {
                        id: "11",
                        pos: {
                            x: 318,
                            y: 629
                        }
                    },
                    {
                        id: "12",
                        pos: {
                            x: 458,
                            y: 629
                        }
                    }
                ],
                neighbors: {
                    0: ["1", "9"],
                    1: ["0", "2", "4", "6"],
                    2: ["1", "3", "5", "6"],
                    3: ["2", "12"],
                    4: ["1", "6", "7"],
                    5: ["2", "6", "8"],
                    6: "1 2 4 5 7 8 10 11".split(" "),
                    7: ["4", "6", "10"],
                    8: ["5", "6", "11"],
                    9: ["0", "10"],
                    10: ["6", "7", "9", "11"],
                    11: ["6", "8", "10", "12"],
                    12: ["3", "11"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            wolf: {
                id: "wolf",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 355,
                        y: 441.5
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 218,
                        y: 525.5
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 318,
                        y: 525.5
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 268,
                        y: 625.5
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 268,
                        y: 443.078125
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 183,
                        y: 357.078125
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 355,
                        y: 354.5
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 183,
                        y: 441.5
                    }
                }],
                neighbors: {
                    0: ["6", "2", "4"],
                    1: ["3", "2", "7"],
                    2: ["0", "1", "3"],
                    3: ["1", "2"],
                    4: ["0", "7", "5", "6"],
                    5: ["4", "7"],
                    6: ["0", "4"],
                    7: ["1", "4", "5"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            },
            zero: {
                id: "zero",
                tiles: [{
                    id: "0",
                    pos: {
                        x: 182,
                        y: 356
                    }
                }, {
                    id: "1",
                    pos: {
                        x: 273,
                        y: 356
                    }
                }, {
                    id: "2",
                    pos: {
                        x: 364,
                        y: 356
                    }
                }, {
                    id: "3",
                    pos: {
                        x: 89,
                        y: 447
                    }
                }, {
                    id: "4",
                    pos: {
                        x: 182,
                        y: 447
                    }
                }, {
                    id: "5",
                    pos: {
                        x: 363,
                        y: 447
                    }
                }, {
                    id: "6",
                    pos: {
                        x: 455,
                        y: 447
                    }
                }, {
                    id: "7",
                    pos: {
                        x: 89,
                        y: 538
                    }
                }, {
                    id: "8",
                    pos: {
                        x: 182,
                        y: 538
                    }
                }, {
                    id: "9",
                    pos: {
                        x: 363,
                        y: 538
                    }
                }, {
                    id: "10",
                    pos: {
                        x: 455,
                        y: 538
                    }
                }, {
                    id: "11",
                    pos: {
                        x: 182,
                        y: 629
                    }
                }, {
                    id: "12",
                    pos: {
                        x: 273,
                        y: 629
                    }
                }, {
                    id: "13",
                    pos: {
                        x: 364,
                        y: 629
                    }
                }],
                neighbors: {
                    0: ["1", "4"],
                    1: ["0", "2"],
                    2: ["1", "5"],
                    3: ["4", "7"],
                    4: ["0", "3", "8"],
                    5: ["2", "6", "9"],
                    6: ["5", "10"],
                    7: ["3", "8"],
                    8: ["4", "7", "11"],
                    9: ["5", "10", "13"],
                    10: ["6", "9"],
                    11: ["8", "12"],
                    12: ["11", "13"],
                    13: ["9", "12"]
                },
                cardSize: 65,
                cardExpandedSize: 75,
                tileSize: 50
            }
        },
        Xk = Wk.board3x3,
        Yk = Wk.board3x3,
        Zk = Wk.board3x3,
        $k = Wk.wolf,
        al = Wk.rain,
        bl = Wk.jar,
        cl = ["drop",
            "wave", "squares", "wolf"
        ].map(a => Wk[a]),
        dl = ["rain", "umbrella", "wheel_square", "connected_squares", "board4x4"].map(a => Wk[a]),
        el = ["jar", "chutes_and_ladders", "jewel", "snowflake_hard", "board4x5"].map(a => Wk[a]);
    const fl = new D(200, 200);

    function gl(a, b) {
        if (a.type === 1) {
            var c = Pj[b].Ka;
            hl(a, "learn_more").addEventListener("click", () => {
                dg(U(c.query))
            })
        }
    }

    function il(a, b, c = 0) {
        a.i = !0;
        a.wa.style.marginTop = `${c}px`;
        c = vi().j;
        var d = b.mb;
        var e = document.createElement("div");
        e.style.position = "absolute";
        e.style.userSelect = "none";
        e.style.MozUserSelect = "none";
        e.style.webkitUserSelect = "none";
        e.style.webkitUserSelect = "none";
        e.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        e.unselectable = "on";
        var f = d[3];
        let g = d[4];
        const h = d[5] || 1;
        h && h !== 1 && c.i[cf(d)] && (f = Math.floor(f / h), g = Math.floor(g / h));
        e.style.width = `${f}px`;
        e.style.height = `${g}px`;
        e = [e, pi(c, d), oi(c, d)];
        d = e[0];
        f = e[2];
        d.style.background = e[1];
        f && (d.style.backgroundSize = f);
        for (; a.g.lastChild;) a.g.lastChild.remove();
        a.g.appendChild(d);
        c = c.getSize(b.mb);
        c = new D(fl.x / c.width, fl.y / c.height);
        d.style.transform = `scale(${c.x}, ${c.y})`;
        c = Pj[b.id].Ka;
        a.u.innerText = U(c.title);
        a.o.innerText = U(c.description);
        K(a.u, 45, 400, 45, 30);
        K(a.v, 35, 400, 35, 25);
        K(a.o.parentElement, 26, 400, 150, 18);
        a.Db && K(a.Db, 26, 400, 52, 18);
        a.j && (a.j.innerText = U(c.info), K(a.j.parentElement, 26, 400, 154, 18));
        for (const l of a.buttons) K(l, 26, 180, 60, 18);
        gl(a,
            b.id);
        return a.H ? P(cj(a.wa), a.actions) : aj(a.wa, a.actions, 500)
    }

    function jl(a) {
        return m(function*() {
            yield a.H ? P(dj(a.wa), a.actions) : bj(a.wa, a.actions, 500);
            for (a.wa.style.marginTop = "0px"; a.g.lastChild;) a.g.lastChild.remove();
            a.i = !1
        })
    }

    function hl(a, b) {
        return a.buttons.find(c => c.dataset.id === b)
    }
    var kl = class {
        constructor(a, b, c, d = !0) {
            this.type = b;
            this.actions = c;
            this.H = d;
            this.i = !1;
            this.wa = O(ik, {
                yg: U("win_subtitle"),
                Db: this.type === 0 ? U("wildcard_warning") : "",
                buttons: this.type === 0 ? new Map([
                    ["play", U("play")],
                    ["cancel", U("cancel")]
                ]) : new Map([
                    ["learn_more", U("learn_more")],
                    ["continue", U("continue")]
                ])
            });
            this.g = this.wa.querySelector(".ddl-card-modal-card-container");
            this.u = this.wa.querySelector(".ddl-card-modal-card-title");
            this.v = this.wa.querySelector(".ddl-card-modal-card-subtitle");
            this.o = this.wa.querySelector(".ddl-card-modal-card-description");
            this.Db = this.wa.querySelector(".ddl-card-modal-buttons-title");
            this.j = this.wa.querySelector(".ddl-card-modal-card-info");
            this.buttons = Array.from(this.wa.querySelectorAll(".ddl-card-modal-button"));
            a.appendChild(this.wa)
        }
    };

    function ll(a, b) {
        b === "moon" ? (b = a.O, a = a.Pa) : (b = a.g, a = a.Pa + a.cardSize.y + 20);
        return {
            O: b,
            Pa: a
        }
    }

    function ml(a, b, c, d, e = !0, f = !0) {
        return m(function*() {
            mk(b, a.j, b.get(W).type === "moon" ? a.cardSize : new D(65, 65), 180, d, a.i);
            const {
                O: g,
                Pa: h
            } = ll(a, b.get(W).type);
            g.push(b);
            yield aj(b.get(T).el, c, 100);
            f && S(R(), x.Nd, 200);
            if (e) {
                const l = nl(g, h),
                    n = [];
                for (let u = 0; u < g.length; u++) {
                    const J = g[u],
                        ja = l[u],
                        db = J.get(V).Ca.W();
                    n.push(new Lk(J, {
                        pos: ja,
                        size: db,
                        Sa: a.o ? 0 : 180
                    }, 700))
                }
                yield P(new t(n), c)
            }
        })
    }

    function ol(a, b) {
        return m(function*() {
            const {
                O: c
            } = ll(a, b.get(W).type), d = c.findIndex(e => e === b);
            d >= 0 && c.splice(d, 1)
        })
    }
    var pl = class {
        constructor(a, b, c, d, e) {
            this.Pa = a;
            this.j = b;
            this.cardSize = c;
            this.o = d;
            this.i = e;
            this.O = [];
            this.g = []
        }
    };

    function nl(a, b) {
        const c = [];
        var d = (a.length - 1) * 15;
        d = 270 - (a.map(e => e.get(V).Ca.x).reduce((e, f) => e + f, 0) + d) / 2;
        for (const e of a) a = e.get(V).Ca.x, c.push(new D(d + a / 2, b)), d += a + 15;
        return c
    };
    var ql = class extends A {},
        rl = class extends A {};

    function sl(a) {
        return new B(new Y("player", 745, new D(640, 745), new D(84, 84), !0, a), new ql)
    }

    function tl(a) {
        return new B(new Y("moon", 233, new D(640, 233), new D(55, 55), !1, a), new rl)
    }
    var Y = class extends A {
        constructor(a, b, c, d, e, f) {
            super();
            this.id = a;
            this.Xc = !0;
            this.Tb = !1;
            this.Ma = new pl(b, c, d, e, f)
        }
    };

    function ul(a, b, c, d) {
        const e = c.get(kk);
        return new q(() => {
            if (d) {
                var f = vl[e.definition.id];
                f = d === "player" ? f.Ba : f.Aa;
                if (a.g === "pair") b === 0 && S(R(), f);
                else if (a.g === "full_moon") {
                    const g = b * 160 * .75;
                    S(R(), f, g)
                } else a.g === "run" && S(R(), f)
            }
            c.get(T).el.dataset.owner = d
        })
    }
    var wl = class {
        constructor(a, b, c, d) {
            this.O = a;
            this.g = b;
            this.V = c;
            this.i = d
        }
        create() {
            const a = this.V.get(Y),
                b = this.i ? void 0 : a.id;
            return this.O.map((c, d) => {
                c.get(W);
                const e = [];
                e.push(ul(this, d, c, b));
                e.push(new r(160));
                return new p(e)
            })
        }
    };
    const vl = {
        new_moon: {
            Ba: x.Be,
            Aa: x.Hd
        },
        waxing_crescent: {
            Ba: x.Hc,
            Aa: x.nc
        },
        first_quarter: {
            Ba: x.Ic,
            Aa: x.oc
        },
        waxing_gibbous: {
            Ba: x.Jc,
            Aa: x.qc
        },
        full_moon: {
            Ba: x.Ce,
            Aa: x.Id
        },
        waning_gibbous: {
            Ba: x.Jc,
            Aa: x.qc
        },
        third_quarter: {
            Ba: x.Ic,
            Aa: x.oc
        },
        waning_crescent: {
            Ba: x.Hc,
            Aa: x.nc
        }
    };

    function xl(a) {
        const b = yf();
        for (const c of a.i) {
            const d = c.get(T).el;
            d.classList.add("ddl-card-selectable");
            Jf(a.g, d, "click", () => {
                b.resolve(c);
                Kf(a.g)
            })
        }
        return b.promise
    }
    var yl = class {
        constructor(a) {
            this.i = a;
            this.g = new Hf
        }
    };
    let zl = 0;
    var Al = class {},
        Bl = class extends Al {
            constructor() {
                super();
                this.g = new Set(["run", "pair", "full_moon"])
            }
            Wc(a) {
                return this.g.has(a.type)
            }
        },
        Cl = class extends A {
            constructor(a, b, c, d = !1) {
                super();
                this.value = a;
                this.filter = b;
                this.Mb = c;
                this.Yf = d;
                this.id = zl++
            }
        },
        Dl = class extends Cl {},
        El = class extends Cl {},
        Fl = class extends Cl {};
    class Gl extends Al {
        Wc() {
            return !0
        }
    }
    class Hl extends Cl {
        constructor(a, b) {
            super(a, new Gl, b, !1)
        }
    }
    var Il = class extends Hl {},
        Jl = class extends Hl {};

    function Kl(a, b, c) {
        return c.find(a).map(d => ({
            wb: d,
            points: d.get(a)
        })).filter(({
            points: d
        }) => d.filter.Wc(b) && d.Mb === b.V.get(Y).id).map(({
            wb: d
        }) => d)
    }

    function Ll(a, b, c) {
        return c.find(a).map(d => ({
            wb: d,
            points: d.get(a)
        })).filter(({
            points: d
        }) => d.Mb === b.get(Y).id).map(({
            wb: d
        }) => d)
    }

    function Ml(a, b) {
        return a.map(c => c.get(b).value).reduce((c, d) => c * d, 1)
    }

    function Nl(a, b) {
        return a.map(c => c.get(b).value).reduce((c, d) => c + d, 0)
    };

    function Ol(a, b, c) {
        c = Kl(b, c, a.i);
        for (const d of c) d.get(b).Yf || a.g.add(d);
        return c
    }

    function Pl(a, b) {
        var c = Ol(a, Dl, b),
            d = Ol(a, El, b),
            e;
        a = Ol(a, Fl, b);
        let f = void 0;
        for (e of a)
            if (f === void 0 || e.get(Fl).id > f.get(Fl).id) f = e;
        if (e = f) return d = e.get(Fl).value, b.points = new tk(d, 1, 0, !0), b.points;
        c = Ml(c, Dl);
        d = Nl(d, El);
        a: {
            e = b.type;
            switch (e) {
                case "pair":
                    e = 1;
                    break a;
                case "full_moon":
                    e = 2;
                    break a;
                case "run":
                    e = b.O.length;
                    break a;
                default:
                    cb(e, `Unknown card set type: ${e}`)
            }
            e = void 0
        }
        b.points = new tk(e, c, d);
        return b.points
    }

    function Ql(a) {
        for (const b of a.g) Je(a.i, b);
        a.g.clear()
    }
    var Rl = class {
        constructor(a) {
            this.i = a;
            this.g = new Set
        }
    };

    function Sl(a, b) {
        const c = [];
        var d = b.U.g.get(kk);
        if (!d) throw Error("F`" + b.U.get(W).id);
        var e = Ok(a.g, b.va.get(X).id);
        for (var f of e) {
            e = f.get(X).U;
            if (!e) continue;
            const n = e.g.get(kk);
            if (!n) throw Error("G`" + e.get(W).id);
            d.value === n.value && c.push(new yk("pair", [b.U, e], b.V));
            (d.value + 4) % 8 === n.value && c.push(new yk("full_moon", [b.U, e], b.V))
        }
        f = [];
        Tl(a, b.va, b.U, -1, [], new Set, f);
        d = [];
        Tl(a, b.va, b.U, 1, [], new Set, d);
        a = [];
        if (f.length === 0) a.push(...d);
        else
            for (var g of f)
                for (var h of d) f = [...g], f.reverse(), f.pop(),
                    a.push([...f, ...h]);
        g = new Map;
        for (l of a) {
            h = new Set;
            for (a = 0; a < l.length; a++) {
                d = l[a];
                if (h.has(d)) {
                    l.splice(a);
                    break
                }
                h.add(d)
            }
            l.length >= 3 && (h = uk("run", l), g.has(h) || g.set(h, l))
        }
        var l = Array.from(g.values());
        for (const n of l) c.push(new yk("run", n, b.V));
        return c
    }

    function Tl(a, b, c, d, e, f, g) {
        e.push(c);
        f.add(b);
        b = b.get(X);
        c = c.get(kk);
        var h = Ok(a.g, b.id);
        b = [];
        for (const l of h) {
            h = l.get(X).U;
            if (!h) continue;
            const n = h.g.get(kk);
            n && !f.has(l) && n.value === ((c.value + d) % 8 + 8) % 8 && b.push({
                va: l,
                U: h
            })
        }
        if (b.length === 0) g.push(e);
        else
            for (const l of b) Tl(a, l.va, l.U, d, [...e], new Set(f), g)
    }
    var Ul = class {
        constructor(a) {
            this.g = a
        }
    };
    var Wl = class {
        constructor(a, b, c) {
            this.g = a;
            this.i = b;
            this.j = c
        }
        create() {
            const a = new Set,
                b = this.g.va.get(X).id;
            var c = Ok(this.i, b);
            for (var d of c) c = Ck(this.g.va, d), c = Qk(this.i, c), c.get(Fk).type !== void 0 && a.add(c);
            d = Sl(this.j, this.g);
            for (const e of d)
                if (e.type === "run") {
                    d = e.tiles.findIndex(f => f.get(X).id === b);
                    d = [e.tiles.slice(0, d), e.tiles.slice(d + 1, e.tiles.length)];
                    for (const f of d)
                        if (f.length < 3)
                            for (d = 0; d < f.length - 1; d++) c = Ck(f[d], f[d + 1]), c = Qk(this.i, c), c.get(Fk), a.add(c)
                } return new t([...Array.from(a.values()).map(e => {
                e.get(Fk);
                return Vl(e)
            }), new p([new r(200), Vl(this.g.U)])])
        }
    };

    function Vl(a) {
        let b, c = new D(1, 1);
        if (a.g.get(W)) b = a.get(T).el, c = a.get(V).Ca;
        else if (a.get(Fk)) c = a.get(E).scale, b = a.get(Fk).vb;
        else throw Error("H");
        a = Number(window.getComputedStyle(b).opacity) || 0;
        b.style.filter = "drop-shadow(0 0 10px #fff) blur(0px)";
        return new t([new w(500, 0, 10, d => {
            b.style.filter = `drop-shadow(0 0 10px #fff) blur(${d}px)`
        }), new Qe(500, c.W(), Te(c.W(), 1.05), c), v(new w(500, a, 0, d => {
            b.style.opacity = `${d}`
        }), Ga(.55, 0, 1, .45))])
    };

    function Xl(a) {
        return M('<div class="' + N("ddl-container") + '">' + L(a) + "</div>")
    };

    function Yl(a, b) {
        b = b === void 0 ? 32 : b;
        return M('<svg xmlns="http://www.w3.org/2000/svg" width="' + N(b) + '" height="' + N(b) + '" viewBox="0 0 32 32"><path class="' + N(a) + '" d="M16.844,2.156l3.641,10.308,10.922,0.28-8.672,6.65,3.11,10.481-9-6.2-9,6.2,3.109-10.481-8.672-6.65,10.922-.28Z"/></svg>')
    };

    function Zl(a, b) {
        var c = b != null ? b : {};
        b = a.width;
        const d = a.height;
        a = a.ud;
        c = c && c.jd;
        return M(Xl(M((a !== 0 ? "<style" + (c ? ' nonce="' + N(Uh(c)) + '"' : "") + ">.ddl-score-text-wrapper {transform: translateY(" + Oh(a) + "px);}</style>" : "") + '<canvas class="' + N("ddl-match-canvas") + '" width="' + N(b) + '" height="' + N(d) + '"></canvas><svg xmlns="http://www.w3.org/2000/svg" class="' + N("ddl-match-svg-container") + '" viewBox="0 0 ' + N(b) + " " + N(d) + '"></svg><div class="' + N("ddl-match-dom-container") + '"><div class="' + N("ddl-match-tiles") +
            '"></div><div class="' + N("ddl-match-cards") + '"></div><div class="' + N("ddl-match-stars") + '"></div><div class="' + N("ddl-match-wildcards-dialog-container") + '"></div><div class="' + N("ddl-match-dialog-container") + '"></div></div>')))
    }

    function $l(a) {
        return M(am(!0, a.Wb))
    }

    function bm(a) {
        return M(am(!1, a.Wb))
    }

    function am(a, b) {
        return M('<div class="' + N(a ? "ddl-player-score" : "ddl-moon-score") + '" dir="ltr">' + (a ? cm(!0) : dm(!1)) + '<div class="' + N("ddl-score-text-wrapper") + '"><div class="' + N("ddl-score-text") + '">' + L(b) + "</div></div>" + (a ? dm(!0) : cm(!1)) + "</div>")
    }

    function em(a) {
        const b = a.bottom;
        a = a.minHeight;
        return M('<div class="' + N("ddl-match-dialog") + '" style="bottom: ' + N(Oh(b)) + "px; min-height: " + N(Oh(a)) + 'px;"><div class="' + N("ddl-match-dialog-text") + '"></div></div>')
    }

    function fm(a) {
        return cm(a.Rf, a.size)
    }

    function cm(a, b) {
        var c = b === void 0 ? 28 : b;
        b = M;
        a ? (a = '<div class="' + N("ddl-score-star") + '"><div class="' + N("ddl-light-star") + '">', c = M(Yl("ddl-star-white", c === void 0 ? 32 : c)), c = a + c + "</div></div>") : (a = '<div class="' + N("ddl-score-star") + '"><div class="' + N("ddl-dark-star") + '">', c = M(Yl("ddl-star-black", c === void 0 ? 32 : c)), c = a + c + "</div></div>");
        return b("<div>" + c + "</div>")
    }

    function dm(a) {
        return M('<div class="' + N("ddl-score-turn") + '">' + (a ? '<svg height="20" width="18" xmlns="http://www.w3.org/2000/svg"><polygon points="18,0 0,10 18,20" class="' + N("ddl-score-turn-left") + '"></polygon></svg>' : '<svg height="20" width="18" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 18,10 0,20" class="' + N("ddl-score-turn-right") + '"></polygon></svg>') + "</div>")
    }

    function gm() {
        return M('<div class="ddl-match-debug-buttons"><button class="ddl-match-win-button">ПОБЕДА</button><button class="ddl-match-lose-button">ПОРАЖЕНИЕ</button><button class="ddl-match-tie-button">НИЧЬЯ</button></div>')
    };

    function hm(a, b) {
        const c = O($l, {
            Wb: ck("00")
        });
        im(c, new jm, "player", a, b)
    }

    function km(a, b) {
        const c = O(bm, {
            Wb: ck("00")
        });
        im(c, new lm, "moon", a, b)
    }
    var mm = class extends A {
        constructor(a, b, c) {
            super();
            this.Mb = a;
            this.wa = b;
            this.g = c;
            this.Ha = this.Ra = 0
        }
    };

    function nm(a) {
        return Me(a.find(mm, jm))
    }
    var jm = class extends A {};

    function om(a) {
        return Me(a.find(mm, lm))
    }
    var lm = class extends A {};

    function im(a, b, c, d, e) {
        d.appendChild(a);
        const f = a.querySelector(".ddl-score-turn");
        var g = a.querySelector(".ddl-score-star").getBoundingClientRect();
        d = d.getBoundingClientRect();
        const h = new D(g.width / 2, g.height / 2);
        g = Te(new D(g.x - d.x + h.x, g.y - d.y + h.y), 540 / d.width);
        !Number.isNaN(g.x) && Number.isNaN(g.y);
        a = new B(new mm(c, a, f), new E(g), b);
        C(e, a)
    };

    function pm(a) {
        let b;
        (b = a.i) == null || Je(b, a);
        (a = a.g.get(T)) && a.el.remove()
    };
    const qm = new D(.3, .3);

    function rm(a, b) {
        a = O(fm, {
            Rf: a === "player"
        });
        const c = new E;
        b = fk(new D(b, b), new D(28, 28), c);
        return new B(c, new T(a, {
            pos: new D(-50, -50),
            Gb: "%"
        }), b)
    }

    function sm(a, b, c, d) {
        const e = [];
        a = a.V.get(Y).id;
        for (let f = 0; f < b; f++) {
            const g = [];
            for (let h = 0; h < c; h++) {
                const l = rm(a, d);
                g.push(l)
            }
            e.push(g)
        }
        e.length > 0 && e[0].length > 0 && e.every(f => f.length === e[0].length);
        return e
    }

    function tm(a, b) {
        b = um[b];
        a = a.V.get(Y).id;
        S(R(), a === "player" ? b.Ba : b.Aa)
    }
    var vm = class {
        constructor(a, b, c, d) {
            this.V = a;
            this.Ea = b;
            this.T = c;
            this.N = d;
            this.g = this.Ea.get(mm).wa;
            this.v = this.g.querySelector(".ddl-score-text")
        }
        create() {
            const a = this.o(),
                b = a.map((f, g) => new Aa(() => new p([new q(() => {
                    const h = this.u(g, f[0]);
                    for (const l of [...f].reverse()) Se(l.get(E).position, h), C(this.T, l), l.get(T).el.style.opacity = "0", this.N.appendChild(l.get(T).el)
                }), new t([new w(250, 0, 1, h => {
                    for (const l of f) l.get(T).el.style.opacity = `${h}`
                }), ...f.map(h => {
                    const l = h.get(E).position;
                    return new Aa(() =>
                        new Qe(250, l.W().add(new D(0, 20)), l.W(), l))
                })])])));
            let c = 0;
            const d = this.Ea.get(E).position,
                e = [];
            for (let f = 0; f < a.length; f++) {
                for (const g of a[f]) {
                    const h = g.get(E).position,
                        l = c;
                    e.push(new Aa(() => new p([new r(l), new t([v(new Qe(500, h.W(), d.W(), h), Ga(.36, 0, .66, -.56)), v(new w(500, 0, 2 * Math.PI * (500 / 350), n => {
                        g.get(E).rotation = n
                    }), Ja), new p([new r(450), new w(50, 1, 0, n => {
                        g.get(T).el.style.opacity = `${n}`
                    })])]), new q(() => {
                        this.g.classList.remove("ddl-add-score-light")
                    }), new q(() => {
                        this.H(f);
                        this.g.classList.remove("ddl-add-score-light");
                        let n = Number.parseInt(this.v.innerText, 10);
                        Number.isNaN(n);
                        Number.isNaN(n) && (n = 0);
                        n += 1;
                        this.v.innerText = ck(n <= 9 ? `0${n}` : `${n}`);
                        this.g.classList.add("ddl-add-score-light");
                        pm(g)
                    })])));
                    c += 175
                }
                c += 100
            }
            return {
                Ib: b,
                Lb: new t(e)
            }
        }
    };
    const um = {
        new_moon: {
            Ba: x.De,
            Aa: x.Ld
        },
        waxing_crescent: {
            Ba: x.Lc,
            Aa: x.tc
        },
        first_quarter: {
            Ba: x.Mc,
            Aa: x.uc
        },
        waxing_gibbous: {
            Ba: x.Nc,
            Aa: x.wc
        },
        full_moon: {
            Ba: x.Ee,
            Aa: x.Md
        },
        waning_gibbous: {
            Ba: x.Nc,
            Aa: x.wc
        },
        third_quarter: {
            Ba: x.Mc,
            Aa: x.uc
        },
        waning_crescent: {
            Ba: x.Lc,
            Aa: x.tc
        }
    };
    const wm = new D(20, 10);
    var xm = class extends vm {
        constructor(a, b, c, d, e, f, g, h) {
            super(e, f, g, h);
            this.O = a;
            this.j = b;
            this.ha = c;
            this.i = d
        }
        o() {
            const a = this.O[0].get(V).Ca.x * qm.x;
            return sm(this, this.j, this.ha, a)
        }
        u(a, b) {
            b = b.get(V).Ca.x;
            var c = -b * .5 - wm.y;
            var d = this.O[0].get(E).position;
            const e = d.W();
            d = d.W();
            for (let g = 0; g < this.O.length; g++) {
                var f = this.O[g];
                const h = f.get(E);
                f = Te(f.get(V).Ca.W(), .5);
                e.x = Math.min(e.x, h.position.x - f.x);
                e.y = Math.min(e.y, h.position.y - f.y);
                d.x = Math.max(d.x, h.position.x + f.x);
                d.y = Math.max(d.y, h.position.y + f.y)
            }
            c =
                new D((e.x + d.x) * .5, e.y + c);
            return new D(c.x - (this.j * b + (this.j - 1) * wm.x) * .5 + b * .5 + (b + wm.x) * a, c.y)
        }
        H(a) {
            let b;
            switch (this.i) {
                case 0:
                    b = this.O[0];
                    break;
                case 1:
                    b = this.O[a % this.O.length];
                    break;
                default:
                    cb(this.i, `Unknown star point SFX type: ${this.i}`)
            }
            b && tm(this, b.get(kk).definition.id)
        }
    };
    var Am = class extends Aa {
        constructor(a, b, c, d, e) {
            super(() => this.create());
            this.u = a;
            this.V = b;
            this.i = c;
            this.v = d;
            this.j = e;
            this.O = this.i.find(W).filter(f => f.get(W).va !== void 0);
            Ua(this.O)
        }
        create() {
            const a = this.V.get(Y).id === "player";
            var b = a ? nm(this.i) : om(this.i);
            if (this.O.length === 0) return new q(() => {});
            b = (new xm(this.O, this.u, 1, 1, this.V, b, this.i, this.v)).create();
            return new p([new q(() => {
                S(R(), a ? x.Kc : x.rc)
            }), new t([...b.Ib, ym(this.j, `+${ck(`${this.u}`)}`)]), new r(100), b.Lb, zm(this.j)])
        }
    };

    function Bm(a, b, c = 300) {
        return (new Cm(a, b, c)).create()
    }
    var Cm = class {
        constructor(a, b, c) {
            this.O = a;
            this.g = b;
            this.duration = c
        }
        create() {
            const a = this.O.map(b => b.get(V).Ca).map(b => new Aa(() => new Qe(this.duration, b.W(), this.g, b)));
            return new t(a)
        }
    };
    const Dm = new D(.035, .035);
    var Em = class extends vm {
        constructor(a, b, c, d, e, f) {
            super(c, d, e, f);
            this.O = a;
            this.i = b
        }
        o() {
            const a = this.O[0].get(V).Ca.x * qm.x;
            return sm(this, this.O.length, this.i, a)
        }
        u(a, b) {
            b = b.get(V).Ca.x;
            var c = this.O[a];
            a = c.get(E);
            c = c.get(V).Ca.x;
            b = -c * .5 + c * Dm.x + b * .5;
            return a.position.W().add(new D(b, b))
        }
        H(a) {
            (a = this.O[a % this.O.length]) && tm(this, a.get(kk).definition.id)
        }
    };
    var Fm = class extends Aa {
        constructor(a, b, c, d, e) {
            super(() => this.create());
            this.v = a;
            this.V = b;
            this.i = c;
            this.j = d;
            this.u = e;
            const f = this.V.get(Y).id;
            this.O = this.i.find(W).filter(g => {
                g = g.get(W);
                return g.va !== void 0 && g.yb && g.yb.get(Y).id === f
            }).sort((g, h) => {
                g = g.get(E).position;
                h = h.get(E).position;
                const l = g.y - h.y;
                return Math.abs(l) >= .001 ? l : g.x - h.x
            })
        }
        create() {
            const a = this.V.get(Y).id === "player";
            var b = a ? nm(this.i) : om(this.i);
            if (this.O.length === 0) return new q(() => {});
            b = (new Em(this.O, this.v, this.V, b, this.i, this.u)).create();
            return new p([new q(() => {
                S(R(), a ? x.Kc : x.rc)
            }), Bm(this.O, Sk(this.j)), new r(100), new t(b.Ib), new r(100), b.Lb, new r(100), Bm(this.O, Rk(this.j))])
        }
    };

    function Gm(a, b) {
        var c = [],
            d = a.g.O.map(l => l.get(W).va);
        for (var e = 1; e < d.length; e++) {
            var f = d[e - 1],
                g = d[e],
                h = Qk(a.u, Ck(f, g));
            c.push({
                connection: h,
                bc: f,
                hc: g
            })
        }
        d = new t(c.map(l => {
            const n = l.connection.get(Fk).vb;
            if (n && (l = Number.parseFloat(n.style.opacity), !Number.isNaN(l))) return new p([new w(100, l, 0, u => {
                n.style.opacity = `${u}`
            })])
        }).filter(l => l !== void 0));
        c = c.map(l => {
            var n = l.connection.get(Fk);
            Gk(n, a.g.type);
            const u = n.vb;
            if (n.type === "run") {
                n = l.bc.get(E).position.W();
                l = l.hc.get(E).position.W();
                u.style.opacity =
                    "1";
                n = l.sub(n);
                l = n.length() * .5;
                const J = Ue(n);
                n = Te(J.W(), -l);
                l = Te(J.W(), l);
                u.setAttribute("x1", `${n.x}`);
                u.setAttribute("y1", `${n.y}`);
                u.setAttribute("x2", `${n.x}`);
                u.setAttribute("y2", `${n.y}`);
                return new t([new w(150, n.x, l.x, ja => {
                    u.setAttribute("x2", `${ja}`)
                }), new w(150, n.y, l.y, ja => {
                    u.setAttribute("y2", `${ja}`)
                })])
            }
            return new w(150, 0, 1, J => {
                u.style.opacity = `${J}`
            })
        });
        e = (new wl(a.g.O, a.g.type, a.g.V, !1)).create();
        (f = a.g.type === "run" && !a.i.u) && (e = e.map((l, n) => new t([l, b[n]])));
        g = [];
        for (h = 0; h < e.length -
            1; h++) g.push(e[h]), g.push(c[h]);
        g.push(e[e.length - 1]);
        return new p([d, f ? new p(g) : new t([...g, ...b])])
    }
    var Im = class {
        constructor(a, b, c, d, e) {
            this.g = a;
            this.u = b;
            this.o = c;
            this.H = d;
            this.j = e;
            this.i = this.g.points
        }
        create() {
            var a = this.g.V.get(Y).id === "player" ? nm(this.o) : om(this.o);
            a = this.g.type !== "run" || this.i.u ? (new xm(this.g.O, this.i.o, this.i.i, this.g.type === "pair" ? 0 : 1, this.g.V, a, this.o, this.H)).create() : (new Em(this.g.O, this.i.i, this.g.V, a, this.o, this.H)).create();
            var b = p,
                c = new q(() => {
                    S(R(), Hm(this.g))
                }),
                d = Bm(this.g.O, Sk(this.u), 300),
                e = [...(new wl(this.g.O, this.g.type, this.g.V, !0)).create()];
            if (this.j) {
                var f =
                    this.j;
                a: switch (this.g.type) {
                    case "pair":
                        var g = U("gameplay_phasepair");
                        break a;
                    case "full_moon":
                        g = U("gameplay_fullmoonpair");
                        break a;
                    case "run":
                        g = U(`gameplay_lunarcycle_${this.g.O.length}`);
                        break a;
                    default:
                        throw Error("E`" + this.g.type);
                }
                f = [ym(f, g)]
            } else f = [];
            return new b([c, new t([d, ...e, ...f]), new r(600), new t([...(this.j ? [zm(this.j)] : []), Gm(this, a.Ib)]), new r(100), a.Lb, Bm(this.g.O, Rk(this.u), 200)])
        }
    };

    function Hm(a) {
        var b = a.V.get(Y).id === "player";
        switch (a.type) {
            case "pair":
                return b ? x.ye : x.Kd;
            case "full_moon":
                return b ? x.Pd : x.Jd;
            case "run":
                return b = b ? Jm : Km, b[Math.max(0, Math.min(a.O.length - 3, b.length - 1))];
            default:
                cb(a.type, void 0)
        }
    }
    const Jm = [x.Ud, x.Vd, x.Wd, x.Xd, x.Yd, x.Zd],
        Km = [x.Bd, x.Cd, x.Dd, x.Ed, x.Fd, x.Gd];
    var Lm = class extends Aa {
        constructor(a, b, c, d) {
            super(() => this.create());
            this.i = a;
            this.u = b;
            this.N = c;
            this.j = d;
            this.v = this.i.points
        }
        create() {
            const a = this.i.V.get(Y).id === "player" ? nm(this.u) : om(this.u);
            return new Aa(() => {
                const b = (new xm(this.i.O, this.v.g, 1, 1, this.i.V, a, this.u, this.N)).create();
                return new p([new t([new q(() => {
                    S(R(), Hm(this.i))
                }), ...(this.j ? [ym(this.j, `+${ck(`${this.v.g}`)}`)] : []), ...b.Ib]), new r(150), b.Lb, ...(this.j ? [zm(this.j)] : [])])
            })
        }
    };

    function Mm(a = 750) {
        const b = document.querySelector(".ddl-doodle-fade");
        b.style.visibility = "visible";
        return Nm(b, 0, 1, a)
    }

    function Om() {
        const a = document.querySelector(".ddl-doodle-fade");
        return Nm(a, 1, 0, 750).then(new q(() => {
            a.style.visibility = "hidden"
        }))
    }

    function Nm(a, b, c, d) {
        return new w(d, b, c, e => {
            a.style.opacity = `${e}`
        })
    };
    let Pm = 0,
        Qm = -1,
        Rm = !1;

    function Sm(a, b) {
        b = new lk(b);
        a.j.push(b);
        return b
    }

    function Tm(a) {
        a = a.j.map(b => b.definition.id);
        rh(oj, a)
    }
    var Um = class {
        constructor() {
            this.j = [];
            this.g = -1;
            this.i = this.Ja = this.u = this.Ea = 0;
            var a = Set;
            try {
                var b = qh(oj, [], Array.isArray)
            } catch (d) {
                b = []
            }
            const c = new a(b);
            a = Pj;
            this.o = [...Object.values(a)].filter(d => !c.has(d.id));
            for (const d of c.values())(b = a[d]) && b.type === "legendary_wildcard" && Sm(this, b);
            Ua(this.o)
        }
    };

    function Vm(a, b, c) {
        let d = a.j.get(b.id);
        d === void 0 ? d = 0 : d++;
        a.j.set(b.id, d);
        a = Nj[b.id];
        return ok(`${b.id}-${d}`, b, new kk(b.value, b), a.Ta, a.back, a.Ba, a.Aa, c)
    }
    var Wm = class {
            constructor(a) {
                this.cardSize = a;
                this.j = new Map;
                this.g = []
            }
            o() {
                this.g.length === 0 && (this.g = this.i());
                return this.g.shift()
            }
        },
        Xm = class extends Wm {
            constructor(a, b) {
                super(new D(b.cardSize, b.cardSize));
                this.u = [...a];
                this.i()
            }
            i() {
                var a = this.u;
                const b = [];
                for (var c of a)
                    for (a = 0; a < 2; a++) b.push(Vm(this, c, this.cardSize));
                for (c = 0; c < 3; c++) Ua(b);
                return b
            }
        },
        Ym = class extends Wm {
            constructor() {
                super(new D(84, 84))
            }
            o() {
                throw Error("I");
            }
            i() {
                return []
            }
        };
    const Zm = /\{(.*?)\}/g;

    function ym(a, b) {
        a.g.style.opacity = "0";
        a.i.appendChild(a.wa);
        $m(a, b);
        return new p([new t([cj(a.wa), new p([new r(100), an(a, 0, 1)])])])
    }

    function zm(a) {
        return new p([new t([an(a, 1, 0), dj(a.wa)]), new q(() => {
            a.wa.remove();
            $m(a, "")
        })])
    }

    function $m(a, b) {
        {
            const e = [...b.matchAll(Zm)];
            if (e.length === 0) var c = b;
            else {
                c = document.createDocumentFragment();
                var d = 0;
                for (const f of e)(d = b.substring(d, f.index)) && c.appendChild(document.createTextNode(d)), d = document.createElement("span"), d.classList.add("ddl-match-dialog-highlight"), d.appendChild(document.createTextNode(f[1])), c.appendChild(d), d = f.index + f[0].length;
                (b = b.substring(d)) && c.appendChild(document.createTextNode(b))
            }
        }
        if (c instanceof Node) {
            for (; a.g.lastChild;) a.g.removeChild(a.g.lastChild);
            a.g.appendChild(c)
        } else a.g.innerText = c;
        K(a.g, 28, 432, a.height, 20)
    }

    function an(a, b, c) {
        return new w(300, b, c, d => {
            a.g.style.opacity = `${d}`
        })
    }

    function bn(a, b) {
        let c = Number.parseFloat(a.g.style.opacity);
        Number.isNaN(c) && (c = 1);
        return new p([an(a, c, 0), new q(() => {
            $m(a, b)
        }), new r(50), an(a, 0, 1)])
    }
    var cn = class {
        constructor(a) {
            this.i = a;
            this.bottom = 687;
            this.height = 110;
            this.wa = O(em, {
                bottom: this.bottom,
                minHeight: this.height
            });
            this.g = this.wa.querySelector(".ddl-match-dialog-text")
        }
    };

    function dn(a) {
        const b = a.g.find(W).filter(c => c.get(W).va !== void 0).map(c => c.get(W).yb);
        for (const c of [nm(a.g).get(mm), om(a.g).get(mm)]) c.Ha = b.filter(d => d && d.get(Y).id === c.Mb).length
    }
    var en = class {
        constructor(a) {
            this.g = a
        }
        update(a) {
            var b = a.O,
                c = a.V;
            for (const d of b) c.get(Y), d.get(W).yb = c;
            dn(this);
            b = a.V.get(Y).id;
            a = a.points;
            ["player", "moon"].includes(b);
            b === "player" ? nm(this.g).get(mm).Ra += a.j : b === "moon" && (om(this.g).get(mm).Ra += a.j)
        }
    };

    function fn(a) {
        return {
            Ra: a.Ra,
            Ha: a.Ha,
            total: a.Ra + a.Ha
        }
    };

    function gn(a) {
        return a[Math.floor(Math.random() * a.length)]
    }

    function hn(a, b) {
        var c = 0;
        const d = Array(a.length);
        for (var e = 0; e < a.length; e++) {
            const f = b(a[e], e);
            c += f;
            d[e] = f
        }
        b = Math.random() * c;
        c = 0;
        for (e = 0; e < a.length; e++)
            if (c += d[e], c >= b) return a[e];
        return a[a.length - 1]
    }

    function jn(a, b, c) {
        return hn(a, (d, e) => {
            d = c * c;
            return Math.pow(Math.E, Math.pow(e / a.length * 20 - 10 - b, 2) / (-2 * d)) / Math.sqrt(2 * Math.PI * d)
        })
    };
    const kn = [2, 5, 7, 8, 9, 10];

    function ln(a) {
        return m(function*() {
            var b = a.g.get(Y).Ma.O,
                c = a.o.find(X).filter(g => g.get(X).U === void 0);
            const d = [];
            for (const g of b)
                for (const h of c) {
                    b = {
                        U: g,
                        va: h,
                        V: a.g
                    };
                    var e = g.get(W);
                    e.va = h;
                    var f = Sl(a.u, b);
                    e.va = void 0;
                    e = 0;
                    const l = new Rl(a.o);
                    for (const n of f)
                        if (f = Pl(l, n), e += f.j, a.g.get(Y).Xc)
                            for (const u of n.O) f = u.get(W).yb, f === void 0 ? e += 1 : f !== a.g && (e += 2);
                    d.push([b, e])
                }
            yield ai(1E3);
            Ua(d);
            c = d.sort((g, h) => g[1] - h[1]).map(g => g[0]);
            return jn(c, a.i, a.j)
        })
    }
    var nn = class {
        constructor(a, b, c, d, e) {
            this.o = a;
            this.g = b;
            this.u = c;
            e && d < 3 ? (this.i = 2, this.j = 1.3) : (this.i = e ? mn(d, -1) : mn(d), this.j = d < 18 + (e ? 3 : 0) ? 1.3 - d % 3 * .3 : 1);
            a = this.j;
            H("d11", this.i);
            H("d12", a);
            I(117)
        }
    };

    function mn(a, b = 0) {
        return kn[Math.min(Math.max(0, Math.floor(a / 3) + b), kn.length - 1)]
    };

    function on(a, b) {
        return m(function*() {
            if (b.va.get(X).U !== void 0) {
                var c = b.va;
                var d = b.va.get(X).U;
                c = (new Wl({
                    va: c,
                    U: d,
                    V: b.V
                }, a.g, a.j)).create();
                yield P(new t([c, new r(150)]), a.actions);
                c = Uk(b.va);
                pm(c)
            }
        })
    }
    var pn = class {
        constructor(a, b, c, d, e, f, g, h) {
            this.i = a;
            this.H = b;
            this.g = c;
            this.state = d;
            this.o = e;
            this.j = f;
            this.actions = g;
            this.u = h
        }
        execute(a) {
            const b = this;
            return m(function*() {
                const c = Lj;
                a.U.get(W);
                yield on(b, a);
                yield Tk(b.g, a.va, a.U, b.actions);
                yield ol(a.V.get(Y).Ma, a.U);
                a.U.get(pk).set(!1);
                const d = Sl(b.j, a);
                d.length > 0 && Dj(c, a.V === b.H ? 2 : 3);
                const e = new Rl(b.i);
                for (let h = 0; h < d.length; h++) {
                    const l = d[h];
                    var f = a.V.get(Y).id,
                        g = l.type;
                    H("d8", l.tiles.length, !0);
                    f = f === "player";
                    switch (g) {
                        case "pair":
                            I(f ? 111 : 114);
                            break;
                        case "full_moon":
                            I(f ? 112 : 115);
                            break;
                        case "run":
                            I(f ? 113 : 116);
                            break;
                        default:
                            cb(g, void 0)
                    }
                    h > 0 && (yield Q(350, b.actions));
                    g = Pl(e, l);
                    yield P((new Im(l, b.g, b.i, b.u, b.o)).create(), b.actions);
                    g.g > 0 && (yield Q(150, b.actions), yield P(new Lm(l, b.i, b.u, b.o), b.actions));
                    b.state.update(l)
                }
                Ql(e);
                Dj(c, 1)
            })
        }
    };

    function qn(a, b) {
        const c = a.V.get(Y).Ma,
            d = [...c.O, ...c.g],
            e = c.O.length;
        e > 0 && (rn(a, c.O[Math.ceil(e / 2) - 1], d), sn(a, b))
    }

    function rn(a, b, c) {
        a.u = b;
        for (const d of c) d.get(pk).set(d === b)
    }

    function tn(a, b, c, d) {
        a.ha = !0;
        const e = c.pointerId,
            f = b.get(E),
            g = b.get(E).position.W(),
            h = g.W().sub(oh(c, a.o));
        b.get(T).el.classList.add("ddl-card-selected");
        let l = !1;
        Jf(a.N, a.o, "pointermove", n => {
            n = n.kb;
            if (e === n.pointerId) {
                n = oh(n, a.o).add(h);
                var u = un(n, vn(a));
                u ? (l || S(a.j, x.yd), l = !0, Se(f.position, u.get(E).position)) : (l = !1, Se(f.position, n))
            }
        });
        Jf(a.N, a.o, ["pointerup", "pointercancel", "lostpointercapture"], n => {
            n = n.kb;
            e === n.pointerId && (a.ha = !1, n = oh(n, a.o).add(h), (n = un(n, vn(a))) ? d.resolve({
                    va: n,
                    U: a.u,
                    V: a.V
                }) :
                (Kf(a.N), sn(a, d), n = new Lk(b, {
                    pos: g,
                    size: b.get(V).Ca,
                    Sa: b.get(W).Sa
                }, 350), Oe(a.actions, n)))
        })
    }

    function wn(a) {
        Kf(a.T);
        Kf(a.H);
        Kf(a.N);
        for (const b of a.ta.find(W, T)) b.get(T).el.classList.remove("ddl-card-selectable", "ddl-card-glow");
        Kf(a.i)
    }

    function xn(a) {
        return m(function*() {
            const b = yf();
            var c = a.V.get(Y).Ma;
            const d = [...c.O, ...c.g];
            qn(a, b);
            for (const e of c.O) {
                const f = e.get(T).el;
                f.classList.add("ddl-card-selectable");
                Jf(a.T, f, "pointerdown", g => {
                    a.ha || (S(a.j, x.ze), Kf(a.i), rn(a, e, d), tn(a, e, g.kb, b))
                })
            }
            if (a.g)
                for (const e of c.g) e.get(lk).Ob || (c = e.get(T).el, c.classList.add("ddl-card-selectable"), Jf(a.T, c, "click", () => {
                    a.v || (Kf(a.i), a.u && a.u === e ? a.v || yn(a, a.u, b) : (S(a.j, x.nf), rn(a, e, d), zn(a, e, b)))
                }));
            else
                for (const e of c.g) e.get(qk).set(!1);
            c = yield b.promise;
            wn(a);
            return c
        })
    }

    function vn(a) {
        return a.ta.find(X, T).filter(b => {
            b = b.get(X);
            return b.g && (b.U === void 0 || a.V.get(Y).Tb)
        })
    }

    function sn(a, b) {
        Kf(a.i);
        var c = vn(a);
        for (const e of c) {
            var d = void 0;
            d = e.get(X);
            a.V.get(Y).Tb ? (d = (c = d.U !== void 0) ? d.U.get(T).el : e.get(T).el, c && d.classList.add("ddl-card-selectable", "ddl-card-glow")) : d = e.get(T).el;
            Jf(a.i, d, "click", () => {
                b.resolve({
                    va: e,
                    U: a.u,
                    V: a.V
                });
                e.get(Bk).set(!1)
            });
            Jf(a.i, d, "mouseover", () => {
                e.get(Bk).set(!0)
            });
            Jf(a.i, d, "mouseout", () => {
                e.get(Bk).set(!1)
            })
        }
    }

    function yn(a, b, c) {
        return m(function*() {
            a.u = void 0;
            b.get(pk).set(!1);
            yield jl(a.g);
            Kf(a.H);
            An(a, !0);
            qn(a, c)
        })
    }

    function zn(a, b, c) {
        m(function*() {
            a.v = !0;
            An(a, !1);
            Kf(a.H);
            a.g.i && (yield jl(a.g));
            var d = hl(a.g, "play");
            Jf(a.H, d, "click", () => {
                Bn(a, b, c)
            });
            d = hl(a.g, "cancel");
            Jf(a.H, d, "click", () => {
                S(a.j, x.kc);
                yn(a, b, c)
            });
            Jf(a.H, a.o, "click", e => {
                e.target === e.currentTarget && (S(a.j, x.kc), yn(a, b, c))
            });
            yield il(a.g, b.get(lk).definition, 40);
            a.v = !1
        })
    }

    function An(a, b) {
        a = a.V.get(Y).Ma;
        for (const c of a.O) c.get(T).el.disabled = !b
    }

    function Bn(a, b, c) {
        m(function*() {
            S(a.j, x.yc);
            yield yn(a, b, c);
            c.resolve({
                va: new B,
                U: b,
                V: a.V
            })
        })
    }
    var Cn = class {
        constructor(a, b, c, d, e) {
            this.ta = a;
            this.V = b;
            this.o = c;
            this.actions = d;
            this.g = e;
            this.T = new Hf;
            this.N = new Hf;
            this.H = new Hf;
            this.i = new Hf;
            this.j = R();
            this.v = this.ha = !1
        }
    };

    function un(a, b) {
        for (const d of b) {
            var c = Te(d.get(V).Ca.W(), .5);
            const e = d.get(E).position;
            b = e.W().sub(c);
            c = e.W().add(c);
            if (a.x >= b.x && a.x <= c.x && a.y >= b.y && a.y <= c.y) return d
        }
    };

    function Dn(a) {
        return m(function*() {
            const b = qh(nj, !1);
            rh(nj, !0);
            !b && a.N && (yield Q(500, a.actions), yield P(ym(a.j, U("wildcard_finish")), a.actions), yield Q(3E3, a.actions), P(zm(a.j), a.actions))
        })
    }
    var En = class {
        constructor(a, b, c, d, e, f, g, h, l, n, u, J = !0) {
            this.H = a;
            this.g = b;
            this.o = c;
            this.u = f;
            this.j = h;
            this.actions = l;
            this.V = u;
            this.N = J;
            this.v = this.H.U.get(lk).definition.id
        }
        execute() {
            const a = this;
            return m(function*() {
                const b = U(Pj[a.v].Ka.Bb);
                yield P(ym(a.j, b), a.actions);
                yield Q(2500, a.actions);
                yield P(zm(a.j), a.actions);
                yield a.i();
                yield Dn(a)
            })
        }
    };
    const Fn = new Map;

    function Gn(a, b) {
        Fn.has(a);
        Fn.set(a, b)
    }

    function Hn(a, b, c, d, e, f, g, h, l, n, u) {
        return m(function*() {
            const J = a.U.get(lk).definition.id;
            yield(new(Fn.get(J))(a, b, c, d, e, f, g, h, l, n, u)).execute()
        })
    }

    function In(a, b, c, d, e) {
        return m(function*() {
            var f = [];
            for (var g of a) {
                var h = {
                    va: g,
                    U: g.get(X).U,
                    V: b
                };
                h = (new Wl(h, c, d)).create();
                f.push(h, new r(150))
            }
            yield P(new p(f), e);
            f = [];
            for (const l of a) g = Uk(l), pm(g), f.push(g);
            return f
        })
    }
    var Ln = class extends En {
            i() {
                const a = this;
                return m(function*() {
                    var b = Jn(a.g);
                    b.length !== 0 && (b = b.map(c => c.get(X).U), b = (yield xl(new yl(b))).get(W), b = Kn(b.va, a.o), yield In(b, a.V, a.o, a.u, a.actions))
                })
            }
        },
        Mn = class extends En {
            i() {
                const a = this;
                return m(function*() {
                    C(a.g, new B(new Il(2, "player")))
                })
            }
        },
        Nn = class extends En {
            i() {
                const a = this;
                return m(function*() {
                    C(a.g, new B(new Jl(10, "player")))
                })
            }
        },
        On = class extends En {
            i() {
                const a = this;
                return m(function*() {
                    C(a.g, new B(new Fl(1, new Bl, "moon", !0)))
                })
            }
        };

    function Pn(a) {
        a = a.get(X).U;
        if (a !== void 0 && (a = a.get(W).yb, a !== void 0)) return a.get(Y).id
    }

    function Jn(a) {
        return a.find(X).filter(b => Pn(b) === "moon")
    }

    function Kn(a, b) {
        const c = new Set,
            d = Pn(a);
        if (d === void 0) return c;
        Qn(d, a, b, new Set, c);
        return c
    }

    function Qn(a, b, c, d, e) {
        if (!d.has(b) && (d.add(b), Pn(b) === a)) {
            e.add(b);
            b = Ok(c, b.get(X).id);
            for (const f of b) Qn(a, f, c, d, e)
        }
    };

    function Rn(a, b, c = !0) {
        return m(function*() {
            const d = a.Da.o();
            yield ml(b.get(Y).Ma, d, a.actions, a.g, !0, c)
        })
    }

    function Sn(a) {
        return m(function*() {
            const b = [];
            for (var c = 0; c < 2; c++) b.push(Rn(a, a.u, c === 0), Rn(a, a.j, !1));
            c = a.u.get(Y).Ma;
            const d = new D(65, 65),
                e = a.ha.filter(g => !g.Ob).map(g => nk(g, d)),
                f = nl(e, c.Pa + c.cardSize.y + 20);
            for (let g = 0; g < e.length; g++) {
                const h = e[g];
                mk(h, f[g], d, 0, a.g, a.T);
                c.g.push(h)
            }
            yield Promise.all([...b, ...e.map(g => aj(g.get(T).el, a.actions, 250))]);
            yield Q(500, a.actions)
        })
    }

    function Tn(a) {
        return m(function*() {
            qh(mj, !1) || a.ha.length !== 1 || (rh(mj, !0), yield P(ym(a.i, U("wildcardintro2")), a.actions), yield Q(3500, a.actions), yield P(bn(a.i, U("wildcardintro3")), a.actions), yield Q(3E3, a.actions), Oe(a.actions, zm(a.i)))
        })
    }

    function Un(a) {
        return a.g.find(X).filter(b => b.get(X).U === void 0).length === 0
    }

    function Vn(a, b) {
        return m(function*() {
            const c = b.get(Y).id === "player" ? nm(a.g).get(mm) : om(a.g).get(mm);
            var d = b.get(Y).Ma;
            d = Math.max(0, 3 - d.O.length);
            const e = [];
            for (let f = 0; f < d; f++) e.push(Rn(a, b, f === 0));
            yield Promise.all(e);
            Oe(a.actions, cj(c.g))
        })
    }

    function Wn(a, b) {
        return m(function*() {
            var c = b.get(Y);
            if (c.id === "player") c = yield xn(new Cn(a.g, b, a.o, a.actions, a.nb)), b.get(Y).Tb = !1;
            else if (c.id === "moon") c = yield ln(a.qb);
            else throw Error("J");
            return c
        })
    }

    function Xn(a, b) {
        return m(function*() {
            var c = b.U.get(W);
            if (c.type === "moon") return yield a.Fa.execute(b), !1;
            if (c.type === "wildcard" || c.type === "legendary_wildcard") return c = b.U.get(lk).definition.id, H("d7", c, !0), I(110), b.U.get(lk).Ob = !0, b.U.get(qk).set(!1), yield Hn(b, a.g, a.H, a.Da, a.state, a.N, a.Fa, a.i, a.actions, a.j, a.u), !0;
            throw Error("K`" + c.type);
        })
    }

    function Yn(a, b) {
        return m(function*() {
            const c = b.get(Y).id === "player" ? nm(a.g).get(mm) : om(a.g).get(mm);
            Oe(a.actions, dj(c.g));
            a.ta = (a.ta + 1) % 2;
            a.La++;
            H("d9", a.La)
        })
    }

    function Zn(a) {
        return m(function*() {
            yield P(ym(a.i, U("gameplay_bonuspoints")), a.actions);
            yield Q(1500, a.actions);
            yield P(zm(a.i), a.actions);
            var b = a.state;
            b = {
                Ua: fn(nm(b.g).get(mm)),
                ob: fn(om(b.g).get(mm))
            };
            yield $n(a, a.j, b.ob);
            yield $n(a, a.u, b.Ua);
            return b
        })
    }

    function ao(a) {
        return m(function*() {
            yield Pk(a.H, a.actions);
            yield Sn(a);
            for (yield Tn(a); !Un(a);) {
                var b = a.Nb[a.ta],
                    c = b.get(Y).Ma;
                yield Vn(a, b);
                for (var d = !0; d && c.O.length + c.g.length !== 0;) d = yield Wn(a, b), d = yield Xn(a, d);
                yield Yn(a, b)
            }
            yield Q(500, a.actions);
            b = yield Zn(a);
            c = b.Ua.total;
            d = b.ob.total;
            return {
                Ea: b,
                result: c > d ? 0 : c < d ? 1 : 2,
                Ja: 0
            }
        })
    }

    function $n(a, b, c) {
        return m(function*() {
            if (b.get(Y).Xc) {
                var d = Ll(Il, b, a.g);
                d = Ml(d, Il);
                d > 1 && (c.total += c.Ha * (d - 1), c.Ha *= d);
                yield P(new Fm(d, b, a.g, a.H, a.v), a.actions);
                d = Ll(Jl, b, a.g);
                d = Nl(d, Jl);
                d > 0 && (c.Ha += d, c.total += d, yield Q(350, a.actions), yield P(new Am(d, b, a.g, a.v, a.i), a.actions));
                yield Q(1E3, a.actions)
            } else c.total -= c.Ha, c.Ha = 0
        })
    }
    var bo = class {
        constructor(a, b, c, d, e, f, g) {
            this.g = a;
            this.ha = c;
            this.o = d;
            this.actions = f;
            this.i = new cn(this.o.querySelector(".ddl-match-dialog-container"));
            this.nb = new kl(this.o.querySelector(".ddl-match-wildcards-dialog-container"), 0, this.actions);
            this.state = new en(this.g);
            this.La = this.ta = 0;
            this.T = this.o.querySelector(".ddl-match-cards");
            this.v = this.o.querySelector(".ddl-match-stars");
            this.Da = new Xm([...Object.values(Mj)], b);
            this.u = sl(this.T);
            this.j = tl(this.T);
            this.Nb = [this.u, this.j];
            this.H = new Vk(b, this.o.querySelector(".ddl-match-tiles"),
                e, this.g);
            this.N = new Ul(this.H);
            this.qb = new nn(this.g, this.j, this.N, g, this.ha.length === 0);
            this.Fa = new pn(this.g, this.j, this.H, this.state, this.i, this.N, this.actions, this.v)
        }
    };

    function co(a, b = 0) {
        a.ka.style.opacity = `${b}`;
        a.nb.appendChild(a.ka)
    }

    function eo(a, b, c, d, e = 300) {
        return m(function*() {
            yield P(new w(e, c, d, f => {
                a.ka.style.opacity = `${f}`
            }), b)
        })
    }

    function Z(a, b) {
        return a.ka.querySelector(b)
    }

    function fo(a, b) {
        return typeof b === "string" ? Z(a, b) : b
    }
    var go = class {
        constructor(a, b) {
            this.nb = a;
            this.ka = b
        }
        update() {}
        play() {
            const a = this;
            return m(function*() {
                yield a.o();
                const b = yield a.H();
                yield a.u();
                return b
            })
        }
        u() {
            return Promise.resolve()
        }
    };
    var ko = class extends go {
        constructor(a, b, c, d, e) {
            const f = O(Zl, {
                width: 540,
                height: 960,
                ud: Yj
            });
            super(a, f);
            this.N = b;
            this.ha = c;
            this.j = d;
            this.Fa = e;
            this.g = new Ke;
            this.Da = new B(new E, new Ze);
            this.actions = new B(new Ne);
            this.T = !1;
            this.Ja = 0;
            this.v = R();
            this.ka.appendChild(this.j.button);
            this.i = new bo(this.g, this.N, this.ha, Z(this, ".ddl-match-dom-container"), Z(this, ".ddl-match-svg-container"), this.actions, e);
            this.ta = ho[e % ho.length]
        }
        o() {
            const a = this;
            return m(function*() {
                var b = a.Fa,
                    c = a.N.id,
                    d = a.ha.length;
                Qm = b;
                H("d2",
                    b);
                H("d3", c);
                H("d9", 0);
                H("d10", d, !0);
                b === 0 && (H("d1", Pm), I(103), Pm === 0 ? (G.c = 13, I(1)) : Pm === 1 && (G.c = 14, I(1)), Pm++);
                b % 3 === 0 && I(104);
                I(105);
                G.c = 19 + 2 * b;
                I(1);
                xj(a.v, a.ta, 500);
                co(a);
                C(a.g, a.Da);
                C(a.g, a.actions);
                var e = Z(a, ".ddl-match-canvas").getContext("2d");
                b = new Pe(a.g);
                c = new zj(a.g);
                d = new of(a.g);
                e = new nf(a.g, e);
                a.g.g = [new gk(a.g), new ek(a.g, Bk, pk, qk), b, c, d, e];
                b = a.i;
                C(b.g, b.u);
                C(b.g, b.j);
                hm(b.v, b.g);
                km(b.v, b.g);
                a.T = !0;
                yield eo(a, a.actions, 0, 1)
            })
        }
        H() {
            const a = this;
            return m(function*() {
                if (tj) {
                    var b = Promise,
                        c = b.any,
                        d = ao(a.i),
                        e = a.ka;
                    const f = yf(),
                        g = O(gm);
                    io(g, ".ddl-match-win-button", f, 0);
                    io(g, ".ddl-match-lose-button", f, 1);
                    io(g, ".ddl-match-tie-button", f, 2);
                    e.appendChild(g);
                    b = yield c.call(b, [d, f.promise]);
                    b.Ja = a.Ja;
                    return b
                }
                b = yield ao(a.i);
                b.Ja = a.Ja;
                return b
            })
        }
        update(a) {
            this.T && (this.g.update(a), this.Ja += a)
        }
        u() {
            const a = this;
            return m(function*() {
                a.j.o && (yield jo(a.j));
                yj(a.v, 2500);
                yield eo(a, a.actions, 1, 0, 1E3);
                a.ka.remove()
            })
        }
    };
    const ho = [x.Qd, x.Rd, x.Sd];

    function io(a, b, c, d) {
        const e = () => {
            var f = c.resolve;
            let g = 0,
                h = 0;
            switch (d) {
                case 0:
                    g = 1E3;
                    h = 0;
                    break;
                case 1:
                    g = 0;
                    h = 1E3;
                    break;
                case 2:
                    h = g = 1E3;
                    break;
                default:
                    cb(d, void 0)
            }
            f.call(c, {
                result: d,
                Ea: {
                    Ua: {
                        Ra: g,
                        Ha: g,
                        total: g * 2
                    },
                    ob: {
                        Ra: h,
                        Ha: h,
                        total: h * 2
                    }
                },
                Ja: 6E4
            });
            for (const l of a.querySelectorAll("button")) l.removeEventListener("click", e)
        };
        a.querySelector(b).addEventListener("click", e)
    };

    function lo(a) {
        const b = a.width;
        a = a.height;
        return M('<div><div class="' + N("ddl-outro-content") + '"></div><svg xmlns="http://www.w3.org/2000/svg" class="' + N("ddl-outro-svg-container") + '" viewBox="0 0 ' + N(b) + " " + N(a) + '"></svg><div class="' + N("ddl-outro-dialog") + '"></div></div>')
    }

    function mo() {
        return M('<canvas class="' + N("ddl-outro-canvas") + '"></canvas>')
    };
    const no = new D(270, 675),
        oo = new D(no.x, 292),
        po = new D(20, 20);

    function qo(a) {
        const b = a.i.get(E),
            c = a.i.get(T).el;
        return P(new t([v(new w(6375, a.v.y, -407, d => {
            a.v.y = d;
            ro(a.g.g, a.v, a.N)
        }), Ma), new w(6375, a.N, 1.37, d => {
            a.N = d;
            ro(a.g.g, a.v, a.N)
        }), v(new Qe(6375, b.position.W(), new D(b.position.x, oo.y), b.position), Ma), new w(6375, 0, Math.PI, d => {
            b.rotation = d
        }), new p([new r(6225), new t([v(new w(150, 1, 1.6, d => {
            a.g.g.style.filter = `brightness(${d})`;
            c.style.filter = `brightness(${d})`
        }), Ga(.33, 1, .68, 1))])])]), a.actions)
    }

    function so(a) {
        return m(function*() {
            const b = a.i.get(E),
                c = a.i.get(V).Ca,
                d = a.i.get(T).el;
            to(a);
            yield P(new t([ej(b.position.W(), a.Dg, Oa, new D(0, 271 - oo.y)), new w(500, 1.6, 1, e => {
                a.g.g.style.filter = `brightness(${e})`;
                d.style.filter = `brightness(${e})`
            }), v(new w(1800, Math.PI, 0, e => {
                b.rotation = e
            }), Oa), v(new w(1800, 180, 0, e => {
                jk(a.i, e)
            }), Oa), v(new Qe(1800, c.W(), new D(200, 200), c), Oa), v(new w(1800, b.position.y, 271, e => {
                b.position.y = e
            }), Oa)]), a.actions)
        })
    }

    function uo(a) {
        return m(function*() {
            const b = a.i.get(lk);
            return il(a.La, b.definition, 95)
        })
    }

    function vo(a) {
        return m(function*() {
            const b = hl(a.La, "continue");
            return new Promise(c => {
                const d = () => {
                    b.removeEventListener("click", d);
                    S(R(), x.ub);
                    c()
                };
                b.addEventListener("click", d)
            })
        })
    }

    function to(a) {
        a = a.T.get(ef);
        a.j = !1;
        $i(a)
    }
    var xo = class extends go {
        constructor(a, b) {
            var c = O(lo, {
                width: 540,
                height: 960
            });
            super(a, c);
            this.Fg = b;
            this.Nb = Z(this, ".ddl-outro-content");
            this.j = new Ke;
            this.actions = new B(new Ne);
            this.Da = vi();
            this.i = nk(this.Fg, po);
            this.ta = this.Da.i.Gc;
            this.ha = this.ta[3] * .5;
            this.qb = this.ta[4] * .5;
            this.Fa = new B(new E(new D(this.ha, this.qb), -Math.PI / 2), new F(kf(this.ta), 0, 0, new D(-this.ha, -this.qb)));
            this.T = new B(new E(new D(-80, 0), Math.PI / 2));
            this.v = new D(270 - this.ha, -320);
            this.N = 1.2;
            this.Dg = Z(this, ".ddl-outro-svg-container");
            a = this.Fa;
            b = this.T;
            c = b.g.get(Ge);
            const d = b.i !== a.i;
            d && Re(b);
            if (c && c.g !== a) {
                var e = b.g.get(Ge);
                e && (e = e.g.get(He).children, e.splice(e.indexOf(b), 1))
            }
            c ? c.g = a : Ce(b, new Ge(a));
            (a.g.get(He) || Ce(a, new He)).children.push(b);
            d && a.i && C(a.i, b);
            this.g = new wo(this.Fa);
            this.Nb.appendChild(this.g.g);
            ro(this.g.g, this.v, this.N);
            this.g.g.style.opacity = "1";
            this.g.g.style.visibility = "visible";
            Zi(this.T, Yi(this.Da.o.Td, 24, !1, !0, !0));
            mk(this.i, no, po, 180, this.j, this.Nb);
            a = this.i.get(T).el;
            a.style.visibility = "visible";
            a.style.opacity =
                "1";
            this.i.get(E).rotation = 0;
            this.La = new kl(Z(this, ".ddl-outro-dialog"), 1, this.actions, !1)
        }
        o() {
            const a = this;
            return m(function*() {
                C(a.j, a.actions);
                C(a.j, new B(new E, new Ze));
                C(a.j, a.i);
                a.j.g = [new gk(a.j), new zj(a.j), new Pe(a.j)];
                yield P(Mm(), a.actions);
                co(a, 1);
                yield Q(750, a.actions);
                a.Eg = qo(a);
                a.g.g.style.filter = "brightness(1.6)";
                const b = R();
                S(b, x.Od);
                xj(b, x.xc, 0, 6375);
                yield P(new t([Om(), new p([new r(400), new w(500, 1.6, 1, c => {
                    a.g.g.style.filter = `brightness(${c})`
                })])]), a.actions)
            })
        }
        H() {
            const a = this;
            return m(function*() {
                yield a.Eg;
                yield so(a);
                yield uo(a);
                yield vo(a)
            })
        }
        update(a) {
            this.j.update(a);
            this.g.update(a)
        }
        u() {
            const a = this;
            return m(function*() {
                yield P(Mm(), a.actions);
                a.ka.remove();
                yield Q(750, a.actions);
                yield P(Om(), a.actions)
            })
        }
    };
    class wo {
        constructor(a) {
            this.wb = a;
            this.i = new Ke;
            this.g = O(mo);
            this.actions = new B(new Ne);
            this.j = new B(new E, new Ze);
            C(this.i, this.wb);
            C(this.i, this.j);
            a = a.get(F).Xa;
            this.g.width = a.g.x;
            this.g.height = a.g.y;
            a = this.g.getContext("2d");
            this.o = new nf(this.i, a);
            this.i.g = [new of(this.i), this.o]
        }
        update(a) {
            this.i.update(a)
        }
    }

    function ro(a, b, c) {
        a.style.transform = `translate(${b.x}px, ${b.y}px) scale(${c})`
    };

    function yo(a) {
        const b = a.width,
            c = a.height,
            d = a.ig,
            e = a.Wf,
            f = a.Qf,
            g = a.Bg,
            h = a.Af,
            l = a.og,
            n = a.rg,
            u = a.tb,
            J = a.hb,
            ja = a.Cg,
            db = a.qg,
            Kj = a.lg;
        a = a.xg;
        return M('<div class="' + N("ddl-container") + '"' + (a != null ? " ssk='" + N(Gh("fMIyXb") + a) + "'" : "") + '><svg xmlns="http://www.w3.org/2000/svg" class="' + N("ddl-progress-svg-container") + '" viewBox="0 0 ' + N(b) + " " + N(c) + '"></svg><canvas class="' + N("ddl-progress-canvas") + '" width="' + N(b) + '" height="' + N(c) + '"></canvas><div class="' + N("ddl-progress-top-message") + '">' + L(u) + '</div><div class="' +
            N("ddl-progress-results") + '"' + (Kj !== void 0 ? ' style="line-height: ' + N(Oh(Kj)) + '"' : "") + '><div class="' + N("ddl-progress-results-title") + '">' + L(d) + '</div><table class="' + N("ddl-progress-results-stats") + '" cellspacing="6" cellpadding="0"><tr><th>' + L(f) + '</th><td class="' + N("ddl-progress-results-level-stars") + '"></td></tr><tr><th>' + L(g) + '</th><td class="' + N("ddl-progress-results-total-stars") + '"></td></tr></table></div><div class="' + N("ddl-progress-buttons") + '"><div class="' + N("ddl-progress-button-row") +
            '"><button class="' + N("ddl-progress-share-button") + " " + N("ddl-button") + " " + N("ddl-button-default") + '" aria-label="' + N(n) + '" title="' + N(n) + '">' + M('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -960 960 960" class="ddl-progress-share-icon">' + (ja ? '<path d="M258.46-80q-24.58 0-41.52-16.94Q200-113.88 200-138.46v-412.16q0-24.57 16.94-41.52 16.94-16.94 41.52-16.94h99.85v33.85h-99.85q-9.23 0-16.92 7.69-7.69 7.69-7.69 16.92v412.16q0 9.23 7.69 16.92 7.69 7.69 16.92 7.69h443.08q9.23 0 16.92-7.69 7.69-7.69 7.69-16.92v-412.16q0-9.23-7.69-16.92-7.69-7.69-16.92-7.69H601.38v-33.85h100.16q24.58 0 41.52 16.94Q760-575.19 760-550.62v412.16q0 24.58-16.94 41.52Q726.12-80 701.54-80H258.46Zm204.46-268.26V-786.8l-91.28 91.29-24.77-24.34 132.98-132.46 132.46 132.46-24.26 24.34-91.28-91.29v438.54h-33.85Z"/>' :
                    '<path d="M666.38-120q-38.66 0-65.96-27.42-27.29-27.43-27.29-66.02 0-6.89 5.61-32.25L285.49-419.85q-13.01 15.6-31.92 24.45-18.9 8.84-40.9 8.84-38.27 0-65.47-27.55-27.2-27.54-27.2-66.01 0-38.47 27.2-65.89 27.2-27.43 65.3-27.43 21.65 0 40.45 8.52 18.79 8.52 31.72 24.46l294.07-173.08q-2.77-7.92-4.19-16.14-1.42-8.22-1.42-16.96 0-38.51 27.47-65.94Q628.08-840 666.75-840q38.66 0 65.96 27.48Q760-785.05 760-746.38q0 38.66-27.42 65.96-27.43 27.29-66.17 27.29-21.52 0-39.68-8.96-18.17-8.96-31.09-23.96L301.1-513.33q2.93 7.92 4.35 16.29 1.42 8.37 1.42 16.96 0 8.59-1.34 16.4-1.35 7.81-4.12 15.73l294.9 173.85q13.11-15 31.06-23.89 17.95-8.88 39.23-8.88 38.89 0 66.14 27.47Q760-251.92 760-213.25q0 38.66-27.48 65.96Q705.05-120 666.38-120Zm.3-33.85q25.37 0 42.42-17.16 17.05-17.17 17.05-42.54 0-25.37-17.16-42.42-17.17-17.06-42.54-17.06-25.37 0-42.42 17.17-17.06 17.16-17.06 42.54 0 25.37 17.17 42.42 17.16 17.05 42.54 17.05Zm-453.9-266.56q25.7 0 42.97-17.16 17.28-17.17 17.28-42.54 0-25.38-17.39-42.43t-43.09-17.05q-25.04 0-41.87 17.16-16.83 17.17-16.83 42.54 0 25.38 16.94 42.43t41.99 17.05Zm453.9-266.56q25.37 0 42.42-17.17 17.05-17.16 17.05-42.54 0-25.37-17.16-42.42-17.17-17.05-42.54-17.05-25.37 0-42.42 17.16-17.06 17.17-17.06 42.54 0 25.37 17.17 42.42 17.16 17.06 42.54 17.06Zm-.12 473.53ZM213.44-480Zm453.12-266.56Z"/>') +
                "</svg>") + '</button><button class="' + N("ddl-progress-continue-button") + " " + N("ddl-button") + " " + N("ddl-button-default") + '">' + L(h) + '</button></div><div class="' + N("ddl-progress-button-row") + '"><button class="' + N("ddl-progress-search-button") + " " + N("ddl-button") + " " + N("ddl-button-default") + '" aria-label="' + N(l) + '" title="' + N(l) + '">' + M('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -960 960 960" class="ddl-progress-search-icon"><path d="m783.28-154-254.2-254.21q-29.8 26.4-69.18 40.46-39.37 14.06-79.18 14.06-95.76 0-162.09-66.2-66.32-66.19-66.32-161.52 0-95.33 66.19-161.65 66.2-66.32 161.49-66.32t161.91 66.23q66.61 66.23 66.61 161.53 0 41.36-14.77 80.77t-40.41 68.39l254.36 253.54L783.28-154ZM380.56-387.54q81.65 0 137.88-56.09 56.23-56.09 56.23-137.91t-56.23-137.91q-56.23-56.09-137.88-56.09-81.77 0-138.09 56.09-56.32 56.09-56.32 137.91t56.32 137.91q56.32 56.09 138.09 56.09Z"/></svg>') +
            L(db) + '</button></div></div><div class="' + N("ddl-progress-bottom-message") + '">' + L(J) + '</div><div class="' + N("ddl-progress-next-level-title") + '">' + L(e) + "</div></div>")
    }

    function zo(a) {
        const b = a.y;
        return M('<svg xmlns="http://www.w3.org/2000/svg" x="' + N(a.x - 27) + '" y="' + N(b - 27) + '" width="54" height="54" viewBox="0 0 54 54" class="ddl-progress-wildcard-slot"><path d="M0.337,26.5L26.5,0.337,52.663,26.5,26.5,52.663Zm0,0L26.5,0.337,52.663,26.5,26.5,52.663Z"/><path d="M4.216,26.5L26.5,4.216,48.784,26.5,26.5,48.784Zm0,0L26.5,4.216,48.784,26.5,26.5,48.784Z"/></svg>')
    };

    function Ao(a) {
        if (!yh()) return re ? `#GoogleDoodle ${U("share_msg")}` : `${U("share_msg")} #GoogleDoodle`;
        const b = [];
        var c = Math.floor(a.g.i / 3),
            d = a.g.i % 3;
        const e = [];
        for (let g = 0; g < d; g++) e.push("\ud83c\udf1f");
        e.length > 0 && b.push(e.join(""));
        for (d = 0; d < c; d++) b.push("\ud83c\udf1f\ud83c\udf1f\ud83c\udf1f");
        c = [...Object.values(Pj)];
        const f = new Set(a.g.j.map(g => g.definition.id));
        c = c.map(g => {
            let h;
            return f.has(g.id) ? (h = g.Hb) != null ? h : "\ud83c\udccf" : "\ud83d\udd39"
        }).join("");
        return U("share_msg2").replace("{{WILDCARDS}}",
            c).replace("{{STARS}}", b.join("\n")).replace("{{LEVEL}}", ck(`${a.g.i}`)).replace("{{SCORE}}", ck(`${a.g.Ea}`)).replace("{{LINK}}", "")
    }

    function Bo(a) {
        const b = Lj;
        switch (a.mode) {
            case 0:
                return Ij(b);
            case 2:
                return Gj(b);
            case 3:
            case 4:
                return Hj(b);
            case 1:
                return Promise.resolve();
            default:
                cb(a.mode, void 0)
        }
    }

    function Co(a, b, c) {
        return aj(fo(a, b), a.actions, c)
    }

    function Do(a) {
        m(function*() {
            yield a.delay(250);
            yield Co(a, ".ddl-progress-results-title")
        })
    }

    function Eo(a) {
        return m(function*() {
            const b = a.j.length,
                c = b < a.g.g;
            b === a.g.g && (Fo(a, b), S(R(), x.Uc));
            const d = new B(new E(new D(270, Go[b])));
            a.j.push(d);
            C(a.i, d);
            a.mode === 0 && (Ho(a, b, !1, 1), S(R(), x.Uc, 230), yield $i(d.get(ef)));
            Ho(a, b, c, 0);
            if (a.mode !== 0) {
                const e = d.get(F);
                e.alpha = 0;
                yield P(new w(1E3, 0, 1, f => {
                    e.alpha = f
                }), d)
            }
        })
    }

    function Io(a, b) {
        m(function*() {
            const c = b < a.g.g - 1,
                d = a.mode === 0,
                e = [Jo(a, b, !1, d)];
            c && e.push(Jo(a, b, !0, d));
            yield Promise.all(e)
        })
    }

    function Ko(a) {
        m(function*() {
            yield a.delay(500);
            yield Co(a, ".ddl-progress-results-stats");
            const b = fo(a, ".ddl-progress-results-level-stars"),
                c = fo(a, ".ddl-progress-results-total-stars"),
                d = a.g.u,
                e = a.g.Ea,
                f = e - d;
            f > 0 && (c.textContent = ck(`${f}`));
            yield Co(a, c);
            d > 0 && S(R(), x.xf);
            yield Promise.all([Lo(a, b, 0, d), Lo(a, c, f, e)])
        })
    }

    function Mo(a, b) {
        return m(function*() {
            return bj(fo(a, b), a.actions)
        })
    }

    function No(a) {
        return m(function*() {
            yield Co(a, ".ddl-progress-next-level-title");
            Fo(a, a.mode === 0 ? 0 : a.g.g);
            S(R(), x.wf)
        })
    }

    function Oo(a) {
        return m(function*() {
            const b = a.g.g;
            b < 0 || (b > 0 && (yield Jo(a, b - 1, !0, !0)), Dj(Lj, 4), Fo(a, b), S(R(), Po[b]), yield $i(Ho(a, b, !1, 3)), Ho(a, b, !0, 0))
        })
    }

    function Qo(a) {
        return m(function*() {
            yield Ro(a);
            S(R(), x.ub);
            a.mode !== 2 && a.mode !== 1 || S(R(), x.rf);
            a.mode === 3 ? (Rm || (Rm = !0, G.c = 14, I(1)), I(4)) : a.mode === 4 && I(109)
        })
    }

    function So(a) {
        return m(function*() {
            yield Promise.all([Mo(a, a.buttons), Mo(a, ".ddl-progress-results"), Mo(a, a.tb)])
        })
    }

    function To() {
        return m(function*() {
            const a = Lj;
            yield Dj(a, 1);
            yield Ij(a)
        })
    }

    function Uo(a) {
        return m(function*() {
            yj(R(), 1875);
            yield Promise.all([eo(a, a.actions, 1, 0, 750), a.delay(1500)]);
            a.ka.remove()
        })
    }

    function Vo(a) {
        return m(function*() {
            const b = [];
            for (let c = 0; c < a.g.g; c++) b.push(Wo(a, c));
            for (const c of a.T) b.push(Mo(a, c));
            yield Promise.all(b)
        })
    }

    function Xo(a) {
        return m(function*() {
            const b = [P(new w(1E3, 1, 0, c => {
                a.v.style.opacity = `${c}`
            }), a.actions)];
            for (let c = 0; c < a.j.length; c++) b.push(Yo(a, c));
            yield Promise.all(b)
        })
    }

    function Zo(a) {
        return m(function*() {
            const b = [];
            for (const c of $o) {
                const d = O(zo, {
                    x: c.x,
                    y: c.y
                });
                a.v.appendChild(d);
                b.push(Co(a, d))
            }
            yield Promise.all(b)
        })
    }

    function ap(a) {
        return m(function*() {
            const b = [],
                c = new D(56, 56);
            for (let e = 0; e < a.g.j.length; e++) {
                const f = nk(a.g.j[e], c);
                f.get(E).rotation = e < 2 ? Math.PI / 4 : -Math.PI / 4;
                mk(f, $o[e], c, 0, a.i, a.ka);
                var d = Co(a, f.get(T).el, 300);
                e !== a.g.j.length - 1 ? b.push(d) : (d = f.get(V), d.Ca = new D(0, 0), b.push(P(new p([new r(400), new q(() => {
                    S(R(), x.yc)
                }), new t([v(new Qe(1E3, d.Ca.W(), c, f.get(V).Ca), Na)])]), a.actions)))
            }
            yield Promise.all(b)
        })
    }

    function Lo(a, b, c, d) {
        return m(function*() {
            c === 0 && d === 0 ? b.textContent = ck("0") : yield P(new w(800, c, d, e => {
                e = Math.floor(e);
                b.textContent = ck(`${e>0?e:""}`)
            }), a.actions)
        })
    }

    function Fo(a, b) {
        P(ej(new D(270, Go[b]), a.v), a.actions)
    }

    function Ho(a, b, c, d) {
        c = a.qb[b][c ? 1 : 0].get(d);
        d = Yi(c, 24, d === 0);
        Zi(a.j[b], d);
        return d
    }

    function Yo(a, b) {
        return m(function*() {
            const c = a.j[b],
                d = c.get(F);
            yield P(new w(1E3, 1, 0, e => {
                d.alpha = e
            }), c);
            Je(a.i, c)
        })
    }

    function Jo(a, b, c, d) {
        const e = a.mode === 1,
            f = document.createElementNS("http://www.w3.org/2000/svg", "line");
        f.setAttribute("x1", "270");
        f.setAttribute("y1", `${bp[b][0]}`);
        f.setAttribute("x2", "270");
        f.setAttribute("y2", `${bp[b][d?0:1]}`);
        f.classList.add(c ? "ddl-progress-line-full" : "ddl-progress-line-empty");
        a.v.appendChild(f);
        c && a.T.push(f);
        if (e) return Promise.resolve();
        if (d) return P(v(new w(c ? 500 : 1E3, bp[b][0], bp[b][1], g => {
            f.setAttribute("y2", `${g}`)
        }), c ? Ka : Ia), a.actions);
        f.style.visibility = "hidden";
        f.style.opacity =
            "0";
        return Co(a, f)
    }

    function Wo(a, b) {
        return m(function*() {
            yield $i(a.j[b].get(ef));
            yield $i(Ho(a, b, !0, 4))
        })
    }

    function Ro(a) {
        return m(function*() {
            const b = Z(a, ".ddl-progress-continue-button");
            return new Promise(c => {
                const d = () => {
                    b.removeEventListener("click", d);
                    c()
                };
                b.addEventListener("click", d)
            })
        })
    }
    var ep = class extends go {
        constructor(a, b, c) {
            var d = c === 3 || c === 4 ? b.i + 1 : b.i;
            d = b.g >= 0 ? U("leveltitle").replace("%NUMBER%", ck(`${d}`)) : "";
            const e = U("leveltitle").replace("%NUMBER%", ck(`${b.i+1}`));
            var f = c === 4 ? "try_again" : c === 3 ? "playagain" : "continue",
                g = U("results_matchstars"),
                h = U("results_totalstars");
            f = U(f);
            var l = U("search"),
                n = U("share"),
                u;
            c === 2 ? u = "results_win" : c === 3 ? u = "lose_title" : c === 4 && (u = "tie_subtitle");
            u = u ? U(u) : "";
            var J;
            c === 0 ? J = "progress_title" : c === 1 && (J = b.o.length > 0 ? "win_keeplaying_02" : "win_keeplaying_03");
            J = J ? U(J) : "";
            super(a, O(yo, {
                width: 540,
                height: 960,
                ig: d,
                Wf: e,
                Qf: g,
                Bg: h,
                Af: f,
                og: l,
                rg: n,
                tb: u,
                hb: J,
                Cg: Ad() || !(!navigator.vendor || navigator.vendor.indexOf("Apple") !== 0),
                qg: U("search_query"),
                lg: ak
            }));
            this.g = b;
            this.mode = c;
            this.i = new Ke;
            this.Da = new B(new E, new Ze);
            this.actions = new B(new Ne);
            this.j = [];
            this.T = [];
            this.N = !1;
            b = vi();
            a = b.o;
            b = b.i;
            this.qb = [
                [new Map([
                    [0, [b.We]],
                    [1, a.Rc],
                    [2, a.Rc.slice().reverse()],
                    [3, a.Xe]
                ]), new Map([
                    [0, a.Ye],
                    [4, a.Ze]
                ])],
                [new Map([
                        [0, [b.df]],
                        [1, a.Sc],
                        [2, a.Sc.slice().reverse()],
                        [3, a.ef]
                    ]),
                    new Map([
                        [0, a.ff],
                        [4, a.hf]
                    ])
                ],
                [new Map([
                    [0, [b.jf]],
                    [1, a.Tc],
                    [2, a.Tc.slice().reverse()],
                    [3, a.kf]
                ]), new Map([
                    [0, a.lf]
                ])]
            ];
            this.Fa = Z(this, ".ddl-progress-canvas");
            this.v = Z(this, ".ddl-progress-svg-container");
            this.tb = Z(this, ".ddl-progress-top-message");
            this.hb = Z(this, ".ddl-progress-bottom-message");
            this.buttons = Z(this, ".ddl-progress-buttons");
            this.La = Z(this, ".ddl-progress-search-button");
            this.ha = Z(this, ".ddl-progress-share-button");
            this.ta = cp[this.mode]
        }
        o() {
            this.mode !== 1 && xj(R(), this.ta, 750);
            this.La.addEventListener("click",
                () => {
                    S(R(), x.ub);
                    dg(U("search_query"))
                });
            const a = ne(mh),
                b = Ao(this),
                c = new li(this.nb, b, a, mh, () => {
                    this.ka.inert = !0;
                    this.ka.ariaHidden = "true"
                }, () => {
                    this.ka.inert = !1;
                    this.ka.ariaHidden = "false";
                    this.ha.focus()
                });
            this.ha.addEventListener("click", () => {
                // Внутри VK - нативное окно «Поделиться» со ссылкой на игру (см. vk.js).
                if (window.loonaVK && window.loonaVK.share()) {
                    S(R(), x.ub);
                    return
                }
                fi(a, b, () => {
                    S(R(), x.ub);
                    I(18);
                    c.o();
                    c.oa.appendChild(c.g);
                    c.i.focus()
                })
            });
            co(this, 1);
            K(this.tb, 28, 470, 80, 24);
            K(this.hb, 28, 470, 80, 24);
            K(fo(this, ".ddl-progress-results-stats"), 24, 470, 100, 17);
            K(fo(this, ".ddl-progress-continue-button"), 30, 400, 60, 24);
            C(this.i, this.Da);
            C(this.i, this.actions);
            this.i.g = [new Pe(this.i), new of(this.i), new gk(this.i), new zj(this.i), new nf(this.i, this.Fa.getContext("2d"))];
            this.N = !0;
            return Promise.resolve()
        }
        H() {
            const a = this;
            return m(function*() {
                a.mode !== 0 && a.mode !== 2 || S(R(), x.qf);
                var b = [2, 3, 4].includes(a.mode);
                const c = Lj,
                    d = Bo(a);
                a.mode === 2 && (yield Co(a, a.tb));
                b && Do(a);
                a.mode === 0 && Co(a, a.hb);
                const e = a.mode === 0;
                yield dp(e, Eo(a));
                Io(a, 0);
                b && Ko(a);
                yield dp(e, Eo(a));
                Io(a, 1);
                yield dp(e, Eo(a));
                a.mode === 0 && (yield a.delay(500), yield Mo(a, a.hb),
                    yield No(a));
                switch (a.mode) {
                    case 0:
                    case 2:
                        yield Promise.all([a.delay(1E3), d]);
                        yield Oo(a);
                        a.g.g++;
                        a.mode === 2 && (Co(a, a.buttons), yield Qo(a), yield So(a));
                        a.g.g < a.j.length ? (b = To(), a.mode === 2 && (yield No(a)), yield b) : a.g.o.length > 0 || To();
                        yield Uo(a);
                        break;
                    case 3:
                    case 4:
                        yield d;
                        yield Co(a, a.tb);
                        a.mode === 3 && (yield Vo(a));
                        b = Co(a, a.buttons).then(() => {
                            Dj(c, 6)
                        });
                        yield Qo(a);
                        yield So(a);
                        yield Xo(a);
                        yield b;
                        Ij(c);
                        yield Uo(a);
                        break;
                    case 1:
                        yield d;
                        yield Zo(a);
                        yield ap(a);
                        yield Co(a, a.hb);
                        Co(a, a.buttons);
                        yield Qo(a);
                        b = To();
                        yield Uo(a);
                        yield b;
                        break;
                    default:
                        cb(a.mode, void 0)
                }
            })
        }
        update(a) {
            this.N && this.i.update(a)
        }
        delay(a) {
            return Q(a, this.actions)
        }
    };

    function dp(a, b) {
        return m(function*() {
            a && (yield b)
        })
    }
    const Go = [606, 453, 300],
        bp = [
            [Go[0] - 25, Go[1] + 18],
            [Go[1] - 35, Go[2] + 18]
        ],
        $o = [new D(70, 120), new D(130, 200), new D(470, 120), new D(410, 200)],
        cp = [x.Vc, x.xc, x.Vc, x.Fc, x.Fc],
        Po = [x.tf, x.uf, x.vf];

    function fp() {
        return M('<button class="' + N("ddl-rules-button") + " " + N("ddl-button") + '"><span>?</span></button>')
    }

    function gp(a) {
        var b = a.title;
        const c = a.zg,
            d = a.Ag;
        var e = a.Vf;
        const f = a.dg,
            g = a.Zf,
            h = a.Hf,
            l = a.Gf,
            n = a.Df,
            u = a.Cf;
        var J = a.zf;
        const ja = a.yf;
        var db = a.lineHeight;
        a = M;
        db = '<div class="' + N("ddl-rules") + '"' + (db !== void 0 ? ' style="line-height: ' + N(Oh(db)) + '"' : "") + ">";
        b = M('<span class="' + N("ddl-rules-title") + '">' + L(b) + '</span><div class="' + N("ddl-rules-subtitle-container") + '"><span class="' + N("ddl-rules-subtitle") + '">' + L(c) + '</span><span class="' + N("ddl-rules-subtitle") + '">' + L(d) + "</span></div>");
        b = db + b;
        e = M('<span class="' +
            N("ddl-matches-title") + '">' + L(e) + '</span><div class="' + N("ddl-rules-matches") + '"><div class="' + N("ddl-rules-match-row") + '"><div class="' + N("ddl-rules-match") + " " + N("ddl-rules-match-pair") + '"><div class="' + N("ddl-rules-phase-graphic") + '"></div><span class="' + N("ddl-rules-match-title") + '">' + L(f) + '</span><span class="' + N("ddl-rules-match-points") + '">' + L(g) + '</span></div><div class="' + N("ddl-rules-match") + " " + N("ddl-rules-match-pair") + '"><div class="' + N("ddl-rules-fullmoon-graphic") + '"></div><span class="' +
            N("ddl-rules-match-title") + '">' + L(h) + '</span><span class="' + N("ddl-rules-match-points") + '">' + L(l) + '</span></div></div><div class="' + N("ddl-rules-match") + " " + N("ddl-match-cycle") + '"><div class="' + N("ddl-rules-cycle-graphic") + '"></div><span class="' + N("ddl-rules-match-title") + '">' + L(n) + '</span><span class="' + N("ddl-rules-match-points") + '">' + L(u) + "</span></div></div>");
        e = b + e;
        J = M('<div class="' + N("ddl-rules-bonus") + '"><span class="' + N("ddl-bonus-title") + '">' + L(J) + '</span><div class="' + N("ddl-bonus-row") +
            '"><div class="' + N("ddl-bonus-light") + '"></div><div class="' + N("ddl-bonus-dark") + '"></div></div><span class="' + N("ddl-bonus-subtitle") + '">' + L(ja) + "</span></div>");
        return a(e + J + M('<button class="' + N("ddl-button") + " " + N("ddl-rules-close") + '"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 39 39"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2px" fill-rule="evenodd" d="M38,1L1,38"/><path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2px" fill-rule="evenodd" d="M1,1L38,38"/></svg></button>') +
            "</div>")
    };

    function hp(a) {
        ip || (ip = new jp(a));
        return ip
    }

    function jo(a) {
        return m(function*() {
            a.o && (a.i.removeEventListener("click", a.v), S(R(), x.Ue), a.button.style.visibility = "visible", yield P(new p([new t([new p([new r(100), new w(200, 1, 0, b => {
                a.g.style.opacity = `${b}`;
                a.i.style.opacity = `${b}`;
                a.button.style.opacity = `${1-b}`
            })]), v(new w(300, 0, 1060, b => {
                a.g.style.transform = `translateY(${b}px) scale(${a.u})`
            }), Ja)])]), a.actions), a.i.style.visibility = "hidden", a.g.style.visibility = "hidden", a.g.style.transform = "translateY(1060) scale(1)", a.o = !1, a.u = 1)
        })
    }

    function kp(a, b, c) {
        b = a.g.querySelector(`.${b}`);
        b.style.background = pi(a.j.j, c);
        b.style.width = `${c[3]}px`;
        b.style.height = `${c[4]}px`
    }

    function lp(a) {
        a.button.addEventListener("click", () => void mp(a));
        a.g.querySelector(".ddl-rules-close").addEventListener("click", () => void jo(a))
    }

    function mp(a) {
        return m(function*() {
            a.o || (a.o = !0, a.u = 1, a.i.style.visibility = "visible", a.g.style.visibility = "visible", a.i.style.opacity = "0", a.g.style.opacity = "0", a.g.style.transform = `translateY(${1060}) scale(${a.u})`, S(R(), x.Ve), yield P(new t([new w(200, 0, 1, b => {
                    a.g.style.opacity = `${b}`;
                    a.i.style.opacity = `${b}`;
                    a.button.style.opacity = `${1-b}`
                }), v(new w(300, 1060, 0, b => {
                    a.g.style.transform = `translateY(${b}px) scale(${a.u})`
                }), La)]), a.actions), a.i.addEventListener("click", a.v), a.button.style.visibility =
                "hidden")
        })
    }
    var jp = class {
            constructor(a) {
                this.g = O(gp, {
                    title: U("rules_title"),
                    zg: U("rules_instruction1"),
                    Ag: U("rules_instruction2"),
                    Vf: U("rules_match"),
                    dg: U("rules_phasepair_title"),
                    Zf: U("rules_phasepair_points"),
                    Hf: U("rules_fullmoon_title"),
                    Gf: U("rules_fullmoon_points"),
                    Df: U("rules_cycle_title"),
                    Cf: U("rules_cycle_points"),
                    zf: U("bonus_title"),
                    yf: U("bonus_instruction"),
                    lineHeight: Zj
                });
                this.button = O(fp);
                this.H = new Ke;
                this.actions = new B(new Ne);
                this.u = 1;
                this.o = !1;
                this.v = b => {
                    b.target === b.currentTarget && this.o && (jo(this),
                        this.i.removeEventListener("click", this.v))
                };
                this.j = vi();
                this.i = a.querySelector(".ddl-rules-container");
                kp(this, "ddl-rules-phase-graphic", this.j.i.Te);
                kp(this, "ddl-rules-fullmoon-graphic", this.j.i.Qe);
                kp(this, "ddl-rules-cycle-graphic", this.j.i.Se);
                kp(this, "ddl-bonus-light", this.j.i.Re);
                kp(this, "ddl-bonus-dark", this.j.i.Pe)
            }
            update(a) {
                this.H.update(a)
            }
        },
        ip;

    function np(a, b) {
        var c = b != null ? b : {};
        b = a.fontFamily;
        a = a.fontWeight;
        c = c && c.jd;
        return M("<style" + (c ? ' nonce="' + N(Uh(c)) + '"' : "") + ">.ddl-doodle-container {--ddl-font-family: '" + String(b).replace(Sh, Rh) + "'; --ddl-font-weight: " + Oh(a) + ";}</style>")
    }

    function op() {
        return M('<canvas class="ddl-play-button" width="100" height="100"></canvas>')
    }

    function pp(a) {
        a = a.month;
        return M('<div class="' + N("ddl-doodle-container") + '"><div class="' + N("ddl-background") + '"><div class="' + N("ddl-background-inner") + '"><div class="' + N("ddl-background-stars") + '"></div><canvas class="' + N("ddl-background-moon-canvas") + '"></canvas></div></div><div class="' + N("ddl-doodle-content") + '"></div><div class="' + N("ddl-rules-container") + '"></div><div class="' + N("ddl-frame") + '"><span class="' + N("ddl-frame-month") + '">' + L(a) + '</span></div><div class="' + N("ddl-doodle-mute-container") +
            '"></div><div class="' + N("ddl-doodle-fade") + '"></div></div>')
    }

    function qp() {
        return M('<div class="' + N("ddl-game-container") + '"></div>')
    }

    function rp(a) {
        a = a.text;
        return M('<button class="' + N("ddl-skip-button") + " " + N("ddl-button") + " " + N("ddl-button-default") + '">' + L(a) + "</button>")
    };

    function sp(a, b) {
        return m(function*() {
            a.o = b;
            return yield b.play()
        })
    }
    var tp = class {
            constructor(a) {
                this.Ga = a;
                this.i = hp()
            }
            play() {
                const a = this;
                return m(function*() {
                    for (;;) {
                        const b = O(qp);
                        a.Ga.appendChild(b);
                        yield a.j(b);
                        b.remove()
                    }
                })
            }
            update(a) {
                let b;
                (b = this.o) == null || b.update(a)
            }
        },
        up = class extends tp {
            constructor(a) {
                super(a);
                this.g = new Um
            }
            j(a) {
                const b = this;
                return m(function*() {
                    b.g.g = -1;
                    yield sp(b, new ep(a, b.g, 0));
                    if (b.g.i === 0) {
                        var c = lj > 0 ? $k : Zk;
                        c = b.g.j.length === 0 ? [c, al, bl] : [c, gn(dl), gn(el)]
                    } else c = [gn(cl), gn(dl), gn(el)];
                    for (let h = 0; h < c.length; ++h) {
                        var d = yield sp(b, new ko(a,
                            c[h], b.g.j, b.i, b.g.i));
                        b.g.u = d.Ea.Ua.total;
                        b.g.Ea += d.Ea.Ua.total;
                        b.g.Ja += d.Ja;
                        d.result === 0 && b.g.i++;
                        var e = d,
                            f = b.g.Ea;
                        H("d4", e.result);
                        H("d5", e.Ea.Ua.total);
                        H("d13", e.Ea.Ua.Ha);
                        H("d15", e.Ea.Ua.Ra);
                        H("d6", e.Ea.ob.total);
                        H("d14", e.Ea.ob.Ha);
                        H("d16", e.Ea.ob.Ra);
                        G.s = f;
                        I(e.result === 0 ? 106 : e.result === 1 ? 107 : 108);
                        G.c = 20 + 2 * Qm;
                        I(1);
                        delete G.d9;
                        delete G.d4;
                        delete G.d5;
                        delete G.d13;
                        delete G.d15;
                        delete G.d6;
                        delete G.d14;
                        delete G.d16;
                        yield sp(b, new ep(a, b.g, d.result === 0 ? 2 : d.result === 2 ? 4 : 3));
                        if (d.result === 1) {
                            c = b.g;
                            c.Ea = 0;
                            c.Ja = 0;
                            c.i = 0;
                            for (var g of c.j) g.Ob = !1;
                            return
                        }
                        d.result === 2 && --h
                    }
                    d = b.g;
                    (c = d.o.shift()) ? (g = Sm(d, c), Tm(d), d = d.j.length, H("d7", c.id, !0), G.c = 15 + d - 1, I(1)) : g = void 0;
                    g && (yield sp(b, new xo(a, g)), yield sp(b, new ep(a, b.g, 1)))
                })
            }
        },
        vp = class extends tp {
            constructor(a) {
                super(a);
                new Um;
                document.querySelector(".ddl-doodle-fade").style.visibility = "hidden"
            }
            j(a) {
                const b = this;
                return m(function*() {
                    let c = Xk;
                    const d = Wk[""];
                    d && (c = d);
                    yield sp(b, new ko(a, c, [...Object.values(Pj)].map(e => new lk(e)), b.i, 0))
                })
            }
        };

    function wp(a) {
        a = a.Tf;
        return M(Xl(M('<div class="' + N("ddl-loading-screen") + '"><canvas class="' + N("ddl-loading-spinner") + '" width="150" height="150"></canvas><span class="' + N("ddl-loading-text") + '">' + L(a) + "</span></div>")))
    };
    var xp = class extends go {
        constructor(a, b) {
            var c = O(wp, {
                Tf: U("loading")
            });
            super(a, c);
            this.N = b;
            this.i = new Ke;
            this.v = new B(new E, new Ze);
            this.actions = new B(new Ne);
            this.g = vi();
            a = new E;
            b = new F(kf(this.g.o.zc[0]));
            c = ef;
            if (jf === void 0) throw Error();
            var d = ff(jf, this.g.o.zc);
            this.j = new B(a, b, new c(d));
            C(this.i, this.v);
            C(this.i, this.j);
            C(this.i, this.actions);
            this.j.get(ef).framesPerSecond = 24
        }
        o() {
            const a = this;
            return m(function*() {
                var b = a.ka.querySelector(".ddl-loading-spinner").getContext("2d");
                a.i.g = [new of(a.i),
                    new Pe(a.i), new nf(a.i, b)
                ];
                G.c = 0;
                I(1);
                co(a, 0);
                yield eo(a, a.actions, 0, 1)
            })
        }
        H() {
            const a = this;
            return m(function*() {
                // Адрес видео-интро можно задать через window.LOONA_INTRO_URL (сборка для VK); пустая строка - интро нет.
                const c = window.LOONA_INTRO_URL !== void 0 ? window.LOONA_INTRO_URL : xe("intro.mp4"),
                    b = [ni(a.g.j, [a.g.g.xd, a.g.g.fe, a.g.g.he, a.g.g.le, a.g.g.oe, a.g.g.qe, a.g.g.re, a.g.g.te, a.g.g.ue, a.g.g.we, a.g.g.xe, a.g.g.Ge, a.g.g.He, a.g.g.Ie, a.g.g.Je, a.g.g.Ke, a.g.g.Le, a.g.g.Me, a.g.g.Ne, a.g.g.Oe]), (new Cg(xe("border.png"))).i(), (new Cg(xe("button_border.png"))).i(), (new Cg(xe("border-card.png"))).i(), c ? a.N.load(c) : Promise.resolve(), bd.jc.i()];
                yield Promise.all([...b, ai(1500)]);
                yield P(Mm(),
                    a.actions);
                G.c = 1;
                I(1)
            })
        }
        update(a) {
            this.i.update(a)
        }
        u() {
            const a = this;
            return m(function*() {
                var b = Lj;
                b.u.style.visibility = "visible";
                b.u.style.opacity = "1";
                a.ka.remove();
                a.g.j.g[cf(a.g.g.Qc)].H()
            })
        }
    };

    function yp(a) {
        return m(function*() {
            yield a.g.promise
        })
    }
    var zp = class {
        constructor() {
            this.g = yf();
            this.wa = O(rp, {
                text: U("skip")
            });
            this.wa.addEventListener("click", () => {
                S(R(), x.ub);
                this.g.resolve()
            })
        }
    };

    function Ap() {
        return M(Xl(M("")))
    }

    function Bp() {
        return M('<div class="' + N("ddl-intro-text") + '"></div>')
    };

    function Cp(a, b) {
        if (a.v.length !== 0) {
            var c = a.v[0];
            if (!(b < c.startTime))
                if (a.v.shift(), c.type === 0) Dp(a, U(c.text)), a.g.style.top = `${c.Pa}px`, Oe(a.actions, new p([new q(() => {
                    a.g.style.visibility = "visible"
                }), new w(300, 0, 1, d => {
                    a.g.style.opacity = `${d}`
                })]));
                else if (c.type === 1) Oe(a.actions, new p([new w(300, 1, 0, d => {
                a.g.style.opacity = `${d}`
            }), new q(() => {
                a.g.style.visibility = "hidden"
            })]));
            else throw Error("L`" + c.type);
        }
    }

    function Ep(a, b) {
        return m(function*() {
            if (!a.N) {
                a.N = Mm(2E3);
                const c = [a.N];
                b && c.push(new w(2E3, a.video.g.volume, 0, d => {
                    a.video.g.volume = d
                }));
                yield P(new t(c), a.actions)
            }
        })
    }

    function Dp(a, b) {
        a.g.innerText = b;
        K(a.g, 31, 460, 125, 18)
    }
    var Gp = class extends go {
        constructor(a, b) {
            const c = O(Ap, {
                width: 540,
                height: 960
            });
            super(a, c);
            this.video = b;
            this.i = new Ke;
            this.actions = new B(new Ne);
            this.v = [...Fp];
            this.j = new zp;
            this.g = O(Bp);
            this.ka.appendChild(this.video.g);
            this.ka.appendChild(this.j.wa);
            this.ka.appendChild(this.g)
        }
        o() {
            const a = this;
            return m(function*() {
                co(a, 1);
                K(a.j.wa, 24, 175, 70, 18);
                a.video.g.addEventListener("timeupdate", () => {
                    const b = a.video.g.currentTime;
                    Cp(a, b * 1E3);
                    b > 29 && Ep(a, !1)
                });
                C(a.i, a.actions);
                a.i.g = [new Pe(a.i)];
                yield P(Om(),
                    a.actions)
            })
        }
        resume() {
            this.video.resume()
        }
        pause() {
            this.video.pause()
        }
        H() {
            const a = this;
            return m(function*() {
                G.c = 2;
                I(1);
                const b = fj.ld();
                Zc(b, () => {
                    var d = a.video,
                        e = !b.isMuted();
                    d.g.muted = !e
                });
                const c = a.video.play();
                (yield Promise.race([c.rd.then(() => !1), yp(a.j).then(() => m(function*() {
                    I(101);
                    yield Ep(a, !0);
                    return !0
                }))])) || (G.c = 3, I(1))
            })
        }
        update(a) {
            this.i.update(a)
        }
        u() {
            const a = this;
            return m(function*() {
                a.ka.remove();
                yield P(Om(), a.actions);
                Dj(Lj, 1)
            })
        }
    };

    // Замена сцены интро, когда видео нет (LOONA_INTRO_URL === ""): делает то же, что Gp при выходе, -
    // плавно убирает белую заливку после экрана загрузки и переключает фон в игровой режим.
    function loonaSkipIntro() {
        return new Promise(a => {
            const b = document.querySelector(".ddl-doodle-fade"),
                c = performance.now(),
                d = e => {
                    const f = Math.min(1, (e - c) / 750);
                    b.style.opacity = `${1 - f}`;
                    f < 1 ? requestAnimationFrame(d) : (b.style.visibility = "hidden", Dj(Lj, 1), a())
                };
            requestAnimationFrame(d)
        })
    }
    const Fp = [{
        type: 0,
        startTime: 1664,
        Pa: 590,
        text: "intro_01_jan2"
    }, {
        type: 1,
        startTime: 7613
    }, {
        type: 0,
        startTime: 9568,
        Pa: 710,
        text: "intro_02"
    }, {
        type: 1,
        startTime: 18554
    }, {
        type: 0,
        startTime: 19385,
        Pa: 730,
        text: "intro_03"
    }, {
        type: 1,
        startTime: 25200
    }, {
        type: 0,
        startTime: 26749,
        duration: 3333,
        Pa: 280,
        text: "intro_04"
    }, {
        type: 1,
        startTime: 29078
    }];
    var Hp = "en af sq am ar hy az eu be bn bs bg my ca zh-HK zh-CN zh-TW hr cs da nl en-GB et fa fil fi fr fr-CA gl ka de el gu iw hi hu is id it ja kn kk km ko ky lo lv lt mk ms ml mr mn ne no pl pt-BR pt-PT pa ro ru sr si sk sl es-419 es sw sv ta te th tr uk ur uz vi zu ".split(" ");
    var qi = [{
            filename: "play-sprite.png",
            size: [1439, 512]
        }, {
            filename: "background-sprite.png",
            size: [1980, 1936]
        }, {
            filename: "moon-sprite-dark-moon-eye-open-in.png",
            size: [1337, 189]
        }, {
            filename: "moon-sprite-dark-moon-eye-open-out.png",
            size: [1337, 381]
        }, {
            filename: "moon-sprite-dark-moon-fade-in.png",
            size: [1605, 189]
        }, {
            filename: "moon-sprite-light-moon-fade-in.png",
            size: [1337, 381]
        }, {
            filename: "moon-sprite-light-moon-fade-out.png",
            size: [1337, 381]
        }, {
            filename: "moon-sprite-light-moon-happy.png",
            size: [801, 381]
        }, {
            filename: "moon-sprite-light-moon-sad.png",
            size: [1069, 381]
        }, {
            filename: "moon-sprite-light-moon-wildcard-gift.png",
            size: [1596, 1525]
        }, {
            filename: "moon-sprite-light-moon-win.png",
            size: [1605, 189]
        }, {
            filename: "moon-sprite-light-moon-win-fade-out.png",
            size: [1337, 381]
        }, {
            filename: "cards-sprite.png",
            size: [1012, 509]
        }, {
            filename: "spinner-sprite.png",
            size: [1986, 456]
        }, {
            filename: "progress-empty-sprite.png",
            size: [2023, 802]
        }, {
            filename: "progress-star1-empty-to-full-sprite.png",
            size: [925, 461]
        }, {
            filename: "progress-star1-full-sprite.png",
            size: [1157, 461]
        }, {
            filename: "progress-star1-full-to-empty-sprite.png",
            size: [809, 809]
        }, {
            filename: "progress-star2-empty-to-full-sprite.png",
            size: [1907, 570]
        }, {
            filename: "progress-star2-full-sprite.png",
            size: [1143, 1334]
        }, {
            filename: "progress-star2-full-to-empty-sprite.png",
            size: [1907, 952]
        }, {
            filename: "progress-star3-empty-to-full-sprite.png",
            size: [952, 1525]
        }, {
            filename: "progress-star3-full-sprite.png",
            size: [1143, 1334]
        }, {
            filename: "rules-sprite.png",
            size: [501, 180]
        }],
        wi = [12, 0, 203, 100, 100],
        xi = [12, 0, 0, 200, 200],
        yi = [12, 103, 203, 100, 100],
        zi = [12, 206, 203, 100, 100],
        Ai = [12, 309, 203, 100, 100],
        Bi = [12, 412, 203, 100, 100],
        Ci = [12, 515, 203, 100, 100],
        Di = [12, 618, 203, 100, 100],
        Ei = [12, 721, 203, 100, 100],
        Fi = [12, 824, 203, 100, 100],
        Gi = [12, 0, 306, 100, 100],
        Hi = [12, 103, 306, 100, 100],
        Ii = [12, 206, 306, 100, 100],
        Ji = [12, 309, 306, 100, 100],
        Ki = [12, 412, 306, 100, 100],
        Li = [12, 515, 306, 100, 100],
        Mi = [12, 618, 306, 100, 100],
        Ni = [12, 721, 306, 100, 100],
        Oi = [12, 824, 306, 100, 100],
        Pi = [12, 0, 409, 100, 100],
        Qi = [12, 103, 409, 100, 100],
        Ri = [12, 206, 409, 100, 100],
        Si = [12, 309, 409, 100, 100],
        Ti = [12, 412, 409, 100, 100],
        Ui = [12, 515, 409, 100, 100],
        Vi = [12, 618, 409, 100, 100];
    var Ip;
    {
        var Jp = class extends ri {};
        const a = "Za";
        if (Jp.Za && Jp.hasOwnProperty(a)) Ip = Jp.Za;
        else {
            var Kp = new Jp;
            Ip = Jp.Za = Kp
        }
    }
    const Wi = Ip;
    var Lp = new Xi;
    var Mp = {
        wildcard_aquarius: {
            type: "legendary_wildcard",
            id: "wildcard_aquarius",
            mb: [12, 203, 0, 200, 200],
            Cb: xi,
            Ka: {
                title: "wc_jan_aquarius_name",
                description: "wc_jan_aquarius_mechanic",
                Bb: "wc_jan_aquarius_popup1",
                info: "wc_jan_aquarius_description",
                query: "wc_jan_aquarius_query"
            },
            Hb: "\u2652"
        },
        wildcard_light_of_venus: {
            type: "legendary_wildcard",
            id: "wildcard_light_of_venus",
            mb: [12, 406, 0, 200, 200],
            Cb: xi,
            Ka: {
                title: "wc_jan_lightvenus_name",
                description: "wc_jan_lightvenus_mechanic",
                Bb: "wc_jan_lightvenus_popup1",
                info: "wc_jan_lightvenus_description",
                query: "wc_jan_lightvenus_query"
            },
            Hb: "\ud83d\udca1"
        },
        wildcard_moon_apogee: {
            type: "legendary_wildcard",
            id: "wildcard_moon_apogee",
            mb: [12, 609, 0, 200, 200],
            Cb: xi,
            Ka: {
                title: "wc_jan_moonapogee_name",
                description: "wc_jan_moonapogee_mechanic",
                Bb: "wc_jan_moonapogee_popup1",
                info: "wc_jan_moonapogee_description",
                query: "wc_jan_moonapogee_query"
            },
            Hb: "\ud83e\udd0f"
        },
        wildcard_wolf_moon: {
            type: "legendary_wildcard",
            id: "wildcard_wolf_moon",
            mb: [12, 812, 0, 200, 200],
            Cb: xi,
            Ka: {
                title: "wc_jan_wolfmoon_name",
                description: "wc_jan_wolfmoon_mechanic",
                Bb: "wc_jan_wolfmoon_popup1",
                info: "wc_jan_wolfmoon_description",
                query: "wc_jan_wolfmoon_query"
            },
            Hb: "\ud83d\udc3a"
        }
    };
    Gn("wildcard_aquarius", Nn);
    Gn("wildcard_light_of_venus", Mn);
    Gn("wildcard_moon_apogee", On);
    Gn("wildcard_wolf_moon", Ln);
    var Np = {
        new_moon: {
            Ta: Ai,
            back: wi,
            Ba: zi,
            Aa: yi
        },
        waxing_crescent: {
            Ta: Di,
            back: wi,
            Ba: Ci,
            Aa: Bi
        },
        first_quarter: {
            Ta: Gi,
            back: wi,
            Ba: Fi,
            Aa: Ei
        },
        waxing_gibbous: {
            Ta: Ji,
            back: wi,
            Ba: Ii,
            Aa: Hi
        },
        full_moon: {
            Ta: Mi,
            back: wi,
            Ba: Li,
            Aa: Ki
        },
        waning_gibbous: {
            Ta: Pi,
            back: wi,
            Ba: Oi,
            Aa: Ni
        },
        third_quarter: {
            Ta: Si,
            back: wi,
            Ba: Ri,
            Aa: Qi
        },
        waning_crescent: {
            Ta: Vi,
            back: wi,
            Ba: Ui,
            Aa: Ti
        }
    };
    var Pp = class {
        constructor() {
            var a = Op;
            this.g = Lp;
            this.j = a;
            this.o = Np;
            this.u = Mp;
            this.i = Hp
        }
    };

    function Qp(a) {
        a.isVisible = !0;
        Od() && a.i.start()
    }
    var Rp = class {
        constructor(a) {
            this.g = new Ke;
            this.isVisible = !0;
            this.i = new Td(e => {
                this.update(e)
            });
            const b = a.getContext("2d");
            a.classList.add("showPlayButton");
            this.g.g = [new of(this.g), new nf(this.g, b)];
            a = vi();
            const {
                Ff: c,
                animation: d
            } = gf(a.j, a.o.Ae);
            C(this.g, new B(new E, new Ze, c, d));
            this.g.update(1)
        }
        update(a) {
            Od() && this.isVisible && this.g.update(a)
        }
        pause() {
            this.i.pause()
        }
        resume() {
            this.isVisible && Od() && this.i.start()
        }
    };

    function Sp(a) {
        var b = U("tutorial_01");
        return m(function*() {
            yield P(ym(a.v, b), a.actions);
            yield Q(7E3, a.actions)
        })
    }

    function Tp(a) {
        return m(function*() {
            G.c = 5;
            I(1);
            yield Promise.all([Up(a, "waxing_crescent", "0"), Vp(a, U("tutorial_02"), 0)]);
            yield Wp(a, "waxing_crescent", "1", {
                text: U("tutorial_03"),
                duration: 4E3
            })
        })
    }

    function Vp(a, b, c) {
        return m(function*() {
            yield P(bn(a.v, b), a.actions);
            c > 0 && (yield Q(c, a.actions))
        })
    }

    function Xp(a) {
        return m(function*() {
            G.c = 6;
            I(1);
            yield Promise.all([Up(a, "third_quarter", "3"), Vp(a, U("tutorial_05"), 0)]);
            yield Wp(a, "first_quarter", "4", {
                text: U("tutorial_06"),
                duration: 4E3
            })
        })
    }

    function Yp(a) {
        return m(function*() {
            G.c = 7;
            I(1);
            yield Promise.all([Up(a, "new_moon", "6"), Up(a, "third_quarter", "8")]);
            yield Vp(a, U("tutorial_08"), 0);
            yield Wp(a, "waning_crescent", "7", {
                text: U("tutorial_09"),
                duration: 4E3
            })
        })
    }

    function Zp(a) {
        return m(function*() {
            G.c = 8;
            I(1);
            yield Promise.all([Up(a, "waning_gibbous", "5"), new Promise(b => m(function*() {
                yield Q(1E3, a.actions);
                yield Vp(a, U("tutorial_11"), 7E3);
                b()
            }))])
        })
    }

    function $p(a) {
        return m(function*() {
            G.c = 9;
            I(1);
            yield Promise.all([Vp(a, U("tutorial_12"), 0), Wp(a, "full_moon", "2", {
                text: U("tutorial_13"),
                duration: 7E3
            })])
        })
    }

    function aq(a) {
        return m(function*() {
            G.c = 10;
            I(1);
            yield Promise.all([Vp(a, U("tutorial_15"), 5E3), P(new Fm(1, a.o, a.g, a.i, a.u), a.actions)])
        })
    }

    function bq(a) {
        return m(function*() {
            G.c = 11;
            I(1);
            yield Promise.all([Vp(a, U("landingpage_rules"), 7E3), new Promise(b => m(function*() {
                yield Q(1E3, a.actions);
                yield aj(hp().button, a.actions, 300);
                b()
            }))])
        })
    }

    function cq(a) {
        return m(function*() {
            yield Pk(a.i, a.actions);
            yield Sp(a);
            yield Tp(a);
            yield Vp(a, U("tutorial_04"), 4E3);
            yield Xp(a);
            yield Vp(a, U("tutorial_07"), 5E3);
            yield Yp(a);
            yield Vp(a, U("tutorial_10"), 3E3);
            yield Zp(a);
            yield $p(a);
            yield Vp(a, U("tutorial_14"), 4E3);
            yield Q(1E3, a.actions);
            yield aq(a);
            yield Q(1E3, a.actions);
            yield bq(a);
            yield P(zm(a.v), a.actions)
        })
    }

    function Up(a, b, c) {
        return m(function*() {
            var d = a.N;
            d = Vm(d, Mj[b], d.cardSize);
            const e = a.i.tiles.get(c),
                f = d.get(T).el;
            d.get(E).position.set(270, -100);
            jk(d, 180);
            Se(d.get(V).Ca, Rk(a.i));
            C(a.g, d);
            a.H.appendChild(f);
            yield aj(f, a.actions, 10);
            yield dq(a, {
                U: d,
                va: e,
                V: a.T
            })
        })
    }

    function Wp(a, b, c, d) {
        return m(function*() {
            var e = a.N;
            e = Vm(e, Mj[b], e.cardSize);
            yield eq(a, a.o, e);
            a.i.tiles.get(c);
            e = new Set([c]);
            for (var f of a.g.find(X)) {
                const g = f.get(X);
                g.g = e.has(g.id);
                const h = f.get(Bk);
                h.i = !1;
                h.set(g.g);
                h.update(f)
            }
            f = yield xn(new Cn(a.g, a.o, a.j, a.actions));
            f = [dq(a, f)];
            d && f.push(Vp(a, d.text, d.duration));
            yield Promise.all(f)
        })
    }

    function dq(a, b) {
        return m(function*() {
            b.U.get(W);
            yield Tk(a.i, b.va, b.U, a.actions);
            yield ol(b.V.get(Y).Ma, b.U);
            b.U.get(pk).set(!1);
            var c = Sl(a.ha, b);
            const d = new Rl(a.g);
            for (const e of c) Pl(d, e), c = (new Im(e, a.i, a.g, a.u)).create(), yield P(c, a.actions), a.state.update(e);
            Ql(d)
        })
    }

    function eq(a, b, c) {
        return m(function*() {
            yield ml(b.get(Y).Ma, c, a.actions, a.g)
        })
    }
    var fq = class {
        constructor(a, b, c, d) {
            this.g = a;
            this.j = b;
            this.ta = c;
            this.actions = d;
            this.v = new cn(this.j.querySelector(".ddl-match-dialog-container"));
            this.state = new en(this.g);
            this.H = this.j.querySelector(".ddl-match-cards");
            this.u = this.j.querySelector(".ddl-match-stars");
            this.N = new Ym;
            this.o = sl(this.H);
            this.T = tl(this.H);
            this.i = new Vk(Yk, this.j.querySelector(".ddl-match-tiles"), this.ta, this.g);
            this.ha = new Ul(this.i)
        }
    };
    var gq = class extends go {
        constructor(a) {
            const b = Vh(Zl, {
                width: 540,
                height: 960,
                ud: Yj
            });
            super(a, b);
            this.g = new Ke;
            this.N = new B(new E, new Ze);
            this.actions = new B(new Ne);
            this.i = new zp;
            this.j = !1;
            this.v = new fq(this.g, Z(this, ".ddl-match-dom-container"), Z(this, ".ddl-match-svg-container"), this.actions);
            this.ka.appendChild(this.i.wa)
        }
        o() {
            const a = this;
            return m(function*() {
                G.c = 4;
                I(1);
                xj(R(), x.mf, 750);
                co(a);
                var b = hp().button;
                b.disabled = !0;
                b.style.opacity = "0";
                b.style.visibility = "hidden";
                a.ka.appendChild(hp().button);
                K(a.i.wa, 24, 175, 70, 18);
                C(a.g, a.N);
                C(a.g, a.actions);
                var c = Z(a, ".ddl-match-canvas").getContext("2d");
                b = new Pe(a.g);
                const d = new zj(a.g),
                    e = new of(a.g);
                c = new nf(a.g, c);
                a.g.g = [new gk(a.g), new ek(a.g, Bk, pk), b, d, e, c];
                b = a.v;
                C(b.g, b.o);
                C(b.g, b.T);
                hm(b.u, b.g);
                km(b.u, b.g);
                a.j = !0;
                yield eo(a, a.actions, 0, 1, 750)
            })
        }
        H() {
            const a = this;
            return m(function*() {
                (yield Promise.race([cq(a.v).then(() => !1), yp(a.i).then(() => m(function*() {
                    I(102);
                    return !0
                }))])) || (G.c = 12, I(1))
            })
        }
        u() {
            const a = this;
            return m(function*() {
                yj(R(), 1875);
                yield eo(a, a.actions, 1, 0, 750);
                const b = hp().button;
                b.disabled = !1;
                hp().button.style.opacity = "1";
                hp().button.style.visibility = "visible";
                b.remove();
                a.ka.remove()
            })
        }
        update(a) {
            this.j && this.g.update(a)
        }
    };
    const Wc = fj.ld();

    function hq(a) {
        a.i.querySelector(".ddl-doodle-mute-container").appendChild(a.v.g);
        a.v.addListener(b => {
            let c;
            (c = a.j) != null && (c.g.muted = !!b)
        })
    }

    function mg(a) {
        m(function*() {
            var b = a.H;
            b.i.appendChild(b.g);
            lp(b);
            C(b.H, b.actions);
            b.H.g = [new Pe(b.H)];
            K(b.i.querySelector(".ddl-rules-subtitle-container"), 24, 465, 125, 20);
            K(b.i.querySelector(".ddl-rules-matches"), 24, 465, 385, 20);
            K(b.i.querySelector(".ddl-rules-bonus"), 24, 465, 175, 20);
            b = a.i.querySelector(".ddl-doodle-content");
            yield a.play(new xp(b, a.j));
            if (qj)
                for (;;) yield a.play(new vp(b));
            if (window.LOONA_INTRO_URL !== "") yield a.play(new Gp(b, a.j));
            else yield loonaSkipIntro();
            if (a.j) {
                const c = a.j.g;
                c.pause();
                c.removeAttribute("src");
                c.load();
                a.j = void 0
            }
            qh(kj,
                !1) || (yield a.play(new gq(b)), rh(kj, !0));
            yield a.play(new up(b))
        })
    }
    class iq {
        constructor(a, b, c) {
            this.o = b;
            this.j = new si;
            this.i = O(pp, {
                month: ""
            });
            this.v = new $h;
            this.N = R();
            a.i.oa.appendChild(this.o.j);
            a.i.oa.appendChild(Vh(np, {
                fontFamily: Vj,
                fontWeight: Wj
            }));
            ui(this.o.g);
            Oj(this.o.o);
            Qj(this.o.u);
            c && (this.u = new Rp(c), Qp(this.u), ug(a, {
                Zb: () => {
                    let d;
                    (d = this.u) == null || Qp(d)
                }
            }));
            this.Ga = a.i.Ga;
            this.background = Lj = new Jj(this.i);
            this.H = hp(this.i);
            jf = this.o.g.j;
            Vc(this.Ga);
            hq(this);
            if (rj && window.localStorage)
                for (const d of pj) window.localStorage.removeItem(d)
        }
        Oa(a) {
            this.background.update(a);
            let b;
            (b = this.g) == null || b.update(a);
            this.H.update(a);
            this.N.update(a)
        }
        ac() {
            this.g && this.g.resume && this.g.resume();
            Ad() ? vc(this.i.querySelector(".ddl-doodle-content"), "pointerdown", () => $c()) : $c();
            let a;
            (a = this.u) == null || a.resume()
        }
        play(a) {
            const b = this;
            return m(function*() {
                b.g = a;
                yield b.g.play();
                b.g = void 0
            })
        }
    };
    const Op = Vh(function(a, b) {
        a = M;
        b = (b = b != null ? b : {}) && b.jd;
        b = M("<style" + (b ? ' nonce="' + N(Uh(b)) + '"' : "") + '>\n.ddl-mute-button{border-radius:0;border:0;padding:0}.ddl-mute-button-mute-icon,.ddl-mute-button-unmute-icon{width:40px;height:40px}.ddl-background{width:100%;height:100%}.ddl-background-moon-canvas{opacity:0;visibility:hidden;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:990px;top:280px}.ddl-background-inner{position:absolute;left:-720px;top:-265px;-webkit-transform-origin:990px 280px;-ms-transform-origin:990px 280px;transform-origin:990px 280px;width:1980px;height:1280px;background:-webkit-gradient(linear,right top,left top,color-stop(10%,rgb(0,0,0)),color-stop(30%,rgb(44,27,37)),color-stop(50%,rgb(54,36,51)),color-stop(80%,rgb(75,55,79)),to(rgb(175,130,136)));background:-webkit-linear-gradient(right,rgb(0,0,0) 10%,rgb(44,27,37) 30%,rgb(54,36,51) 50%,rgb(75,55,79) 80%,rgb(175,130,136) 100%);background:linear-gradient(-90deg,rgb(0,0,0) 10%,rgb(44,27,37) 30%,rgb(54,36,51) 50%,rgb(75,55,79) 80%,rgb(175,130,136) 100%)}.ddl-card{padding:0;border:none;opacity:0;visibility:hidden;background:transparent}.ddl-card-inner{position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.ddl-card-front,.ddl-card-face{position:absolute;left:0;top:0;width:100%;height:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden}.ddl-card-default{z-index:0;opacity:1}.ddl-card-dark,.ddl-card-light{z-index:0;opacity:0}.ddl-card[data-owner=player] .ddl-card-default,.ddl-card[data-owner=moon] .ddl-card-default{z-index:0;opacity:0;-webkit-transition:opacity .25s step-end;transition:opacity .25s step-end}.ddl-card[data-owner=player] .ddl-card-light,.ddl-card[data-owner=moon] .ddl-card-dark{z-index:1;opacity:1}.ddl-card[data-owner=player] .ddl-card-dark,.ddl-card[data-owner=moon] .ddl-card-light{z-index:0;opacity:0;-webkit-transition:opacity .25s step-end;transition:opacity .25s step-end}.ddl-card-dark,.ddl-card-light{-webkit-transition:opacity .25s;transition:opacity .25s}.ddl-card-default{-webkit-transition:opacity .25s step-start;transition:opacity .25s step-start}.ddl-card-back{position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:rotateY(180deg);transform:rotateY(180deg);-webkit-backface-visibility:hidden;backface-visibility:hidden}.ddl-card-selected{z-index:1}.ddl-card-selectable{cursor:pointer}.ddl-card-disabled{-webkit-filter:contrast(.5);filter:contrast(.5)}.ddl-card-border{width:100%;height:100%;position:absolute;left:0;top:0;z-index:2;-webkit-transform:scale(1.45);-ms-transform:scale(1.45);transform:scale(1.45);-webkit-filter:drop-shadow(0 0 10px #fff) blur(10px);filter:drop-shadow(0 0 10px #fff) blur(10px);opacity:0;pointer-events:none}.ddl-card-modal-container{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;visibility:hidden;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;pointer-events:none}.ddl-card-modal{width:450px;min-height:540px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background:#782f45;-webkit-border-image:url(./border-card.png);-o-border-image:url(./border-card.png);border-image:url(./border-card.png);border-image-width:35px;border-image-outset:27px;border-image-slice:80;pointer-events:auto}.ddl-card-modal-hidden{-webkit-transform:translateY(1000px) scale(1);-ms-transform:translateY(1000px) scale(1);transform:translateY(1000px) scale(1)}.ddl-card-modal-inner-container{width:400px;height:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.ddl-card-modal-card-container{width:200px;height:200px;margin-top:-100px}.ddl-card-modal-card-title{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:45px;color:#f981c4;text-align:center;margin-top:15px;min-height:45px}.ddl-card-modal-card-subtitle{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:35px;color:#facc93;text-align:center;margin-top:15px;min-height:35px}.ddl-card-modal-card-description-container{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;min-height:150px;margin-top:15px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:26px;color:#fff;text-align:center;margin-top:0}.ddl-card-modal-buttons-title{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:26px;color:#f981c4;text-align:center;margin-top:15px;min-height:26px}.ddl-card-modal-card-info-container{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;min-height:150px;margin-top:15px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:26px;color:#f981c4;text-align:center;margin-top:0;font-style:italic}.ddl-card-modal-buttons-container{width:100%;margin:20px 0;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:stretch;-webkit-align-items:stretch;align-items:stretch;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;gap:20px}.ddl-card-modal-button{padding:0;border:none;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:26px;color:#fff;text-align:center;margin-top:0;background-color:#782f45;padding:16px 32px;-webkit-border-image:url(./button_border.png);-o-border-image:url(./button_border.png);border-image:url(./button_border.png);border-image-slice:4 5;border-image-width:4px 5px;border-image-outset:3px 0;min-height:58px;min-width:170px;text-transform:uppercase}.ddl-card-modal-button:hover{background-color:#e49b71}.ddl-card-glow:hover{-webkit-filter:drop-shadow(0 0 3px #fdbc8c);filter:drop-shadow(0 0 3px #fdbc8c)}.ddl-container{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:auto;overflow:hidden}.ddl-intro-text{position:absolute;left:0;top:0;width:460px;margin:0 40px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:31px;color:#fdbc8c;text-align:center;opacity:0;visibility:hidden}.ddl-loading-screen{position:absolute;left:0;top:0;width:100%;height:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-loading-spinner{width:150px;height:150px}.ddl-loading-text{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:24px;color:#fdbc8c}.ddl-match-canvas{position:absolute;left:0;top:0;width:100%;height:100%}.ddl-match-dom-container,.ddl-match-svg-container{position:absolute;left:0;top:0;width:100%;height:100%;opacity:1}.ddl-player-score,.ddl-moon-score{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;position:absolute;gap:8px;line-height:1;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-score-alternate-font{-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-player-score{position:absolute;left:28px;bottom:265px}.ddl-moon-score{position:absolute;right:28px;top:287px}.ddl-score-text{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:32px;color:#fdbc8c;width:38px;text-align:center}.ddl-score-star{width:28px;height:28px}.ddl-score-turn{height:20px;opacity:0;visibility:hidden}.ddl-score-turn-left{fill:#fff}.ddl-score-turn-right{fill:#de557f}.ddl-match-dialog{position:absolute;left:0;margin:0 54px;width:432px;min-height:125px;border-radius:16px;background:#271a26;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-border-image:url(./border.png);-o-border-image:url(./border.png);border-image:url(./border.png);border-image-width:21px;border-image-outset:9px;border-image-slice:30}.ddl-match-dialog-text{width:100%;padding:5px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:30px;color:#fdbc8c;text-align:center}.ddl-match-dialog-highlight{font-weight:bold;text-transform:uppercase;color:#fff}.ddl-add-score-light .ddl-score-text{-webkit-animation:.25s 2 alternate addScoreText;animation:.25s 2 alternate addScoreText}.ddl-add-score-light .ddl-score-star{-webkit-animation:.25s 2 alternate addScoreStar;animation:.25s 2 alternate addScoreStar}@-webkit-keyframes addScoreText{0%{-webkit-transform:scale(1);transform:scale(1);text-shadow:0 0 0 #fff}100%{-webkit-transform:scale(1.3);transform:scale(1.3);text-shadow:0 0 10px #fff}}@keyframes addScoreText{0%{-webkit-transform:scale(1);transform:scale(1);text-shadow:0 0 0 #fff}100%{-webkit-transform:scale(1.3);transform:scale(1.3);text-shadow:0 0 10px #fff}}@-webkit-keyframes addScoreStar{0%{-webkit-filter:drop-shadow(0 0 0 #fff);filter:drop-shadow(0 0 0 #fff)}100%{-webkit-filter:drop-shadow(0 0 10px #fff);filter:drop-shadow(0 0 10px #fff)}}@keyframes addScoreStar{0%{-webkit-filter:drop-shadow(0 0 0 #fff);filter:drop-shadow(0 0 0 #fff)}100%{-webkit-filter:drop-shadow(0 0 10px #fff);filter:drop-shadow(0 0 10px #fff)}}.ddl-match-debug-buttons{position:absolute;left:25px;top:70px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;gap:5px}.ddl-match-win-button,.ddl-match-lose-button,.ddl-match-tie-button{padding:10px;background:white;cursor:pointer;color:black}.ddl-outro-canvas{position:absolute;left:0;top:0;opacity:0;visibility:hidden}.ddl-outro-svg-container,.ddl-progress-canvas,.ddl-progress-svg-container{position:absolute;left:0;top:0;width:100%;height:100%}.ddl-progress-results-title,.ddl-progress-next-level-title,.ddl-progress-top-message,.ddl-progress-bottom-message{display:inline-block;text-align:center;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:32px;color:#e49b71;opacity:0;visibility:hidden}.ddl-progress-results-title{font-size:28px}.ddl-progress-top-message{position:absolute;left:50%;top:194px;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);color:#e49b71;width:80%}.ddl-progress-bottom-message{position:absolute;left:50%;top:650px;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);width:90%}.ddl-progress-next-level-title,.ddl-progress-results{position:absolute;left:0;top:650px;width:100%;text-align:center}.ddl-progress-results{line-height:1.1}.ddl-progress-results-stats{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:24px;color:#e49b71;margin:auto;opacity:0;visibility:hidden;white-space:nowrap}.ddl-progress-results-stats th{width:50%;text-align:end;-webkit-padding-end:.25em;padding-inline-end:.25em;font-weight:var(--ddl-font-weight)}.ddl-progress-results-stats td{width:50%;text-align:start;-webkit-padding-start:.25em;padding-inline-start:.25em}.ddl-progress-buttons{opacity:0;visibility:hidden;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;bottom:20px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;row-gap:16px}.ddl-progress-button-row{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;width:100%}.ddl-progress-buttons,.ddl-progress-button-row,.ddl-progress-search-button,.ddl-progress-continue-button,.ddl-progress-share-button{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-progress-search-button,.ddl-progress-continue-button,.ddl-progress-share-button{padding:0;border:none;margin:0 8px;-webkit-border-image:url(./button_border.png);-o-border-image:url(./button_border.png);border-image:url(./button_border.png);border-image-slice:4 5;border-image-width:4px 5px;border-image-outset:3px 0;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.ddl-progress-continue-button{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:30px;font-weight:bold;color:#fff}.ddl-progress-continue-button,.ddl-progress-share-button{height:60px}.ddl-progress-continue-button,.ddl-progress-search-button{padding:0 32px;-webkit-box-flex:1;-webkit-flex-grow:1;flex-grow:1;white-space:nowrap}.ddl-progress-search-button,.ddl-progress-share-button{fill:#e49b71}.ddl-progress-search-button{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:20px;height:44px;color:#e49b71}.ddl-progress-search-icon{width:1em;height:1em;-webkit-padding-end:.25em;padding-inline-end:.25em;float:inline-start}.ddl-progress-share-button{width:66px}line.ddl-progress-line-empty,line.ddl-progress-line-full{stroke-linecap:round}line.ddl-progress-line-empty{stroke:#9885a6;stroke-width:1px;-webkit-filter:drop-shadow(0 0 5px #675181);filter:drop-shadow(0 0 5px #675181)}line.ddl-progress-line-full{stroke:#fff;stroke-width:2px;-webkit-filter:drop-shadow(0 0 10px #b186f1);filter:drop-shadow(0 0 10px #b186f1)}circle.ddl-progress-star-circle{fill:none;stroke:#9885a6}.ddl-progress-wildcard-slot{opacity:0;visibility:hidden}.ddl-progress-wildcard-slot>path{stroke:#394a82;stroke-width:1px;fill:#000}.ddl-progress-results-total-stars{opacity:0;visibility:hidden}.ddl-progress-results-level-stars,.ddl-progress-results-total-stars{color:#fff;font-weight:bold}.ddl-rules-button{padding:0;border:none;position:absolute;left:30px;bottom:40px;width:40px;height:40px;border:solid 2px #fdbc8c;border-radius:12px;font-family:sans-serif;font-weight:400;font-size:30px;color:#fdbc8c;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;background:transparent}.ddl-rules-container{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;visibility:hidden;background:rgba(0,0,0,.7);display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;pointer-events:auto;z-index:1}.ddl-rules{width:485px;min-height:800px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background:-webkit-gradient(linear,left top,left bottom,from(#804b4a),to(#4e2731));background:-webkit-linear-gradient(#804b4a,#4e2731);background:linear-gradient(#804b4a,#4e2731);-webkit-border-image:url(./border.png);-o-border-image:url(./border.png);border-image:url(./border.png);border-image-width:24px;border-image-outset:10px;border-image-slice:30;visibility:hidden;-webkit-transform:translateY(1000px) scale(1);-ms-transform:translateY(1000px) scale(1);transform:translateY(1000px) scale(1)}.ddl-rules-title{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:38px;margin-top:30px;text-align:center;color:#fff;text-transform:uppercase}.ddl-rules-subtitle-container{width:465px;min-height:100px;margin:15px 0;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:20px;color:#fff;text-align:center;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-rules-subtitle{width:100%;margin-top:25px}.ddl-rules-subtitle-container .ddl-rules-subtitle:first-child{margin:0}.ddl-rules-matches{background:#130b12;border-radius:12px;margin-top:3px;width:465px;min-height:345px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:20px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.ddl-matches-title{margin-top:15px}.ddl-matches-title,.ddl-bonus-title{font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:26px;text-align:center;color:#fff;text-transform:uppercase}.ddl-rules-match-row{width:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;margin-top:15px}.ddl-rules-match{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.ddl-rules-match-pair{width:50%}.ddl-match-cycle{margin:20px 0 10px}.ddl-rules-match-title{color:white;text-align:center;margin-top:8px}.ddl-rules-match-points{color:#d08f8e;text-align:center}.ddl-rules-bonus{width:465px;min-height:140px;margin:22px 0 10px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:16px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;gap:7px}.ddl-bonus-row{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;gap:20px}.ddl-bonus-subtitle{color:white;text-align:center;width:100%}.ddl-rules-close{position:absolute;top:10px;right:10px;width:40px;height:40px;padding:0;border:none;background:transparent;padding:5px;-webkit-transition:-webkit-filter .2s,-webkit-transform .1s;transition:-webkit-filter .2s,-webkit-transform .1s;transition:filter .2s,transform .1s;transition:filter .2s,transform .1s,-webkit-filter .2s,-webkit-transform .1s}.ddl-rules-close:hover{-webkit-filter:brightness(.75);filter:brightness(.75)}.ddl-skip-button{padding:0;border:none;position:absolute;right:20px;bottom:50px;min-width:100px;min-height:50px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:24px;color:#fdbc8c;padding:16px 32px;margin:0 8px;-webkit-border-image:url(./button_border.png);-o-border-image:url(./button_border.png);border-image:url(./button_border.png);border-image-slice:4 5;border-image-width:4px 5px;border-image-outset:3px 0}.ddl-star-white{fill:#fff;stroke:#fdbc8c;stroke-width:1px}.ddl-star-black{fill:#000;stroke:#d5527a;stroke-width:1px}.ddl-tile{padding:0;border:none;-webkit-transform-origin:center;-ms-transform-origin:center;transform-origin:center;opacity:0}.ddl-tile-border{width:100%;height:100%;opacity:0;-webkit-transform:scale(.85);-ms-transform:scale(.85);transform:scale(.85)}.ddl-tile-selectable .ddl-tile-border{-webkit-animation:.6s infinite alternate pulseAnimation;animation:.6s infinite alternate pulseAnimation;-webkit-animation-timing-function:linear;animation-timing-function:linear}.ddl-tile-selectable{cursor:pointer}@-webkit-keyframes pulseAnimation{0%{opacity:0}100%{opacity:1}}@keyframes pulseAnimation{0%{opacity:0}100%{opacity:1}}.ddl-connection-empty{stroke:#6d5277;stroke-width:2px;stroke-linecap:round;fill:none;opacity:1}.ddl-connection-phase-pair{stroke:#fff;stroke-width:1.5px;fill:transparent;opacity:1}.ddl-connection-fullmoon-pair{fill:#fff;opacity:1}.ddl-connection-lunar-cycle{stroke:#fff;stroke-width:6px;stroke-linecap:round;fill:none;opacity:1}.ddl-doodle-container{--ddl-font-family:"Josefin Sans";--ddl-font-weight:200}#hplogo{-webkit-transition:opacity .2s;transition:opacity .2s;touch-action:none;-webkit-touch-callout:none}#ddlDomRoot{overflow:hidden}.ddl-doodle-container{width:540px;height:960px;overflow:hidden}.ddl-content{position:absolute;left:0;top:0;width:100%;height:100%}.ddl-doodle-content{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:auto}.ddl-game-container{width:100%;height:100%}.ddl-frame{position:absolute;left:0;top:0;width:100%;height:100%;-webkit-border-image:url(./GoogleFrame.png);-o-border-image:url(./GoogleFrame.png);border-image:url(./GoogleFrame.png);border-image-width:38px;border-image-outset:0;border-image-slice:85;border-image-repeat:repeat stretch;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:reverse;-webkit-flex-direction:column-reverse;flex-direction:column-reverse;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-frame-month{min-width:100px;min-height:30px;font-family:var(--ddl-font-family),sans-serif;font-weight:var(--ddl-font-weight);font-size:30px;color:#fdbc8c;text-align:center;margin-bottom:32px;text-transform:uppercase}.ddl-doodle-fade{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;visibility:hidden;background:white}.closeFullscreenBtn{z-index:3000}.expanderHide{opacity:0}#sadoodle .showCta .moonCta,#fpdoodle .showCta .moonCta{opacity:1}#ctaRoot{background:none}.ddl-play-button{position:absolute;top:100px;left:200px;height:100px;width:100px;pointer-events:none;background:none;opacity:0}@-webkit-keyframes playFade{0%{opacity:0}100%{opacity:1}}@keyframes playFade{0%{opacity:0}100%{opacity:1}}.ddl-play-button.showPlayButton{-webkit-animation:playFade .1s linear 1 forwards;animation:playFade .1s linear 1 forwards}.ctaHideDuringLightbox .ddl-play-button{opacity:0}.ctaAnimated #moon-animated{display:block}.ctaAnimated #moon-static{display:none}#ddlContentRoot button{pointer-events:auto}.ddl-button{cursor:pointer;line-height:1;-webkit-transition:background-color .2s linear,-webkit-transform .1s linear;transition:background-color .2s linear,-webkit-transform .1s linear;transition:background-color .2s linear,transform .1s linear;transition:background-color .2s linear,transform .1s linear,-webkit-transform .1s linear}.ddl-button-default{background-color:#271a26}.ddl-button-default:hover{background-color:#7e3251}.ddl-button:active{-webkit-transform:scale(.9);-ms-transform:scale(.9);transform:scale(.9)}.ddl-mute-button{position:absolute;left:18px;top:18px;width:52px;height:52px;background:none;fill:#e49b71;stroke:#e49b71;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;cursor:pointer}.hplogocta{width:100%;height:100%;-webkit-background-size:contain;background-size:contain;background-position:center;border:none;overflow:hidden;position:absolute;left:0;top:0;z-index:10;cursor:pointer;padding:0;-webkit-transition:opacity .5s;transition:opacity .5s;opacity:0;pointer-events:auto}.hplogocta.showCta{opacity:1}.hplogocta.ctaHideDuringLightbox{display:none}.closeFullscreenBtn{pointer-events:all;cursor:pointer;position:absolute;top:5px;right:5px;z-index:3000}.domRootLightboxed{left:0;top:0}.contentHide{display:none}#ddlDomRoot{pointer-events:none}#ddl-background{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:absolute;top:0;left:0;width:100%;height:100%}.lightboxMode,#hplogo.lightboxMode{position:fixed;top:0;left:0;height:100%;width:100%;z-index:1000;overflow:hidden}.ddlLightboxNoScroll{overflow-y:hidden}.lightboxContentContainer{position:relative;height:100%;width:100%}.lightboxEnabled .lightboxContentContainer{height:90%;width:90%}.lightboxContent{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}.lightboxContainer{position:absolute;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;width:100%;height:100%;left:0;top:0}.lightboxBackground{opacity:0;background-color:rgba(0,0,0,.8)}.lightboxEnabled{opacity:1;-webkit-transition:opacity .5s;transition:opacity .5s}.ddl-share-modal{position:absolute;left:0;top:0;width:100%;height:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.ddl-modal-overlay{position:absolute;height:100%;width:100%;left:0;top:0;background:#000;border-radius:0;opacity:.32;-webkit-transition:opacity .15s;transition:opacity .15s;-webkit-animation:ddl-overlay-fade-in .15s 1;animation:ddl-overlay-fade-in .15s 1}.ddl-closing .ddl-modal-overlay{opacity:0}@-webkit-keyframes ddl-overlay-fade-in{0%{opacity:0}to{opacity:.32}}@keyframes ddl-overlay-fade-in{0%{opacity:0}to{opacity:.32}}.ddl-modal-dialog{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:start;-webkit-align-items:flex-start;align-items:flex-start;margin:0 0 24px;isolation:isolate;position:absolute;width:364px;height:328px;left:88px;top:308px;background:#fff;border-radius:16px;opacity:1;-webkit-transition:opacity .15s;transition:opacity .15s;-webkit-animation:ddl-dialog-fade-in 83ms 1,ddl-dialog-grow-in .15s 1;animation:ddl-dialog-fade-in 83ms 1,ddl-dialog-grow-in .15s 1;overflow:hidden}@-webkit-keyframes ddl-dialog-fade-in{0%{opacity:0}to{opacity:1}}@keyframes ddl-dialog-fade-in{0%{opacity:0}to{opacity:1}}@-webkit-keyframes ddl-dialog-grow-in{0%{scale:.8}to{scale:1}}@keyframes ddl-dialog-grow-in{0%{scale:.8}to{scale:1}}.ddl-closing .ddl-modal-dialog{opacity:0}.ddl-modal-header{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:start;-webkit-align-items:flex-start;align-items:flex-start;padding-top:12px;padding-bottom:0;-webkit-padding-start:24px;padding-inline-start:24px;-webkit-padding-end:12px;padding-inline-end:12px;height:61px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:1;-webkit-order:0;order:0;-webkit-align-self:stretch;align-self:stretch;-webkit-flex-grow:0;flex-grow:0;z-index:0}.ddl-modal-header-text{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:end;-webkit-align-items:flex-end;align-items:flex-end;padding:12px 0 0;gap:10px;width:280px;height:36px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:1;-webkit-order:0;order:0;-webkit-box-flex:1;-webkit-flex-grow:1;flex-grow:1;font-family:Google Sans;font-style:normal;font-weight:400;font-size:28px;line-height:36px;color:#000}.ddl-modal-close{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background:transparent;width:48px;height:48px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:2;-webkit-order:1;order:1;-webkit-flex-grow:0;flex-grow:0;cursor:pointer;pointer-events:auto;border:none;padding:0}.ddl-modal-close-icon{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;border-radius:50%;width:40px;height:40px;background:rgba(68,71,70,0);-webkit-transition:background .2s;transition:background .2s}.ddl-modal-close-icon:hover{background:rgba(68,71,70,.08)}.ddl-modal-close-icon:active{background:rgba(68,71,70,.12)}.ddl-closing .ddl-modal-close-icon{pointer-events:none}.ddl-modal-content{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:8px 24px;gap:24px;height:224px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:4;-webkit-order:3;order:3;-webkit-flex-grow:0;flex-grow:0;z-index:1}.ddl-modal-buttons{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:0;gap:24px;width:316px;height:108px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:1;-webkit-order:0;order:0;-webkit-align-self:stretch;align-self:stretch;-webkit-flex-grow:0;flex-grow:0}.ddl-modal-button-container{height:107px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:1;-webkit-order:0;order:0;-webkit-flex-grow:0;flex-grow:0}.ddl-modal-button-label{height:19px;padding:8px 0 0;font-family:Google Sans;font-style:normal;font-weight:400;font-size:14px;line-height:20px;text-align:center;color:#444746}.ddl-share-modal .ddl-share-facebook{cursor:pointer;pointer-events:auto;border:none;padding:0;width:80px;height:80px;border-radius:50%;-webkit-transition:background .2s;transition:background .2s;background:#3b5998}.ddl-share-modal .ddl-share-facebook:hover{background:#324b80}.ddl-share-modal .ddl-share-facebook:active{background:#2d4474}.ddl-share-modal .ddl-share-twitter{cursor:pointer;pointer-events:auto;border:none;padding:0;width:80px;height:80px;border-radius:50%;-webkit-transition:background .2s;transition:background .2s;background:#000}.ddl-share-modal .ddl-share-twitter:hover{background:#3f3f3f}.ddl-share-modal .ddl-share-twitter:active{background:#656565}.ddl-share-facebook-icon{padding:22.5px 30.5px}.ddl-share-email-icon,.ddl-share-twitter-icon{padding:26px 23px}.ddl-modal-copy-link-container{width:316px;height:84px;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:2;-webkit-order:1;order:1;-webkit-align-self:stretch;align-self:stretch;-webkit-flex-grow:0;flex-grow:0;pointer-events:auto;cursor:pointer}.ddl-modal-copy-link{cursor:pointer;pointer-events:auto;border:none;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start;gap:0;padding:0;width:316px;height:56px;background:#dde3ea;border-radius:4px;-webkit-transition:background .4s;transition:background .4s}.ddl-link-copied .ddl-modal-copy-link{pointer-events:none;background-color:#a8c7fa}.ddl-modal-copy-link-icon{padding:4px 0;width:48px;height:48px}.ddl-modal-copy-link-icon path{-webkit-transition:fill .4s;transition:fill .4s;fill:#444746}.ddl-link-copied .ddl-modal-copy-link-icon path{fill:#041e49}.ddl-modal-share-link{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text;cursor:text;height:24px;padding:16px 0;-webkit-box-flex:0;-webkit-flex:none;flex:none;-webkit-box-ordinal-group:2;-webkit-order:1;order:1;-webkit-flex-grow:0;flex-grow:0;max-width:268px;font-family:Google Sans Text;font-style:normal;font-weight:400;font-size:16px;line-height:24px;color:#1f1f1f;overflow:hidden;text-overflow:ellipsis;-webkit-transition:color .4s;transition:color .4s}.ddl-link-copied .ddl-modal-share-link{color:#041e49}.ddl-modal-help-text{font-family:Google Sans Text;font-style:normal;font-weight:400;font-size:14px;line-height:20px;text-align:center;color:#444746;padding:8px}.ddl-modal-snack-bar{position:absolute;bottom:-50px;visibility:hidden}.ddl-with-snack-bar .ddl-modal-snack-bar{width:116px;height:47px;bottom:-50px;left:124px;margin:0 auto;background:#303030;border-radius:4px 4px 0 0;font-family:Google Sans Text;font-style:normal;font-weight:400;font-size:16px;line-height:47px;text-align:center;color:#f2f2f2;z-index:2;-webkit-animation:ddl-snack-bar-in .4s 1 forwards,ddl-snack-bar-out .4s 2.4s 1 forwards;animation:ddl-snack-bar-in .4s 1 forwards,ddl-snack-bar-out .4s 2.4s 1 forwards;visibility:visible}@-webkit-keyframes ddl-snack-bar-in{0%{bottom:-50px}to{bottom:0}}@keyframes ddl-snack-bar-in{0%{bottom:-50px}to{bottom:0}}@-webkit-keyframes ddl-snack-bar-out{0%{bottom:0}to{bottom:-50px}}@keyframes ddl-snack-bar-out{0%{bottom:0}to{bottom:-50px}}sentinel{}\n</style>');
        return a(b)
    });
    (function(a) {
        m(function*() {
            var b = mh;
            ag = Date.now();
            G.d = b;
            !bg && Qd() && (bg = !0, I(10));
            b = a.g;
            H("d17", lj);
            // Шрифты грузятся с серверов Google: если они недоступны, не ждём дольше 3 c и стартуем со шрифтом-заменой.
            b = [nh(), uh().load(pe, qe, a.i, "./"), ni(b.j, [b.g.Oc, b.g.wd, b.g.Qc]), (new Cg(xe("GoogleFrame.png"))).i(), Promise.race([Bg([`${Vj}:${Wj}`, ...hi]).catch(() => {}), Vd(3E3)])];
            try {
                yield Promise.all(b);
                const e = O(op);
                b = {
                    width: 540,
                    height: 960,
                    Yc: mh,
                    orientation: "portrait-primary",
                    Qa: {
                        // Стартовый экран в тех же координатах, что и игра: портрет 540x960.
                        width: 540,
                        height: 960,
                        fg: e,
                        Bf: "ctaAnimated",
                        Va: 1
                    },
                    Jf: 18E4
                };
                var c = iq,
                    d = [a, Qd() ? void 0 : e];
                const f = new wg(b, c, d);
                jg(f);
                return f.doodle
            } catch (e) {
                console.error("Failed to initialize Doodle. Error: ", e)
            }
        })
    })(new Pp);
}).call(this);