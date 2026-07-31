var uD = Object.defineProperty,
    dD = Object.defineProperties;
var fD = Object.getOwnPropertyDescriptors;
var _i = Object.getOwnPropertySymbols;
var hh = Object.prototype.hasOwnProperty,
    ph = Object.prototype.propertyIsEnumerable;
var fh = (e, t, n) => t in e ? uD(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n
    }) : e[t] = n,
    E = (e, t) => {
        for (var n in t || = {}) hh.call(t, n) && fh(e, n, t[n]);
        if (_i)
            for (var n of _i(t)) ph.call(t, n) && fh(e, n, t[n]);
        return e
    },
    V = (e, t) => dD(e, fD(t));
var gh = (e, t) => {
    var n = {};
    for (var r in e) hh.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && _i)
        for (var r of _i(e)) t.indexOf(r) < 0 && ph.call(e, r) && (n[r] = e[r]);
    return n
};
var Vc;

function wi() {
    return Vc
}

function dt(e) {
    let t = Vc;
    return Vc = e, t
}
var mh = Symbol("NotFound");

function Kn(e) {
    return e === mh || e ? .name === "\u0275NotFound"
}

function Ti(e, t) {
    return Object.is(e, t)
}
var Ee = null,
    Ii = !1,
    jc = 1,
    hD = null,
    _e = Symbol("SIGNAL");

function O(e) {
    let t = Ee;
    return Ee = e, t
}

function Ai() {
    return Ee
}
var hn = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producers: void 0,
    producersTail: void 0,
    consumers: void 0,
    consumersTail: void 0,
    recomputing: !1,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    kind: "unknown",
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {}
};

function Jn(e) {
    if (Ii) throw new Error("");
    if (Ee === null) return;
    Ee.consumerOnSignalRead(e);
    let t = Ee.producersTail;
    if (t !== void 0 && t.producer === e) return;
    let n, r = Ee.recomputing;
    if (r && (n = t !== void 0 ? t.nextProducer : Ee.producers, n !== void 0 && n.producer === e)) {
        Ee.producersTail = n, n.lastReadVersion = e.version;
        return
    }
    let o = e.consumersTail;
    if (o !== void 0 && o.consumer === Ee && (!r || gD(o, Ee))) return;
    let i = er(Ee),
        s = {
            producer: e,
            consumer: Ee,
            nextProducer: n,
            prevConsumer: o,
            lastReadVersion: e.version,
            nextConsumer: void 0
        };
    Ee.producersTail = s, t !== void 0 ? t.nextProducer = s : Ee.producers = s, i && yh(e, s)
}

function vh() {
    jc++
}

function Ni(e) {
    if (!(er(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === jc)) {
        if (!e.producerMustRecompute(e) && !to(e)) {
            Mi(e);
            return
        }
        e.producerRecomputeValue(e), Mi(e)
    }
}

function Bc(e) {
    if (e.consumers === void 0) return;
    let t = Ii;
    Ii = !0;
    try {
        for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
            let r = n.consumer;
            r.dirty || pD(r)
        }
    } finally {
        Ii = t
    }
}

function Uc() {
    return Ee ? .consumerAllowSignalWrites !== !1
}

function pD(e) {
    e.dirty = !0, Bc(e), e.consumerMarkedDirty ? .(e)
}

function Mi(e) {
    e.dirty = !1, e.lastCleanEpoch = jc
}

function pn(e) {
    return e && (e.producersTail = void 0, e.recomputing = !0), O(e)
}

function Xn(e, t) {
    if (O(t), !e) return;
    e.recomputing = !1;
    let n = e.producersTail,
        r = n !== void 0 ? n.nextProducer : e.producers;
    if (r !== void 0) {
        if (er(e))
            do r = Hc(r); while (r !== void 0);
        n !== void 0 ? n.nextProducer = void 0 : e.producers = void 0
    }
}

function to(e) {
    for (let t = e.producers; t !== void 0; t = t.nextProducer) {
        let n = t.producer,
            r = t.lastReadVersion;
        if (r !== n.version || (Ni(n), r !== n.version)) return !0
    }
    return !1
}

function no(e) {
    if (er(e)) {
        let t = e.producers;
        for (; t !== void 0;) t = Hc(t)
    }
    e.producers = void 0, e.producersTail = void 0, e.consumers = void 0, e.consumersTail = void 0
}

function yh(e, t) {
    let n = e.consumersTail,
        r = er(e);
    if (n !== void 0 ? (t.nextConsumer = n.nextConsumer, n.nextConsumer = t) : (t.nextConsumer = void 0, e.consumers = t), t.prevConsumer = n, e.consumersTail = t, !r)
        for (let o = e.producers; o !== void 0; o = o.nextProducer) yh(o.producer, o)
}

function Hc(e) {
    let t = e.producer,
        n = e.nextProducer,
        r = e.nextConsumer,
        o = e.prevConsumer;
    if (e.nextConsumer = void 0, e.prevConsumer = void 0, r !== void 0 ? r.prevConsumer = o : t.consumersTail = o, o !== void 0) o.nextConsumer = r;
    else if (t.consumers = r, !er(t)) {
        let i = t.producers;
        for (; i !== void 0;) i = Hc(i)
    }
    return n
}

function er(e) {
    return e.consumerIsAlwaysLive || e.consumers !== void 0
}

function Ri(e) {
    hD ? .(e)
}

function gD(e, t) {
    let n = t.producersTail;
    if (n !== void 0) {
        let r = t.producers;
        do {
            if (r === e) return !0;
            if (r === n) break;
            r = r.nextProducer
        } while (r !== void 0)
    }
    return !1
}

function xi(e, t) {
    let n = Object.create(mD);
    n.computation = e, t !== void 0 && (n.equal = t);
    let r = () => {
        if (Ni(n), Jn(n), n.value === eo) throw n.error;
        return n.value
    };
    return r[_e] = n, Ri(n), r
}
var bi = Symbol("UNSET"),
    Si = Symbol("COMPUTING"),
    eo = Symbol("ERRORED"),
    mD = V(E({}, hn), {
        value: bi,
        dirty: !0,
        error: null,
        equal: Ti,
        kind: "computed",
        producerMustRecompute(e) {
            return e.value === bi || e.value === Si
        },
        producerRecomputeValue(e) {
            if (e.value === Si) throw new Error("");
            let t = e.value;
            e.value = Si;
            let n = pn(e),
                r, o = !1;
            try {
                r = e.computation(), O(null), o = t !== bi && t !== eo && r !== eo && e.equal(t, r)
            } catch (i) {
                r = eo, e.error = i
            } finally {
                Xn(e, n)
            }
            if (o) {
                e.value = t;
                return
            }
            e.value = r, e.version++
        }
    });

function vD() {
    throw new Error
}
var Eh = vD;

function Dh(e) {
    Eh(e)
}

function $c(e) {
    Eh = e
}
var yD = null;

function zc(e, t) {
    let n = Object.create(Oi);
    n.value = e, t !== void 0 && (n.equal = t);
    let r = () => Ch(n);
    return r[_e] = n, Ri(n), [r, s => tr(n, s), s => Gc(n, s)]
}

function Ch(e) {
    return Jn(e), e.value
}

function tr(e, t) {
    Uc() || Dh(e), e.equal(e.value, t) || (e.value = t, ED(e))
}

function Gc(e, t) {
    Uc() || Dh(e), tr(e, t(e.value))
}
var Oi = V(E({}, hn), {
    equal: Ti,
    value: void 0,
    kind: "signal"
});

function ED(e) {
    e.version++, vh(), Bc(e), yD ? .(e)
}

function x(e) {
    return typeof e == "function"
}

function nr(e) {
    let n = e(r => {
        Error.call(r), r.stack = new Error().stack
    });
    return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n
}
var Pi = nr(e => function(n) {
    e(this), this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((r,o)=>`${o+1}) ${r.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = n
});

function ro(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1)
    }
}
var te = class e {
    constructor(t) {
        this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let {
                _parentage: n
            } = this;
            if (n)
                if (this._parentage = null, Array.isArray(n))
                    for (let i of n) i.remove(this);
                else n.remove(this);
            let {
                initialTeardown: r
            } = this;
            if (x(r)) try {
                r()
            } catch (i) {
                t = i instanceof Pi ? i.errors : [i]
            }
            let {
                _finalizers: o
            } = this;
            if (o) {
                this._finalizers = null;
                for (let i of o) try {
                    _h(i)
                } catch (s) {
                    t = t ? ? [], s instanceof Pi ? t = [...t, ...s.errors] : t.push(s)
                }
            }
            if (t) throw new Pi(t)
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed) _h(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this)) return;
                    t._addParent(this)
                }(this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
            }
    }
    _hasParent(t) {
        let {
            _parentage: n
        } = this;
        return n === t || Array.isArray(n) && n.includes(t)
    }
    _addParent(t) {
        let {
            _parentage: n
        } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t
    }
    _removeParent(t) {
        let {
            _parentage: n
        } = this;
        n === t ? this._parentage = null : Array.isArray(n) && ro(n, t)
    }
    remove(t) {
        let {
            _finalizers: n
        } = this;
        n && ro(n, t), t instanceof e && t._removeParent(this)
    }
};
te.EMPTY = (() => {
    let e = new te;
    return e.closed = !0, e
})();
var Wc = te.EMPTY;

function ki(e) {
    return e instanceof te || e && "closed" in e && x(e.remove) && x(e.add) && x(e.unsubscribe)
}

function _h(e) {
    x(e) ? e() : e.unsubscribe()
}
var tt = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var rr = {
    setTimeout(e, t, ...n) {
        let {
            delegate: r
        } = rr;
        return r ? .setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
    },
    clearTimeout(e) {
        let {
            delegate: t
        } = rr;
        return (t ? .clearTimeout || clearTimeout)(e)
    },
    delegate: void 0
};

function Fi(e) {
    rr.setTimeout(() => {
        let {
            onUnhandledError: t
        } = tt;
        if (t) t(e);
        else throw e
    })
}

function oo() {}
var wh = qc("C", void 0, void 0);

function Ih(e) {
    return qc("E", void 0, e)
}

function bh(e) {
    return qc("N", e, void 0)
}

function qc(e, t, n) {
    return {
        kind: e,
        value: t,
        error: n
    }
}
var gn = null;

function or(e) {
    if (tt.useDeprecatedSynchronousErrorHandling) {
        let t = !gn;
        if (t && (gn = {
                errorThrown: !1,
                error: null
            }), e(), t) {
            let {
                errorThrown: n,
                error: r
            } = gn;
            if (gn = null, n) throw r
        }
    } else e()
}

function Sh(e) {
    tt.useDeprecatedSynchronousErrorHandling && gn && (gn.errorThrown = !0, gn.error = e)
}
var mn = class extends te {
        constructor(t) {
            super(), this.isStopped = !1, t ? (this.destination = t, ki(t) && t.add(this)) : this.destination = _D
        }
        static create(t, n, r) {
            return new ir(t, n, r)
        }
        next(t) {
            this.isStopped ? Yc(bh(t), this) : this._next(t)
        }
        error(t) {
            this.isStopped ? Yc(Ih(t), this) : (this.isStopped = !0, this._error(t))
        }
        complete() {
            this.isStopped ? Yc(wh, this) : (this.isStopped = !0, this._complete())
        }
        unsubscribe() {
            this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
        }
        _next(t) {
            this.destination.next(t)
        }
        _error(t) {
            try {
                this.destination.error(t)
            } finally {
                this.unsubscribe()
            }
        }
        _complete() {
            try {
                this.destination.complete()
            } finally {
                this.unsubscribe()
            }
        }
    },
    DD = Function.prototype.bind;

function Zc(e, t) {
    return DD.call(e, t)
}
var Qc = class {
        constructor(t) {
            this.partialObserver = t
        }
        next(t) {
            let {
                partialObserver: n
            } = this;
            if (n.next) try {
                n.next(t)
            } catch (r) {
                Li(r)
            }
        }
        error(t) {
            let {
                partialObserver: n
            } = this;
            if (n.error) try {
                n.error(t)
            } catch (r) {
                Li(r)
            } else Li(t)
        }
        complete() {
            let {
                partialObserver: t
            } = this;
            if (t.complete) try {
                t.complete()
            } catch (n) {
                Li(n)
            }
        }
    },
    ir = class extends mn {
        constructor(t, n, r) {
            super();
            let o;
            if (x(t) || !t) o = {
                next: t ? ? void 0,
                error: n ? ? void 0,
                complete: r ? ? void 0
            };
            else {
                let i;
                this && tt.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = {
                    next: t.next && Zc(t.next, i),
                    error: t.error && Zc(t.error, i),
                    complete: t.complete && Zc(t.complete, i)
                }) : o = t
            }
            this.destination = new Qc(o)
        }
    };

function Li(e) {
    tt.useDeprecatedSynchronousErrorHandling ? Sh(e) : Fi(e)
}

function CD(e) {
    throw e
}

function Yc(e, t) {
    let {
        onStoppedNotification: n
    } = tt;
    n && rr.setTimeout(() => n(e, t))
}
var _D = {
    closed: !0,
    next: oo,
    error: CD,
    complete: oo
};
var sr = typeof Symbol == "function" && Symbol.observable || "@@observable";

function ke(e) {
    return e
}

function Kc(...e) {
    return Jc(e)
}

function Jc(e) {
    return e.length === 0 ? ke : e.length === 1 ? e[0] : function(n) {
        return e.reduce((r, o) => o(r), n)
    }
}
var U = (() => {
    class e {
        constructor(n) {
            n && (this._subscribe = n)
        }
        lift(n) {
            let r = new e;
            return r.source = this, r.operator = n, r
        }
        subscribe(n, r, o) {
            let i = ID(n) ? n : new ir(n, r, o);
            return or(() => {
                let {
                    operator: s,
                    source: a
                } = this;
                i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i))
            }), i
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (r) {
                n.error(r)
            }
        }
        forEach(n, r) {
            return r = Mh(r), new r((o, i) => {
                let s = new ir({
                    next: a => {
                        try {
                            n(a)
                        } catch (c) {
                            i(c), s.unsubscribe()
                        }
                    },
                    error: i,
                    complete: o
                });
                this.subscribe(s)
            })
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)
        }[sr]() {
            return this
        }
        pipe(...n) {
            return Jc(n)(this)
        }
        toPromise(n) {
            return n = Mh(n), new n((r, o) => {
                let i;
                this.subscribe(s => i = s, s => o(s), () => r(i))
            })
        }
    }
    return e.create = t => new e(t), e
})();

function Mh(e) {
    var t;
    return (t = e ? ? tt.Promise) !== null && t !== void 0 ? t : Promise
}

function wD(e) {
    return e && x(e.next) && x(e.error) && x(e.complete)
}

function ID(e) {
    return e && e instanceof mn || wD(e) && ki(e)
}

function Xc(e) {
    return x(e ? .lift)
}

function H(e) {
    return t => {
        if (Xc(t)) return t.lift(function(n) {
            try {
                return e(n, this)
            } catch (r) {
                this.error(r)
            }
        });
        throw new TypeError("Unable to lift unknown Observable type")
    }
}

function j(e, t, n, r, o) {
    return new el(e, t, n, r, o)
}
var el = class extends mn {
    constructor(t, n, r, o, i, s) {
        super(t), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = n ? function(a) {
            try {
                n(a)
            } catch (c) {
                t.error(c)
            }
        } : super._next, this._error = o ? function(a) {
            try {
                o(a)
            } catch (c) {
                t.error(c)
            } finally {
                this.unsubscribe()
            }
        } : super._error, this._complete = r ? function() {
            try {
                r()
            } catch (a) {
                t.error(a)
            } finally {
                this.unsubscribe()
            }
        } : super._complete
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let {
                closed: n
            } = this;
            super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
        }
    }
};

function ar() {
    return H((e, t) => {
        let n = null;
        e._refCount++;
        let r = j(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                n = null;
                return
            }
            let o = e._connection,
                i = n;
            n = null, o && (!i || o === i) && o.unsubscribe(), t.unsubscribe()
        });
        e.subscribe(r), r.closed || (n = e.connect())
    })
}
var cr = class extends U {
    constructor(t, n) {
        super(), this.source = t, this.subjectFactory = n, this._subject = null, this._refCount = 0, this._connection = null, Xc(t) && (this.lift = t.lift)
    }
    _subscribe(t) {
        return this.getSubject().subscribe(t)
    }
    getSubject() {
        let t = this._subject;
        return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject
    }
    _teardown() {
        this._refCount = 0;
        let {
            _connection: t
        } = this;
        this._subject = this._connection = null, t ? .unsubscribe()
    }
    connect() {
        let t = this._connection;
        if (!t) {
            t = this._connection = new te;
            let n = this.getSubject();
            t.add(this.source.subscribe(j(n, void 0, () => {
                this._teardown(), n.complete()
            }, r => {
                this._teardown(), n.error(r)
            }, () => this._teardown()))), t.closed && (this._connection = null, t = te.EMPTY)
        }
        return t
    }
    refCount() {
        return ar()(this)
    }
};
var Th = nr(e => function() {
    e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
});
var ne = (() => {
        class e extends U {
            constructor() {
                super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
            }
            lift(n) {
                let r = new Vi(this, this);
                return r.operator = n, r
            }
            _throwIfClosed() {
                if (this.closed) throw new Th
            }
            next(n) {
                or(() => {
                    if (this._throwIfClosed(), !this.isStopped) {
                        this.currentObservers || (this.currentObservers = Array.from(this.observers));
                        for (let r of this.currentObservers) r.next(n)
                    }
                })
            }
            error(n) {
                or(() => {
                    if (this._throwIfClosed(), !this.isStopped) {
                        this.hasError = this.isStopped = !0, this.thrownError = n;
                        let {
                            observers: r
                        } = this;
                        for (; r.length;) r.shift().error(n)
                    }
                })
            }
            complete() {
                or(() => {
                    if (this._throwIfClosed(), !this.isStopped) {
                        this.isStopped = !0;
                        let {
                            observers: n
                        } = this;
                        for (; n.length;) n.shift().complete()
                    }
                })
            }
            unsubscribe() {
                this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
            }
            get observed() {
                var n;
                return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0
            }
            _trySubscribe(n) {
                return this._throwIfClosed(), super._trySubscribe(n)
            }
            _subscribe(n) {
                return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n)
            }
            _innerSubscribe(n) {
                let {
                    hasError: r,
                    isStopped: o,
                    observers: i
                } = this;
                return r || o ? Wc : (this.currentObservers = null, i.push(n), new te(() => {
                    this.currentObservers = null, ro(i, n)
                }))
            }
            _checkFinalizedStatuses(n) {
                let {
                    hasError: r,
                    thrownError: o,
                    isStopped: i
                } = this;
                r ? n.error(o) : i && n.complete()
            }
            asObservable() {
                let n = new U;
                return n.source = this, n
            }
        }
        return e.create = (t, n) => new Vi(t, n), e
    })(),
    Vi = class extends ne {
        constructor(t, n) {
            super(), this.destination = t, this.source = n
        }
        next(t) {
            var n, r;
            (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t)
        }
        error(t) {
            var n, r;
            (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t)
        }
        complete() {
            var t, n;
            (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t)
        }
        _subscribe(t) {
            var n, r;
            return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : Wc
        }
    };
var le = class extends ne {
    constructor(t) {
        super(), this._value = t
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value), n
    }
    getValue() {
        let {
            hasError: t,
            thrownError: n,
            _value: r
        } = this;
        if (t) throw n;
        return this._throwIfClosed(), r
    }
    next(t) {
        super.next(this._value = t)
    }
};
var Te = new U(e => e.complete());

function Ah(e) {
    return e && x(e.schedule)
}

function Nh(e) {
    return e[e.length - 1]
}

function ji(e) {
    return x(Nh(e)) ? e.pop() : void 0
}

function $t(e) {
    return Ah(Nh(e)) ? e.pop() : void 0
}

function xh(e, t, n, r) {
    function o(i) {
        return i instanceof n ? i : new n(function(s) {
            s(i)
        })
    }
    return new(n || (n = Promise))(function(i, s) {
        function a(u) {
            try {
                l(r.next(u))
            } catch (d) {
                s(d)
            }
        }

        function c(u) {
            try {
                l(r.throw(u))
            } catch (d) {
                s(d)
            }
        }

        function l(u) {
            u.done ? i(u.value) : o(u.value).then(a, c)
        }
        l((r = r.apply(e, t || [])).next())
    })
}

function Rh(e) {
    var t = typeof Symbol == "function" && Symbol.iterator,
        n = t && e[t],
        r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number") return {
        next: function() {
            return e && r >= e.length && (e = void 0), {
                value: e && e[r++],
                done: !e
            }
        }
    };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
}

function vn(e) {
    return this instanceof vn ? (this.v = e, this) : new vn(e)
}

function Oh(e, t, n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []),
        o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", s), o[Symbol.asyncIterator] = function() {
        return this
    }, o;

    function s(g) {
        return function(y) {
            return Promise.resolve(y).then(g, d)
        }
    }

    function a(g, y) {
        r[g] && (o[g] = function(_) {
            return new Promise(function(k, L) {
                i.push([g, _, k, L]) > 1 || c(g, _)
            })
        }, y && (o[g] = y(o[g])))
    }

    function c(g, y) {
        try {
            l(r[g](y))
        } catch (_) {
            m(i[0][3], _)
        }
    }

    function l(g) {
        g.value instanceof vn ? Promise.resolve(g.value.v).then(u, d) : m(i[0][2], g)
    }

    function u(g) {
        c("next", g)
    }

    function d(g) {
        c("throw", g)
    }

    function m(g, y) {
        g(y), i.shift(), i.length && c(i[0][0], i[0][1])
    }
}

function Ph(e) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator],
        n;
    return t ? t.call(e) : (e = typeof Rh == "function" ? Rh(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
        return this
    }, n);

    function r(i) {
        n[i] = e[i] && function(s) {
            return new Promise(function(a, c) {
                s = e[i](s), o(a, c, s.done, s.value)
            })
        }
    }

    function o(i, s, a, c) {
        Promise.resolve(c).then(function(l) {
            i({
                value: l,
                done: a
            })
        }, s)
    }
}
var Bi = e => e && typeof e.length == "number" && typeof e != "function";

function Ui(e) {
    return x(e ? .then)
}

function Hi(e) {
    return x(e[sr])
}

function $i(e) {
    return Symbol.asyncIterator && x(e ? .[Symbol.asyncIterator])
}

function zi(e) {
    return new TypeError(`You provided ${e!==null&&typeof e=="object"?"an invalid object":`'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
}

function bD() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}
var Gi = bD();

function Wi(e) {
    return x(e ? .[Gi])
}

function qi(e) {
    return Oh(this, arguments, function*() {
        let n = e.getReader();
        try {
            for (;;) {
                let {
                    value: r,
                    done: o
                } = yield vn(n.read());
                if (o) return yield vn(void 0);
                yield yield vn(r)
            }
        } finally {
            n.releaseLock()
        }
    })
}

function Zi(e) {
    return x(e ? .getReader)
}

function re(e) {
    if (e instanceof U) return e;
    if (e != null) {
        if (Hi(e)) return SD(e);
        if (Bi(e)) return MD(e);
        if (Ui(e)) return TD(e);
        if ($i(e)) return kh(e);
        if (Wi(e)) return AD(e);
        if (Zi(e)) return ND(e)
    }
    throw zi(e)
}

function SD(e) {
    return new U(t => {
        let n = e[sr]();
        if (x(n.subscribe)) return n.subscribe(t);
        throw new TypeError("Provided object does not correctly implement Symbol.observable")
    })
}

function MD(e) {
    return new U(t => {
        for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
        t.complete()
    })
}

function TD(e) {
    return new U(t => {
        e.then(n => {
            t.closed || (t.next(n), t.complete())
        }, n => t.error(n)).then(null, Fi)
    })
}

function AD(e) {
    return new U(t => {
        for (let n of e)
            if (t.next(n), t.closed) return;
        t.complete()
    })
}

function kh(e) {
    return new U(t => {
        RD(e, t).catch(n => t.error(n))
    })
}

function ND(e) {
    return kh(qi(e))
}

function RD(e, t) {
    var n, r, o, i;
    return xh(this, void 0, void 0, function*() {
        try {
            for (n = Ph(e); r = yield n.next(), !r.done;) {
                let s = r.value;
                if (t.next(s), t.closed) return
            }
        } catch (s) {
            o = {
                error: s
            }
        } finally {
            try {
                r && !r.done && (i = n.return) && (yield i.call(n))
            } finally {
                if (o) throw o.error
            }
        }
        t.complete()
    })
}

function Ae(e, t, n, r = 0, o = !1) {
    let i = t.schedule(function() {
        n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe()
    }, r);
    if (e.add(i), !o) return i
}

function Yi(e, t = 0) {
    return H((n, r) => {
        n.subscribe(j(r, o => Ae(r, e, () => r.next(o), t), () => Ae(r, e, () => r.complete(), t), o => Ae(r, e, () => r.error(o), t)))
    })
}

function Qi(e, t = 0) {
    return H((n, r) => {
        r.add(e.schedule(() => n.subscribe(r), t))
    })
}

function Fh(e, t) {
    return re(e).pipe(Qi(t), Yi(t))
}

function Lh(e, t) {
    return re(e).pipe(Qi(t), Yi(t))
}

function Vh(e, t) {
    return new U(n => {
        let r = 0;
        return t.schedule(function() {
            r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule())
        })
    })
}

function jh(e, t) {
    return new U(n => {
        let r;
        return Ae(n, t, () => {
            r = e[Gi](), Ae(n, t, () => {
                let o, i;
                try {
                    ({
                        value: o,
                        done: i
                    } = r.next())
                } catch (s) {
                    n.error(s);
                    return
                }
                i ? n.complete() : n.next(o)
            }, 0, !0)
        }), () => x(r ? .return) && r.return()
    })
}

function Ki(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new U(n => {
        Ae(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            Ae(n, t, () => {
                r.next().then(o => {
                    o.done ? n.complete() : n.next(o.value)
                })
            }, 0, !0)
        })
    })
}

function Bh(e, t) {
    return Ki(qi(e), t)
}

function Uh(e, t) {
    if (e != null) {
        if (Hi(e)) return Fh(e, t);
        if (Bi(e)) return Vh(e, t);
        if (Ui(e)) return Lh(e, t);
        if ($i(e)) return Ki(e, t);
        if (Wi(e)) return jh(e, t);
        if (Zi(e)) return Bh(e, t)
    }
    throw zi(e)
}

function X(e, t) {
    return t ? Uh(e, t) : re(e)
}

function T(...e) {
    let t = $t(e);
    return X(e, t)
}

function lr(e, t) {
    let n = x(e) ? e : () => e,
        r = o => o.error(n());
    return new U(t ? o => t.schedule(r, 0, o) : r)
}

function tl(e) {
    return !!e && (e instanceof U || x(e.lift) && x(e.subscribe))
}
var bt = nr(e => function() {
    e(this), this.name = "EmptyError", this.message = "no elements in sequence"
});

function B(e, t) {
    return H((n, r) => {
        let o = 0;
        n.subscribe(j(r, i => {
            r.next(e.call(t, i, o++))
        }))
    })
}
var {
    isArray: xD
} = Array;

function OD(e, t) {
    return xD(t) ? e(...t) : e(t)
}

function Ji(e) {
    return B(t => OD(e, t))
}
var {
    isArray: PD
} = Array, {
    getPrototypeOf: kD,
    prototype: FD,
    keys: LD
} = Object;

function Xi(e) {
    if (e.length === 1) {
        let t = e[0];
        if (PD(t)) return {
            args: t,
            keys: null
        };
        if (VD(t)) {
            let n = LD(t);
            return {
                args: n.map(r => t[r]),
                keys: n
            }
        }
    }
    return {
        args: e,
        keys: null
    }
}

function VD(e) {
    return e && typeof e == "object" && kD(e) === FD
}

function es(e, t) {
    return e.reduce((n, r, o) => (n[r] = t[o], n), {})
}

function ts(...e) {
    let t = $t(e),
        n = ji(e),
        {
            args: r,
            keys: o
        } = Xi(e);
    if (r.length === 0) return X([], t);
    let i = new U(jD(r, t, o ? s => es(o, s) : ke));
    return n ? i.pipe(Ji(n)) : i
}

function jD(e, t, n = ke) {
    return r => {
        Hh(t, () => {
            let {
                length: o
            } = e, i = new Array(o), s = o, a = o;
            for (let c = 0; c < o; c++) Hh(t, () => {
                let l = X(e[c], t),
                    u = !1;
                l.subscribe(j(r, d => {
                    i[c] = d, u || (u = !0, a--), a || r.next(n(i.slice()))
                }, () => {
                    --s || r.complete()
                }))
            }, r)
        }, r)
    }
}

function Hh(e, t, n) {
    e ? Ae(n, e, t) : t()
}

function $h(e, t, n, r, o, i, s, a) {
    let c = [],
        l = 0,
        u = 0,
        d = !1,
        m = () => {
            d && !c.length && !l && t.complete()
        },
        g = _ => l < r ? y(_) : c.push(_),
        y = _ => {
            i && t.next(_), l++;
            let k = !1;
            re(n(_, u++)).subscribe(j(t, L => {
                o ? .(L), i ? g(L) : t.next(L)
            }, () => {
                k = !0
            }, void 0, () => {
                if (k) try {
                    for (l--; c.length && l < r;) {
                        let L = c.shift();
                        s ? Ae(t, s, () => y(L)) : y(L)
                    }
                    m()
                } catch (L) {
                    t.error(L)
                }
            }))
        };
    return e.subscribe(j(t, g, () => {
        d = !0, m()
    })), () => {
        a ? .()
    }
}

function ue(e, t, n = 1 / 0) {
    return x(t) ? ue((r, o) => B((i, s) => t(r, i, o, s))(re(e(r, o))), n) : (typeof t == "number" && (n = t), H((r, o) => $h(r, o, e, n)))
}

function zh(e = 1 / 0) {
    return ue(ke, e)
}

function Gh() {
    return zh(1)
}

function ur(...e) {
    return Gh()(X(e, $t(e)))
}

function io(e) {
    return new U(t => {
        re(e()).subscribe(t)
    })
}

function nl(...e) {
    let t = ji(e),
        {
            args: n,
            keys: r
        } = Xi(e),
        o = new U(i => {
            let {
                length: s
            } = n;
            if (!s) {
                i.complete();
                return
            }
            let a = new Array(s),
                c = s,
                l = s;
            for (let u = 0; u < s; u++) {
                let d = !1;
                re(n[u]).subscribe(j(i, m => {
                    d || (d = !0, l--), a[u] = m
                }, () => c--, void 0, () => {
                    (!c || !d) && (l || i.next(r ? es(r, a) : a), i.complete())
                }))
            }
        });
    return t ? o.pipe(Ji(t)) : o
}

function We(e, t) {
    return H((n, r) => {
        let o = 0;
        n.subscribe(j(r, i => e.call(t, i, o++) && r.next(i)))
    })
}

function zt(e) {
    return H((t, n) => {
        let r = null,
            o = !1,
            i;
        r = t.subscribe(j(n, void 0, void 0, s => {
            i = re(e(s, zt(e)(t))), r ? (r.unsubscribe(), r = null, i.subscribe(n)) : o = !0
        })), o && (r.unsubscribe(), r = null, i.subscribe(n))
    })
}

function Wh(e, t, n, r, o) {
    return (i, s) => {
        let a = n,
            c = t,
            l = 0;
        i.subscribe(j(s, u => {
            let d = l++;
            c = a ? e(c, u, d) : (a = !0, u), r && s.next(c)
        }, o && (() => {
            a && s.next(c), s.complete()
        })))
    }
}

function dr(e, t) {
    return x(t) ? ue(e, t, 1) : ue(e, 1)
}

function Gt(e) {
    return H((t, n) => {
        let r = !1;
        t.subscribe(j(n, o => {
            r = !0, n.next(o)
        }, () => {
            r || n.next(e), n.complete()
        }))
    })
}

function St(e) {
    return e <= 0 ? () => Te : H((t, n) => {
        let r = 0;
        t.subscribe(j(n, o => {
            ++r <= e && (n.next(o), e <= r && n.complete())
        }))
    })
}

function ns(e = BD) {
    return H((t, n) => {
        let r = !1;
        t.subscribe(j(n, o => {
            r = !0, n.next(o)
        }, () => r ? n.complete() : n.error(e())))
    })
}

function BD() {
    return new bt
}

function so(e) {
    return H((t, n) => {
        try {
            t.subscribe(n)
        } finally {
            n.add(e)
        }
    })
}

function Mt(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? We((o, i) => e(o, i, r)) : ke, St(1), n ? Gt(t) : ns(() => new bt))
}

function fr(e) {
    return e <= 0 ? () => Te : H((t, n) => {
        let r = [];
        t.subscribe(j(n, o => {
            r.push(o), e < r.length && r.shift()
        }, () => {
            for (let o of r) n.next(o);
            n.complete()
        }, void 0, () => {
            r = null
        }))
    })
}

function rl(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? We((o, i) => e(o, i, r)) : ke, fr(1), n ? Gt(t) : ns(() => new bt))
}

function ol(e, t) {
    return H(Wh(e, t, arguments.length >= 2, !0))
}

function il(...e) {
    let t = $t(e);
    return H((n, r) => {
        (t ? ur(e, n, t) : ur(e, n)).subscribe(r)
    })
}

function Ne(e, t) {
    return H((n, r) => {
        let o = null,
            i = 0,
            s = !1,
            a = () => s && !o && r.complete();
        n.subscribe(j(r, c => {
            o ? .unsubscribe();
            let l = 0,
                u = i++;
            re(e(c, u)).subscribe(o = j(r, d => r.next(t ? t(c, d, u, l++) : d), () => {
                o = null, a()
            }))
        }, () => {
            s = !0, a()
        }))
    })
}

function rs(e) {
    return H((t, n) => {
        re(e).subscribe(j(n, () => n.complete(), oo)), !n.closed && t.subscribe(n)
    })
}

function pe(e, t, n) {
    let r = x(e) || t || n ? {
        next: e,
        error: t,
        complete: n
    } : e;
    return r ? H((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(j(i, c => {
            var l;
            (l = r.next) === null || l === void 0 || l.call(r, c), i.next(c)
        }, () => {
            var c;
            a = !1, (c = r.complete) === null || c === void 0 || c.call(r), i.complete()
        }, c => {
            var l;
            a = !1, (l = r.error) === null || l === void 0 || l.call(r, c), i.error(c)
        }, () => {
            var c, l;
            a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)), (l = r.finalize) === null || l === void 0 || l.call(r)
        }))
    }) : ke
}

function qh(e) {
    let t = O(null);
    try {
        return e()
    } finally {
        O(t)
    }
}
var cs = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
    C = class extends Error {
        code;
        constructor(t, n) {
            super(qt(t, n)), this.code = t
        }
    };

function UD(e) {
    return `NG0${Math.abs(e)}`
}

function qt(e, t) {
    return `${UD(e)}${t?": "+t:""}`
}
var pr = globalThis;

function G(e) {
    for (let t in e)
        if (e[t] === G) return t;
    throw Error("")
}

function Qh(e, t) {
    for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}

function At(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return `[${e.map(At).join(", ")}]`;
    if (e == null) return "" + e;
    let t = e.overriddenName || e.name;
    if (t) return `${t}`;
    let n = e.toString();
    if (n == null) return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n
}

function yl(e, t) {
    return e ? t ? `${e} ${t}` : e : t || ""
}
var HD = G({
    __forward_ref__: G
});

function ht(e) {
    return e.__forward_ref__ = ht, e.toString = function() {
        return At(this())
    }, e
}

function me(e) {
    return El(e) ? e() : e
}

function El(e) {
    return typeof e == "function" && e.hasOwnProperty(HD) && e.__forward_ref__ === ht
}

function Kh(e, t) {
    e == null && Dl(t, e, null, "!=")
}

function Dl(e, t, n, r) {
    throw new Error(`ASSERTION ERROR: ${e}` + (r == null ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`))
}

function w(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0
    }
}

function pt(e) {
    return {
        providers: e.providers || [],
        imports: e.imports || []
    }
}

function fo(e) {
    return $D(e, ls)
}

function Cl(e) {
    return fo(e) !== null
}

function $D(e, t) {
    return e.hasOwnProperty(t) && e[t] || null
}

function zD(e) {
    let t = e ? .[ls] ? ? null;
    return t || null
}

function al(e) {
    return e && e.hasOwnProperty(is) ? e[is] : null
}
var ls = G({\
        u0275prov: G
    }),
    is = G({\
        u0275inj: G
    }),
    D = class {
        _desc;
        ngMetadataName = "InjectionToken";\
        u0275prov;
        constructor(t, n) {
            this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = w({
                token: this,
                providedIn: n.providedIn || "root",
                factory: n.factory
            }))
        }
        get multi() {
            return this
        }
        toString() {
            return `InjectionToken ${this._desc}`
        }
    };

function _l(e) {
    return e && !!e.\u0275providers
}
var wl = G({\
        u0275cmp: G
    }),
    Il = G({\
        u0275dir: G
    }),
    bl = G({\
        u0275pipe: G
    }),
    Sl = G({\
        u0275mod: G
    }),
    lo = G({\
        u0275fac: G
    }),
    wn = G({
        __NG_ELEMENT_ID__: G
    }),
    Zh = G({
        __NG_ENV_ID__: G
    });

function ho(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e)
}

function ss(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : ho(e)
}
var Ml = G({
        ngErrorCode: G
    }),
    Jh = G({
        ngErrorMessage: G
    }),
    co = G({
        ngTokenPath: G
    });

function Tl(e, t) {
    return Xh("", -200, t)
}

function us(e, t) {
    throw new C(-201, !1)
}

function GD(e, t) {
    e[co] ? ? = [];
    let n = e[co],
        r;
    typeof t == "object" && "multi" in t && t ? .multi === !0 ? (Kh(t.provide, "Token with multi: true should have a provide property"), r = ss(t.provide)) : r = ss(t), n[0] !== r && e[co].unshift(r)
}

function WD(e, t) {
    let n = e[co],
        r = e[Ml],
        o = e[Jh] || e.message;
    return e.message = ZD(o, r, n, t), e
}

function Xh(e, t, n) {
    let r = new C(t, e);
    return r[Ml] = t, r[Jh] = e, n && (r[co] = n), r
}

function qD(e) {
    return e[Ml]
}

function ZD(e, t, n = [], r = null) {
    let o = "";
    n && n.length > 1 && (o = ` Path: ${n.join(" -> ")}.`);
    let i = r ? ` Source: ${r}.` : "";
    return qt(t, `${e}${i}${o}`)
}
var cl;

function ep() {
    return cl
}

function Fe(e) {
    let t = cl;
    return cl = e, t
}

function Al(e, t, n) {
    let r = fo(e);
    if (r && r.providedIn == "root") return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & 8) return null;
    if (t !== void 0) return t;
    us(e, "Injector")
}
var YD = {},
    yn = YD,
    ll = "__NG_DI_FLAG__",
    ul = class {
        injector;
        constructor(t) {
            this.injector = t
        }
        retrieve(t, n) {
            let r = En(n) || 0;
            try {
                return this.injector.get(t, r & 8 ? null : yn, r)
            } catch (o) {
                if (Kn(o)) return o;
                throw o
            }
        }
    };

function QD(e, t = 0) {
    let n = wi();
    if (n === void 0) throw new C(-203, !1);
    if (n === null) return Al(e, void 0, t); {
        let r = KD(t),
            o = n.retrieve(e, r);
        if (Kn(o)) {
            if (r.optional) return null;
            throw o
        }
        return o
    }
}

function A(e, t = 0) {
    return (ep() || QD)(me(e), t)
}

function v(e, t) {
    return A(e, En(t))
}

function En(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}

function KD(e) {
    return {
        optional: !!(e & 8),
        host: !!(e & 1),
        self: !!(e & 2),
        skipSelf: !!(e & 4)
    }
}

function dl(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = me(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0) throw new C(900, !1);
            let o, i = 0;
            for (let s = 0; s < r.length; s++) {
                let a = r[s],
                    c = JD(a);
                typeof c == "number" ? c === -1 ? o = a.token : i |= c : o = a
            }
            t.push(A(o, i))
        } else t.push(A(r))
    }
    return t
}

function Nl(e, t) {
    return e[ll] = t, e.prototype[ll] = t, e
}

function JD(e) {
    return e[ll]
}

function Dn(e, t) {
    let n = e.hasOwnProperty(lo);
    return n ? e[lo] : null
}

function ds(e, t) {
    e.forEach(n => Array.isArray(n) ? ds(n, t) : t(n))
}

function Rl(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n)
}

function po(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}

function tp(e, t, n, r) {
    let o = e.length;
    if (o == t) e.push(n, r);
    else if (o === 1) e.push(r, e[0]), e[0] = n;
    else {
        for (o--, e.push(e[o - 1], e[o]); o > t;) {
            let i = o - 2;
            e[o] = e[i], o--
        }
        e[t] = n, e[t + 1] = r
    }
}

function np(e, t, n) {
    let r = gr(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r, tp(e, r, t, n)), r
}

function fs(e, t) {
    let n = gr(e, t);
    if (n >= 0) return e[n | 1]
}

function gr(e, t) {
    return XD(e, t, 1)
}

function XD(e, t, n) {
    let r = 0,
        o = e.length >> n;
    for (; o !== r;) {
        let i = r + (o - r >> 1),
            s = e[i << n];
        if (t === s) return i << n;
        s > t ? o = i : r = i + 1
    }
    return ~(o << n)
}
var Zt = {},
    Le = [],
    qe = new D(""),
    xl = new D("", -1),
    Ol = new D(""),
    uo = class {
        get(t, n = yn) {
            if (n === yn) {
                let o = Xh("", -201);
                throw o.name = "\u0275NotFound", o
            }
            return n
        }
    };

function Pl(e) {
    return e[Sl] || null
}

function Nt(e) {
    return e[wl] || null
}

function hs(e) {
    return e[Il] || null
}

function kl(e) {
    return e[bl] || null
}

function rt(e) {
    return {\
        u0275providers: e
    }
}

function rp(e) {
    return rt([{
        provide: qe,
        multi: !0,
        useValue: e
    }])
}

function op(...e) {
    return {\
        u0275providers: ps(!0, e),
        \u0275fromNgModule: !0
    }
}

function ps(e, ...t) {
    let n = [],
        r = new Set,
        o, i = s => {
            n.push(s)
        };
    return ds(t, s => {
        let a = s;
        as(a, i, [], r) && (o || = [], o.push(a))
    }), o !== void 0 && ip(o, i), n
}

function ip(e, t) {
    for (let n = 0; n < e.length; n++) {
        let {
            ngModule: r,
            providers: o
        } = e[n];
        Fl(o, i => {
            t(i, r)
        })
    }
}

function as(e, t, n, r) {
    if (e = me(e), !e) return !1;
    let o = null,
        i = al(e),
        s = !i && Nt(e);
    if (!i && !s) {
        let c = e.ngModule;
        if (i = al(c), i) o = c;
        else return !1
    } else {
        if (s && !s.standalone) return !1;
        o = e
    }
    let a = r.has(o);
    if (s) {
        if (a) return !1;
        if (r.add(o), s.dependencies) {
            let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let l of c) as(l, t, n, r)
        }
    } else if (i) {
        if (i.imports != null && !a) {
            r.add(o);
            let l;
            try {
                ds(i.imports, u => {
                    as(u, t, n, r) && (l || = [], l.push(u))
                })
            } finally {}
            l !== void 0 && ip(l, t)
        }
        if (!a) {
            let l = Dn(o) || (() => new o);
            t({
                provide: o,
                useFactory: l,
                deps: Le
            }, o), t({
                provide: Ol,
                useValue: o,
                multi: !0
            }, o), t({
                provide: qe,
                useValue: () => A(o),
                multi: !0
            }, o)
        }
        let c = i.providers;
        if (c != null && !a) {
            let l = e;
            Fl(c, u => {
                t(u, l)
            })
        }
    } else return !1;
    return o !== e && e.providers !== void 0
}

function Fl(e, t) {
    for (let n of e) _l(n) && (n = n.\u0275providers), Array.isArray(n) ? Fl(n, t) : t(n)
}
var eC = G({
    provide: String,
    useValue: G
});

function sp(e) {
    return e !== null && typeof e == "object" && eC in e
}

function tC(e) {
    return !!(e && e.useExisting)
}

function nC(e) {
    return !!(e && e.useFactory)
}

function Cn(e) {
    return typeof e == "function"
}

function ap(e) {
    return !!e.useClass
}
var go = new D(""),
    os = {},
    Yh = {},
    sl;

function mo() {
    return sl === void 0 && (sl = new uo), sl
}
var de = class {},
    _n = class extends de {
        parent;
        source;
        scopes;
        records = new Map;
        _ngOnDestroyHooks = new Set;
        _onDestroyHooks = [];
        get destroyed() {
            return this._destroyed
        }
        _destroyed = !1;
        injectorDefTypes;
        constructor(t, n, r, o) {
            super(), this.parent = n, this.source = r, this.scopes = o, hl(t, s => this.processProvider(s)), this.records.set(xl, hr(void 0, this)), o.has("environment") && this.records.set(de, hr(void 0, this));
            let i = this.records.get(go);
            i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(Ol, Le, {
                self: !0
            }))
        }
        retrieve(t, n) {
            let r = En(n) || 0;
            try {
                return this.get(t, yn, r)
            } catch (o) {
                if (Kn(o)) return o;
                throw o
            }
        }
        destroy() {
            ao(this), this._destroyed = !0;
            let t = O(null);
            try {
                for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
                let n = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of n) r()
            } finally {
                this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), O(t)
            }
        }
        onDestroy(t) {
            return ao(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
        }
        runInContext(t) {
            ao(this);
            let n = dt(this),
                r = Fe(void 0),
                o;
            try {
                return t()
            } finally {
                dt(n), Fe(r)
            }
        }
        get(t, n = yn, r) {
            if (ao(this), t.hasOwnProperty(Zh)) return t[Zh](this);
            let o = En(r),
                i, s = dt(this),
                a = Fe(void 0);
            try {
                if (!(o & 4)) {
                    let l = this.records.get(t);
                    if (l === void 0) {
                        let u = aC(t) && fo(t);
                        u && this.injectableDefInScope(u) ? l = hr(fl(t), os) : l = null, this.records.set(t, l)
                    }
                    if (l != null) return this.hydrate(t, l, o)
                }
                let c = o & 2 ? mo() : this.parent;
                return n = o & 8 && n === yn ? null : n, c.get(t, n)
            } catch (c) {
                let l = qD(c);
                throw l === -200 || l === -201 ? new C(l, null) : c
            } finally {
                Fe(a), dt(s)
            }
        }
        resolveInjectorInitializers() {
            let t = O(null),
                n = dt(this),
                r = Fe(void 0),
                o;
            try {
                let i = this.get(qe, Le, {
                    self: !0
                });
                for (let s of i) s()
            } finally {
                dt(n), Fe(r), O(t)
            }
        }
        toString() {
            let t = [],
                n = this.records;
            for (let r of n.keys()) t.push(At(r));
            return `R3Injector[${t.join(", ")}]`
        }
        processProvider(t) {
            t = me(t);
            let n = Cn(t) ? t : me(t && t.provide),
                r = oC(t);
            if (!Cn(t) && t.multi === !0) {
                let o = this.records.get(n);
                o || (o = hr(void 0, os, !0), o.factory = () => dl(o.multi), this.records.set(n, o)), n = t, o.multi.push(t)
            }
            this.records.set(n, r)
        }
        hydrate(t, n, r) {
            let o = O(null);
            try {
                if (n.value === Yh) throw Tl(At(t));
                return n.value === os && (n.value = Yh, n.value = n.factory(void 0, r)), typeof n.value == "object" && n.value && sC(n.value) && this._ngOnDestroyHooks.add(n.value), n.value
            } finally {
                O(o)
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn) return !1;
            let n = me(t.providedIn);
            return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
        }
        removeOnDestroy(t) {
            let n = this._onDestroyHooks.indexOf(t);
            n !== -1 && this._onDestroyHooks.splice(n, 1)
        }
    };

function fl(e) {
    let t = fo(e),
        n = t !== null ? t.factory : Dn(e);
    if (n !== null) return n;
    if (e instanceof D) throw new C(204, !1);
    if (e instanceof Function) return rC(e);
    throw new C(204, !1)
}

function rC(e) {
    if (e.length > 0) throw new C(204, !1);
    let n = zD(e);
    return n !== null ? () => n.factory(e) : () => new e
}

function oC(e) {
    if (sp(e)) return hr(void 0, e.useValue); {
        let t = Ll(e);
        return hr(t, os)
    }
}

function Ll(e, t, n) {
    let r;
    if (Cn(e)) {
        let o = me(e);
        return Dn(o) || fl(o)
    } else if (sp(e)) r = () => me(e.useValue);
    else if (nC(e)) r = () => e.useFactory(...dl(e.deps || []));
    else if (tC(e)) r = (o, i) => A(me(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
    else {
        let o = me(e && (e.useClass || e.provide));
        if (iC(e)) r = () => new o(...dl(e.deps));
        else return Dn(o) || fl(o)
    }
    return r
}

function ao(e) {
    if (e.destroyed) throw new C(205, !1)
}

function hr(e, t, n = !1) {
    return {
        factory: e,
        value: t,
        multi: n ? [] : void 0
    }
}

function iC(e) {
    return !!e.deps
}

function sC(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
}

function aC(e) {
    return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"
}

function hl(e, t) {
    for (let n of e) Array.isArray(n) ? hl(n, t) : n && _l(n) ? hl(n.\u0275providers, t) : t(n)
}

function De(e, t) {
    let n;
    e instanceof _n ? (ao(e), n = e) : n = new ul(e);
    let r, o = dt(n),
        i = Fe(void 0);
    try {
        return t()
    } finally {
        dt(o), Fe(i)
    }
}

function cp() {
    return ep() !== void 0 || wi() != null
}
var we = 0,
    b = 1,
    N = 2,
    oe = 3,
    Ze = 4,
    Ye = 5,
    Ve = 6,
    mr = 7,
    Ce = 8,
    ot = 9,
    gt = 10,
    Z = 11,
    vr = 12,
    Vl = 13,
    In = 14,
    xe = 15,
    bn = 16,
    Sn = 17,
    Mn = 18,
    vo = 19,
    jl = 20,
    Tt = 21,
    gs = 22,
    yo = 23,
    je = 24,
    Tn = 25,
    Q = 26,
    lp = 1,
    it = 6,
    mt = 7,
    Eo = 8,
    Do = 9,
    Ie = 10;

function Be(e) {
    return Array.isArray(e) && typeof e[lp] == "object"
}

function Ue(e) {
    return Array.isArray(e) && e[lp] === !0
}

function Bl(e) {
    return (e.flags & 4) !== 0
}

function Rt(e) {
    return e.componentOffset > -1
}

function yr(e) {
    return (e.flags & 1) === 1
}

function vt(e) {
    return !!e.template
}

function An(e) {
    return (e[N] & 512) !== 0
}

function Yt(e) {
    return (e[N] & 256) === 256
}
var up = "svg",
    dp = "math";

function He(e) {
    for (; Array.isArray(e);) e = e[we];
    return e
}

function Ul(e, t) {
    return He(t[e])
}

function Qe(e, t) {
    return He(t[e.index])
}

function Er(e, t) {
    return e.data[t]
}

function fp(e, t) {
    return e[t]
}

function Ke(e, t) {
    let n = t[e];
    return Be(n) ? n : n[we]
}

function ms(e) {
    return (e[N] & 128) === 128
}

function hp(e) {
    return Ue(e[oe])
}

function Nn(e, t) {
    return t == null ? null : e[t]
}

function Hl(e) {
    e[Sn] = 0
}

function $l(e) {
    e[N] & 1024 || (e[N] |= 1024, ms(e) && Dr(e))
}

function pp(e, t) {
    for (; e > 0;) t = t[In], e--;
    return t
}

function Co(e) {
    return !!(e[N] & 9216 || e[je] ? .dirty)
}

function vs(e) {
    e[gt].changeDetectionScheduler ? .notify(8), e[N] & 64 && (e[N] |= 1024), Co(e) && Dr(e)
}

function Dr(e) {
    e[gt].changeDetectionScheduler ? .notify(0);
    let t = Wt(e);
    for (; t !== null && !(t[N] & 8192 || (t[N] |= 8192, !ms(t)));) t = Wt(t)
}

function zl(e, t) {
    if (Yt(e)) throw new C(911, !1);
    e[Tt] === null && (e[Tt] = []), e[Tt].push(t)
}

function gp(e, t) {
    if (e[Tt] === null) return;
    let n = e[Tt].indexOf(t);
    n !== -1 && e[Tt].splice(n, 1)
}

function Wt(e) {
    let t = e[oe];
    return Ue(t) ? t[oe] : t
}

function mp(e) {
    return e[mr] ? ? = []
}

function vp(e) {
    return e.cleanup ? ? = []
}
var F = {
        lFrame: Rp(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null
    },
    _o = (function(e) {
        return e[e.Off = 0] = "Off", e[e.Exhaustive = 1] = "Exhaustive", e[e.OnlyDirtyViews = 2] = "OnlyDirtyViews", e
    })(_o || {}),
    cC = 0,
    pl = !1;

function yp() {
    return F.lFrame.elementDepthCount
}

function Ep() {
    F.lFrame.elementDepthCount++
}

function Gl() {
    F.lFrame.elementDepthCount--
}

function ys() {
    return F.bindingsEnabled
}

function Wl() {
    return F.skipHydrationRootTNode !== null
}

function ql(e) {
    return F.skipHydrationRootTNode === e
}

function Dp(e) {
    F.skipHydrationRootTNode = e
}

function Zl() {
    F.skipHydrationRootTNode = null
}

function Y() {
    return F.lFrame.lView
}

function Je() {
    return F.lFrame.tView
}

function xt(e) {
    return F.lFrame.contextLView = e, e[Ce]
}

function Ot(e) {
    return F.lFrame.contextLView = null, e
}

function ve() {
    let e = Yl();
    for (; e !== null && e.type === 64;) e = e.parent;
    return e
}

function Yl() {
    return F.lFrame.currentTNode
}

function Cp() {
    let e = F.lFrame,
        t = e.currentTNode;
    return e.isParent ? t : t.parent
}

function Cr(e, t) {
    let n = F.lFrame;
    n.currentTNode = e, n.isParent = t
}

function Ql() {
    return F.lFrame.isParent
}

function _p() {
    F.lFrame.isParent = !1
}

function wp() {
    return F.lFrame.contextLView
}

function Kl(e) {
    Dl("Must never be called in production mode"), cC = e
}

function Jl() {
    return pl
}

function Xl(e) {
    let t = pl;
    return pl = e, t
}

function Ip(e) {
    return F.lFrame.bindingIndex = e
}

function Es() {
    return F.lFrame.bindingIndex++
}

function bp(e) {
    let t = F.lFrame,
        n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e, n
}

function Sp() {
    return F.lFrame.inI18n
}

function Mp(e, t) {
    let n = F.lFrame;
    n.bindingIndex = n.bindingRootIndex = e, Ds(t)
}

function Tp() {
    return F.lFrame.currentDirectiveIndex
}

function Ds(e) {
    F.lFrame.currentDirectiveIndex = e
}

function Ap(e) {
    let t = F.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t]
}

function eu(e) {
    F.lFrame.currentQueryIndex = e
}

function lC(e) {
    let t = e[b];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ye] : null
}

function tu(e, t, n) {
    if (n & 4) {
        let o = t,
            i = e;
        for (; o = o.parent, o === null && !(n & 1);)
            if (o = lC(i), o === null || (i = i[In], o.type & 10)) break;
        if (o === null) return !1;
        t = o, e = i
    }
    let r = F.lFrame = Np();
    return r.currentTNode = t, r.lView = e, !0
}

function Cs(e) {
    let t = Np(),
        n = e[b];
    F.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1
}

function Np() {
    let e = F.lFrame,
        t = e === null ? null : e.child;
    return t === null ? Rp(e) : t
}

function Rp(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1
    };
    return e !== null && (e.child = t), t
}

function xp() {
    let e = F.lFrame;
    return F.lFrame = e.parent, e.currentTNode = null, e.lView = null, e
}
var nu = xp;

function _s() {
    let e = xp();
    e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0
}

function Op(e) {
    return (F.lFrame.contextLView = pp(e, F.lFrame.contextLView))[Ce]
}

function Rn() {
    return F.lFrame.selectedIndex
}

function Qt(e) {
    F.lFrame.selectedIndex = e
}

function ru() {
    let e = F.lFrame;
    return Er(e.tView, e.selectedIndex)
}

function ou() {
    return F.lFrame.currentNamespace
}
var Pp = !0;

function ws() {
    return Pp
}

function Pt(e) {
    Pp = e
}
var uC = {
    elements: void 0
};

function Is() {
    return uC
}

function gl(e, t = null, n = null, r) {
    let o = iu(e, t, n, r);
    return o.resolveInjectorInitializers(), o
}

function iu(e, t = null, n = null, r, o = new Set) {
    let i = [n || Le, op(e)];
    return r = r || (typeof e == "object" ? void 0 : At(e)), new _n(i, t || mo(), r || null, o)
}
var Re = class e {
        static THROW_IF_NOT_FOUND = yn;
        static NULL = new uo;
        static create(t, n) {
            if (Array.isArray(t)) return gl({
                name: ""
            }, n, t, ""); {
                let r = t.name ? ? "";
                return gl({
                    name: r
                }, t.parent, t.providers, r)
            }
        }
        static\ u0275prov = w({
            token: e,
            providedIn: "any",
            factory: () => A(xl)
        });
        static __NG_ELEMENT_ID__ = -1
    },
    fe = new D(""),
    yt = (() => {
        class e {
            static __NG_ELEMENT_ID__ = dC;
            static __NG_ENV_ID__ = n => n
        }
        return e
    })(),
    ml = class extends yt {
        _lView;
        constructor(t) {
            super(), this._lView = t
        }
        get destroyed() {
            return Yt(this._lView)
        }
        onDestroy(t) {
            let n = this._lView;
            return zl(n, t), () => gp(n, t)
        }
    };

function dC() {
    return new ml(Y())
}
var nt = class {
        _console = console;
        handleError(t) {
            this._console.error("ERROR", t)
        }
    },
    be = new D("", {
        providedIn: "root",
        factory: () => {
            let e = v(de),
                t;
            return n => {
                e.destroyed && !t ? setTimeout(() => {
                    throw n
                }) : (t ? ? = e.get(nt), t.handleError(n))
            }
        }
    }),
    kp = {
        provide: qe,
        useValue: () => void v(nt),
        multi: !0
    },
    fC = new D("", {
        providedIn: "root",
        factory: () => {
            let e = v(fe).defaultView;
            if (!e) return;
            let t = v(be),
                n = i => {
                    t(i.reason), i.preventDefault()
                },
                r = i => {
                    i.error ? t(i.error) : t(new Error(i.message, {
                        cause: i
                    })), i.preventDefault()
                },
                o = () => {
                    e.addEventListener("unhandledrejection", n), e.addEventListener("error", r)
                };
            typeof Zone < "u" ? Zone.root.run(o) : o(), v(yt).onDestroy(() => {
                e.removeEventListener("error", r), e.removeEventListener("unhandledrejection", n)
            })
        }
    });

function su() {
    return rt([rp(() => void v(fC))])
}

function Oe(e, t) {
    let [n, r, o] = zc(e, t ? .equal), i = n, s = i[_e];
    return i.set = r, i.update = o, i.asReadonly = Fp.bind(i), i
}

function Fp() {
    let e = this[_e];
    if (e.readonlyFn === void 0) {
        let t = () => this();
        t[_e] = e, e.readonlyFn = t
    }
    return e.readonlyFn
}
var ft = class {},
    _r = new D("", {
        providedIn: "root",
        factory: () => !1
    });
var au = new D(""),
    bs = new D("");
var Ss = (() => {
    class e {
        view;
        node;
        constructor(n, r) {
            this.view = n, this.node = r
        }
        static __NG_ELEMENT_ID__ = hC
    }
    return e
})();

function hC() {
    return new Ss(Y(), ve())
}
var st = (() => {
        class e {
            taskId = 0;
            pendingTasks = new Set;
            destroyed = !1;
            pendingTask = new le(!1);
            get hasPendingTasks() {
                return this.destroyed ? !1 : this.pendingTask.value
            }
            get hasPendingTasksObservable() {
                return this.destroyed ? new U(n => {
                    n.next(!1), n.complete()
                }) : this.pendingTask
            }
            add() {
                !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
                let n = this.taskId++;
                return this.pendingTasks.add(n), n
            }
            has(n) {
                return this.pendingTasks.has(n)
            }
            remove(n) {
                this.pendingTasks.delete(n), this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1)
            }
            ngOnDestroy() {
                this.pendingTasks.clear(), this.hasPendingTasks && this.pendingTask.next(!1), this.destroyed = !0, this.pendingTask.unsubscribe()
            }
            static\ u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    Ms = (() => {
        class e {
            internalPendingTasks = v(st);
            scheduler = v(ft);
            errorHandler = v(be);
            add() {
                let n = this.internalPendingTasks.add();
                return () => {
                    this.internalPendingTasks.has(n) && (this.scheduler.notify(11), this.internalPendingTasks.remove(n))
                }
            }
            run(n) {
                let r = this.add();
                n().catch(this.errorHandler).finally(r)
            }
            static\ u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })();

function wo(...e) {}
var cu = (() => {
        class e {
            static\ u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new vl
            })
        }
        return e
    })(),
    vl = class {
        dirtyEffectCount = 0;
        queues = new Map;
        add(t) {
            this.enqueue(t), this.schedule(t)
        }
        schedule(t) {
            t.dirty && this.dirtyEffectCount++
        }
        remove(t) {
            let n = t.zone,
                r = this.queues.get(n);
            r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--)
        }
        enqueue(t) {
            let n = t.zone;
            this.queues.has(n) || this.queues.set(n, new Set);
            let r = this.queues.get(n);
            r.has(t) || r.add(t)
        }
        flush() {
            for (; this.dirtyEffectCount > 0;) {
                let t = !1;
                for (let [n, r] of this.queues) n === null ? t || = this.flushQueue(r) : t || = n.run(() => this.flushQueue(r));
                t || (this.dirtyEffectCount = 0)
            }
        }
        flushQueue(t) {
            let n = !1;
            for (let r of t) r.dirty && (this.dirtyEffectCount--, n = !0, r.run());
            return n
        }
    };
var Ts = {
    JSACTION: "jsaction"
};

function Rr(e) {
    return {
        toString: e
    }.toString()
}
var As = "__parameters__";

function wC(e) {
    return function(...n) {
        if (e) {
            let r = e(...n);
            for (let o in r) this[o] = r[o]
        }
    }
}

function Cg(e, t, n) {
    return Rr(() => {
        let r = wC(t);

        function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            let s = new o(...i);
            return a.annotation = s, a;

            function a(c, l, u) {
                let d = c.hasOwnProperty(As) ? c[As] : Object.defineProperty(c, As, {
                    value: []
                })[As];
                for (; d.length <= u;) d.push(null);
                return (d[u] = d[u] || []).push(s), c
            }
        }
        return o.prototype.ngMetadataName = e, o.annotationCls = o, o
    })
}
var $u = Nl(Cg("Optional"), 8);
var _g = Nl(Cg("SkipSelf"), 4);

function IC(e) {
    return typeof e == "function"
}
var Ls = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
        this.previousValue = t, this.currentValue = n, this.firstChange = r
    }
    isFirstChange() {
        return this.firstChange
    }
};

function wg(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r
}
var Ft = (() => {
    let e = () => Ig;
    return e.ngInherit = !0, e
})();

function Ig(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = SC), bC
}

function bC() {
    let e = Sg(this),
        t = e ? .current;
    if (t) {
        let n = e.previous;
        if (n === Zt) e.previous = t;
        else
            for (let r in t) n[r] = t[r];
        e.current = null, this.ngOnChanges(t)
    }
}

function SC(e, t, n, r, o) {
    let i = this.declaredInputs[r],
        s = Sg(e) || MC(e, {
            previous: Zt,
            current: null
        }),
        a = s.current || (s.current = {}),
        c = s.previous,
        l = c[i];
    a[i] = new Ls(l && l.currentValue, n, c === Zt), wg(e, t, o, n)
}
var bg = "__ngSimpleChanges__";

function Sg(e) {
    return e[bg] || null
}

function MC(e, t) {
    return e[bg] = t
}
var Lp = [];
var z = function(e, t = null, n) {
    for (let r = 0; r < Lp.length; r++) {
        let o = Lp[r];
        o(e, t, n)
    }
};

function TC(e, t, n) {
    let {
        ngOnChanges: r,
        ngOnInit: o,
        ngDoCheck: i
    } = t.type.prototype;
    if (r) {
        let s = Ig(t);
        (n.preOrderHooks ? ? = []).push(e, s), (n.preOrderCheckHooks ? ? = []).push(e, s)
    }
    o && (n.preOrderHooks ? ? = []).push(0 - e, o), i && ((n.preOrderHooks ? ? = []).push(e, i), (n.preOrderCheckHooks ? ? = []).push(e, i))
}

function Mg(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype,
            {
                ngAfterContentInit: s,
                ngAfterContentChecked: a,
                ngAfterViewInit: c,
                ngAfterViewChecked: l,
                ngOnDestroy: u
            } = i;
        s && (e.contentHooks ? ? = []).push(-n, s), a && ((e.contentHooks ? ? = []).push(n, a), (e.contentCheckHooks ? ? = []).push(n, a)), c && (e.viewHooks ? ? = []).push(-n, c), l && ((e.viewHooks ? ? = []).push(n, l), (e.viewCheckHooks ? ? = []).push(n, l)), u != null && (e.destroyHooks ? ? = []).push(n, u)
    }
}

function xs(e, t, n) {
    Tg(e, t, 3, n)
}

function Os(e, t, n, r) {
    (e[N] & 3) === n && Tg(e, t, n, r)
}

function lu(e, t) {
    let n = e[N];
    (n & 3) === t && (n &= 16383, n += 1, e[N] = n)
}

function Tg(e, t, n, r) {
    let o = r !== void 0 ? e[Sn] & 65535 : 0,
        i = r ? ? -1,
        s = t.length - 1,
        a = 0;
    for (let c = o; c < s; c++)
        if (typeof t[c + 1] == "number") {
            if (a = t[c], r != null && a >= r) break
        } else t[c] < 0 && (e[Sn] += 65536), (a < i || i == -1) && (AC(e, n, t, c), e[Sn] = (e[Sn] & 4294901760) + c + 2), c++
}

function Vp(e, t) {
    z(4, e, t);
    let n = O(null);
    try {
        t.call(e)
    } finally {
        O(n), z(5, e, t)
    }
}

function AC(e, t, n, r) {
    let o = n[r] < 0,
        i = n[r + 1],
        s = o ? -n[r] : n[r],
        a = e[s];
    o ? e[N] >> 14 < e[Sn] >> 16 && (e[N] & 3) === t && (e[N] += 16384, Vp(a, i)) : Vp(a, i)
}
var Ir = -1,
    Pn = class {
        factory;
        name;
        injectImpl;
        resolving = !1;
        canSeeViewProviders;
        multi;
        componentProviders;
        index;
        providerFactory;
        constructor(t, n, r, o) {
            this.factory = t, this.name = o, this.canSeeViewProviders = n, this.injectImpl = r
        }
    };

function NC(e) {
    return (e.flags & 8) !== 0
}

function RC(e) {
    return (e.flags & 16) !== 0
}

function xC(e, t, n) {
    let r = 0;
    for (; r < n.length;) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0) break;
            r++;
            let i = n[r++],
                s = n[r++],
                a = n[r++];
            e.setAttribute(t, s, a, i)
        } else {
            let i = o,
                s = n[++r];
            OC(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++
        }
    }
    return r
}

function Ag(e) {
    return e === 3 || e === 4 || e === 6
}

function OC(e) {
    return e.charCodeAt(0) === 64
}

function Mr(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0) e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? jp(e, n, o, null, t[++r]) : jp(e, n, o, null, null))
            }
        }
    return e
}

function jp(e, t, n, r, o) {
    let i = 0,
        s = e.length;
    if (t === -1) s = -1;
    else
        for (; i < e.length;) {
            let a = e[i++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break
                } else if (a > t) {
                    s = i - 1;
                    break
                }
            }
        }
    for (; i < e.length;) {
        let a = e[i];
        if (typeof a == "number") break;
        if (a === n) {
            o !== null && (e[i + 1] = o);
            return
        }
        i++, o !== null && i++
    }
    s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), o !== null && e.splice(i++, 0, o)
}

function Ng(e) {
    return e !== Ir
}

function Vs(e) {
    return e & 32767
}

function PC(e) {
    return e >> 16
}

function js(e, t) {
    let n = PC(e),
        r = t;
    for (; n > 0;) r = r[In], n--;
    return r
}
var _u = !0;

function Bp(e) {
    let t = _u;
    return _u = e, t
}
var kC = 256,
    Rg = kC - 1,
    xg = 5,
    FC = 0,
    Et = {};

function LC(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(wn) && (r = n[wn]), r == null && (r = n[wn] = FC++);
    let o = r & Rg,
        i = 1 << o;
    t.data[e + (o >> xg)] |= i
}

function Bs(e, t) {
    let n = Og(e, t);
    if (n !== -1) return n;
    let r = t[b];
    r.firstCreatePass && (e.injectorIndex = t.length, uu(r.data, e), uu(t, null), uu(r.blueprint, null));
    let o = zu(e, t),
        i = e.injectorIndex;
    if (Ng(o)) {
        let s = Vs(o),
            a = js(o, t),
            c = a[b].data;
        for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l]
    }
    return t[i + 8] = o, i
}

function uu(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}

function Og(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex
}

function zu(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
    let n = 0,
        r = null,
        o = t;
    for (; o !== null;) {
        if (r = Vg(o), r === null) return Ir;
        if (n++, o = o[In], r.injectorIndex !== -1) return r.injectorIndex | n << 16
    }
    return Ir
}

function wu(e, t, n) {
    LC(e, t, n)
}

function VC(e, t) {
    if (t === "class") return e.classes;
    if (t === "style") return e.styles;
    let n = e.attrs;
    if (n) {
        let r = n.length,
            o = 0;
        for (; o < r;) {
            let i = n[o];
            if (Ag(i)) break;
            if (i === 0) o = o + 2;
            else if (typeof i == "number")
                for (o++; o < r && typeof n[o] == "string";) o++;
            else {
                if (i === t) return n[o + 1];
                o = o + 2
            }
        }
    }
    return null
}

function Pg(e, t, n) {
    if (n & 8 || e !== void 0) return e;
    us(t, "NodeInjector")
}

function kg(e, t, n, r) {
    if (n & 8 && r === void 0 && (r = null), (n & 3) === 0) {
        let o = e[ot],
            i = Fe(void 0);
        try {
            return o ? o.get(t, r, n & 8) : Al(t, r, n & 8)
        } finally {
            Fe(i)
        }
    }
    return Pg(r, t, n)
}

function Fg(e, t, n, r = 0, o) {
    if (e !== null) {
        if (t[N] & 2048 && !(r & 2)) {
            let s = $C(e, t, n, r, Et);
            if (s !== Et) return s
        }
        let i = Lg(e, t, n, r, Et);
        if (i !== Et) return i
    }
    return kg(t, n, r, o)
}

function Lg(e, t, n, r, o) {
    let i = UC(n);
    if (typeof i == "function") {
        if (!tu(t, e, r)) return r & 1 ? Pg(o, n, r) : kg(t, n, r, o);
        try {
            let s;
            if (s = i(r), s == null && !(r & 8)) us(n);
            else return s
        } finally {
            nu()
        }
    } else if (typeof i == "number") {
        let s = null,
            a = Og(e, t),
            c = Ir,
            l = r & 1 ? t[xe][Ye] : null;
        for ((a === -1 || r & 4) && (c = a === -1 ? zu(e, t) : t[a + 8], c === Ir || !Hp(r, !1) ? a = -1 : (s = t[b], a = Vs(c), t = js(c, t))); a !== -1;) {
            let u = t[b];
            if (Up(i, a, u.data)) {
                let d = jC(a, t, n, s, r, l);
                if (d !== Et) return d
            }
            c = t[a + 8], c !== Ir && Hp(r, t[b].data[a + 8] === l) && Up(i, a, t) ? (s = u, a = Vs(c), t = js(c, t)) : a = -1
        }
    }
    return o
}

function jC(e, t, n, r, o, i) {
    let s = t[b],
        a = s.data[e + 8],
        c = r == null ? Rt(a) && _u : r != s && (a.type & 3) !== 0,
        l = o & 1 && i === a,
        u = BC(a, s, n, c, l);
    return u !== null ? Us(t, s, u, a, o) : Et
}

function BC(e, t, n, r, o) {
    let i = e.providerIndexes,
        s = t.data,
        a = i & 1048575,
        c = e.directiveStart,
        l = e.directiveEnd,
        u = i >> 20,
        d = r ? a : a + u,
        m = o ? a + u : l;
    for (let g = d; g < m; g++) {
        let y = s[g];
        if (g < c && n === y || g >= c && y.type === n) return g
    }
    if (o) {
        let g = s[c];
        if (g && vt(g) && g.type === n) return c
    }
    return null
}

function Us(e, t, n, r, o) {
    let i = e[n],
        s = t.data;
    if (i instanceof Pn) {
        let a = i;
        if (a.resolving) {
            let g = ss(s[n]);
            throw Tl(g)
        }
        let c = Bp(a.canSeeViewProviders);
        a.resolving = !0;
        let l = s[n].type || s[n],
            u, d = a.injectImpl ? Fe(a.injectImpl) : null,
            m = tu(e, r, 0);
        try {
            i = e[n] = a.factory(void 0, o, s, e, r), t.firstCreatePass && n >= r.directiveStart && TC(n, s[n], t)
        } finally {
            d !== null && Fe(d), Bp(c), a.resolving = !1, nu()
        }
    }
    return i
}

function UC(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(wn) ? e[wn] : void 0;
    return typeof t == "number" ? t >= 0 ? t & Rg : HC : t
}

function Up(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> xg)] & r)
}

function Hp(e, t) {
    return !(e & 2) && !(e & 1 && t)
}
var On = class {
    _tNode;
    _lView;
    constructor(t, n) {
        this._tNode = t, this._lView = n
    }
    get(t, n, r) {
        return Fg(this._tNode, this._lView, t, En(r), n)
    }
};

function HC() {
    return new On(ve(), Y())
}

function Jt(e) {
    return Rr(() => {
        let t = e.prototype.constructor,
            n = t[lo] || Iu(t),
            r = Object.prototype,
            o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r;) {
            let i = o[lo] || Iu(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o)
        }
        return i => new i
    })
}

function Iu(e) {
    return El(e) ? () => {
        let t = Iu(me(e));
        return t && t()
    } : Dn(e)
}

function $C(e, t, n, r, o) {
    let i = e,
        s = t;
    for (; i !== null && s !== null && s[N] & 2048 && !An(s);) {
        let a = Lg(i, s, n, r | 2, Et);
        if (a !== Et) return a;
        let c = i.parent;
        if (!c) {
            let l = s[jl];
            if (l) {
                let u = l.get(n, Et, r);
                if (u !== Et) return u
            }
            c = Vg(s), s = s[In]
        }
        i = c
    }
    return o
}

function Vg(e) {
    let t = e[b],
        n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[Ye] : null
}

function Ro(e) {
    return VC(ve(), e)
}

function zC() {
    return na(ve(), Y())
}

function na(e, t) {
    return new Ct(Qe(e, t))
}
var Ct = (() => {
    class e {
        nativeElement;
        constructor(n) {
            this.nativeElement = n
        }
        static __NG_ELEMENT_ID__ = zC
    }
    return e
})();
var jg = "ngSkipHydration",
    GC = "ngskiphydration";

function Bg(e) {
    let t = e.mergedAttrs;
    if (t === null) return !1;
    for (let n = 0; n < t.length; n += 2) {
        let r = t[n];
        if (typeof r == "number") return !1;
        if (typeof r == "string" && r.toLowerCase() === GC) return !0
    }
    return !1
}

function Ug(e) {
    return e.hasAttribute(jg)
}

function Hs(e) {
    return (e.flags & 128) === 128
}

function Hg(e) {
    if (Hs(e)) return !0;
    let t = e.parent;
    for (; t;) {
        if (Hs(e) || Bg(t)) return !0;
        t = t.parent
    }
    return !1
}
var Gu = (function(e) {
        return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e
    })(Gu || {}),
    $g = new Map,
    WC = 0;

function qC() {
    return WC++
}

function ZC(e) {
    $g.set(e[vo], e)
}

function bu(e) {
    $g.delete(e[vo])
}
var $p = "__ngContext__";

function Tr(e, t) {
    Be(t) ? (e[$p] = t[vo], ZC(t)) : e[$p] = t
}

function zg(e) {
    return Wg(e[vr])
}

function Gg(e) {
    return Wg(e[Ze])
}

function Wg(e) {
    for (; e !== null && !Ue(e);) e = e[Ze];
    return e
}
var Su;

function Wu(e) {
    Su = e
}

function xo() {
    if (Su !== void 0) return Su;
    if (typeof document < "u") return document;
    throw new C(210, !1)
}
var _t = new D("", {
        providedIn: "root",
        factory: () => YC
    }),
    YC = "ng",
    ra = new D(""),
    Xt = new D("", {
        providedIn: "platform",
        factory: () => "unknown"
    });
var oa = new D("", {
    providedIn: "root",
    factory: () => xo().body ? .querySelector("[ngCspNonce]") ? .getAttribute("ngCspNonce") || null
});

function QC() {
    let e = new Vn;
    return e.store = KC(xo(), v(_t)), e
}
var Vn = (() => {
    class e {
        static\ u0275prov = w({
            token: e,
            providedIn: "root",
            factory: QC
        });
        store = {};
        onSerializeCallbacks = {};
        get(n, r) {
            return this.store[n] !== void 0 ? this.store[n] : r
        }
        set(n, r) {
            this.store[n] = r
        }
        remove(n) {
            delete this.store[n]
        }
        hasKey(n) {
            return this.store.hasOwnProperty(n)
        }
        get isEmpty() {
            return Object.keys(this.store).length === 0
        }
        onSerialize(n, r) {
            this.onSerializeCallbacks[n] = r
        }
        toJson() {
            for (let n in this.onSerializeCallbacks)
                if (this.onSerializeCallbacks.hasOwnProperty(n)) try {
                    this.store[n] = this.onSerializeCallbacks[n]()
                } catch (r) {
                    console.warn("Exception in onSerialize callback: ", r)
                }
            return JSON.stringify(this.store).replace(/</g, "\\u003C")
        }
    }
    return e
})();

function KC(e, t) {
    let n = e.getElementById(t + "-state");
    if (n ? .textContent) try {
        return JSON.parse(n.textContent)
    } catch (r) {
        console.warn("Exception while restoring TransferState for app " + t, r)
    }
    return {}
}
var qg = "h",
    Zg = "b",
    JC = "f",
    XC = "n",
    Yg = "e",
    Qg = "t",
    ia = "c",
    qu = "x",
    So = "r",
    Kg = "i",
    Jg = "n",
    Zu = "d";
var Xg = "di",
    em = "s",
    tm = "p";
var Oo = new D(""),
    nm = !1,
    Yu = new D("", {
        providedIn: "root",
        factory: () => nm
    });
var Qu = new D(""),
    rm = !1,
    om = new D(""),
    Ku = new D("", {
        providedIn: "root",
        factory: () => new Map
    });
var Po = "ngb";
var im = (e, t, n) => {
        let r = e,
            o = r.__jsaction_fns ? ? new Map,
            i = o.get(t) ? ? [];
        i.push(n), o.set(t, i), r.__jsaction_fns = o
    },
    sm = (e, t) => {
        let n = e,
            r = n.getAttribute(Po) ? ? "",
            o = t.get(r) ? ? new Set;
        o.has(n) || o.add(n), t.set(r, o)
    };
var am = e => {
        e.removeAttribute(Ts.JSACTION), e.removeAttribute(Po), e.__jsaction_fns = void 0
    },
    cm = new D("", {
        providedIn: "root",
        factory: () => ({})
    });

function Ju(e, t) {
    let n = t ? .__jsaction_fns ? .get(e.type);
    if (!(!n || !t ? .isConnected))
        for (let r of n) r(e)
}
var Mu = new Map;

function lm(e, t) {
    return Mu.set(e, t), () => Mu.delete(e)
}
var zp = !1,
    um = (e, t, n, r) => {};

function e_(e, t, n, r) {
    um(e, t, n, r)
}

function dm() {
    zp || (um = (e, t, n, r) => {
        let o = e[ot].get(_t);
        Mu.get(o) ? .(t, n, r)
    }, zp = !0)
}
var sa = new D("");

function aa(e) {
    return (e.flags & 32) === 32
}
var t_ = "__nghData__",
    Xu = t_,
    n_ = "__nghDeferData__",
    fm = n_;
var Ps = "ngh",
    hm = "nghm",
    pm = () => null;

function r_(e, t, n = !1) {
    let r = e.getAttribute(Ps);
    if (r == null) return null;
    let [o, i] = r.split("|");
    if (r = n ? i : o, !r) return null;
    let s = i ? `|${i}` : "",
        a = n ? o : s,
        c = {};
    if (r !== "") {
        let u = t.get(Vn, null, {
            optional: !0
        });
        u !== null && (c = u.get(Xu, [])[Number(r)])
    }
    let l = {
        data: c,
        firstChild: e.firstChild ? ? null
    };
    return n && (l.firstChild = e, ca(l, 0, e.nextSibling)), a ? e.setAttribute(Ps, a) : e.removeAttribute(Ps), l
}

function gm() {
    pm = r_
}

function mm(e, t, n = !1) {
    return pm(e, t, n)
}

function vm(e) {
    let t = e._lView;
    return t[b].type === 2 ? null : (An(t) && (t = t[Q]), t)
}

function o_(e) {
    return e.textContent ? .replace(/\s/gm, "")
}

function i_(e) {
    let t = xo(),
        n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
            acceptNode(i) {
                let s = o_(i);
                return s === "ngetn" || s === "ngtns" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
            }
        }),
        r, o = [];
    for (; r = n.nextNode();) o.push(r);
    for (let i of o) i.textContent === "ngetn" ? i.replaceWith(t.createTextNode("")) : i.remove()
}

function ca(e, t, n) {
    e.segmentHeads ? ? = {}, e.segmentHeads[t] = n
}

function Tu(e, t) {
    return e.segmentHeads ? .[t] ? ? null
}

function ym(e) {
    return e.get(om, !1, {
        optional: !0
    })
}

function s_(e, t) {
    let n = e.data,
        r = n[Yg] ? .[t] ? ? null;
    return r === null && n[ia] ? .[t] && (r = ed(e, t)), r
}

function Em(e, t) {
    return e.data[ia] ? .[t] ? ? null
}

function ed(e, t) {
    let n = Em(e, t) ? ? [],
        r = 0;
    for (let o of n) r += o[So] * (o[qu] ? ? 1);
    return r
}

function a_(e) {
    if (typeof e.disconnectedNodes > "u") {
        let t = e.data[Zu];
        e.disconnectedNodes = t ? new Set(t) : null
    }
    return e.disconnectedNodes
}

function Dm(e, t) {
    if (typeof e.disconnectedNodes > "u") {
        let n = e.data[Zu];
        e.disconnectedNodes = n ? new Set(n) : null
    }
    return !!a_(e) ? .has(t)
}

function la(e, t) {
    let n = e[Ve];
    return n !== null && !Wl() && !aa(t) && !Dm(n, t.index - Q)
}

function c_(e, t) {
    let n = t.get(sa),
        o = t.get(Vn).get(fm, {}),
        i = !1,
        s = e,
        a = null,
        c = [];
    for (; !i && s;) {
        i = n.has(s);
        let l = n.hydrating.get(s);
        if (a === null && l != null) {
            a = l.promise;
            break
        }
        c.unshift(s), s = o[s][tm]
    }
    return {
        parentBlockPromise: a,
        hydrationQueue: c
    }
}

function du(e) {
    return !!e && e.nodeType === Node.COMMENT_NODE && e.textContent ? .trim() === hm
}

function Gp(e) {
    for (; e && e.nodeType === Node.TEXT_NODE;) e = e.previousSibling;
    return e
}

function Cm(e) {
    for (let r of e.body.childNodes)
        if (du(r)) return;
    let t = Gp(e.body.previousSibling);
    if (du(t)) return;
    let n = Gp(e.head.lastChild);
    if (!du(n)) throw new C(-507, !1)
}

function _m(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = O(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o],
                    s = n[o + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    eu(i), a.contentQueries(2, t[s], s)
                }
            }
        } finally {
            O(r)
        }
    }
}

function Au(e, t, n) {
    eu(0);
    let r = O(null);
    try {
        t(e, n)
    } finally {
        O(r)
    }
}

function td(e, t, n) {
    if (Bl(t)) {
        let r = O(null);
        try {
            let o = t.directiveStart,
                i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let c = n[s];
                    a.contentQueries(1, c, s)
                }
            }
        } finally {
            O(r)
        }
    }
}
var kt = (function(e) {
    return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e
})(kt || {});
var Ns;

function l_() {
    if (Ns === void 0 && (Ns = null, pr.trustedTypes)) try {
        Ns = pr.trustedTypes.createPolicy("angular#unsafe-bypass", {
            createHTML: e => e,
            createScript: e => e,
            createScriptURL: e => e
        })
    } catch {}
    return Ns
}

function Wp(e) {
    return l_() ? .createScriptURL(e) || e
}
var $s = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) {
        this.changingThisBreaksApplicationSecurity = t
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${cs})`
    }
};

function ko(e) {
    return e instanceof $s ? e.changingThisBreaksApplicationSecurity : e
}

function ua(e, t) {
    let n = wm(e);
    if (n != null && n !== t) {
        if (n === "ResourceURL" && t === "URL") return !0;
        throw new Error(`Required a safe ${t}, got a ${n} (see ${cs})`)
    }
    return n === t
}

function wm(e) {
    return e instanceof $s && e.getTypeName() || null
}
var u_ = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;

function nd(e) {
    return e = String(e), e.match(u_) ? e : "unsafe:" + e
}
var Fo = (function(e) {
    return e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL = 5] = "RESOURCE_URL", e
})(Fo || {});

function xr(e) {
    let t = bm();
    return t ? t.sanitize(Fo.URL, e) || "" : ua(e, "URL") ? ko(e) : nd(ho(e))
}

function Im(e) {
    let t = bm();
    if (t) return Wp(t.sanitize(Fo.RESOURCE_URL, e) || "");
    if (ua(e, "ResourceURL")) return Wp(ko(e));
    throw new C(904, !1)
}

function d_(e, t) {
    return t === "src" && (e === "embed" || e === "frame" || e === "iframe" || e === "media" || e === "script") || t === "href" && (e === "base" || e === "link") ? Im : xr
}

function rd(e, t, n) {
    return d_(t, n)(e)
}

function bm() {
    let e = Y();
    return e && e[gt].sanitizer
}
var f_ = /^>|^->|<!--|-->|--!>|<!-$/g,
    h_ = /(<|>)/g,
    p_ = "\u200B$1\u200B";

function g_(e) {
    return e.replace(f_, t => t.replace(h_, p_))
}

function od(e) {
    return e.ownerDocument.defaultView
}

function da(e) {
    return e.ownerDocument
}

function Sm(e) {
    return e.ownerDocument.body
}

function Mm(e) {
    return e instanceof Function ? e() : e
}

function m_(e, t, n) {
    let r = e.length;
    for (;;) {
        let o = e.indexOf(t, n);
        if (o === -1) return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o
        }
        n = o + 1
    }
}
var Tm = "ng-template";

function v_(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && m_(t[o + 1].toLowerCase(), n, 0) !== -1) return !0
    } else if (id(e)) return !1;
    if (o = t.indexOf(1, o), o > -1) {
        let i;
        for (; ++o < t.length && typeof(i = t[o]) == "string";)
            if (i.toLowerCase() === n) return !0
    }
    return !1
}

function id(e) {
    return e.type === 4 && e.value !== Tm
}

function y_(e, t, n) {
    let r = e.type === 4 && !n ? Tm : e.value;
    return t === r
}

function E_(e, t, n) {
    let r = 4,
        o = e.attrs,
        i = o !== null ? __(o) : 0,
        s = !1;
    for (let a = 0; a < t.length; a++) {
        let c = t[a];
        if (typeof c == "number") {
            if (!s && !at(r) && !at(c)) return !1;
            if (s && at(c)) continue;
            s = !1, r = c | r & 1;
            continue
        }
        if (!s)
            if (r & 4) {
                if (r = 2 | r & 1, c !== "" && !y_(e, c, n) || c === "" && t.length === 1) {
                    if (at(r)) return !1;
                    s = !0
                }
            } else if (r & 8) {
            if (o === null || !v_(e, o, c, n)) {
                if (at(r)) return !1;
                s = !0
            }
        } else {
            let l = t[++a],
                u = D_(c, o, id(e), n);
            if (u === -1) {
                if (at(r)) return !1;
                s = !0;
                continue
            }
            if (l !== "") {
                let d;
                if (u > i ? d = "" : d = o[u + 1].toLowerCase(), r & 2 && l !== d) {
                    if (at(r)) return !1;
                    s = !0
                }
            }
        }
    }
    return at(r) || s
}

function at(e) {
    return (e & 1) === 0
}

function D_(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length;) {
            let s = t[o];
            if (s === e) return o;
            if (s === 3 || s === 6) i = !0;
            else if (s === 1 || s === 2) {
                let a = t[++o];
                for (; typeof a == "string";) a = t[++o];
                continue
            } else {
                if (s === 4) break;
                if (s === 0) {
                    o += 4;
                    continue
                }
            }
            o += i ? 1 : 2
        }
        return -1
    } else return w_(t, e)
}

function C_(e, t, n = !1) {
    for (let r = 0; r < t.length; r++)
        if (E_(e, t[r], n)) return !0;
    return !1
}

function __(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (Ag(n)) return t
    }
    return e.length
}

function w_(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length;) {
            let r = e[n];
            if (typeof r == "number") return -1;
            if (r === t) return n;
            n++
        }
    return -1
}

function qp(e, t) {
    return e ? ":not(" + t.trim() + ")" : t
}

function I_(e) {
    let t = e[0],
        n = 1,
        r = 2,
        o = "",
        i = !1;
    for (; n < e.length;) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else r & 8 ? o += "." + s : r & 4 && (o += " " + s);
        else o !== "" && !at(s) && (t += qp(i, o), o = ""), r = s, i = i || !at(r);
        n++
    }
    return o !== "" && (t += qp(i, o)), t
}

function b_(e) {
    return e.map(I_).join(",")
}

function S_(e) {
    let t = [],
        n = [],
        r = 1,
        o = 2;
    for (; r < e.length;) {
        let i = e[r];
        if (typeof i == "string") o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!at(o)) break;
            o = i
        }
        r++
    }
    return n.length && t.push(1, ...n), t
}
var en = {};

function Am(e, t) {
    return e.createText(t)
}

function M_(e, t, n) {
    e.setValue(t, n)
}

function Nm(e, t) {
    return e.createComment(g_(t))
}

function sd(e, t, n) {
    return e.createElement(t, n)
}

function zs(e, t, n, r, o) {
    e.insertBefore(t, n, r, o)
}

function Rm(e, t, n) {
    e.appendChild(t, n)
}

function Zp(e, t, n, r, o) {
    r !== null ? zs(e, t, n, r, o) : Rm(e, t, n)
}

function ad(e, t, n) {
    e.removeChild(null, t, n)
}

function xm(e) {
    e.textContent = ""
}

function T_(e, t, n) {
    e.setAttribute(t, "style", n)
}

function A_(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
}

function Om(e, t, n) {
    let {
        mergedAttrs: r,
        classes: o,
        styles: i
    } = n;
    r !== null && xC(e, t, r), o !== null && A_(e, t, o), i !== null && T_(e, t, i)
}

function cd(e, t, n, r, o, i, s, a, c, l, u) {
    let d = Q + r,
        m = d + o,
        g = N_(d, m),
        y = typeof l == "function" ? l() : l;
    return g[b] = {
        type: e,
        blueprint: g,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: g.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: m,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: c,
        consts: y,
        incompleteFirstPass: !1,
        ssrId: u
    }
}

function N_(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : en);
    return n
}

function R_(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = cd(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
}

function ld(e, t, n, r, o, i, s, a, c, l, u) {
    let d = t.blueprint.slice();
    return d[we] = o, d[N] = r | 4 | 128 | 8 | 64 | 1024, (l !== null || e && e[N] & 2048) && (d[N] |= 2048), Hl(d), d[oe] = d[In] = e, d[Ce] = n, d[gt] = s || e && e[gt], d[Z] = a || e && e[Z], d[ot] = c || e && e[ot] || null, d[Ye] = i, d[vo] = qC(), d[Ve] = u, d[jl] = l, d[xe] = t.type == 2 ? e[xe] : d, d
}

function x_(e, t, n) {
    let r = Qe(t, e),
        o = R_(n),
        i = e[gt].rendererFactory,
        s = ud(e, ld(e, o, null, Pm(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s
}

function Pm(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64), t
}

function km(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
    return o
}

function ud(e, t) {
    return e[vr] ? e[Vl][Ze] = t : e[vr] = t, e[Vl] = t, t
}

function q(e = 1) {
    Fm(Je(), Y(), Rn() + e, !1)
}

function Fm(e, t, n, r) {
    if (!r)
        if ((t[N] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && xs(t, i, n)
        } else {
            let i = e.preOrderHooks;
            i !== null && Os(t, i, 0, n)
        }
    Qt(n)
}
var fa = (function(e) {
    return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e
})(fa || {});

function Nu(e, t, n, r) {
    let o = O(null);
    try {
        let [i, s, a] = e.inputs[n], c = null;
        (s & fa.SignalBased) !== 0 && (c = t[i][_e]), c !== null && c.transformFn !== void 0 ? r = c.transformFn(r) : a !== null && (r = a.call(t, r)), e.setInput !== null ? e.setInput(t, c, r, n, i) : wg(t, c, i, r)
    } finally {
        O(o)
    }
}
var Dt = (function(e) {
        return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e
    })(Dt || {}),
    O_;

function dd(e, t) {
    return O_(e, t)
}

function wr(e, t, n, r, o) {
    if (r != null) {
        let i, s = !1;
        Ue(r) ? i = r : Be(r) && (s = !0, r = r[we]);
        let a = He(r);
        e === 0 && n !== null ? o == null ? Rm(t, n, a) : zs(t, n, a, o || null, !0) : e === 1 && n !== null ? zs(t, n, a, o || null, !0) : e === 2 ? ad(t, a, s) : e === 3 && t.destroyNode(a), i != null && G_(t, e, i, n, o)
    }
}

function P_(e, t) {
    Lm(e, t), t[we] = null, t[Ye] = null
}

function k_(e, t, n, r, o, i) {
    r[we] = o, r[Ye] = t, ha(e, r, n, 1, o, i)
}

function Lm(e, t) {
    t[gt].changeDetectionScheduler ? .notify(9), ha(e, t, t[Z], 2, null, null)
}

function F_(e) {
    let t = e[vr];
    if (!t) return fu(e[b], e);
    for (; t;) {
        let n = null;
        if (Be(t)) n = t[vr];
        else {
            let r = t[Ie];
            r && (n = r)
        }
        if (!n) {
            for (; t && !t[Ze] && t !== e;) Be(t) && fu(t[b], t), t = t[oe];
            t === null && (t = e), Be(t) && fu(t[b], t), n = t && t[Ze]
        }
        t = n
    }
}

function fd(e, t) {
    let n = e[Do],
        r = n.indexOf(t);
    n.splice(r, 1)
}

function hd(e, t) {
    if (Yt(t)) return;
    let n = t[Z];
    n.destroyNode && ha(e, t, n, 3, null, null), F_(t)
}

function fu(e, t) {
    if (Yt(t)) return;
    let n = O(null);
    try {
        t[N] &= -129, t[N] |= 256, t[je] && no(t[je]), V_(e, t), L_(e, t), t[b].type === 1 && t[Z].destroy();
        let r = t[bn];
        if (r !== null && Ue(t[oe])) {
            r !== t[oe] && fd(r, t);
            let o = t[Mn];
            o !== null && o.detachView(e)
        }
        bu(t)
    } finally {
        O(n)
    }
}

function L_(e, t) {
    let n = e.cleanup,
        r = t[mr];
    if (n !== null)
        for (let s = 0; s < n.length - 1; s += 2)
            if (typeof n[s] == "string") {
                let a = n[s + 3];
                a >= 0 ? r[a]() : r[-a].unsubscribe(), s += 2
            } else {
                let a = r[n[s + 1]];
                n[s].call(a)
            }
    r !== null && (t[mr] = null);
    let o = t[Tt];
    if (o !== null) {
        t[Tt] = null;
        for (let s = 0; s < o.length; s++) {
            let a = o[s];
            a()
        }
    }
    let i = t[yo];
    if (i !== null) {
        t[yo] = null;
        for (let s of i) s.destroy()
    }
}

function V_(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof Pn)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let a = o[i[s]],
                            c = i[s + 1];
                        z(4, a, c);
                        try {
                            c.call(a)
                        } finally {
                            z(5, a, c)
                        }
                    } else {
                        z(4, o, i);
                        try {
                            i.call(o)
                        } finally {
                            z(5, o, i)
                        }
                    }
            }
        }
}

function j_(e, t, n) {
    return B_(e, t.parent, n)
}

function B_(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168;) t = r, r = t.parent;
    if (r === null) return n[we];
    if (Rt(r)) {
        let {
            encapsulation: o
        } = e.data[r.directiveStart + r.componentOffset];
        if (o === kt.None || o === kt.Emulated) return null
    }
    return Qe(r, n)
}

function U_(e, t, n) {
    return $_(e, t, n)
}

function H_(e, t, n) {
    return e.type & 40 ? Qe(e, n) : null
}
var $_ = H_,
    Yp;

function pd(e, t, n, r) {
    let o = j_(e, r, t),
        i = t[Z],
        s = r.parent || t[Ye],
        a = U_(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let c = 0; c < n.length; c++) Zp(i, o, n[c], a, !1);
        else Zp(i, o, n, a, !1);
    Yp !== void 0 && Yp(i, r, t, n, o)
}

function Io(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3) return Qe(t, e);
        if (n & 4) return Ru(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null) return Io(e, r); {
                let o = e[t.index];
                return Ue(o) ? Ru(-1, o) : He(o)
            }
        } else {
            if (n & 128) return Io(e, t.next);
            if (n & 32) return dd(t, e)() || He(e[t.index]); {
                let r = Vm(e, t);
                if (r !== null) {
                    if (Array.isArray(r)) return r[0];
                    let o = Wt(e[xe]);
                    return Io(o, r)
                } else return Io(e, t.next)
            }
        }
    }
    return null
}

function Vm(e, t) {
    if (t !== null) {
        let r = e[xe][Ye],
            o = t.projection;
        return r.projection[o]
    }
    return null
}

function Ru(e, t) {
    let n = Ie + e + 1;
    if (n < t.length) {
        let r = t[n],
            o = r[b].firstChild;
        if (o !== null) return Io(r, o)
    }
    return t[mt]
}

function gd(e, t, n, r, o, i, s) {
    for (; n != null;) {
        if (n.type === 128) {
            n = n.next;
            continue
        }
        let a = r[n.index],
            c = n.type;
        if (s && t === 0 && (a && Tr(He(a), r), n.flags |= 2), !aa(n))
            if (c & 8) gd(e, t, n.child, r, o, i, !1), wr(t, e, o, a, i);
            else if (c & 32) {
            let l = dd(n, r),
                u;
            for (; u = l();) wr(t, e, o, u, i);
            wr(t, e, o, a, i)
        } else c & 16 ? z_(e, t, r, n, o, i) : wr(t, e, o, a, i);
        n = s ? n.projectionNext : n.next
    }
}

function ha(e, t, n, r, o, i) {
    gd(n, r, e.firstChild, t, o, i, !1)
}

function z_(e, t, n, r, o, i) {
    let s = n[xe],
        c = s[Ye].projection[r.projection];
    if (Array.isArray(c))
        for (let l = 0; l < c.length; l++) {
            let u = c[l];
            wr(t, e, o, u, i)
        } else {
            let l = c,
                u = s[oe];
            Hs(r) && (l.flags |= 128), gd(e, t, l, u, o, i, !0)
        }
}

function G_(e, t, n, r, o) {
    let i = n[mt],
        s = He(n);
    i !== s && wr(t, e, r, i, o);
    for (let a = Ie; a < n.length; a++) {
        let c = n[a];
        ha(c[b], c, e, t, r, i)
    }
}

function W_(e, t, n, r, o) {
    if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
        let i = r.indexOf("-") === -1 ? void 0 : Dt.DashCase;
        o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10), i |= Dt.Important), e.setStyle(n, r, o, i))
    }
}

function jm(e, t, n, r, o) {
    let i = Rn(),
        s = r & 2;
    try {
        Qt(-1), s && t.length > Q && Fm(e, t, Q, !1), z(s ? 2 : 0, o, n), n(r, o)
    } finally {
        Qt(i), z(s ? 3 : 1, o, n)
    }
}

function pa(e, t, n) {
    ew(e, t, n), (n.flags & 64) === 64 && tw(e, t, n)
}

function ga(e, t, n = Qe) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1],
                a = s === -1 ? n(t, e) : e[s];
            e[o++] = a
        }
    }
}

function q_(e, t, n, r) {
    let i = r.get(Yu, nm) || n === kt.ShadowDom,
        s = e.selectRootElement(t, i);
    return Z_(s), s
}

function Z_(e) {
    Bm(e)
}
var Bm = () => null;

function Y_(e) {
    Ug(e) ? xm(e) : i_(e)
}

function Um() {
    Bm = Y_
}

function Q_(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e
}

function K_(e, t, n, r, o, i) {
    let s = t[b];
    if (Dd(e, s, t, n, r)) {
        Rt(e) && X_(t, e.index);
        return
    }
    e.type & 3 && (n = Q_(n)), J_(e, t, n, r, o, i)
}

function J_(e, t, n, r, o, i) {
    if (e.type & 3) {
        let s = Qe(e, t);
        r = i != null ? i(r, e.value || "", n) : r, o.setProperty(s, n, r)
    } else e.type & 12
}

function X_(e, t) {
    let n = Ke(t, e);
    n[N] & 16 || (n[N] |= 64)
}

function ew(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd;
    Rt(n) && x_(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Bs(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
        let a = e.data[s],
            c = Us(t, e, s, n);
        if (Tr(c, t), i !== null && iw(t, s - r, c, a, n, i), vt(a)) {
            let l = Ke(n.index, t);
            l[Ce] = Us(t, e, s, n)
        }
    }
}

function tw(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd,
        i = n.index,
        s = Tp();
    try {
        Qt(i);
        for (let a = r; a < o; a++) {
            let c = e.data[a],
                l = t[a];
            Ds(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && nw(c, l)
        }
    } finally {
        Qt(-1), Ds(s)
    }
}

function nw(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}

function md(e, t) {
    let n = e.directiveRegistry,
        r = null;
    if (n)
        for (let o = 0; o < n.length; o++) {
            let i = n[o];
            C_(t, i.selectors, !1) && (r ? ? = [], vt(i) ? r.unshift(i) : r.push(i))
        }
    return r
}

function rw(e, t, n, r, o, i) {
    let s = Qe(e, t);
    ow(t[Z], s, i, e.value, n, r, o)
}

function ow(e, t, n, r, o, i, s) {
    if (i == null) e.removeAttribute(t, o, n);
    else {
        let a = s == null ? ho(i) : s(i, r || "", o);
        e.setAttribute(t, o, a, n)
    }
}

function iw(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let a = 0; a < s.length; a += 2) {
            let c = s[a],
                l = s[a + 1];
            Nu(r, n, c, l)
        }
}

function vd(e, t, n, r, o) {
    let i = Q + n,
        s = t[b],
        a = o(s, t, e, r, n);
    t[i] = a, Cr(e, !0);
    let c = e.type === 2;
    return c ? (Om(t[Z], a, e), (yp() === 0 || yr(e)) && Tr(a, t), Ep()) : Tr(a, t), ws() && (!c || !aa(e)) && pd(s, t, a, e), e
}

function yd(e) {
    let t = e;
    return Ql() ? _p() : (t = t.parent, Cr(t, !1)), t
}

function Ed(e, t) {
    let n = e[ot];
    if (!n) return;
    n.get(be, null) ? .(t)
}

function Dd(e, t, n, r, o) {
    let i = e.inputs ? .[r],
        s = e.hostDirectiveInputs ? .[r],
        a = !1;
    if (s)
        for (let c = 0; c < s.length; c += 2) {
            let l = s[c],
                u = s[c + 1],
                d = t.data[l];
            Nu(d, n[l], u, o), a = !0
        }
    if (i)
        for (let c of i) {
            let l = n[c],
                u = t.data[c];
            Nu(u, l, r, o), a = !0
        }
    return a
}

function sw(e, t) {
    let n = Ke(t, e),
        r = n[b];
    aw(r, n);
    let o = n[we];
    o !== null && n[Ve] === null && (n[Ve] = mm(o, n[ot])), z(18), Cd(r, n, n[Ce]), z(19, n[Ce])
}

function aw(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
}

function Cd(e, t, n) {
    Cs(t);
    try {
        let r = e.viewQuery;
        r !== null && Au(1, r, n);
        let o = e.template;
        o !== null && jm(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), t[Mn] ? .finishViewCreation(e), e.staticContentQueries && _m(e, t), e.staticViewQueries && Au(2, e.viewQuery, n);
        let i = e.components;
        i !== null && cw(t, i)
    } catch (r) {
        throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), r
    } finally {
        t[N] &= -5, _s()
    }
}

function cw(e, t) {
    for (let n = 0; n < t.length; n++) sw(e, t[n])
}

function Hm(e, t, n, r) {
    let o = O(null);
    try {
        let i = t.tView,
            a = e[N] & 4096 ? 4096 : 16,
            c = ld(e, i, n, a, null, t, null, null, r ? .injector ? ? null, r ? .embeddedViewInjector ? ? null, r ? .dehydratedView ? ? null),
            l = e[t.index];
        c[bn] = l;
        let u = e[Mn];
        return u !== null && (c[Mn] = u.createEmbeddedView(i)), Cd(i, c, n), c
    } finally {
        O(o)
    }
}

function xu(e, t) {
    return !t || t.firstChild === null || Hs(e)
}
var Qp = !1,
    lw = new D("");

function Mo(e, t, n, r, o = !1) {
    for (; n !== null;) {
        if (n.type === 128) {
            n = o ? n.projectionNext : n.next;
            continue
        }
        let i = t[n.index];
        i !== null && r.push(He(i)), Ue(i) && $m(i, r);
        let s = n.type;
        if (s & 8) Mo(e, t, n.child, r);
        else if (s & 32) {
            let a = dd(n, t),
                c;
            for (; c = a();) r.push(c)
        } else if (s & 16) {
            let a = Vm(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
                let c = Wt(t[xe]);
                Mo(c[b], c, a, r, !0)
            }
        }
        n = o ? n.projectionNext : n.next
    }
    return r
}

function $m(e, t) {
    for (let n = Ie; n < e.length; n++) {
        let r = e[n],
            o = r[b].firstChild;
        o !== null && Mo(r[b], r, o, t)
    }
    e[mt] !== e[we] && t.push(e[mt])
}

function zm(e) {
    if (e[Tn] !== null) {
        for (let t of e[Tn]) t.impl.addSequence(t);
        e[Tn].length = 0
    }
}
var Gm = [];

function uw(e) {
    return e[je] ? ? dw(e)
}

function dw(e) {
    let t = Gm.pop() ? ? Object.create(hw);
    return t.lView = e, t
}

function fw(e) {
    e.lView[je] !== e && (e.lView = null, Gm.push(e))
}
var hw = V(E({}, hn), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        Dr(e.lView)
    },
    consumerOnSignalRead() {
        this.lView[je] = this
    }
});

function pw(e) {
    let t = e[je] ? ? Object.create(gw);
    return t.lView = e, t
}
var gw = V(E({}, hn), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        let t = Wt(e.lView);
        for (; t && !Wm(t[b]);) t = Wt(t);
        t && $l(t)
    },
    consumerOnSignalRead() {
        this.lView[je] = this
    }
});

function Wm(e) {
    return e.type !== 2
}

function qm(e) {
    if (e[yo] === null) return;
    let t = !0;
    for (; t;) {
        let n = !1;
        for (let r of e[yo]) r.dirty && (n = !0, r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
        t = n && !!(e[N] & 8192)
    }
}
var mw = 100;

function _d(e, t = 0) {
    let r = e[gt].rendererFactory,
        o = !1;
    o || r.begin ? .();
    try {
        vw(e, t)
    } finally {
        o || r.end ? .()
    }
}

function vw(e, t) {
    let n = Jl();
    try {
        Xl(!0), Ou(e, t);
        let r = 0;
        for (; Co(e);) {
            if (r === mw) throw new C(103, !1);
            r++, Ou(e, 1)
        }
    } finally {
        Xl(n)
    }
}

function Zm(e, t) {
    Kl(t ? _o.Exhaustive : _o.OnlyDirtyViews);
    try {
        _d(e)
    } finally {
        Kl(_o.Off)
    }
}

function yw(e, t, n, r) {
    if (Yt(t)) return;
    let o = t[N],
        i = !1,
        s = !1;
    Cs(t);
    let a = !0,
        c = null,
        l = null;
    i || (Wm(e) ? (l = uw(t), c = pn(l)) : Ai() === null ? (a = !1, l = pw(t), c = pn(l)) : t[je] && (no(t[je]), t[je] = null));
    try {
        Hl(t), Ip(e.bindingStartIndex), n !== null && jm(e, t, n, 2, r);
        let u = (o & 3) === 3;
        if (!i)
            if (u) {
                let g = e.preOrderCheckHooks;
                g !== null && xs(t, g, null)
            } else {
                let g = e.preOrderHooks;
                g !== null && Os(t, g, 0, null), lu(t, 0)
            }
        if (s || Ew(t), qm(t), Ym(t, 0), e.contentQueries !== null && _m(e, t), !i)
            if (u) {
                let g = e.contentCheckHooks;
                g !== null && xs(t, g)
            } else {
                let g = e.contentHooks;
                g !== null && Os(t, g, 1), lu(t, 1)
            }
        Cw(e, t);
        let d = e.components;
        d !== null && Km(t, d, 0);
        let m = e.viewQuery;
        if (m !== null && Au(2, m, r), !i)
            if (u) {
                let g = e.viewCheckHooks;
                g !== null && xs(t, g)
            } else {
                let g = e.viewHooks;
                g !== null && Os(t, g, 2), lu(t, 2)
            }
        if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[gs]) {
            for (let g of t[gs]) g();
            t[gs] = null
        }
        i || (zm(t), t[N] &= -73)
    } catch (u) {
        throw i || Dr(t), u
    } finally {
        l !== null && (Xn(l, c), a && fw(l)), _s()
    }
}

function Ym(e, t) {
    for (let n = zg(e); n !== null; n = Gg(n))
        for (let r = Ie; r < n.length; r++) {
            let o = n[r];
            Qm(o, t)
        }
}

function Ew(e) {
    for (let t = zg(e); t !== null; t = Gg(t)) {
        if (!(t[N] & 2)) continue;
        let n = t[Do];
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            $l(o)
        }
    }
}

function Dw(e, t, n) {
    z(18);
    let r = Ke(t, e);
    Qm(r, n), z(19, r[Ce])
}

function Qm(e, t) {
    ms(e) && Ou(e, t)
}

function Ou(e, t) {
    let r = e[b],
        o = e[N],
        i = e[je],
        s = !!(t === 0 && o & 16);
    if (s || = !!(o & 64 && t === 0), s || = !!(o & 1024), s || = !!(i ? .dirty && to(i)), s || = !1, i && (i.dirty = !1), e[N] &= -9217, s) yw(r, e, r.template, e[Ce]);
    else if (o & 8192) {
        let a = O(null);
        try {
            qm(e), Ym(e, 1);
            let c = r.components;
            c !== null && Km(e, c, 1), zm(e)
        } finally {
            O(a)
        }
    }
}

function Km(e, t, n) {
    for (let r = 0; r < t.length; r++) Dw(e, t[r], n)
}

function Cw(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null) try {
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            if (o < 0) Qt(~o);
            else {
                let i = o,
                    s = n[++r],
                    a = n[++r];
                Mp(s, i);
                let c = t[i];
                z(24, c), a(2, c), z(25, c)
            }
        }
    } finally {
        Qt(-1)
    }
}

function ma(e, t) {
    let n = Jl() ? 64 : 1088;
    for (e[gt].changeDetectionScheduler ? .notify(t); e;) {
        e[N] |= n;
        let r = Wt(e);
        if (An(e) && !r) return e;
        e = r
    }
    return null
}

function Jm(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null]
}

function Xm(e, t, n, r = !0) {
    let o = t[b];
    if (ww(o, t, e, n), r) {
        let s = Ru(n, e),
            a = t[Z],
            c = a.parentNode(e[mt]);
        c !== null && k_(o, e[Ye], a, t, c, s)
    }
    let i = t[Ve];
    i !== null && i.firstChild !== null && (i.firstChild = null)
}

function _w(e, t) {
    let n = Gs(e, t);
    return n !== void 0 && hd(n[b], n), n
}

function Gs(e, t) {
    if (e.length <= Ie) return;
    let n = Ie + t,
        r = e[n];
    if (r) {
        let o = r[bn];
        o !== null && o !== e && fd(o, r), t > 0 && (e[n - 1][Ze] = r[Ze]);
        let i = po(e, Ie + t);
        P_(r[b], r);
        let s = i[Mn];
        s !== null && s.detachView(i[b]), r[oe] = null, r[Ze] = null, r[N] &= -129
    }
    return r
}

function ww(e, t, n, r) {
    let o = Ie + r,
        i = n.length;
    r > 0 && (n[o - 1][Ze] = t), r < i - Ie ? (t[Ze] = n[o], Rl(n, Ie + r, t)) : (n.push(t), t[Ze] = null), t[oe] = n;
    let s = t[bn];
    s !== null && n !== s && ev(s, t);
    let a = t[Mn];
    a !== null && a.insertView(e), vs(t), t[N] |= 128
}

function ev(e, t) {
    let n = e[Do],
        r = t[oe];
    if (Be(r)) e[N] |= 2;
    else {
        let o = r[oe][xe];
        t[xe] !== o && (e[N] |= 2)
    }
    n === null ? e[Do] = [t] : n.push(t)
}
var Kt = class {
    _lView;
    _cdRefInjectingView;
    _appRef = null;
    _attachedToViewContainer = !1;
    exhaustive;
    get rootNodes() {
        let t = this._lView,
            n = t[b];
        return Mo(n, t, n.firstChild, [])
    }
    constructor(t, n) {
        this._lView = t, this._cdRefInjectingView = n
    }
    get context() {
        return this._lView[Ce]
    }
    set context(t) {
        this._lView[Ce] = t
    }
    get destroyed() {
        return Yt(this._lView)
    }
    destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let t = this._lView[oe];
            if (Ue(t)) {
                let n = t[Eo],
                    r = n ? n.indexOf(this) : -1;
                r > -1 && (Gs(t, r), po(n, r))
            }
            this._attachedToViewContainer = !1
        }
        hd(this._lView[b], this._lView)
    }
    onDestroy(t) {
        zl(this._lView, t)
    }
    markForCheck() {
        ma(this._cdRefInjectingView || this._lView, 4)
    }
    detach() {
        this._lView[N] &= -129
    }
    reattach() {
        vs(this._lView), this._lView[N] |= 128
    }
    detectChanges() {
        this._lView[N] |= 1024, _d(this._lView)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
        if (this._appRef) throw new C(902, !1);
        this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
        this._appRef = null;
        let t = An(this._lView),
            n = this._lView[bn];
        n !== null && !t && fd(n, this._lView), Lm(this._lView[b], this._lView)
    }
    attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new C(902, !1);
        this._appRef = t;
        let n = An(this._lView),
            r = this._lView[bn];
        r !== null && !n && ev(r, this._lView), vs(this._lView)
    }
};
var Lo = (() => {
    class e {
        _declarationLView;
        _declarationTContainer;
        elementRef;
        static __NG_ELEMENT_ID__ = Iw;
        constructor(n, r, o) {
            this._declarationLView = n, this._declarationTContainer = r, this.elementRef = o
        }
        get ssrId() {
            return this._declarationTContainer.tView ? .ssrId || null
        }
        createEmbeddedView(n, r) {
            return this.createEmbeddedViewImpl(n, r)
        }
        createEmbeddedViewImpl(n, r, o) {
            let i = Hm(this._declarationLView, this._declarationTContainer, n, {
                embeddedViewInjector: r,
                dehydratedView: o
            });
            return new Kt(i)
        }
    }
    return e
})();

function Iw() {
    return bw(ve(), Y())
}

function bw(e, t) {
    return e.type & 4 ? new Lo(t, e, na(e, t)) : null
}

function va(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) i = Sw(e, t, n, r, o), Sp() && (i.flags |= 32);
    else if (i.type & 64) {
        i.type = n, i.value = r, i.attrs = o;
        let s = Cp();
        i.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return Cr(i, !0), i
}

function Sw(e, t, n, r, o) {
    let i = Yl(),
        s = Ql(),
        a = s ? i : i && i.parent,
        c = e.data[t] = Tw(e, a, n, t, r, o);
    return Mw(e, c, i, s), c
}

function Mw(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t), n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n))
}

function Tw(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1,
        a = 0;
    return Wl() && (a |= 128), {
        type: n,
        index: r,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: o,
        attrs: i,
        mergedAttrs: null,
        localNames: null,
        initialInputs: null,
        inputs: null,
        hostDirectiveInputs: null,
        outputs: null,
        hostDirectiveOutputs: null,
        directiveToIndex: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: t,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}
var Aw = new RegExp(`^(\\d+)*(${Zg}|${qg})*(.*)`);

function Nw(e) {
    let t = e.match(Aw),
        [n, r, o, i] = t,
        s = r ? parseInt(r, 10) : o,
        a = [];
    for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
        let d = parseInt(u, 10) || 1;
        a.push(l, d)
    }
    return [s, ...a]
}

function Rw(e) {
    return !e.prev && e.parent ? .type === 8
}

function hu(e) {
    return e.index - Q
}

function xw(e, t) {
    let n = e.i18nNodes;
    if (n) return n.get(t)
}

function ya(e, t, n, r) {
    let o = hu(r),
        i = xw(e, o);
    if (i === void 0) {
        let s = e.data[Jg];
        if (s ? .[o]) i = Pw(s[o], n);
        else if (t.firstChild === r) i = e.firstChild;
        else {
            let a = r.prev === null,
                c = r.prev ? ? r.parent;
            if (Rw(r)) {
                let l = hu(r.parent);
                i = Tu(e, l)
            } else {
                let l = Qe(c, n);
                if (a) i = l.firstChild;
                else {
                    let u = hu(c),
                        d = Tu(e, u);
                    if (c.type === 2 && d) {
                        let g = ed(e, u) + 1;
                        i = Ea(g, d)
                    } else i = l.nextSibling
                }
            }
        }
    }
    return i
}

function Ea(e, t) {
    let n = t;
    for (let r = 0; r < e; r++) n = n.nextSibling;
    return n
}

function Ow(e, t) {
    let n = e;
    for (let r = 0; r < t.length; r += 2) {
        let o = t[r],
            i = t[r + 1];
        for (let s = 0; s < i; s++) switch (o) {
            case JC:
                n = n.firstChild;
                break;
            case XC:
                n = n.nextSibling;
                break
        }
    }
    return n
}

function Pw(e, t) {
    let [n, ...r] = Nw(e), o;
    if (n === qg) o = t[xe][we];
    else if (n === Zg) o = Sm(t[xe][we]);
    else {
        let i = Number(n);
        o = He(t[i + Q])
    }
    return Ow(o, r)
}
var kw = !1;

function tv(e) {
    kw = e
}

function Fw(e) {
    let t = e[Ve];
    if (t) {
        let {
            i18nNodes: n,
            dehydratedIcuData: r
        } = t;
        if (n && r) {
            let o = e[Z];
            for (let i of r.values()) Lw(o, n, i)
        }
        t.i18nNodes = void 0, t.dehydratedIcuData = void 0
    }
}

function Lw(e, t, n) {
    for (let r of n.node.cases[n.case]) {
        let o = t.get(r.index - Q);
        o && ad(e, o, !1)
    }
}

function wd(e) {
    let t = e[it] ? ? [],
        r = e[oe][Z],
        o = [];
    for (let i of t) i.data[Xg] !== void 0 ? o.push(i) : nv(i, r);
    e[it] = o
}

function Vw(e) {
    let {
        lContainer: t
    } = e, n = t[it];
    if (n === null) return;
    let o = t[oe][Z];
    for (let i of n) nv(i, o)
}

function nv(e, t) {
    let n = 0,
        r = e.firstChild;
    if (r) {
        let o = e.data[So];
        for (; n < o;) {
            let i = r.nextSibling;
            ad(t, r, !1), r = i, n++
        }
    }
}

function Da(e) {
    wd(e);
    let t = e[we];
    Be(t) && Ws(t);
    for (let n = Ie; n < e.length; n++) Ws(e[n])
}

function Ws(e) {
    Fw(e);
    let t = e[b];
    for (let n = Q; n < t.bindingStartIndex; n++)
        if (Ue(e[n])) {
            let r = e[n];
            Da(r)
        } else Be(e[n]) && Ws(e[n])
}

function Id(e) {
    let t = e._views;
    for (let n of t) {
        let r = vm(n);
        r !== null && r[we] !== null && (Be(r) ? Ws(r) : Da(r))
    }
}

function jw(e, t, n, r) {
    e !== null && (n.cleanup(t), Da(e.lContainer), Id(r))
}

function Bw(e, t) {
    let n = [];
    for (let r of t)
        for (let o = 0; o < (r[qu] ? ? 1); o++) {
            let i = {
                data: r,
                firstChild: null
            };
            r[So] > 0 && (i.firstChild = e, e = Ea(r[So], e)), n.push(i)
        }
    return [e, n]
}
var rv = () => null,
    Uw = () => null;

function ov() {
    rv = Hw, Uw = $w
}

function Hw(e, t) {
    return iv(e, t) ? e[it].shift() : (wd(e), null)
}

function Pu(e, t) {
    return rv(e, t)
}

function $w(e, t, n) {
    if (t.tView.ssrId === null) return null;
    let r = Pu(e, t.tView.ssrId);
    return n[b].firstUpdatePass && r === null && zw(n, t), r
}

function zw(e, t) {
    let n = t;
    for (; n;) {
        if (Kp(e, n)) return;
        if ((n.flags & 256) === 256) break;
        n = n.prev
    }
    for (n = t.next; n && (n.flags & 512) === 512;) {
        if (Kp(e, n)) return;
        n = n.next
    }
}

function iv(e, t) {
    let n = e[it];
    return !t || n === null || n.length === 0 ? !1 : n[0].data[Kg] === t
}

function Kp(e, t) {
    let n = t.tView ? .ssrId;
    if (n == null) return !1;
    let r = e[t.index];
    return Ue(r) && iv(r, n) ? (wd(r), !0) : !1
}
var sv = class {},
    Ca = class {},
    ku = class {
        resolveComponentFactory(t) {
            throw new C(917, !1)
        }
    },
    Vo = class {
        static NULL = new ku
    },
    kn = class {},
    jn = (() => {
        class e {
            destroyNode = null;
            static __NG_ELEMENT_ID__ = () => Gw()
        }
        return e
    })();

function Gw() {
    let e = Y(),
        t = ve(),
        n = Ke(t.index, e);
    return (Be(n) ? n : e)[Z]
}
var av = (() => {
    class e {
        static\ u0275prov = w({
            token: e,
            providedIn: "root",
            factory: () => null
        })
    }
    return e
})();
var ks = {},
    br = class {
        injector;
        parentInjector;
        constructor(t, n) {
            this.injector = t, this.parentInjector = n
        }
        get(t, n, r) {
            let o = this.injector.get(t, ks, r);
            return o !== ks || n === ks ? o : this.parentInjector.get(t, n, r)
        }
    };

function qs(e, t, n) {
    let r = n ? e.styles : null,
        o = n ? e.classes : null,
        i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number") i = a;
            else if (i == 1) o = yl(o, a);
            else if (i == 2) {
                let c = a,
                    l = t[++s];
                r = yl(r, c + ": " + l + ";")
            }
        }
    n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o
}

function $(e, t = 0) {
    let n = Y();
    if (n === null) return A(e, t);
    let r = ve();
    return Fg(r, n, me(e), t)
}

function cv(e, t, n, r, o) {
    let i = r === null ? null : {
            "": -1
        },
        s = o(e, n);
    if (s !== null) {
        let a = s,
            c = null,
            l = null;
        for (let u of s)
            if (u.resolveHostDirectives !== null) {
                [a, c, l] = u.resolveHostDirectives(s);
                break
            }
        Zw(e, t, n, a, i, c, l)
    }
    i !== null && r !== null && Ww(n, r, i)
}

function Ww(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
        let i = n[t[o + 1]];
        if (i == null) throw new C(-301, !1);
        r.push(t[o], i)
    }
}

function qw(e, t, n) {
    t.componentOffset = n, (e.components ? ? = []).push(t.index)
}

function Zw(e, t, n, r, o, i, s) {
    let a = r.length,
        c = !1;
    for (let m = 0; m < a; m++) {
        let g = r[m];
        !c && vt(g) && (c = !0, qw(e, n, m)), wu(Bs(n, t), e, g.type)
    }
    eI(n, e.data.length, a);
    for (let m = 0; m < a; m++) {
        let g = r[m];
        g.providersResolver && g.providersResolver(g)
    }
    let l = !1,
        u = !1,
        d = km(e, t, a, null);
    a > 0 && (n.directiveToIndex = new Map);
    for (let m = 0; m < a; m++) {
        let g = r[m];
        if (n.mergedAttrs = Mr(n.mergedAttrs, g.hostAttrs), Qw(e, n, t, d, g), Xw(d, g, o), s !== null && s.has(g)) {
            let [_, k] = s.get(g);
            n.directiveToIndex.set(g.type, [d, _ + n.directiveStart, k + n.directiveStart])
        } else(i === null || !i.has(g)) && n.directiveToIndex.set(g.type, d);
        g.contentQueries !== null && (n.flags |= 4), (g.hostBindings !== null || g.hostAttrs !== null || g.hostVars !== 0) && (n.flags |= 64);
        let y = g.type.prototype;
        !l && (y.ngOnChanges || y.ngOnInit || y.ngDoCheck) && ((e.preOrderHooks ? ? = []).push(n.index), l = !0), !u && (y.ngOnChanges || y.ngDoCheck) && ((e.preOrderCheckHooks ? ? = []).push(n.index), u = !0), d++
    }
    Yw(e, n, i)
}

function Yw(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
        let o = e.data[r];
        if (n === null || !n.has(o)) Jp(0, t, o, r), Jp(1, t, o, r), eg(t, r, !1);
        else {
            let i = n.get(o);
            Xp(0, t, i, r), Xp(1, t, i, r), eg(t, r, !0)
        }
    }
}

function Jp(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s;
            e === 0 ? s = t.inputs ? ? = {} : s = t.outputs ? ? = {}, s[i] ? ? = [], s[i].push(r), lv(t, i)
        }
}

function Xp(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s = o[i],
                a;
            e === 0 ? a = t.hostDirectiveInputs ? ? = {} : a = t.hostDirectiveOutputs ? ? = {}, a[s] ? ? = [], a[s].push(r, i), lv(t, s)
        }
}

function lv(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16)
}

function eg(e, t, n) {
    let {
        attrs: r,
        inputs: o,
        hostDirectiveInputs: i
    } = e;
    if (r === null || !n && o === null || n && i === null || id(e)) {
        e.initialInputs ? ? = [], e.initialInputs.push(null);
        return
    }
    let s = null,
        a = 0;
    for (; a < r.length;) {
        let c = r[a];
        if (c === 0) {
            a += 4;
            continue
        } else if (c === 5) {
            a += 2;
            continue
        } else if (typeof c == "number") break;
        if (!n && o.hasOwnProperty(c)) {
            let l = o[c];
            for (let u of l)
                if (u === t) {
                    s ? ? = [], s.push(c, r[a + 1]);
                    break
                }
        } else if (n && i.hasOwnProperty(c)) {
            let l = i[c];
            for (let u = 0; u < l.length; u += 2)
                if (l[u] === t) {
                    s ? ? = [], s.push(l[u + 1], r[a + 1]);
                    break
                }
        }
        a += 2
    }
    e.initialInputs ? ? = [], e.initialInputs.push(s)
}

function Qw(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Dn(o.type, !0)),
        s = new Pn(i, vt(o), $, null);
    e.blueprint[r] = s, n[r] = s, Kw(e, t, r, km(e, n, o.hostVars, en), o)
}

function Kw(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        Jw(s) != a && s.push(a), s.push(n, r, i)
    }
}

function Jw(e) {
    let t = e.length;
    for (; t > 0;) {
        let n = e[--t];
        if (typeof n == "number" && n < 0) return n
    }
    return 0
}

function Xw(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
        vt(t) && (n[""] = e)
    }
}

function eI(e, t, n) {
    e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t
}

function bd(e, t, n, r, o, i, s, a) {
    let c = t[b],
        l = c.consts,
        u = Nn(l, s),
        d = va(c, e, n, r, u);
    return i && cv(c, t, d, Nn(l, a), o), d.mergedAttrs = Mr(d.mergedAttrs, d.attrs), d.attrs !== null && qs(d, d.attrs, !1), d.mergedAttrs !== null && qs(d, d.mergedAttrs, !0), c.queries !== null && c.queries.elementStart(c, d), d
}

function Sd(e, t) {
    Mg(e, t), Bl(t) && e.queries.elementEnd(t)
}

function tI(e, t, n, r, o, i) {
    let s = t.consts,
        a = Nn(s, o),
        c = va(t, e, n, r, a);
    if (c.mergedAttrs = Mr(c.mergedAttrs, c.attrs), i != null) {
        let l = Nn(s, i);
        c.localNames = [];
        for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1)
    }
    return c.attrs !== null && qs(c, c.attrs, !1), c.mergedAttrs !== null && qs(c, c.mergedAttrs, !0), t.queries !== null && t.queries.elementStart(t, c), c
}

function Md(e) {
    return dv(e) ? Array.isArray(e) || !(e instanceof Map) && Symbol.iterator in e : !1
}

function uv(e, t) {
    if (Array.isArray(e))
        for (let n = 0; n < e.length; n++) t(e[n]);
    else {
        let n = e[Symbol.iterator](),
            r;
        for (; !(r = n.next()).done;) t(r.value)
    }
}

function dv(e) {
    return e !== null && (typeof e == "function" || typeof e == "object")
}

function _a(e, t, n) {
    if (n === en) return !1;
    let r = e[t];
    return Object.is(r, n) ? !1 : (e[t] = n, !0)
}

function pu(e, t, n) {
    return function r(o) {
        let i = Rt(e) ? Ke(e.index, t) : t;
        ma(i, 5);
        let s = t[Ce],
            a = tg(t, s, n, o),
            c = r.__ngNextListenerFn__;
        for (; c;) a = tg(t, s, c, o) && a, c = c.__ngNextListenerFn__;
        return a
    }
}

function tg(e, t, n, r) {
    let o = O(null);
    try {
        return z(6, t, n), n(r) !== !1
    } catch (i) {
        return Ed(e, i), !1
    } finally {
        z(7, t, n), O(o)
    }
}

function nI(e, t, n, r, o, i, s, a) {
    let c = yr(e),
        l = !1,
        u = null;
    if (!r && c && (u = rI(t, n, i, e.index)), u !== null) {
        let d = u.__ngLastListenerFn__ || u;
        d.__ngNextListenerFn__ = s, u.__ngLastListenerFn__ = s, l = !0
    } else {
        let d = Qe(e, n),
            m = r ? r(d) : d;
        e_(n, m, i, a);
        let g = o.listen(m, i, a),
            y = r ? _ => r(He(_[e.index])) : e.index;
        fv(y, t, n, i, a, g, !1)
    }
    return l
}

function rI(e, t, n, r) {
    let o = e.cleanup;
    if (o != null)
        for (let i = 0; i < o.length - 1; i += 2) {
            let s = o[i];
            if (s === n && o[i + 1] === r) {
                let a = t[mr],
                    c = o[i + 2];
                return a && a.length > c ? a[c] : null
            }
            typeof s == "string" && (i += 2)
        }
    return null
}

function fv(e, t, n, r, o, i, s) {
    let a = t.firstCreatePass ? vp(t) : null,
        c = mp(n),
        l = c.length;
    c.push(o, i), a && a.push(r, e, l, (l + 1) * (s ? -1 : 1))
}

function ng(e, t, n, r, o, i) {
    let s = t[n],
        a = t[b],
        l = a.data[n].outputs[r],
        d = s[l].subscribe(i);
    fv(e.index, a, t, o, i, d, !0)
}
var Fu = Symbol("BINDING");
var Zs = class extends Vo {
    ngModule;
    constructor(t) {
        super(), this.ngModule = t
    }
    resolveComponentFactory(t) {
        let n = Nt(t);
        return new Ar(n, this.ngModule)
    }
};

function oI(e) {
    return Object.keys(e).map(t => {
        let [n, r, o] = e[t], i = {
            propName: n,
            templateName: t,
            isSignal: (r & fa.SignalBased) !== 0
        };
        return o && (i.transform = o), i
    })
}

function iI(e) {
    return Object.keys(e).map(t => ({
        propName: e[t],
        templateName: t
    }))
}

function sI(e, t, n) {
    let r = t instanceof de ? t : t ? .injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r), r ? new br(n, r) : n
}

function aI(e) {
    let t = e.get(kn, null);
    if (t === null) throw new C(407, !1);
    let n = e.get(av, null),
        r = e.get(ft, null);
    return {
        rendererFactory: t,
        sanitizer: n,
        changeDetectionScheduler: r,
        ngReflect: !1
    }
}

function cI(e, t) {
    let n = hv(e);
    return sd(t, n, n === "svg" ? up : n === "math" ? dp : null)
}

function hv(e) {
    return (e.selectors[0][0] || "div").toLowerCase()
}
var Ar = class extends Ca {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() {
        return this.cachedInputs ? ? = oI(this.componentDef.inputs), this.cachedInputs
    }
    get outputs() {
        return this.cachedOutputs ? ? = iI(this.componentDef.outputs), this.cachedOutputs
    }
    constructor(t, n) {
        super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = b_(t.selectors), this.ngContentSelectors = t.ngContentSelectors ? ? [], this.isBoundToModule = !!n
    }
    create(t, n, r, o, i, s) {
        z(22);
        let a = O(null);
        try {
            let c = this.componentDef,
                l = lI(r, c, s, i),
                u = sI(c, o || this.ngModule, t),
                d = aI(u),
                m = d.rendererFactory.createRenderer(null, c),
                g = r ? q_(m, r, c.encapsulation, u) : cI(c, m),
                y = s ? .some(rg) || i ? .some(L => typeof L != "function" && L.bindings.some(rg)),
                _ = ld(null, l, null, 512 | Pm(c), null, null, d, m, u, null, mm(g, u, !0));
            _[Q] = g, Cs(_);
            let k = null;
            try {
                let L = bd(Q, _, 2, "#host", () => l.directiveRegistry, !0, 0);
                g && (Om(m, g, L), Tr(g, _)), pa(l, _, L), td(l, L, _), Sd(l, L), n !== void 0 && dI(L, this.ngContentSelectors, n), k = Ke(L.index, _), _[Ce] = k[Ce], Cd(l, _, null)
            } catch (L) {
                throw k !== null && bu(k), bu(_), L
            } finally {
                z(23), _s()
            }
            return new Ys(this.componentType, _, !!y)
        } finally {
            O(a)
        }
    }
};

function lI(e, t, n, r) {
    let o = e ? ["ng-version", "20.2.1"] : S_(t.selectors[0]),
        i = null,
        s = null,
        a = 0;
    if (n)
        for (let u of n) a += u[Fu].requiredVars, u.create && (u.targetIdx = 0, (i ? ? = []).push(u)), u.update && (u.targetIdx = 0, (s ? ? = []).push(u));
    if (r)
        for (let u = 0; u < r.length; u++) {
            let d = r[u];
            if (typeof d != "function")
                for (let m of d.bindings) {
                    a += m[Fu].requiredVars;
                    let g = u + 1;
                    m.create && (m.targetIdx = g, (i ? ? = []).push(m)), m.update && (m.targetIdx = g, (s ? ? = []).push(m))
                }
        }
    let c = [t];
    if (r)
        for (let u of r) {
            let d = typeof u == "function" ? u : u.type,
                m = hs(d);
            c.push(m)
        }
    return cd(0, null, uI(i, s), 1, a, c, null, null, null, [o], null)
}

function uI(e, t) {
    return !e && !t ? null : n => {
        if (n & 1 && e)
            for (let r of e) r.create();
        if (n & 2 && t)
            for (let r of t) r.update()
    }
}

function rg(e) {
    let t = e[Fu].kind;
    return t === "input" || t === "twoWay"
}
var Ys = class extends sv {
    _rootLView;
    _hasInputBindings;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n, r) {
        super(), this._rootLView = n, this._hasInputBindings = r, this._tNode = Er(n[b], Q), this.location = na(this._tNode, n), this.instance = Ke(this._tNode.index, n)[Ce], this.hostView = this.changeDetectorRef = new Kt(n, void 0), this.componentType = t
    }
    setInput(t, n) {
        this._hasInputBindings;
        let r = this._tNode;
        if (this.previousInputValues ? ? = new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
        let o = this._rootLView,
            i = Dd(r, o[b], o, t, n);
        this.previousInputValues.set(t, n);
        let s = Ke(r.index, o);
        ma(s, 1)
    }
    get injector() {
        return new On(this._tNode, this._rootLView)
    }
    destroy() {
        this.hostView.destroy()
    }
    onDestroy(t) {
        this.hostView.onDestroy(t)
    }
};

function dI(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null && i.length ? Array.from(i) : null)
    }
}
var Bn = (() => {
    class e {
        static __NG_ELEMENT_ID__ = fI
    }
    return e
})();

function fI() {
    let e = ve();
    return pI(e, Y())
}
var hI = Bn,
    pv = class extends hI {
        _lContainer;
        _hostTNode;
        _hostLView;
        constructor(t, n, r) {
            super(), this._lContainer = t, this._hostTNode = n, this._hostLView = r
        }
        get element() {
            return na(this._hostTNode, this._hostLView)
        }
        get injector() {
            return new On(this._hostTNode, this._hostLView)
        }
        get parentInjector() {
            let t = zu(this._hostTNode, this._hostLView);
            if (Ng(t)) {
                let n = js(t, this._hostLView),
                    r = Vs(t),
                    o = n[b].data[r + 8];
                return new On(o, n)
            } else return new On(null, this._hostLView)
        }
        clear() {
            for (; this.length > 0;) this.remove(this.length - 1)
        }
        get(t) {
            let n = og(this._lContainer);
            return n !== null && n[t] || null
        }
        get length() {
            return this._lContainer.length - Ie
        }
        createEmbeddedView(t, n, r) {
            let o, i;
            typeof r == "number" ? o = r : r != null && (o = r.index, i = r.injector);
            let s = Pu(this._lContainer, t.ssrId),
                a = t.createEmbeddedViewImpl(n || {}, i, s);
            return this.insertImpl(a, o, xu(this._hostTNode, s)), a
        }
        createComponent(t, n, r, o, i, s, a) {
            let c = t && !IC(t),
                l;
            if (c) l = n;
            else {
                let k = n || {};
                l = k.index, r = k.injector, o = k.projectableNodes, i = k.environmentInjector || k.ngModuleRef, s = k.directives, a = k.bindings
            }
            let u = c ? t : new Ar(Nt(t)),
                d = r || this.parentInjector;
            if (!i && u.ngModule == null) {
                let L = (c ? d : this.parentInjector).get(de, null);
                L && (i = L)
            }
            let m = Nt(u.componentType ? ? {}),
                g = Pu(this._lContainer, m ? .id ? ? null),
                y = g ? .firstChild ? ? null,
                _ = u.create(d, o, y, i, s, a);
            return this.insertImpl(_.hostView, l, xu(this._hostTNode, g)), _
        }
        insert(t, n) {
            return this.insertImpl(t, n, !0)
        }
        insertImpl(t, n, r) {
            let o = t._lView;
            if (hp(o)) {
                let a = this.indexOf(t);
                if (a !== -1) this.detach(a);
                else {
                    let c = o[oe],
                        l = new pv(c, c[Ye], c[oe]);
                    l.detach(l.indexOf(t))
                }
            }
            let i = this._adjustIndex(n),
                s = this._lContainer;
            return Xm(s, o, i, r), t.attachToViewContainerRef(), Rl(gu(s), i, t), t
        }
        move(t, n) {
            return this.insert(t, n)
        }
        indexOf(t) {
            let n = og(this._lContainer);
            return n !== null ? n.indexOf(t) : -1
        }
        remove(t) {
            let n = this._adjustIndex(t, -1),
                r = Gs(this._lContainer, n);
            r && (po(gu(this._lContainer), n), hd(r[b], r))
        }
        detach(t) {
            let n = this._adjustIndex(t, -1),
                r = Gs(this._lContainer, n);
            return r && po(gu(this._lContainer), n) != null ? new Kt(r) : null
        }
        _adjustIndex(t, n = 0) {
            return t ? ? this.length + n
        }
    };

function og(e) {
    return e[Eo]
}

function gu(e) {
    return e[Eo] || (e[Eo] = [])
}

function pI(e, t) {
    let n, r = t[e.index];
    return Ue(r) ? n = r : (n = Jm(r, t, null, e), t[e.index] = n, ud(t, n)), gv(n, t, e, r), new pv(n, e, t)
}

function gI(e, t) {
    let n = e[Z],
        r = n.createComment(""),
        o = Qe(t, e),
        i = n.parentNode(o);
    return zs(n, i, r, n.nextSibling(o), !1), r
}
var gv = mv,
    Td = () => !1;

function mI(e, t, n) {
    return Td(e, t, n)
}

function mv(e, t, n, r) {
    if (e[mt]) return;
    let o;
    n.type & 8 ? o = He(r) : o = gI(t, n), e[mt] = o
}

function vI(e, t, n) {
    if (e[mt] && e[it]) return !0;
    let r = n[Ve],
        o = t.index - Q;
    if (!r || Hg(t) || Dm(r, o)) return !1;
    let s = Tu(r, o),
        a = r.data[ia] ? .[o],
        [c, l] = Bw(s, a);
    return e[mt] = c, e[it] = l, !0
}

function yI(e, t, n, r) {
    Td(e, n, t) || mv(e, t, n, r)
}

function vv() {
    gv = yI, Td = vI
}
var ig = new Set;

function Lt(e) {
    ig.has(e) || (ig.add(e), performance ? .mark ? .("mark_feature_usage", {
        detail: {
            feature: e
        }
    }))
}
var Fn = class {},
    wa = class {};
var Qs = class extends Fn {
        ngModuleType;
        _parent;
        _bootstrapComponents = [];
        _r3Injector;
        instance;
        destroyCbs = [];
        componentFactoryResolver = new Zs(this);
        constructor(t, n, r, o = !0) {
            super(), this.ngModuleType = t, this._parent = n;
            let i = Pl(t);
            this._bootstrapComponents = Mm(i.bootstrap), this._r3Injector = iu(t, n, [{
                provide: Fn,
                useValue: this
            }, {
                provide: Vo,
                useValue: this.componentFactoryResolver
            }, ...r], At(t), new Set(["environment"])), o && this.resolveInjectorInitializers()
        }
        resolveInjectorInitializers() {
            this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(this.ngModuleType)
        }
        get injector() {
            return this._r3Injector
        }
        destroy() {
            let t = this._r3Injector;
            !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null
        }
        onDestroy(t) {
            this.destroyCbs.push(t)
        }
    },
    Ks = class extends wa {
        moduleType;
        constructor(t) {
            super(), this.moduleType = t
        }
        create(t) {
            return new Qs(this.moduleType, t, [])
        }
    };
var To = class extends Fn {
    injector;
    componentFactoryResolver = new Zs(this);
    instance = null;
    constructor(t) {
        super();
        let n = new _n([...t.providers, {
            provide: Fn,
            useValue: this
        }, {
            provide: Vo,
            useValue: this.componentFactoryResolver
        }], t.parent || mo(), t.debugName, new Set(["environment"]));
        this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
};

function Or(e, t, n = null) {
    return new To({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0
    }).injector
}
var EI = (() => {
    class e {
        _injector;
        cachedInjectors = new Map;
        constructor(n) {
            this._injector = n
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
                let r = ps(!1, n.type),
                    o = r.length > 0 ? Or([r], this._injector, `Standalone[${n.type.name}]`) : null;
                this.cachedInjectors.set(n, o)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static\ u0275prov = w({
            token: e,
            providedIn: "environment",
            factory: () => new e(A(de))
        })
    }
    return e
})();

function K(e) {
    return Rr(() => {
        let t = yv(e),
            n = V(E({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === Gu.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: t.standalone && e.dependencies || null,
                getStandaloneInjector: t.standalone ? o => o.get(EI).getOrCreateStandaloneInjector(n) : null,
                getExternalStyles: null,
                signals: e.signals ? ? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || kt.Emulated,
                styles: e.styles || Le,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: ""
            });
        t.standalone && Lt("NgStandalone"), Ev(n);
        let r = e.dependencies;
        return n.directiveDefs = sg(r, DI), n.pipeDefs = sg(r, kl), n.id = wI(n), n
    })
}

function DI(e) {
    return Nt(e) || hs(e)
}

function Vt(e) {
    return Rr(() => ({
        type: e.type,
        bootstrap: e.bootstrap || Le,
        declarations: e.declarations || Le,
        imports: e.imports || Le,
        exports: e.exports || Le,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null
    }))
}

function CI(e, t) {
    if (e == null) return Zt;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r],
                i, s, a, c;
            Array.isArray(o) ? (a = o[0], i = o[1], s = o[2] ? ? i, c = o[3] || null) : (i = o, s = o, a = fa.None, c = null), n[i] = [r, a, c], t[i] = s
        }
    return n
}

function _I(e) {
    if (e == null) return Zt;
    let t = {};
    for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
    return t
}

function ae(e) {
    return Rr(() => {
        let t = yv(e);
        return Ev(t), t
    })
}

function yv(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputConfig: e.inputs || Zt,
        exportAs: e.exportAs || null,
        standalone: e.standalone ? ? !0,
        signals: e.signals === !0,
        selectors: e.selectors || Le,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        resolveHostDirectives: null,
        hostDirectives: null,
        inputs: CI(e.inputs, t),
        outputs: _I(e.outputs),
        debugInfo: null
    }
}

function Ev(e) {
    e.features ? .forEach(t => t(e))
}

function sg(e, t) {
    return e ? () => {
        let n = typeof e == "function" ? e() : e,
            r = [];
        for (let o of n) {
            let i = t(o);
            i !== null && r.push(i)
        }
        return r
    } : null
}

function wI(e) {
    let t = 0,
        n = typeof e.consts == "function" ? "" : e.consts,
        r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|")) t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648, "c" + t
}

function II(e) {
    return Object.getPrototypeOf(e.prototype).constructor
}

function ct(e) {
    let t = II(e.type),
        n = !0,
        r = [e];
    for (; t;) {
        let o;
        if (vt(e)) o = t.\u0275cmp || t.\u0275dir;
        else {
            if (t.\u0275cmp) throw new C(903, !1);
            o = t.\u0275dir
        }
        if (o) {
            if (n) {
                r.push(o);
                let s = e;
                s.inputs = mu(e.inputs), s.declaredInputs = mu(e.declaredInputs), s.outputs = mu(e.outputs);
                let a = o.hostBindings;
                a && AI(e, a);
                let c = o.viewQuery,
                    l = o.contentQueries;
                if (c && MI(e, c), l && TI(e, l), bI(e, o), Qh(e.outputs, o.outputs), vt(o) && o.data.animation) {
                    let u = e.data;
                    u.animation = (u.animation || []).concat(o.data.animation)
                }
            }
            let i = o.features;
            if (i)
                for (let s = 0; s < i.length; s++) {
                    let a = i[s];
                    a && a.ngInherit && a(e), a === ct && (n = !1)
                }
        }
        t = Object.getPrototypeOf(t)
    }
    SI(r)
}

function bI(e, t) {
    for (let n in t.inputs) {
        if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
        let r = t.inputs[n];
        r !== void 0 && (e.inputs[n] = r, e.declaredInputs[n] = t.declaredInputs[n])
    }
}

function SI(e) {
    let t = 0,
        n = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let o = e[r];
        o.hostVars = t += o.hostVars, o.hostAttrs = Mr(o.hostAttrs, n = Mr(n, o.hostAttrs))
    }
}

function mu(e) {
    return e === Zt ? {} : e === Le ? [] : e
}

function MI(e, t) {
    let n = e.viewQuery;
    n ? e.viewQuery = (r, o) => {
        t(r, o), n(r, o)
    } : e.viewQuery = t
}

function TI(e, t) {
    let n = e.contentQueries;
    n ? e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i)
    } : e.contentQueries = t
}

function AI(e, t) {
    let n = e.hostBindings;
    n ? e.hostBindings = (r, o) => {
        t(r, o), n(r, o)
    } : e.hostBindings = t
}

function NI(e, t, n, r, o, i, s, a) {
    if (n.firstCreatePass) {
        e.mergedAttrs = Mr(e.mergedAttrs, e.attrs);
        let u = e.tView = cd(2, e, o, i, s, n.directiveRegistry, n.pipeRegistry, null, n.schemas, n.consts, null);
        n.queries !== null && (n.queries.template(n, e), u.queries = n.queries.embeddedTView(e))
    }
    a && (e.flags |= a), Cr(e, !1);
    let c = Dv(n, t, e, r);
    ws() && pd(n, t, c, e), Tr(c, t);
    let l = Jm(c, t, c, e);
    t[r + Q] = l, ud(t, l), mI(l, e, t)
}

function RI(e, t, n, r, o, i, s, a, c, l, u) {
    let d = n + Q,
        m;
    return t.firstCreatePass ? (m = va(t, d, 4, s || null, a || null), ys() && cv(t, e, m, Nn(t.consts, l), md), Mg(t, m)) : m = t.data[d], NI(m, e, t, n, r, o, i, c), yr(m) && pa(t, e, m), l != null && ga(e, m, u), m
}

function tn(e, t, n, r, o, i, s, a) {
    let c = Y(),
        l = Je(),
        u = Nn(l.consts, i);
    return RI(c, l, e, t, n, r, o, u, void 0, s, a), tn
}
var Dv = Cv;

function Cv(e, t, n, r) {
    return Pt(!0), t[Z].createComment("")
}

function xI(e, t, n, r) {
    let o = !la(t, n);
    Pt(o);
    let i = t[Ve] ? .data[Qg] ? .[r] ? ? null;
    if (i !== null && n.tView !== null && n.tView.ssrId === null && (n.tView.ssrId = i), o) return Cv(e, t);
    let s = t[Ve],
        a = ya(s, e, t, n);
    ca(s, r, a);
    let c = ed(s, r);
    return Ea(c, a)
}

function _v() {
    Dv = xI
}
var $e = (function(e) {
        return e[e.NOT_STARTED = 0] = "NOT_STARTED", e[e.IN_PROGRESS = 1] = "IN_PROGRESS", e[e.COMPLETE = 2] = "COMPLETE", e[e.FAILED = 3] = "FAILED", e
    })($e || {}),
    ag = 0,
    OI = 1,
    ie = (function(e) {
        return e[e.Placeholder = 0] = "Placeholder", e[e.Loading = 1] = "Loading", e[e.Complete = 2] = "Complete", e[e.Error = 3] = "Error", e
    })(ie || {});
var PI = 0,
    jo = 1;
var kI = 4,
    FI = 5;
var LI = 7,
    Sr = 8,
    VI = 9,
    Ad = (function(e) {
        return e[e.Manual = 0] = "Manual", e[e.Playthrough = 1] = "Playthrough", e
    })(Ad || {});

function Fs(e, t) {
    let n = BI(e),
        r = t[n];
    if (r !== null) {
        for (let o of r) o();
        t[n] = null
    }
}

function jI(e) {
    Fs(1, e), Fs(0, e), Fs(2, e)
}

function BI(e) {
    let t = kI;
    return e === 1 ? t = FI : e === 2 && (t = VI), t
}
var Ia = (function(e) {
        return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e
    })(Ia || {}),
    Un = new D(""),
    wv = !1,
    Lu = class extends ne {
        __isAsync;
        destroyRef = void 0;
        pendingTasks = void 0;
        constructor(t = !1) {
            super(), this.__isAsync = t, cp() && (this.destroyRef = v(yt, {
                optional: !0
            }) ? ? void 0, this.pendingTasks = v(st, {
                optional: !0
            }) ? ? void 0)
        }
        emit(t) {
            let n = O(null);
            try {
                super.next(t)
            } finally {
                O(n)
            }
        }
        subscribe(t, n, r) {
            let o = t,
                i = n || (() => null),
                s = r;
            if (t && typeof t == "object") {
                let c = t;
                o = c.next ? .bind(c), i = c.error ? .bind(c), s = c.complete ? .bind(c)
            }
            this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s)));
            let a = super.subscribe({
                next: o,
                error: i,
                complete: s
            });
            return t instanceof te && t.add(a), a
        }
        wrapInTimeout(t) {
            return n => {
                let r = this.pendingTasks ? .add();
                setTimeout(() => {
                    try {
                        t(n)
                    } finally {
                        r !== void 0 && this.pendingTasks ? .remove(r)
                    }
                })
            }
        }
    },
    se = Lu;

function Iv(e) {
    let t, n;

    function r() {
        e = wo;
        try {
            n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t)
        } catch {}
    }
    return t = setTimeout(() => {
        e(), r()
    }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => {
        e(), r()
    })), () => r()
}

function cg(e) {
    return queueMicrotask(() => e()), () => {
        e = wo
    }
}
var Nd = "isAngularZone",
    Js = Nd + "_ID",
    UI = 0,
    ee = class e {
        hasPendingMacrotasks = !1;
        hasPendingMicrotasks = !1;
        isStable = !0;
        onUnstable = new se(!1);
        onMicrotaskEmpty = new se(!1);
        onStable = new se(!1);
        onError = new se(!1);
        constructor(t) {
            let {
                enableLongStackTrace: n = !1,
                shouldCoalesceEventChangeDetection: r = !1,
                shouldCoalesceRunChangeDetection: o = !1,
                scheduleInRootZone: i = wv
            } = t;
            if (typeof Zone > "u") throw new C(908, !1);
            Zone.assertZonePatched();
            let s = this;
            s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = !1, s.scheduleInRootZone = i, zI(s)
        }
        static isInAngularZone() {
            return typeof Zone < "u" && Zone.current.get(Nd) === !0
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new C(909, !1)
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new C(909, !1)
        }
        run(t, n, r) {
            return this._inner.run(t, n, r)
        }
        runTask(t, n, r, o) {
            let i = this._inner,
                s = i.scheduleEventTask("NgZoneEvent: " + o, t, HI, wo, wo);
            try {
                return i.runTask(s, n, r)
            } finally {
                i.cancelTask(s)
            }
        }
        runGuarded(t, n, r) {
            return this._inner.runGuarded(t, n, r)
        }
        runOutsideAngular(t) {
            return this._outer.run(t)
        }
    },
    HI = {};

function Rd(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable) try {
        e._nesting++, e.onMicrotaskEmpty.emit(null)
    } finally {
        if (e._nesting--, !e.hasPendingMicrotasks) try {
            e.runOutsideAngular(() => e.onStable.emit(null))
        } finally {
            e.isStable = !0
        }
    }
}

function $I(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = !0;

    function t() {
        Iv(() => {
            e.callbackScheduled = !1, Vu(e), e.isCheckStableRunning = !0, Rd(e), e.isCheckStableRunning = !1
        })
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
        t()
    }) : e._outer.run(() => {
        t()
    }), Vu(e)
}

function zI(e) {
    let t = () => {
            $I(e)
        },
        n = UI++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: {
            [Nd]: !0,
            [Js]: n,
            [Js + n]: !0
        },
        onInvokeTask: (r, o, i, s, a, c) => {
            if (GI(c)) return r.invokeTask(i, s, a, c);
            try {
                return lg(e), r.invokeTask(i, s, a, c)
            } finally {
                (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), ug(e)
            }
        },
        onInvoke: (r, o, i, s, a, c, l) => {
            try {
                return lg(e), r.invoke(i, s, a, c, l)
            } finally {
                e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !WI(c) && t(), ug(e)
            }
        },
        onHasTask: (r, o, i, s) => {
            r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, Vu(e), Rd(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask))
        },
        onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1)
    })
}

function Vu(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1
}

function lg(e) {
    e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null))
}

function ug(e) {
    e._nesting--, Rd(e)
}
var Ao = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new se;
    onMicrotaskEmpty = new se;
    onStable = new se;
    onError = new se;
    run(t, n, r) {
        return t.apply(n, r)
    }
    runGuarded(t, n, r) {
        return t.apply(n, r)
    }
    runOutsideAngular(t) {
        return t()
    }
    runTask(t, n, r, o) {
        return t.apply(n, r)
    }
};

function GI(e) {
    return bv(e, "__ignore_ng_zone__")
}

function WI(e) {
    return bv(e, "__scheduler_tick__")
}

function bv(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0] ? .data ? .[t] === !0
}
var xd = (() => {
        class e {
            impl = null;
            execute() {
                this.impl ? .execute()
            }
            static\ u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    Sv = [0, 1, 2, 3],
    Mv = (() => {
        class e {
            ngZone = v(ee);
            scheduler = v(ft);
            errorHandler = v(nt, {
                optional: !0
            });
            sequences = new Set;
            deferredRegistrations = new Set;
            executing = !1;
            constructor() {
                v(Un, {
                    optional: !0
                })
            }
            execute() {
                let n = this.sequences.size > 0;
                n && z(16), this.executing = !0;
                for (let r of Sv)
                    for (let o of this.sequences)
                        if (!(o.erroredOrDestroyed || !o.hooks[r])) try {
                            o.pipelinedValue = this.ngZone.runOutsideAngular(() => this.maybeTrace(() => {
                                let i = o.hooks[r];
                                return i(o.pipelinedValue)
                            }, o.snapshot))
                        } catch (i) {
                            o.erroredOrDestroyed = !0, this.errorHandler ? .handleError(i)
                        }
                this.executing = !1;
                for (let r of this.sequences) r.afterRun(), r.once && (this.sequences.delete(r), r.destroy());
                for (let r of this.deferredRegistrations) this.sequences.add(r);
                this.deferredRegistrations.size > 0 && this.scheduler.notify(7), this.deferredRegistrations.clear(), n && z(17)
            }
            register(n) {
                let {
                    view: r
                } = n;
                r !== void 0 ? ((r[Tn] ? ? = []).push(n), Dr(r), r[N] |= 8192) : this.executing ? this.deferredRegistrations.add(n) : this.addSequence(n)
            }
            addSequence(n) {
                this.sequences.add(n), this.scheduler.notify(7)
            }
            unregister(n) {
                this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0, n.pipelinedValue = void 0, n.once = !0) : (this.sequences.delete(n), this.deferredRegistrations.delete(n))
            }
            maybeTrace(n, r) {
                return r ? r.run(Ia.AFTER_NEXT_RENDER, n) : n()
            }
            static\ u0275prov = w({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    Xs = class {
        impl;
        hooks;
        view;
        once;
        snapshot;
        erroredOrDestroyed = !1;
        pipelinedValue = void 0;
        unregisterOnDestroy;
        constructor(t, n, r, o, i, s = null) {
            this.impl = t, this.hooks = n, this.view = r, this.once = o, this.snapshot = s, this.unregisterOnDestroy = i ? .onDestroy(() => this.destroy())
        }
        afterRun() {
            this.erroredOrDestroyed = !1, this.pipelinedValue = void 0, this.snapshot ? .dispose(), this.snapshot = null
        }
        destroy() {
            this.impl.unregister(this), this.unregisterOnDestroy ? .();
            let t = this.view ? .[Tn];
            t && (this.view[Tn] = t.filter(n => n !== this))
        }
    };

function ba(e, t) {
    let n = t ? .injector ? ? v(Re);
    return Lt("NgAfterNextRender"), ZI(e, n, t, !0)
}

function qI(e) {
    return e instanceof Function ? [void 0, void 0, e, void 0] : [e.earlyRead, e.write, e.mixedReadWrite, e.read]
}

function ZI(e, t, n, r) {
    let o = t.get(xd);
    o.impl ? ? = t.get(Mv);
    let i = t.get(Un, null, {
            optional: !0
        }),
        s = n ? .manualCleanup !== !0 ? t.get(yt) : null,
        a = t.get(Ss, null, {
            optional: !0
        }),
        c = new Xs(o.impl, qI(e), a ? .view, r, s, i ? .snapshot(null));
    return o.impl.register(c), c
}

function Tv(e) {
    return e + 1
}

function Pr(e, t) {
    let n = e[b],
        r = Tv(t.index);
    return e[r]
}

function Bo(e, t) {
    let n = Tv(t.index);
    return e.data[n]
}

function YI(e, t, n) {
    let r = t[b],
        o = Bo(r, n);
    switch (e) {
        case ie.Complete:
            return o.primaryTmplIndex;
        case ie.Loading:
            return o.loadingTmplIndex;
        case ie.Error:
            return o.errorTmplIndex;
        case ie.Placeholder:
            return o.placeholderTmplIndex;
        default:
            return null
    }
}

function dg(e, t) {
    return t === ie.Placeholder ? e.placeholderBlockConfig ? .[ag] ? ? null : t === ie.Loading ? e.loadingBlockConfig ? .[ag] ? ? null : null
}

function QI(e) {
    return e.loadingBlockConfig ? .[OI] ? ? null
}

function fg(e, t) {
    if (!e || e.length === 0) return t;
    let n = new Set(e);
    for (let r of t) n.add(r);
    return e.length === n.size ? e : Array.from(n)
}

function KI(e, t) {
    let n = t.primaryTmplIndex + Q;
    return Er(e, n)
}
var JI = (() => {
    class e {
        cachedInjectors = new Map;
        getOrCreateInjector(n, r, o, i) {
            if (!this.cachedInjectors.has(n)) {
                let s = o.length > 0 ? Or(o, r, i) : null;
                this.cachedInjectors.set(n, s)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static\ u0275prov = w({
            token: e,
            providedIn: "environment",
            factory: () => new e
        })
    }
    return e
})();
var Av = new D("");

function vu(e, t, n) {
    return e.get(JI).getOrCreateInjector(t, e, n, "")
}

function XI(e, t, n) {
    if (e instanceof br) {
        let o = e.injector,
            i = e.parentInjector,
            s = vu(i, t, n);
        return new br(o, s)
    }
    let r = e.get(de);
    if (r !== e) {
        let o = vu(r, t, n);
        return new br(e, o)
    }
    return vu(e, t, n)
}

function xn(e, t, n, r = !1) {
    let o = n[oe],
        i = o[b];
    if (Yt(o)) return;
    let s = Pr(o, t),
        a = s[jo],
        c = s[LI];
    if (!(c !== null && e < c) && hg(a, e) && hg(s[PI] ? ? -1, e)) {
        let l = Bo(i, t),
            d = !r && !0 && (QI(l) !== null || dg(l, ie.Loading) !== null || dg(l, ie.Placeholder)) ? n0 : t0;
        try {
            d(e, s, n, t, o)
        } catch (m) {
            Ed(o, m)
        }
    }
}

function e0(e, t) {
    let n = e[it] ? .findIndex(o => o.data[em] === t[jo]) ? ? -1;
    return {
        dehydratedView: n > -1 ? e[it][n] : null,
        dehydratedViewIx: n
    }
}

function t0(e, t, n, r, o) {
    z(20);
    let i = YI(e, o, r);
    if (i !== null) {
        t[jo] = e;
        let s = o[b],
            a = i + Q,
            c = Er(s, a),
            l = 0;
        _w(n, l);
        let u;
        if (e === ie.Complete) {
            let y = Bo(s, r),
                _ = y.providers;
            _ && _.length > 0 && (u = XI(o[ot], y, _))
        }
        let {
            dehydratedView: d,
            dehydratedViewIx: m
        } = e0(n, t), g = Hm(o, c, null, {
            injector: u,
            dehydratedView: d
        });
        if (Xm(n, g, l, xu(c, d)), ma(g, 2), m > -1 && n[it] ? .splice(m, 1), (e === ie.Complete || e === ie.Error) && Array.isArray(t[Sr])) {
            for (let y of t[Sr]) y();
            t[Sr] = null
        }
    }
    z(21)
}

function hg(e, t) {
    return e < t
}

function pg(e, t, n) {
    e.loadingPromise.then(() => {
        e.loadingState === $e.COMPLETE ? xn(ie.Complete, t, n) : e.loadingState === $e.FAILED && xn(ie.Error, t, n)
    })
}
var n0 = null;
var Sa = (() => {
    class e {
        log(n) {
            console.log(n)
        }
        warn(n) {
            console.warn(n)
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "platform"
        })
    }
    return e
})();
var Od = new D("");

function nn(e) {
    return !!e && typeof e.then == "function"
}

function Pd(e) {
    return !!e && typeof e.subscribe == "function"
}
var Nv = new D("");
var kd = (() => {
        class e {
            resolve;
            reject;
            initialized = !1;
            done = !1;
            donePromise = new Promise((n, r) => {
                this.resolve = n, this.reject = r
            });
            appInits = v(Nv, {
                optional: !0
            }) ? ? [];
            injector = v(Re);
            constructor() {}
            runInitializers() {
                if (this.initialized) return;
                let n = [];
                for (let o of this.appInits) {
                    let i = De(this.injector, o);
                    if (nn(i)) n.push(i);
                    else if (Pd(i)) {
                        let s = new Promise((a, c) => {
                            i.subscribe({
                                complete: a,
                                error: c
                            })
                        });
                        n.push(s)
                    }
                }
                let r = () => {
                    this.done = !0, this.resolve()
                };
                Promise.all(n).then(() => {
                    r()
                }).catch(o => {
                    this.reject(o)
                }), n.length === 0 && r(), this.initialized = !0
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    rn = new D("");

function Rv() {
    $c(() => {
        let e = "";
        throw new C(600, e)
    })
}

function xv(e) {
    return e.isBoundToModule
}
var r0 = 10;
var Se = (() => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = v(be);
        afterRenderManager = v(xd);
        zonelessEnabled = v(_r);
        rootEffectScheduler = v(cu);
        dirtyFlags = 0;
        tracingSnapshot = null;
        allTestViews = new Set;
        autoDetectTestViews = new Set;
        includeAllTestViews = !1;
        afterTick = new ne;
        get allViews() {
            return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views]
        }
        get destroyed() {
            return this._destroyed
        }
        componentTypes = [];
        components = [];
        internalPendingTask = v(st);
        get isStable() {
            return this.internalPendingTask.hasPendingTasksObservable.pipe(B(n => !n))
        }
        constructor() {
            v(Un, {
                optional: !0
            })
        }
        whenStable() {
            let n;
            return new Promise(r => {
                n = this.isStable.subscribe({
                    next: o => {
                        o && r()
                    }
                })
            }).finally(() => {
                n.unsubscribe()
            })
        }
        _injector = v(de);
        _rendererFactory = null;
        get injector() {
            return this._injector
        }
        bootstrap(n, r) {
            return this.bootstrapImpl(n, r)
        }
        bootstrapImpl(n, r, o = Re.NULL) {
            return this._injector.get(ee).run(() => {
                z(10);
                let s = n instanceof Ca;
                if (!this._injector.get(kd).done) {
                    let y = "";
                    throw new C(405, y)
                }
                let c;
                s ? c = n : c = this._injector.get(Vo).resolveComponentFactory(n), this.componentTypes.push(c.componentType);
                let l = xv(c) ? void 0 : this._injector.get(Fn),
                    u = r || c.selector,
                    d = c.create(o, [], u, l),
                    m = d.location.nativeElement,
                    g = d.injector.get(Od, null);
                return g ? .registerApplication(m), d.onDestroy(() => {
                    this.detachView(d.hostView), bo(this.components, d), g ? .unregisterApplication(m)
                }), this._loadComponent(d), z(11, d), d
            })
        }
        tick() {
            this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick()
        }
        _tick() {
            z(12), this.tracingSnapshot !== null ? this.tracingSnapshot.run(Ia.CHANGE_DETECTION, this.tickImpl) : this.tickImpl()
        }
        tickImpl = () => {
            if (this._runningTick) throw new C(101, !1);
            let n = O(null);
            try {
                this._runningTick = !0, this.synchronize()
            } finally {
                this._runningTick = !1, this.tracingSnapshot ? .dispose(), this.tracingSnapshot = null, O(n), this.afterTick.next(), z(13)
            }
        };
        synchronize() {
            this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(kn, null, {
                optional: !0
            }));
            let n = 0;
            for (; this.dirtyFlags !== 0 && n++ < r0;) z(14), this.synchronizeOnce(), z(15)
        }
        synchronizeOnce() {
            this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush());
            let n = !1;
            if (this.dirtyFlags & 7) {
                let r = !!(this.dirtyFlags & 1);
                this.dirtyFlags &= -8, this.dirtyFlags |= 8;
                for (let {
                        _lView: o
                    } of this.allViews) {
                    if (!r && !Co(o)) continue;
                    let i = r && !this.zonelessEnabled ? 0 : 1;
                    _d(o, i), n = !0
                }
                if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23) return
            }
            n || (this._rendererFactory ? .begin ? .(), this._rendererFactory ? .end ? .()), this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews()
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some(({
                    _lView: n
                }) => Co(n))) {
                this.dirtyFlags |= 2;
                return
            } else this.dirtyFlags &= -8
        }
        attachView(n) {
            let r = n;
            this._views.push(r), r.attachToAppRef(this)
        }
        detachView(n) {
            let r = n;
            bo(this._views, r), r.detachFromAppRef()
        }
        _loadComponent(n) {
            this.attachView(n.hostView);
            try {
                this.tick()
            } catch (o) {
                this.internalErrorHandler(o)
            }
            this.components.push(n), this._injector.get(rn, []).forEach(o => o(n))
        }
        ngOnDestroy() {
            if (!this._destroyed) try {
                this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy())
            } finally {
                this._destroyed = !0, this._views = [], this._destroyListeners = []
            }
        }
        onDestroy(n) {
            return this._destroyListeners.push(n), () => bo(this._destroyListeners, n)
        }
        destroy() {
            if (this._destroyed) throw new C(406, !1);
            let n = this._injector;
            n.destroy && !n.destroyed && n.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function bo(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}

function Ov(e, t, n) {
    let r = t[ot],
        o = t[b];
    if (e.loadingState !== $e.NOT_STARTED) return e.loadingPromise ? ? Promise.resolve();
    let i = Pr(t, n),
        s = KI(o, e);
    e.loadingState = $e.IN_PROGRESS, Fs(1, i);
    let a = e.dependencyResolverFn,
        c = r.get(Ms).add();
    return a ? (e.loadingPromise = Promise.allSettled(a()).then(l => {
        let u = !1,
            d = [],
            m = [];
        for (let g of l)
            if (g.status === "fulfilled") {
                let y = g.value,
                    _ = Nt(y) || hs(y);
                if (_) d.push(_);
                else {
                    let k = kl(y);
                    k && m.push(k)
                }
            } else {
                u = !0;
                break
            }
        if (u) {
            if (e.loadingState = $e.FAILED, e.errorTmplIndex === null) {
                let y = new C(-750, !1);
                Ed(t, y)
            }
        } else {
            e.loadingState = $e.COMPLETE;
            let g = s.tView;
            if (d.length > 0) {
                g.directiveRegistry = fg(g.directiveRegistry, d);
                let y = d.map(k => k.type),
                    _ = ps(!1, ...y);
                e.providers = _
            }
            m.length > 0 && (g.pipeRegistry = fg(g.pipeRegistry, m))
        }
    }), e.loadingPromise.finally(() => {
        e.loadingPromise = null, c()
    })) : (e.loadingPromise = Promise.resolve().then(() => {
        e.loadingPromise = null, e.loadingState = $e.COMPLETE, c()
    }), e.loadingPromise)
}

function o0(e, t) {
    return t[ot].get(Av, null, {
        optional: !0
    }) ? .behavior !== Ad.Manual
}

function i0(e, t, n) {
    let r = t[b],
        o = t[n.index];
    if (!o0(e, t)) return;
    let i = Pr(t, n),
        s = Bo(r, n);
    switch (jI(i), s.loadingState) {
        case $e.NOT_STARTED:
            xn(ie.Loading, n, o), Ov(s, t, n), s.loadingState === $e.IN_PROGRESS && pg(s, n, o);
            break;
        case $e.IN_PROGRESS:
            xn(ie.Loading, n, o), pg(s, n, o);
            break;
        case $e.COMPLETE:
            xn(ie.Complete, n, o);
            break;
        case $e.FAILED:
            xn(ie.Error, n, o);
            break;
        default:
    }
}
async function Pv(e, t, n) {
    let r = e.get(sa);
    if (r.hydrating.has(t)) return;
    let {
        parentBlockPromise: i,
        hydrationQueue: s
    } = c_(t, e);
    if (s.length === 0) return;
    i !== null && s.shift(), c0(r, s), i !== null && await i;
    let a = s[0];
    r.has(a) ? await gg(e, s, n) : r.awaitParentBlock(a, async () => await gg(e, s, n))
}
async function gg(e, t, n) {
    let r = e.get(sa),
        o = r.hydrating,
        i = e.get(st),
        s = i.add();
    for (let c = 0; c < t.length; c++) {
        let l = t[c],
            u = r.get(l);
        if (u != null) {
            if (await u0(u), await l0(e), s0(u)) {
                Vw(u), mg(t.slice(c), r);
                break
            }
            o.get(l).resolve()
        } else {
            a0(c, t, r), mg(t.slice(c), r);
            break
        }
    }
    let a = t[t.length - 1];
    await o.get(a) ? .promise, i.remove(s), n && n(t), jw(r.get(a), t, r, e.get(Se))
}

function s0(e) {
    return Pr(e.lView, e.tNode)[jo] === ie.Error
}

function a0(e, t, n) {
    let r = e - 1,
        o = r > -1 ? n.get(t[r]) : null;
    o && Da(o.lContainer)
}

function mg(e, t) {
    let n = t.hydrating;
    for (let r in e) n.get(r) ? .reject();
    t.cleanup(e)
}

function c0(e, t) {
    for (let n of t) e.hydrating.set(n, Promise.withResolvers())
}

function l0(e) {
    return new Promise(t => ba(t, {
        injector: e
    }))
}
async function u0(e) {
    let {
        tNode: t,
        lView: n
    } = e, r = Pr(n, t);
    return new Promise(o => {
        d0(r, o), i0(2, n, t)
    })
}

function d0(e, t) {
    Array.isArray(e[Sr]) || (e[Sr] = []), e[Sr].push(t)
}

function Hn(e, t, n, r) {
    let o = Y(),
        i = Es();
    if (_a(o, i, t)) {
        let s = Je(),
            a = ru();
        rw(a, o, e, t, n, r)
    }
    return Hn
}
var Fd = new D("", {
        providedIn: "root",
        factory: () => !1
    }),
    Ld = new D("", {
        providedIn: "root",
        factory: () => f0
    }),
    f0 = 4e3;
var Jk = typeof document < "u" && typeof document ? .documentElement ? .getAnimations == "function";

function ze(e, t, n) {
    let r = Y(),
        o = Es();
    if (_a(r, o, t)) {
        let i = Je(),
            s = ru();
        K_(s, r, e, t, r[Z], n)
    }
    return ze
}

function vg(e, t, n, r, o) {
    Dd(t, e, n, o ? "class" : "style", r)
}

function I(e, t, n, r) {
    let o = Y(),
        i = o[b],
        s = e + Q,
        a = i.firstCreatePass ? bd(s, o, 2, t, md, ys(), n, r) : i.data[s];
    if (vd(a, o, e, t, Vd), yr(a)) {
        let c = o[b];
        pa(c, o, a), td(c, a, o)
    }
    return r != null && ga(o, a), I
}

function M() {
    let e = Je(),
        t = ve(),
        n = yd(t);
    return e.firstCreatePass && Sd(e, n), ql(n) && Zl(), Gl(), n.classesWithoutHost != null && NC(n) && vg(e, n, Y(), n.classesWithoutHost, !0), n.stylesWithoutHost != null && RC(n) && vg(e, n, Y(), n.stylesWithoutHost, !1), M
}

function he(e, t, n, r) {
    return I(e, t, n, r), M(), he
}

function h(e, t, n, r) {
    let o = Y(),
        i = o[b],
        s = e + Q,
        a = i.firstCreatePass ? tI(s, i, 2, t, n, r) : i.data[s];
    return vd(a, o, e, t, Vd), r != null && ga(o, a), h
}

function p() {
    let e = ve(),
        t = yd(e);
    return ql(t) && Zl(), Gl(), p
}

function R(e, t, n, r) {
    return h(e, t, n, r), p(), R
}
var Vd = (e, t, n, r, o) => (Pt(!0), sd(t[Z], r, ou()));

function h0(e, t, n, r, o) {
    let i = !la(t, n);
    if (Pt(i), i) return sd(t[Z], r, ou());
    let s = t[Ve],
        a = ya(s, e, t, n);
    return Em(s, o) && ca(s, o, a.nextSibling), s && (Bg(n) || Ug(a)) && Rt(n) && (Dp(n), xm(a)), a
}

function kv() {
    Vd = h0
}

function Uo(e, t, n) {
    let r = Y(),
        o = r[b],
        i = e + Q,
        s = o.firstCreatePass ? bd(i, r, 8, "ng-container", md, ys(), t, n) : o.data[i];
    if (vd(s, r, e, "ng-container", Fv), yr(s)) {
        let a = r[b];
        pa(a, r, s), td(a, s, r)
    }
    return n != null && ga(r, s), Uo
}

function Ho() {
    let e = Je(),
        t = ve(),
        n = yd(t);
    return e.firstCreatePass && Sd(e, n), Ho
}
var Fv = (e, t, n, r, o) => (Pt(!0), Nm(t[Z], ""));

function p0(e, t, n, r, o) {
    let i, s = !la(t, n);
    if (Pt(s), s) return Nm(t[Z], "");
    let a = t[Ve],
        c = ya(a, e, t, n),
        l = s_(a, o);
    return ca(a, o, c), i = Ea(l, c), i
}

function Lv() {
    Fv = p0
}

function kr() {
    return Y()
}
var $o = "en-US";
var g0 = $o;

function Vv(e) {
    typeof e == "string" && (g0 = e.toLowerCase().replace(/_/g, "-"))
}

function J(e, t, n) {
    let r = Y(),
        o = Je(),
        i = ve();
    return m0(o, r, r[Z], i, e, t, n), J
}

function m0(e, t, n, r, o, i, s) {
    let a = !0,
        c = null;
    if ((r.type & 3 || s) && (c ? ? = pu(r, t, i), nI(r, e, t, s, n, o, i, c) && (a = !1)), a) {
        let l = r.outputs ? .[o],
            u = r.hostDirectiveOutputs ? .[o];
        if (u && u.length)
            for (let d = 0; d < u.length; d += 2) {
                let m = u[d],
                    g = u[d + 1];
                c ? ? = pu(r, t, i), ng(r, t, m, g, o, c)
            }
        if (l && l.length)
            for (let d of l) c ? ? = pu(r, t, i), ng(r, t, d, o, o, c)
    }
}

function on(e = 1) {
    return Op(e)
}

function Ma(e) {
    let t = wp();
    return fp(t, Q + e)
}

function Rs(e, t) {
    return e << 17 | t << 2
}

function Ln(e) {
    return e >> 17 & 32767
}

function v0(e) {
    return (e & 2) == 2
}

function y0(e, t) {
    return e & 131071 | t << 17
}

function ju(e) {
    return e | 2
}

function Nr(e) {
    return (e & 131068) >> 2
}

function yu(e, t) {
    return e & -131069 | t << 2
}

function E0(e) {
    return (e & 1) === 1
}

function Bu(e) {
    return e | 1
}

function D0(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings,
        a = Ln(s),
        c = Nr(s);
    e[r] = n;
    let l = !1,
        u;
    if (Array.isArray(n)) {
        let d = n;
        u = d[1], (u === null || gr(d, u) > 0) && (l = !0)
    } else u = n;
    if (o)
        if (c !== 0) {
            let m = Ln(e[a + 1]);
            e[r + 1] = Rs(m, a), m !== 0 && (e[m + 1] = yu(e[m + 1], r)), e[a + 1] = y0(e[a + 1], r)
        } else e[r + 1] = Rs(a, 0), a !== 0 && (e[a + 1] = yu(e[a + 1], r)), a = r;
    else e[r + 1] = Rs(c, 0), a === 0 ? a = r : e[c + 1] = yu(e[c + 1], r), c = r;
    l && (e[r + 1] = ju(e[r + 1])), yg(e, u, r, !0), yg(e, u, r, !1), C0(t, u, e, r, i), s = Rs(a, c), i ? t.classBindings = s : t.styleBindings = s
}

function C0(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && gr(i, t) >= 0 && (n[r + 1] = Bu(n[r + 1]))
}

function yg(e, t, n, r) {
    let o = e[n + 1],
        i = t === null,
        s = r ? Ln(o) : Nr(o),
        a = !1;
    for (; s !== 0 && (a === !1 || i);) {
        let c = e[s],
            l = e[s + 1];
        _0(c, t) && (a = !0, e[s + 1] = r ? Bu(l) : ju(l)), s = r ? Ln(l) : Nr(l)
    }
    a && (e[n + 1] = r ? ju(o) : Bu(o))
}

function _0(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? gr(e, t) >= 0 : !1
}

function Me(e, t) {
    return w0(e, t, null, !0), Me
}

function w0(e, t, n, r) {
    let o = Y(),
        i = Je(),
        s = bp(2);
    if (i.firstUpdatePass && b0(i, e, s, r), t !== en && _a(o, s, t)) {
        let a = i.data[Rn()];
        N0(i, a, o, o[Z], e, o[s + 1] = R0(t, n), r, s)
    }
}

function I0(e, t) {
    return t >= e.expandoStartIndex
}

function b0(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
        let i = o[Rn()],
            s = I0(e, n);
        x0(i, r) && t === null && !s && (t = !1), t = S0(o, i, t, r), D0(o, i, t, n, s, r)
    }
}

function S0(e, t, n, r) {
    let o = Ap(e),
        i = r ? t.residualClasses : t.residualStyles;
    if (o === null)(r ? t.classBindings : t.styleBindings) === 0 && (n = Eu(null, e, t, n, r), n = No(n, t.attrs, r), i = null);
    else {
        let s = t.directiveStylingLast;
        if (s === -1 || e[s] !== o)
            if (n = Eu(o, e, t, n, r), i === null) {
                let c = M0(e, t, r);
                c !== void 0 && Array.isArray(c) && (c = Eu(null, e, t, c[1], r), c = No(c, t.attrs, r), T0(e, t, r, c))
            } else i = A0(e, t, r)
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i), n
}

function M0(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (Nr(r) !== 0) return e[Ln(r)]
}

function T0(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[Ln(o)] = r
}

function A0(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
        let s = e[i].hostAttrs;
        r = No(r, s, n)
    }
    return No(r, t.attrs, n)
}

function Eu(e, t, n, r, o) {
    let i = null,
        s = n.directiveEnd,
        a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], r = No(r, i.hostAttrs, o), i !== e);) a++;
    return e !== null && (n.directiveStylingLast = a), r
}

function No(e, t, n) {
    let r = n ? 1 : 2,
        o = -1;
    if (t !== null)
        for (let i = 0; i < t.length; i++) {
            let s = t[i];
            typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), np(e, s, n ? !0 : t[++i]))
        }
    return e === void 0 ? null : e
}

function N0(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3)) return;
    let c = e.data,
        l = c[a + 1],
        u = E0(l) ? Eg(c, t, n, o, Nr(l), s) : void 0;
    if (!ea(u)) {
        ea(i) || v0(l) && (i = Eg(c, null, n, o, a, s));
        let d = Ul(Rn(), n);
        W_(r, s, d, o, i)
    }
}

function Eg(e, t, n, r, o, i) {
    let s = t === null,
        a;
    for (; o > 0;) {
        let c = e[o],
            l = Array.isArray(c),
            u = l ? c[1] : c,
            d = u === null,
            m = n[o + 1];
        m === en && (m = d ? Le : void 0);
        let g = d ? fs(m, r) : u === r ? m : void 0;
        if (l && !ea(g) && (g = fs(c, r)), ea(g) && (a = g, s)) return a;
        let y = e[o + 1];
        o = s ? Ln(y) : Nr(y)
    }
    if (t !== null) {
        let c = i ? t.residualClasses : t.residualStyles;
        c != null && (a = fs(c, r))
    }
    return a
}

function ea(e) {
    return e !== void 0
}

function R0(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = At(ko(e)))), e
}

function x0(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0
}

function f(e, t = "") {
    let n = Y(),
        r = Je(),
        o = e + Q,
        i = r.firstCreatePass ? va(r, o, 1, t, null) : r.data[o],
        s = jv(r, n, i, t, e);
    n[o] = s, ws() && pd(r, n, s, i), Cr(i, !1)
}
var jv = (e, t, n, r, o) => (Pt(!0), Am(t[Z], r));

function O0(e, t, n, r, o) {
    let i = !la(t, n);
    if (Pt(i), i) return Am(t[Z], r);
    let s = t[Ve];
    return ya(s, e, t, n)
}

function Bv() {
    jv = O0
}

function P0(e, t, n, r = "") {
    return _a(e, Es(), n) ? t + ho(n) + r : en
}

function wt(e) {
    return zo("", e), wt
}

function zo(e, t, n) {
    let r = Y(),
        o = P0(r, e, t, n);
    return o !== en && k0(r, Rn(), o), zo
}

function k0(e, t, n) {
    let r = Ul(t, e);
    M_(e[Z], r, n)
}

function F0(e, t, n) {
    let r = Je();
    if (r.firstCreatePass) {
        let o = vt(e);
        Uu(n, r.data, r.blueprint, o, !0), Uu(t, r.data, r.blueprint, o, !1)
    }
}

function Uu(e, t, n, r, o) {
    if (e = me(e), Array.isArray(e))
        for (let i = 0; i < e.length; i++) Uu(e[i], t, n, r, o);
    else {
        let i = Je(),
            s = Y(),
            a = ve(),
            c = Cn(e) ? e : me(e.provide),
            l = Ll(e),
            u = a.providerIndexes & 1048575,
            d = a.directiveStart,
            m = a.providerIndexes >> 20;
        if (Cn(e) || !e.multi) {
            let g = new Pn(l, o, $, null),
                y = Cu(c, t, o ? u : u + m, d);
            y === -1 ? (wu(Bs(a, s), i, c), Du(i, e, t.length), t.push(c), a.directiveStart++, a.directiveEnd++, o && (a.providerIndexes += 1048576), n.push(g), s.push(g)) : (n[y] = g, s[y] = g)
        } else {
            let g = Cu(c, t, u + m, d),
                y = Cu(c, t, u, u + m),
                _ = g >= 0 && n[g],
                k = y >= 0 && n[y];
            if (o && !k || !o && !_) {
                wu(Bs(a, s), i, c);
                let L = j0(o ? V0 : L0, n.length, o, r, l, e);
                !o && k && (n[y].providerFactory = L), Du(i, e, t.length, 0), t.push(c), a.directiveStart++, a.directiveEnd++, o && (a.providerIndexes += 1048576), n.push(L), s.push(L)
            } else {
                let L = Uv(n[o ? y : g], l, !o && r);
                Du(i, e, g > -1 ? g : y, L)
            }!o && r && k && n[y].componentProviders++
        }
    }
}

function Du(e, t, n, r) {
    let o = Cn(t),
        i = ap(t);
    if (o || i) {
        let c = (i ? me(t.useClass) : t).prototype.ngOnDestroy;
        if (c) {
            let l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
                let u = l.indexOf(n);
                u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c)
            } else l.push(n, c)
        }
    }
}

function Uv(e, t, n) {
    return n && e.componentProviders++, e.multi.push(t) - 1
}

function Cu(e, t, n, r) {
    for (let o = n; o < r; o++)
        if (t[o] === e) return o;
    return -1
}

function L0(e, t, n, r, o) {
    return Hu(this.multi, [])
}

function V0(e, t, n, r, o) {
    let i = this.multi,
        s;
    if (this.providerFactory) {
        let a = this.providerFactory.componentProviders,
            c = Us(r, r[b], this.providerFactory.index, o);
        s = c.slice(0, a), Hu(i, s);
        for (let l = a; l < c.length; l++) s.push(c[l])
    } else s = [], Hu(i, s);
    return s
}

function Hu(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r())
    }
    return t
}

function j0(e, t, n, r, o, i) {
    let s = new Pn(e, n, $, null);
    return s.multi = [], s.index = t, s.componentProviders = 0, Uv(s, o, r && !n), s
}

function $n(e, t = []) {
    return n => {
        n.providersResolver = (r, o) => F0(r, o ? o(e) : e, t)
    }
}
var ta = class {
        ngModuleFactory;
        componentFactories;
        constructor(t, n) {
            this.ngModuleFactory = t, this.componentFactories = n
        }
    },
    jd = (() => {
        class e {
            compileModuleSync(n) {
                return new Ks(n)
            }
            compileModuleAsync(n) {
                return Promise.resolve(this.compileModuleSync(n))
            }
            compileModuleAndAllComponentsSync(n) {
                let r = this.compileModuleSync(n),
                    o = Pl(n),
                    i = Mm(o.declarations).reduce((s, a) => {
                        let c = Nt(a);
                        return c && s.push(new Ar(c)), s
                    }, []);
                return new ta(r, i)
            }
            compileModuleAndAllComponentsAsync(n) {
                return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
            }
            clearCache() {}
            clearCacheFor(n) {}
            getModuleId(n) {}
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();
var B0 = (() => {
    class e {
        zone = v(ee);
        changeDetectionScheduler = v(ft);
        applicationRef = v(Se);
        applicationErrorHandler = v(be);
        _onMicrotaskEmptySubscription;
        initialize() {
            this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                next: () => {
                    this.changeDetectionScheduler.runningTick || this.zone.run(() => {
                        try {
                            this.applicationRef.dirtyFlags |= 1, this.applicationRef._tick()
                        } catch (n) {
                            this.applicationErrorHandler(n)
                        }
                    })
                }
            }))
        }
        ngOnDestroy() {
            this._onMicrotaskEmptySubscription ? .unsubscribe()
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function Hv({
    ngZoneFactory: e,
    ignoreChangesOutsideZone: t,
    scheduleInRootZone: n
}) {
    return e ? ? = () => new ee(V(E({}, $v()), {
        scheduleInRootZone: n
    })), [{
        provide: ee,
        useFactory: e
    }, {
        provide: qe,
        multi: !0,
        useFactory: () => {
            let r = v(B0, {
                optional: !0
            });
            return () => r.initialize()
        }
    }, {
        provide: qe,
        multi: !0,
        useFactory: () => {
            let r = v(U0);
            return () => {
                r.initialize()
            }
        }
    }, t === !0 ? {
        provide: au,
        useValue: !0
    } : [], {
        provide: bs,
        useValue: n ? ? wv
    }, {
        provide: be,
        useFactory: () => {
            let r = v(ee),
                o = v(de),
                i;
            return s => {
                r.runOutsideAngular(() => {
                    o.destroyed && !i ? setTimeout(() => {
                        throw s
                    }) : (i ? ? = o.get(nt), i.handleError(s))
                })
            }
        }
    }]
}

function $v(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e ? .eventCoalescing ? ? !1,
        shouldCoalesceRunChangeDetection: e ? .runCoalescing ? ? !1
    }
}
var U0 = (() => {
    class e {
        subscription = new te;
        initialized = !1;
        zone = v(ee);
        pendingTasks = v(st);
        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let n = null;
            !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => {
                this.subscription.add(this.zone.onStable.subscribe(() => {
                    ee.assertNotInAngularZone(), queueMicrotask(() => {
                        n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null)
                    })
                }))
            }), this.subscription.add(this.zone.onUnstable.subscribe(() => {
                ee.assertInAngularZone(), n ? ? = this.pendingTasks.add()
            }))
        }
        ngOnDestroy() {
            this.subscription.unsubscribe()
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();
var Bd = (() => {
    class e {
        applicationErrorHandler = v(be);
        appRef = v(Se);
        taskService = v(st);
        ngZone = v(ee);
        zonelessEnabled = v(_r);
        tracing = v(Un, {
            optional: !0
        });
        disableScheduling = v(au, {
            optional: !0
        }) ? ? !1;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{
            data: {
                __scheduler_tick__: !0
            }
        }];
        subscriptions = new te;
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner ? .get(Js) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (v(bs, {
            optional: !0
        }) ? ? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
                this.runningTick || this.cleanup()
            })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
                this.runningTick || this.cleanup()
            })), this.disableScheduling || = !this.zonelessEnabled && (this.ngZone instanceof Ao || !this.zoneIsDefined)
        }
        notify(n) {
            if (!this.zonelessEnabled && n === 5) return;
            let r = !1;
            switch (n) {
                case 0:
                    {
                        this.appRef.dirtyFlags |= 2;
                        break
                    }
                case 3:
                case 2:
                case 4:
                case 5:
                case 1:
                    {
                        this.appRef.dirtyFlags |= 4;
                        break
                    }
                case 6:
                    {
                        this.appRef.dirtyFlags |= 2,
                        r = !0;
                        break
                    }
                case 12:
                    {
                        this.appRef.dirtyFlags |= 16,
                        r = !0;
                        break
                    }
                case 13:
                    {
                        this.appRef.dirtyFlags |= 2,
                        r = !0;
                        break
                    }
                case 11:
                    {
                        r = !0;
                        break
                    }
                case 9:
                case 8:
                case 7:
                case 10:
                default:
                    this.appRef.dirtyFlags |= 8
            }
            if (this.appRef.tracingSnapshot = this.tracing ? .snapshot(this.appRef.tracingSnapshot) ? ? null, !this.shouldScheduleTick(r)) return;
            let o = this.useMicrotaskScheduler ? cg : Iv;
            this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick()))
        }
        shouldScheduleTick(n) {
            return !(this.disableScheduling && !n || this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(Js + this.angularZoneId))
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed) return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return
            }!this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
                this.ngZone.run(() => {
                    this.runningTick = !0, this.appRef._tick()
                }, void 0, this.schedulerTickApplyArgs)
            } catch (r) {
                this.taskService.remove(n), this.applicationErrorHandler(r)
            } finally {
                this.cleanup()
            }
            this.useMicrotaskScheduler = !0, cg(() => {
                this.useMicrotaskScheduler = !1, this.taskService.remove(n)
            })
        }
        ngOnDestroy() {
            this.subscriptions.unsubscribe(), this.cleanup()
        }
        cleanup() {
            if (this.runningTick = !1, this.cancelScheduledCallback ? .(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
                let n = this.pendingRenderTaskId;
                this.pendingRenderTaskId = null, this.taskService.remove(n)
            }
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function Ud() {
    return Lt("NgZoneless"), rt([{
            provide: ft,
            useExisting: Bd
        }, {
            provide: ee,
            useClass: Ao
        }, {
            provide: _r,
            useValue: !0
        }, {
            provide: bs,
            useValue: !1
        },
        []
    ])
}

function H0() {
    return typeof $localize < "u" && $localize.locale || $o
}
var Ta = new D("", {
    providedIn: "root",
    factory: () => v(Ta, {
        optional: !0,
        skipSelf: !0
    }) || H0()
});

function ge(e) {
    return qh(e)
}

function zn(e, t) {
    return xi(e, t ? .equal)
}
var zv = class {
    [_e];
    constructor(t) {
        this[_e] = t
    }
    destroy() {
        this[_e].destroy()
    }
};
var Wd = {
        JSACTION: "__jsaction",
        OWNER: "__owner"
    },
    Zv = {};

function $0(e) {
    return e[Wd.JSACTION]
}

function Gv(e, t) {
    e[Wd.JSACTION] = t
}

function z0(e) {
    return Zv[e]
}

function G0(e, t) {
    Zv[e] = t
}
var S = {
        AUXCLICK: "auxclick",
        CHANGE: "change",
        CLICK: "click",
        CLICKMOD: "clickmod",
        CLICKONLY: "clickonly",
        DBLCLICK: "dblclick",
        FOCUS: "focus",
        FOCUSIN: "focusin",
        BLUR: "blur",
        FOCUSOUT: "focusout",
        SUBMIT: "submit",
        KEYDOWN: "keydown",
        KEYPRESS: "keypress",
        KEYUP: "keyup",
        MOUSEUP: "mouseup",
        MOUSEDOWN: "mousedown",
        MOUSEOVER: "mouseover",
        MOUSEOUT: "mouseout",
        MOUSEENTER: "mouseenter",
        MOUSELEAVE: "mouseleave",
        MOUSEMOVE: "mousemove",
        POINTERUP: "pointerup",
        POINTERDOWN: "pointerdown",
        POINTEROVER: "pointerover",
        POINTEROUT: "pointerout",
        POINTERENTER: "pointerenter",
        POINTERLEAVE: "pointerleave",
        POINTERMOVE: "pointermove",
        POINTERCANCEL: "pointercancel",
        GOTPOINTERCAPTURE: "gotpointercapture",
        LOSTPOINTERCAPTURE: "lostpointercapture",
        ERROR: "error",
        LOAD: "load",
        UNLOAD: "unload",
        TOUCHSTART: "touchstart",
        TOUCHEND: "touchend",
        TOUCHMOVE: "touchmove",
        INPUT: "input",
        SCROLL: "scroll",
        TOGGLE: "toggle",
        CUSTOM: "_custom"
    },
    W0 = [S.MOUSEENTER, S.MOUSELEAVE, "pointerenter", "pointerleave"],
    uF = [S.CLICK, S.DBLCLICK, S.FOCUSIN, S.FOCUSOUT, S.KEYDOWN, S.KEYUP, S.KEYPRESS, S.MOUSEOVER, S.MOUSEOUT, S.SUBMIT, S.TOUCHSTART, S.TOUCHEND, S.TOUCHMOVE, "touchcancel", "auxclick", "change", "compositionstart", "compositionupdate", "compositionend", "beforeinput", "input", "select", "copy", "cut", "paste", "mousedown", "mouseup", "wheel", "contextmenu", "dragover", "dragenter", "dragleave", "drop", "dragstart", "dragend", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout", "gotpointercapture", "lostpointercapture", "ended", "loadedmetadata", "pagehide", "pageshow", "visibilitychange", "beforematch"],
    q0 = [S.FOCUS, S.BLUR, S.ERROR, S.LOAD, S.TOGGLE],
    qd = e => q0.indexOf(e) >= 0;

function Z0(e) {
    return e === S.MOUSEENTER ? S.MOUSEOVER : e === S.MOUSELEAVE ? S.MOUSEOUT : e === S.POINTERENTER ? S.POINTEROVER : e === S.POINTERLEAVE ? S.POINTEROUT : e
}

function Y0(e, t, n, r) {
    let o = !1;
    qd(t) && (o = !0);
    let i = typeof r == "boolean" ? {
        capture: o,
        passive: r
    } : o;
    return e.addEventListener(t, n, i), {
        eventType: t,
        handler: n,
        capture: o,
        passive: r
    }
}

function Q0(e, t) {
    if (e.removeEventListener) {
        let n = typeof t.passive == "boolean" ? {
            capture: t.capture
        } : t.capture;
        e.removeEventListener(t.eventType, t.handler, n)
    } else e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler)
}

function K0(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = !1
}
var Wv = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);

function J0(e) {
    return e.which === 2 || e.which == null && e.button === 4
}

function X0(e) {
    return Wv && e.metaKey || !Wv && e.ctrlKey || J0(e) || e.shiftKey
}

function eb(e, t, n) {
    let r = e.relatedTarget;
    return (e.type === S.MOUSEOVER && t === S.MOUSEENTER || e.type === S.MOUSEOUT && t === S.MOUSELEAVE || e.type === S.POINTEROVER && t === S.POINTERENTER || e.type === S.POINTEROUT && t === S.POINTERLEAVE) && (!r || r !== n && !n.contains(r))
}

function tb(e, t) {
    let n = {};
    for (let r in e) {
        if (r === "srcElement" || r === "target") continue;
        let o = r,
            i = e[o];
        typeof i != "function" && (n[o] = i)
    }
    return e.type === S.MOUSEOVER ? n.type = S.MOUSEENTER : e.type === S.MOUSEOUT ? n.type = S.MOUSELEAVE : e.type === S.POINTEROVER ? n.type = S.POINTERENTER : n.type = S.POINTERLEAVE, n.target = n.srcElement = t, n.bubbles = !1, n._originalEvent = e, n
}
var nb = typeof navigator < "u" && /iPhone|iPad|iPod/.test(navigator.userAgent),
    xa = class {
        element;
        handlerInfos = [];
        constructor(t) {
            this.element = t
        }
        addEventListener(t, n, r) {
            nb && (this.element.style.cursor = "pointer"), this.handlerInfos.push(Y0(this.element, t, n(this.element), r))
        }
        cleanUp() {
            for (let t = 0; t < this.handlerInfos.length; t++) Q0(this.element, this.handlerInfos[t]);
            this.handlerInfos = []
        }
    },
    rb = {
        NAMESPACE_ACTION_SEPARATOR: ".",
        EVENT_ACTION_SEPARATOR: ":"
    };

function sn(e) {
    return e.eventType
}

function Zd(e, t) {
    e.eventType = t
}

function Na(e) {
    return e.event
}

function Yv(e, t) {
    e.event = t
}

function Qv(e) {
    return e.targetElement
}

function Kv(e, t) {
    e.targetElement = t
}

function Jv(e) {
    return e.eic
}

function ob(e, t) {
    e.eic = t
}

function ib(e) {
    return e.timeStamp
}

function sb(e, t) {
    e.timeStamp = t
}

function Ra(e) {
    return e.eia
}

function Xv(e, t, n) {
    e.eia = [t, n]
}

function Hd(e) {
    e.eia = void 0
}

function Aa(e) {
    return e[1]
}

function ab(e) {
    return e.eirp
}

function ey(e, t) {
    e.eirp = t
}

function ty(e) {
    return e.eir
}

function ny(e, t) {
    e.eir = t
}

function ry(e) {
    return {
        eventType: e.eventType,
        event: e.event,
        targetElement: e.targetElement,
        eic: e.eic,
        eia: e.eia,
        timeStamp: e.timeStamp,
        eirp: e.eirp,
        eiack: e.eiack,
        eir: e.eir
    }
}

function cb(e, t, n, r, o, i, s, a) {
    return {
        eventType: e,
        event: t,
        targetElement: n,
        eic: r,
        timeStamp: o,
        eia: i,
        eirp: s,
        eiack: a
    }
}
var $d = class e {
        eventInfo;
        constructor(t) {
            this.eventInfo = t
        }
        getEventType() {
            return sn(this.eventInfo)
        }
        setEventType(t) {
            Zd(this.eventInfo, t)
        }
        getEvent() {
            return Na(this.eventInfo)
        }
        setEvent(t) {
            Yv(this.eventInfo, t)
        }
        getTargetElement() {
            return Qv(this.eventInfo)
        }
        setTargetElement(t) {
            Kv(this.eventInfo, t)
        }
        getContainer() {
            return Jv(this.eventInfo)
        }
        setContainer(t) {
            ob(this.eventInfo, t)
        }
        getTimestamp() {
            return ib(this.eventInfo)
        }
        setTimestamp(t) {
            sb(this.eventInfo, t)
        }
        getAction() {
            let t = Ra(this.eventInfo);
            if (t) return {
                name: t[0],
                element: t[1]
            }
        }
        setAction(t) {
            if (!t) {
                Hd(this.eventInfo);
                return
            }
            Xv(this.eventInfo, t.name, t.element)
        }
        getIsReplay() {
            return ab(this.eventInfo)
        }
        setIsReplay(t) {
            ey(this.eventInfo, t)
        }
        getResolved() {
            return ty(this.eventInfo)
        }
        setResolved(t) {
            ny(this.eventInfo, t)
        }
        clone() {
            return new e(ry(this.eventInfo))
        }
    },
    lb = {},
    ub = /\s*;\s*/,
    db = S.CLICK,
    zd = class {
        a11yClickSupport = !1;
        clickModSupport = !0;
        syntheticMouseEventSupport;
        updateEventInfoForA11yClick = void 0;
        preventDefaultForA11yClick = void 0;
        populateClickOnlyAction = void 0;
        constructor({
            syntheticMouseEventSupport: t = !1,
            clickModSupport: n = !0
        } = {}) {
            this.syntheticMouseEventSupport = t, this.clickModSupport = n
        }
        resolveEventType(t) {
            this.clickModSupport && sn(t) === S.CLICK && X0(Na(t)) ? Zd(t, S.CLICKMOD) : this.a11yClickSupport && this.updateEventInfoForA11yClick(t)
        }
        resolveAction(t) {
            ty(t) || (this.populateAction(t, Qv(t)), ny(t, !0))
        }
        resolveParentAction(t) {
            let n = Ra(t),
                r = n && Aa(n);
            Hd(t);
            let o = r && this.getParentNode(r);
            o && this.populateAction(t, o)
        }
        populateAction(t, n) {
            let r = n;
            for (; r && r !== Jv(t) && (r.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(r, t), !Ra(t));) r = this.getParentNode(r);
            let o = Ra(t);
            if (o && (this.a11yClickSupport && this.preventDefaultForA11yClick(t), this.syntheticMouseEventSupport && (sn(t) === S.MOUSEENTER || sn(t) === S.MOUSELEAVE || sn(t) === S.POINTERENTER || sn(t) === S.POINTERLEAVE)))
                if (eb(Na(t), sn(t), Aa(o))) {
                    let i = tb(Na(t), Aa(o));
                    Yv(t, i), Kv(t, Aa(o))
                } else Hd(t)
        }
        getParentNode(t) {
            let n = t[Wd.OWNER];
            if (n) return n;
            let r = t.parentNode;
            return r ? .nodeName === "#document-fragment" ? r ? .host ? ? null : r
        }
        populateActionOnElement(t, n) {
            let r = this.parseActions(t),
                o = r[sn(n)];
            o !== void 0 && Xv(n, o, t), this.a11yClickSupport && this.populateClickOnlyAction(t, n, r)
        }
        parseActions(t) {
            let n = $0(t);
            if (!n) {
                let r = t.getAttribute(Ts.JSACTION);
                if (!r) n = lb, Gv(t, n);
                else {
                    if (n = z0(r), !n) {
                        n = {};
                        let o = r.split(ub);
                        for (let i = 0; i < o.length; i++) {
                            let s = o[i];
                            if (!s) continue;
                            let a = s.indexOf(rb.EVENT_ACTION_SEPARATOR),
                                c = a !== -1,
                                l = c ? s.substr(0, a).trim() : db,
                                u = c ? s.substr(a + 1).trim() : s;
                            n[l] = u
                        }
                        G0(r, n)
                    }
                    Gv(t, n)
                }
            }
            return n
        }
        addA11yClickSupport(t, n, r) {
            this.a11yClickSupport = !0, this.updateEventInfoForA11yClick = t, this.preventDefaultForA11yClick = n, this.populateClickOnlyAction = r
        }
    },
    oy = (function(e) {
        return e[e.I_AM_THE_JSACTION_FRAMEWORK = 0] = "I_AM_THE_JSACTION_FRAMEWORK", e
    })(oy || {}),
    Gd = class {
        dispatchDelegate;
        actionResolver;
        eventReplayer;
        eventReplayScheduled = !1;
        replayEventInfoWrappers = [];
        constructor(t, {
            actionResolver: n,
            eventReplayer: r
        } = {}) {
            this.dispatchDelegate = t, this.actionResolver = n, this.eventReplayer = r
        }
        dispatch(t) {
            let n = new $d(t);
            this.actionResolver ? .resolveEventType(t), this.actionResolver ? .resolveAction(t);
            let r = n.getAction();
            if (r && fb(r.element, n) && K0(n.getEvent()), this.eventReplayer && n.getIsReplay()) {
                this.scheduleEventInfoWrapperReplay(n);
                return
            }
            this.dispatchDelegate(n)
        }
        scheduleEventInfoWrapperReplay(t) {
            this.replayEventInfoWrappers.push(t), !this.eventReplayScheduled && (this.eventReplayScheduled = !0, Promise.resolve().then(() => {
                this.eventReplayScheduled = !1, this.eventReplayer(this.replayEventInfoWrappers)
            }))
        }
    };

function fb(e, t) {
    return e.tagName === "A" && (t.getEventType() === S.CLICK || t.getEventType() === S.CLICKMOD)
}
var iy = Symbol.for("propagationStopped"),
    Yd = {
        REPLAY: 101
    };
var hb = "`preventDefault` called during event replay.";
var pb = "`composedPath` called during event replay.",
    Oa = class {
        dispatchDelegate;
        clickModSupport;
        actionResolver;
        dispatcher;
        constructor(t, n = !0) {
            this.dispatchDelegate = t, this.clickModSupport = n, this.actionResolver = new zd({
                clickModSupport: n
            }), this.dispatcher = new Gd(r => {
                this.dispatchToDelegate(r)
            }, {
                actionResolver: this.actionResolver
            })
        }
        dispatch(t) {
            this.dispatcher.dispatch(t)
        }
        dispatchToDelegate(t) {
            for (t.getIsReplay() && vb(t), gb(t); t.getAction();) {
                if (yb(t), qd(t.getEventType()) && t.getAction().element !== t.getTargetElement() || (this.dispatchDelegate(t.getEvent(), t.getAction().name), mb(t))) return;
                this.actionResolver.resolveParentAction(t.eventInfo)
            }
        }
    };

function gb(e) {
    let t = e.getEvent(),
        n = e.getEvent().stopPropagation.bind(t),
        r = () => {
            t[iy] = !0, n()
        };
    Gn(t, "stopPropagation", r), Gn(t, "stopImmediatePropagation", r)
}

function mb(e) {
    return !!e.getEvent()[iy]
}

function vb(e) {
    let t = e.getEvent(),
        n = e.getTargetElement(),
        r = t.preventDefault.bind(t);
    Gn(t, "target", n), Gn(t, "eventPhase", Yd.REPLAY), Gn(t, "preventDefault", () => {
        throw r(), new Error(hb + "")
    }), Gn(t, "composedPath", () => {
        throw new Error(pb + "")
    })
}

function yb(e) {
    let t = e.getEvent(),
        n = e.getAction() ? .element;
    n && Gn(t, "currentTarget", n, {
        configurable: !0
    })
}

function Gn(e, t, n, {
    configurable: r = !1
} = {}) {
    Object.defineProperty(e, t, {
        value: n,
        configurable: r
    })
}

function sy(e, t) {
    e.ecrd(n => {
        t.dispatch(n)
    }, oy.I_AM_THE_JSACTION_FRAMEWORK)
}

function Eb(e) {
    return e ? .q ? ? []
}

function Db(e) {
    e && (qv(e.c, e.et, e.h), qv(e.c, e.etc, e.h, !0))
}

function qv(e, t, n, r) {
    for (let o = 0; o < t.length; o++) e.removeEventListener(t[o], n, r)
}
var Cb = !1,
    ay = (() => {
        class e {
            static MOUSE_SPECIAL_SUPPORT = Cb;
            containerManager;
            eventHandlers = {};
            browserEventTypeToExtraEventTypes = {};
            dispatcher = null;
            queuedEventInfos = [];
            constructor(n) {
                this.containerManager = n
            }
            handleEvent(n, r, o) {
                let i = cb(n, r, r.target, o, Date.now());
                this.handleEventInfo(i)
            }
            handleEventInfo(n) {
                if (!this.dispatcher) {
                    ey(n, !0), this.queuedEventInfos ? .push(n);
                    return
                }
                this.dispatcher(n)
            }
            addEvent(n, r, o) {
                if (n in this.eventHandlers || !this.containerManager || !e.MOUSE_SPECIAL_SUPPORT && W0.indexOf(n) >= 0) return;
                let i = (a, c, l) => {
                    this.handleEvent(a, c, l)
                };
                this.eventHandlers[n] = i;
                let s = Z0(r || n);
                if (s !== n) {
                    let a = this.browserEventTypeToExtraEventTypes[s] || [];
                    a.push(n), this.browserEventTypeToExtraEventTypes[s] = a
                }
                this.containerManager.addEventListener(s, a => c => {
                    i(n, c, a)
                }, o)
            }
            replayEarlyEvents(n = window._ejsa) {
                n && (this.replayEarlyEventInfos(n.q), Db(n), delete window._ejsa)
            }
            replayEarlyEventInfos(n) {
                for (let r = 0; r < n.length; r++) {
                    let o = n[r],
                        i = this.getEventTypesForBrowserEventType(o.eventType);
                    for (let s = 0; s < i.length; s++) {
                        let a = ry(o);
                        Zd(a, i[s]), this.handleEventInfo(a)
                    }
                }
            }
            getEventTypesForBrowserEventType(n) {
                let r = [];
                return this.eventHandlers[n] && r.push(n), this.browserEventTypeToExtraEventTypes[n] && r.push(...this.browserEventTypeToExtraEventTypes[n]), r
            }
            handler(n) {
                return this.eventHandlers[n]
            }
            cleanUp() {
                this.containerManager ? .cleanUp(), this.containerManager = null, this.eventHandlers = {}, this.browserEventTypeToExtraEventTypes = {}, this.dispatcher = null, this.queuedEventInfos = []
            }
            registerDispatcher(n, r) {
                this.ecrd(n, r)
            }
            ecrd(n, r) {
                if (this.dispatcher = n, this.queuedEventInfos ? .length) {
                    for (let o = 0; o < this.queuedEventInfos.length; o++) this.handleEventInfo(this.queuedEventInfos[o]);
                    this.queuedEventInfos = null
                }
            }
        }
        return e
    })();

function cy(e, t = window) {
    return Eb(t._ejsas ? .[e])
}

function Qd(e, t = window) {
    t._ejsas && (t._ejsas[e] = void 0)
}
var my = Symbol("InputSignalNode#UNSET"),
    Kb = V(E({}, Oi), {
        transformFn: void 0,
        applyValueToInputSignal(e, t) {
            tr(e, t)
        }
    });

function vy(e, t) {
    let n = Object.create(Kb);
    n.value = e, n.transformFn = t ? .transform;

    function r() {
        if (Jn(n), n.value === my) {
            let o = null;
            throw new C(-950, o)
        }
        return n.value
    }
    return r[_e] = n, r
}
var La = class {
        attributeName;
        constructor(t) {
            this.attributeName = t
        }
        __NG_ELEMENT_ID__ = () => Ro(this.attributeName);
        toString() {
            return `HostAttributeToken ${this.attributeName}`
        }
    },
    Jb = new D("");
Jb.__NG_ELEMENT_ID__ = e => {
    let t = ve();
    if (t === null) throw new C(204, !1);
    if (t.type & 2) return t.value;
    if (e & 8) return null;
    throw new C(204, !1)
};

function ly(e, t) {
    return vy(e, t)
}

function Xb(e) {
    return vy(my, e)
}
var yy = (ly.required = Xb, ly);
var Kd = new D(""),
    eS = new D("");

function Go(e) {
    return !e.moduleRef
}

function tS(e) {
    let t = Go(e) ? e.r3Injector : e.moduleRef.injector,
        n = t.get(ee);
    return n.run(() => {
        Go(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
        let r = t.get(be),
            o;
        if (n.runOutsideAngular(() => {
                o = n.onError.subscribe({
                    next: r
                })
            }), Go(e)) {
            let i = () => t.destroy(),
                s = e.platformInjector.get(Kd);
            s.add(i), t.onDestroy(() => {
                o.unsubscribe(), s.delete(i)
            })
        } else {
            let i = () => e.moduleRef.destroy(),
                s = e.platformInjector.get(Kd);
            s.add(i), e.moduleRef.onDestroy(() => {
                bo(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i)
            })
        }
        return rS(r, n, () => {
            let i = t.get(st),
                s = i.add(),
                a = t.get(kd);
            return a.runInitializers(), a.donePromise.then(() => {
                let c = t.get(Ta, $o);
                if (Vv(c || $o), !t.get(eS, !0)) return Go(e) ? t.get(Se) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
                if (Go(e)) {
                    let u = t.get(Se);
                    return e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u
                } else return nS ? .(e.moduleRef, e.allPlatformModules), e.moduleRef
            }).finally(() => void i.remove(s))
        })
    })
}
var nS;

function rS(e, t, n) {
    try {
        let r = n();
        return nn(r) ? r.catch(o => {
            throw t.runOutsideAngular(() => e(o)), o
        }) : r
    } catch (r) {
        throw t.runOutsideAngular(() => e(r)), r
    }
}
var ka = null;

function oS(e = [], t) {
    return Re.create({
        name: t,
        providers: [{
            provide: go,
            useValue: "platform"
        }, {
            provide: Kd,
            useValue: new Set([() => ka = null])
        }, ...e]
    })
}

function iS(e = []) {
    if (ka) return ka;
    let t = oS(e);
    return ka = t, Rv(), sS(t), t
}

function sS(e) {
    let t = e.get(ra, null);
    De(e, () => {
        t ? .forEach(n => n())
    })
}
var Fr = (() => {
    class e {
        static __NG_ELEMENT_ID__ = aS
    }
    return e
})();

function aS(e) {
    return cS(ve(), Y(), (e & 16) === 16)
}

function cS(e, t, n) {
    if (Rt(e) && !n) {
        let r = Ke(e.index, t);
        return new Kt(r, r)
    } else if (e.type & 175) {
        let r = t[xe];
        return new Kt(r, t)
    }
    return null
}
var Jd = class {
        constructor() {}
        supports(t) {
            return Md(t)
        }
        create(t) {
            return new Xd(t)
        }
    },
    lS = (e, t) => t,
    Xd = class {
        length = 0;
        collection;
        _linkedRecords = null;
        _unlinkedRecords = null;
        _previousItHead = null;
        _itHead = null;
        _itTail = null;
        _additionsHead = null;
        _additionsTail = null;
        _movesHead = null;
        _movesTail = null;
        _removalsHead = null;
        _removalsTail = null;
        _identityChangesHead = null;
        _identityChangesTail = null;
        _trackByFn;
        constructor(t) {
            this._trackByFn = t || lS
        }
        forEachItem(t) {
            let n;
            for (n = this._itHead; n !== null; n = n._next) t(n)
        }
        forEachOperation(t) {
            let n = this._itHead,
                r = this._removalsHead,
                o = 0,
                i = null;
            for (; n || r;) {
                let s = !r || n && n.currentIndex < uy(r, o, i) ? n : r,
                    a = uy(s, o, i),
                    c = s.currentIndex;
                if (s === r) o--, r = r._nextRemoved;
                else if (n = n._next, s.previousIndex == null) o++;
                else {
                    i || (i = []);
                    let l = a - o,
                        u = c - o;
                    if (l != u) {
                        for (let m = 0; m < l; m++) {
                            let g = m < i.length ? i[m] : i[m] = 0,
                                y = g + m;
                            u <= y && y < l && (i[m] = g + 1)
                        }
                        let d = s.previousIndex;
                        i[d] = u - l
                    }
                }
                a !== c && t(s, a, c)
            }
        }
        forEachPreviousItem(t) {
            let n;
            for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n)
        }
        forEachAddedItem(t) {
            let n;
            for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n)
        }
        forEachMovedItem(t) {
            let n;
            for (n = this._movesHead; n !== null; n = n._nextMoved) t(n)
        }
        forEachRemovedItem(t) {
            let n;
            for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n)
        }
        forEachIdentityChange(t) {
            let n;
            for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange) t(n)
        }
        diff(t) {
            if (t == null && (t = []), !Md(t)) throw new C(900, !1);
            return this.check(t) ? this : null
        }
        onDestroy() {}
        check(t) {
            this._reset();
            let n = this._itHead,
                r = !1,
                o, i, s;
            if (Array.isArray(t)) {
                this.length = t.length;
                for (let a = 0; a < this.length; a++) i = t[a], s = this._trackByFn(a, i), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, i, s, a), r = !0) : (r && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i)), n = n._next
            } else o = 0, uv(t, a => {
                s = this._trackByFn(o, a), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, a, s, o), r = !0) : (r && (n = this._verifyReinsertion(n, a, s, o)), Object.is(n.item, a) || this._addIdentityChange(n, a)), n = n._next, o++
            }), this.length = o;
            return this._truncate(n), this.collection = t, this.isDirty
        }
        get isDirty() {
            return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null
        }
        _reset() {
            if (this.isDirty) {
                let t;
                for (t = this._previousItHead = this._itHead; t !== null; t = t._next) t._nextPrevious = t._next;
                for (t = this._additionsHead; t !== null; t = t._nextAdded) t.previousIndex = t.currentIndex;
                for (this._additionsHead = this._additionsTail = null, t = this._movesHead; t !== null; t = t._nextMoved) t.previousIndex = t.currentIndex;
                this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
            }
        }
        _mismatch(t, n, r, o) {
            let i;
            return t === null ? i = this._itTail : (i = t._prev, this._remove(t)), t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o)) : (t = this._linkedRecords === null ? null : this._linkedRecords.get(r, o), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o)) : t = this._addAfter(new ef(n, r), i, o)), t
        }
        _verifyReinsertion(t, n, r, o) {
            let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null);
            return i !== null ? t = this._reinsertAfter(i, t._prev, o) : t.currentIndex != o && (t.currentIndex = o, this._addToMoves(t, o)), t
        }
        _truncate(t) {
            for (; t !== null;) {
                let n = t._next;
                this._addToRemovals(this._unlink(t)), t = n
            }
            this._unlinkedRecords !== null && this._unlinkedRecords.clear(), this._additionsTail !== null && (this._additionsTail._nextAdded = null), this._movesTail !== null && (this._movesTail._nextMoved = null), this._itTail !== null && (this._itTail._next = null), this._removalsTail !== null && (this._removalsTail._nextRemoved = null), this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null)
        }
        _reinsertAfter(t, n, r) {
            this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
            let o = t._prevRemoved,
                i = t._nextRemoved;
            return o === null ? this._removalsHead = i : o._nextRemoved = i, i === null ? this._removalsTail = o : i._prevRemoved = o, this._insertAfter(t, n, r), this._addToMoves(t, r), t
        }
        _moveAfter(t, n, r) {
            return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t
        }
        _addAfter(t, n, r) {
            return this._insertAfter(t, n, r), this._additionsTail === null ? this._additionsTail = this._additionsHead = t : this._additionsTail = this._additionsTail._nextAdded = t, t
        }
        _insertAfter(t, n, r) {
            let o = n === null ? this._itHead : n._next;
            return t._next = o, t._prev = n, o === null ? this._itTail = t : o._prev = t, n === null ? this._itHead = t : n._next = t, this._linkedRecords === null && (this._linkedRecords = new Va), this._linkedRecords.put(t), t.currentIndex = r, t
        }
        _remove(t) {
            return this._addToRemovals(this._unlink(t))
        }
        _unlink(t) {
            this._linkedRecords !== null && this._linkedRecords.remove(t);
            let n = t._prev,
                r = t._next;
            return n === null ? this._itHead = r : n._next = r, r === null ? this._itTail = n : r._prev = n, t
        }
        _addToMoves(t, n) {
            return t.previousIndex === n || (this._movesTail === null ? this._movesTail = this._movesHead = t : this._movesTail = this._movesTail._nextMoved = t), t
        }
        _addToRemovals(t) {
            return this._unlinkedRecords === null && (this._unlinkedRecords = new Va), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, this._removalsTail === null ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t
        }
        _addIdentityChange(t, n) {
            return t.item = n, this._identityChangesTail === null ? this._identityChangesTail = this._identityChangesHead = t : this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t, t
        }
    },
    ef = class {
        item;
        trackById;
        currentIndex = null;
        previousIndex = null;
        _nextPrevious = null;
        _prev = null;
        _next = null;
        _prevDup = null;
        _nextDup = null;
        _prevRemoved = null;
        _nextRemoved = null;
        _nextAdded = null;
        _nextMoved = null;
        _nextIdentityChange = null;
        constructor(t, n) {
            this.item = t, this.trackById = n
        }
    },
    tf = class {
        _head = null;
        _tail = null;
        add(t) {
            this._head === null ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t)
        }
        get(t, n) {
            let r;
            for (r = this._head; r !== null; r = r._nextDup)
                if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
            return null
        }
        remove(t) {
            let n = t._prevDup,
                r = t._nextDup;
            return n === null ? this._head = r : n._nextDup = r, r === null ? this._tail = n : r._prevDup = n, this._head === null
        }
    },
    Va = class {
        map = new Map;
        put(t) {
            let n = t.trackById,
                r = this.map.get(n);
            r || (r = new tf, this.map.set(n, r)), r.add(t)
        }
        get(t, n) {
            let r = t,
                o = this.map.get(r);
            return o ? o.get(t, n) : null
        }
        remove(t) {
            let n = t.trackById;
            return this.map.get(n).remove(t) && this.map.delete(n), t
        }
        get isEmpty() {
            return this.map.size === 0
        }
        clear() {
            this.map.clear()
        }
    };

function uy(e, t, n) {
    let r = e.previousIndex;
    if (r === null) return r;
    let o = 0;
    return n && r < n.length && (o = n[r]), r + t + o
}

function dy() {
    return new nf([new Jd])
}
var nf = (() => {
    class e {
        factories;
        static\ u0275prov = w({
            token: e,
            providedIn: "root",
            factory: dy
        });
        constructor(n) {
            this.factories = n
        }
        static create(n, r) {
            if (r != null) {
                let o = r.factories.slice();
                n = n.concat(o)
            }
            return new e(n)
        }
        static extend(n) {
            return {
                provide: e,
                useFactory: r => e.create(n, r || dy()),
                deps: [
                    [e, new _g, new $u]
                ]
            }
        }
        find(n) {
            let r = this.factories.find(o => o.supports(n));
            if (r != null) return r;
            throw new C(901, !1)
        }
    }
    return e
})();

function Ey(e) {
    z(8);
    try {
        let {
            rootComponent: t,
            appProviders: n,
            platformProviders: r
        } = e, o = iS(r), i = [Hv({}), {
            provide: ft,
            useExisting: Bd
        }, kp, ...n || []], s = new To({
            providers: i,
            parent: o,
            debugName: "",
            runEnvironmentInitializers: !1
        });
        return tS({
            r3Injector: s.injector,
            platformInjector: o,
            rootComponent: t
        })
    } catch (t) {
        return Promise.reject(t)
    } finally {
        z(9)
    }
}
var Pa = new WeakSet,
    fy = "",
    Fa = [];

function hy(e) {
    return e.get(Qu, rm)
}

function Dy() {
    let e = [{
        provide: Qu,
        useFactory: () => {
            let t = !0; {
                let n = v(_t);
                t = !!window._ejsas ? .[n]
            }
            return t && Lt("NgEventReplay"), t
        }
    }];
    return e.push({
        provide: qe,
        useValue: () => {
            let t = v(Se),
                {
                    injector: n
                } = t;
            if (!Pa.has(t)) {
                let r = v(Ku);
                if (hy(n)) {
                    dm();
                    let o = n.get(_t),
                        i = lm(o, (s, a, c) => {
                            s.nodeType === Node.ELEMENT_NODE && (im(s, a, c), sm(s, r))
                        });
                    t.onDestroy(i)
                }
            }
        },
        multi: !0
    }, {
        provide: rn,
        useFactory: () => {
            let t = v(Se),
                {
                    injector: n
                } = t;
            return () => {
                if (!hy(n) || Pa.has(t)) return;
                Pa.add(t);
                let r = n.get(_t);
                t.onDestroy(() => {
                    Pa.delete(t), Qd(r)
                }), t.whenStable().then(() => {
                    if (t.destroyed) return;
                    let o = n.get(cm);
                    uS(o, n);
                    let i = n.get(Ku);
                    i.get(fy) ? .forEach(am), i.delete(fy);
                    let s = o.instance;
                    ym(n) ? t.onDestroy(() => s.cleanUp()) : s.cleanUp()
                })
            }
        },
        multi: !0
    }), e
}
var uS = (e, t) => {
    let n = t.get(_t),
        r = window._ejsas[n],
        o = e.instance = new ay(new xa(r.c));
    for (let a of r.et) o.addEvent(a);
    for (let a of r.etc) o.addEvent(a);
    let i = cy(n);
    o.replayEarlyEventInfos(i), Qd(n);
    let s = new Oa(a => {
        dS(t, a, a.currentTarget)
    });
    sy(o, s)
};

function dS(e, t, n) {
    let r = (n && n.getAttribute(Po)) ? ? "";
    /d\d+/.test(r) ? fS(r, e, t, n) : t.eventPhase === Yd.REPLAY && Ju(t, n)
}

function fS(e, t, n, r) {
    Fa.push({
        event: n,
        currentTarget: r
    }), Pv(t, e, hS)
}

function hS(e) {
    let t = [...Fa],
        n = new Set(e);
    Fa = [];
    for (let {
            event: r,
            currentTarget: o
        } of t) {
        let i = o.getAttribute(Po);
        n.has(i) ? Ju(r, o) : Fa.push({
            event: r,
            currentTarget: o
        })
    }
}
var py = !1;

function pS() {
    py || (py = !0, gm(), kv(), Bv(), Lv(), _v(), vv(), ov(), Um())
}

function gS(e) {
    return e.whenStable()
}

function Cy() {
    let e = [{
        provide: Oo,
        useFactory: () => {
            let t = !0;
            return t = !!v(Vn, {
                optional: !0
            }) ? .get(Xu, null), t && Lt("NgHydration"), t
        }
    }, {
        provide: qe,
        useValue: () => {
            tv(!1), v(Oo) && (Cm(xo()), pS())
        },
        multi: !0
    }];
    return e.push({
        provide: Yu,
        useFactory: () => v(Oo)
    }, {
        provide: rn,
        useFactory: () => {
            if (v(Oo)) {
                let t = v(Se);
                return () => {
                    gS(t).then(() => {
                        t.destroyed || Id(t)
                    })
                }
            }
            return () => {}
        },
        multi: !0
    }), rt(e)
}

function Wn(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false"
}
var Iy = null;

function Xe() {
    return Iy
}

function rf(e) {
    Iy ? ? = e
}
var Wo = class {},
    of = (() => {
        class e {
            historyGo(n) {
                throw new Error("")
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => v(by),
                providedIn: "platform"
            })
        }
        return e
    })();
var by = (() => {
    class e extends of {
        _location;_history;_doc = v(fe);constructor() {
            super(), this._location = window.location, this._history = window.history
        }
        getBaseHrefFromDOM() {
            return Xe().getBaseHref(this._doc)
        }
        onPopState(n) {
            let r = Xe().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", n, !1), () => r.removeEventListener("popstate", n)
        }
        onHashChange(n) {
            let r = Xe().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", n, !1), () => r.removeEventListener("hashchange", n)
        }
        get href() {
            return this._location.href
        }
        get protocol() {
            return this._location.protocol
        }
        get hostname() {
            return this._location.hostname
        }
        get port() {
            return this._location.port
        }
        get pathname() {
            return this._location.pathname
        }
        get search() {
            return this._location.search
        }
        get hash() {
            return this._location.hash
        }
        set pathname(n) {
            this._location.pathname = n
        }
        pushState(n, r, o) {
            this._history.pushState(n, r, o)
        }
        replaceState(n, r, o) {
            this._history.replaceState(n, r, o)
        }
        forward() {
            this._history.forward()
        }
        back() {
            this._history.back()
        }
        historyGo(n = 0) {
            this._history.go(n)
        }
        getState() {
            return this._history.state
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };static\ u0275prov = w({
            token: e,
            factory: () => new e,
            providedIn: "platform"
        })
    }
    return e
})();

function Sy(e, t) {
    return e ? t ? e.endsWith("/") ? t.startsWith("/") ? e + t.slice(1) : e + t : t.startsWith("/") ? e + t : `${e}/${t}` : e : t
}

function _y(e) {
    let t = e.search(/#|\?|$/);
    return e[t - 1] === "/" ? e.slice(0, t - 1) + e.slice(t) : e
}

function an(e) {
    return e && e[0] !== "?" ? `?${e}` : e
}
var Lr = (() => {
        class e {
            historyGo(n) {
                throw new Error("")
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => v(Ty),
                providedIn: "root"
            })
        }
        return e
    })(),
    My = new D(""),
    Ty = (() => {
        class e extends Lr {
            _platformLocation;
            _baseHref;
            _removeListenerFns = [];
            constructor(n, r) {
                super(), this._platformLocation = n, this._baseHref = r ? ? this._platformLocation.getBaseHrefFromDOM() ? ? v(fe).location ? .origin ? ? ""
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
            }
            onPopState(n) {
                this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
            }
            getBaseHref() {
                return this._baseHref
            }
            prepareExternalUrl(n) {
                return Sy(this._baseHref, n)
            }
            path(n = !1) {
                let r = this._platformLocation.pathname + an(this._platformLocation.search),
                    o = this._platformLocation.hash;
                return o && n ? `${r}${o}` : r
            }
            pushState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + an(i));
                this._platformLocation.pushState(n, r, s)
            }
            replaceState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + an(i));
                this._platformLocation.replaceState(n, r, s)
            }
            forward() {
                this._platformLocation.forward()
            }
            back() {
                this._platformLocation.back()
            }
            getState() {
                return this._platformLocation.getState()
            }
            historyGo(n = 0) {
                this._platformLocation.historyGo ? .(n)
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A( of ), A(My, 8))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    Vr = (() => {
        class e {
            _subject = new ne;
            _basePath;
            _locationStrategy;
            _urlChangeListeners = [];
            _urlChangeSubscription = null;
            constructor(n) {
                this._locationStrategy = n;
                let r = this._locationStrategy.getBaseHref();
                this._basePath = yS(_y(wy(r))), this._locationStrategy.onPopState(o => {
                    this._subject.next({
                        url: this.path(!0),
                        pop: !0,
                        state: o.state,
                        type: o.type
                    })
                })
            }
            ngOnDestroy() {
                this._urlChangeSubscription ? .unsubscribe(), this._urlChangeListeners = []
            }
            path(n = !1) {
                return this.normalize(this._locationStrategy.path(n))
            }
            getState() {
                return this._locationStrategy.getState()
            }
            isCurrentPathEqualTo(n, r = "") {
                return this.path() == this.normalize(n + an(r))
            }
            normalize(n) {
                return e.stripTrailingSlash(vS(this._basePath, wy(n)))
            }
            prepareExternalUrl(n) {
                return n && n[0] !== "/" && (n = "/" + n), this._locationStrategy.prepareExternalUrl(n)
            }
            go(n, r = "", o = null) {
                this._locationStrategy.pushState(o, "", n, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + an(r)), o)
            }
            replaceState(n, r = "", o = null) {
                this._locationStrategy.replaceState(o, "", n, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + an(r)), o)
            }
            forward() {
                this._locationStrategy.forward()
            }
            back() {
                this._locationStrategy.back()
            }
            historyGo(n = 0) {
                this._locationStrategy.historyGo ? .(n)
            }
            onUrlChange(n) {
                return this._urlChangeListeners.push(n), this._urlChangeSubscription ? ? = this.subscribe(r => {
                    this._notifyUrlChangeListeners(r.url, r.state)
                }), () => {
                    let r = this._urlChangeListeners.indexOf(n);
                    this._urlChangeListeners.splice(r, 1), this._urlChangeListeners.length === 0 && (this._urlChangeSubscription ? .unsubscribe(), this._urlChangeSubscription = null)
                }
            }
            _notifyUrlChangeListeners(n = "", r) {
                this._urlChangeListeners.forEach(o => o(n, r))
            }
            subscribe(n, r, o) {
                return this._subject.subscribe({
                    next: n,
                    error: r ? ? void 0,
                    complete: o ? ? void 0
                })
            }
            static normalizeQueryParams = an;
            static joinWithSlash = Sy;
            static stripTrailingSlash = _y;
            static\ u0275fac = function(r) {
                return new(r || e)(A(Lr))
            };
            static\ u0275prov = w({
                token: e,
                factory: () => mS(),
                providedIn: "root"
            })
        }
        return e
    })();

function mS() {
    return new Vr(A(Lr))
}

function vS(e, t) {
    if (!e || !t.startsWith(e)) return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t
}

function wy(e) {
    return e.replace(/\/index.html$/, "")
}

function yS(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let [, n] = e.split(/\/\/[^\/]+/);
        return n
    }
    return e
}
var ja = class {
        $implicit;
        ngForOf;
        index;
        count;
        constructor(t, n, r, o) {
            this.$implicit = t, this.ngForOf = n, this.index = r, this.count = o
        }
        get first() {
            return this.index === 0
        }
        get last() {
            return this.index === this.count - 1
        }
        get even() {
            return this.index % 2 === 0
        }
        get odd() {
            return !this.even
        }
    },
    Ua = (() => {
        class e {
            _viewContainer;
            _template;
            _differs;
            set ngForOf(n) {
                this._ngForOf = n, this._ngForOfDirty = !0
            }
            set ngForTrackBy(n) {
                this._trackByFn = n
            }
            get ngForTrackBy() {
                return this._trackByFn
            }
            _ngForOf = null;
            _ngForOfDirty = !0;
            _differ = null;
            _trackByFn;
            constructor(n, r, o) {
                this._viewContainer = n, this._template = r, this._differs = o
            }
            set ngForTemplate(n) {
                n && (this._template = n)
            }
            ngDoCheck() {
                if (this._ngForOfDirty) {
                    this._ngForOfDirty = !1;
                    let n = this._ngForOf;
                    !this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy))
                }
                if (this._differ) {
                    let n = this._differ.diff(this._ngForOf);
                    n && this._applyChanges(n)
                }
            }
            _applyChanges(n) {
                let r = this._viewContainer;
                n.forEachOperation((o, i, s) => {
                    if (o.previousIndex == null) r.createEmbeddedView(this._template, new ja(o.item, this._ngForOf, -1, -1), s === null ? void 0 : s);
                    else if (s == null) r.remove(i === null ? void 0 : i);
                    else if (i !== null) {
                        let a = r.get(i);
                        r.move(a, s), Ay(a, o)
                    }
                });
                for (let o = 0, i = r.length; o < i; o++) {
                    let a = r.get(o).context;
                    a.index = o, a.count = i, a.ngForOf = this._ngForOf
                }
                n.forEachIdentityChange(o => {
                    let i = r.get(o.currentIndex);
                    Ay(i, o)
                })
            }
            static ngTemplateContextGuard(n, r) {
                return !0
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(Bn), $(Lo), $(nf))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["", "ngFor", "", "ngForOf", ""]
                ],
                inputs: {
                    ngForOf: "ngForOf",
                    ngForTrackBy: "ngForTrackBy",
                    ngForTemplate: "ngForTemplate"
                }
            })
        }
        return e
    })();

function Ay(e, t) {
    e.context.$implicit = t.item
}
var qo = (() => {
        class e {
            _viewContainer;
            _context = new Ba;
            _thenTemplateRef = null;
            _elseTemplateRef = null;
            _thenViewRef = null;
            _elseViewRef = null;
            constructor(n, r) {
                this._viewContainer = n, this._thenTemplateRef = r
            }
            set ngIf(n) {
                this._context.$implicit = this._context.ngIf = n, this._updateView()
            }
            set ngIfThen(n) {
                Ny(n, !1), this._thenTemplateRef = n, this._thenViewRef = null, this._updateView()
            }
            set ngIfElse(n) {
                Ny(n, !1), this._elseTemplateRef = n, this._elseViewRef = null, this._updateView()
            }
            _updateView() {
                this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(), this._elseViewRef = null, this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(), this._thenViewRef = null, this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
            }
            static ngIfUseIfTypeGuard;
            static ngTemplateGuard_ngIf;
            static ngTemplateContextGuard(n, r) {
                return !0
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(Bn), $(Lo))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["", "ngIf", ""]
                ],
                inputs: {
                    ngIf: "ngIf",
                    ngIfThen: "ngIfThen",
                    ngIfElse: "ngIfElse"
                }
            })
        }
        return e
    })(),
    Ba = class {
        $implicit = null;
        ngIf = null
    };

function Ny(e, t) {
    if (e && !e.createEmbeddedView) throw new C(2020, !1)
}
var cn = (() => {
    class e {
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275mod = Vt({
            type: e
        });
        static\ u0275inj = pt({})
    }
    return e
})();

function sf(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("="),
            [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (o.trim() === t) return decodeURIComponent(i)
    }
    return null
}
var Zo = class {};
var af = "browser";

function qn(e) {
    return e === af
}
var $a = new D(""),
    hf = (() => {
        class e {
            _zone;
            _plugins;
            _eventNameToPlugin = new Map;
            constructor(n, r) {
                this._zone = r, n.forEach(o => {
                    o.manager = this
                }), this._plugins = n.slice().reverse()
            }
            addEventListener(n, r, o, i) {
                return this._findPluginFor(r).addEventListener(n, r, o, i)
            }
            getZone() {
                return this._zone
            }
            _findPluginFor(n) {
                let r = this._eventNameToPlugin.get(n);
                if (r) return r;
                if (r = this._plugins.find(i => i.supports(n)), !r) throw new C(5101, !1);
                return this._eventNameToPlugin.set(n, r), r
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A($a), A(ee))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    Yo = class {
        _doc;
        constructor(t) {
            this._doc = t
        }
        manager
    },
    lf = "ng-app-id";

function Ry(e) {
    for (let t of e) t.remove()
}

function xy(e, t) {
    let n = t.createElement("style");
    return n.textContent = e, n
}

function ES(e, t, n, r) {
    let o = e.head ? .querySelectorAll(`style[${lf}="${t}"],link[${lf}="${t}"]`);
    if (o)
        for (let i of o) i.removeAttribute(lf), i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
            usage: 0,
            elements: [i]
        }) : i.textContent && n.set(i.textContent, {
            usage: 0,
            elements: [i]
        })
}

function df(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n
}
var pf = (() => {
        class e {
            doc;
            appId;
            nonce;
            inline = new Map;
            external = new Map;
            hosts = new Set;
            constructor(n, r, o, i = {}) {
                this.doc = n, this.appId = r, this.nonce = o, ES(n, r, this.inline, this.external), this.hosts.add(n.head)
            }
            addStyles(n, r) {
                for (let o of n) this.addUsage(o, this.inline, xy);
                r ? .forEach(o => this.addUsage(o, this.external, df))
            }
            removeStyles(n, r) {
                for (let o of n) this.removeUsage(o, this.inline);
                r ? .forEach(o => this.removeUsage(o, this.external))
            }
            addUsage(n, r, o) {
                let i = r.get(n);
                i ? i.usage++ : r.set(n, {
                    usage: 1,
                    elements: [...this.hosts].map(s => this.addElement(s, o(n, this.doc)))
                })
            }
            removeUsage(n, r) {
                let o = r.get(n);
                o && (o.usage--, o.usage <= 0 && (Ry(o.elements), r.delete(n)))
            }
            ngOnDestroy() {
                for (let [, {
                        elements: n
                    }] of [...this.inline, ...this.external]) Ry(n);
                this.hosts.clear()
            }
            addHost(n) {
                this.hosts.add(n);
                for (let [r, {
                        elements: o
                    }] of this.inline) o.push(this.addElement(n, xy(r, this.doc)));
                for (let [r, {
                        elements: o
                    }] of this.external) o.push(this.addElement(n, df(r, this.doc)))
            }
            removeHost(n) {
                this.hosts.delete(n)
            }
            addElement(n, r) {
                return this.nonce && r.setAttribute("nonce", this.nonce), n.appendChild(r)
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A(fe), A(_t), A(oa, 8), A(Xt))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    uf = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/Math/MathML"
    },
    gf = /%COMP%/g;
var Py = "%COMP%",
    DS = `_nghost-${Py}`,
    CS = `_ngcontent-${Py}`,
    _S = !0,
    wS = new D("", {
        providedIn: "root",
        factory: () => _S
    });

function IS(e) {
    return CS.replace(gf, e)
}

function bS(e) {
    return DS.replace(gf, e)
}

function ky(e, t) {
    return t.map(n => n.replace(gf, e))
}
var mf = (() => {
        class e {
            eventManager;
            sharedStylesHost;
            appId;
            removeStylesOnCompDestroy;
            doc;
            platformId;
            ngZone;
            nonce;
            animationDisabled;
            maxAnimationTimeout;
            tracingService;
            rendererByCompId = new Map;
            defaultRenderer;
            platformIsServer;
            registry;
            constructor(n, r, o, i, s, a, c, l = null, u, d, m = null) {
                this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = i, this.doc = s, this.platformId = a, this.ngZone = c, this.nonce = l, this.animationDisabled = u, this.maxAnimationTimeout = d, this.tracingService = m, this.platformIsServer = !1, this.defaultRenderer = new Qo(n, s, c, this.platformIsServer, this.tracingService, this.registry = Is(), this.maxAnimationTimeout)
            }
            createRenderer(n, r) {
                if (!n || !r) return this.defaultRenderer;
                let o = this.getOrCreateRenderer(n, r);
                return o instanceof Ha ? o.applyToHost(n) : o instanceof Ko && o.applyStyles(), o
            }
            getOrCreateRenderer(n, r) {
                let o = this.rendererByCompId,
                    i = o.get(r.id);
                if (!i) {
                    let s = this.doc,
                        a = this.ngZone,
                        c = this.eventManager,
                        l = this.sharedStylesHost,
                        u = this.removeStylesOnCompDestroy,
                        d = this.platformIsServer,
                        m = this.tracingService;
                    switch (r.encapsulation) {
                        case kt.Emulated:
                            i = new Ha(c, l, r, this.appId, u, s, a, d, m, this.registry, this.animationDisabled, this.maxAnimationTimeout);
                            break;
                        case kt.ShadowDom:
                            return new ff(c, l, n, r, s, a, this.nonce, d, m, this.registry, this.maxAnimationTimeout);
                        default:
                            i = new Ko(c, l, r, u, s, a, d, m, this.registry, this.animationDisabled, this.maxAnimationTimeout);
                            break
                    }
                    o.set(r.id, i)
                }
                return i
            }
            ngOnDestroy() {
                this.rendererByCompId.clear()
            }
            componentReplaced(n) {
                this.rendererByCompId.delete(n)
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A(hf), A(pf), A(_t), A(wS), A(fe), A(Xt), A(ee), A(oa), A(Fd), A(Ld), A(Un, 8))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    Qo = class {
        eventManager;
        doc;
        ngZone;
        platformIsServer;
        tracingService;
        registry;
        maxAnimationTimeout;
        data = Object.create(null);
        throwOnSyntheticProps = !0;
        constructor(t, n, r, o, i, s, a) {
            this.eventManager = t, this.doc = n, this.ngZone = r, this.platformIsServer = o, this.tracingService = i, this.registry = s, this.maxAnimationTimeout = a
        }
        destroy() {}
        destroyNode = null;
        createElement(t, n) {
            return n ? this.doc.createElementNS(uf[n] || n, t) : this.doc.createElement(t)
        }
        createComment(t) {
            return this.doc.createComment(t)
        }
        createText(t) {
            return this.doc.createTextNode(t)
        }
        appendChild(t, n) {
            (Oy(t) ? t.content : t).appendChild(n)
        }
        insertBefore(t, n, r) {
            t && (Oy(t) ? t.content : t).insertBefore(n, r)
        }
        removeChild(t, n) {
            let {
                elements: r
            } = this.registry;
            if (r) {
                r.animate(n, () => n.remove(), this.maxAnimationTimeout);
                return
            }
            n.remove()
        }
        selectRootElement(t, n) {
            let r = typeof t == "string" ? this.doc.querySelector(t) : t;
            if (!r) throw new C(-5104, !1);
            return n || (r.textContent = ""), r
        }
        parentNode(t) {
            return t.parentNode
        }
        nextSibling(t) {
            return t.nextSibling
        }
        setAttribute(t, n, r, o) {
            if (o) {
                n = o + ":" + n;
                let i = uf[o];
                i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
            } else t.setAttribute(n, r)
        }
        removeAttribute(t, n, r) {
            if (r) {
                let o = uf[r];
                o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
            } else t.removeAttribute(n)
        }
        addClass(t, n) {
            t.classList.add(n)
        }
        removeClass(t, n) {
            t.classList.remove(n)
        }
        setStyle(t, n, r, o) {
            o & (Dt.DashCase | Dt.Important) ? t.style.setProperty(n, r, o & Dt.Important ? "important" : "") : t.style[n] = r
        }
        removeStyle(t, n, r) {
            r & Dt.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
        }
        setProperty(t, n, r) {
            t != null && (t[n] = r)
        }
        setValue(t, n) {
            t.nodeValue = n
        }
        listen(t, n, r, o) {
            if (typeof t == "string" && (t = Xe().getGlobalEventTarget(this.doc, t), !t)) throw new C(5102, !1);
            let i = this.decoratePreventDefault(r);
            return this.tracingService ? .wrapEventListener && (i = this.tracingService.wrapEventListener(t, n, i)), this.eventManager.addEventListener(t, n, i, o)
        }
        decoratePreventDefault(t) {
            return n => {
                if (n === "__ngUnwrap__") return t;
                t(n) === !1 && n.preventDefault()
            }
        }
    };

function Oy(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0
}
var ff = class extends Qo {
        sharedStylesHost;
        hostEl;
        shadowRoot;
        constructor(t, n, r, o, i, s, a, c, l, u, d) {
            super(t, i, s, c, l, u, d), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({
                mode: "open"
            }), this.sharedStylesHost.addHost(this.shadowRoot);
            let m = o.styles;
            m = ky(o.id, m);
            for (let y of m) {
                let _ = document.createElement("style");
                a && _.setAttribute("nonce", a), _.textContent = y, this.shadowRoot.appendChild(_)
            }
            let g = o.getExternalStyles ? .();
            if (g)
                for (let y of g) {
                    let _ = df(y, i);
                    a && _.setAttribute("nonce", a), this.shadowRoot.appendChild(_)
                }
        }
        nodeOrShadowRoot(t) {
            return t === this.hostEl ? this.shadowRoot : t
        }
        appendChild(t, n) {
            return super.appendChild(this.nodeOrShadowRoot(t), n)
        }
        insertBefore(t, n, r) {
            return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
        }
        removeChild(t, n) {
            return super.removeChild(null, n)
        }
        parentNode(t) {
            return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
        }
        destroy() {
            this.sharedStylesHost.removeHost(this.shadowRoot)
        }
    },
    Ko = class extends Qo {
        sharedStylesHost;
        removeStylesOnCompDestroy;
        styles;
        styleUrls;
        _animationDisabled;
        constructor(t, n, r, o, i, s, a, c, l, u, d, m) {
            super(t, i, s, a, c, l, d), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = o, this._animationDisabled = u;
            let g = r.styles;
            this.styles = m ? ky(m, g) : g, this.styleUrls = r.getExternalStyles ? .(m)
        }
        applyStyles() {
            this.sharedStylesHost.addStyles(this.styles, this.styleUrls)
        }
        destroy() {
            if (this.removeStylesOnCompDestroy) {
                if (!this._animationDisabled && this.registry.elements) {
                    this.ngZone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.sharedStylesHost.removeStyles(this.styles, this.styleUrls)
                        }, this.maxAnimationTimeout)
                    });
                    return
                }
                this.sharedStylesHost.removeStyles(this.styles, this.styleUrls)
            }
        }
    },
    Ha = class extends Ko {
        contentAttr;
        hostAttr;
        constructor(t, n, r, o, i, s, a, c, l, u, d, m) {
            let g = o + "-" + r.id;
            super(t, n, r, i, s, a, c, l, u, d, m, g), this.contentAttr = IS(g), this.hostAttr = bS(g)
        }
        applyToHost(t) {
            this.applyStyles(), this.setAttribute(t, this.hostAttr, "")
        }
        createElement(t, n) {
            let r = super.createElement(t, n);
            return super.setAttribute(r, this.contentAttr, ""), r
        }
    };
var za = class e extends Wo {
        supportsDOMEvents = !0;
        static makeCurrent() {
            rf(new e)
        }
        onAndCancel(t, n, r, o) {
            return t.addEventListener(n, r, o), () => {
                t.removeEventListener(n, r, o)
            }
        }
        dispatchEvent(t, n) {
            t.dispatchEvent(n)
        }
        remove(t) {
            t.remove()
        }
        createElement(t, n) {
            return n = n || this.getDefaultDocument(), n.createElement(t)
        }
        createHtmlDocument() {
            return document.implementation.createHTMLDocument("fakeTitle")
        }
        getDefaultDocument() {
            return document
        }
        isElementNode(t) {
            return t.nodeType === Node.ELEMENT_NODE
        }
        isShadowRoot(t) {
            return t instanceof DocumentFragment
        }
        getGlobalEventTarget(t, n) {
            return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null
        }
        getBaseHref(t) {
            let n = SS();
            return n == null ? null : MS(n)
        }
        resetBaseElement() {
            Jo = null
        }
        getUserAgent() {
            return window.navigator.userAgent
        }
        getCookie(t) {
            return sf(document.cookie, t)
        }
    },
    Jo = null;

function SS() {
    return Jo = Jo || document.head.querySelector("base"), Jo ? Jo.getAttribute("href") : null
}

function MS(e) {
    return new URL(e, document.baseURI).pathname
}
var TS = (() => {
        class e {
            build() {
                return new XMLHttpRequest
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    Ly = (() => {
        class e extends Yo {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return !0
            }
            addEventListener(n, r, o, i) {
                return n.addEventListener(r, o, i), () => this.removeEventListener(n, r, o, i)
            }
            removeEventListener(n, r, o, i) {
                return n.removeEventListener(r, o, i)
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A(fe))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    Fy = ["alt", "control", "meta", "shift"],
    AS = {
        "\b": "Backspace",
        "	": "Tab",
        "\x7F": "Delete",
        "\x1B": "Escape",
        Del: "Delete",
        Esc: "Escape",
        Left: "ArrowLeft",
        Right: "ArrowRight",
        Up: "ArrowUp",
        Down: "ArrowDown",
        Menu: "ContextMenu",
        Scroll: "ScrollLock",
        Win: "OS"
    },
    NS = {
        alt: e => e.altKey,
        control: e => e.ctrlKey,
        meta: e => e.metaKey,
        shift: e => e.shiftKey
    },
    Vy = (() => {
        class e extends Yo {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return e.parseEventName(n) != null
            }
            addEventListener(n, r, o, i) {
                let s = e.parseEventName(r),
                    a = e.eventCallback(s.fullKey, o, this.manager.getZone());
                return this.manager.getZone().runOutsideAngular(() => Xe().onAndCancel(n, s.domEventName, a, i))
            }
            static parseEventName(n) {
                let r = n.toLowerCase().split("."),
                    o = r.shift();
                if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
                let i = e._normalizeKey(r.pop()),
                    s = "",
                    a = r.indexOf("code");
                if (a > -1 && (r.splice(a, 1), s = "code."), Fy.forEach(l => {
                        let u = r.indexOf(l);
                        u > -1 && (r.splice(u, 1), s += l + ".")
                    }), s += i, r.length != 0 || i.length === 0) return null;
                let c = {};
                return c.domEventName = o, c.fullKey = s, c
            }
            static matchEventFullKeyCode(n, r) {
                let o = AS[n.key] || n.key,
                    i = "";
                return r.indexOf("code.") > -1 && (o = n.code, i = "code."), o == null || !o ? !1 : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), Fy.forEach(s => {
                    if (s !== o) {
                        let a = NS[s];
                        a(n) && (i += s + ".")
                    }
                }), i += o, i === r)
            }
            static eventCallback(n, r, o) {
                return i => {
                    e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i))
                }
            }
            static _normalizeKey(n) {
                return n === "esc" ? "escape" : n
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A(fe))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })();

function vf(e, t) {
    let n = E({
        rootComponent: e
    }, RS(t));
    return Ey(n)
}

function RS(e) {
    return {
        appProviders: [...FS, ...e ? .providers ? ? []],
        platformProviders: kS
    }
}

function xS() {
    za.makeCurrent()
}

function OS() {
    return new nt
}

function PS() {
    return Wu(document), document
}
var kS = [{
    provide: Xt,
    useValue: af
}, {
    provide: ra,
    useValue: xS,
    multi: !0
}, {
    provide: fe,
    useFactory: PS
}];
var FS = [{
        provide: go,
        useValue: "root"
    }, {
        provide: nt,
        useFactory: OS
    }, {
        provide: $a,
        useClass: Ly,
        multi: !0,
        deps: [fe]
    }, {
        provide: $a,
        useClass: Vy,
        multi: !0,
        deps: [fe]
    }, mf, pf, hf, {
        provide: kn,
        useExisting: mf
    }, {
        provide: Zo,
        useClass: TS
    },
    []
];
var Xo = class e {
    headers;
    normalizedNames = new Map;
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
        t ? typeof t == "string" ? this.lazyInit = () => {
            this.headers = new Map, t.split(`
`).forEach(n => {
                let r = n.indexOf(":");
                if (r > 0) {
                    let o = n.slice(0, r),
                        i = n.slice(r + 1).trim();
                    this.addHeaderEntry(o, i)
                }
            })
        } : typeof Headers < "u" && t instanceof Headers ? (this.headers = new Map, t.forEach((n, r) => {
            this.addHeaderEntry(r, n)
        })) : this.lazyInit = () => {
            this.headers = new Map, Object.entries(t).forEach(([n, r]) => {
                this.setHeaderEntries(n, r)
            })
        } : this.headers = new Map
    }
    has(t) {
        return this.init(), this.headers.has(t.toLowerCase())
    }
    get(t) {
        this.init();
        let n = this.headers.get(t.toLowerCase());
        return n && n.length > 0 ? n[0] : null
    }
    keys() {
        return this.init(), Array.from(this.normalizedNames.values())
    }
    getAll(t) {
        return this.init(), this.headers.get(t.toLowerCase()) || null
    }
    append(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "a"
        })
    }
    set(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "s"
        })
    }
    delete(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "d"
        })
    }
    maybeSetNormalizedName(t, n) {
        this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
    }
    init() {
        this.lazyInit && (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(), this.lazyInit = null, this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)), this.lazyUpdate = null))
    }
    copyFrom(t) {
        t.init(), Array.from(t.headers.keys()).forEach(n => {
            this.headers.set(n, t.headers.get(n)), this.normalizedNames.set(n, t.normalizedNames.get(n))
        })
    }
    clone(t) {
        let n = new e;
        return n.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this, n.lazyUpdate = (this.lazyUpdate || []).concat([t]), n
    }
    applyUpdate(t) {
        let n = t.name.toLowerCase();
        switch (t.op) {
            case "a":
            case "s":
                let r = t.value;
                if (typeof r == "string" && (r = [r]), r.length === 0) return;
                this.maybeSetNormalizedName(t.name, n);
                let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
                o.push(...r), this.headers.set(n, o);
                break;
            case "d":
                let i = t.value;
                if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
                else {
                    let s = this.headers.get(n);
                    if (!s) return;
                    s = s.filter(a => i.indexOf(a) === -1), s.length === 0 ? (this.headers.delete(n), this.normalizedNames.delete(n)) : this.headers.set(n, s)
                }
                break
        }
    }
    addHeaderEntry(t, n) {
        let r = t.toLowerCase();
        this.maybeSetNormalizedName(t, r), this.headers.has(r) ? this.headers.get(r).push(n) : this.headers.set(r, [n])
    }
    setHeaderEntries(t, n) {
        let r = (Array.isArray(n) ? n : [n]).map(i => i.toString()),
            o = t.toLowerCase();
        this.headers.set(o, r), this.maybeSetNormalizedName(t, o)
    }
    forEach(t) {
        this.init(), Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)))
    }
};
var LS = "X-Request-URL",
    VS = "text/plain",
    jS = "application/json",
    yH = `${jS}, ${VS}, */*`;
var Ef = (function(e) {
        return e[e.Sent = 0] = "Sent", e[e.UploadProgress = 1] = "UploadProgress", e[e.ResponseHeader = 2] = "ResponseHeader", e[e.DownloadProgress = 3] = "DownloadProgress", e[e.Response = 4] = "Response", e[e.User = 5] = "User", e
    })(Ef || {}),
    yf = class {
        headers;
        status;
        statusText;
        url;
        ok;
        type;
        redirected;
        constructor(t, n = 200, r = "OK") {
            this.headers = t.headers || new Xo, this.status = t.status !== void 0 ? t.status : n, this.statusText = t.statusText || r, this.url = t.url || null, this.redirected = t.redirected, this.ok = this.status >= 200 && this.status < 300
        }
    };
var Ga = class e extends yf {
    body;
    constructor(t = {}) {
        super(t), this.body = t.body !== void 0 ? t.body : null
    }
    type = Ef.Response;
    clone(t = {}) {
        return new e({
            body: t.body !== void 0 ? t.body : this.body,
            headers: t.headers || this.headers,
            status: t.status !== void 0 ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
            redirected: t.redirected ? ? this.redirected
        })
    }
};
var jy = new D("");
var EH = RegExp(`^${LS}:`, "m");
var BS = new D(""),
    US = "b",
    HS = "h",
    $S = "s",
    zS = "st",
    GS = "u",
    WS = "rt",
    Df = new D(""),
    qS = ["GET", "HEAD"];

function ZS(e, t) {
    let g = v(Df),
        {
            isCacheActive: n
        } = g,
        r = gh(g, ["isCacheActive"]),
        {
            transferCache: o,
            method: i
        } = e;
    if (!n || o === !1 || i === "POST" && !r.includePostRequests && !o || i !== "POST" && !qS.includes(i) || !r.includeRequestsWithAuthHeaders && YS(e) || r.filter ? .(e) === !1) return t(e);
    let s = v(Vn);
    if (v(BS, {
            optional: !0
        })) throw new C(2803, !1);
    let c = e.url,
        l = QS(e, c),
        u = s.get(l, null),
        d = r.includeHeaders;
    if (typeof o == "object" && o.includeHeaders && (d = o.includeHeaders), u) {
        let {
            [US]: y, [WS]: _, [HS]: k, [$S]: L, [zS]: Fc, [GS]: Qn
        } = u, Lc = y;
        switch (_) {
            case "arraybuffer":
                Lc = new TextEncoder().encode(y).buffer;
                break;
            case "blob":
                Lc = new Blob([y]);
                break
        }
        let lD = new Xo(k);
        return T(new Ga({
            body: Lc,
            headers: lD,
            status: L,
            statusText: Fc,
            url: Qn
        }))
    }
    return t(e)
}

function YS(e) {
    return e.headers.has("authorization") || e.headers.has("proxy-authorization")
}

function By(e) {
    return [...e.keys()].sort().map(t => `${t}=${e.getAll(t)}`).join("&")
}

function QS(e, t) {
    let {
        params: n,
        method: r,
        responseType: o
    } = e, i = By(n), s = e.serializeBody();
    s instanceof URLSearchParams ? s = By(s) : typeof s != "string" && (s = "");
    let a = [r, o, t, s, i].join("|"),
        c = KS(a);
    return c
}

function KS(e) {
    let t = 0;
    for (let n of e) t = Math.imul(31, t) + n.charCodeAt(0) << 0;
    return t += 2147483648, t.toString()
}

function Uy(e) {
    return [{
        provide: Df,
        useFactory: () => (Lt("NgHttpTransferCache"), E({
            isCacheActive: !0
        }, e))
    }, {
        provide: jy,
        useValue: ZS,
        multi: !0
    }, {
        provide: rn,
        multi: !0,
        useFactory: () => {
            let t = v(Se),
                n = v(Df);
            return () => {
                t.whenStable().then(() => {
                    n.isCacheActive = !1
                })
            }
        }
    }]
}
var Hy = (() => {
    class e {
        _doc;
        constructor(n) {
            this._doc = n
        }
        getTitle() {
            return this._doc.title
        }
        setTitle(n) {
            this._doc.title = n || ""
        }
        static\ u0275fac = function(r) {
            return new(r || e)(A(fe))
        };
        static\ u0275prov = w({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();
var Wa = (function(e) {
    return e[e.NoHttpTransferCache = 0] = "NoHttpTransferCache", e[e.HttpTransferCacheOptions = 1] = "HttpTransferCacheOptions", e[e.I18nSupport = 2] = "I18nSupport", e[e.EventReplay = 3] = "EventReplay", e[e.IncrementalHydration = 4] = "IncrementalHydration", e
})(Wa || {});

function XS(e, t = [], n = {}) {
    return {\
        u0275kind: e,
        \u0275providers: t
    }
}

function $y() {
    return XS(Wa.EventReplay, Dy())
}

function zy(...e) {
    let t = [],
        n = new Set;
    for (let {\
            u0275providers: o,
            \u0275kind: i
        } of e) n.add(i), o.length && t.push(o);
    let r = n.has(Wa.HttpTransferCacheOptions);
    return rt([
        [],
        [], Cy(), n.has(Wa.NoHttpTransferCache) || r ? [] : Uy({}), t
    ])
}
var P = "primary",
    fi = Symbol("RouteTitle"),
    bf = class {
        params;
        constructor(t) {
            this.params = t || {}
        }
        has(t) {
            return Object.prototype.hasOwnProperty.call(this.params, t)
        }
        get(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n[0] : n
            }
            return null
        }
        getAll(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n : [n]
            }
            return []
        }
        get keys() {
            return Object.keys(this.params)
        }
    };

function zr(e) {
    return new bf(e)
}

function tM(e, t, n) {
    let r = n.path.split("/");
    if (r.length > e.length || n.pathMatch === "full" && (t.hasChildren() || r.length < e.length)) return null;
    let o = {};
    for (let i = 0; i < r.length; i++) {
        let s = r[i],
            a = e[i];
        if (s[0] === ":") o[s.substring(1)] = a;
        else if (s !== a.path) return null
    }
    return {
        consumed: e.slice(0, r.length),
        posParams: o
    }
}

function nM(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; ++n)
        if (!It(e[n], t[n])) return !1;
    return !0
}

function It(e, t) {
    let n = e ? Sf(e) : void 0,
        r = t ? Sf(t) : void 0;
    if (!n || !r || n.length != r.length) return !1;
    let o;
    for (let i = 0; i < n.length; i++)
        if (o = n[i], !Jy(e[o], t[o])) return !1;
    return !0
}

function Sf(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}

function Jy(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1;
        let n = [...e].sort(),
            r = [...t].sort();
        return n.every((o, i) => r[i] === o)
    } else return e === t
}

function Xy(e) {
    return e.length > 0 ? e[e.length - 1] : null
}

function Ht(e) {
    return tl(e) ? e : nn(e) ? X(Promise.resolve(e)) : T(e)
}
var rM = {
        exact: tE,
        subset: nE
    },
    eE = {
        exact: oM,
        subset: iM,
        ignored: () => !0
    };

function Gy(e, t, n) {
    return rM[n.paths](e.root, t.root, n.matrixParams) && eE[n.queryParams](e.queryParams, t.queryParams) && !(n.fragment === "exact" && e.fragment !== t.fragment)
}

function oM(e, t) {
    return It(e, t)
}

function tE(e, t, n) {
    if (!Yn(e.segments, t.segments) || !Ya(e.segments, t.segments, n) || e.numberOfChildren !== t.numberOfChildren) return !1;
    for (let r in t.children)
        if (!e.children[r] || !tE(e.children[r], t.children[r], n)) return !1;
    return !0
}

function iM(e, t) {
    return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => Jy(e[n], t[n]))
}

function nE(e, t, n) {
    return rE(e, t, t.segments, n)
}

function rE(e, t, n, r) {
    if (e.segments.length > n.length) {
        let o = e.segments.slice(0, n.length);
        return !(!Yn(o, n) || t.hasChildren() || !Ya(o, n, r))
    } else if (e.segments.length === n.length) {
        if (!Yn(e.segments, n) || !Ya(e.segments, n, r)) return !1;
        for (let o in t.children)
            if (!e.children[o] || !nE(e.children[o], t.children[o], r)) return !1;
        return !0
    } else {
        let o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
        return !Yn(e.segments, o) || !Ya(e.segments, o, r) || !e.children[P] ? !1 : rE(e.children[P], t, i, r)
    }
}

function Ya(e, t, n) {
    return t.every((r, o) => eE[n](e[o].parameters, r.parameters))
}
var Bt = class {
        root;
        queryParams;
        fragment;
        _queryParamMap;
        constructor(t = new W([], {}), n = {}, r = null) {
            this.root = t, this.queryParams = n, this.fragment = r
        }
        get queryParamMap() {
            return this._queryParamMap ? ? = zr(this.queryParams), this._queryParamMap
        }
        toString() {
            return cM.serialize(this)
        }
    },
    W = class {
        segments;
        children;
        parent = null;
        constructor(t, n) {
            this.segments = t, this.children = n, Object.values(n).forEach(r => r.parent = this)
        }
        hasChildren() {
            return this.numberOfChildren > 0
        }
        get numberOfChildren() {
            return Object.keys(this.children).length
        }
        toString() {
            return Qa(this)
        }
    },
    Zn = class {
        path;
        parameters;
        _parameterMap;
        constructor(t, n) {
            this.path = t, this.parameters = n
        }
        get parameterMap() {
            return this._parameterMap ? ? = zr(this.parameters), this._parameterMap
        }
        toString() {
            return iE(this)
        }
    };

function sM(e, t) {
    return Yn(e, t) && e.every((n, r) => It(n.parameters, t[r].parameters))
}

function Yn(e, t) {
    return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path)
}

function aM(e, t) {
    let n = [];
    return Object.entries(e.children).forEach(([r, o]) => {
        r === P && (n = n.concat(t(o, r)))
    }), Object.entries(e.children).forEach(([r, o]) => {
        r !== P && (n = n.concat(t(o, r)))
    }), n
}
var cc = (() => {
        class e {
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => new Gr,
                providedIn: "root"
            })
        }
        return e
    })(),
    Gr = class {
        parse(t) {
            let n = new Tf(t);
            return new Bt(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment())
        }
        serialize(t) {
            let n = `/${ei(t.root,!0)}`,
                r = dM(t.queryParams),
                o = typeof t.fragment == "string" ? `#${lM(t.fragment)}` : "";
            return `${n}${r}${o}`
        }
    },
    cM = new Gr;

function Qa(e) {
    return e.segments.map(t => iE(t)).join("/")
}

function ei(e, t) {
    if (!e.hasChildren()) return Qa(e);
    if (t) {
        let n = e.children[P] ? ei(e.children[P], !1) : "",
            r = [];
        return Object.entries(e.children).forEach(([o, i]) => {
            o !== P && r.push(`${o}:${ei(i,!1)}`)
        }), r.length > 0 ? `${n}(${r.join("//")})` : n
    } else {
        let n = aM(e, (r, o) => o === P ? [ei(e.children[P], !1)] : [`${o}:${ei(r,!1)}`]);
        return Object.keys(e.children).length === 1 && e.children[P] != null ? `${Qa(e)}/${n[0]}` : `${Qa(e)}/(${n.join("//")})`
    }
}

function oE(e) {
    return encodeURIComponent(e).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
}

function qa(e) {
    return oE(e).replace(/%3B/gi, ";")
}

function lM(e) {
    return encodeURI(e)
}

function Mf(e) {
    return oE(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}

function Ka(e) {
    return decodeURIComponent(e)
}

function Wy(e) {
    return Ka(e.replace(/\+/g, "%20"))
}

function iE(e) {
    return `${Mf(e.path)}${uM(e.parameters)}`
}

function uM(e) {
    return Object.entries(e).map(([t, n]) => `;${Mf(t)}=${Mf(n)}`).join("")
}

function dM(e) {
    let t = Object.entries(e).map(([n, r]) => Array.isArray(r) ? r.map(o => `${qa(n)}=${qa(o)}`).join("&") : `${qa(n)}=${qa(r)}`).filter(n => n);
    return t.length ? `?${t.join("&")}` : ""
}
var fM = /^[^\/()?;#]+/;

function Cf(e) {
    let t = e.match(fM);
    return t ? t[0] : ""
}
var hM = /^[^\/()?;=#]+/;

function pM(e) {
    let t = e.match(hM);
    return t ? t[0] : ""
}
var gM = /^[^=?&#]+/;

function mM(e) {
    let t = e.match(gM);
    return t ? t[0] : ""
}
var vM = /^[^&#]+/;

function yM(e) {
    let t = e.match(vM);
    return t ? t[0] : ""
}
var Tf = class {
    url;
    remaining;
    constructor(t) {
        this.url = t, this.remaining = t
    }
    parseRootSegment() {
        return this.consumeOptional("/"), this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#") ? new W([], {}) : new W([], this.parseChildren())
    }
    parseQueryParams() {
        let t = {};
        if (this.consumeOptional("?"))
            do this.parseQueryParam(t); while (this.consumeOptional("&"));
        return t
    }
    parseFragment() {
        return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
    }
    parseChildren() {
        if (this.remaining === "") return {};
        this.consumeOptional("/");
        let t = [];
        for (this.peekStartsWith("(") || t.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");) this.capture("/"), t.push(this.parseSegment());
        let n = {};
        this.peekStartsWith("/(") && (this.capture("/"), n = this.parseParens(!0));
        let r = {};
        return this.peekStartsWith("(") && (r = this.parseParens(!1)), (t.length > 0 || Object.keys(n).length > 0) && (r[P] = new W(t, n)), r
    }
    parseSegment() {
        let t = Cf(this.remaining);
        if (t === "" && this.peekStartsWith(";")) throw new C(4009, !1);
        return this.capture(t), new Zn(Ka(t), this.parseMatrixParams())
    }
    parseMatrixParams() {
        let t = {};
        for (; this.consumeOptional(";");) this.parseParam(t);
        return t
    }
    parseParam(t) {
        let n = pM(this.remaining);
        if (!n) return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let o = Cf(this.remaining);
            o && (r = o, this.capture(r))
        }
        t[Ka(n)] = Ka(r)
    }
    parseQueryParam(t) {
        let n = mM(this.remaining);
        if (!n) return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = yM(this.remaining);
            s && (r = s, this.capture(r))
        }
        let o = Wy(n),
            i = Wy(r);
        if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || (s = [s], t[o] = s), s.push(i)
        } else t[o] = i
    }
    parseParens(t) {
        let n = {};
        for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
            let r = Cf(this.remaining),
                o = this.remaining[r.length];
            if (o !== "/" && o !== ")" && o !== ";") throw new C(4010, !1);
            let i;
            r.indexOf(":") > -1 ? (i = r.slice(0, r.indexOf(":")), this.capture(i), this.capture(":")) : t && (i = P);
            let s = this.parseChildren();
            n[i] = Object.keys(s).length === 1 ? s[P] : new W([], s), this.consumeOptional("//")
        }
        return n
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t)
    }
    consumeOptional(t) {
        return this.peekStartsWith(t) ? (this.remaining = this.remaining.substring(t.length), !0) : !1
    }
    capture(t) {
        if (!this.consumeOptional(t)) throw new C(4011, !1)
    }
};

function sE(e) {
    return e.segments.length > 0 ? new W([], {
        [P]: e
    }) : e
}

function aE(e) {
    let t = {};
    for (let [r, o] of Object.entries(e.children)) {
        let i = aE(o);
        if (r === P && i.segments.length === 0 && i.hasChildren())
            for (let [s, a] of Object.entries(i.children)) t[s] = a;
        else(i.segments.length > 0 || i.hasChildren()) && (t[r] = i)
    }
    let n = new W(e.segments, t);
    return EM(n)
}

function EM(e) {
    if (e.numberOfChildren === 1 && e.children[P]) {
        let t = e.children[P];
        return new W(e.segments.concat(t.segments), t.children)
    }
    return e
}

function ln(e) {
    return e instanceof Bt
}

function DM(e, t, n = null, r = null) {
    let o = cE(e);
    return lE(o, t, n, r)
}

function cE(e) {
    let t;

    function n(i) {
        let s = {};
        for (let c of i.children) {
            let l = n(c);
            s[c.outlet] = l
        }
        let a = new W(i.url, s);
        return i === e && (t = a), a
    }
    let r = n(e.root),
        o = sE(r);
    return t ? ? o
}

function lE(e, t, n, r) {
    let o = e;
    for (; o.parent;) o = o.parent;
    if (t.length === 0) return _f(o, o, o, n, r);
    let i = CM(t);
    if (i.toRoot()) return _f(o, o, new W([], {}), n, r);
    let s = _M(i, o, e),
        a = s.processChildren ? ni(s.segmentGroup, s.index, i.commands) : dE(s.segmentGroup, s.index, i.commands);
    return _f(o, s.segmentGroup, a, n, r)
}

function Ja(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath
}

function ii(e) {
    return typeof e == "object" && e != null && e.outlets
}

function _f(e, t, n, r, o) {
    let i = {};
    r && Object.entries(r).forEach(([c, l]) => {
        i[c] = Array.isArray(l) ? l.map(u => `${u}`) : `${l}`
    });
    let s;
    e === t ? s = n : s = uE(e, t, n);
    let a = sE(aE(s));
    return new Bt(a, i, o)
}

function uE(e, t, n) {
    let r = {};
    return Object.entries(e.children).forEach(([o, i]) => {
        i === t ? r[o] = n : r[o] = uE(i, t, n)
    }), new W(e.segments, r)
}
var Xa = class {
    isAbsolute;
    numberOfDoubleDots;
    commands;
    constructor(t, n, r) {
        if (this.isAbsolute = t, this.numberOfDoubleDots = n, this.commands = r, t && r.length > 0 && Ja(r[0])) throw new C(4003, !1);
        let o = r.find(ii);
        if (o && o !== Xy(r)) throw new C(4004, !1)
    }
    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    }
};

function CM(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/") return new Xa(!0, 0, e);
    let t = 0,
        n = !1,
        r = e.reduce((o, i, s) => {
            if (typeof i == "object" && i != null) {
                if (i.outlets) {
                    let a = {};
                    return Object.entries(i.outlets).forEach(([c, l]) => {
                        a[c] = typeof l == "string" ? l.split("/") : l
                    }), [...o, {
                        outlets: a
                    }]
                }
                if (i.segmentPath) return [...o, i.segmentPath]
            }
            return typeof i != "string" ? [...o, i] : s === 0 ? (i.split("/").forEach((a, c) => {
                c == 0 && a === "." || (c == 0 && a === "" ? n = !0 : a === ".." ? t++ : a != "" && o.push(a))
            }), o) : [...o, i]
        }, []);
    return new Xa(n, t, r)
}
var Ur = class {
    segmentGroup;
    processChildren;
    index;
    constructor(t, n, r) {
        this.segmentGroup = t, this.processChildren = n, this.index = r
    }
};

function _M(e, t, n) {
    if (e.isAbsolute) return new Ur(t, !0, 0);
    if (!n) return new Ur(t, !1, NaN);
    if (n.parent === null) return new Ur(n, !0, 0);
    let r = Ja(e.commands[0]) ? 0 : 1,
        o = n.segments.length - 1 + r;
    return wM(n, o, e.numberOfDoubleDots)
}

function wM(e, t, n) {
    let r = e,
        o = t,
        i = n;
    for (; i > o;) {
        if (i -= o, r = r.parent, !r) throw new C(4005, !1);
        o = r.segments.length
    }
    return new Ur(r, !1, o - i)
}

function IM(e) {
    return ii(e[0]) ? e[0].outlets : {
        [P]: e
    }
}

function dE(e, t, n) {
    if (e ? ? = new W([], {}), e.segments.length === 0 && e.hasChildren()) return ni(e, t, n);
    let r = bM(e, t, n),
        o = n.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let i = new W(e.segments.slice(0, r.pathIndex), {});
        return i.children[P] = new W(e.segments.slice(r.pathIndex), e.children), ni(i, 0, o)
    } else return r.match && o.length === 0 ? new W(e.segments, {}) : r.match && !e.hasChildren() ? Af(e, t, n) : r.match ? ni(e, 0, o) : Af(e, t, n)
}

function ni(e, t, n) {
    if (n.length === 0) return new W(e.segments, {}); {
        let r = IM(n),
            o = {};
        if (Object.keys(r).some(i => i !== P) && e.children[P] && e.numberOfChildren === 1 && e.children[P].segments.length === 0) {
            let i = ni(e.children[P], t, n);
            return new W(e.segments, i.children)
        }
        return Object.entries(r).forEach(([i, s]) => {
            typeof s == "string" && (s = [s]), s !== null && (o[i] = dE(e.children[i], t, s))
        }), Object.entries(e.children).forEach(([i, s]) => {
            r[i] === void 0 && (o[i] = s)
        }), new W(e.segments, o)
    }
}

function bM(e, t, n) {
    let r = 0,
        o = t,
        i = {
            match: !1,
            pathIndex: 0,
            commandIndex: 0
        };
    for (; o < e.segments.length;) {
        if (r >= n.length) return i;
        let s = e.segments[o],
            a = n[r];
        if (ii(a)) break;
        let c = `${a}`,
            l = r < n.length - 1 ? n[r + 1] : null;
        if (o > 0 && c === void 0) break;
        if (c && l && typeof l == "object" && l.outlets === void 0) {
            if (!Zy(c, l, s)) return i;
            r += 2
        } else {
            if (!Zy(c, {}, s)) return i;
            r++
        }
        o++
    }
    return {
        match: !0,
        pathIndex: o,
        commandIndex: r
    }
}

function Af(e, t, n) {
    let r = e.segments.slice(0, t),
        o = 0;
    for (; o < n.length;) {
        let i = n[o];
        if (ii(i)) {
            let c = SM(i.outlets);
            return new W(r, c)
        }
        if (o === 0 && Ja(n[0])) {
            let c = e.segments[t];
            r.push(new Zn(c.path, qy(n[0]))), o++;
            continue
        }
        let s = ii(i) ? i.outlets[P] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
        s && a && Ja(a) ? (r.push(new Zn(s, qy(a))), o += 2) : (r.push(new Zn(s, {})), o++)
    }
    return new W(r, {})
}

function SM(e) {
    let t = {};
    return Object.entries(e).forEach(([n, r]) => {
        typeof r == "string" && (r = [r]), r !== null && (t[n] = Af(new W([], {}), 0, r))
    }), t
}

function qy(e) {
    let t = {};
    return Object.entries(e).forEach(([n, r]) => t[n] = `${r}`), t
}

function Zy(e, t, n) {
    return e == n.path && It(t, n.parameters)
}
var ri = "imperative",
    ye = (function(e) {
        return e[e.NavigationStart = 0] = "NavigationStart", e[e.NavigationEnd = 1] = "NavigationEnd", e[e.NavigationCancel = 2] = "NavigationCancel", e[e.NavigationError = 3] = "NavigationError", e[e.RoutesRecognized = 4] = "RoutesRecognized", e[e.ResolveStart = 5] = "ResolveStart", e[e.ResolveEnd = 6] = "ResolveEnd", e[e.GuardsCheckStart = 7] = "GuardsCheckStart", e[e.GuardsCheckEnd = 8] = "GuardsCheckEnd", e[e.RouteConfigLoadStart = 9] = "RouteConfigLoadStart", e[e.RouteConfigLoadEnd = 10] = "RouteConfigLoadEnd", e[e.ChildActivationStart = 11] = "ChildActivationStart", e[e.ChildActivationEnd = 12] = "ChildActivationEnd", e[e.ActivationStart = 13] = "ActivationStart", e[e.ActivationEnd = 14] = "ActivationEnd", e[e.Scroll = 15] = "Scroll", e[e.NavigationSkipped = 16] = "NavigationSkipped", e
    })(ye || {}),
    et = class {
        id;
        url;
        constructor(t, n) {
            this.id = t, this.url = n
        }
    },
    Wr = class extends et {
        type = ye.NavigationStart;
        navigationTrigger;
        restoredState;
        constructor(t, n, r = "imperative", o = null) {
            super(t, n), this.navigationTrigger = r, this.restoredState = o
        }
        toString() {
            return `NavigationStart(id: ${this.id}, url: '${this.url}')`
        }
    },
    Ut = class extends et {
        urlAfterRedirects;
        type = ye.NavigationEnd;
        constructor(t, n, r) {
            super(t, n), this.urlAfterRedirects = r
        }
        toString() {
            return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
        }
    },
    Pe = (function(e) {
        return e[e.Redirect = 0] = "Redirect", e[e.SupersededByNewNavigation = 1] = "SupersededByNewNavigation", e[e.NoDataFromResolver = 2] = "NoDataFromResolver", e[e.GuardRejected = 3] = "GuardRejected", e[e.Aborted = 4] = "Aborted", e
    })(Pe || {}),
    ec = (function(e) {
        return e[e.IgnoredSameUrlNavigation = 0] = "IgnoredSameUrlNavigation", e[e.IgnoredByUrlHandlingStrategy = 1] = "IgnoredByUrlHandlingStrategy", e
    })(ec || {}),
    jt = class extends et {
        reason;
        code;
        type = ye.NavigationCancel;
        constructor(t, n, r, o) {
            super(t, n), this.reason = r, this.code = o
        }
        toString() {
            return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
        }
    },
    un = class extends et {
        reason;
        code;
        type = ye.NavigationSkipped;
        constructor(t, n, r, o) {
            super(t, n), this.reason = r, this.code = o
        }
    },
    si = class extends et {
        error;
        target;
        type = ye.NavigationError;
        constructor(t, n, r, o) {
            super(t, n), this.error = r, this.target = o
        }
        toString() {
            return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
        }
    },
    tc = class extends et {
        urlAfterRedirects;
        state;
        type = ye.RoutesRecognized;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    Nf = class extends et {
        urlAfterRedirects;
        state;
        type = ye.GuardsCheckStart;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    Rf = class extends et {
        urlAfterRedirects;
        state;
        shouldActivate;
        type = ye.GuardsCheckEnd;
        constructor(t, n, r, o, i) {
            super(t, n), this.urlAfterRedirects = r, this.state = o, this.shouldActivate = i
        }
        toString() {
            return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
        }
    },
    xf = class extends et {
        urlAfterRedirects;
        state;
        type = ye.ResolveStart;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    Of = class extends et {
        urlAfterRedirects;
        state;
        type = ye.ResolveEnd;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    Pf = class {
        route;
        type = ye.RouteConfigLoadStart;
        constructor(t) {
            this.route = t
        }
        toString() {
            return `RouteConfigLoadStart(path: ${this.route.path})`
        }
    },
    kf = class {
        route;
        type = ye.RouteConfigLoadEnd;
        constructor(t) {
            this.route = t
        }
        toString() {
            return `RouteConfigLoadEnd(path: ${this.route.path})`
        }
    },
    Ff = class {
        snapshot;
        type = ye.ChildActivationStart;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    },
    Lf = class {
        snapshot;
        type = ye.ChildActivationEnd;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    },
    Vf = class {
        snapshot;
        type = ye.ActivationStart;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    },
    jf = class {
        snapshot;
        type = ye.ActivationEnd;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    };
var ai = class {},
    qr = class {
        url;
        navigationBehaviorOptions;
        constructor(t, n) {
            this.url = t, this.navigationBehaviorOptions = n
        }
    };

function MM(e) {
    return !(e instanceof ai) && !(e instanceof qr)
}

function TM(e, t) {
    return e.providers && !e._injector && (e._injector = Or(e.providers, t, `Route: ${e.path}`)), e._injector ? ? t
}

function ut(e) {
    return e.outlet || P
}

function AM(e, t) {
    let n = e.filter(r => ut(r) === t);
    return n.push(...e.filter(r => ut(r) !== t)), n
}

function Yr(e) {
    if (!e) return null;
    if (e.routeConfig ? ._injector) return e.routeConfig._injector;
    for (let t = e.parent; t; t = t.parent) {
        let n = t.routeConfig;
        if (n ? ._loadedInjector) return n._loadedInjector;
        if (n ? ._injector) return n._injector
    }
    return null
}
var Bf = class {
        rootInjector;
        outlet = null;
        route = null;
        children;
        attachRef = null;
        get injector() {
            return Yr(this.route ? .snapshot) ? ? this.rootInjector
        }
        constructor(t) {
            this.rootInjector = t, this.children = new hi(this.rootInjector)
        }
    },
    hi = (() => {
        class e {
            rootInjector;
            contexts = new Map;
            constructor(n) {
                this.rootInjector = n
            }
            onChildOutletCreated(n, r) {
                let o = this.getOrCreateContext(n);
                o.outlet = r, this.contexts.set(n, o)
            }
            onChildOutletDestroyed(n) {
                let r = this.getContext(n);
                r && (r.outlet = null, r.attachRef = null)
            }
            onOutletDeactivated() {
                let n = this.contexts;
                return this.contexts = new Map, n
            }
            onOutletReAttached(n) {
                this.contexts = n
            }
            getOrCreateContext(n) {
                let r = this.getContext(n);
                return r || (r = new Bf(this.rootInjector), this.contexts.set(n, r)), r
            }
            getContext(n) {
                return this.contexts.get(n) || null
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A(de))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    nc = class {
        _root;
        constructor(t) {
            this._root = t
        }
        get root() {
            return this._root.value
        }
        parent(t) {
            let n = this.pathFromRoot(t);
            return n.length > 1 ? n[n.length - 2] : null
        }
        children(t) {
            let n = Uf(t, this._root);
            return n ? n.children.map(r => r.value) : []
        }
        firstChild(t) {
            let n = Uf(t, this._root);
            return n && n.children.length > 0 ? n.children[0].value : null
        }
        siblings(t) {
            let n = Hf(t, this._root);
            return n.length < 2 ? [] : n[n.length - 2].children.map(o => o.value).filter(o => o !== t)
        }
        pathFromRoot(t) {
            return Hf(t, this._root).map(n => n.value)
        }
    };

function Uf(e, t) {
    if (e === t.value) return t;
    for (let n of t.children) {
        let r = Uf(e, n);
        if (r) return r
    }
    return null
}

function Hf(e, t) {
    if (e === t.value) return [t];
    for (let n of t.children) {
        let r = Hf(e, n);
        if (r.length) return r.unshift(t), r
    }
    return []
}
var Ge = class {
    value;
    children;
    constructor(t, n) {
        this.value = t, this.children = n
    }
    toString() {
        return `TreeNode(${this.value})`
    }
};

function Br(e) {
    let t = {};
    return e && e.children.forEach(n => t[n.value.outlet] = n), t
}
var rc = class extends nc {
    snapshot;
    constructor(t, n) {
        super(t), this.snapshot = n, Kf(this, t)
    }
    toString() {
        return this.snapshot.toString()
    }
};

function fE(e) {
    let t = NM(e),
        n = new le([new Zn("", {})]),
        r = new le({}),
        o = new le({}),
        i = new le({}),
        s = new le(""),
        a = new dn(n, r, i, s, o, P, e, t.root);
    return a.snapshot = t.root, new rc(new Ge(a, []), t)
}

function NM(e) {
    let t = {},
        n = {},
        r = {},
        i = new Hr([], t, r, "", n, P, e, null, {});
    return new ic("", new Ge(i, []))
}
var dn = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    constructor(t, n, r, o, i, s, a, c) {
        this.urlSubject = t, this.paramsSubject = n, this.queryParamsSubject = r, this.fragmentSubject = o, this.dataSubject = i, this.outlet = s, this.component = a, this._futureSnapshot = c, this.title = this.dataSubject ? .pipe(B(l => l[fi])) ? ? T(void 0), this.url = t, this.params = n, this.queryParams = r, this.fragment = o, this.data = i
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap ? ? = this.params.pipe(B(t => zr(t))), this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap ? ? = this.queryParams.pipe(B(t => zr(t))), this._queryParamMap
    }
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
    }
};

function oc(e, t, n = "emptyOnly") {
    let r, {
        routeConfig: o
    } = e;
    return t !== null && (n === "always" || o ? .path === "" || !t.component && !t.routeConfig ? .loadComponent) ? r = {
        params: E(E({}, t.params), e.params),
        data: E(E({}, t.data), e.data),
        resolve: E(E(E(E({}, e.data), t.data), o ? .data), e._resolvedData)
    } : r = {
        params: E({}, e.params),
        data: E({}, e.data),
        resolve: E(E({}, e.data), e._resolvedData ? ? {})
    }, o && pE(o) && (r.resolve[fi] = o.title), r
}
var Hr = class {
        url;
        params;
        queryParams;
        fragment;
        data;
        outlet;
        component;
        routeConfig;
        _resolve;
        _resolvedData;
        _routerState;
        _paramMap;
        _queryParamMap;
        get title() {
            return this.data ? .[fi]
        }
        constructor(t, n, r, o, i, s, a, c, l) {
            this.url = t, this.params = n, this.queryParams = r, this.fragment = o, this.data = i, this.outlet = s, this.component = a, this.routeConfig = c, this._resolve = l
        }
        get root() {
            return this._routerState.root
        }
        get parent() {
            return this._routerState.parent(this)
        }
        get firstChild() {
            return this._routerState.firstChild(this)
        }
        get children() {
            return this._routerState.children(this)
        }
        get pathFromRoot() {
            return this._routerState.pathFromRoot(this)
        }
        get paramMap() {
            return this._paramMap ? ? = zr(this.params), this._paramMap
        }
        get queryParamMap() {
            return this._queryParamMap ? ? = zr(this.queryParams), this._queryParamMap
        }
        toString() {
            let t = this.url.map(r => r.toString()).join("/"),
                n = this.routeConfig ? this.routeConfig.path : "";
            return `Route(url:'${t}', path:'${n}')`
        }
    },
    ic = class extends nc {
        url;
        constructor(t, n) {
            super(n), this.url = t, Kf(this, n)
        }
        toString() {
            return hE(this._root)
        }
    };

function Kf(e, t) {
    t.value._routerState = e, t.children.forEach(n => Kf(e, n))
}

function hE(e) {
    let t = e.children.length > 0 ? ` { ${e.children.map(hE).join(", ")} } ` : "";
    return `${e.value}${t}`
}

function wf(e) {
    if (e.snapshot) {
        let t = e.snapshot,
            n = e._futureSnapshot;
        e.snapshot = n, It(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams), t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment), It(t.params, n.params) || e.paramsSubject.next(n.params), nM(t.url, n.url) || e.urlSubject.next(n.url), It(t.data, n.data) || e.dataSubject.next(n.data)
    } else e.snapshot = e._futureSnapshot, e.dataSubject.next(e._futureSnapshot.data)
}

function $f(e, t) {
    let n = It(e.params, t.params) && sM(e.url, t.url),
        r = !e.parent != !t.parent;
    return n && !r && (!e.parent || $f(e.parent, t.parent))
}

function pE(e) {
    return typeof e.title == "string" || e.title === null
}
var RM = new D(""),
    gE = (() => {
        class e {
            activated = null;
            get activatedComponentRef() {
                return this.activated
            }
            _activatedRoute = null;
            name = P;
            activateEvents = new se;
            deactivateEvents = new se;
            attachEvents = new se;
            detachEvents = new se;
            routerOutletData = yy(void 0);
            parentContexts = v(hi);
            location = v(Bn);
            changeDetector = v(Fr);
            inputBinder = v(lc, {
                optional: !0
            });
            supportsBindingToComponentInputs = !0;
            ngOnChanges(n) {
                if (n.name) {
                    let {
                        firstChange: r,
                        previousValue: o
                    } = n.name;
                    if (r) return;
                    this.isTrackedInParentContexts(o) && (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)), this.initializeOutletWithName()
                }
            }
            ngOnDestroy() {
                this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name), this.inputBinder ? .unsubscribeFromRouteData(this)
            }
            isTrackedInParentContexts(n) {
                return this.parentContexts.getContext(n) ? .outlet === this
            }
            ngOnInit() {
                this.initializeOutletWithName()
            }
            initializeOutletWithName() {
                if (this.parentContexts.onChildOutletCreated(this.name, this), this.activated) return;
                let n = this.parentContexts.getContext(this.name);
                n ? .route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector))
            }
            get isActivated() {
                return !!this.activated
            }
            get component() {
                if (!this.activated) throw new C(4012, !1);
                return this.activated.instance
            }
            get activatedRoute() {
                if (!this.activated) throw new C(4012, !1);
                return this._activatedRoute
            }
            get activatedRouteData() {
                return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
            }
            detach() {
                if (!this.activated) throw new C(4012, !1);
                this.location.detach();
                let n = this.activated;
                return this.activated = null, this._activatedRoute = null, this.detachEvents.emit(n.instance), n
            }
            attach(n, r) {
                this.activated = n, this._activatedRoute = r, this.location.insert(n.hostView), this.inputBinder ? .bindActivatedRouteToOutletComponent(this), this.attachEvents.emit(n.instance)
            }
            deactivate() {
                if (this.activated) {
                    let n = this.component;
                    this.activated.destroy(), this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(n)
                }
            }
            activateWith(n, r) {
                if (this.isActivated) throw new C(4013, !1);
                this._activatedRoute = n;
                let o = this.location,
                    s = n.snapshot.component,
                    a = this.parentContexts.getOrCreateContext(this.name).children,
                    c = new zf(n, a, o.injector, this.routerOutletData);
                this.activated = o.createComponent(s, {
                    index: o.length,
                    injector: c,
                    environmentInjector: r
                }), this.changeDetector.markForCheck(), this.inputBinder ? .bindActivatedRouteToOutletComponent(this), this.activateEvents.emit(this.activated.instance)
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["router-outlet"]
                ],
                inputs: {
                    name: "name",
                    routerOutletData: [1, "routerOutletData"]
                },
                outputs: {
                    activateEvents: "activate",
                    deactivateEvents: "deactivate",
                    attachEvents: "attach",
                    detachEvents: "detach"
                },
                exportAs: ["outlet"],
                features: [Ft]
            })
        }
        return e
    })(),
    zf = class {
        route;
        childContexts;
        parent;
        outletData;
        constructor(t, n, r, o) {
            this.route = t, this.childContexts = n, this.parent = r, this.outletData = o
        }
        get(t, n) {
            return t === dn ? this.route : t === hi ? this.childContexts : t === RM ? this.outletData : this.parent.get(t, n)
        }
    },
    lc = new D("");
var mE = (() => {
    class e {
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275cmp = K({
            type: e,
            selectors: [
                ["ng-component"]
            ],
            exportAs: ["emptyRouterOutlet"],
            decls: 1,
            vars: 0,
            template: function(r, o) {
                r & 1 && he(0, "router-outlet")
            },
            dependencies: [gE],
            encapsulation: 2
        })
    }
    return e
})();

function Jf(e) {
    let t = e.children && e.children.map(Jf),
        n = t ? V(E({}, e), {
            children: t
        }) : E({}, e);
    return !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== P && (n.component = mE), n
}

function xM(e, t, n) {
    let r = ci(e, t._root, n ? n._root : void 0);
    return new rc(r, t)
}

function ci(e, t, n) {
    if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
        let r = n.value;
        r._futureSnapshot = t.value;
        let o = OM(e, t, n);
        return new Ge(r, o)
    } else {
        if (e.shouldAttach(t.value)) {
            let i = e.retrieve(t.value);
            if (i !== null) {
                let s = i.route;
                return s.value._futureSnapshot = t.value, s.children = t.children.map(a => ci(e, a)), s
            }
        }
        let r = PM(t.value),
            o = t.children.map(i => ci(e, i));
        return new Ge(r, o)
    }
}

function OM(e, t, n) {
    return t.children.map(r => {
        for (let o of n.children)
            if (e.shouldReuseRoute(r.value, o.value.snapshot)) return ci(e, r, o);
        return ci(e, r)
    })
}

function PM(e) {
    return new dn(new le(e.url), new le(e.params), new le(e.queryParams), new le(e.fragment), new le(e.data), e.outlet, e.component, e)
}
var li = class {
        redirectTo;
        navigationBehaviorOptions;
        constructor(t, n) {
            this.redirectTo = t, this.navigationBehaviorOptions = n
        }
    },
    vE = "ngNavigationCancelingError";

function sc(e, t) {
    let {
        redirectTo: n,
        navigationBehaviorOptions: r
    } = ln(t) ? {
        redirectTo: t,
        navigationBehaviorOptions: void 0
    } : t, o = yE(!1, Pe.Redirect);
    return o.url = n, o.navigationBehaviorOptions = r, o
}

function yE(e, t) {
    let n = new Error(`NavigationCancelingError: ${e||""}`);
    return n[vE] = !0, n.cancellationCode = t, n
}

function kM(e) {
    return EE(e) && ln(e.url)
}

function EE(e) {
    return !!e && e[vE]
}
var FM = (e, t, n, r) => B(o => (new Gf(t, o.targetRouterState, o.currentRouterState, n, r).activate(e), o)),
    Gf = class {
        routeReuseStrategy;
        futureState;
        currState;
        forwardEvent;
        inputBindingEnabled;
        constructor(t, n, r, o, i) {
            this.routeReuseStrategy = t, this.futureState = n, this.currState = r, this.forwardEvent = o, this.inputBindingEnabled = i
        }
        activate(t) {
            let n = this.futureState._root,
                r = this.currState ? this.currState._root : null;
            this.deactivateChildRoutes(n, r, t), wf(this.futureState.root), this.activateChildRoutes(n, r, t)
        }
        deactivateChildRoutes(t, n, r) {
            let o = Br(n);
            t.children.forEach(i => {
                let s = i.value.outlet;
                this.deactivateRoutes(i, o[s], r), delete o[s]
            }), Object.values(o).forEach(i => {
                this.deactivateRouteAndItsChildren(i, r)
            })
        }
        deactivateRoutes(t, n, r) {
            let o = t.value,
                i = n ? n.value : null;
            if (o === i)
                if (o.component) {
                    let s = r.getContext(o.outlet);
                    s && this.deactivateChildRoutes(t, n, s.children)
                } else this.deactivateChildRoutes(t, n, r);
            else i && this.deactivateRouteAndItsChildren(n, r)
        }
        deactivateRouteAndItsChildren(t, n) {
            t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, n) : this.deactivateRouteAndOutlet(t, n)
        }
        detachAndStoreRouteSubtree(t, n) {
            let r = n.getContext(t.value.outlet),
                o = r && t.value.component ? r.children : n,
                i = Br(t);
            for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
            if (r && r.outlet) {
                let s = r.outlet.detach(),
                    a = r.children.onOutletDeactivated();
                this.routeReuseStrategy.store(t.value.snapshot, {
                    componentRef: s,
                    route: t,
                    contexts: a
                })
            }
        }
        deactivateRouteAndOutlet(t, n) {
            let r = n.getContext(t.value.outlet),
                o = r && t.value.component ? r.children : n,
                i = Br(t);
            for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
            r && (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()), r.attachRef = null, r.route = null)
        }
        activateChildRoutes(t, n, r) {
            let o = Br(n);
            t.children.forEach(i => {
                this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new jf(i.value.snapshot))
            }), t.children.length && this.forwardEvent(new Lf(t.value.snapshot))
        }
        activateRoutes(t, n, r) {
            let o = t.value,
                i = n ? n.value : null;
            if (wf(o), o === i)
                if (o.component) {
                    let s = r.getOrCreateContext(o.outlet);
                    this.activateChildRoutes(t, n, s.children)
                } else this.activateChildRoutes(t, n, r);
            else if (o.component) {
                let s = r.getOrCreateContext(o.outlet);
                if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
                    let a = this.routeReuseStrategy.retrieve(o.snapshot);
                    this.routeReuseStrategy.store(o.snapshot, null), s.children.onOutletReAttached(a.contexts), s.attachRef = a.componentRef, s.route = a.route.value, s.outlet && s.outlet.attach(a.componentRef, a.route.value), wf(a.route.value), this.activateChildRoutes(t, null, s.children)
                } else s.attachRef = null, s.route = o, s.outlet && s.outlet.activateWith(o, s.injector), this.activateChildRoutes(t, null, s.children)
            } else this.activateChildRoutes(t, null, r)
        }
    },
    ac = class {
        path;
        route;
        constructor(t) {
            this.path = t, this.route = this.path[this.path.length - 1]
        }
    },
    $r = class {
        component;
        route;
        constructor(t, n) {
            this.component = t, this.route = n
        }
    };

function LM(e, t, n) {
    let r = e._root,
        o = t ? t._root : null;
    return ti(r, o, n, [r.value])
}

function VM(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !t || t.length === 0 ? null : {
        node: e,
        guards: t
    }
}

function Qr(e, t) {
    let n = Symbol(),
        r = t.get(e, n);
    return r === n ? typeof e == "function" && !Cl(e) ? e : t.get(e) : r
}

function ti(e, t, n, r, o = {
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = Br(t);
    return e.children.forEach(s => {
        jM(s, i[s.value.outlet], n, r.concat([s.value]), o), delete i[s.value.outlet]
    }), Object.entries(i).forEach(([s, a]) => oi(a, n.getContext(s), o)), o
}

function jM(e, t, n, r, o = {
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = e.value,
        s = t ? t.value : null,
        a = n ? n.getContext(e.value.outlet) : null;
    if (s && i.routeConfig === s.routeConfig) {
        let c = BM(s, i, i.routeConfig.runGuardsAndResolvers);
        c ? o.canActivateChecks.push(new ac(r)) : (i.data = s.data, i._resolvedData = s._resolvedData), i.component ? ti(e, t, a ? a.children : null, r, o) : ti(e, t, n, r, o), c && a && a.outlet && a.outlet.isActivated && o.canDeactivateChecks.push(new $r(a.outlet.component, s))
    } else s && oi(t, a, o), o.canActivateChecks.push(new ac(r)), i.component ? ti(e, null, a ? a.children : null, r, o) : ti(e, null, n, r, o);
    return o
}

function BM(e, t, n) {
    if (typeof n == "function") return n(e, t);
    switch (n) {
        case "pathParamsChange":
            return !Yn(e.url, t.url);
        case "pathParamsOrQueryParamsChange":
            return !Yn(e.url, t.url) || !It(e.queryParams, t.queryParams);
        case "always":
            return !0;
        case "paramsOrQueryParamsChange":
            return !$f(e, t) || !It(e.queryParams, t.queryParams);
        case "paramsChange":
        default:
            return !$f(e, t)
    }
}

function oi(e, t, n) {
    let r = Br(e),
        o = e.value;
    Object.entries(r).forEach(([i, s]) => {
        o.component ? t ? oi(s, t.children.getContext(i), n) : oi(s, null, n) : oi(s, t, n)
    }), o.component ? t && t.outlet && t.outlet.isActivated ? n.canDeactivateChecks.push(new $r(t.outlet.component, o)) : n.canDeactivateChecks.push(new $r(null, o)) : n.canDeactivateChecks.push(new $r(null, o))
}

function pi(e) {
    return typeof e == "function"
}

function UM(e) {
    return typeof e == "boolean"
}

function HM(e) {
    return e && pi(e.canLoad)
}

function $M(e) {
    return e && pi(e.canActivate)
}

function zM(e) {
    return e && pi(e.canActivateChild)
}

function GM(e) {
    return e && pi(e.canDeactivate)
}

function WM(e) {
    return e && pi(e.canMatch)
}

function DE(e) {
    return e instanceof bt || e ? .name === "EmptyError"
}
var Za = Symbol("INITIAL_VALUE");

function Zr() {
    return Ne(e => ts(e.map(t => t.pipe(St(1), il(Za)))).pipe(B(t => {
        for (let n of t)
            if (n !== !0) {
                if (n === Za) return Za;
                if (n === !1 || qM(n)) return n
            }
        return !0
    }), We(t => t !== Za), St(1)))
}

function qM(e) {
    return ln(e) || e instanceof li
}

function ZM(e, t) {
    return ue(n => {
        let {
            targetSnapshot: r,
            currentSnapshot: o,
            guards: {
                canActivateChecks: i,
                canDeactivateChecks: s
            }
        } = n;
        return s.length === 0 && i.length === 0 ? T(V(E({}, n), {
            guardsResult: !0
        })) : YM(s, r, o, e).pipe(ue(a => a && UM(a) ? QM(r, i, e, t) : T(a)), B(a => V(E({}, n), {
            guardsResult: a
        })))
    })
}

function YM(e, t, n, r) {
    return X(e).pipe(ue(o => tT(o.component, o.route, n, t, r)), Mt(o => o !== !0, !0))
}

function QM(e, t, n, r) {
    return X(t).pipe(dr(o => ur(JM(o.route.parent, r), KM(o.route, r), eT(e, o.path, n), XM(e, o.route, n))), Mt(o => o !== !0, !0))
}

function KM(e, t) {
    return e !== null && t && t(new Vf(e)), T(!0)
}

function JM(e, t) {
    return e !== null && t && t(new Ff(e)), T(!0)
}

function XM(e, t, n) {
    let r = t.routeConfig ? t.routeConfig.canActivate : null;
    if (!r || r.length === 0) return T(!0);
    let o = r.map(i => io(() => {
        let s = Yr(t) ? ? n,
            a = Qr(i, s),
            c = $M(a) ? a.canActivate(t, e) : De(s, () => a(t, e));
        return Ht(c).pipe(Mt())
    }));
    return T(o).pipe(Zr())
}

function eT(e, t, n) {
    let r = t[t.length - 1],
        i = t.slice(0, t.length - 1).reverse().map(s => VM(s)).filter(s => s !== null).map(s => io(() => {
            let a = s.guards.map(c => {
                let l = Yr(s.node) ? ? n,
                    u = Qr(c, l),
                    d = zM(u) ? u.canActivateChild(r, e) : De(l, () => u(r, e));
                return Ht(d).pipe(Mt())
            });
            return T(a).pipe(Zr())
        }));
    return T(i).pipe(Zr())
}

function tT(e, t, n, r, o) {
    let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
    if (!i || i.length === 0) return T(!0);
    let s = i.map(a => {
        let c = Yr(t) ? ? o,
            l = Qr(a, c),
            u = GM(l) ? l.canDeactivate(e, t, n, r) : De(c, () => l(e, t, n, r));
        return Ht(u).pipe(Mt())
    });
    return T(s).pipe(Zr())
}

function nT(e, t, n, r) {
    let o = t.canLoad;
    if (o === void 0 || o.length === 0) return T(!0);
    let i = o.map(s => {
        let a = Qr(s, e),
            c = HM(a) ? a.canLoad(t, n) : De(e, () => a(t, n));
        return Ht(c)
    });
    return T(i).pipe(Zr(), CE(r))
}

function CE(e) {
    return Kc(pe(t => {
        if (typeof t != "boolean") throw sc(e, t)
    }), B(t => t === !0))
}

function rT(e, t, n, r) {
    let o = t.canMatch;
    if (!o || o.length === 0) return T(!0);
    let i = o.map(s => {
        let a = Qr(s, e),
            c = WM(a) ? a.canMatch(t, n) : De(e, () => a(t, n));
        return Ht(c)
    });
    return T(i).pipe(Zr(), CE(r))
}
var ui = class {
        segmentGroup;
        constructor(t) {
            this.segmentGroup = t || null
        }
    },
    di = class extends Error {
        urlTree;
        constructor(t) {
            super(), this.urlTree = t
        }
    };

function jr(e) {
    return lr(new ui(e))
}

function oT(e) {
    return lr(new C(4e3, !1))
}

function iT(e) {
    return lr(yE(!1, Pe.GuardRejected))
}
var Wf = class {
    urlSerializer;
    urlTree;
    constructor(t, n) {
        this.urlSerializer = t, this.urlTree = n
    }
    lineralizeSegments(t, n) {
        let r = [],
            o = n.root;
        for (;;) {
            if (r = r.concat(o.segments), o.numberOfChildren === 0) return T(r);
            if (o.numberOfChildren > 1 || !o.children[P]) return oT(`${t.redirectTo}`);
            o = o.children[P]
        }
    }
    applyRedirectCommands(t, n, r, o, i) {
        return sT(n, o, i).pipe(B(s => {
            if (s instanceof Bt) throw new di(s);
            let a = this.applyRedirectCreateUrlTree(s, this.urlSerializer.parse(s), t, r);
            if (s[0] === "/") throw new di(a);
            return a
        }))
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
        let i = this.createSegmentGroup(t, n.root, r, o);
        return new Bt(i, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment)
    }
    createQueryParams(t, n) {
        let r = {};
        return Object.entries(t).forEach(([o, i]) => {
            if (typeof i == "string" && i[0] === ":") {
                let a = i.substring(1);
                r[o] = n[a]
            } else r[o] = i
        }), r
    }
    createSegmentGroup(t, n, r, o) {
        let i = this.createSegments(t, n.segments, r, o),
            s = {};
        return Object.entries(n.children).forEach(([a, c]) => {
            s[a] = this.createSegmentGroup(t, c, r, o)
        }), new W(i, s)
    }
    createSegments(t, n, r, o) {
        return n.map(i => i.path[0] === ":" ? this.findPosParam(t, i, o) : this.findOrReturn(i, r))
    }
    findPosParam(t, n, r) {
        let o = r[n.path.substring(1)];
        if (!o) throw new C(4001, !1);
        return o
    }
    findOrReturn(t, n) {
        let r = 0;
        for (let o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++
        }
        return t
    }
};

function sT(e, t, n) {
    if (typeof e == "string") return T(e);
    let r = e,
        {
            queryParams: o,
            fragment: i,
            routeConfig: s,
            url: a,
            outlet: c,
            params: l,
            data: u,
            title: d
        } = t;
    return Ht(De(n, () => r({
        params: l,
        data: u,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: c,
        title: d
    })))
}
var qf = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {}
};

function aT(e, t, n, r, o) {
    let i = _E(e, t, n);
    return i.matched ? (r = TM(t, r), rT(r, t, n, o).pipe(B(s => s === !0 ? i : E({}, qf)))) : T(i)
}

function _E(e, t, n) {
    if (t.path === "**") return cT(n);
    if (t.path === "") return t.pathMatch === "full" && (e.hasChildren() || n.length > 0) ? E({}, qf) : {
        matched: !0,
        consumedSegments: [],
        remainingSegments: n,
        parameters: {},
        positionalParamSegments: {}
    };
    let o = (t.matcher || tM)(n, e, t);
    if (!o) return E({}, qf);
    let i = {};
    Object.entries(o.posParams ? ? {}).forEach(([a, c]) => {
        i[a] = c.path
    });
    let s = o.consumed.length > 0 ? E(E({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
    return {
        matched: !0,
        consumedSegments: o.consumed,
        remainingSegments: n.slice(o.consumed.length),
        parameters: s,
        positionalParamSegments: o.posParams ? ? {}
    }
}

function cT(e) {
    return {
        matched: !0,
        parameters: e.length > 0 ? Xy(e).parameters : {},
        consumedSegments: e,
        remainingSegments: [],
        positionalParamSegments: {}
    }
}

function Yy(e, t, n, r) {
    return n.length > 0 && dT(e, n, r) ? {
        segmentGroup: new W(t, uT(r, new W(n, e.children))),
        slicedSegments: []
    } : n.length === 0 && fT(e, n, r) ? {
        segmentGroup: new W(e.segments, lT(e, n, r, e.children)),
        slicedSegments: n
    } : {
        segmentGroup: new W(e.segments, e.children),
        slicedSegments: n
    }
}

function lT(e, t, n, r) {
    let o = {};
    for (let i of n)
        if (uc(e, t, i) && !r[ut(i)]) {
            let s = new W([], {});
            o[ut(i)] = s
        }
    return E(E({}, r), o)
}

function uT(e, t) {
    let n = {};
    n[P] = t;
    for (let r of e)
        if (r.path === "" && ut(r) !== P) {
            let o = new W([], {});
            n[ut(r)] = o
        }
    return n
}

function dT(e, t, n) {
    return n.some(r => uc(e, t, r) && ut(r) !== P)
}

function fT(e, t, n) {
    return n.some(r => uc(e, t, r))
}

function uc(e, t, n) {
    return (e.hasChildren() || t.length > 0) && n.pathMatch === "full" ? !1 : n.path === ""
}

function hT(e, t, n) {
    return t.length === 0 && !e.children[n]
}
var Zf = class {};

function pT(e, t, n, r, o, i, s = "emptyOnly") {
    return new Yf(e, t, n, r, o, s, i).recognize()
}
var gT = 31,
    Yf = class {
        injector;
        configLoader;
        rootComponentType;
        config;
        urlTree;
        paramsInheritanceStrategy;
        urlSerializer;
        applyRedirects;
        absoluteRedirectCount = 0;
        allowRedirects = !0;
        constructor(t, n, r, o, i, s, a) {
            this.injector = t, this.configLoader = n, this.rootComponentType = r, this.config = o, this.urlTree = i, this.paramsInheritanceStrategy = s, this.urlSerializer = a, this.applyRedirects = new Wf(this.urlSerializer, this.urlTree)
        }
        noMatchError(t) {
            return new C(4002, `'${t.segmentGroup}'`)
        }
        recognize() {
            let t = Yy(this.urlTree.root, [], [], this.config).segmentGroup;
            return this.match(t).pipe(B(({
                children: n,
                rootSnapshot: r
            }) => {
                let o = new Ge(r, n),
                    i = new ic("", o),
                    s = DM(r, [], this.urlTree.queryParams, this.urlTree.fragment);
                return s.queryParams = this.urlTree.queryParams, i.url = this.urlSerializer.serialize(s), {
                    state: i,
                    tree: s
                }
            }))
        }
        match(t) {
            let n = new Hr([], Object.freeze({}), Object.freeze(E({}, this.urlTree.queryParams)), this.urlTree.fragment, Object.freeze({}), P, this.rootComponentType, null, {});
            return this.processSegmentGroup(this.injector, this.config, t, P, n).pipe(B(r => ({
                children: r,
                rootSnapshot: n
            })), zt(r => {
                if (r instanceof di) return this.urlTree = r.urlTree, this.match(r.urlTree.root);
                throw r instanceof ui ? this.noMatchError(r) : r
            }))
        }
        processSegmentGroup(t, n, r, o, i) {
            return r.segments.length === 0 && r.hasChildren() ? this.processChildren(t, n, r, i) : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(B(s => s instanceof Ge ? [s] : []))
        }
        processChildren(t, n, r, o) {
            let i = [];
            for (let s of Object.keys(r.children)) s === "primary" ? i.unshift(s) : i.push(s);
            return X(i).pipe(dr(s => {
                let a = r.children[s],
                    c = AM(n, s);
                return this.processSegmentGroup(t, c, a, s, o)
            }), ol((s, a) => (s.push(...a), s)), Gt(null), rl(), ue(s => {
                if (s === null) return jr(r);
                let a = wE(s);
                return mT(a), T(a)
            }))
        }
        processSegment(t, n, r, o, i, s, a) {
            return X(n).pipe(dr(c => this.processSegmentAgainstRoute(c._injector ? ? t, n, c, r, o, i, s, a).pipe(zt(l => {
                if (l instanceof ui) return T(null);
                throw l
            }))), Mt(c => !!c), zt(c => {
                if (DE(c)) return hT(r, o, i) ? T(new Zf) : jr(r);
                throw c
            }))
        }
        processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
            return ut(r) !== s && (s === P || !uc(o, i, r)) ? jr(o) : r.redirectTo === void 0 ? this.matchSegmentAgainstRoute(t, o, r, i, s, c) : this.allowRedirects && a ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c) : jr(o)
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
            let {
                matched: c,
                parameters: l,
                consumedSegments: u,
                positionalParamSegments: d,
                remainingSegments: m
            } = _E(n, o, i);
            if (!c) return jr(n);
            typeof o.redirectTo == "string" && o.redirectTo[0] === "/" && (this.absoluteRedirectCount++, this.absoluteRedirectCount > gT && (this.allowRedirects = !1));
            let g = new Hr(i, l, Object.freeze(E({}, this.urlTree.queryParams)), this.urlTree.fragment, Qy(o), ut(o), o.component ? ? o._loadedComponent ? ? null, o, Ky(o)),
                y = oc(g, a, this.paramsInheritanceStrategy);
            return g.params = Object.freeze(y.params), g.data = Object.freeze(y.data), this.applyRedirects.applyRedirectCommands(u, o.redirectTo, d, g, t).pipe(Ne(k => this.applyRedirects.lineralizeSegments(o, k)), ue(k => this.processSegment(t, r, n, k.concat(m), s, !1, a)))
        }
        matchSegmentAgainstRoute(t, n, r, o, i, s) {
            let a = aT(n, r, o, t, this.urlSerializer);
            return r.path === "**" && (n.children = {}), a.pipe(Ne(c => c.matched ? (t = r._injector ? ? t, this.getChildConfig(t, r, o).pipe(Ne(({
                routes: l
            }) => {
                let u = r._loadedInjector ? ? t,
                    {
                        parameters: d,
                        consumedSegments: m,
                        remainingSegments: g
                    } = c,
                    y = new Hr(m, d, Object.freeze(E({}, this.urlTree.queryParams)), this.urlTree.fragment, Qy(r), ut(r), r.component ? ? r._loadedComponent ? ? null, r, Ky(r)),
                    _ = oc(y, s, this.paramsInheritanceStrategy);
                y.params = Object.freeze(_.params), y.data = Object.freeze(_.data);
                let {
                    segmentGroup: k,
                    slicedSegments: L
                } = Yy(n, m, g, l);
                if (L.length === 0 && k.hasChildren()) return this.processChildren(u, l, k, y).pipe(B(Qn => new Ge(y, Qn)));
                if (l.length === 0 && L.length === 0) return T(new Ge(y, []));
                let Fc = ut(r) === i;
                return this.processSegment(u, l, k, L, Fc ? P : i, !0, y).pipe(B(Qn => new Ge(y, Qn instanceof Ge ? [Qn] : [])))
            }))) : jr(n)))
        }
        getChildConfig(t, n, r) {
            return n.children ? T({
                routes: n.children,
                injector: t
            }) : n.loadChildren ? n._loadedRoutes !== void 0 ? T({
                routes: n._loadedRoutes,
                injector: n._loadedInjector
            }) : nT(t, n, r, this.urlSerializer).pipe(ue(o => o ? this.configLoader.loadChildren(t, n).pipe(pe(i => {
                n._loadedRoutes = i.routes, n._loadedInjector = i.injector
            })) : iT(n))) : T({
                routes: [],
                injector: t
            })
        }
    };

function mT(e) {
    e.sort((t, n) => t.value.outlet === P ? -1 : n.value.outlet === P ? 1 : t.value.outlet.localeCompare(n.value.outlet))
}

function vT(e) {
    let t = e.value.routeConfig;
    return t && t.path === ""
}

function wE(e) {
    let t = [],
        n = new Set;
    for (let r of e) {
        if (!vT(r)) {
            t.push(r);
            continue
        }
        let o = t.find(i => r.value.routeConfig === i.value.routeConfig);
        o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r)
    }
    for (let r of n) {
        let o = wE(r.children);
        t.push(new Ge(r.value, o))
    }
    return t.filter(r => !n.has(r))
}

function Qy(e) {
    return e.data || {}
}

function Ky(e) {
    return e.resolve || {}
}

function yT(e, t, n, r, o, i) {
    return ue(s => pT(e, t, n, r, s.extractedUrl, o, i).pipe(B(({
        state: a,
        tree: c
    }) => V(E({}, s), {
        targetSnapshot: a,
        urlAfterRedirects: c
    }))))
}

function ET(e, t) {
    return ue(n => {
        let {
            targetSnapshot: r,
            guards: {
                canActivateChecks: o
            }
        } = n;
        if (!o.length) return T(n);
        let i = new Set(o.map(c => c.route)),
            s = new Set;
        for (let c of i)
            if (!s.has(c))
                for (let l of IE(c)) s.add(l);
        let a = 0;
        return X(s).pipe(dr(c => i.has(c) ? DT(c, r, e, t) : (c.data = oc(c, c.parent, e).resolve, T(void 0))), pe(() => a++), fr(1), ue(c => a === s.size ? T(n) : Te))
    })
}

function IE(e) {
    let t = e.children.map(n => IE(n)).flat();
    return [e, ...t]
}

function DT(e, t, n, r) {
    let o = e.routeConfig,
        i = e._resolve;
    return o ? .title !== void 0 && !pE(o) && (i[fi] = o.title), io(() => (e.data = oc(e, e.parent, n).resolve, CT(i, e, t, r).pipe(B(s => (e._resolvedData = s, e.data = E(E({}, e.data), s), null)))))
}

function CT(e, t, n, r) {
    let o = Sf(e);
    if (o.length === 0) return T({});
    let i = {};
    return X(o).pipe(ue(s => _T(e[s], t, n, r).pipe(Mt(), pe(a => {
        if (a instanceof li) throw sc(new Gr, a);
        i[s] = a
    }))), fr(1), B(() => i), zt(s => DE(s) ? Te : lr(s)))
}

function _T(e, t, n, r) {
    let o = Yr(t) ? ? r,
        i = Qr(e, o),
        s = i.resolve ? i.resolve(t, n) : De(o, () => i(t, n));
    return Ht(s)
}

function If(e) {
    return Ne(t => {
        let n = e(t);
        return n ? X(n).pipe(B(() => t)) : T(t)
    })
}
var bE = (() => {
        class e {
            buildTitle(n) {
                let r, o = n.root;
                for (; o !== void 0;) r = this.getResolvedTitleForRoute(o) ? ? r, o = o.children.find(i => i.outlet === P);
                return r
            }
            getResolvedTitleForRoute(n) {
                return n.data[fi]
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => v(wT),
                providedIn: "root"
            })
        }
        return e
    })(),
    wT = (() => {
        class e extends bE {
            title;
            constructor(n) {
                super(), this.title = n
            }
            updateTitle(n) {
                let r = this.buildTitle(n);
                r !== void 0 && this.title.setTitle(r)
            }
            static\ u0275fac = function(r) {
                return new(r || e)(A(Hy))
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    gi = new D("", {
        providedIn: "root",
        factory: () => ({})
    }),
    dc = new D(""),
    SE = (() => {
        class e {
            componentLoaders = new WeakMap;
            childrenLoaders = new WeakMap;
            onLoadStartListener;
            onLoadEndListener;
            compiler = v(jd);
            loadComponent(n, r) {
                if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
                if (r._loadedComponent) return T(r._loadedComponent);
                this.onLoadStartListener && this.onLoadStartListener(r);
                let o = Ht(De(n, () => r.loadComponent())).pipe(B(ME), Ne(TE), pe(s => {
                        this.onLoadEndListener && this.onLoadEndListener(r), r._loadedComponent = s
                    }), so(() => {
                        this.componentLoaders.delete(r)
                    })),
                    i = new cr(o, () => new ne).pipe(ar());
                return this.componentLoaders.set(r, i), i
            }
            loadChildren(n, r) {
                if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
                if (r._loadedRoutes) return T({
                    routes: r._loadedRoutes,
                    injector: r._loadedInjector
                });
                this.onLoadStartListener && this.onLoadStartListener(r);
                let i = IT(r, this.compiler, n, this.onLoadEndListener).pipe(so(() => {
                        this.childrenLoaders.delete(r)
                    })),
                    s = new cr(i, () => new ne).pipe(ar());
                return this.childrenLoaders.set(r, s), s
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function IT(e, t, n, r) {
    return Ht(De(n, () => e.loadChildren())).pipe(B(ME), Ne(TE), ue(o => o instanceof wa || Array.isArray(o) ? T(o) : X(t.compileModuleAsync(o))), B(o => {
        r && r(e);
        let i, s, a = !1;
        return Array.isArray(o) ? (s = o, a = !0) : (i = o.create(n).injector, s = i.get(dc, [], {
            optional: !0,
            self: !0
        }).flat()), {
            routes: s.map(Jf),
            injector: i
        }
    }))
}

function bT(e) {
    return e && typeof e == "object" && "default" in e
}

function ME(e) {
    return bT(e) ? e.default : e
}

function TE(e) {
    return T(e)
}
var Xf = (() => {
        class e {
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => v(ST),
                providedIn: "root"
            })
        }
        return e
    })(),
    ST = (() => {
        class e {
            shouldProcessUrl(n) {
                return !0
            }
            extract(n) {
                return n
            }
            merge(n, r) {
                return n
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    AE = new D("");
var NE = new D(""),
    RE = (() => {
        class e {
            currentNavigation = Oe(null, {
                equal: () => !1
            });
            currentTransition = null;
            lastSuccessfulNavigation = null;
            events = new ne;
            transitionAbortWithErrorSubject = new ne;
            configLoader = v(SE);
            environmentInjector = v(de);
            destroyRef = v(yt);
            urlSerializer = v(cc);
            rootContexts = v(hi);
            location = v(Vr);
            inputBindingEnabled = v(lc, {
                optional: !0
            }) !== null;
            titleStrategy = v(bE);
            options = v(gi, {
                optional: !0
            }) || {};
            paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
            urlHandlingStrategy = v(Xf);
            createViewTransition = v(AE, {
                optional: !0
            });
            navigationErrorHandler = v(NE, {
                optional: !0
            });
            navigationId = 0;
            get hasRequestedNavigation() {
                return this.navigationId !== 0
            }
            transitions;
            afterPreactivation = () => T(void 0);
            rootComponentType = null;
            destroyed = !1;
            constructor() {
                let n = o => this.events.next(new Pf(o)),
                    r = o => this.events.next(new kf(o));
                this.configLoader.onLoadEndListener = r, this.configLoader.onLoadStartListener = n, this.destroyRef.onDestroy(() => {
                    this.destroyed = !0
                })
            }
            complete() {
                this.transitions ? .complete()
            }
            handleNavigationRequest(n) {
                let r = ++this.navigationId;
                ge(() => {
                    this.transitions ? .next(V(E({}, n), {
                        extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl),
                        targetSnapshot: null,
                        targetRouterState: null,
                        guards: {
                            canActivateChecks: [],
                            canDeactivateChecks: []
                        },
                        guardsResult: null,
                        abortController: new AbortController,
                        id: r
                    }))
                })
            }
            setupNavigations(n) {
                return this.transitions = new le(null), this.transitions.pipe(We(r => r !== null), Ne(r => {
                    let o = !1;
                    return T(r).pipe(Ne(i => {
                        if (this.navigationId > r.id) return this.cancelNavigationTransition(r, "", Pe.SupersededByNewNavigation), Te;
                        this.currentTransition = r, this.currentNavigation.set({
                            id: i.id,
                            initialUrl: i.rawUrl,
                            extractedUrl: i.extractedUrl,
                            targetBrowserUrl: typeof i.extras.browserUrl == "string" ? this.urlSerializer.parse(i.extras.browserUrl) : i.extras.browserUrl,
                            trigger: i.source,
                            extras: i.extras,
                            previousNavigation: this.lastSuccessfulNavigation ? V(E({}, this.lastSuccessfulNavigation), {
                                previousNavigation: null
                            }) : null,
                            abort: () => i.abortController.abort()
                        });
                        let s = !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                            a = i.extras.onSameUrlNavigation ? ? n.onSameUrlNavigation;
                        if (!s && a !== "reload") return this.events.next(new un(i.id, this.urlSerializer.serialize(i.rawUrl), "", ec.IgnoredSameUrlNavigation)), i.resolve(!1), Te;
                        if (this.urlHandlingStrategy.shouldProcessUrl(i.rawUrl)) return T(i).pipe(Ne(c => (this.events.next(new Wr(c.id, this.urlSerializer.serialize(c.extractedUrl), c.source, c.restoredState)), c.id !== this.navigationId ? Te : Promise.resolve(c))), yT(this.environmentInjector, this.configLoader, this.rootComponentType, n.config, this.urlSerializer, this.paramsInheritanceStrategy), pe(c => {
                            r.targetSnapshot = c.targetSnapshot, r.urlAfterRedirects = c.urlAfterRedirects, this.currentNavigation.update(u => (u.finalUrl = c.urlAfterRedirects, u));
                            let l = new tc(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot);
                            this.events.next(l)
                        }));
                        if (s && this.urlHandlingStrategy.shouldProcessUrl(i.currentRawUrl)) {
                            let {
                                id: c,
                                extractedUrl: l,
                                source: u,
                                restoredState: d,
                                extras: m
                            } = i, g = new Wr(c, this.urlSerializer.serialize(l), u, d);
                            this.events.next(g);
                            let y = fE(this.rootComponentType).snapshot;
                            return this.currentTransition = r = V(E({}, i), {
                                targetSnapshot: y,
                                urlAfterRedirects: l,
                                extras: V(E({}, m), {
                                    skipLocationChange: !1,
                                    replaceUrl: !1
                                })
                            }), this.currentNavigation.update(_ => (_.finalUrl = l, _)), T(r)
                        } else return this.events.next(new un(i.id, this.urlSerializer.serialize(i.extractedUrl), "", ec.IgnoredByUrlHandlingStrategy)), i.resolve(!1), Te
                    }), pe(i => {
                        let s = new Nf(i.id, this.urlSerializer.serialize(i.extractedUrl), this.urlSerializer.serialize(i.urlAfterRedirects), i.targetSnapshot);
                        this.events.next(s)
                    }), B(i => (this.currentTransition = r = V(E({}, i), {
                        guards: LM(i.targetSnapshot, i.currentSnapshot, this.rootContexts)
                    }), r)), ZM(this.environmentInjector, i => this.events.next(i)), pe(i => {
                        if (r.guardsResult = i.guardsResult, i.guardsResult && typeof i.guardsResult != "boolean") throw sc(this.urlSerializer, i.guardsResult);
                        let s = new Rf(i.id, this.urlSerializer.serialize(i.extractedUrl), this.urlSerializer.serialize(i.urlAfterRedirects), i.targetSnapshot, !!i.guardsResult);
                        this.events.next(s)
                    }), We(i => i.guardsResult ? !0 : (this.cancelNavigationTransition(i, "", Pe.GuardRejected), !1)), If(i => {
                        if (i.guards.canActivateChecks.length !== 0) return T(i).pipe(pe(s => {
                            let a = new xf(s.id, this.urlSerializer.serialize(s.extractedUrl), this.urlSerializer.serialize(s.urlAfterRedirects), s.targetSnapshot);
                            this.events.next(a)
                        }), Ne(s => {
                            let a = !1;
                            return T(s).pipe(ET(this.paramsInheritanceStrategy, this.environmentInjector), pe({
                                next: () => a = !0,
                                complete: () => {
                                    a || this.cancelNavigationTransition(s, "", Pe.NoDataFromResolver)
                                }
                            }))
                        }), pe(s => {
                            let a = new Of(s.id, this.urlSerializer.serialize(s.extractedUrl), this.urlSerializer.serialize(s.urlAfterRedirects), s.targetSnapshot);
                            this.events.next(a)
                        }))
                    }), If(i => {
                        let s = a => {
                            let c = [];
                            if (a.routeConfig ? .loadComponent) {
                                let l = Yr(a) ? ? this.environmentInjector;
                                c.push(this.configLoader.loadComponent(l, a.routeConfig).pipe(pe(u => {
                                    a.component = u
                                }), B(() => {})))
                            }
                            for (let l of a.children) c.push(...s(l));
                            return c
                        };
                        return ts(s(i.targetSnapshot.root)).pipe(Gt(null), St(1))
                    }), If(() => this.afterPreactivation()), Ne(() => {
                        let {
                            currentSnapshot: i,
                            targetSnapshot: s
                        } = r, a = this.createViewTransition ? .(this.environmentInjector, i.root, s.root);
                        return a ? X(a).pipe(B(() => r)) : T(r)
                    }), B(i => {
                        let s = xM(n.routeReuseStrategy, i.targetSnapshot, i.currentRouterState);
                        return this.currentTransition = r = V(E({}, i), {
                            targetRouterState: s
                        }), this.currentNavigation.update(a => (a.targetRouterState = s, a)), r
                    }), pe(() => {
                        this.events.next(new ai)
                    }), FM(this.rootContexts, n.routeReuseStrategy, i => this.events.next(i), this.inputBindingEnabled), St(1), rs(new U(i => {
                        let s = r.abortController.signal,
                            a = () => i.next();
                        return s.addEventListener("abort", a), () => s.removeEventListener("abort", a)
                    }).pipe(We(() => !o && !r.targetRouterState), pe(() => {
                        this.cancelNavigationTransition(r, r.abortController.signal.reason + "", Pe.Aborted)
                    }))), pe({
                        next: i => {
                            o = !0, this.lastSuccessfulNavigation = ge(this.currentNavigation), this.events.next(new Ut(i.id, this.urlSerializer.serialize(i.extractedUrl), this.urlSerializer.serialize(i.urlAfterRedirects))), this.titleStrategy ? .updateTitle(i.targetRouterState.snapshot), i.resolve(!0)
                        },
                        complete: () => {
                            o = !0
                        }
                    }), rs(this.transitionAbortWithErrorSubject.pipe(pe(i => {
                        throw i
                    }))), so(() => {
                        o || this.cancelNavigationTransition(r, "", Pe.SupersededByNewNavigation), this.currentTransition ? .id === r.id && (this.currentNavigation.set(null), this.currentTransition = null)
                    }), zt(i => {
                        if (this.destroyed) return r.resolve(!1), Te;
                        if (o = !0, EE(i)) this.events.next(new jt(r.id, this.urlSerializer.serialize(r.extractedUrl), i.message, i.cancellationCode)), kM(i) ? this.events.next(new qr(i.url, i.navigationBehaviorOptions)) : r.resolve(!1);
                        else {
                            let s = new si(r.id, this.urlSerializer.serialize(r.extractedUrl), i, r.targetSnapshot ? ? void 0);
                            try {
                                let a = De(this.environmentInjector, () => this.navigationErrorHandler ? .(s));
                                if (a instanceof li) {
                                    let {
                                        message: c,
                                        cancellationCode: l
                                    } = sc(this.urlSerializer, a);
                                    this.events.next(new jt(r.id, this.urlSerializer.serialize(r.extractedUrl), c, l)), this.events.next(new qr(a.redirectTo, a.navigationBehaviorOptions))
                                } else throw this.events.next(s), i
                            } catch (a) {
                                this.options.resolveNavigationPromiseOnError ? r.resolve(!1) : r.reject(a)
                            }
                        }
                        return Te
                    }))
                }))
            }
            cancelNavigationTransition(n, r, o) {
                let i = new jt(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
                this.events.next(i), n.resolve(!1)
            }
            isUpdatingInternalState() {
                return this.currentTransition ? .extractedUrl.toString() !== this.currentTransition ? .currentUrlTree.toString()
            }
            isUpdatedBrowserUrl() {
                let n = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
                    r = ge(this.currentNavigation),
                    o = r ? .targetBrowserUrl ? ? r ? .extractedUrl;
                return n.toString() !== o ? .toString() && !r ? .extras.skipLocationChange
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function MT(e) {
    return e !== ri
}
var TT = (() => {
        class e {
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => v(AT),
                providedIn: "root"
            })
        }
        return e
    })(),
    Qf = class {
        shouldDetach(t) {
            return !1
        }
        store(t, n) {}
        shouldAttach(t) {
            return !1
        }
        retrieve(t) {
            return null
        }
        shouldReuseRoute(t, n) {
            return t.routeConfig === n.routeConfig
        }
    },
    AT = (() => {
        class e extends Qf {
            static\ u0275fac = (() => {
                let n;
                return function(o) {
                    return (n || (n = Jt(e)))(o || e)
                }
            })();
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    xE = (() => {
        class e {
            urlSerializer = v(cc);
            options = v(gi, {
                optional: !0
            }) || {};
            canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
            location = v(Vr);
            urlHandlingStrategy = v(Xf);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            currentUrlTree = new Bt;
            getCurrentUrlTree() {
                return this.currentUrlTree
            }
            rawUrlTree = this.currentUrlTree;
            getRawUrlTree() {
                return this.rawUrlTree
            }
            createBrowserPath({
                finalUrl: n,
                initialUrl: r,
                targetBrowserUrl: o
            }) {
                let i = n !== void 0 ? this.urlHandlingStrategy.merge(n, r) : r,
                    s = o ? ? i;
                return s instanceof Bt ? this.urlSerializer.serialize(s) : s
            }
            commitTransition({
                targetRouterState: n,
                finalUrl: r,
                initialUrl: o
            }) {
                r && n ? (this.currentUrlTree = r, this.rawUrlTree = this.urlHandlingStrategy.merge(r, o), this.routerState = n) : this.rawUrlTree = o
            }
            routerState = fE(null);
            getRouterState() {
                return this.routerState
            }
            stateMemento = this.createStateMemento();
            updateStateMemento() {
                this.stateMemento = this.createStateMemento()
            }
            createStateMemento() {
                return {
                    rawUrlTree: this.rawUrlTree,
                    currentUrlTree: this.currentUrlTree,
                    routerState: this.routerState
                }
            }
            resetInternalState({
                finalUrl: n
            }) {
                this.routerState = this.stateMemento.routerState, this.currentUrlTree = this.stateMemento.currentUrlTree, this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n ? ? this.rawUrlTree)
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: () => v(NT),
                providedIn: "root"
            })
        }
        return e
    })(),
    NT = (() => {
        class e extends xE {
            currentPageId = 0;
            lastSuccessfulId = -1;
            restoredState() {
                return this.location.getState()
            }
            get browserPageId() {
                return this.canceledNavigationResolution !== "computed" ? this.currentPageId : this.restoredState() ? .\u0275routerPageId ? ? this.currentPageId
            }
            registerNonRouterCurrentEntryChangeListener(n) {
                return this.location.subscribe(r => {
                    r.type === "popstate" && setTimeout(() => {
                        n(r.url, r.state, "popstate")
                    })
                })
            }
            handleRouterEvent(n, r) {
                n instanceof Wr ? this.updateStateMemento() : n instanceof un ? this.commitTransition(r) : n instanceof tc ? this.urlUpdateStrategy === "eager" && (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r)) : n instanceof ai ? (this.commitTransition(r), this.urlUpdateStrategy === "deferred" && !r.extras.skipLocationChange && this.setBrowserUrl(this.createBrowserPath(r), r)) : n instanceof jt && n.code !== Pe.SupersededByNewNavigation && n.code !== Pe.Redirect ? this.restoreHistory(r) : n instanceof si ? this.restoreHistory(r, !0) : n instanceof Ut && (this.lastSuccessfulId = n.id, this.currentPageId = this.browserPageId)
            }
            setBrowserUrl(n, {
                extras: r,
                id: o
            }) {
                let {
                    replaceUrl: i,
                    state: s
                } = r;
                if (this.location.isCurrentPathEqualTo(n) || i) {
                    let a = this.browserPageId,
                        c = E(E({}, s), this.generateNgRouterState(o, a));
                    this.location.replaceState(n, "", c)
                } else {
                    let a = E(E({}, s), this.generateNgRouterState(o, this.browserPageId + 1));
                    this.location.go(n, "", a)
                }
            }
            restoreHistory(n, r = !1) {
                if (this.canceledNavigationResolution === "computed") {
                    let o = this.browserPageId,
                        i = this.currentPageId - o;
                    i !== 0 ? this.location.historyGo(i) : this.getCurrentUrlTree() === n.finalUrl && i === 0 && (this.resetInternalState(n), this.resetUrlToCurrentUrlTree())
                } else this.canceledNavigationResolution === "replace" && (r && this.resetInternalState(n), this.resetUrlToCurrentUrlTree())
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
            }
            generateNgRouterState(n, r) {
                return this.canceledNavigationResolution === "computed" ? {
                    navigationId: n,
                    \u0275routerPageId: r
                } : {
                    navigationId: n
                }
            }
            static\ u0275fac = (() => {
                let n;
                return function(o) {
                    return (n || (n = Jt(e)))(o || e)
                }
            })();
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function OE(e, t) {
    e.events.pipe(We(n => n instanceof Ut || n instanceof jt || n instanceof si || n instanceof un), B(n => n instanceof Ut || n instanceof un ? 0 : (n instanceof jt ? n.code === Pe.Redirect || n.code === Pe.SupersededByNewNavigation : !1) ? 2 : 1), We(n => n !== 2), St(1)).subscribe(() => {
        t()
    })
}
var RT = {
        paths: "exact",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "exact"
    },
    xT = {
        paths: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "subset"
    },
    fc = (() => {
        class e {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree()
            }
            get rawUrlTree() {
                return this.stateManager.getRawUrlTree()
            }
            disposed = !1;
            nonRouterCurrentEntryChangeSubscription;
            console = v(Sa);
            stateManager = v(xE);
            options = v(gi, {
                optional: !0
            }) || {};
            pendingTasks = v(st);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            navigationTransitions = v(RE);
            urlSerializer = v(cc);
            location = v(Vr);
            urlHandlingStrategy = v(Xf);
            injector = v(de);
            _events = new ne;
            get events() {
                return this._events
            }
            get routerState() {
                return this.stateManager.getRouterState()
            }
            navigated = !1;
            routeReuseStrategy = v(TT);
            onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
            config = v(dc, {
                optional: !0
            }) ? .flat() ? ? [];
            componentInputBindingEnabled = !!v(lc, {
                optional: !0
            });
            currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
            constructor() {
                this.resetConfig(this.config), this.navigationTransitions.setupNavigations(this).subscribe({
                    error: n => {
                        this.console.warn(n)
                    }
                }), this.subscribeToNavigationEvents()
            }
            eventsSubscription = new te;
            subscribeToNavigationEvents() {
                let n = this.navigationTransitions.events.subscribe(r => {
                    try {
                        let o = this.navigationTransitions.currentTransition,
                            i = ge(this.navigationTransitions.currentNavigation);
                        if (o !== null && i !== null) {
                            if (this.stateManager.handleRouterEvent(r, i), r instanceof jt && r.code !== Pe.Redirect && r.code !== Pe.SupersededByNewNavigation) this.navigated = !0;
                            else if (r instanceof Ut) this.navigated = !0;
                            else if (r instanceof qr) {
                                let s = r.navigationBehaviorOptions,
                                    a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                                    c = E({
                                        browserUrl: o.extras.browserUrl,
                                        info: o.extras.info,
                                        skipLocationChange: o.extras.skipLocationChange,
                                        replaceUrl: o.extras.replaceUrl || this.urlUpdateStrategy === "eager" || MT(o.source)
                                    }, s);
                                this.scheduleNavigation(a, ri, null, c, {
                                    resolve: o.resolve,
                                    reject: o.reject,
                                    promise: o.promise
                                })
                            }
                        }
                        MM(r) && this._events.next(r)
                    } catch (o) {
                        this.navigationTransitions.transitionAbortWithErrorSubject.next(o)
                    }
                });
                this.eventsSubscription.add(n)
            }
            resetRootComponentType(n) {
                this.routerState.root.component = n, this.navigationTransitions.rootComponentType = n
            }
            initialNavigation() {
                this.setUpLocationChangeListener(), this.navigationTransitions.hasRequestedNavigation || this.navigateToSyncWithBrowser(this.location.path(!0), ri, this.stateManager.restoredState())
            }
            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ? ? = this.stateManager.registerNonRouterCurrentEntryChangeListener((n, r, o) => {
                    this.navigateToSyncWithBrowser(n, o, r)
                })
            }
            navigateToSyncWithBrowser(n, r, o) {
                let i = {
                        replaceUrl: !0
                    },
                    s = o ? .navigationId ? o : null;
                if (o) {
                    let c = E({}, o);
                    delete c.navigationId, delete c.\u0275routerPageId, Object.keys(c).length !== 0 && (i.state = c)
                }
                let a = this.parseUrl(n);
                this.scheduleNavigation(a, r, s, i).catch(c => {
                    this.disposed || this.injector.get(be)(c)
                })
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree)
            }
            getCurrentNavigation() {
                return ge(this.navigationTransitions.currentNavigation)
            }
            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation
            }
            resetConfig(n) {
                this.config = n.map(Jf), this.navigated = !1
            }
            ngOnDestroy() {
                this.dispose()
            }
            dispose() {
                this._events.unsubscribe(), this.navigationTransitions.complete(), this.nonRouterCurrentEntryChangeSubscription && (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(), this.nonRouterCurrentEntryChangeSubscription = void 0), this.disposed = !0, this.eventsSubscription.unsubscribe()
            }
            createUrlTree(n, r = {}) {
                let {
                    relativeTo: o,
                    queryParams: i,
                    fragment: s,
                    queryParamsHandling: a,
                    preserveFragment: c
                } = r, l = c ? this.currentUrlTree.fragment : s, u = null;
                switch (a ? ? this.options.defaultQueryParamsHandling) {
                    case "merge":
                        u = E(E({}, this.currentUrlTree.queryParams), i);
                        break;
                    case "preserve":
                        u = this.currentUrlTree.queryParams;
                        break;
                    default:
                        u = i || null
                }
                u !== null && (u = this.removeEmptyProps(u));
                let d;
                try {
                    let m = o ? o.snapshot : this.routerState.snapshot.root;
                    d = cE(m)
                } catch {
                    (typeof n[0] != "string" || n[0][0] !== "/") && (n = []), d = this.currentUrlTree.root
                }
                return lE(d, n, u, l ? ? null)
            }
            navigateByUrl(n, r = {
                skipLocationChange: !1
            }) {
                let o = ln(n) ? n : this.parseUrl(n),
                    i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
                return this.scheduleNavigation(i, ri, null, r)
            }
            navigate(n, r = {
                skipLocationChange: !1
            }) {
                return OT(n), this.navigateByUrl(this.createUrlTree(n, r), r)
            }
            serializeUrl(n) {
                return this.urlSerializer.serialize(n)
            }
            parseUrl(n) {
                try {
                    return this.urlSerializer.parse(n)
                } catch {
                    return this.urlSerializer.parse("/")
                }
            }
            isActive(n, r) {
                let o;
                if (r === !0 ? o = E({}, RT) : r === !1 ? o = E({}, xT) : o = r, ln(n)) return Gy(this.currentUrlTree, n, o);
                let i = this.parseUrl(n);
                return Gy(this.currentUrlTree, i, o)
            }
            removeEmptyProps(n) {
                return Object.entries(n).reduce((r, [o, i]) => (i != null && (r[o] = i), r), {})
            }
            scheduleNavigation(n, r, o, i, s) {
                if (this.disposed) return Promise.resolve(!1);
                let a, c, l;
                s ? (a = s.resolve, c = s.reject, l = s.promise) : l = new Promise((d, m) => {
                    a = d, c = m
                });
                let u = this.pendingTasks.add();
                return OE(this, () => {
                    queueMicrotask(() => this.pendingTasks.remove(u))
                }), this.navigationTransitions.handleNavigationRequest({
                    source: r,
                    restoredState: o,
                    currentUrlTree: this.currentUrlTree,
                    currentRawUrl: this.currentUrlTree,
                    rawUrl: n,
                    extras: i,
                    resolve: a,
                    reject: c,
                    promise: l,
                    currentSnapshot: this.routerState.snapshot,
                    currentRouterState: this.routerState
                }), l.catch(d => Promise.reject(d))
            }
            static\ u0275fac = function(r) {
                return new(r || e)
            };
            static\ u0275prov = w({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function OT(e) {
    for (let t = 0; t < e.length; t++)
        if (e[t] == null) throw new C(4008, !1)
}
var hc = (() => {
    class e {
        router;
        route;
        tabIndexAttribute;
        renderer;
        el;
        locationStrategy;
        reactiveHref = Oe(null);
        get href() {
            return ge(this.reactiveHref)
        }
        set href(n) {
            this.reactiveHref.set(n)
        }
        target;
        queryParams;
        fragment;
        queryParamsHandling;
        state;
        info;
        relativeTo;
        isAnchorElement;
        subscription;
        onChanges = new ne;
        applicationErrorHandler = v(be);
        options = v(gi, {
            optional: !0
        });
        constructor(n, r, o, i, s, a) {
            this.router = n, this.route = r, this.tabIndexAttribute = o, this.renderer = i, this.el = s, this.locationStrategy = a, this.reactiveHref.set(v(new La("href"), {
                optional: !0
            }));
            let c = s.nativeElement.tagName ? .toLowerCase();
            this.isAnchorElement = c === "a" || c === "area" || !!(typeof customElements == "object" && customElements.get(c) ? .observedAttributes ? .includes ? .("href")), this.isAnchorElement ? this.setTabIndexIfNotOnNativeEl("0") : this.subscribeToNavigationEventsIfNecessary()
        }
        subscribeToNavigationEventsIfNecessary() {
            if (this.subscription !== void 0 || !this.isAnchorElement) return;
            let n = this.preserveFragment,
                r = o => o === "merge" || o === "preserve";
            n || = r(this.queryParamsHandling), n || = !this.queryParamsHandling && !r(this.options ? .defaultQueryParamsHandling), n && (this.subscription = this.router.events.subscribe(o => {
                o instanceof Ut && this.updateHref()
            }))
        }
        preserveFragment = !1;
        skipLocationChange = !1;
        replaceUrl = !1;
        setTabIndexIfNotOnNativeEl(n) {
            this.tabIndexAttribute != null || this.isAnchorElement || this.applyAttributeValue("tabindex", n)
        }
        ngOnChanges(n) {
            this.isAnchorElement && (this.updateHref(), this.subscribeToNavigationEventsIfNecessary()), this.onChanges.next(this)
        }
        routerLinkInput = null;
        set routerLink(n) {
            n == null ? (this.routerLinkInput = null, this.setTabIndexIfNotOnNativeEl(null)) : (ln(n) ? this.routerLinkInput = n : this.routerLinkInput = Array.isArray(n) ? n : [n], this.setTabIndexIfNotOnNativeEl("0"))
        }
        onClick(n, r, o, i, s) {
            let a = this.urlTree;
            if (a === null || this.isAnchorElement && (n !== 0 || r || o || i || s || typeof this.target == "string" && this.target != "_self")) return !0;
            let c = {
                skipLocationChange: this.skipLocationChange,
                replaceUrl: this.replaceUrl,
                state: this.state,
                info: this.info
            };
            return this.router.navigateByUrl(a, c) ? .catch(l => {
                this.applicationErrorHandler(l)
            }), !this.isAnchorElement
        }
        ngOnDestroy() {
            this.subscription ? .unsubscribe()
        }
        updateHref() {
            let n = this.urlTree;
            this.reactiveHref.set(n !== null && this.locationStrategy ? this.locationStrategy ? .prepareExternalUrl(this.router.serializeUrl(n)) ? ? "" : null)
        }
        applyAttributeValue(n, r) {
            let o = this.renderer,
                i = this.el.nativeElement;
            r !== null ? o.setAttribute(i, n, r) : o.removeAttribute(i, n)
        }
        get urlTree() {
            return this.routerLinkInput === null ? null : ln(this.routerLinkInput) ? this.routerLinkInput : this.router.createUrlTree(this.routerLinkInput, {
                relativeTo: this.relativeTo !== void 0 ? this.relativeTo : this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: this.preserveFragment
            })
        }
        static\ u0275fac = function(r) {
            return new(r || e)($(fc), $(dn), Ro("tabindex"), $(jn), $(Ct), $(Lr))
        };
        static\ u0275dir = ae({
            type: e,
            selectors: [
                ["", "routerLink", ""]
            ],
            hostVars: 2,
            hostBindings: function(r, o) {
                r & 1 && J("click", function(s) {
                    return o.onClick(s.button, s.ctrlKey, s.shiftKey, s.altKey, s.metaKey)
                }), r & 2 && Hn("href", o.reactiveHref(), rd)("target", o.target)
            },
            inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                info: "info",
                relativeTo: "relativeTo",
                preserveFragment: [2, "preserveFragment", "preserveFragment", Wn],
                skipLocationChange: [2, "skipLocationChange", "skipLocationChange", Wn],
                replaceUrl: [2, "replaceUrl", "replaceUrl", Wn],
                routerLink: "routerLink"
            },
            features: [Ft]
        })
    }
    return e
})();
var PT = new D("");

function eh(e, ...t) {
    return rt([{
            provide: dc,
            multi: !0,
            useValue: e
        },
        [], {
            provide: dn,
            useFactory: kT,
            deps: [fc]
        }, {
            provide: rn,
            multi: !0,
            useFactory: FT
        },
        t.map(n => n.\u0275providers)
    ])
}

function kT(e) {
    return e.routerState.root
}

function FT() {
    let e = v(Re);
    return t => {
        let n = e.get(Se);
        if (t !== n.components[0]) return;
        let r = e.get(fc),
            o = e.get(LT);
        e.get(VT) === 1 && r.initialNavigation(), e.get(jT, null, {
            optional: !0
        }) ? .setUpPreloading(), e.get(PT, null, {
            optional: !0
        }) ? .init(), r.resetRootComponentType(n.componentTypes[0]), o.closed || (o.next(), o.complete(), o.unsubscribe())
    }
}
var LT = new D("", {
        factory: () => new ne
    }),
    VT = new D("", {
        providedIn: "root",
        factory: () => 1
    });
var jT = new D("");
var PE = [];
var kE = {
    providers: [su(), Ud(), eh(PE), zy($y())]
};
var pc = class e {
    sectionSubject = new le("intro");
    section$ = this.sectionSubject.asObservable();
    get current() {
        return this.sectionSubject.value
    }
    setSection(t) {
        this.sectionSubject.next(t)
    }
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275prov = w({
        token: e,
        factory: e.\u0275fac,
        providedIn: "root"
    })
};
var gc = class e {
    activeSection = "intro";
    menuOpen = Oe(!1);
    sectionIds = ["intro", "about", "resume", "portfolio", "cta", "services", "contact"];
    platformId = v(Xt);
    elRef = v(Ct);
    nav = v(pc);
    ngOnInit() {
        qn(this.platformId) && this.updateActiveSection()
    }
    toggleMenu(t) {
        t.preventDefault(), this.menuOpen.update(n => !n)
    }
    closeMenu() {
        this.menuOpen.set(!1)
    }
    onDocumentClick(t) {
        if (!this.menuOpen() || !qn(this.platformId)) return;
        let n = t.target;
        this.elRef ? .nativeElement && !this.elRef.nativeElement.contains(n) && this.menuOpen.set(!1)
    }
    onEscape() {
        qn(this.platformId) && this.menuOpen.set(!1)
    }
    onScroll() {
        qn(this.platformId) && this.updateActiveSection()
    }
    updateActiveSection() {
        if (!qn(this.platformId)) return;
        let t = this.sectionIds[0];
        for (let n of this.sectionIds) {
            let r = document.getElementById(n);
            if (!r) continue;
            let o = r.getBoundingClientRect(),
                i = window.innerHeight * .35;
            o.top <= i && o.bottom > 80 && (t = n)
        }
        this.activeSection = t, this.nav.setSection(t)
    }
    scrollTo(t, n) {
        if (n && n.preventDefault(), !qn(this.platformId)) return;
        let r = document.getElementById(t);
        r && (r.scrollIntoView({
            behavior: "smooth",
            block: "start"
        }), this.menuOpen.set(!1))
    }
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-header"]
        ],
        hostBindings: function(n, r) {
            n & 1 && J("click", function(i) {
                return r.onDocumentClick(i)
            }, da)("keydown.escape", function() {
                return r.onEscape()
            }, da)("scroll", function() {
                return r.onScroll()
            }, od)
        },
        decls: 32,
        vars: 18,
        consts: [
            [1, "row"],
            [1, "top-bar"],
            ["href", "#", 1, "menu-toggle", 3, "click"],
            [1, "logo"],
            ["routerLink", "/"],
            ["id", "main-nav-wrap"],
            [1, "main-navigation"],
            ["href", "#intro", "title", "", 1, "smoothscroll", 3, "click"],
            ["href", "#about", "title", "", 1, "smoothscroll", 3, "click"],
            ["href", "#resume", "title", "", 1, "smoothscroll", 3, "click"],
            ["href", "#portfolio", "title", "", 1, "smoothscroll", 3, "click"],
            ["href", "#cta", "title", "", 1, "smoothscroll", 3, "click"],
            ["href", "#services", "title", "", 1, "smoothscroll", 3, "click"],
            ["href", "#contact", "title", "", 1, "smoothscroll", 3, "click"]
        ],
        template: function(n, r) {
            n & 1 && (I(0, "header")(1, "div", 0)(2, "div", 1)(3, "a", 2), J("click", function(i) {
                return r.toggleMenu(i)
            }), I(4, "span"), f(5, "Menu"), M()(), I(6, "div", 3)(7, "a", 4), f(8, "VIMAL SRIVASTAVA"), M()(), I(9, "nav", 5)(10, "ul", 6)(11, "li")(12, "a", 7), J("click", function(i) {
                return r.scrollTo("intro", i)
            }), f(13, "Home"), M()(), I(14, "li")(15, "a", 8), J("click", function(i) {
                return r.scrollTo("about", i)
            }), f(16, "About"), M()(), I(17, "li")(18, "a", 9), J("click", function(i) {
                return r.scrollTo("resume", i)
            }), f(19, "Resume"), M()(), I(20, "li")(21, "a", 10), J("click", function(i) {
                return r.scrollTo("portfolio", i)
            }), f(22, "Portfolio"), M()(), I(23, "li")(24, "a", 11), J("click", function(i) {
                return r.scrollTo("cta", i)
            }), f(25, "Positions of Responsibility"), M()(), I(26, "li")(27, "a", 12), J("click", function(i) {
                return r.scrollTo("services", i)
            }), f(28, "Services"), M()(), I(29, "li")(30, "a", 13), J("click", function(i) {
                return r.scrollTo("contact", i)
            }), f(31, "Contact"), M()()()()()()()), n & 2 && (q(3), Me("is-clicked", r.menuOpen()), q(6), Me("open", r.menuOpen()), q(2), Me("current", r.activeSection === "intro"), q(3), Me("current", r.activeSection === "about"), q(3), Me("current", r.activeSection === "resume"), q(3), Me("current", r.activeSection === "portfolio"), q(3), Me("current", r.activeSection === "cta"), q(3), Me("current", r.activeSection === "services"), q(3), Me("current", r.activeSection === "contact"))
        },
        dependencies: [cn, hc],
        styles: ["header[_ngcontent-%COMP%]   .top-bar[_ngcontent-%COMP%]{left:0!important;right:0!important;position:relative!important;width:100%!important}header[_ngcontent-%COMP%]{position:sticky;top:0;z-index:1000}.top-bar[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:space-between;padding:10px 0}.top-bar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;font-weight:600}header[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto;padding:0 24px;min-height:66px}header[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{background:#0b1b24}header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{float:none!important;margin:0!important;display:flex;align-items:center}header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-flex!important}@media (min-width: 901px){#main-nav-wrap[_ngcontent-%COMP%]{position:static!important;top:auto!important;left:auto!important;width:auto!important}.main-navigation[_ngcontent-%COMP%]{background:transparent!important;padding:0!important;height:auto!important;display:flex!important}.main-navigation[_ngcontent-%COMP%] > li[_ngcontent-%COMP%]{display:inline-block!important}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-block!important;padding:0!important}}.top-bar[_ngcontent-%COMP%]{background:#0b1b24}.logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#f7f9fc!important}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#e6eef2}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#14b8a6}.main-navigation[_ngcontent-%COMP%]   li.current[_ngcontent-%COMP%] > a[_ngcontent-%COMP%]{color:#14b8a6!important}@media (min-width: 901px){.top-bar[_ngcontent-%COMP%]{justify-content:flex-start;align-items:center;gap:28px}.top-bar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{margin-right:28px}.top-bar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-size:1.5rem;letter-spacing:.5px}#main-nav-wrap[_ngcontent-%COMP%]{position:static!important;display:block!important}.main-navigation[_ngcontent-%COMP%]{display:flex!important;align-items:center;gap:36px;margin:0;padding:0}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:inline-block}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:600}}@media (max-width: 600px){header[_ngcontent-%COMP%]   .top-bar[_ngcontent-%COMP%]{left:0!important;right:0!important}.top-bar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{margin-left:0;padding:10px 20px 10px 0}.top-bar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin-left:0}.menu-toggle[_ngcontent-%COMP%]{margin-top:0}}.menu-toggle[_ngcontent-%COMP%]{display:none}#main-nav-wrap[_ngcontent-%COMP%]{display:block}.main-navigation[_ngcontent-%COMP%]{display:flex;align-items:center;gap:28px;background:transparent;padding:0;margin:0}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:inline-block}.main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:6px 0}@media (max-width: 900px){.menu-toggle[_ngcontent-%COMP%]{display:inline-block;color:#f7f9fc;text-transform:uppercase}#main-nav-wrap[_ngcontent-%COMP%]{position:absolute;right:0;top:100%;width:280px;padding:12px 0;background:#0b1b24f7;border-radius:0 0 0 8px;box-shadow:0 10px 30px #00000059}#main-nav-wrap[_ngcontent-%COMP%]   .main-navigation[_ngcontent-%COMP%]{display:block}#main-nav-wrap[_ngcontent-%COMP%]   .main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:block;border-bottom:1px solid rgba(255,255,255,.06)}#main-nav-wrap[_ngcontent-%COMP%]   .main-navigation[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:block;padding:14px 18px}#main-nav-wrap[_ngcontent-%COMP%]:not(.open){display:none}.menu-toggle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-block}#main-nav-wrap[_ngcontent-%COMP%]{transform:translateY(-10px);opacity:0;transition:transform .25s ease,opacity .25s ease}#main-nav-wrap.open[_ngcontent-%COMP%]{transform:translateY(0);opacity:1}}"]
    })
};
var mc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-intro"]
        ],
        decls: 28,
        vars: 0,
        consts: [
            ["id", "intro"],
            [1, "intro-overlay"],
            [1, "intro-content"],
            [1, "row"],
            [1, "col-twelve"],
            [1, "intro-position"],
            ["href", "#about", "title", "", 1, "button", "stroke", "smoothscroll"],
            ["href", "#contact", "title", "", 1, "button", "stroke", "smoothscroll"],
            [1, "intro-social"],
            ["href", "https://www.linkedin.com/in/vimal-srivastava-32362992"],
            [1, "fa", "fa-linkedin"],
            ["href", "https://github.com/vimal-professional-seeker"],
            [1, "fa", "fa-github"],
            ["href", "https://leetcode.com/u/5hV8dpo6Of/"],
            [1, "fa", "fa-code"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "section", 0), R(1, "div", 1), h(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h5"), f(6, "Hello,"), p(), h(7, "h1"), f(8, "I'm Vimal Srivastava"), p(), h(9, "p", 5)(10, "span"), f(11, "Full Stack Developer"), p(), h(12, "span"), f(13, "Cloud Enthusiastic"), p()(), h(14, "a", 6), f(15, "More About Me"), p(), h(16, "a", 7), f(17, "Contact Me"), p()()()(), h(18, "ul", 8)(19, "li")(20, "a", 9), R(21, "i", 10), p()(), h(22, "li")(23, "a", 11), R(24, "i", 12), p()(), h(25, "li")(26, "a", 13), R(27, "i", 14), p()()()())
        },
        encapsulation: 2
    })
};
var vc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-about"]
        ],
        decls: 112,
        vars: 0,
        consts: [
            ["id", "about"],
            [1, "row", "section-intro"],
            [1, "col-twelve"],
            [2, "color", "#1E90FF"],
            [1, "intro-info"],
            ["src", "images/profile-pic.jpg", "alt", "Profile Picture", "loading", "lazy"],
            [1, "lead"],
            [1, "row", "about-content"],
            [1, "col-six", "tab-full"],
            [1, "info-list"],
            [1, "skill-bars"],
            [1, "progress", "percent85"],
            [1, "progress", "percent88"],
            [1, "progress", "percent90"],
            [1, "row", "button-section"],
            ["href", "#contact", "title", "Hire Me", 1, "button", "stroke", "smoothscroll"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3), f(4, "ABOUT"), p(), h(5, "h1"), f(6, "Let me introduce myself."), p(), h(7, "div", 4), R(8, "img", 5), h(9, "p", 6), f(10, "I am Vimal Srivastava currently working as Senior Software Engineer at Intuit having previous experience in the field of full stack development."), p()()()(), h(11, "div", 7)(12, "div", 8)(13, "h3"), f(14, "Profile"), p(), h(15, "p"), f(16, "Self motivated individual with more than 4 years industrial experience and 6 months internship experience in frontend development."), p(), h(17, "ul", 9)(18, "li")(19, "strong"), f(20, "Full Name:"), p(), h(21, "span"), f(22, "Vimal Srivastava"), p()(), h(23, "li")(24, "strong"), f(25, "Job:"), p(), h(26, "span"), f(27, "Full Stack Developer"), p()(), h(28, "li")(29, "strong"), f(30, "Website:"), p(), h(31, "span"), f(32, "vimalprofessionalseeker.github.io"), p()(), h(33, "li")(34, "strong"), f(35, "Email:"), p(), h(36, "span"), f(37, "vimalprofessionalseeker@gmail.com"), p()()()(), h(38, "div", 8)(39, "h3"), f(40, "Skills"), p(), h(41, "ul", 10)(42, "li")(43, "div", 11)(44, "span"), f(45, "85%"), p()(), h(46, "strong"), f(47, "Angular"), p()(), h(48, "li")(49, "div", 12)(50, "span"), f(51, "88%"), p()(), h(52, "strong"), f(53, "Java"), p()(), h(54, "li")(55, "div", 11)(56, "span"), f(57, "85%"), p()(), h(58, "strong"), f(59, "Html5 & CSS3"), p()(), h(60, "li")(61, "div", 11)(62, "span"), f(63, "85%"), p()(), h(64, "strong"), f(65, "Javascript"), p()(), h(66, "li")(67, "div", 11)(68, "span"), f(69, "85%"), p()(), h(70, "strong"), f(71, "Spring Boot"), p()(), h(72, "li")(73, "div", 11)(74, "span"), f(75, "85%"), p()(), h(76, "strong"), f(77, "Bootstrap"), p()(), h(78, "li")(79, "div", 13)(80, "span"), f(81, "90%"), p()(), h(82, "strong"), f(83, "C"), p()(), h(84, "li")(85, "div", 13)(86, "span"), f(87, "90%"), p()(), h(88, "strong"), f(89, "MySQL, MSQL, Oracle, IBM DB2"), p()(), h(90, "li")(91, "div", 13)(92, "span"), f(93, "90%"), p()(), h(94, "strong"), f(95, "Gradle and Maven"), p()(), h(96, "li")(97, "div", 11)(98, "span"), f(99, "85%"), p()(), h(100, "strong"), f(101, "Jenkins, Gerrit and JIRA"), p()(), h(102, "li")(103, "div", 11)(104, "span"), f(105, "85%"), p()(), h(106, "strong"), f(107, "JUnit, Jasmine and Karma"), p()()()()(), h(108, "div", 14)(109, "div", 2)(110, "a", 15), f(111, "Hire Me"), p()()()())
        },
        encapsulation: 2
    })
};
var yc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-resume"]
        ],
        decls: 140,
        vars: 0,
        consts: [
            ["id", "resume", 1, "grey-section"],
            [1, "row", "section-intro"],
            [1, "col-twelve"],
            [2, "color", "#1E90FF"],
            [1, "lead"],
            [1, "row", "resume-timeline"],
            [1, "col-twelve", "resume-header"],
            [1, "timeline-wrap"],
            [1, "timeline-block"],
            [1, "timeline-ico"],
            [1, "fa", "fa-graduation-cap"],
            [1, "timeline-header"],
            [1, "timeline-content"],
            [1, "fa", "fa-briefcase"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3), f(4, "RESUME"), p(), h(5, "h1"), f(6, "More of my credentials."), p(), h(7, "p", 4), f(8, "Below are the details regarding my Industrial experience and Education."), p()()(), h(9, "div", 5)(10, "div", 6)(11, "h2"), f(12, "Work Experience"), p()(), h(13, "div", 2)(14, "div", 7)(15, "div", 8)(16, "div", 9), R(17, "i", 10), p(), h(18, "div", 11)(19, "h3"), f(20, "Senior Software Engineer"), p(), h(21, "p"), f(22, "August 2022 - PRESENT"), p()(), h(23, "div", 12)(24, "h4"), f(25, "Intuit"), p(), h(26, "p"), f(27, "Worked on microservices architecture and handled migration of more than 40 services and various libraries from Oracle to Postgres. Increased performance by 40% by optimizing queries and code. Implemented workflows to support new products to onboard new customers. Reduced the issues by 30% by doing Root cause analysis and fixing them."), p()()(), h(28, "div", 8)(29, "div", 9), R(30, "i", 10), p(), h(31, "div", 11)(32, "h3"), f(33, "Software Engineer"), p(), h(34, "p"), f(35, "November 2020 - August 2022"), p()(), h(36, "div", 12)(37, "h4"), f(38, "Capgemini Engineering"), p(), h(39, "p"), f(40, "Created RESTful API using Spring MVC, Hibernate, JPA and Spring Boot. Used MySQL, MSSQL, Oracle and IBM DB2 databases. Also contributed in creating web applications using Angular and writing unit tests using Jasmine and Karma."), p()()(), h(41, "div", 8)(42, "div", 9), R(43, "i", 10), p(), h(44, "div", 11)(45, "h3"), f(46, "Summer Intern"), p(), h(47, "p"), f(48, "May 2019 - July 2019"), p()(), h(49, "div", 12)(50, "h4"), f(51, "Garage Productions Pvt. Ltd."), p(), h(52, "p"), f(53, "Worked as Web Developer with a team of 4 people. Built Company Management System with MVC architecture using Laravel with Nginx server. Built responsive Astrology Website project using Node.js. Reduced website loading time by 50%."), p()()(), h(54, "div", 8)(55, "div", 9), R(56, "i", 10), p(), h(57, "div", 11)(58, "h3"), f(59, "Winter Intern"), p(), h(60, "p"), f(61, "December 2018 - January 2019"), p()(), h(62, "div", 12)(63, "h4"), f(64, "Jawaharlal Nehru University"), p(), h(65, "p"), f(66, "Built the responsive placement cell website of JNU with a team of more than 10 people. Designed using HTML5, CSS3, Bootstrap, jQuery and JavaScript."), p()()(), h(67, "div", 8)(68, "div", 9), R(69, "i", 10), p(), h(70, "div", 11)(71, "h3"), f(72, "Summer Intern"), p(), h(73, "p"), f(74, "June 2016 - July 2016"), p()(), h(75, "div", 12)(76, "h4"), f(77, "ILJIN Electronics"), p(), h(78, "p"), f(79, 'Worked on project "Study of machines used in PCB Designing". Studied about different machines in Auto Insertion, SMD and Manual Insertion Department.'), p()()()()()(), h(80, "div", 5)(81, "div", 6)(82, "h2"), f(83, "Education"), p()(), h(84, "div", 2)(85, "div", 7)(86, "div", 8)(87, "div", 9), R(88, "i", 13), p(), h(89, "div", 11)(90, "h3"), f(91, "M.Sc. Informatics"), p(), h(92, "p"), f(93, "July 2018 - October 2020"), p()(), h(94, "div", 12)(95, "h4"), f(96, "Institute of Informatics and Communication, University of Delhi"), p(), h(97, "p"), f(98, "CGPA: 7.77"), R(99, "br"), f(100, "GATE 2020 Qualified in Computer Science and Applications with 88 Percentile"), p()()(), h(101, "div", 8)(102, "div", 9), R(103, "i", 13), p(), h(104, "div", 11)(105, "h3"), f(106, "B.Sc.(Hons) Electronics"), p(), h(107, "p"), f(108, "July 2015 - July 2018"), p()(), h(109, "div", 12)(110, "h4"), f(111, "Zakir Husain Delhi College, University of Delhi"), p(), h(112, "p"), f(113, "CGPA: 7.55"), p()()(), h(114, "div", 8)(115, "div", 9), R(116, "i", 13), p(), h(117, "div", 11)(118, "h3"), f(119, "XII (CBSE)"), p(), h(120, "p"), f(121, "May 2014 - June 2015"), p()(), h(122, "div", 12)(123, "h4"), f(124, "Jindal Public School"), p(), h(125, "p"), f(126, "Percentage: 88%"), p()()(), h(127, "div", 8)(128, "div", 9), R(129, "i", 13), p(), h(130, "div", 11)(131, "h3"), f(132, "X (CBSE)"), p(), h(133, "p"), f(134, "April 2012 - June 2013"), p()(), h(135, "div", 12)(136, "h4"), f(137, "Jindal Public School"), p(), h(138, "p"), f(139, "CGPA: 9.2"), p()()()()()()())
        },
        encapsulation: 2
    })
};

function BT(e, t) {
    if (e & 1) {
        let n = kr();
        Uo(0), I(1, "div", 9)(2, "div", 10), he(3, "img", 11), I(4, "a", 12), J("click", function(o) {
            let i = xt(n).$implicit;
            return on().openModal(i), Ot(o.preventDefault())
        }), I(5, "div", 13)(6, "div", 14)(7, "h3", 15), f(8), M(), I(9, "span", 16), f(10), M()()()()()(), Ho()
    }
    if (e & 2) {
        let n = t.$implicit;
        q(3), ze("src", n.image, xr)("alt", n.title), q(5), wt(n.title), q(2), wt(n.category)
    }
}

function UT(e, t) {
    if (e & 1) {
        let n = kr();
        Uo(0), I(1, "div", 17), J("click", function() {
            xt(n);
            let o = on();
            return Ot(o.closeModal())
        }), I(2, "div", 18), J("click", function(o) {
            return xt(n), Ot(o.stopPropagation())
        }), I(3, "div", 19), he(4, "img", 11), M(), I(5, "div", 20)(6, "h4"), f(7), M(), I(8, "p"), f(9), M(), I(10, "div", 21), f(11), M()(), I(12, "div", 22)(13, "a", 23), f(14, "Details"), M(), I(15, "a", 24), J("click", function(o) {
            return xt(n), on().closeModal(), Ot(o.preventDefault())
        }), f(16, "Close"), M()()()(), Ho()
    }
    if (e & 2) {
        let n = on();
        q(4), ze("src", n.selectedProject.image, xr)("alt", n.selectedProject.title), q(3), wt(n.selectedProject.title), q(2), wt(n.selectedProject.description), q(2), wt(n.selectedProject.category), q(2), ze("href", n.selectedProject.link, xr)
    }
}
var Ec = class e {
    selectedProject = null;
    projects = [{
        id: "modal-01",
        title: "Touch_Control Android App",
        category: "Android",
        image: "images/portfolio/android.jpg",
        description: "This android app controls mouse of pc of Windows, Ubuntu and Mac OS using Wi-Fi.It has all click functions and have all android keyboard buttons and also includes slideshow control.Developed using Java socket programming.",
        link: "https://github.com/vimal-professional-seeker/Touch_Control"
    }, {
        id: "modal-02",
        title: "Anil Grover Lab Website",
        category: "Web Development",
        image: "images/portfolio/website-anil.jpg",
        description: 'Rebuild the responsive website "The Anil Grover Lab of Plant Molecular Biology Department, DU "on WordPress.',
        link: "https://anilgroverlab.org/"
    }, {
        id: "modal-03",
        title: "Innovation Council DU Website",
        category: "Web Development",
        image: "images/portfolio/website-cic.jpg",
        description: "Build website on CMS Made Simple and updated its events.",
        link: "http://innovationcouncil.du.ac.in/web/"
    }, {
        id: "modal-04",
        title: "Telephone Exchange project",
        category: "Java",
        image: "images/portfolio/telephone.jpg",
        description: "This project is based on Telephone exchange switching system in Telecommunication.It follows all process during the call like first ringing, if call not picked up in 30s then auto disconnect and another person will be told busy if person is on call.Developed using Java Socket Programming, Java Swing and Java Multithreading on Eclipse and uploaded it on GitHub.",
        link: "https://github.com/vimal-professional-seeker/Telephone-exchange"
    }, {
        id: "modal-05",
        title: "MS Learn Tailspin Webgame",
        category: "Azure Devops",
        image: "images/portfolio/devops.jpg",
        description: "Code used in Microsoft Learn modules to support Azure DevOps in Microsoft Cloud Skills Challenge.",
        link: "https://github.com/vimal-professional-seeker/mslearn-tailspin-spacegame-web"
    }];
    trackById(t, n) {
        return n.id
    }
    openModal(t) {
        this.selectedProject = t
    }
    closeModal() {
        this.selectedProject = null
    }
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-portfolio"]
        ],
        decls: 14,
        vars: 3,
        consts: [
            ["id", "portfolio"],
            [1, "row", "section-intro"],
            [1, "col-twelve"],
            [2, "color", "#1E90FF"],
            [1, "lead"],
            [1, "row", "portfolio-content"],
            ["id", "folio-wrapper", 1, "block-1-2", "block-mob-full", "stack"],
            [4, "ngFor", "ngForOf", "ngForTrackBy"],
            [4, "ngIf"],
            [1, "bgrid", "folio-item"],
            [1, "item-wrap"],
            [3, "src", "alt"],
            ["href", "#", 1, "overlay", 3, "click"],
            [1, "folio-item-table"],
            [1, "folio-item-cell"],
            [1, "folio-title"],
            [1, "folio-types"],
            [1, "popup-modal-overlay", 3, "click"],
            [1, "popup-modal", 3, "click"],
            [1, "media"],
            [1, "description-box"],
            [1, "categories"],
            [1, "link-box"],
            ["target", "_blank", 3, "href"],
            ["href", "#", 1, "popup-modal-dismiss", 3, "click"]
        ],
        template: function(n, r) {
            n & 1 && (I(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3), f(4, "PORTFOLIO"), M(), I(5, "h1"), f(6, "Check Out Some of My Works."), M(), I(7, "p", 4), f(8, "Below are details regarding mine projects."), M()()(), I(9, "div", 5)(10, "div", 2)(11, "div", 6), tn(12, BT, 11, 4, "ng-container", 7), M()()(), tn(13, UT, 17, 6, "ng-container", 8), M()), n & 2 && (q(12), ze("ngForOf", r.projects)("ngForTrackBy", r.trackById), q(), ze("ngIf", r.selectedProject))
        },
        dependencies: [cn, Ua, qo],
        styles: [".popup-modal-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;background:#000c;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}.popup-modal[_ngcontent-%COMP%]{background:#fff;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;border-radius:8px;position:relative}.popup-modal[_ngcontent-%COMP%]   .media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:auto;display:block}.popup-modal[_ngcontent-%COMP%]   .description-box[_ngcontent-%COMP%]{padding:30px}.popup-modal[_ngcontent-%COMP%]   .description-box[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin-bottom:15px;color:#333}.popup-modal[_ngcontent-%COMP%]   .description-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-bottom:15px;line-height:1.6}.popup-modal[_ngcontent-%COMP%]   .categories[_ngcontent-%COMP%]{font-weight:700;color:#1e90ff;margin-bottom:20px}.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]{padding:0 30px 30px;display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap}@media (min-width: 768px){.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]{flex-wrap:nowrap}}.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-block;margin:0;padding:10px 20px;background:#1e90ff;color:#fff;text-decoration:none;border-radius:4px;transition:background .3s}.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]{margin-top:10px}@media (min-width: 1024px){.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]{margin-top:14px}}.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background:#06c}.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]   .popup-modal-dismiss[_ngcontent-%COMP%]{background:#666}.popup-modal[_ngcontent-%COMP%]   .link-box[_ngcontent-%COMP%]   .popup-modal-dismiss[_ngcontent-%COMP%]:hover{background:#444}"]
    })
};
var Dc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-cta"]
        ],
        decls: 68,
        vars: 0,
        consts: [
            ["id", "cta", 1, "grey-section"],
            [1, "row", "cta-content"],
            [1, "col-twelve", "section-ads"],
            [1, "h01", 2, "color", "#1E90FF"],
            [1, "row", "resume-timeline"],
            [1, "col-twelve"],
            [1, "timeline-wrap"],
            [1, "timeline-block"],
            [1, "timeline-ico"],
            [1, "fa", "fa-graduation-cap"],
            [1, "timeline-header"],
            [1, "timeline-content"],
            ["href", "http://innovationcouncil.du.ac.in/web/", "target", "_blank"],
            ["href", "http://iic.du.ac.in/", "target", "_blank"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3), f(4, "POSITIONS OF RESPONSIBILITY"), p()()(), h(5, "div", 4)(6, "div", 5)(7, "div", 6)(8, "div", 7)(9, "div", 8), R(10, "i", 9), p(), h(11, "div", 10)(12, "h3"), f(13, "Member of Composition Team"), p(), h(14, "p"), f(15, "January 2019 - September 2020"), p()(), h(16, "div", 11)(17, "h4"), f(18, "Innovation Council, University of Delhi"), p(), h(19, "p"), f(20, "Built website on CMS Made Simple and updated its events."), R(21, "br"), f(22, "Link: "), h(23, "a", 12), f(24, "Innovation Council Website"), p()()()(), h(25, "div", 7)(26, "div", 8), R(27, "i", 9), p(), h(28, "div", 10)(29, "h3"), f(30, "Member of Web Team"), p(), h(31, "p"), f(32, "August 2018 - August 2020"), p()(), h(33, "div", 11)(34, "h4"), f(35, "Institute of Informatics and Communication, University of Delhi"), p(), h(36, "p"), f(37, "Added new pages and updated events with a team of 5 people."), R(38, "br"), f(39, "Link: "), h(40, "a", 13), f(41, "IIC Website"), p()()()(), h(42, "div", 7)(43, "div", 8), R(44, "i", 9), p(), h(45, "div", 10)(46, "h3"), f(47, "Member of Student Partner Programme"), p(), h(48, "p"), f(49, "February 2020 - March 2020"), p()(), h(50, "div", 11)(51, "h4"), f(52, "IIT Roorkee"), p(), h(53, "p"), f(54, "Created database of college students and spread the word about Cognizance 2020."), p()()(), h(55, "div", 7)(56, "div", 8), R(57, "i", 9), p(), h(58, "div", 10)(59, "h3"), f(60, "Member of Student Partner Programme"), p(), h(61, "p"), f(62, "March 2020 - May 2020"), p()(), h(63, "div", 11)(64, "h4"), f(65, "Internshala"), p(), h(66, "p"), f(67, "Organized leadership talks and took part in various contests."), p()()()()()()())
        },
        encapsulation: 2
    })
};
var Cc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-services"]
        ],
        decls: 37,
        vars: 0,
        consts: [
            ["id", "services"],
            [1, "overlay"],
            [1, "row", "section-intro"],
            [1, "col-twelve"],
            [2, "color", "#1E90FF"],
            [1, "lead"],
            [1, "row", "services-content"],
            [1, "services-list", "block-1-3", "block-tab-1-2", "block-mob-full", "group"],
            [1, "bgrid", "service"],
            [1, "icon"],
            [1, "icon-earth"],
            [1, "service-content", 2, "color", "#1E90FF"],
            [1, "desc"],
            [1, "icon-window"],
            [1, "icon-toggles"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "section", 0), R(1, "div", 1), h(2, "div", 2)(3, "div", 3)(4, "h1", 4), f(5, "SERVICES"), p(), h(6, "h1"), f(7, "What Can I Do For You?"), p(), h(8, "p", 5), f(9, "Having experience in different technologies in Full Stack Web Development with knowledge of current technologies in Cloud Computing."), p()()(), h(10, "div", 6)(11, "div", 3)(12, "div", 7)(13, "div", 8)(14, "span", 9), R(15, "i", 10), p(), h(16, "div", 11)(17, "h3"), f(18, "Backend Developer"), p(), h(19, "p", 12), f(20, "Having experience in programming languages like C, C++ and Java and have the knowledge of Data Structures and Algorithms. Have the experience of databases like MySQL, MSSQL, Oracle and IBM DB2 while making RESTful API using Spring Boot. Also involved in competitive programming in platforms like HackerRank."), p()()(), h(21, "div", 8)(22, "span", 9), R(23, "i", 13), p(), h(24, "div", 11)(25, "h3"), f(26, "Web Developer"), p(), h(27, "p", 12), f(28, "Having experience in various technologies like HTML5, CSS3, JavaScript, Laravel PHP Framework, Bootstrap CSS framework. Made various websites which are currently live which also includes some prestigious websites of Delhi University."), p()()(), h(29, "div", 8)(30, "span", 9), R(31, "i", 14), p(), h(32, "div", 11)(33, "h3"), f(34, "Cloud Associate"), p(), h(35, "p", 12), f(36, "Currently Microsoft Azure Fundamentals Certified and Oracle Cloud Infrastructure Foundations 2020 Associate. Also have the knowledge of AWS Essentials."), p()()()()()()())
        },
        styles: [".services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]{text-align:center;margin-bottom:48px}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{display:inline-block;margin-bottom:24px;font-size:48px;color:#1e90ff}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:18px;color:#cfd8dc}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{line-height:1.8;color:#cfd8dc}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   .services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]{background:#00000059;padding:24px 16px;border-radius:10px}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   .services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]:hover{background:#00000080}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   .services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{color:#11abb0}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   #services[_ngcontent-%COMP%]   .section-intro[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   #services[_ngcontent-%COMP%]   .section-intro[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{color:#f5f7fa!important}.services-list[_ngcontent-%COMP%]   .service[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]   #services[_ngcontent-%COMP%]   .section-intro[_ngcontent-%COMP%]   .lead[_ngcontent-%COMP%]{color:#cfd8dc!important}"]
    })
};
var _c = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-stats"]
        ],
        decls: 46,
        vars: 0,
        consts: [
            ["id", "stats", 1, "count-up"],
            [1, "row"],
            [1, "col-twelve"],
            [1, "block-1-6", "block-s-1-3", "block-tab-1-2", "block-mob-full", "stats-list"],
            [1, "bgrid", "stat"],
            [1, "icon-part"],
            [1, "icon-pencil-ruler"],
            [1, "stat-count"],
            [1, "stat-title"],
            [1, "icon-users"],
            [1, "icon-badge"],
            [1, "icon-light-bulb"],
            [1, "icon-cup"],
            [1, "icon-clock"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5), R(6, "i", 6), p(), h(7, "h3", 7), f(8, "7"), p(), h(9, "h5", 8), f(10, "Projects Completed"), p()(), h(11, "div", 4)(12, "div", 5), R(13, "i", 9), p(), h(14, "h3", 7), f(15, "26"), p(), h(16, "h5", 8), f(17, "Certifications"), p()(), h(18, "div", 4)(19, "div", 5), R(20, "i", 10), p(), h(21, "h3", 7), f(22, "6"), p(), h(23, "h5", 8), f(24, "Achievements"), p()(), h(25, "div", 4)(26, "div", 5), R(27, "i", 11), p(), h(28, "h3", 7), f(29, "25"), p(), h(30, "h5", 8), f(31, "Tools Used"), p()(), h(32, "div", 4)(33, "div", 5), R(34, "i", 12), p(), h(35, "h3", 7), f(36, "18"), p(), h(37, "h5", 8), f(38, "Technologies Known"), p()(), h(39, "div", 4)(40, "div", 5), R(41, "i", 13), p(), h(42, "h3", 7), f(43, "2"), p(), h(44, "h5", 8), f(45, "Projects Ongoing"), p()()()()()())
        },
        encapsulation: 2
    })
};
var zE = (() => {
        class e {
            _renderer;
            _elementRef;
            onChange = n => {};
            onTouched = () => {};
            constructor(n, r) {
                this._renderer = n, this._elementRef = r
            }
            setProperty(n, r) {
                this._renderer.setProperty(this._elementRef.nativeElement, n, r)
            }
            registerOnTouched(n) {
                this.onTouched = n
            }
            registerOnChange(n) {
                this.onChange = n
            }
            setDisabledState(n) {
                this.setProperty("disabled", n)
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(jn), $(Ct))
            };
            static\ u0275dir = ae({
                type: e
            })
        }
        return e
    })(),
    HT = (() => {
        class e extends zE {
            static\ u0275fac = (() => {
                let n;
                return function(o) {
                    return (n || (n = Jt(e)))(o || e)
                }
            })();
            static\ u0275dir = ae({
                type: e,
                features: [ct]
            })
        }
        return e
    })(),
    GE = new D("");
var $T = {
    provide: GE,
    useExisting: ht(() => Nc),
    multi: !0
};

function zT() {
    let e = Xe() ? Xe().getUserAgent() : "";
    return /android (\d+)/.test(e.toLowerCase())
}
var GT = new D(""),
    Nc = (() => {
        class e extends zE {
            _compositionMode;
            _composing = !1;
            constructor(n, r, o) {
                super(n, r), this._compositionMode = o, this._compositionMode == null && (this._compositionMode = !zT())
            }
            writeValue(n) {
                let r = n ? ? "";
                this.setProperty("value", r)
            }
            _handleInput(n) {
                (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(n)
            }
            _compositionStart() {
                this._composing = !0
            }
            _compositionEnd(n) {
                this._composing = !1, this._compositionMode && this.onChange(n)
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(jn), $(Ct), $(GT, 8))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["input", "formControlName", "", 3, "type", "checkbox"],
                    ["textarea", "formControlName", ""],
                    ["input", "formControl", "", 3, "type", "checkbox"],
                    ["textarea", "formControl", ""],
                    ["input", "ngModel", "", 3, "type", "checkbox"],
                    ["textarea", "ngModel", ""],
                    ["", "ngDefaultControl", ""]
                ],
                hostBindings: function(r, o) {
                    r & 1 && J("input", function(s) {
                        return o._handleInput(s.target.value)
                    })("blur", function() {
                        return o.onTouched()
                    })("compositionstart", function() {
                        return o._compositionStart()
                    })("compositionend", function(s) {
                        return o._compositionEnd(s.target.value)
                    })
                },
                standalone: !1,
                features: [$n([$T]), ct]
            })
        }
        return e
    })();

function WT(e) {
    return e == null || WE(e) === 0
}

function WE(e) {
    return e == null ? null : Array.isArray(e) || typeof e == "string" ? e.length : e instanceof Set ? e.size : null
}
var Rc = new D(""),
    qE = new D("");

function qT(e) {
    return WT(e.value) ? {
        required: !0
    } : null
}

function ZT(e) {
    return t => {
        let n = t.value ? .length ? ? WE(t.value);
        return n === null || n === 0 ? null : n < e ? {
            minlength: {
                requiredLength: e,
                actualLength: n
            }
        } : null
    }
}

function FE(e) {
    return null
}

function ZE(e) {
    return e != null
}

function YE(e) {
    return nn(e) ? X(e) : e
}

function QE(e) {
    let t = {};
    return e.forEach(n => {
        t = n != null ? E(E({}, t), n) : t
    }), Object.keys(t).length === 0 ? null : t
}

function KE(e, t) {
    return t.map(n => n(e))
}

function YT(e) {
    return !e.validate
}

function JE(e) {
    return e.map(t => YT(t) ? t : n => t.validate(n))
}

function QT(e) {
    if (!e) return null;
    let t = e.filter(ZE);
    return t.length == 0 ? null : function(n) {
        return QE(KE(n, t))
    }
}

function oh(e) {
    return e != null ? QT(JE(e)) : null
}

function KT(e) {
    if (!e) return null;
    let t = e.filter(ZE);
    return t.length == 0 ? null : function(n) {
        let r = KE(n, t).map(YE);
        return nl(r).pipe(B(QE))
    }
}

function ih(e) {
    return e != null ? KT(JE(e)) : null
}

function LE(e, t) {
    return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}

function JT(e) {
    return e._rawValidators
}

function XT(e) {
    return e._rawAsyncValidators
}

function th(e) {
    return e ? Array.isArray(e) ? e : [e] : []
}

function Ic(e, t) {
    return Array.isArray(e) ? e.includes(t) : e === t
}

function VE(e, t) {
    let n = th(t);
    return th(e).forEach(o => {
        Ic(n, o) || n.push(o)
    }), n
}

function jE(e, t) {
    return th(t).filter(n => !Ic(e, n))
}
var bc = class {
        get value() {
            return this.control ? this.control.value : null
        }
        get valid() {
            return this.control ? this.control.valid : null
        }
        get invalid() {
            return this.control ? this.control.invalid : null
        }
        get pending() {
            return this.control ? this.control.pending : null
        }
        get disabled() {
            return this.control ? this.control.disabled : null
        }
        get enabled() {
            return this.control ? this.control.enabled : null
        }
        get errors() {
            return this.control ? this.control.errors : null
        }
        get pristine() {
            return this.control ? this.control.pristine : null
        }
        get dirty() {
            return this.control ? this.control.dirty : null
        }
        get touched() {
            return this.control ? this.control.touched : null
        }
        get status() {
            return this.control ? this.control.status : null
        }
        get untouched() {
            return this.control ? this.control.untouched : null
        }
        get statusChanges() {
            return this.control ? this.control.statusChanges : null
        }
        get valueChanges() {
            return this.control ? this.control.valueChanges : null
        }
        get path() {
            return null
        }
        _composedValidatorFn;_composedAsyncValidatorFn;_rawValidators = [];_rawAsyncValidators = [];_setValidators(t) {
            this._rawValidators = t || [], this._composedValidatorFn = oh(this._rawValidators)
        }
        _setAsyncValidators(t) {
            this._rawAsyncValidators = t || [], this._composedAsyncValidatorFn = ih(this._rawAsyncValidators)
        }
        get validator() {
            return this._composedValidatorFn || null
        }
        get asyncValidator() {
            return this._composedAsyncValidatorFn || null
        }
        _onDestroyCallbacks = [];_registerOnDestroy(t) {
            this._onDestroyCallbacks.push(t)
        }
        _invokeOnDestroyCallbacks() {
            this._onDestroyCallbacks.forEach(t => t()), this._onDestroyCallbacks = []
        }
        reset(t = void 0) {
            this.control && this.control.reset(t)
        }
        hasError(t, n) {
            return this.control ? this.control.hasError(t, n) : !1
        }
        getError(t, n) {
            return this.control ? this.control.getError(t, n) : null
        }
    },
    Xr = class extends bc {
        name;
        get formDirective() {
            return null
        }
        get path() {
            return null
        }
    },
    Ci = class extends bc {
        _parent = null;
        name = null;
        valueAccessor = null
    },
    Sc = class {
        _cd;
        constructor(t) {
            this._cd = t
        }
        get isTouched() {
            return this._cd ? .control ? ._touched ? .(), !!this._cd ? .control ? .touched
        }
        get isUntouched() {
            return !!this._cd ? .control ? .untouched
        }
        get isPristine() {
            return this._cd ? .control ? ._pristine ? .(), !!this._cd ? .control ? .pristine
        }
        get isDirty() {
            return !!this._cd ? .control ? .dirty
        }
        get isValid() {
            return this._cd ? .control ? ._status ? .(), !!this._cd ? .control ? .valid
        }
        get isInvalid() {
            return !!this._cd ? .control ? .invalid
        }
        get isPending() {
            return !!this._cd ? .control ? .pending
        }
        get isSubmitted() {
            return this._cd ? ._submitted ? .(), !!this._cd ? .submitted
        }
    },
    eA = {
        "[class.ng-untouched]": "isUntouched",
        "[class.ng-touched]": "isTouched",
        "[class.ng-pristine]": "isPristine",
        "[class.ng-dirty]": "isDirty",
        "[class.ng-valid]": "isValid",
        "[class.ng-invalid]": "isInvalid",
        "[class.ng-pending]": "isPending"
    },
    F3 = V(E({}, eA), {
        "[class.ng-submitted]": "isSubmitted"
    }),
    XE = (() => {
        class e extends Sc {
            constructor(n) {
                super(n)
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(Ci, 2))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["", "formControlName", ""],
                    ["", "ngModel", ""],
                    ["", "formControl", ""]
                ],
                hostVars: 14,
                hostBindings: function(r, o) {
                    r & 2 && Me("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)
                },
                standalone: !1,
                features: [ct]
            })
        }
        return e
    })(),
    eD = (() => {
        class e extends Sc {
            constructor(n) {
                super(n)
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(Xr, 10))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["", "formGroupName", ""],
                    ["", "formArrayName", ""],
                    ["", "ngModelGroup", ""],
                    ["", "formGroup", ""],
                    ["form", 3, "ngNoForm", ""],
                    ["", "ngForm", ""]
                ],
                hostVars: 16,
                hostBindings: function(r, o) {
                    r & 2 && Me("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)("ng-submitted", o.isSubmitted)
                },
                standalone: !1,
                features: [ct]
            })
        }
        return e
    })();
var mi = "VALID",
    wc = "INVALID",
    Kr = "PENDING",
    vi = "DISABLED",
    fn = class {},
    Mc = class extends fn {
        value;
        source;
        constructor(t, n) {
            super(), this.value = t, this.source = n
        }
    },
    Ei = class extends fn {
        pristine;
        source;
        constructor(t, n) {
            super(), this.pristine = t, this.source = n
        }
    },
    Di = class extends fn {
        touched;
        source;
        constructor(t, n) {
            super(), this.touched = t, this.source = n
        }
    },
    Jr = class extends fn {
        status;
        source;
        constructor(t, n) {
            super(), this.status = t, this.source = n
        }
    },
    nh = class extends fn {
        source;
        constructor(t) {
            super(), this.source = t
        }
    },
    rh = class extends fn {
        source;
        constructor(t) {
            super(), this.source = t
        }
    };

function tD(e) {
    return (xc(e) ? e.validators : e) || null
}

function tA(e) {
    return Array.isArray(e) ? oh(e) : e || null
}

function nD(e, t) {
    return (xc(t) ? t.asyncValidators : e) || null
}

function nA(e) {
    return Array.isArray(e) ? ih(e) : e || null
}

function xc(e) {
    return e != null && !Array.isArray(e) && typeof e == "object"
}

function rA(e, t, n) {
    let r = e.controls;
    if (!(t ? Object.keys(r) : r).length) throw new C(1e3, "");
    if (!r[n]) throw new C(1001, "")
}

function oA(e, t, n) {
    e._forEachChild((r, o) => {
        if (n[o] === void 0) throw new C(1002, "")
    })
}
var Tc = class {
        _pendingDirty = !1;
        _hasOwnPendingAsyncValidator = null;
        _pendingTouched = !1;
        _onCollectionChange = () => {};
        _updateOn;
        _parent = null;
        _asyncValidationSubscription;
        _composedValidatorFn;
        _composedAsyncValidatorFn;
        _rawValidators;
        _rawAsyncValidators;
        value;
        constructor(t, n) {
            this._assignValidators(t), this._assignAsyncValidators(n)
        }
        get validator() {
            return this._composedValidatorFn
        }
        set validator(t) {
            this._rawValidators = this._composedValidatorFn = t
        }
        get asyncValidator() {
            return this._composedAsyncValidatorFn
        }
        set asyncValidator(t) {
            this._rawAsyncValidators = this._composedAsyncValidatorFn = t
        }
        get parent() {
            return this._parent
        }
        get status() {
            return ge(this.statusReactive)
        }
        set status(t) {
            ge(() => this.statusReactive.set(t))
        }
        _status = zn(() => this.statusReactive());
        statusReactive = Oe(void 0);
        get valid() {
            return this.status === mi
        }
        get invalid() {
            return this.status === wc
        }
        get pending() {
            return this.status == Kr
        }
        get disabled() {
            return this.status === vi
        }
        get enabled() {
            return this.status !== vi
        }
        errors;
        get pristine() {
            return ge(this.pristineReactive)
        }
        set pristine(t) {
            ge(() => this.pristineReactive.set(t))
        }
        _pristine = zn(() => this.pristineReactive());
        pristineReactive = Oe(!0);
        get dirty() {
            return !this.pristine
        }
        get touched() {
            return ge(this.touchedReactive)
        }
        set touched(t) {
            ge(() => this.touchedReactive.set(t))
        }
        _touched = zn(() => this.touchedReactive());
        touchedReactive = Oe(!1);
        get untouched() {
            return !this.touched
        }
        _events = new ne;
        events = this._events.asObservable();
        valueChanges;
        statusChanges;
        get updateOn() {
            return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
        }
        setValidators(t) {
            this._assignValidators(t)
        }
        setAsyncValidators(t) {
            this._assignAsyncValidators(t)
        }
        addValidators(t) {
            this.setValidators(VE(t, this._rawValidators))
        }
        addAsyncValidators(t) {
            this.setAsyncValidators(VE(t, this._rawAsyncValidators))
        }
        removeValidators(t) {
            this.setValidators(jE(t, this._rawValidators))
        }
        removeAsyncValidators(t) {
            this.setAsyncValidators(jE(t, this._rawAsyncValidators))
        }
        hasValidator(t) {
            return Ic(this._rawValidators, t)
        }
        hasAsyncValidator(t) {
            return Ic(this._rawAsyncValidators, t)
        }
        clearValidators() {
            this.validator = null
        }
        clearAsyncValidators() {
            this.asyncValidator = null
        }
        markAsTouched(t = {}) {
            let n = this.touched === !1;
            this.touched = !0;
            let r = t.sourceControl ? ? this;
            this._parent && !t.onlySelf && this._parent.markAsTouched(V(E({}, t), {
                sourceControl: r
            })), n && t.emitEvent !== !1 && this._events.next(new Di(!0, r))
        }
        markAllAsDirty(t = {}) {
            this.markAsDirty({
                onlySelf: !0,
                emitEvent: t.emitEvent,
                sourceControl: this
            }), this._forEachChild(n => n.markAllAsDirty(t))
        }
        markAllAsTouched(t = {}) {
            this.markAsTouched({
                onlySelf: !0,
                emitEvent: t.emitEvent,
                sourceControl: this
            }), this._forEachChild(n => n.markAllAsTouched(t))
        }
        markAsUntouched(t = {}) {
            let n = this.touched === !0;
            this.touched = !1, this._pendingTouched = !1;
            let r = t.sourceControl ? ? this;
            this._forEachChild(o => {
                o.markAsUntouched({
                    onlySelf: !0,
                    emitEvent: t.emitEvent,
                    sourceControl: r
                })
            }), this._parent && !t.onlySelf && this._parent._updateTouched(t, r), n && t.emitEvent !== !1 && this._events.next(new Di(!1, r))
        }
        markAsDirty(t = {}) {
            let n = this.pristine === !0;
            this.pristine = !1;
            let r = t.sourceControl ? ? this;
            this._parent && !t.onlySelf && this._parent.markAsDirty(V(E({}, t), {
                sourceControl: r
            })), n && t.emitEvent !== !1 && this._events.next(new Ei(!1, r))
        }
        markAsPristine(t = {}) {
            let n = this.pristine === !1;
            this.pristine = !0, this._pendingDirty = !1;
            let r = t.sourceControl ? ? this;
            this._forEachChild(o => {
                o.markAsPristine({
                    onlySelf: !0,
                    emitEvent: t.emitEvent
                })
            }), this._parent && !t.onlySelf && this._parent._updatePristine(t, r), n && t.emitEvent !== !1 && this._events.next(new Ei(!0, r))
        }
        markAsPending(t = {}) {
            this.status = Kr;
            let n = t.sourceControl ? ? this;
            t.emitEvent !== !1 && (this._events.next(new Jr(this.status, n)), this.statusChanges.emit(this.status)), this._parent && !t.onlySelf && this._parent.markAsPending(V(E({}, t), {
                sourceControl: n
            }))
        }
        disable(t = {}) {
            let n = this._parentMarkedDirty(t.onlySelf);
            this.status = vi, this.errors = null, this._forEachChild(o => {
                o.disable(V(E({}, t), {
                    onlySelf: !0
                }))
            }), this._updateValue();
            let r = t.sourceControl ? ? this;
            t.emitEvent !== !1 && (this._events.next(new Mc(this.value, r)), this._events.next(new Jr(this.status, r)), this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._updateAncestors(V(E({}, t), {
                skipPristineCheck: n
            }), this), this._onDisabledChange.forEach(o => o(!0))
        }
        enable(t = {}) {
            let n = this._parentMarkedDirty(t.onlySelf);
            this.status = mi, this._forEachChild(r => {
                r.enable(V(E({}, t), {
                    onlySelf: !0
                }))
            }), this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: t.emitEvent
            }), this._updateAncestors(V(E({}, t), {
                skipPristineCheck: n
            }), this), this._onDisabledChange.forEach(r => r(!1))
        }
        _updateAncestors(t, n) {
            this._parent && !t.onlySelf && (this._parent.updateValueAndValidity(t), t.skipPristineCheck || this._parent._updatePristine({}, n), this._parent._updateTouched({}, n))
        }
        setParent(t) {
            this._parent = t
        }
        getRawValue() {
            return this.value
        }
        updateValueAndValidity(t = {}) {
            if (this._setInitialStatus(), this._updateValue(), this.enabled) {
                let r = this._cancelExistingSubscription();
                this.errors = this._runValidator(), this.status = this._calculateStatus(), (this.status === mi || this.status === Kr) && this._runAsyncValidator(r, t.emitEvent)
            }
            let n = t.sourceControl ? ? this;
            t.emitEvent !== !1 && (this._events.next(new Mc(this.value, n)), this._events.next(new Jr(this.status, n)), this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._parent && !t.onlySelf && this._parent.updateValueAndValidity(V(E({}, t), {
                sourceControl: n
            }))
        }
        _updateTreeValidity(t = {
            emitEvent: !0
        }) {
            this._forEachChild(n => n._updateTreeValidity(t)), this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: t.emitEvent
            })
        }
        _setInitialStatus() {
            this.status = this._allControlsDisabled() ? vi : mi
        }
        _runValidator() {
            return this.validator ? this.validator(this) : null
        }
        _runAsyncValidator(t, n) {
            if (this.asyncValidator) {
                this.status = Kr, this._hasOwnPendingAsyncValidator = {
                    emitEvent: n !== !1,
                    shouldHaveEmitted: t !== !1
                };
                let r = YE(this.asyncValidator(this));
                this._asyncValidationSubscription = r.subscribe(o => {
                    this._hasOwnPendingAsyncValidator = null, this.setErrors(o, {
                        emitEvent: n,
                        shouldHaveEmitted: t
                    })
                })
            }
        }
        _cancelExistingSubscription() {
            if (this._asyncValidationSubscription) {
                this._asyncValidationSubscription.unsubscribe();
                let t = (this._hasOwnPendingAsyncValidator ? .emitEvent || this._hasOwnPendingAsyncValidator ? .shouldHaveEmitted) ? ? !1;
                return this._hasOwnPendingAsyncValidator = null, t
            }
            return !1
        }
        setErrors(t, n = {}) {
            this.errors = t, this._updateControlsErrors(n.emitEvent !== !1, this, n.shouldHaveEmitted)
        }
        get(t) {
            let n = t;
            return n == null || (Array.isArray(n) || (n = n.split(".")), n.length === 0) ? null : n.reduce((r, o) => r && r._find(o), this)
        }
        getError(t, n) {
            let r = n ? this.get(n) : this;
            return r && r.errors ? r.errors[t] : null
        }
        hasError(t, n) {
            return !!this.getError(t, n)
        }
        get root() {
            let t = this;
            for (; t._parent;) t = t._parent;
            return t
        }
        _updateControlsErrors(t, n, r) {
            this.status = this._calculateStatus(), t && this.statusChanges.emit(this.status), (t || r) && this._events.next(new Jr(this.status, n)), this._parent && this._parent._updateControlsErrors(t, n, r)
        }
        _initObservables() {
            this.valueChanges = new se, this.statusChanges = new se
        }
        _calculateStatus() {
            return this._allControlsDisabled() ? vi : this.errors ? wc : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Kr) ? Kr : this._anyControlsHaveStatus(wc) ? wc : mi
        }
        _anyControlsHaveStatus(t) {
            return this._anyControls(n => n.status === t)
        }
        _anyControlsDirty() {
            return this._anyControls(t => t.dirty)
        }
        _anyControlsTouched() {
            return this._anyControls(t => t.touched)
        }
        _updatePristine(t, n) {
            let r = !this._anyControlsDirty(),
                o = this.pristine !== r;
            this.pristine = r, this._parent && !t.onlySelf && this._parent._updatePristine(t, n), o && this._events.next(new Ei(this.pristine, n))
        }
        _updateTouched(t = {}, n) {
            this.touched = this._anyControlsTouched(), this._events.next(new Di(this.touched, n)), this._parent && !t.onlySelf && this._parent._updateTouched(t, n)
        }
        _onDisabledChange = [];
        _registerOnCollectionChange(t) {
            this._onCollectionChange = t
        }
        _setUpdateStrategy(t) {
            xc(t) && t.updateOn != null && (this._updateOn = t.updateOn)
        }
        _parentMarkedDirty(t) {
            let n = this._parent && this._parent.dirty;
            return !t && !!n && !this._parent._anyControlsDirty()
        }
        _find(t) {
            return null
        }
        _assignValidators(t) {
            this._rawValidators = Array.isArray(t) ? t.slice() : t, this._composedValidatorFn = tA(this._rawValidators)
        }
        _assignAsyncValidators(t) {
            this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t, this._composedAsyncValidatorFn = nA(this._rawAsyncValidators)
        }
    },
    Ac = class extends Tc {
        constructor(t, n, r) {
            super(tD(n), nD(r, n)), this.controls = t, this._initObservables(), this._setUpdateStrategy(n), this._setUpControls(), this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator
            })
        }
        controls;
        registerControl(t, n) {
            return this.controls[t] ? this.controls[t] : (this.controls[t] = n, n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange), n)
        }
        addControl(t, n, r = {}) {
            this.registerControl(t, n), this.updateValueAndValidity({
                emitEvent: r.emitEvent
            }), this._onCollectionChange()
        }
        removeControl(t, n = {}) {
            this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}), delete this.controls[t], this.updateValueAndValidity({
                emitEvent: n.emitEvent
            }), this._onCollectionChange()
        }
        setControl(t, n, r = {}) {
            this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}), delete this.controls[t], n && this.registerControl(t, n), this.updateValueAndValidity({
                emitEvent: r.emitEvent
            }), this._onCollectionChange()
        }
        contains(t) {
            return this.controls.hasOwnProperty(t) && this.controls[t].enabled
        }
        setValue(t, n = {}) {
            oA(this, !0, t), Object.keys(t).forEach(r => {
                rA(this, !0, r), this.controls[r].setValue(t[r], {
                    onlySelf: !0,
                    emitEvent: n.emitEvent
                })
            }), this.updateValueAndValidity(n)
        }
        patchValue(t, n = {}) {
            t != null && (Object.keys(t).forEach(r => {
                let o = this.controls[r];
                o && o.patchValue(t[r], {
                    onlySelf: !0,
                    emitEvent: n.emitEvent
                })
            }), this.updateValueAndValidity(n))
        }
        reset(t = {}, n = {}) {
            this._forEachChild((r, o) => {
                r.reset(t ? t[o] : null, {
                    onlySelf: !0,
                    emitEvent: n.emitEvent
                })
            }), this._updatePristine(n, this), this._updateTouched(n, this), this.updateValueAndValidity(n)
        }
        getRawValue() {
            return this._reduceChildren({}, (t, n, r) => (t[r] = n.getRawValue(), t))
        }
        _syncPendingControls() {
            let t = this._reduceChildren(!1, (n, r) => r._syncPendingControls() ? !0 : n);
            return t && this.updateValueAndValidity({
                onlySelf: !0
            }), t
        }
        _forEachChild(t) {
            Object.keys(this.controls).forEach(n => {
                let r = this.controls[n];
                r && t(r, n)
            })
        }
        _setUpControls() {
            this._forEachChild(t => {
                t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange)
            })
        }
        _updateValue() {
            this.value = this._reduceValue()
        }
        _anyControls(t) {
            for (let [n, r] of Object.entries(this.controls))
                if (this.contains(n) && t(r)) return !0;
            return !1
        }
        _reduceValue() {
            let t = {};
            return this._reduceChildren(t, (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n))
        }
        _reduceChildren(t, n) {
            let r = t;
            return this._forEachChild((o, i) => {
                r = n(r, o, i)
            }), r
        }
        _allControlsDisabled() {
            for (let t of Object.keys(this.controls))
                if (this.controls[t].enabled) return !1;
            return Object.keys(this.controls).length > 0 || this.disabled
        }
        _find(t) {
            return this.controls.hasOwnProperty(t) ? this.controls[t] : null
        }
    };
var sh = new D("", {
        providedIn: "root",
        factory: () => ah
    }),
    ah = "always";

function iA(e, t) {
    return [...t.path, e]
}

function rD(e, t, n = ah) {
    oD(e, t), t.valueAccessor.writeValue(e.value), (e.disabled || n === "always") && t.valueAccessor.setDisabledState ? .(e.disabled), aA(e, t), lA(e, t), cA(e, t), sA(e, t)
}

function BE(e, t) {
    e.forEach(n => {
        n.registerOnValidatorChange && n.registerOnValidatorChange(t)
    })
}

function sA(e, t) {
    if (t.valueAccessor.setDisabledState) {
        let n = r => {
            t.valueAccessor.setDisabledState(r)
        };
        e.registerOnDisabledChange(n), t._registerOnDestroy(() => {
            e._unregisterOnDisabledChange(n)
        })
    }
}

function oD(e, t) {
    let n = JT(e);
    t.validator !== null ? e.setValidators(LE(n, t.validator)) : typeof n == "function" && e.setValidators([n]);
    let r = XT(e);
    t.asyncValidator !== null ? e.setAsyncValidators(LE(r, t.asyncValidator)) : typeof r == "function" && e.setAsyncValidators([r]);
    let o = () => e.updateValueAndValidity();
    BE(t._rawValidators, o), BE(t._rawAsyncValidators, o)
}

function aA(e, t) {
    t.valueAccessor.registerOnChange(n => {
        e._pendingValue = n, e._pendingChange = !0, e._pendingDirty = !0, e.updateOn === "change" && iD(e, t)
    })
}

function cA(e, t) {
    t.valueAccessor.registerOnTouched(() => {
        e._pendingTouched = !0, e.updateOn === "blur" && e._pendingChange && iD(e, t), e.updateOn !== "submit" && e.markAsTouched()
    })
}

function iD(e, t) {
    e._pendingDirty && e.markAsDirty(), e.setValue(e._pendingValue, {
        emitModelToViewChange: !1
    }), t.viewToModelUpdate(e._pendingValue), e._pendingChange = !1
}

function lA(e, t) {
    let n = (r, o) => {
        t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r)
    };
    e.registerOnChange(n), t._registerOnDestroy(() => {
        e._unregisterOnChange(n)
    })
}

function uA(e, t) {
    e == null, oD(e, t)
}

function dA(e, t) {
    if (!e.hasOwnProperty("model")) return !1;
    let n = e.model;
    return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue)
}

function fA(e) {
    return Object.getPrototypeOf(e.constructor) === HT
}

function hA(e, t) {
    e._syncPendingControls(), t.forEach(n => {
        let r = n.control;
        r.updateOn === "submit" && r._pendingChange && (n.viewToModelUpdate(r._pendingValue), r._pendingChange = !1)
    })
}

function pA(e, t) {
    if (!t) return null;
    Array.isArray(t);
    let n, r, o;
    return t.forEach(i => {
        i.constructor === Nc ? n = i : fA(i) ? r = i : o = i
    }), o || r || n || null
}
var gA = {
        provide: Xr,
        useExisting: ht(() => ch)
    },
    yi = Promise.resolve(),
    ch = (() => {
        class e extends Xr {
            callSetDisabledState;
            get submitted() {
                return ge(this.submittedReactive)
            }
            _submitted = zn(() => this.submittedReactive());
            submittedReactive = Oe(!1);
            _directives = new Set;
            form;
            ngSubmit = new se;
            options;
            constructor(n, r, o) {
                super(), this.callSetDisabledState = o, this.form = new Ac({}, oh(n), ih(r))
            }
            ngAfterViewInit() {
                this._setUpdateStrategy()
            }
            get formDirective() {
                return this
            }
            get control() {
                return this.form
            }
            get path() {
                return []
            }
            get controls() {
                return this.form.controls
            }
            addControl(n) {
                yi.then(() => {
                    let r = this._findContainer(n.path);
                    n.control = r.registerControl(n.name, n.control), rD(n.control, n, this.callSetDisabledState), n.control.updateValueAndValidity({
                        emitEvent: !1
                    }), this._directives.add(n)
                })
            }
            getControl(n) {
                return this.form.get(n.path)
            }
            removeControl(n) {
                yi.then(() => {
                    let r = this._findContainer(n.path);
                    r && r.removeControl(n.name), this._directives.delete(n)
                })
            }
            addFormGroup(n) {
                yi.then(() => {
                    let r = this._findContainer(n.path),
                        o = new Ac({});
                    uA(o, n), r.registerControl(n.name, o), o.updateValueAndValidity({
                        emitEvent: !1
                    })
                })
            }
            removeFormGroup(n) {
                yi.then(() => {
                    let r = this._findContainer(n.path);
                    r && r.removeControl(n.name)
                })
            }
            getFormGroup(n) {
                return this.form.get(n.path)
            }
            updateModel(n, r) {
                yi.then(() => {
                    this.form.get(n.path).setValue(r)
                })
            }
            setValue(n) {
                this.control.setValue(n)
            }
            onSubmit(n) {
                return this.submittedReactive.set(!0), hA(this.form, this._directives), this.ngSubmit.emit(n), this.form._events.next(new nh(this.control)), n ? .target ? .method === "dialog"
            }
            onReset() {
                this.resetForm()
            }
            resetForm(n = void 0) {
                this.form.reset(n), this.submittedReactive.set(!1), this.form._events.next(new rh(this.form))
            }
            _setUpdateStrategy() {
                this.options && this.options.updateOn != null && (this.form._updateOn = this.options.updateOn)
            }
            _findContainer(n) {
                return n.pop(), n.length ? this.form.get(n) : this.form
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(Rc, 10), $(qE, 10), $(sh, 8))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
                    ["ng-form"],
                    ["", "ngForm", ""]
                ],
                hostBindings: function(r, o) {
                    r & 1 && J("submit", function(s) {
                        return o.onSubmit(s)
                    })("reset", function() {
                        return o.onReset()
                    })
                },
                inputs: {
                    options: [0, "ngFormOptions", "options"]
                },
                outputs: {
                    ngSubmit: "ngSubmit"
                },
                exportAs: ["ngForm"],
                standalone: !1,
                features: [$n([gA]), ct]
            })
        }
        return e
    })();

function UE(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}

function HE(e) {
    return typeof e == "object" && e !== null && Object.keys(e).length === 2 && "value" in e && "disabled" in e
}
var mA = class extends Tc {
    defaultValue = null;
    _onChange = [];
    _pendingValue;
    _pendingChange = !1;
    constructor(t = null, n, r) {
        super(tD(n), nD(r, n)), this._applyFormState(t), this._setUpdateStrategy(n), this._initObservables(), this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: !!this.asyncValidator
        }), xc(n) && (n.nonNullable || n.initialValueIsDefault) && (HE(t) ? this.defaultValue = t.value : this.defaultValue = t)
    }
    setValue(t, n = {}) {
        this.value = this._pendingValue = t, this._onChange.length && n.emitModelToViewChange !== !1 && this._onChange.forEach(r => r(this.value, n.emitViewToModelChange !== !1)), this.updateValueAndValidity(n)
    }
    patchValue(t, n = {}) {
        this.setValue(t, n)
    }
    reset(t = this.defaultValue, n = {}) {
        this._applyFormState(t), this.markAsPristine(n), this.markAsUntouched(n), this.setValue(this.value, n), this._pendingChange = !1
    }
    _updateValue() {}
    _anyControls(t) {
        return !1
    }
    _allControlsDisabled() {
        return this.disabled
    }
    registerOnChange(t) {
        this._onChange.push(t)
    }
    _unregisterOnChange(t) {
        UE(this._onChange, t)
    }
    registerOnDisabledChange(t) {
        this._onDisabledChange.push(t)
    }
    _unregisterOnDisabledChange(t) {
        UE(this._onDisabledChange, t)
    }
    _forEachChild(t) {}
    _syncPendingControls() {
        return this.updateOn === "submit" && (this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), this._pendingChange) ? (this.setValue(this._pendingValue, {
            onlySelf: !0,
            emitModelToViewChange: !1
        }), !0) : !1
    }
    _applyFormState(t) {
        HE(t) ? (this.value = this._pendingValue = t.value, t.disabled ? this.disable({
            onlySelf: !0,
            emitEvent: !1
        }) : this.enable({
            onlySelf: !0,
            emitEvent: !1
        })) : this.value = this._pendingValue = t
    }
};
var vA = {
        provide: Ci,
        useExisting: ht(() => lh)
    },
    $E = Promise.resolve(),
    lh = (() => {
        class e extends Ci {
            _changeDetectorRef;
            callSetDisabledState;
            control = new mA;
            static ngAcceptInputType_isDisabled;
            _registered = !1;
            viewModel;
            name = "";
            isDisabled;
            model;
            options;
            update = new se;
            constructor(n, r, o, i, s, a) {
                super(), this._changeDetectorRef = s, this.callSetDisabledState = a, this._parent = n, this._setValidators(r), this._setAsyncValidators(o), this.valueAccessor = pA(this, i)
            }
            ngOnChanges(n) {
                if (this._checkForErrors(), !this._registered || "name" in n) {
                    if (this._registered && (this._checkName(), this.formDirective)) {
                        let r = n.name.previousValue;
                        this.formDirective.removeControl({
                            name: r,
                            path: this._getPath(r)
                        })
                    }
                    this._setUpControl()
                }
                "isDisabled" in n && this._updateDisabled(n), dA(n, this.viewModel) && (this._updateValue(this.model), this.viewModel = this.model)
            }
            ngOnDestroy() {
                this.formDirective && this.formDirective.removeControl(this)
            }
            get path() {
                return this._getPath(this.name)
            }
            get formDirective() {
                return this._parent ? this._parent.formDirective : null
            }
            viewToModelUpdate(n) {
                this.viewModel = n, this.update.emit(n)
            }
            _setUpControl() {
                this._setUpdateStrategy(), this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this), this._registered = !0
            }
            _setUpdateStrategy() {
                this.options && this.options.updateOn != null && (this.control._updateOn = this.options.updateOn)
            }
            _isStandalone() {
                return !this._parent || !!(this.options && this.options.standalone)
            }
            _setUpStandalone() {
                rD(this.control, this, this.callSetDisabledState), this.control.updateValueAndValidity({
                    emitEvent: !1
                })
            }
            _checkForErrors() {
                this._checkName()
            }
            _checkName() {
                this.options && this.options.name && (this.name = this.options.name), !this._isStandalone() && this.name
            }
            _updateValue(n) {
                $E.then(() => {
                    this.control.setValue(n, {
                        emitViewToModelChange: !1
                    }), this._changeDetectorRef ? .markForCheck()
                })
            }
            _updateDisabled(n) {
                let r = n.isDisabled.currentValue,
                    o = r !== 0 && Wn(r);
                $E.then(() => {
                    o && !this.control.disabled ? this.control.disable() : !o && this.control.disabled && this.control.enable(), this._changeDetectorRef ? .markForCheck()
                })
            }
            _getPath(n) {
                return this._parent ? iA(n, this._parent) : [n]
            }
            static\ u0275fac = function(r) {
                return new(r || e)($(Xr, 9), $(Rc, 10), $(qE, 10), $(GE, 10), $(Fr, 8), $(sh, 8))
            };
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]
                ],
                inputs: {
                    name: "name",
                    isDisabled: [0, "disabled", "isDisabled"],
                    model: [0, "ngModel", "model"],
                    options: [0, "ngModelOptions", "options"]
                },
                outputs: {
                    update: "ngModelChange"
                },
                exportAs: ["ngModel"],
                standalone: !1,
                features: [$n([vA]), ct, Ft]
            })
        }
        return e
    })();
var sD = (() => {
    class e {
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275dir = ae({
            type: e,
            selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]
            ],
            hostAttrs: ["novalidate", ""],
            standalone: !1
        })
    }
    return e
})();

function yA(e) {
    return typeof e == "number" ? e : parseInt(e, 10)
}
var aD = (() => {
    class e {
        _validator = FE;
        _onChange;
        _enabled;
        ngOnChanges(n) {
            if (this.inputName in n) {
                let r = this.normalizeInput(n[this.inputName].currentValue);
                this._enabled = this.enabled(r), this._validator = this._enabled ? this.createValidator(r) : FE, this._onChange && this._onChange()
            }
        }
        validate(n) {
            return this._validator(n)
        }
        registerOnValidatorChange(n) {
            this._onChange = n
        }
        enabled(n) {
            return n != null
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275dir = ae({
            type: e,
            features: [Ft]
        })
    }
    return e
})();
var EA = {
    provide: Rc,
    useExisting: ht(() => uh),
    multi: !0
};
var uh = (() => {
    class e extends aD {
        required;
        inputName = "required";
        normalizeInput = Wn;
        createValidator = n => qT;
        enabled(n) {
            return n
        }
        static\ u0275fac = (() => {
            let n;
            return function(o) {
                return (n || (n = Jt(e)))(o || e)
            }
        })();
        static\ u0275dir = ae({
            type: e,
            selectors: [
                ["", "required", "", "formControlName", "", 3, "type", "checkbox"],
                ["", "required", "", "formControl", "", 3, "type", "checkbox"],
                ["", "required", "", "ngModel", "", 3, "type", "checkbox"]
            ],
            hostVars: 1,
            hostBindings: function(r, o) {
                r & 2 && Hn("required", o._enabled ? "" : null)
            },
            inputs: {
                required: "required"
            },
            standalone: !1,
            features: [$n([EA]), ct]
        })
    }
    return e
})();
var DA = {
        provide: Rc,
        useExisting: ht(() => dh),
        multi: !0
    },
    dh = (() => {
        class e extends aD {
            minlength;
            inputName = "minlength";
            normalizeInput = n => yA(n);
            createValidator = n => ZT(n);
            static\ u0275fac = (() => {
                let n;
                return function(o) {
                    return (n || (n = Jt(e)))(o || e)
                }
            })();
            static\ u0275dir = ae({
                type: e,
                selectors: [
                    ["", "minlength", "", "formControlName", ""],
                    ["", "minlength", "", "formControl", ""],
                    ["", "minlength", "", "ngModel", ""]
                ],
                hostVars: 1,
                hostBindings: function(r, o) {
                    r & 2 && Hn("minlength", o._enabled ? o.minlength : null)
                },
                inputs: {
                    minlength: "minlength"
                },
                standalone: !1,
                features: [$n([DA]), ct]
            })
        }
        return e
    })();
var CA = (() => {
    class e {
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275mod = Vt({
            type: e
        });
        static\ u0275inj = pt({})
    }
    return e
})();
var cD = (() => {
    class e {
        static withConfig(n) {
            return {
                ngModule: e,
                providers: [{
                    provide: sh,
                    useValue: n.callSetDisabledState ? ? ah
                }]
            }
        }
        static\ u0275fac = function(r) {
            return new(r || e)
        };
        static\ u0275mod = Vt({
            type: e
        });
        static\ u0275inj = pt({
            imports: [CA]
        })
    }
    return e
})();

function wA(e, t) {
    e & 1 && (I(0, "div", 26)(1, "div", 27), f(2, "Sending..."), M(), I(3, "div", 28), he(4, "div", 29)(5, "div", 30)(6, "div", 31), M()())
}

function IA(e, t) {
    if (e & 1 && (I(0, "div", 32), f(1), M()), e & 2) {
        let n = on();
        q(), wt(n.errorMsg)
    }
}

function bA(e, t) {
    e & 1 && (I(0, "div", 33), he(1, "i", 34), f(2, "Your message was sent successfully! Thank you for reaching out. "), M())
}
var Oc = class e {
    loading = !1;
    success = !1;
    errorMsg = "";
    openMail(t) {
        if (t.invalid) return;
        let n = encodeURIComponent(t.value.contactName || ""),
            r = encodeURIComponent(t.value.contactEmail || ""),
            o = encodeURIComponent(t.value.contactSubject || "Portfolio Contact"),
            i = encodeURIComponent(t.value.contactMessage || ""),
            s = encodeURIComponent(`Name: ${n}
Email: ${r}

${i}`),
            a = `mailto:vimalprofessionalseeker@gmail.com?subject=${o}&body=${s}`;
        window.location.href = a, this.success = !0, t.resetForm()
    }
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-contact"]
        ],
        decls: 53,
        vars: 5,
        consts: [
            ["form", "ngForm"],
            ["id", "contact"],
            [1, "row", "section-intro"],
            [1, "col-twelve"],
            [2, "color", "#1E90FF"],
            [1, "lead"],
            [1, "row", "contact-form"],
            ["name", "contactForm", "id", "contactForm", 3, "ngSubmit"],
            [1, "form-field"],
            ["name", "contactName", "type", "text", "id", "contactName", "placeholder", "Name", "minlength", "2", "required", "", "ngModel", ""],
            ["name", "contactEmail", "type", "email", "id", "contactEmail", "placeholder", "Email", "required", "", "ngModel", ""],
            ["name", "contactSubject", "type", "text", "id", "contactSubject", "placeholder", "Subject", "ngModel", ""],
            ["name", "contactMessage", "id", "contactMessage", "placeholder", "Message", "rows", "10", "cols", "50", "required", "", "ngModel", ""],
            ["type", "submit", 1, "submitform", 3, "disabled"],
            ["id", "submit-loader", 4, "ngIf"],
            ["id", "message-warning", "class", "alert alert-error", 4, "ngIf"],
            ["id", "message-success", "class", "alert alert-success", 4, "ngIf"],
            [1, "row", "contact-info"],
            [1, "col-four", "tab-full"],
            [1, "icon"],
            [1, "icon-pin"],
            [1, "col-four", "tab-full", "collapse"],
            [1, "icon-mail"],
            ["href", "mailto:vimalprofessionalseeker@gmail.com", 2, "color", "#6e6e6e !important"],
            [1, "icon-phone"],
            [2, "color", "#6e6e6e !important"],
            ["id", "submit-loader"],
            [1, "text-loader"],
            [1, "s-loader"],
            [1, "bounce1"],
            [1, "bounce2"],
            [1, "bounce3"],
            ["id", "message-warning", 1, "alert", "alert-error"],
            ["id", "message-success", 1, "alert", "alert-success"],
            [1, "fa", "fa-check"]
        ],
        template: function(n, r) {
            if (n & 1) {
                let o = kr();
                I(0, "section", 1)(1, "div", 2)(2, "div", 3)(3, "h1", 4), f(4, "CONTACT"), M(), I(5, "h1"), f(6, "I'd Love To Hear From You."), M(), I(7, "p", 5), f(8, "Feel free to reach out for any inquiries or collaboration opportunities."), M()()(), I(9, "div", 6)(10, "div", 3)(11, "form", 7, 0), J("ngSubmit", function() {
                    xt(o);
                    let s = Ma(12);
                    return Ot(r.openMail(s))
                }), I(13, "fieldset")(14, "div", 8), he(15, "input", 9), M(), I(16, "div", 8), he(17, "input", 10), M(), I(18, "div", 8), he(19, "input", 11), M(), I(20, "div", 8), he(21, "textarea", 12), M(), I(22, "div", 8)(23, "button", 13), f(24), M(), tn(25, wA, 7, 0, "div", 14), M()()(), tn(26, IA, 2, 1, "div", 15)(27, bA, 3, 0, "div", 16), M()(), I(28, "div", 17)(29, "div", 18)(30, "div", 19), he(31, "i", 20), M(), I(32, "h5"), f(33, "Where to find me"), M(), I(34, "p"), f(35, "New Delhi, India"), M()(), I(36, "div", 21)(37, "div", 19), he(38, "i", 22), M(), I(39, "h5"), f(40, "Email Me At"), M(), I(41, "p")(42, "a", 23), f(43, "vimalprofessionalseeker@gmail.com"), M()()(), I(44, "div", 18)(45, "div", 19), he(46, "i", 24), M(), I(47, "h5"), f(48, "Call Me At"), M(), I(49, "p"), f(50, "Phone: "), I(51, "a", 25), f(52, "xxxx"), M()()()()()
            }
            if (n & 2) {
                let o = Ma(12);
                q(23), ze("disabled", o.invalid || r.loading), q(), zo(" ", r.loading ? "Sending..." : "Submit", " "), q(), ze("ngIf", r.loading), q(), ze("ngIf", r.errorMsg), q(), ze("ngIf", r.success)
            }
        },
        dependencies: [cn, qo, cD, sD, Nc, XE, eD, uh, dh, lh, ch],
        styles: [".alert[_ngcontent-%COMP%]{padding:15px;margin:20px 0;border-radius:4px}.alert-success[_ngcontent-%COMP%]{background-color:#d4edda;border:1px solid #c3e6cb;color:#155724}.alert-error[_ngcontent-%COMP%]{background-color:#f8d7da;border:1px solid #f5c6cb;color:#721c24}.submitform[_ngcontent-%COMP%]:disabled{opacity:.6;cursor:not-allowed}.s-loader[_ngcontent-%COMP%]{display:inline-block;margin-left:10px}.s-loader[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{width:8px;height:8px;background-color:#1e90ff;border-radius:100%;display:inline-block;animation:_ngcontent-%COMP%_sk-bouncedelay 1.4s infinite ease-in-out both}.s-loader[_ngcontent-%COMP%]   .bounce1[_ngcontent-%COMP%]{animation-delay:-.32s}.s-loader[_ngcontent-%COMP%]   .bounce2[_ngcontent-%COMP%]{animation-delay:-.16s}@keyframes _ngcontent-%COMP%_sk-bouncedelay{0%,80%,to{transform:scale(0)}40%{transform:scale(1)}}"]
    })
};
var Pc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-footer"]
        ],
        decls: 20,
        vars: 0,
        consts: [
            [1, "row"],
            [1, "col-six", "tab-full", "pull-right", "social"],
            [1, "footer-social"],
            ["href", "https://www.linkedin.com/in/vimal-srivastava-32362992"],
            [1, "fa", "fa-linkedin"],
            ["href", "https://github.com/vimal-professional-seeker"],
            [1, "fa", "fa-github"],
            ["href", "https://leetcode.com/u/5hV8dpo6Of/"],
            [1, "fa", "fa-code"],
            [1, "col-eight", "tab-full"],
            [1, "copyright"],
            ["id", "go-top"],
            ["title", "Back to Top", "href", "#top", 1, "smoothscroll"],
            [1, "fa", "fa-long-arrow-up"]
        ],
        template: function(n, r) {
            n & 1 && (h(0, "footer")(1, "div", 0)(2, "div", 1)(3, "ul", 2)(4, "li")(5, "a", 3), R(6, "i", 4), p()(), h(7, "li")(8, "a", 5), R(9, "i", 6), p()(), h(10, "li")(11, "a", 7), R(12, "i", 8), p()()()(), h(13, "div", 9)(14, "div", 10)(15, "span"), f(16, "\xA9 Vimal Srivastava"), p()()(), h(17, "div", 11)(18, "a", 12), R(19, "i", 13), p()()()())
        },
        encapsulation: 2
    })
};
var kc = class e {
    static\ u0275fac = function(n) {
        return new(n || e)
    };
    static\ u0275cmp = K({
        type: e,
        selectors: [
            ["app-root"]
        ],
        decls: 10,
        vars: 0,
        template: function(n, r) {
            n & 1 && he(0, "app-header")(1, "app-intro")(2, "app-about")(3, "app-resume")(4, "app-portfolio")(5, "app-cta")(6, "app-services")(7, "app-stats")(8, "app-contact")(9, "app-footer")
        },
        dependencies: [gc, mc, vc, yc, Ec, Dc, Cc, _c, Oc, Pc],
        styles: ["html[_ngcontent-%COMP%]{scroll-behavior:smooth}img[_ngcontent-%COMP%]{max-width:100%;height:auto;display:block}@media (max-width: 1024px){.col-six[_ngcontent-%COMP%], .col-four[_ngcontent-%COMP%], .col-eight[_ngcontent-%COMP%]{width:100%!important}}@media (max-width: 768px){#folio-wrapper.block-1-2[_ngcontent-%COMP%]   .bgrid[_ngcontent-%COMP%], .services-list.block-1-3[_ngcontent-%COMP%]   .bgrid[_ngcontent-%COMP%]{width:100%!important}}@media (max-width: 480px){h1[_ngcontent-%COMP%], .h01[_ngcontent-%COMP%]{font-size:1.8rem!important}h2[_ngcontent-%COMP%]{font-size:1.4rem!important}.lead[_ngcontent-%COMP%]{font-size:1rem!important}section[_ngcontent-%COMP%]{padding-left:14px;padding-right:14px}}"]
    })
};
vf(kc, kE).catch(e => console.error(e));