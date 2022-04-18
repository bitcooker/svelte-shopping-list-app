
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    function clickEscape(node, callBackFunction) {
        const handleKey = (event) => {
          if (
            event.key === "Escape" 
          )
          callBackFunction();
        };

        node.addEventListener("keydown", handleKey);

        return {
          destroy() {
            node.removeEventListener("keydown", handleKey);
          },
        };
      }

    /* src/icons/deleteIcon/DeleteIcon.svelte generated by Svelte v3.47.0 */

    function create_fragment$3(ctx) {
    	let svg;
    	let path;

    	return {
    		c() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "d", "M341,128V99c0-19.1-14.5-35-34.5-35H205.4C185.5,64,171,79.9,171,99v29H80v32h9.2c0,0,5.4,0.6,8.2,3.4c2.8,2.8,3.9,9,3.9,9  l19,241.7c1.5,29.4,1.5,33.9,36,33.9h199.4c34.5,0,34.5-4.4,36-33.8l19-241.6c0,0,1.1-6.3,3.9-9.1c2.8-2.8,8.2-3.4,8.2-3.4h9.2v-32  h-91V128z M192,99c0-9.6,7.8-15,17.7-15h91.7c9.9,0,18.6,5.5,18.6,15v29H192V99z M183.5,384l-10.3-192h20.3L204,384H183.5z   M267.1,384h-22V192h22V384z M328.7,384h-20.4l10.5-192h20.3L328.7,384z");
    			attr(path, "fill", /*fill*/ ctx[0]);
    			attr(svg, "height", /*height*/ ctx[2]);
    			attr(svg, "width", /*width*/ ctx[1]);
    			attr(svg, "id", "Layer_1");
    			attr(svg, "version", "1.1");
    			attr(svg, "viewBox", "0 0 512 512");
    			attr(svg, "xml:space", "preserve");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*fill*/ 1) {
    				attr(path, "fill", /*fill*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 4) {
    				attr(svg, "height", /*height*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 2) {
    				attr(svg, "width", /*width*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { fill = "ddddd" } = $$props;
    	let { width = "30px" } = $$props;
    	let { height = "30px" } = $$props;

    	$$self.$$set = $$props => {
    		if ('fill' in $$props) $$invalidate(0, fill = $$props.fill);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	return [fill, width, height];
    }

    class DeleteIcon extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { fill: 0, width: 1, height: 2 });
    	}
    }

    /* src/components/listItem/ListItem.svelte generated by Svelte v3.47.0 */

    function create_fragment$2(ctx) {
    	let li;
    	let div;
    	let input0;
    	let t0;
    	let input1;
    	let input1_id_value;
    	let clickEscape_action;
    	let t1;
    	let button;
    	let deleteicon;
    	let li_intro;
    	let li_outro;
    	let current;
    	let mounted;
    	let dispose;
    	deleteicon = new DeleteIcon({});

    	return {
    		c() {
    			li = element("li");
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			button = element("button");
    			create_component(deleteicon.$$.fragment);
    			attr(input0, "type", "checkbox");
    			attr(input0, "class", "cursor-pointer");
    			attr(input1, "class", "p-1.5 cursor-pointer border-none svelte-8iqnr1");
    			attr(input1, "id", input1_id_value = /*item*/ ctx[2].name);
    			attr(input1, "type", "text");
    			toggle_class(input1, "line-through", /*item*/ ctx[2].bought);
    			toggle_class(input1, "new-item", !/*item*/ ctx[2].name);
    			attr(div, "class", "flex items-center");
    			attr(button, "class", "border-none cursor:pointer bg-transparent fill-grey hover:fill-black svelte-8iqnr1");
    			attr(button, "type", "button");
    			attr(li, "class", "list-none flex justify-between items-center pb-4");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, div);
    			append(div, input0);
    			input0.checked = /*checked*/ ctx[0];
    			append(div, t0);
    			append(div, input1);
    			set_input_value(input1, /*value*/ ctx[1]);
    			append(li, t1);
    			append(li, button);
    			mount_component(deleteicon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(input0, "change", /*input0_change_handler*/ ctx[6]),
    					listen(input0, "change", /*change_handler*/ ctx[5]),
    					listen(input1, "input", /*input1_input_handler*/ ctx[7]),
    					action_destroyer(focus.call(null, input1)),
    					action_destroyer(clickEscape_action = clickEscape.call(null, input1, /*clickEscape_function*/ ctx[8])),
    					listen(button, "click", /*click_handler*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*checked*/ 1) {
    				input0.checked = /*checked*/ ctx[0];
    			}

    			if (!current || dirty & /*item*/ 4 && input1_id_value !== (input1_id_value = /*item*/ ctx[2].name)) {
    				attr(input1, "id", input1_id_value);
    			}

    			if (dirty & /*value*/ 2 && input1.value !== /*value*/ ctx[1]) {
    				set_input_value(input1, /*value*/ ctx[1]);
    			}

    			if (clickEscape_action && is_function(clickEscape_action.update) && dirty & /*removeEmptyItem*/ 8) clickEscape_action.update.call(null, /*clickEscape_function*/ ctx[8]);

    			if (dirty & /*item*/ 4) {
    				toggle_class(input1, "line-through", /*item*/ ctx[2].bought);
    			}

    			if (dirty & /*item*/ 4) {
    				toggle_class(input1, "new-item", !/*item*/ ctx[2].name);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(deleteicon.$$.fragment, local);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fly, { y: 10, duration: 1000 });
    				li_intro.start();
    			});

    			current = true;
    		},
    		o(local) {
    			transition_out(deleteicon.$$.fragment, local);
    			if (li_intro) li_intro.invalidate();
    			li_outro = create_out_transition(li, slide, { duration: 300 });
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			destroy_component(deleteicon);
    			if (detaching && li_outro) li_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function focus(node) {
    	if (!node.id) node.focus();
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { checked } = $$props;
    	let { value } = $$props;
    	let { item } = $$props;
    	let { removeEmptyItem } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input0_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	function input1_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	const clickEscape_function = () => {
    		removeEmptyItem();
    	};

    	$$self.$$set = $$props => {
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('item' in $$props) $$invalidate(2, item = $$props.item);
    		if ('removeEmptyItem' in $$props) $$invalidate(3, removeEmptyItem = $$props.removeEmptyItem);
    	};

    	return [
    		checked,
    		value,
    		item,
    		removeEmptyItem,
    		click_handler,
    		change_handler,
    		input0_change_handler,
    		input1_input_handler,
    		clickEscape_function
    	];
    }

    class ListItem extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			checked: 0,
    			value: 1,
    			item: 2,
    			removeEmptyItem: 3
    		});
    	}
    }

    function clickOutside(node, callBackFunction) {
      
      const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
          callBackFunction();
        }
      };
      
    	document.addEventListener('click', handleClick, true);
      
      return {
        destroy() {
          document.removeEventListener('click', handleClick, true);
        }
    	}
    }

    /* src/icons/plusIcon/PlusIcon.svelte generated by Svelte v3.47.0 */

    function create_fragment$1(ctx) {
    	let svg;
    	let g0;
    	let g1;
    	let path;

    	return {
    		c() {
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			path = svg_element("path");
    			attr(g0, "id", "info");
    			attr(path, "fill", /*fill*/ ctx[0]);
    			attr(path, "d", "M12,1C5.9,1,1,5.9,1,12s4.9,11,11,11s11-4.9,11-11S18.1,1,12,1z M17,14h-3v3c0,1.1-0.9,2-2,2s-2-0.9-2-2v-3H7   c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2h3V7c0-1.1,0.9-2,2-2s2,0.9,2,2v3h3c1.1,0,2,0.9,2,2C19,13.1,18.1,14,17,14z");
    			attr(path, "id", "add");
    			attr(g1, "id", "icons");
    			attr(svg, "width", /*width*/ ctx[1]);
    			attr(svg, "height", /*height*/ ctx[2]);
    			set_style(svg, "enable-background", "new 0 0 24 24");
    			attr(svg, "version", "1.1");
    			attr(svg, "viewBox", "0 0 24 24");
    			attr(svg, "xml:space", "preserve");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, g0);
    			append(svg, g1);
    			append(g1, path);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*fill*/ 1) {
    				attr(path, "fill", /*fill*/ ctx[0]);
    			}

    			if (dirty & /*width*/ 2) {
    				attr(svg, "width", /*width*/ ctx[1]);
    			}

    			if (dirty & /*height*/ 4) {
    				attr(svg, "height", /*height*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { fill = "#0b700e;" } = $$props;
    	let { width = "40px" } = $$props;
    	let { height = "40px" } = $$props;

    	$$self.$$set = $$props => {
    		if ('fill' in $$props) $$invalidate(0, fill = $$props.fill);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	return [fill, width, height];
    }

    class PlusIcon extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { fill: 0, width: 1, height: 2 });
    	}
    }

    /* src/App.svelte generated by Svelte v3.47.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[14] = list;
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (81:4) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let current;
    	let each_value = /*shoppingList*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(ul, "class", "pl-2 flex flex-col mt-5");
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*handleSubmit, removeEmptyItem, shoppingList, updateList, removeItem*/ 61) {
    				each_value = /*shoppingList*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (73:4) {#if shoppingList.length === 0}
    function create_if_block(ctx) {
    	let p;
    	let p_intro;
    	let p_outro;
    	let current;

    	return {
    		c() {
    			p = element("p");
    			p.textContent = "Your shopping list is empty!";
    			attr(p, "class", "text-center p-4");
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (p_outro) p_outro.end(1);
    				p_intro = create_in_transition(p, fade, { delay: 300 });
    				p_intro.start();
    			});

    			current = true;
    		},
    		o(local) {
    			if (p_intro) p_intro.invalidate();
    			p_outro = create_out_transition(p, fade, { duration: 50 });
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    			if (detaching && p_outro) p_outro.end();
    		}
    	};
    }

    // (83:8) {#each shoppingList as item, index}
    function create_each_block(ctx) {
    	let form;
    	let listitem;
    	let updating_value;
    	let updating_checked;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function listitem_value_binding(value) {
    		/*listitem_value_binding*/ ctx[7](value, /*item*/ ctx[13]);
    	}

    	function listitem_checked_binding(value) {
    		/*listitem_checked_binding*/ ctx[8](value, /*item*/ ctx[13]);
    	}

    	function change_handler() {
    		return /*change_handler*/ ctx[9](/*index*/ ctx[15]);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*index*/ ctx[15]);
    	}

    	let listitem_props = {
    		removeEmptyItem: /*removeEmptyItem*/ ctx[5],
    		item: /*item*/ ctx[13]
    	};

    	if (/*item*/ ctx[13].name !== void 0) {
    		listitem_props.value = /*item*/ ctx[13].name;
    	}

    	if (/*item*/ ctx[13].bought !== void 0) {
    		listitem_props.checked = /*item*/ ctx[13].bought;
    	}

    	listitem = new ListItem({ props: listitem_props });
    	binding_callbacks.push(() => bind(listitem, 'value', listitem_value_binding));
    	binding_callbacks.push(() => bind(listitem, 'checked', listitem_checked_binding));
    	listitem.$on("change", change_handler);
    	listitem.$on("click", click_handler);

    	return {
    		c() {
    			form = element("form");
    			create_component(listitem.$$.fragment);
    			t = space();
    		},
    		m(target, anchor) {
    			insert(target, form, anchor);
    			mount_component(listitem, form, null);
    			append(form, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen(form, "submit", prevent_default(/*handleSubmit*/ ctx[2]));
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listitem_changes = {};
    			if (dirty & /*shoppingList*/ 1) listitem_changes.item = /*item*/ ctx[13];

    			if (!updating_value && dirty & /*shoppingList*/ 1) {
    				updating_value = true;
    				listitem_changes.value = /*item*/ ctx[13].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_checked && dirty & /*shoppingList*/ 1) {
    				updating_checked = true;
    				listitem_changes.checked = /*item*/ ctx[13].bought;
    				add_flush_callback(() => updating_checked = false);
    			}

    			listitem.$set(listitem_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(listitem.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form);
    			destroy_component(listitem);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	let main;
    	let svg;
    	let path;
    	let t0;
    	let div;
    	let h1;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let t3;
    	let button;
    	let span;
    	let t5;
    	let plusicon;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*shoppingList*/ ctx[0].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	plusicon = new PlusIcon({});

    	return {
    		c() {
    			main = element("main");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Shopping List";
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			button = element("button");
    			span = element("span");
    			span.textContent = "Add new item";
    			t5 = space();
    			create_component(plusicon.$$.fragment);
    			attr(path, "fill", "#FF0066");
    			attr(path, "d", "M43.8,-53.7C56.1,-41.8,65,-27.4,69.7,-10.8C74.3,5.7,74.7,24.5,66.2,37.2C57.7,49.9,40.3,56.4,25.6,55.1C10.9,53.8,-1,44.8,-15.2,40.3C-29.5,35.8,-46,35.9,-52,28.5C-58,21.2,-53.5,6.3,-47.9,-5.4C-42.2,-17.1,-35.4,-25.6,-27.3,-38.2C-19.1,-50.8,-9.5,-67.4,3.1,-71.1C15.7,-74.8,31.4,-65.5,43.8,-53.7Z");
    			attr(path, "transform", "translate(100 100)");
    			attr(svg, "class", "blob");
    			attr(svg, "viewBox", "0 0 200 200");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(h1, "class", "antialiased mt-0 mb-4 text-berry text-center uppercase text-3xl md:text-6xl");
    			attr(button, "class", "add-button p-2.5 flex items-center self-center space-x-2 cursor-pointer text-berry fill-berry m-0 border-none bg-transparent hover:fill-berry-dark hover:text-berry-dark hover:bg-transparent");
    			attr(button, "type", "button");
    			button.disabled = button_disabled_value = !!/*shoppingList*/ ctx[0].find(func);
    			attr(div, "class", "list bg-white md:max-w-fit border-none rounded-xl shadow-lg shadow-berry px-14 pt-14 pb-10 flex flex-col my-0 mx-auto");
    			attr(main, "class", "h-screen relative");
    		},
    		m(target, anchor) {
    			insert(target, main, anchor);
    			append(main, svg);
    			append(svg, path);
    			append(main, t0);
    			append(main, div);
    			append(div, h1);
    			append(div, t2);
    			if_blocks[current_block_type_index].m(div, null);
    			append(div, t3);
    			append(div, button);
    			append(button, span);
    			append(button, t5);
    			mount_component(plusicon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(clickOutside.call(null, button, /*clickOutside_function*/ ctx[11])),
    					listen(button, "click", /*addToList*/ ctx[1])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t3);
    			}

    			if (!current || dirty & /*shoppingList*/ 1 && button_disabled_value !== (button_disabled_value = !!/*shoppingList*/ ctx[0].find(func))) {
    				button.disabled = button_disabled_value;
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(plusicon.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			transition_out(plusicon.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(main);
    			if_blocks[current_block_type_index].d();
    			destroy_component(plusicon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    const func = item => !item.name;

    function instance($$self, $$props, $$invalidate) {
    	let { newItem = "" } = $$props;

    	let { shoppingList = [
    		{ name: "Chocolate", bought: false },
    		{ name: "Quinoa", bought: false },
    		{ name: "Watermelon", bought: false }
    	] } = $$props;

    	// Actions
    	function addToList() {
    		$$invalidate(0, shoppingList = shoppingList.concat({ name: newItem, bought: false }));
    	}

    	function sortItems() {
    		const toBuyItems = shoppingList.filter(item => !item.bought).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    		const boughtItems = shoppingList.filter(item => item.bought);
    		$$invalidate(0, shoppingList = [...toBuyItems, ...boughtItems]);
    	}

    	function handleSubmit(event) {
    		const emptyItem = shoppingList.findIndex(item => !item.name);

    		if (emptyItem !== -1) {
    			event.preventDefault();
    		} else {
    			sortItems();
    			addToList();
    		}
    	}

    	function updateList(index) {
    		const newList = [...shoppingList];
    		const changedElement = newList.splice(index, 1)[0];
    		newList.splice(0, 0, changedElement);
    		$$invalidate(0, shoppingList = newList);
    		sortItems();
    	}

    	function removeItem(index) {
    		const newList = [...shoppingList];
    		newList.splice(index, 1);
    		$$invalidate(0, shoppingList = newList);
    	}

    	function removeEmptyItem() {
    		const element = document.activeElement.tagName.toLowerCase();
    		const emptyItem = shoppingList.findIndex(item => !item.name);

    		if (emptyItem !== -1 && element !== "input") {
    			removeItem(emptyItem);
    		}
    	}

    	function listitem_value_binding(value, item) {
    		if ($$self.$$.not_equal(item.name, value)) {
    			item.name = value;
    			$$invalidate(0, shoppingList);
    		}
    	}

    	function listitem_checked_binding(value, item) {
    		if ($$self.$$.not_equal(item.bought, value)) {
    			item.bought = value;
    			$$invalidate(0, shoppingList);
    		}
    	}

    	const change_handler = index => updateList(index);
    	const click_handler = index => removeItem(index);

    	const clickOutside_function = () => {
    		removeEmptyItem();
    	};

    	$$self.$$set = $$props => {
    		if ('newItem' in $$props) $$invalidate(6, newItem = $$props.newItem);
    		if ('shoppingList' in $$props) $$invalidate(0, shoppingList = $$props.shoppingList);
    	};

    	return [
    		shoppingList,
    		addToList,
    		handleSubmit,
    		updateList,
    		removeItem,
    		removeEmptyItem,
    		newItem,
    		listitem_value_binding,
    		listitem_checked_binding,
    		change_handler,
    		click_handler,
    		clickOutside_function
    	];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { newItem: 6, shoppingList: 0 });
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
