const apiKey =
"2e17930862544ff2a98735e8bac44bdf";

const heatmapData = {

XAUUSD: {

price: 4376.20,

strikes: [

{ strike:'4350', call:96, put:18 },
{ strike:'4360', call:82, put:30 },
{ strike:'4370', call:68, put:52 },
{ strike:'4380', call:44, put:74 },
{ strike:'4390', call:26, put:96 }

]

}

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

}
);

function renderHeatmap(pair){

const data =
heatmapData[pair];

if(!data) return;

document.getElementById(
"livePrice"
).innerText =
data.price;

heatmapRows.innerHTML = "";

let strongestCall =
data.strikes[0];

let strongestPut =
data.strikes[0];

data.strikes.forEach(level=>{

if(
level.call >
strongestCall.call
){

strongestCall =
level;

}

if(
level.put >
strongestPut.put
){

strongestPut =
level;

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

renderHeatmap(
"XAUUSD"
);
