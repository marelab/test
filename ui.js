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
                    'data-folder="' + wearPath + '" title="' + wearPath + '">' +
                    imgHtml +
                    '<span class="oname">' + displayName + '</span>' +
                    (!hasThumb
                        ? '<span style="color:#555;font-size:14px">kein Bild</span>'
                        : '') +
                    '<span class="norlv" style="display:' + (rlvAvailable ? 'none' : 'block') + '">' +
                    '⚠️ kein RLV</span>' +
                    '</div>';
            }).join('');

            // Klick-Handler
            gallery.querySelectorAll('.outfit-card').forEach(function (card) {
                card.addEventListener('click', function () {
                    if (!rlvAvailable) {
                        setStatus('RLV nicht aktiv – Outfit anziehen nicht möglich', true);
                        return;
                    }
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
