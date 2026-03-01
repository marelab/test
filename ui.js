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
        '.tex-chip { display:inline-flex; align-items:center; background:#1a1a2e; border:1px solid #444;',
        '  border-radius:20px; padding:6px 14px; margin:4px; cursor:pointer; font-size:20px; gap:8px; }',
        '.tex-chip:hover { background:#223366; }',
        '.tex-chip img { width:36px; height:36px; object-fit:cover; border-radius:4px; }',
        '.tex-chip .del { color:#c04040; margin-left:6px; font-size:18px; }',
        '.outfit-gallery { display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; }',
        '.outfit-card { display:flex; flex-direction:column; align-items:center; background:#1a1a2e;',
        '  border:2px solid #333; border-radius:8px; padding:8px; cursor:pointer; width:130px;',
        '  font-size:18px; text-align:center; gap:6px; transition:border-color 0.15s; }',
        '.outfit-card:hover { border-color:#0066cc; background:#1a2a4a; }',
        '.outfit-card.wearing { border-color:#00aa44; background:#0a2a14; }',
        '.outfit-card img { width:110px; height:110px; object-fit:cover; border-radius:5px; background:#252535; }',
        '.outfit-card .oname { word-break:break-word; line-height:1.2; max-width:120px; }',
        '.outfit-card .norlv { color:#cc6644; font-size:16px; }',
        '.naked-btn { background:#7a1a5a; color:#fff; font-size:15px; padding:5px 6px;',
        '  width:100%; border:0; border-radius:4px; margin-top:4px; cursor:pointer; }',
        '.naked-btn:hover { background:#aa2880; }',
        '.editu-btn { background:#1a4060; color:#fff; font-size:15px; padding:5px 6px;',
        '  width:100%; border:0; border-radius:4px; margin-top:2px; cursor:pointer; }',
        '.editu-btn:hover { background:#2a6090; }',
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
        '<div class="tab" data-tab="tex">Texturen</div>' +
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

            // ── OUTFIT GALERIE ──
            '<div class="sep"></div>' +
            '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:4px">' +
                '<span style="font-size:24px;font-weight:bold">📦 Outfit Galerie</span>' +
                '<button class="bb" id="btn-outfit-scan" style="font-size:18px;padding:7px 14px">🔄 Scannen</button>' +
                '<span id="outfit-gallery-count" style="color:#666;font-size:18px"></span>' +
            '</div>' +
            '<div id="outfit-gallery-info" style="background:#131a25;border:1px solid #334;border-radius:5px;' +
                'padding:8px 12px;font-size:18px;color:#8899bb;margin-bottom:8px;line-height:1.5">' +
                '🔍 <b>Mit RLV:</b> Scannt <b>#RLV/Outfits</b> (via @getinv) + HUD-Content-Texturen.<br>' +
                '🔄 <b>Fallback:</b> Findet @getinv nichts, werden HUD-Texturen angezeigt.<br>' +
                '🖼️ <b>Vorschaubilder:</b> Textur mit Ordnernamen in HUD-Content legen<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;(z.B. Textur namens <i>CasualDress</i> oder <i>Outfits/CasualDress</i>).<br>' +
                '👙 <b>Naked-Button:</b> Notecard <b>naked</b> in HUD-Content legen.<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;Format: <i>[OutfitName]</i> als Header, darunter RLV-Befehle.<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;<i>[*]</i> = Standard-Fallback für alle anderen Outfits.<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;Ohne Notecard / kein Eintrag → Standard (alles ausziehen).<br>' +
                '⚙️ <b>Anderen Pfad:</b> <code>OUTFITS_PATH</code> im LSL-Script anpassen.' +
            '</div>' +
            '<div id="outfit-gallery" class="outfit-gallery">' +
                '<span style="color:#555;font-size:20px">Klicke Scannen zum Laden...</span>' +
            '</div>' +
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
        '</div>' +

        // ── TEXTUREN ──
        '<div id="p-tex" class="panel">' +
            '<label>Textur-UUID:</label>' +
            '<input id="tex-uuid" placeholder="00000000-0000-0000-0000-000000000000">' +
            '<div class="row">' +
                '<button class="bb" id="btn-tex-preview">🔍 Vorschau laden</button>' +
                '<button class="bg" id="btn-tex-setprim">Auf Prim setzen</button>' +
                '<button class="bo" id="btn-tex-copy">UUID kopieren</button>' +
            '</div>' +

            // Größen-Auswahl
            '<div class="row" style="margin-top:6px">' +
                '<button class="bb" id="btn-tex-s100" style="font-size:18px;padding:8px">100×100</button>' +
                '<button class="bb" id="btn-tex-s256" style="font-size:18px;padding:8px">256×192</button>' +
                '<button class="bb active-size" id="btn-tex-s320" style="font-size:18px;padding:8px;background:#005599">320×240 ★</button>' +
                '<button class="bb" id="btn-tex-s512" style="font-size:18px;padding:8px">512×512</button>' +
            '</div>' +

            // Vorschau-Bereich
            '<div id="tex-box" style="margin-top:10px;min-height:200px;background:#1a1a1a;border:2px solid #444;' +
                'border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative">' +
                '<span id="tex-placeholder" style="color:#555;font-size:22px;padding:20px;text-align:center">' +
                    'UUID eingeben → Vorschau laden' +
                '</span>' +
                '<img id="tex-img" style="display:none;max-width:100%;max-height:340px;object-fit:contain">' +
            '</div>' +

            // Status-Zeile + URL
            '<div id="tex-status" style="margin-top:8px;font-size:20px;color:#aaa;min-height:24px"></div>' +
            '<div id="tex-url" style="font-size:17px;color:#555;word-break:break-all;margin-top:4px"></div>' +

            '<div class="sep"></div>' +

            // Gespeicherte Texturen
            '<label>Gespeicherte Texturen:</label>' +
            '<div id="tex-saved" class="row" style="flex-wrap:wrap">' +
                '<span style="color:#555;font-size:20px">Noch keine gespeichert – lade eine Vorschau und klicke Speichern.</span>' +
            '</div>' +
            '<div class="row">' +
                '<input id="tex-label" placeholder="Name für diese Textur" style="width:60%;margin-right:6px">' +
                '<button class="bg" id="btn-tex-save" style="width:calc(40% - 10px)">💾 Speichern</button>' +
            '</div>' +

            '<div class="sep"></div>' +
            '<div style="background:#1a1510;border:1px solid #554422;border-radius:5px;padding:10px;font-size:19px;color:#cc9944;line-height:1.6">' +
                '📡 <b>Quelle:</b> Linden Lab Picture Service (Akamai CDN)<br>' +
                'URL: <span style="color:#cc9944;font-size:17px">picture-service.secondlife.com/UUID/GRÖSSExGRÖSSE.jpg</span><br><br>' +
                '✅ <b>Funktioniert für:</b> Profilbilder, Snapshots, Texturen die als<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;öffentlich markiert wurden, Linden Standard-Texturen<br>' +
                '⚠️ <b>Thumbnail (klein):</b> Für die meisten Texturen erreichbar<br>' +
                '❌ <b>Nicht möglich:</b> Private Inventory-Texturen in voller Auflösung<br>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;(Linden Lab schützt diese bewusst gegen Piraterie)' +
            '</div>' +
        '</div>';

    // ── Tab-Logik ─────────────────────────────────────────────
    var outfitGalleryLoaded = false;

    document.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            var name = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(function (t) {
                t.classList.toggle('active', t.getAttribute('data-tab') === name);
            });
            document.querySelectorAll('.panel').forEach(function (p) {
                p.classList.toggle('active', p.id === 'p-' + name);
            });
            // Outfit-Galerie beim ersten Öffnen automatisch scannen
            if (name === 'outfit' && !outfitGalleryLoaded) {
                outfitGalleryLoaded = true;
                loadOutfitGallery();
            }
        });
    });

    // ── Reconnect-Overlay ─────────────────────────────────────
    // Wird angezeigt wenn die HUD-URL abgelaufen ist (cap not found).
    // Der Nutzer muss das Script resetten; danach lädt der Home-Button
    // die neue URL (PRIM_MEDIA_HOME_URL wurde vom LSL-Script aktualisiert).
    var reconnectShown = false;
    function showReconnect() {
        if (reconnectShown) return;
        reconnectShown = true;
        var ov = document.createElement('div');
        ov.id = 'reconnect-ov';
        ov.style.cssText = 'position:fixed;inset:0;background:#0d0010;z-index:9999;'
            + 'display:flex;flex-direction:column;align-items:center;justify-content:center;'
            + 'padding:24px;text-align:center;';
        ov.innerHTML =
            '<div style="font-size:52px;margin-bottom:16px">🔌</div>'
          + '<div style="font-size:28px;color:#ff6060;font-weight:bold;margin-bottom:14px">'
          +   'HUD-Verbindung unterbrochen</div>'
          + '<div style="font-size:20px;color:#ccc;line-height:1.7;margin-bottom:24px">'
          +   'Die URL des HUDs ist abgelaufen.<br>'
          +   'Bitte HUD-Script zurücksetzen:<br>'
          +   '<b style="color:#fff">Rechtsklick HUD → Edit → Scripts → Reset</b><br><br>'
          +   'Danach den <b style="color:#ffcc44">⌂ Home-Button</b> im Browser drücken<br>'
          +   'oder unten auf <b style="color:#6cf">Neu laden</b> tippen.</div>'
          + '<button id="btn-reconnect" style="padding:18px 36px;background:#0066cc;border:none;'
          +   'color:#fff;font-size:24px;border-radius:8px;cursor:pointer;margin-bottom:12px">'
          +   '🔄 Neu laden</button>'
          + '<div style="font-size:16px;color:#666;margin-top:8px">'
          +   'Neue URL steht im Hover-Text über dem HUD.</div>';
        document.body.appendChild(ov);
        document.getElementById('btn-reconnect').onclick = function () {
            location.reload();
        };
    }

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
            // 404 = cap not found (URL abgelaufen), 0 = keine Verbindung
            if (x.status === 404 || x.status === 0) {
                showReconnect();
                return;
            }
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
        x.onerror   = function () { showReconnect(); };
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

    // ── Outfit Galerie ────────────────────────────────────────

    var currentlyWearing = null; // merkt sich den zuletzt angezogenen Ordner
    var rlvAvailable = false;    // wird beim Status-Update gesetzt

    // Beim Status-Update RLV-Status mitladen
    var _origUpdateStatus = updateStatus;
    updateStatus = function () {
        api('status', {}, function (d) {
            if (d && typeof d === 'object') {
                rlvAvailable = !!d.rlv;
                var pos = d.pos ? (' [' + d.pos.x + '/' + d.pos.y + '/' + d.pos.z + ']') : '';
                setStatus((d.name || '?') + '  ·  ' + (d.region || '?') + pos +
                    (d.rlv ? '  ·  RLV ✓' : '  ·  RLV ✗'), false);
                // Galerie-Karten aktualisieren wenn sich RLV-Status ändert
                updateGalleryRLVState();
            }
        });
    };

    function updateGalleryRLVState() {
        document.querySelectorAll('.outfit-card').forEach(function (card) {
            var noRlvNote = card.querySelector('.norlv');
            if (noRlvNote) noRlvNote.style.display = rlvAvailable ? 'none' : 'block';
            card.style.opacity = rlvAvailable ? '1' : '0.55';
            card.title = rlvAvailable ? card.getAttribute('data-folder') : 'RLV nicht aktiv – Anziehen nicht möglich';
        });
    }

    function loadOutfitGallery() {
        var gallery = document.getElementById('outfit-gallery');
        var countEl = document.getElementById('outfit-gallery-count');
        if (gallery) gallery.innerHTML = '<span style="color:#aaaaff;font-size:20px">⏳ Scanne HUD-Inventory und RLV-Ordner...</span>';
        if (countEl) countEl.textContent = '';

        api('outfit_list', {}, function (outfits) {
            if (!gallery) return;

            if (!outfits || outfits.length === 0) {
                gallery.innerHTML =
                    '<div style="color:#777;font-size:20px;padding:10px;line-height:1.6">' +
                    '🗂️ Keine Outfit-Texturen im HUD gefunden.<br>' +
                    '<b>So einrichten:</b><br>' +
                    '1. Outfit-Vorschaubild (Textur) in Inventory suchen<br>' +
                    '2. In den <b>Content-Tab des HUD-Objekts</b> ziehen<br>' +
                    '3. Textur umbenennen → genau wie der #RLV-Unterordner<br>' +
                    '&nbsp;&nbsp;&nbsp;Beispiel: <i>Outfits/CasualDress</i><br>' +
                    '4. Nochmal Scannen klicken' +
                    '</div>';
                if (countEl) countEl.textContent = '(0 Outfits)';
                return;
            }

            if (countEl) countEl.textContent = '(' + outfits.length + ' Outfits)';

            gallery.innerHTML = outfits.map(function (o, i) {
                // path = voller #RLV-Pfad für @attachoverorreplace
                // name = Anzeigename (letzter Ordnerteil)
                // uuid = optional, wenn Textur im HUD-Content mit gleichem Namen
                var wearPath    = o.path || o.name; // Rückwärts-kompatibel
                var displayName = o.name || wearPath.split('/').pop();
                var hasThumb    = o.uuid && o.uuid.length > 10;
                var thumbUrl    = hasThumb
                    ? 'https://picture-service.secondlife.com/' + o.uuid + '/100x100.jpg'
                    : '';
                var isWearing   = (currentlyWearing === wearPath);

                var imgHtml = hasThumb
                    ? '<img src="' + thumbUrl + '" ' +
                      'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'" ' +
                      'alt="' + displayName + '">' +
                      '<div style="display:none;width:110px;height:110px;background:#252535;border-radius:5px;' +
                      'align-items:center;justify-content:center;font-size:36px">👗</div>'
                    : '<div style="display:flex;width:110px;height:110px;background:#252535;border-radius:5px;' +
                      'align-items:center;justify-content:center;font-size:36px">👗</div>';

                return '<div class="outfit-card' + (isWearing ? ' wearing' : '') + '" ' +
                    'data-folder="' + wearPath + '" data-name="' + displayName + '" title="' + wearPath + '">' +
                    imgHtml +
                    '<span class="oname">' + displayName + '</span>' +
                    (!hasThumb
                        ? '<span style="color:#555;font-size:14px">kein Bild</span>'
                        : '') +
                    '<button class="naked-btn" data-action="naked" title="Kleidung ausziehen (Naked-Notecard)">👙 Naked</button>' +
                    '<button class="editu-btn" data-action="editnaked" title="Naked-Konfiguration bearbeiten">✏️ Edit U</button>' +
                    '<span class="norlv" style="display:' + (rlvAvailable ? 'none' : 'block') + '">' +
                    '⚠️ kein RLV</span>' +
                    '</div>';
            }).join('');

            // Klick-Handler
            gallery.querySelectorAll('.outfit-card').forEach(function (card) {
                card.addEventListener('click', function (e) {
                    if (!rlvAvailable) {
                        setStatus('RLV nicht aktiv – Befehle nicht möglich', true);
                        return;
                    }

                    // ── Edit-U Button ─────────────────────────────
                    if (e.target && e.target.getAttribute('data-action') === 'editnaked') {
                        var efolder = card.getAttribute('data-folder');
                        var ename   = card.getAttribute('data-name') || efolder.split('/').pop();
                        openEditNakedDialog(efolder, ename);
                        return;
                    }

                    // ── Naked-Button ──────────────────────────────
                    if (e.target && e.target.getAttribute('data-action') === 'naked') {
                        var nakedFolder = card.getAttribute('data-folder');
                        var nakedName   = nakedFolder.split('/').pop();
                        setStatus('👙 Ziehe aus: ' + nakedName + '...', false);
                        api('outfit_naked', { folder: nakedFolder }, function () {
                            setStatus('✓ Naked: ' + nakedName, false);
                        });
                        return; // Outfit NICHT anziehen
                    }

                    // ── Outfit anziehen (Klick auf Karte) ─────────
                    var folder = card.getAttribute('data-folder');
                    gallery.querySelectorAll('.outfit-card.wearing').forEach(function (c) {
                        c.classList.remove('wearing');
                    });
                    card.classList.add('wearing');
                    currentlyWearing = folder;
                    setStatus('⏳ Ziehe an: ' + folder.split('/').pop(), false);
                    api('outfit_wearreplace', { folder: folder }, function () {
                        setStatus('✓ Outfit angezogen: ' + folder.split('/').pop(), false);
                    });
                });
            });
        });
    }

    bind('btn-outfit-scan', loadOutfitGallery);

    // ── Edit U — Naked-Dialog ──────────────────────────────────

    function makeNakedCheck(id, value, labelHtml) {
        return '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;' +
            'background:#111627;border:1px solid #334;border-radius:6px;' +
            'padding:9px 12px;font-size:18px;margin-bottom:5px;user-select:none">' +
            '<input type="checkbox" id="' + id + '" value="' + value + '" checked ' +
                'style="width:22px;height:22px;cursor:pointer;flex-shrink:0">' +
            labelHtml + '</label>';
    }

    function openEditNakedDialog(wearPath, displayName) {
        // Vorhandenen Dialog entfernen
        var old = document.getElementById('naked-edit-modal');
        if (old) old.remove();

        var overlay = document.createElement('div');
        overlay.id = 'naked-edit-modal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,0,0.80);z-index:1000;display:flex;' +
            'align-items:flex-start;justify-content:center;' +
            'padding:16px 10px;overflow-y:auto;box-sizing:border-box';

        var box = document.createElement('div');
        box.style.cssText = 'background:#1a1a2e;border:2px solid #0066cc;border-radius:10px;' +
            'padding:16px;width:100%;max-width:500px;box-sizing:border-box';

        // ── Statischer Inhalt (wird sofort gerendert) ──────────
        box.innerHTML =
            // Kopfzeile
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">' +
                '<div>' +
                    '<div style="font-size:22px;font-weight:bold;color:#66aaff">✏️ Naked konfigurieren</div>' +
                    '<div style="font-size:19px;color:#ccc;margin-top:3px">' + displayName + '</div>' +
                '</div>' +
                '<button id="modal-close-x" style="background:none;color:#aaa;font-size:28px;' +
                    'border:0;cursor:pointer;line-height:1;padding:0 4px">✕</button>' +
            '</div>' +

            // Erklärung
            '<div style="background:#0d1520;border:1px solid #334;border-radius:6px;' +
                'padding:10px 12px;font-size:17px;color:#8899bb;margin-bottom:12px;line-height:1.5">' +
                '✅ <b style="color:#aac">gecheckt = wird beim Naked-Button entfernt</b><br>' +
                '☐ &nbsp;unkecked = bleibt erhalten (kein Häkchen = in Notecard gespeichert)' +
            '</div>' +

            // Kleidungslagen
            '<div style="font-size:20px;font-weight:bold;margin-bottom:6px">🎽 Kleidungslagen</div>' +
            makeNakedCheck('chk-remoutfit', '@remoutfit=force',
                'Alle Kleidungslagen entfernen' +
                '<span style="color:#557;font-size:15px;margin-left:6px">(@remoutfit=force)</span>') +

            // Attachments
            '<div style="font-size:20px;font-weight:bold;margin:12px 0 6px">📦 Outfit-Attachments</div>' +
            makeNakedCheck('chk-detach-all', '@detach:' + wearPath + '/=force',
                'Alle Attachments im Ordner' +
                '<span style="color:#557;font-size:15px;margin-left:6px">(@detach:' + wearPath + '/)</span>') +
            // Unterordner (werden per API nachgeladen)
            '<div id="modal-sf-area">' +
                '<div id="modal-sf-loading" style="color:#6688aa;font-size:17px;padding:6px 0">' +
                    '⏳ Lade Unterordner aus #RLV...' +
                '</div>' +
            '</div>' +

            // Items-Liste (werden per @getinvworn nachgeladen)
            '<div style="font-size:20px;font-weight:bold;margin:14px 0 4px">📋 Outfit-Items</div>' +
            '<div style="background:#0a1018;border:1px solid #2a3448;border-radius:6px;' +
                'padding:7px 11px;font-size:15px;color:#7788aa;margin-bottom:8px;line-height:1.5">' +
                'Getragene Items sind vorausgewählt (✓ gecheckt = wird beim Naked entfernt).<br>' +
                'Haken entfernen = Item bleibt erhalten. Nicht getragene Items werden übersprungen.' +
            '</div>' +
            '<div id="modal-items-area">' +
                '<div id="modal-items-loading" style="color:#6688aa;font-size:17px;padding:6px 0">' +
                    '⏳ Lade Items aus #RLV (@getinvworn)...' +
                '</div>' +
            '</div>' +

            // Notecard-Vorlage (erst nach Speichern sichtbar)
            '<div id="modal-nc-section" style="display:none;margin-top:10px">' +
                '<div style="font-size:18px;font-weight:bold;color:#aaa;margin-bottom:4px">' +
                    '📋 Notecard-Vorlage <span style="color:#667;font-size:15px">(für permanente Speicherung)</span>' +
                '</div>' +
                '<textarea id="modal-nc-text" readonly style="width:100%;height:110px;' +
                    'background:#060c14;color:#7af;border:1px solid #336;border-radius:5px;' +
                    'font-size:15px;padding:8px;font-family:monospace;box-sizing:border-box;' +
                    'resize:vertical"></textarea>' +
                '<div style="font-size:15px;color:#556;margin-top:4px;line-height:1.4">' +
                    'Diesen Text in die Notecard <b>naked</b> im HUD-Content kopieren → permanente Speicherung.' +
                '</div>' +
            '</div>' +

            // Buttons
            '<div style="display:flex;gap:8px;margin-top:14px">' +
                '<button id="modal-save" style="flex:1;background:#006630;color:#fff;font-size:20px;' +
                    'padding:12px;border:0;border-radius:6px;cursor:pointer;font-weight:bold">' +
                    '💾 Speichern & Schließen</button>' +
                '<button id="modal-cancel" style="background:#552200;color:#fff;font-size:18px;' +
                    'padding:12px 18px;border:0;border-radius:6px;cursor:pointer">✕ Abbrechen</button>' +
            '</div>';

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // ── Schließen-Handler ──────────────────────────────────
        function closeDialog() { overlay.remove(); }
        document.getElementById('modal-close-x').addEventListener('click', closeDialog);
        document.getElementById('modal-cancel').addEventListener('click', closeDialog);
        overlay.addEventListener('click', function(e) { if (e.target === overlay) closeDialog(); });

        // ── Unterordner per API nachladen ──────────────────────
        // Timeout falls RLV nicht antwortet
        var sfTimeout = setTimeout(function () {
            var ld = document.getElementById('modal-sf-loading');
            if (ld) ld.innerHTML =
                '<span style="color:#664;font-size:17px">Keine Unterordner gefunden (Timeout).</span>';
        }, 9000);

        api('outfit_subfolder_list', { folder: wearPath }, function (subfolders) {
            clearTimeout(sfTimeout);
            var area = document.getElementById('modal-sf-area');
            if (!area) return;

            var html = '';
            if (subfolders && subfolders.length > 0) {
                subfolders.forEach(function (sf, idx) {
                    html += makeNakedCheck('chk-sf-' + idx,
                        '@detach:' + wearPath + '/' + sf + '/=force',
                        '&nbsp;&nbsp;└ ' + sf +
                        '<span style="color:#557;font-size:15px;margin-left:6px">' +
                            '(@detach:' + wearPath + '/' + sf + '/)</span>');
                });
            } else {
                html = '<div style="color:#666;font-size:17px;padding:4px 0">Keine Unterordner — ' +
                    'nur "Alle Attachments" wird verwendet.</div>';
            }
            area.innerHTML = html;
        });

        // ── Items per @getinvworn nachladen ────────────────────
        var itemsTimeout = setTimeout(function () {
            var ld = document.getElementById('modal-items-loading');
            if (ld) ld.innerHTML =
                '<span style="color:#664;font-size:17px">⚠ Timeout — @getinvworn nicht unterstützt oder Ordner leer.</span>';
        }, 9000);

        api('outfit_items_list', { folder: wearPath }, function (items) {
            clearTimeout(itemsTimeout);
            var area = document.getElementById('modal-items-area');
            if (!area) return;

            if (!items || items.length === 0) {
                area.innerHTML = '<div style="color:#666;font-size:17px;padding:4px 0">Keine Items im Ordner gefunden.</div>';
                return;
            }

            var html = '';
            items.forEach(function (item) {
                var worn   = (item.worn !== undefined) ? item.worn : 1;
                var isWorn = worn >= 1;
                // worn=2 (Attachment): per Pfad detachen
                // worn=1 (Kleidungslage): allgemeiner @remoutfit (Layer nicht bekannt)
                // worn=0: @detach trotzdem anbieten (Item im Ordner, aktuell nicht getragen)
                var rlvCmd = (worn === 1)
                    ? '@remoutfit=force'
                    : '@detach:' + item.path + '=force';
                var wornBadge = isWorn
                    ? '<span style="color:#44cc66;font-size:14px;flex-shrink:0">✓ getragen</span>'
                    : '<span style="color:#555;font-size:14px;flex-shrink:0">○ nicht getragen</span>';
                html +=
                    '<label style="display:block;cursor:pointer;background:#111627;border:1px solid #334;' +
                        'border-radius:6px;padding:8px 12px;font-size:17px;margin-bottom:4px;user-select:none">' +
                        '<div style="display:flex;align-items:center;gap:10px">' +
                            '<input type="checkbox" class="item-chk" value="' + rlvCmd + '"' +
                                (isWorn ? ' checked' : '') +
                                ' style="width:22px;height:22px;cursor:pointer;flex-shrink:0">' +
                            '<span style="flex:1;word-break:break-word">' + item.name + '</span>' +
                            wornBadge +
                        '</div>' +
                        '<div style="color:#446;font-size:13px;margin-left:32px;margin-top:2px;word-break:break-all">' +
                            item.path +
                        '</div>' +
                    '</label>';
            });
            area.innerHTML = html;
        });

        // ── Speichern ──────────────────────────────────────────
        document.getElementById('modal-save').addEventListener('click', function () {
            // Alle gechecked Checkboxen sammeln (dedupliziert — z.B. mehrere @remoutfit=force)
            var commands = [];
            var seen = {};
            box.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
                if (cb.checked && !seen[cb.value]) {
                    commands.push(cb.value);
                    seen[cb.value] = true;
                }
            });
            var cmdsPipe = commands.join('|');

            // Notecard-Vorlage generieren und anzeigen
            var ncText = '[' + displayName + ']\n';
            commands.forEach(function (c) { ncText += c + '\n'; });
            var ncSection = document.getElementById('modal-nc-section');
            var ncTextEl  = document.getElementById('modal-nc-text');
            if (ncSection) ncSection.style.display = 'block';
            if (ncTextEl)  { ncTextEl.value = ncText; ncTextEl.select(); }

            setStatus('💾 Speichere Naked-Konfiguration...', false);
            api('outfit_naked_update', { folder: wearPath, commands: cmdsPipe }, function (res) {
                var n = res && res.count !== undefined ? res.count : commands.length;
                setStatus('✓ Naked "' + displayName + '" gespeichert · ' + n + ' Befehle aktiv', false);
                // Dialog nach kurzer Pause schließen (damit Notecard-Text lesbar ist)
                setTimeout(function () { overlay.remove(); }, 2200);
            });
        });
    }

    // Galerie laden wenn Outfit-Tab geöffnet wird
    var _origTabLogic = null; // wird nach Tab-Logik-Init gesetzt

    // ── Texturen ──────────────────────────────────────────────

    // ── Offizieller SL Picture Service (Akamai CDN) ──
    // Quelle: https://wiki.secondlife.com/wiki/Picture_Service
    // Format: https://picture-service.secondlife.com/UUID/WIDTHxHEIGHT.jpg
    // Einschränkung: Thumbnails funktionieren für alle Texturen,
    //   höhere Auflösungen nur für Profilbilder / öffentlich markierte Snapshots.
    var TEX_CDN = [
        'https://picture-service.secondlife.com/{UUID}/320x240.jpg',
        'https://picture-service.secondlife.com/{UUID}/256x192.jpg',
        'https://picture-service.secondlife.com/{UUID}/100x100.jpg',
        'https://secondlife-thumbnails.s3.amazonaws.com/{UUID}.jpg'
    ];

    // Für "Auf Prim setzen" → höhere Auflösungen versuchen
    var TEX_CDN_LARGE = [
        'https://picture-service.secondlife.com/{UUID}/512x512.jpg',
        'https://picture-service.secondlife.com/{UUID}/320x240.jpg'
    ];

    // Gespeicherte Texturen (LocalStorage nicht verfügbar in SL-Browser → in-memory)
    var savedTextures = [];

    function texStatus(msg, color) {
        var el = document.getElementById('tex-status');
        if (el) { el.textContent = msg; el.style.color = color || '#aaa'; }
    }

    function tryTextureUrl(uuid, primaryUrl, fallbackIndex) {
        var img = document.getElementById('tex-img');
        var ph  = document.getElementById('tex-placeholder');
        var urlEl = document.getElementById('tex-url');

        function onSuccess(loadedUrl) {
            ph.style.display  = 'none';
            img.style.display = 'block';
            img.setAttribute('data-url', loadedUrl);
            var host = loadedUrl.replace('https://', '').split('/')[0];
            texStatus('✓ Geladen (' + currentTexSize + ') von ' + host, '#66dd66');
            if (urlEl) urlEl.textContent = loadedUrl;
        }

        function tryFallback() {
            if (fallbackIndex >= TEX_CDN.length) {
                img.style.display = 'none';
                ph.style.display  = 'block';
                ph.textContent    = '🚫 Nicht öffentlich zugänglich';
                texStatus('Textur nicht abrufbar – privat oder nicht im Picture Service vorhanden.', '#cc6644');
                if (urlEl) urlEl.textContent = 'Versucht: ' + primaryUrl;
                return;
            }
            var fallbackUrl = TEX_CDN[fallbackIndex].replace(/{UUID}/g, uuid);
            texStatus('Versuche Fallback ' + (fallbackIndex + 1) + '/' + TEX_CDN.length + '...', '#aaaaff');
            img.onload  = function () { onSuccess(fallbackUrl); };
            img.onerror = function () { tryFallback.call(null); fallbackIndex++; };
            // Neu setzen damit onerror neu triggert:
            img.src = '';
            setTimeout(function() { img.src = fallbackUrl; }, 10);
        }

        texStatus('Lade ' + currentTexSize + '...', '#aaaaff');
        if (urlEl) urlEl.textContent = primaryUrl;

        img.onload = function () { onSuccess(primaryUrl); };
        img.onerror = function () {
            // Primäre URL fehlgeschlagen → Fallbacks
            tryFallback();
        };
        img.src = primaryUrl;
    }

    // Legacy-Alias (falls noch verwendet)
    function tryLoadTexture(uuid, urlIndex) {
        var url = TEX_CDN[urlIndex].replace(/{UUID}/g, uuid);
        tryTextureUrl(uuid, url, urlIndex + 1);
    }

    // Aktive Größe (Standard: 320x240)
    var currentTexSize = '320x240';

    function setTexSize(size) {
        currentTexSize = size;
        ['100x100','256x192','320x240','512x512'].forEach(function (s) {
            var btn = document.getElementById('btn-tex-s' + s.split('x')[0]);
            if (btn) btn.style.background = (s === size) ? '#005599' : '#1a4a8a';
        });
    }

    bind('btn-tex-s100', function () { setTexSize('100x100');  reloadIfUUID(); });
    bind('btn-tex-s256', function () { setTexSize('256x192');  reloadIfUUID(); });
    bind('btn-tex-s320', function () { setTexSize('320x240');  reloadIfUUID(); });
    bind('btn-tex-s512', function () { setTexSize('512x512');  reloadIfUUID(); });

    function reloadIfUUID() {
        var uuid = val('tex-uuid');
        if (uuid && uuid.length > 10) {
            document.getElementById('btn-tex-preview').click();
        }
    }

    bind('btn-tex-preview', function () {
        var uuid = val('tex-uuid').trim();
        if (!uuid || uuid.length < 10) {
            texStatus('Bitte gültige UUID eingeben (Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)', '#ff6060');
            return;
        }
        // UUID bereinigen
        uuid = uuid.replace(/[^a-f0-9\-]/gi, '').toLowerCase();
        document.getElementById('tex-uuid').value = uuid;

        var img = document.getElementById('tex-img');
        var ph  = document.getElementById('tex-placeholder');
        img.style.display = 'none';
        img.src = '';
        ph.style.display  = 'block';
        ph.textContent    = '⏳ Lade Vorschau...';
        texStatus('');
        var urlEl = document.getElementById('tex-url');
        if (urlEl) urlEl.textContent = '';

        // Zuerst die gewählte Größe versuchen, dann Fallbacks
        var primaryUrl = 'https://picture-service.secondlife.com/' + uuid + '/' + currentTexSize + '.jpg';
        tryTextureUrl(uuid, primaryUrl, 0);
    });

    bind('btn-tex-setprim', function () {
        var uuid = val('tex-uuid');
        if (!uuid) { texStatus('Bitte UUID eingeben', '#ff6060'); return; }
        api('texture_set', { uuid: uuid, face: 0 }, function () {
            texStatus('✓ Textur auf Prim gesetzt!', '#66dd66');
        });
    });

    bind('btn-tex-copy', function () {
        var uuid = val('tex-uuid');
        if (!uuid) return;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(uuid).then(function () {
                texStatus('✓ UUID kopiert: ' + uuid, '#66dd66');
            });
        } else {
            // Fallback für ältere Browser (SL CEF)
            var tmp = document.createElement('textarea');
            tmp.value = uuid;
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            document.body.removeChild(tmp);
            texStatus('✓ UUID kopiert: ' + uuid, '#66dd66');
        }
    });

    bind('btn-tex-save', function () {
        var uuid  = val('tex-uuid');
        var label = val('tex-label') || uuid.substring(0, 8) + '...';
        if (!uuid) { texStatus('Bitte erst UUID eingeben und Vorschau laden', '#ff6060'); return; }

        var img = document.getElementById('tex-img');
        var thumb = img && img.style.display !== 'none' ? img.src : null;

        savedTextures.push({ uuid: uuid, label: label, thumb: thumb });
        renderSavedTextures();
        texStatus('✓ "' + label + '" gespeichert', '#66dd66');
        document.getElementById('tex-label').value = '';
    });

    function renderSavedTextures() {
        var container = document.getElementById('tex-saved');
        if (!container) return;
        if (savedTextures.length === 0) {
            container.innerHTML = '<span style="color:#555;font-size:20px">Noch keine gespeichert.</span>';
            return;
        }
        container.innerHTML = savedTextures.map(function (t, i) {
            var thumb = t.thumb
                ? '<img src="' + t.thumb + '" onerror="this.style.display=\'none\'">'
                : '<span style="width:36px;height:36px;display:inline-block;background:#333;border-radius:4px"></span>';
            return '<span class="tex-chip" data-uuid="' + t.uuid + '" data-index="' + i + '">' +
                       thumb +
                       '<span>' + t.label + '</span>' +
                       '<span class="del" data-del="' + i + '">✕</span>' +
                   '</span>';
        }).join('');

        // Klick auf Chip → UUID ins Eingabefeld laden
        container.querySelectorAll('.tex-chip').forEach(function (chip) {
            chip.addEventListener('click', function (e) {
                if (e.target.getAttribute('data-del') !== null) {
                    // Löschen
                    var idx = parseInt(e.target.getAttribute('data-del'));
                    savedTextures.splice(idx, 1);
                    renderSavedTextures();
                    return;
                }
                var uuid = chip.getAttribute('data-uuid');
                document.getElementById('tex-uuid').value = uuid;
                texStatus('UUID geladen: ' + uuid, '#aaaaff');
            });
        });
    }

    // Enter in UUID-Feld = Vorschau laden
    var texInput = document.getElementById('tex-uuid');
    if (texInput) {
        texInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                document.getElementById('btn-tex-preview').click();
                e.preventDefault();
            }
        });
    }

    // Start
    updateStatus();
    setInterval(updateStatus, 15000);

})();
