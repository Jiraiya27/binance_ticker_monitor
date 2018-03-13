
const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const Clutter = imports.gi.Clutter;
const Mainloop = imports.mainloop;
const Soup = imports.gi.Soup;
const Util = imports.misc.util;

const TIMEOUT = 10 //seconds
const BASE_URL = 'https://api.binance.com/api/v1/ticker/24hr';
const BASE_TRADEVIEW_URL = 'https://www.binance.com/tradeDetail.html?symbol='
const symbols = [
    {
        symbol: 'ETHBTC',
        tradeSymbol: 'ETH_BTC',
        name: 'ETH',
        decimals: 6,
        removeZero: true,
    },
    {
        symbol: 'BTCUSDT',
        tradeSymbol: 'BTC_USDT',
        name: 'BTC',
        decimals: 0
    }
];

const Ticker = new Lang.Class({
    Name: 'Ticker BaseClass',
    Extends: PanelMenu.Button,

    _init: function(symbol) {
        this.parent(0.0, symbol.name + ' ticker', false);
        this.label = new St.Label({ text: symbol.name, y_align: Clutter.ActorAlign.CENTER });
        this.actor.add_actor(this.label);
        this.actor.connect('button-press-event', Lang.bind(this, this._openBrowser))
        this._symbol = symbol;
        this._refresh();
    },

    _openBrowser: function() {
        let url = BASE_TRADEVIEW_URL + this._symbol.tradeSymbol
        Util.spawnCommandLine("xdg-open " + url)
    },

    _refresh: function() {
        this._loadData(this._refreshUI);
        this._removeTimeout();
        this._timeout = Mainloop.timeout_add_seconds(TIMEOUT, Lang.bind(this, this._refresh))
        return true
    },

    _loadData: function() {
        let params = { symbol: this._symbol.symbol };
        this._httpSession = new Soup.Session();
        let _httpSession = this._httpSession
        let message = Soup.form_request_new_from_hash('GET', BASE_URL, params)
        this._httpSession.queue_message(message, Lang.bind(this, function(httpSession, message) {
            if (message.status_code !== 200) {
                global.log(message);
                return;
            }
            let json = JSON.parse(message.response_body.data);
            this._refreshUI(json)
        }))
    },

    _refreshUI: function(data) {
       let removeZeroRegex = /(?![0\.])(\d*)/g;
       let value = Number(data.lastPrice).toFixed(this._symbol.decimals);
        let text = this._symbol.name + ': '
        if (this._symbol.removeZero) {
            text += removeZeroRegex.exec(value)[0]
        } else {
            text += value
        }
        this.label.set_text(text);
    },

    _removeTimeout: function() {
        if (this._timeout) {
            Mainloop.source_remove(this._timeout);
            this._timeout = null;
        }
    },

    stop: function() {
        if (this._httpSession) {
            this._httpSession.abort();
        }
        this._httpSession = undefined;

        if(this._timeout) {
            Mainloop.source_remove(this._timeout);
        }
        this._timeout = undefined;

        this.menu.removeAll();
    }
})

function init() {
}

function enable() {
    for (let i = 0; i < symbols.length; i++) {
        let ticker = new Ticker(symbols[i])
        symbols[i].ticker = ticker
        Main.panel.addToStatusArea(symbols[i].name + 'Menu', ticker)
    }
}

function disable() {
    for (let i = 0; i < symbols.length; i++) {
        symbols[i].ticker.stop();
        symbols[i].ticker.destroy();
    }
}
