const apiKey =
"2e17930862544ff2a98735e8bac44bdf";

const forexPairs = {

XAUUSD:"XAU/USD",
EURUSD:"EUR/USD",
GBPUSD:"GBP/USD",
USDJPY:"USD/JPY",
AUDUSD:"AUD/USD"

};

const cryptoPairs = {

BTCUSD:"BTCUSDT",
ETHUSD:"ETHUSDT"

};

const pairSelect =
document.getElementById(
"pairSelect"
);

const heatmapRows =
document.getElementById(
"heatmapRows"
);

const clickSound =
document.getElementById(
"clickSound"
);

function playClick(){

clickSound.currentTime = 0;
clickSound.play();

}

pairSelect.addEventListener(
"change",
()=>{

playClick();

renderHeatmap(
pairSelect.value
);

changeTradingViewChart(
pairSelect.value
);

}
);

async function getForexPrice(pair){

try{

const response =
await fetch(

`https://api.twelvedata.com/price?symbol=${pair}&apikey=${apiKey}`

);

const data =
await response.json();

if(data.price){

return Number(data.price);

}

return null;

}catch{

return null;

}

}

async function getCryptoPrice(symbol){

try{

const response =
await fetch(

`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`

);

const data =
await response.json();

return Number(data.price);

}catch{

return null;

}

}

async function getLivePrice(pair){

if(
cryptoPairs[pair]
){

return await getCryptoPrice(
cryptoPairs[pair]
);

}

if(
forexPairs[pair]
){

return await getForexPrice(
forexPairs[pair]
);

}

return null;

}

async function renderHeatmap(pair){

const livePrice =
await getLivePrice(pair);

if(!livePrice){

document.getElementById(
"livePrice"
).innerText =
"Offline";

return;

}

document.getElementById(
"livePrice"
).innerText =

livePrice > 1000
? livePrice.toFixed(2)
: livePrice.toFixed(4);

heatmapRows.innerHTML = "";

let strikes = [];

let step;

if(livePrice > 1000){

step = livePrice * 0.0015;

}else{

step = livePrice * 0.0008;

}

for(let i=-2;i<=2;i++){

const strike =
livePrice + (i * step);

strikes.push({

strike:

livePrice > 1000
? strike.toFixed(2)
: strike.toFixed(4),

call:
Math.floor(
Math.random()*40+60
),

put:
Math.floor(
Math.random()*40+60
)

});

}

let strongestCall =
strikes[0];

let strongestPut =
strikes[0];

strikes.forEach(level=>{

if(level.call > strongestCall.call){

strongestCall = level;

}

if(level.put > strongestPut.put){

strongestPut = level;

}

const row =
document.createElement(
"div"
);

row.classList.add(
"heatmap-row"
);

row.innerHTML = `

<div>
${level.strike}
</div>

<div class="bar">

<div
class="fill-call"
style="
width:${level.call}%;
">
</div>

</div>

<div class="bar">

<div
class="fill-put"
style="
width:${level.put}%;
">
</div>

</div>

`;

heatmapRows.appendChild(
row
);

});

document.getElementById(
"callVolume"
).innerText =
strongestCall.call + "K";

document.getElementById(
"putVolume"
).innerText =
strongestPut.put + "K";

document.getElementById(
"callArea"
).innerText =
strongestCall.strike;

document.getElementById(
"putArea"
).innerText =
strongestPut.strike;

const sentiment =
strongestCall.call >
strongestPut.put
? "Bullish"
: "Bearish";

const sentimentEl =
document.querySelector(
".bullish"
);

sentimentEl.innerText =
sentiment;

if(sentiment === "Bullish"){

sentimentEl.style.color =
"#00ff95";

}else{

sentimentEl.style.color =
"#ff3366";

}

}

document.getElementById(
"analyzeBtn"
).addEventListener(
"click",
()=>{

playClick();

const price =
Number(
document.getElementById(
"manualPrice"
).value
);

if(!price) return;

const callArea =
price + (price * 0.003);

const putArea =
price - (price * 0.003);

document.getElementById(
"callArea"
).innerText =
callArea.toFixed(2);

document.getElementById(
"putArea"
).innerText =
putArea.toFixed(2);

}
);

const menuBtn =
document.getElementById(
"menuBtn"
);

const dropdownMenu =
document.querySelector(
".dropdown-menu"
);

menuBtn.addEventListener(
"click",
(e)=>{

playClick();

e.stopPropagation();

if(
dropdownMenu.style.display
=== "flex"
){

dropdownMenu.style.display =
"none";

}else{

dropdownMenu.style.display =
"flex";

}

}
);

window.addEventListener(
"click",
(e)=>{

if(
!menuBtn.contains(e.target)
&&
!dropdownMenu.contains(e.target)
){

dropdownMenu.style.display =
"none";

}

});

function loadTradingView(symbol){

new TradingView.widget({

width:"100%",
height:500,

symbol:symbol,

interval:"15",

timezone:"Asia/Jakarta",

theme:"dark",

style:"1",

locale:"en",

toolbar_bg:"#0b0f19",

enable_publishing:false,

hide_top_toolbar:false,

allow_symbol_change:true,

container_id:"tradingview_chart"

});

}

function changeTradingViewChart(pair){

let tvSymbol =
"OANDA:XAUUSD";

if(pair === "EURUSD"){

tvSymbol =
"OANDA:EURUSD";

}

if(pair === "GBPUSD"){

tvSymbol =
"OANDA:GBPUSD";

}

if(pair === "USDJPY"){

tvSymbol =
"OANDA:USDJPY";

}

if(pair === "AUDUSD"){

tvSymbol =
"OANDA:AUDUSD";

}

if(pair === "BTCUSD"){

tvSymbol =
"BINANCE:BTCUSDT";

}

if(pair === "ETHUSD"){

tvSymbol =
"BINANCE:ETHUSDT";

}

document.getElementById(
"tradingview_chart"
).innerHTML = "";

loadTradingView(
tvSymbol
);

}

async function startRealtime(){

await renderHeatmap(
pairSelect.value
);

changeTradingViewChart(
pairSelect.value
);

setInterval(async()=>{

await renderHeatmap(
pairSelect.value
);

},3000);

}

startRealtime();
