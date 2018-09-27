! function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var r = t();
        for (var n in r)("object" == typeof exports ? exports : e)[n] = r[n]
    }
}(this, function() {
    return function(e) {
        function t(n) {
            if (r[n]) return r[n].exports;
            var i = r[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return e[n].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports
        }
        var r = {};
        return t.m = e, t.c = r, t.p = "", t(0)
    }([function(e, t, r) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var o = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = r(2),
            s = n(a),
            u = r(1),
            c = n(u),
            l = function(e, t, r) {
                var n = null !== r,
                    i = "eegeo-marker" + (e ? " selected" : "") + (t ? " has-anchor" : ""),
                    o = "eegeo-marker-body" + (n ? " has-icon" : ""),
                    a = c.default.getIconUrlForKey(r),
                    s = "<div class='eegeo-marker-container'> \t                <div class='" + o + "'></div> \t                <div class='eegeo-marker-anchor'></div> \t                <div class='eegeo-marker-pin-icon'" + (n ? " style='background-image: url(" + a + ")'" : "") + "</div> \t                </div>";
                return L.divIcon({
                    className: i,
                    iconSize: null,
                    html: s
                })
            },
            h = "indoorMapId",
            f = "indoorMapFloorId",
            d = "indoorMapFloorIndex",
            p = "elevation",
            y = "isIndoor",
            v = "indoorId",
            _ = "floorIndex",
            m = function() {
                function e(t, r) {
                    var n = this;
                    if (i(this, e), this._map = t, this._options = Object.assign({}, r), this._markers = {}, this._markersPendingDelete = {}, this._selectedMarkerId = null, this._hasAnchors = this._shouldHaveAnchors(), this._animationKeys = ["appear", "disappear"], this._map.on("update", this._onUpdate.bind(this)), this._map.on("zoom", this._updateAnchors.bind(this)), this._map.on("tilt", this._updateAnchors.bind(this)), this._searchbarSubscriber = null, "searchbar" in this._options) {
                        var o = function(e, t, r) {
                                return n.addMarker(e, t, r)
                            },
                            a = function(e) {
                                return n.removeMarker(e)
                            },
                            u = function() {
                                return n.removeAllMarkers()
                            };
                        this._searchbarSubscriber = new s.default(this._options.searchbar, o, a, u)
                    }
                }
                return o(e, [{
                    key: "addMarker",
                    value: function(e, t, r) {
                        var n = this._createMarker(e, L.latLng(t), r);
                        return n && this._showMarker(n), n
                    }
                }, {
                    key: "removeMarker",
                    value: function(e) {
                        var t = this._getMarker(e);
                        return t && this._hideMarker(t, !0), t
                    }
                }, {
                    key: "removeAllMarkers",
                    value: function() {
                        var e = this;
                        Object.keys(this._markers).forEach(function(t) {
                            e.removeMarker(t)
                        })
                    }
                }, {
                    key: "showMarker",
                    value: function(e) {
                        var t = this._getMarker(e);
                        return t && this._showMarker(t), t
                    }
                }, {
                    key: "hideMarker",
                    value: function(e) {
                        var t = this._getMarker(e);
                        return t && this._hideMarker(t), t
                    }
                }, {
                    key: "selectMarker",
                    value: function(e) {
                        var t = this._getMarker(e);
                        return t && (this._isMarkerSelected(t) || (this.deselectMarker(), this._selectedMarkerId = t.id, t.setZIndexOffset(1e3), this._updateMarkerIcon(t))), t
                    }
                }, {
                    key: "deselectMarker",
                    value: function() {
                        var e = this._getMarker(this._selectedMarkerId);
                        this._selectedMarkerId = null, e && (this._updateMarkerIcon(e), e.setZIndexOffset(0))
                    }
                }, {
                    key: "moveMarker",
                    value: function(e, t) {
                        var r = this._getMarker(e);
                        return r && r.setLatLng(t), r
                    }
                }, {
                    key: "updateMarker",
                    value: function(e, t) {
                        var r = this._getMarker(e);
                        if (!r) return r;
                        if (null === t || void 0 === t) return r;
                        if ("lat" in t || "lng" in t) {
                            var n = void 0 === t.lat ? r.getLatLng().lat : t.lat,
                                i = void 0 === t.lng ? r.getLatLng().lng : t.lng;
                            r.setLatLng(L.latLng(n, i))
                        }
                        "iconKey" in t && this._updateMarkerIcon(r, t.iconKey), p in t && r.setElevation(t[p]);
                        var o = y in t || v in t || _ in t;
                        if (!o) return r;
                        var a = t[y];
                        if (a === !1) return r.setOutdoor(), r;
                        var s = void 0 !== t[v] ? t[v] : r.options[h];
                        if (void 0 === s) return r;
                        var u = r.options[f],
                            c = void 0 !== t[_] ? t[_] : r.options[d];
                        return void 0 !== u ? r.setIndoorMapWithFloorId(s, u) : void 0 !== c && r.setIndoorMapWithFloorIndex(s, c), r
                    }
                }, {
                    key: "getAllMarkerIds",
                    value: function() {
                        return Object.keys(this._markers)
                    }
                }, {
                    key: "getMarker",
                    value: function(e) {
                        return this._getMarker(e)
                    }
                }, {
                    key: "_getMarker",
                    value: function(e) {
                        if ("number" == typeof e || "string" == typeof e) {
                            if (this._searchbarSubscriber) {
                                var t = this._searchbarSubscriber.getLocalIdFromSourceId(e);
                                return null !== t ? this._markers[t] : this._markers[e]
                            }
                            return e in this._markers ? this._markers[e] : null
                        }
                        return null !== e && this._markers[e.id] === e ? e : null
                    }
                }, {
                    key: "_convertMarkerControllerToWrldJsMarkerOptions",
                    value: function(e) {
                        var t = JSON.parse(JSON.stringify(e)),
                            r = t[y] === !1;
                        return r || (this._map.indoors.isIndoors() && (v in t || (t[v] = this._map.indoors.getActiveIndoorMap().getIndoorMapId()), _ in t || (t[_] = this._map.indoors.getFloor().getFloorIndex())), v in t && (t[h] = t[v]), _ in t && (t[d] = t[_])), delete t[y], delete t[v], delete t[_], t
                    }
                }, {
                    key: "_createMarker",
                    value: function(e, t, r) {
                        var n = this;
                        if (e in this._markers) return null;
                        var i = r || {},
                            o = this._convertMarkerControllerToWrldJsMarkerOptions(i),
                            a = L.marker(t, o);
                        return "iconKey" in o && (a.iconKey = o.iconKey), a.visible = !1, a.isAnimating = !1, a.oneTimeAnimationEndCallback = null, a.dragEndCallback = null, a.anchorAnimatingCallback = null, a.id = e, a.isBeingDragged = !1, a.isAnchorAnimating = !1, a.on("add", function(e) {
                            n._animateMarker(a, "appear"), a.visible = !0
                        }), a.on("dragstart", function(e) {
                            a.isBeingDragged = !0
                        }), a.on("dragend", function(e) {
                            a.isBeingDragged = !1, a.dragEndCallback && (a.dragEndCallback(), a.dragEndCallback = null)
                        }), this._markers[e] = a, a
                    }
                }, {
                    key: "_isMarkerSelected",
                    value: function(e) {
                        return e.id === this._selectedMarkerId
                    }
                }, {
                    key: "_showMarker",
                    value: function(e) {
                        e.visible || (this._updateMarkerIcon(e, void 0, !1), e.addTo(this._map))
                    }
                }, {
                    key: "_hideMarker",
                    value: function(e) {
                        var t = this,
                            r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        (e.visible || r) && (this._isMarkerOnMap(e) && void 0 !== e.iconKey ? (this._updateMarkerIcon(e, void 0, !1), this._animateMarker(e, "disappear", function() {
                            t._removeMarkerFromMap(e)
                        })) : this._removeMarkerFromMap(e), r && this._addMarkerForDeletion(e))
                    }
                }, {
                    key: "_removeMarkerFromMap",
                    value: function(e) {
                        this._map.removeLayer(e), e.visible = !1
                    }
                }, {
                    key: "_addMarkerForDeletion",
                    value: function(e) {
                        var t = e.id;
                        null !== this._searchbarSubscriber && this._searchbarSubscriber.removeMarker(t), this._markersPendingDelete[t] = e, delete this._markers[t]
                    }
                }, {
                    key: "_onUpdate",
                    value: function() {
                        var e = this;
                        Object.keys(this._markersPendingDelete).forEach(function(t) {
                            var r = e._markersPendingDelete[t];
                            e._isMarkerOnMap(r) || (e._map.removeLayer(r), delete e._markersPendingDelete[t])
                        })
                    }
                }, {
                    key: "_updateAnchors",
                    value: function(e) {
                        var t = this;
                        if (this._hasAnchors !== this._shouldHaveAnchors()) {
                            this._hasAnchors = this._shouldHaveAnchors();
                            var r = function(e) {
                                var r = t._markers[e];
                                t._isMarkerOnMap(r) && (t._hasAnchors && !$(r.getElement()).hasClass("has-anchor") ? (r.isAnchorAnimating = !0, $(r.getElement()).addClass("has-anchor"), $(r.getElement()).bind("transitionend", function() {
                                    r.isAnchorAnimating = !1, r.anchorAnimatingCallback && (r.anchorAnimatingCallback(), r.anchorAnimatingCallback = null), t._updateMarkerIcon(r)
                                })) : $(r.getElement()).hasClass("has-anchor") && (r.isAnchorAnimating = !0, $(r.getElement()).removeClass("has-anchor"), $(r.getElement()).bind("transitionend", function() {
                                    r.isAnchorAnimating = !1, r.anchorAnimatingCallback && (r.anchorAnimatingCallback(), r.anchorAnimatingCallback = null), t._updateMarkerIcon(r)
                                })))
                            };
                            for (var n in this._markers) r(n)
                        }
                    }
                }, {
                    key: "_shouldHaveAnchors",
                    value: function() {
                        return this._map.getCameraPitchDegrees() < 60
                    }
                }, {
                    key: "_updateMarkerIcon",
                    value: function(e, t) {
                        var r = this,
                            n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                        if (void 0 !== e.iconKey) {
                            void 0 !== t && (e.iconKey = t);
                            var i = l(this._isMarkerSelected(e), this._hasAnchors, e.iconKey);
                            n && e.isAnimating ? e.oneTimeAnimationEndCallback = function() {
                                r._setIcon(e, i)
                            } : this._setIcon(e, i)
                        }
                    }
                }, {
                    key: "_setIcon",
                    value: function(e, t) {
                        e.isAnchorAnimating || (e.dragEndCallback = null, e.anchorAnimatingCallback = null, e.isBeingDragged ? e.isBeingDragged && (e.dragEndCallback = function() {
                            e.setIcon(t)
                        }) : e.setIcon(t))
                    }
                }, {
                    key: "_animateMarker",
                    value: function(e, t, r) {
                        if (this._isMarkerOnMap(e)) {
                            var n = e.getElement().childNodes[0];
                            this._animationKeys.forEach(function(e) {
                                $(n).removeClass(e)
                            }), $(n).addClass(t), e.isAnimating = !0, $(n).bind("animationend", function() {
                                e.isAnimating = !1, e.oneTimeAnimationEndCallback && (e.oneTimeAnimationEndCallback(), e.oneTimeAnimationEndCallback = null), r && r()
                            })
                        }
                    }
                }, {
                    key: "_isMarkerOnMap",
                    value: function(e) {
                        return null !== e.getElement() && void 0 !== e.getElement()
                    }
                }]), e
            }(),
            b = function(e) {
                return new m(e)
            };
        e.exports = {
            WrldMarkerController: m,
            wrldMarkerController: b,
            EegeoMarkerController: m,
            eegeoMarkerController: b
        }
    }, function(e, t, r) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }

        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = r(3),
            s = n(a),
            u = r(4),
            c = n(u); 
        var l = function() {
                function e() {
                    i(this, e), this._baseUrl = "https://cdn-webgl.wrld3d.com/wrld-search/latest/", this._searchTagsJsonUrl = this._baseUrl + "tags/search_tags.json", this._allTags = {}, this._allIconKeys = [], this._defaultIconKey = "", this._fetchTags()
                }
                return o(e, [{
                    key: "getAllTags",
                    value: function() {
                        return JSON.parse(JSON.stringify(this._allTags))
                    }
                }, {
                    key: "getIconUrlForKey",
                    value: function(e) {
                        return "img/markerIcons/icon_" + e + ".png"
                    }
                }, {
                    key: "getIconKeys",
                    value: function() {
                        if (0 === this._allIconKeys.length)
                            for (var e in this._allTags) {
                                var t = this._allTags[e];
                                this._allIconKeys.indexOf(t.iconKey) === -1 && this._allIconKeys.push(t.iconKey)
                            }
                        return this._allIconKeys.slice()
                    }
                }, {
                    key: "getDefaultIconKey",
                    value: function() {
                        return this._defaultIconKey
                    }
                }, {
                    key: "getSearchTags",
                    value: function() {
                        return Object.keys(this._allTags)
                    }
                }, {
                    key: "getHumanReadable",
                    value: function(e) {
                        return e in this._allTags ? this._allTags[e].name : this._getHumanReadable(e)
                    }
                }, {
                    key: "getHumanReadablesFromTagsString",
                    value: function(e) {
                        var t = this,
                            r = e.split(" ");
                        return r.map(function(e) {
                            return t.getHumanReadable(e)
                        })
                    }
                }, {
                    key: "convertHumanReadableToTag",
                    value: function(e) {
                        var t = e.trim().toLowerCase();
                        return t.split(" ").join("_")
                    }
                }, {
                    key: "getIconKey",
                    value: function(e) {
                        return e in this._allTags ? this._allTags[e].iconKey : this._defaultIconKey
                    }
                }, {
                    key: "getIconKeyFromTagsString",
                    value: function(e) {
                        var t = this,
                            r = e.split(" "),
                            n = r.find(function(e) {
                                return void 0 !== t._allTags[e]
                            });
                        return this.getIconKey(n)
                    }
                }, {
                    key: "getHumanReadablesMapFromTagsString",
                    value: function(e) {
                        var t = this,
                            r = e.split(" "),
                            n = {};
                        return r.forEach(function(e) {
                            n[e] = t.getHumanReadable(e)
                        }), n
                    }
                }, {
                    key: "isSearchTagValid",
                    value: function(e) {
                        return /^[a-z_]+$/.test(e)
                    }
                }, {
                    key: "filterSearchTagsByHumanReadables",
                    value: function(e) {
                        var t = this,
                            r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                            n = e.split(" "),
                            i = [];
                        for (var o in this._allTags) {
                            var a = this._allTags[o];
                            this._matchStringsToHumanReadable(n, a.name) && i.push(o)
                        }
                        return r.forEach(function(e) {
                            t._matchStringsToHumanReadable(n, t.getHumanReadable(e)) && i.push(e)
                        }), i
                    }
                }, {
                    key: "filterIconKeysByHumanReadables",
                    value: function(e) {
                        var t = e.split(" "),
                            r = [];
                        for (var n in this._allTags) {
                            var i = this._allTags[n];
                            r.indexOf(i.iconKey) === -1 && this._matchStringsToHumanReadable(t, i.name) && r.push(i.iconKey)
                        }
                        return r
                    }
                }, {
                    key: "_fetchTags",
                    value: function() {
                        var e = this;
                        return (0, c.default)(this._searchTagsJsonUrl).then(function(e) {
                            return e.json()
                        }).then(function(t) {
                            t.tags.forEach(function(t) {
                                e._allTags[t.tag] = {
                                    name: t.readable_tag,
                                    iconKey: t.icon_key
                                }
                            }), e._defaultIconKey = t.default_icon_key
                        })
                    }
                }, {
                    key: "_capitalize",
                    value: function(e) {
                        return e.charAt(0).toUpperCase() + e.slice(1)
                    }
                }, {
                    key: "_matchStringsToHumanReadable",
                    value: function(e, t) {
                        return e.some(function(e) {
                            if (0 === e.length) return !1;
                            var r = t.toLowerCase().indexOf(e.toLowerCase());
                            return r !== -1 && (0 === r || " " === t.charAt(r - 1))
                        })
                    }
                }, {
                    key: "_getHumanReadable",
                    value: function(e) {
                        var t = this,
                            r = e.toLowerCase().split("_"),
                            n = r.map(function(e) {
                                return t._capitalize(e)
                            });
                        return n.join(" ")
                    }
                }]), e
            }(),
            h = new l;
        t.default = h
    }, function(e, t) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            i = function() {
                function e(t, n, i, o) {
                    var a = this;
                    r(this, e), this._searchbar = t, this._onMarkerAdd = n, this._onMarkerRemove = i, this._onMarkersClear = o, this._sourceToLocalIds = {}, this._localToSourceIds = {}, this._searchbar.on("searchresultsupdate", function(e) {
                        return a._addMarkersFromJSON(e.results)
                    }), this._searchbar.on("searchresultsclear", function() {
                        return a._clearMarkers()
                    })
                }
                return n(e, [{
                    key: "removeMarker",
                    value: function(e) {
                        if (e in this._localToSourceIds) {
                            var t = this._localToSourceIds[e];
                            delete this._sourceToLocalIds[t], delete this._localToSourceIds[e]
                        }
                    }
                }, {
                    key: "getLocalIdFromSourceId",
                    value: function(e) {
                        return e in this._sourceToLocalIds ? this._sourceToLocalIds[e] : null
                    }
                }, {
                    key: "_addMarkerFromJSON",
                    value: function(e, t) {
                        var r = t.location.latLng,
                            n = {};
                        "elevation" in t.location && (n.elevation = t.location.elevation), "isIndoor" in t.location && (n.isIndoor = t.location.isIndoor), "indoorId" in t.location && (n.indoorId = t.location.indoorId), "floorIndex" in t.location && (n.floorIndex = t.location.floorIndex), "iconKey" in t && (n.iconKey = t.iconKey), this._onMarkerAdd(e, r, n)
                    }
                }, {
                    key: "_addMarkersFromJSON",
                    value: function(e) {
                        var t = this,
                            r = Object.assign({}, this._localToSourceIds);
                        if (Array.isArray(e)) e.forEach(function(e) {
                            var r = e.id;
                            t._addMarkerFromJSON(r, e)
                        });
                        else
                            for (var n in e) {
                                var i = e[n].sourceId;
                                if (i in this._sourceToLocalIds) {
                                    var o = this._sourceToLocalIds[i];
                                    delete r[o]
                                } else this._sourceToLocalIds[i] = n, this._localToSourceIds[n] = i, this._addMarkerFromJSON(n, e[n])
                            }
                        for (var a in r) this._onMarkerRemove(a)
                    }
                }, {
                    key: "_clearMarkers",
                    value: function() {
                        this._onMarkersClear()
                    }
                }]), e
            }();
        t.default = i
    }, function(e, t, r) {
        (function(t, n) {
            /*!
             * @overview es6-promise - a tiny implementation of Promises/A+.
             * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
             * @license   Licensed under MIT license
             *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
             * @version   3.3.1
             */
            ! function(t, r) {
                e.exports = r()
            }(this, function() {
                "use strict";

                function e(e) {
                    return "function" == typeof e || "object" == typeof e && null !== e
                }

                function i(e) {
                    return "function" == typeof e
                }

                function o(e) {
                    V = e
                }

                function a(e) {
                    Y = e
                }

                function s() {
                    return function() {
                        return t.nextTick(f)
                    }
                }

                function u() {
                    return function() {
                        G(f)
                    }
                }

                function c() {
                    var e = 0,
                        t = new Q(f),
                        r = document.createTextNode("");
                    return t.observe(r, {
                            characterData: !0
                        }),
                        function() {
                            r.data = e = ++e % 2
                        }
                }

                function l() {
                    var e = new MessageChannel;
                    return e.port1.onmessage = f,
                        function() {
                            return e.port2.postMessage(0)
                        }
                }

                function h() {
                    var e = setTimeout;
                    return function() {
                        return e(f, 1)
                    }
                }

                function f() {
                    for (var e = 0; e < W; e += 2) {
                        var t = re[e],
                            r = re[e + 1];
                        t(r), re[e] = void 0, re[e + 1] = void 0
                    }
                    W = 0
                }

                function d() {
                    try {
                        var e = r(7);
                        return G = e.runOnLoop || e.runOnContext, u()
                    } catch (e) {
                        return h()
                    }
                }

                function p(e, t) {
                    var r = arguments,
                        n = this,
                        i = new this.constructor(v);
                    void 0 === i[ie] && P(i);
                    var o = n._state;
                    return o ? ! function() {
                        var e = r[o - 1];
                        Y(function() {
                            return L(o, i, e, n._result)
                        })
                    }() : S(n, i, e, t), i
                }

                function y(e) {
                    var t = this;
                    if (e && "object" == typeof e && e.constructor === t) return e;
                    var r = new t(v);
                    return M(r, e), r
                }

                function v() {}

                function _() {
                    return new TypeError("You cannot resolve a promise with itself")
                }

                function m() {
                    return new TypeError("A promises callback cannot return that same promise.")
                }

                function b(e) {
                    try {
                        return e.then
                    } catch (e) {
                        return ue.error = e, ue
                    }
                }

                function g(e, t, r, n) {
                    try {
                        e.call(t, r, n)
                    } catch (e) {
                        return e
                    }
                }

                function k(e, t, r) {
                    Y(function(e) {
                        var n = !1,
                            i = g(r, t, function(r) {
                                n || (n = !0, t !== r ? M(e, r) : I(e, r))
                            }, function(t) {
                                n || (n = !0, E(e, t))
                            }, "Settle: " + (e._label || " unknown promise"));
                        !n && i && (n = !0, E(e, i))
                    }, e)
                }

                function w(e, t) {
                    t._state === ae ? I(e, t._result) : t._state === se ? E(e, t._result) : S(t, void 0, function(t) {
                        return M(e, t)
                    }, function(t) {
                        return E(e, t)
                    })
                }

                function T(e, t, r) {
                    t.constructor === e.constructor && r === p && t.constructor.resolve === y ? w(e, t) : r === ue ? E(e, ue.error) : void 0 === r ? I(e, t) : i(r) ? k(e, t, r) : I(e, t)
                }

                function M(t, r) {
                    t === r ? E(t, _()) : e(r) ? T(t, r, b(r)) : I(t, r)
                }

                function A(e) {
                    e._onerror && e._onerror(e._result), O(e)
                }

                function I(e, t) {
                    e._state === oe && (e._result = t, e._state = ae, 0 !== e._subscribers.length && Y(O, e))
                }

                function E(e, t) {
                    e._state === oe && (e._state = se, e._result = t, Y(A, e))
                }

                function S(e, t, r, n) {
                    var i = e._subscribers,
                        o = i.length;
                    e._onerror = null, i[o] = t, i[o + ae] = r, i[o + se] = n, 0 === o && e._state && Y(O, e)
                }

                function O(e) {
                    var t = e._subscribers,
                        r = e._state;
                    if (0 !== t.length) {
                        for (var n = void 0, i = void 0, o = e._result, a = 0; a < t.length; a += 3) n = t[a], i = t[a + r], n ? L(r, n, i, o) : i(o);
                        e._subscribers.length = 0
                    }
                }

                function C() {
                    this.error = null
                }

                function x(e, t) {
                    try {
                        return e(t)
                    } catch (e) {
                        return ce.error = e, ce
                    }
                }

                function L(e, t, r, n) {
                    var o = i(r),
                        a = void 0,
                        s = void 0,
                        u = void 0,
                        c = void 0;
                    if (o) {
                        if (a = x(r, n), a === ce ? (c = !0, s = a.error, a = null) : u = !0, t === a) return void E(t, m())
                    } else a = n, u = !0;
                    t._state !== oe || (o && u ? M(t, a) : c ? E(t, s) : e === ae ? I(t, a) : e === se && E(t, a))
                }

                function j(e, t) {
                    try {
                        t(function(t) {
                            M(e, t)
                        }, function(t) {
                            E(e, t)
                        })
                    } catch (t) {
                        E(e, t)
                    }
                }

                function B() {
                    return le++
                }

                function P(e) {
                    e[ie] = le++, e._state = void 0, e._result = void 0, e._subscribers = []
                }

                function F(e, t) {
                    this._instanceConstructor = e, this.promise = new e(v), this.promise[ie] || P(this.promise), z(t) ? (this._input = t, this.length = t.length, this._remaining = t.length, this._result = new Array(this.length), 0 === this.length ? I(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(), 0 === this._remaining && I(this.promise, this._result))) : E(this.promise, K())
                }

                function K() {
                    return new Error("Array Methods must be provided an Array")
                }

                function R(e) {
                    return new F(this, e).promise
                }

                function U(e) {
                    var t = this;
                    return new t(z(e) ? function(r, n) {
                        for (var i = e.length, o = 0; o < i; o++) t.resolve(e[o]).then(r, n)
                    } : function(e, t) {
                        return t(new TypeError("You must pass an array to race."))
                    })
                }

                function D(e) {
                    var t = this,
                        r = new t(v);
                    return E(r, e), r
                }

                function H() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                }

                function N() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                }

                function J(e) {
                    this[ie] = B(), this._result = this._state = void 0, this._subscribers = [], v !== e && ("function" != typeof e && H(), this instanceof J ? j(this, e) : N())
                }

                function $() {
                    var e = void 0;
                    if ("undefined" != typeof n) e = n;
                    else if ("undefined" != typeof self) e = self;
                    else try {
                        e = Function("return this")()
                    } catch (e) {
                        throw new Error("polyfill failed because global object is unavailable in this environment")
                    }
                    var t = e.Promise;
                    if (t) {
                        var r = null;
                        try {
                            r = Object.prototype.toString.call(t.resolve())
                        } catch (e) {}
                        if ("[object Promise]" === r && !t.cast) return
                    }
                    e.Promise = J
                }
                var q = void 0;
                q = Array.isArray ? Array.isArray : function(e) {
                    return "[object Array]" === Object.prototype.toString.call(e)
                };
                var z = q,
                    W = 0,
                    G = void 0,
                    V = void 0,
                    Y = function(e, t) {
                        re[W] = e, re[W + 1] = t, W += 2, 2 === W && (V ? V(f) : ne())
                    },
                    X = "undefined" != typeof window ? window : void 0,
                    Z = X || {},
                    Q = Z.MutationObserver || Z.WebKitMutationObserver,
                    ee = "undefined" == typeof self && "undefined" != typeof t && "[object process]" === {}.toString.call(t),
                    te = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                    re = new Array(1e3),
                    ne = void 0;
                ne = ee ? s() : Q ? c() : te ? l() : void 0 === X ? d() : h();
                var ie = Math.random().toString(36).substring(16),
                    oe = void 0,
                    ae = 1,
                    se = 2,
                    ue = new C,
                    ce = new C,
                    le = 0;
                return F.prototype._enumerate = function() {
                    for (var e = this.length, t = this._input, r = 0; this._state === oe && r < e; r++) this._eachEntry(t[r], r)
                }, F.prototype._eachEntry = function(e, t) {
                    var r = this._instanceConstructor,
                        n = r.resolve;
                    if (n === y) {
                        var i = b(e);
                        if (i === p && e._state !== oe) this._settledAt(e._state, t, e._result);
                        else if ("function" != typeof i) this._remaining--, this._result[t] = e;
                        else if (r === J) {
                            var o = new r(v);
                            T(o, e, i), this._willSettleAt(o, t)
                        } else this._willSettleAt(new r(function(t) {
                            return t(e)
                        }), t)
                    } else this._willSettleAt(n(e), t)
                }, F.prototype._settledAt = function(e, t, r) {
                    var n = this.promise;
                    n._state === oe && (this._remaining--, e === se ? E(n, r) : this._result[t] = r), 0 === this._remaining && I(n, this._result)
                }, F.prototype._willSettleAt = function(e, t) {
                    var r = this;
                    S(e, void 0, function(e) {
                        return r._settledAt(ae, t, e)
                    }, function(e) {
                        return r._settledAt(se, t, e)
                    })
                }, J.all = R, J.race = U, J.resolve = y, J.reject = D, J._setScheduler = o, J._setAsap = a, J._asap = Y, J.prototype = {
                    constructor: J,
                    then: p,
                    catch: function(e) {
                        return this.then(null, e)
                    }
                }, $(), J.polyfill = $, J.Promise = J, J
            })
        }).call(t, r(6), function() {
            return this
        }())
    }, function(e, t, r) {
        r(5), e.exports = self.fetch.bind(self)
    }, function(e, t) {
        ! function(e) {
            "use strict";

            function t(e) {
                if ("string" != typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e)) throw new TypeError("Invalid character in header field name");
                return e.toLowerCase()
            }

            function r(e) {
                return "string" != typeof e && (e = String(e)), e
            }

            function n(e) {
                var t = {
                    next: function() {
                        var t = e.shift();
                        return {
                            done: void 0 === t,
                            value: t
                        }
                    }
                };
                return _.iterable && (t[Symbol.iterator] = function() {
                    return t
                }), t
            }

            function i(e) {
                this.map = {}, e instanceof i ? e.forEach(function(e, t) {
                    this.append(t, e)
                }, this) : Array.isArray(e) ? e.forEach(function(e) {
                    this.append(e[0], e[1])
                }, this) : e && Object.getOwnPropertyNames(e).forEach(function(t) {
                    this.append(t, e[t])
                }, this)
            }

            function o(e) {
                return e.bodyUsed ? Promise.reject(new TypeError("Already read")) : void(e.bodyUsed = !0)
            }

            function a(e) {
                return new Promise(function(t, r) {
                    e.onload = function() {
                        t(e.result)
                    }, e.onerror = function() {
                        r(e.error)
                    }
                })
            }

            function s(e) {
                var t = new FileReader,
                    r = a(t);
                return t.readAsArrayBuffer(e), r
            }

            function u(e) {
                var t = new FileReader,
                    r = a(t);
                return t.readAsText(e), r
            }

            function c(e) {
                for (var t = new Uint8Array(e), r = new Array(t.length), n = 0; n < t.length; n++) r[n] = String.fromCharCode(t[n]);
                return r.join("")
            }

            function l(e) {
                if (e.slice) return e.slice(0);
                var t = new Uint8Array(e.byteLength);
                return t.set(new Uint8Array(e)), t.buffer
            }

            function h() {
                return this.bodyUsed = !1, this._initBody = function(e) {
                    if (this._bodyInit = e, e)
                        if ("string" == typeof e) this._bodyText = e;
                        else if (_.blob && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;
                    else if (_.formData && FormData.prototype.isPrototypeOf(e)) this._bodyFormData = e;
                    else if (_.searchParams && URLSearchParams.prototype.isPrototypeOf(e)) this._bodyText = e.toString();
                    else if (_.arrayBuffer && _.blob && b(e)) this._bodyArrayBuffer = l(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer]);
                    else {
                        if (!_.arrayBuffer || !ArrayBuffer.prototype.isPrototypeOf(e) && !g(e)) throw new Error("unsupported BodyInit type");
                        this._bodyArrayBuffer = l(e)
                    } else this._bodyText = "";
                    this.headers.get("content-type") || ("string" == typeof e ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : _.searchParams && URLSearchParams.prototype.isPrototypeOf(e) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
                }, _.blob && (this.blob = function() {
                    var e = o(this);
                    if (e) return e;
                    if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                    if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                    if (this._bodyFormData) throw new Error("could not read FormData body as blob");
                    return Promise.resolve(new Blob([this._bodyText]))
                }, this.arrayBuffer = function() {
                    return this._bodyArrayBuffer ? o(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(s)
                }), this.text = function() {
                    var e = o(this);
                    if (e) return e;
                    if (this._bodyBlob) return u(this._bodyBlob);
                    if (this._bodyArrayBuffer) return Promise.resolve(c(this._bodyArrayBuffer));
                    if (this._bodyFormData) throw new Error("could not read FormData body as text");
                    return Promise.resolve(this._bodyText)
                }, _.formData && (this.formData = function() {
                    return this.text().then(p)
                }), this.json = function() {
                    return this.text().then(JSON.parse)
                }, this
            }

            function f(e) {
                var t = e.toUpperCase();
                return k.indexOf(t) > -1 ? t : e
            }

            function d(e, t) {
                t = t || {};
                var r = t.body;
                if (e instanceof d) {
                    if (e.bodyUsed) throw new TypeError("Already read");
                    this.url = e.url, this.credentials = e.credentials, t.headers || (this.headers = new i(e.headers)), this.method = e.method, this.mode = e.mode, r || null == e._bodyInit || (r = e._bodyInit, e.bodyUsed = !0)
                } else this.url = String(e);
                if (this.credentials = t.credentials || this.credentials || "omit", !t.headers && this.headers || (this.headers = new i(t.headers)), this.method = f(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && r) throw new TypeError("Body not allowed for GET or HEAD requests");
                this._initBody(r)
            }

            function p(e) {
                var t = new FormData;
                return e.trim().split("&").forEach(function(e) {
                    if (e) {
                        var r = e.split("="),
                            n = r.shift().replace(/\+/g, " "),
                            i = r.join("=").replace(/\+/g, " ");
                        t.append(decodeURIComponent(n), decodeURIComponent(i))
                    }
                }), t
            }

            function y(e) {
                var t = new i,
                    r = e.replace(/\r?\n[\t ]+/g, " ");
                return r.split(/\r?\n/).forEach(function(e) {
                    var r = e.split(":"),
                        n = r.shift().trim();
                    if (n) {
                        var i = r.join(":").trim();
                        t.append(n, i)
                    }
                }), t
            }

            function v(e, t) {
                t || (t = {}), this.type = "default", this.status = void 0 === t.status ? 200 : t.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in t ? t.statusText : "OK", this.headers = new i(t.headers), this.url = t.url || "", this._initBody(e)
            }
            if (!e.fetch) {
                var _ = {
                    searchParams: "URLSearchParams" in e,
                    iterable: "Symbol" in e && "iterator" in Symbol,
                    blob: "FileReader" in e && "Blob" in e && function() {
                        try {
                            return new Blob, !0
                        } catch (e) {
                            return !1
                        }
                    }(),
                    formData: "FormData" in e,
                    arrayBuffer: "ArrayBuffer" in e
                };
                if (_.arrayBuffer) var m = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
                    b = function(e) {
                        return e && DataView.prototype.isPrototypeOf(e)
                    },
                    g = ArrayBuffer.isView || function(e) {
                        return e && m.indexOf(Object.prototype.toString.call(e)) > -1
                    };
                i.prototype.append = function(e, n) {
                    e = t(e), n = r(n);
                    var i = this.map[e];
                    this.map[e] = i ? i + "," + n : n
                }, i.prototype.delete = function(e) {
                    delete this.map[t(e)]
                }, i.prototype.get = function(e) {
                    return e = t(e), this.has(e) ? this.map[e] : null
                }, i.prototype.has = function(e) {
                    return this.map.hasOwnProperty(t(e))
                }, i.prototype.set = function(e, n) {
                    this.map[t(e)] = r(n)
                }, i.prototype.forEach = function(e, t) {
                    for (var r in this.map) this.map.hasOwnProperty(r) && e.call(t, this.map[r], r, this)
                }, i.prototype.keys = function() {
                    var e = [];
                    return this.forEach(function(t, r) {
                        e.push(r)
                    }), n(e)
                }, i.prototype.values = function() {
                    var e = [];
                    return this.forEach(function(t) {
                        e.push(t)
                    }), n(e)
                }, i.prototype.entries = function() {
                    var e = [];
                    return this.forEach(function(t, r) {
                        e.push([r, t])
                    }), n(e)
                }, _.iterable && (i.prototype[Symbol.iterator] = i.prototype.entries);
                var k = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
                d.prototype.clone = function() {
                    return new d(this, {
                        body: this._bodyInit
                    })
                }, h.call(d.prototype), h.call(v.prototype), v.prototype.clone = function() {
                    return new v(this._bodyInit, {
                        status: this.status,
                        statusText: this.statusText,
                        headers: new i(this.headers),
                        url: this.url
                    })
                }, v.error = function() {
                    var e = new v(null, {
                        status: 0,
                        statusText: ""
                    });
                    return e.type = "error", e
                };
                var w = [301, 302, 303, 307, 308];
                v.redirect = function(e, t) {
                    if (w.indexOf(t) === -1) throw new RangeError("Invalid status code");
                    return new v(null, {
                        status: t,
                        headers: {
                            location: e
                        }
                    })
                }, e.Headers = i, e.Request = d, e.Response = v, e.fetch = function(e, t) {
                    return new Promise(function(r, n) {
                        var i = new d(e, t),
                            o = new XMLHttpRequest;
                        o.onload = function() {
                            var e = {
                                status: o.status,
                                statusText: o.statusText,
                                headers: y(o.getAllResponseHeaders() || "")
                            };
                            e.url = "responseURL" in o ? o.responseURL : e.headers.get("X-Request-URL");
                            var t = "response" in o ? o.response : o.responseText;
                            r(new v(t, e))
                        }, o.onerror = function() {
                            n(new TypeError("Network request failed"))
                        }, o.ontimeout = function() {
                            n(new TypeError("Network request failed"))
                        }, o.open(i.method, i.url, !0), "include" === i.credentials ? o.withCredentials = !0 : "omit" === i.credentials && (o.withCredentials = !1), "responseType" in o && _.blob && (o.responseType = "blob"), i.headers.forEach(function(e, t) {
                            o.setRequestHeader(t, e)
                        }), o.send("undefined" == typeof i._bodyInit ? null : i._bodyInit)
                    })
                }, e.fetch.polyfill = !0
            }
        }("undefined" != typeof self ? self : this)
    }, function(e, t) {
        function r() {
            throw new Error("setTimeout has not been defined")
        }

        function n() {
            throw new Error("clearTimeout has not been defined")
        }

        function i(e) {
            if (l === setTimeout) return setTimeout(e, 0);
            if ((l === r || !l) && setTimeout) return l = setTimeout, setTimeout(e, 0);
            try {
                return l(e, 0)
            } catch (t) {
                try {
                    return l.call(null, e, 0)
                } catch (t) {
                    return l.call(this, e, 0)
                }
            }
        }

        function o(e) {
            if (h === clearTimeout) return clearTimeout(e);
            if ((h === n || !h) && clearTimeout) return h = clearTimeout, clearTimeout(e);
            try {
                return h(e)
            } catch (t) {
                try {
                    return h.call(null, e)
                } catch (t) {
                    return h.call(this, e)
                }
            }
        }

        function a() {
            y && d && (y = !1, d.length ? p = d.concat(p) : v = -1, p.length && s())
        }

        function s() {
            if (!y) {
                var e = i(a);
                y = !0;
                for (var t = p.length; t;) {
                    for (d = p, p = []; ++v < t;) d && d[v].run();
                    v = -1, t = p.length
                }
                d = null, y = !1, o(e)
            }
        }

        function u(e, t) {
            this.fun = e, this.array = t
        }

        function c() {}
        var l, h, f = e.exports = {};
        ! function() {
            try {
                l = "function" == typeof setTimeout ? setTimeout : r
            } catch (e) {
                l = r
            }
            try {
                h = "function" == typeof clearTimeout ? clearTimeout : n
            } catch (e) {
                h = n
            }
        }();
        var d, p = [],
            y = !1,
            v = -1;
        f.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
            p.push(new u(e, t)), 1 !== p.length || y || i(s)
        }, u.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = c, f.addListener = c, f.once = c, f.off = c, f.removeListener = c, f.removeAllListeners = c, f.emit = c, f.prependListener = c, f.prependOnceListener = c, f.listeners = function(e) {
            return []
        }, f.binding = function(e) {
            throw new Error("process.binding is not supported")
        }, f.cwd = function() {
            return "/"
        }, f.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }, f.umask = function() {
            return 0
        }
    }, function(e, t) {}])
});