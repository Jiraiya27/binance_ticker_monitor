# Binance Ticker Monitor

Display ticker price for cryptocurrency pairs from Binance in Gnome Shell.

## Requirements
 - `xdg-utils` package installed for opening default browser to the pair's trading page when clicking on the pair.

## Installation

### Manual Installation

```
  $ cd ~/.local/share/gnome-shell/extensions
  $ git clone https://github.com/Jiraiya27/binance_ticker_monitor.git binance_ticker_monitor@jiraiya279.gmail.com
  $ gnome-shell-extension-tool -e "binance_ticker_monitor@jiraiya279.gmail.com"
```
Then enable/disable it by either going to [https://extensions.gnome.org/local/](https://extensions.gnome.org/local/) or with `gnome-tweak-tool`


## Configurations

After installation, open the file  `~/.local/share/gnome-shell/extension/binance_ticker_monitor@jiraiya279@gmail.com/extension.js` to edit

Possible configuration variables:

|Name   |Type   |Default|Description    |
|---    |---    |---    |---            |
|TIMEOUT|Number |10     |API refresh time in seconds|
|symbols|Array<Symbol>|BTC and ETH       |Ticker descriptions|

Default data for symbols:

```javascript
[
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
        decimals: 0,
    }
]
```
|Name   |Type   |Description|
|---    |---    |---
|symbol |String |Pair name in binance's API
|tradeSymbol|String|Pair name in browser. Generally only separated by _
|name   |String | Text displayed in top bar
|decimals|Number| Number of decimal places
|removeZero|Boolean| Remove preceding 0 and \. 

Without removeZero `Name: 0.00xxxx` \
With removeZero `Name: xxxx`

Note: Most of the options are for minimizing space in top bar to allow for more pairs

After editing the pairs, refresh gnome shell for it to take effect (`ALT + F2` then typing `r` ).