// ============================================================
// Second Life Avatar Remote Control - Full UI
// Hosted on GitHub Pages, loaded by the SL HUD via <script>
// Same-origin trick: page is served FROM the HUD URL,
// so all POST requests go to same origin = no CORS!
// ============================================================
(function () {
    var HUD_URL = location.href;
    var T = window.T || '';

    // ── Styles ──────────────────────────────────────────────
    var css = document.createElement('style');
    css.textContent = [
        '* { box-sizing: border-box; margin: 0; padding: 0; }',
        'body { background: #111; color: #fff; font-family: Arial, sans-serif; font-size: 26px; }',
        '#statusbar { background: #0a0a15; padding: 10px 16px; font-size: 22px; min-height: 46px;',
        '  border-bottom: 2px solid #333; word-break: break-all; }',
        '.tabs { display: flex; flex-wrap: wrap; background: #1a1a2e; border-bottom: 2px solid #333; }',
        '.tab { padding: 12px 16px; cursor: pointer; font-size: 22px;',
        '  border-right: 1px solid #333; user-select: none; }',
        '.tab.active { background: #0066cc; font-weight: bold; }',
        '.panel { display: none; padding: 14px; }',
        '.panel.active { display: block; }',
        'button { padding: 16px 12px; border: 0; color: #fff; font: bold 24px Arial;',
        '  cursor: pointer; margin: 4px; border-radius: 5px; }',
        '.bb { background: #1a4a8a; } .br { background: #c02040; }',
        '.bg { background: #00796b; } .bo { background: #b05800; }',
        '.bv { background: #5a1a8a; }',
        '.grid3 { display: grid; grid-template-columns: repeat(3, 1fr);',
        '  gap: 6px; max-width: 420px; }',
        '.grid3 button { padding: 18px 8px; font-size: 26px; }',
        '.row { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }',
        'label { font-size: 22px; color: #aaa; display: block; margin-top: 12px; }',
        'input, select { width: 100%; background: #222; color: #fff; border: 2px solid #555;',
        '  padding: 12px; font-size: 24px; margin: 6px 0; border-radius: 4px; }',
        '.hint { color: #777; font-size: 20px; margin-top: 8px; line-height: 1.4; }',
        '.sep { border-top: 1px solid #333; margin: 14px 0; }',
    ].join('\n');
    document.head.appendChild(css);

    // ── HTML Structure ────────────────────────────────────────
    document.body.innerHTML =
        '<div id="statusbar">Verbinde mit HUD...</div>' +
        '<div class="tabs">' +
            '<div class="tab active" data-tab="move">Bewegen</div>' +
            '<div class="tab" data-tab="sit">Sitzen</div>' +
            '<div class="tab" data-tab="outfit">Outfit</div>' +
            '<div class="tab" data-tab="anim">Anim</div>' +
            '<div class="tab" data-tab="chat">Chat</div>' +
            '<div class="tab" data-tab="tp">Teleport</div>' +
            '<div class="tab" data-tab="rlv">RLV</div>' +
        '</div>' +

        // ── BEWEGEN ──
        '<div id="p-move" class="panel active">' +
            '<div class="grid3">' +
                '<span></span>' +
                '<button class="bb" id="btn-fwd">▲ VOR</button>' +
                '<span></span>' +
                '<button class="bb" id="btn-left">◄ LI</button>' +
                '<button class="br" id="btn-stop">■ STOP</button>' +
                '<button class="bb" id="btn-right">RE ►</button>' +
                '<span></span>' +
                '<button class="bb" id="btn-back">▼ BACK</button>' +
                '<span></span>' +
            '</div>' +
            '<div class="row" style="margin-top:10px">' +
                '<button class="bb" id="btn-up">▲ HOCH</button>' +
                '<button class="bb" id="btn-down">▼ RUNTER</button>' +
            '</div>' +
            '<p class="hint">Tasten: W/A/S/D = Bewegen &nbsp; E/Q = Hoch/Runter &nbsp; Leertaste = Stop</p>' +
        '</div>' +

        // ── SITZEN ──
        '<div id="p-sit" class="panel">' +
            '<label>Objekt-UUID zum Hinsetzen:</label>' +
            '<input id="sit-uuid" placeholder="00000000-0000-0000-0000-000000000000">' +
            '<div class="row">' +
                '<button class="bg" id="btn-sit">Hinsetzen</button>' +
                '<button class="br" id="btn-unsit">Aufstehen</button>' +
            '</div>' +
            '<p class="hint">UUID des Objekts eingeben und auf Hinsetzen drücken.<br>Aufstehen funktioniert immer (auch ohne UUID).</p>' +
        '</div>' +

        // ── OUTFIT ──
        '<div id="p-outfit" class="panel">' +
            '<label>Inventory-Ordner-Name:</label>' +
            '<input id="outfit-folder" placeholder="z.B. My Outfits/Dress01">' +
            '<div class="row">' +
                '<button class="bg" id="btn-wear">Anziehen</button>' +
                '<button class="bo" id="btn-attach">Hinzufügen</button>' +
                '<button class="br" id="btn-detach">Ausziehen</button>' +
                '<button class="br" id="btn-removeall">Alles Ausziehen</button>' +
            '</div>' +
            '<div class="sep"></div>' +
            '<label>Einzelnes Item (Name oder UUID):</label>' +
            '<input id="outfit-item" placeholder="Item-Name oder UUID">' +
            '<div class="row">' +
                '<button class="bg" id="btn-wearitem">Item Anlegen</button>' +
                '<button class="br" id="btn-detachitem">Item Ablegen</button>' +
            '</div>' +
            '<p class="hint">Benötigt RLVa im Viewer. Ordnerpfade relativ zu #RLV.</p>' +
        '</div>' +

        // ── ANIMATION ──
        '<div id="p-anim" class="panel">' +
            '<label>Animation (Name aus Inventory):</label>' +
            '<input id="anim-name" placeholder="z.B. sexy_walk oder Animation-UUID">' +
            '<div class="row">' +
                '<button class="bg" id="btn-anim-start">▶ Abspielen</button>' +
                '<button class="br" id="btn-anim-stop">■ Stoppen</button>' +
            '</div>' +
            '<p class="hint">Animation muss im HUD-Objekt oder im Avatar-Inventory liegen.</p>' +
        '</div>' +

        // ── CHAT ──
        '<div id="p-chat" class="panel">' +
            '<label>Nachricht:</label>' +
            '<input id="chat-msg" placeholder="Nachricht eingeben...">' +
            '<label>Kanal:</label>' +
            '<input id="chat-ch" type="number" value="0" placeholder="0 = öffentlich">' +
            '<div class="row">' +
                '<button class="bg" id="btn-say">Say (Chat)</button>' +
                '<button class="bb" id="btn-shout">Shout</button>' +
                '<button class="bo" id="btn-whisper">Whisper</button>' +
            '</div>' +
            '<p class="hint">Kanal 0 = öffentlicher Chat. Negative Kanäle für Scripts.</p>' +
        '</div>' +

        // ── TELEPORT ──
        '<div id="p-tp" class="panel">' +
            '<label>Region:</label>' +
            '<input id="tp-region" placeholder="z.B. Ahern">' +
            '<label>Position (X / Y / Z):</label>' +
            '<div class="row">' +
                '<input id="tp-x" type="number" value="128" placeholder="X" style="width:30%">' +
                '<input id="tp-y" type="number" value="128" placeholder="Y" style="width:30%">' +
                '<input id="tp-z" type="number" value="25" placeholder="Z" style="width:30%">' +
            '</div>' +
            '<div class="row">' +
                '<button class="bg" id="btn-tp">Teleportieren</button>' +
            '</div>' +
            '<p class="hint">Benötigt RLVa. Avatar wird sofort teleportiert.</p>' +
        '</div>' +

        // ── RLV ──
        '<div id="p-rlv" class="panel">' +
            '<label>Direkter RLV Befehl:</label>' +
            '<input id="rlv-cmd" placeholder="z.B. @detach=force">' +
            '<div class="row">' +
                '<button class="bo" id="btn-rlv-send">Ausführen</button>' +
            '</div>' +
            '<div class="sep"></div>' +
            '<label>Schnellbefehle:</label>' +
            '<div class="row">' +
                '<button class="bo" id="btn-rlv-detach">@detach=force</button>' +
                '<button class="bo" id="btn-rlv-attach">@attach=force</button>' +
                '<button class="bv" id="btn-rlv-lock">@detach=n</button>' +
                '<button class="bv" id="btn-rlv-unlock">@detach=y</button>' +
            '</div>' +
            '<p class="hint">Befehle ohne @ eintippen. Beispiele:<br>' +
                'detach=force • sit:UUID=force • unsit=force<br>' +
                'addoutfit:Folder=force • remoutfit:Folder=force</p>' +
        '</div>';

    // ── Tab-Logik ─────────────────────────────────────────────
    document.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            var name = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(function (t) {
                t.classList.toggle('active', t.getAttribute('data-tab') === name);
            });
            document.querySelectorAll('.panel').forEach(function (p) {
                p.classList.toggle('active', p.id === 'p-' + name);
            });
        });
    });

    // ── API ───────────────────────────────────────────────────
    function setStatus(msg, isErr) {
        var sb = document.getElementById('statusbar');
        sb.textContent = msg;
        sb.style.color = isErr ? '#ff6060' : '#ffffff';
    }

    function api(action, data, cb) {
        data.action = action;
        data.token  = T;
        var x = new XMLHttpRequest();
        x.open('POST', HUD_URL, true);
        x.setRequestHeader('Content-Type', 'text/plain');
        x.timeout = 8000;
        x.onload = function () {
            try {
                var j = JSON.parse(x.responseText);
                if (j.status === 'ok') {
                    setStatus('✓  ' + action, false);
                    if (cb && j.data) cb(j.data);
                } else {
                    setStatus('✗  ' + (j.message || action + ' fehlgeschlagen'), true);
                }
            } catch (e) {
                setStatus('Parse-Fehler', true);
            }
        };
        x.onerror   = function () { setStatus('Verbindungsfehler – HUD erreichbar?', true); };
        x.ontimeout = function () { setStatus('Timeout (8s) – HUD zu langsam?', true); };
        x.send(JSON.stringify(data));
    }

    // ── Bewegung ──────────────────────────────────────────────
    function move(dir) { api('move', { direction: dir }); }

    bind('btn-fwd',   function () { move('forward'); });
    bind('btn-back',  function () { move('back');    });
    bind('btn-left',  function () { move('left');    });
    bind('btn-right', function () { move('right');   });
    bind('btn-stop',  function () { move('stop');    });
    bind('btn-up',    function () { move('up');      });
    bind('btn-down',  function () { move('down');    });

    // ── Sitzen ────────────────────────────────────────────────
    bind('btn-sit',   function () {
        var uuid = val('sit-uuid');
        if (uuid) api('sit', { target: uuid });
        else setStatus('Bitte UUID eingeben', true);
    });
    bind('btn-unsit', function () { api('unsit', {}); });

    // ── Outfit ────────────────────────────────────────────────
    bind('btn-wear',      function () { api('outfit', { outfit_action: 'wear',      folder: val('outfit-folder') }); });
    bind('btn-attach',    function () { api('outfit', { outfit_action: 'attach',    folder: val('outfit-folder') }); });
    bind('btn-detach',    function () { api('outfit', { outfit_action: 'remove',    folder: val('outfit-folder') }); });
    bind('btn-removeall', function () { api('outfit', { outfit_action: 'removeall', folder: '' }); });
    bind('btn-wearitem',  function () { api('outfit', { outfit_action: 'wearitem',  folder: val('outfit-item')   }); });
    bind('btn-detachitem',function () { api('outfit', { outfit_action: 'detachitem',folder: val('outfit-item')   }); });

    // ── Animation ─────────────────────────────────────────────
    bind('btn-anim-start', function () { api('animation', { name: val('anim-name'), anim_action: 'start' }); });
    bind('btn-anim-stop',  function () { api('animation', { name: val('anim-name'), anim_action: 'stop'  }); });

    // ── Chat ──────────────────────────────────────────────────
    bind('btn-say',     function () { doChat(0);  });
    bind('btn-shout',   function () { doChat(1);  });
    bind('btn-whisper', function () { doChat(2);  });

    function doChat(mode) {
        var msg = val('chat-msg');
        var ch  = parseInt(val('chat-ch')) || 0;
        if (!msg) { setStatus('Bitte Nachricht eingeben', true); return; }
        api('chat', { message: msg, channel: ch, mode: mode });
    }

    // ── Teleport ──────────────────────────────────────────────
    bind('btn-tp', function () {
        var region = val('tp-region');
        var x = val('tp-x') || '128';
        var y = val('tp-y') || '128';
        var z = val('tp-z') || '25';
        if (!region) { setStatus('Bitte Region eingeben', true); return; }
        api('teleport', { region: region, position: '<' + x + ',' + y + ',' + z + '>' });
    });

    // ── RLV ───────────────────────────────────────────────────
    bind('btn-rlv-send',   function () { sendRLV(val('rlv-cmd')); });
    bind('btn-rlv-detach', function () { sendRLV('detach=force'); });
    bind('btn-rlv-attach', function () { sendRLV('attach=force'); });
    bind('btn-rlv-lock',   function () { sendRLV('detach=n'); });
    bind('btn-rlv-unlock', function () { sendRLV('detach=y'); });

    function sendRLV(cmd) {
        if (!cmd) { setStatus('Bitte RLV-Befehl eingeben', true); return; }
        api('rlv_raw', { command: cmd });
    }

    // ── Status-Update ─────────────────────────────────────────
    function updateStatus() {
        api('status', {}, function (d) {
            if (d && typeof d === 'object') {
                var pos = d.pos ? (' [' + d.pos.x + '/' + d.pos.y + '/' + d.pos.z + ']') : '';
                setStatus((d.name || '?') + '  ·  ' + (d.region || '?') + pos + (d.rlv ? '  ·  RLV ✓' : '  ·  RLV ✗'), false);
            }
        });
    }

    // ── Tastatur ──────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        var map = { w: 'forward', s: 'back', a: 'left', d: 'right', e: 'up', q: 'down', ' ': 'stop' };
        if (map[e.key] !== undefined) {
            move(map[e.key]);
            e.preventDefault();
        }
    });

    // Enter in Chat-Feld
    var chatMsg = document.getElementById('chat-msg');
    if (chatMsg) {
        chatMsg.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                doChat(0);
                e.preventDefault();
            }
        });
    }

    // ── Hilfsfunktionen ───────────────────────────────────────
    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function bind(id, fn) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
    }

    // Start
    updateStatus();
    setInterval(updateStatus, 15000);

})();
