"use strict";

const svg = document.querySelector("svg");
const form = document.querySelector("form");
const timerBlock = document.querySelector(".timer-container");
const allColors = ["red", "white", "green", "yellow", "blue", "orange", "pink"];
const countdownNumberEl = document.getElementById("countdown-number");
const c1 = document.querySelector("#c1");
const c2 = document.querySelector("#c2");
const c3 = document.querySelector("#c3");
const c4 = document.querySelector("#c4");
const colorInputs = [];
colorInputs.push(c1, c2, c3, c4);
let gap = document.querySelector("#gap");
const minInput = document.querySelector("#mins");
const secInput = document.querySelector("#secs");
const minsEl = document.querySelector(".start_mins");
const secsEl = document.querySelector(".start_secs");
const errEl = document.querySelector(".errs");
const errMsg = document.querySelector("#err");
const closeBtn = document.querySelector("#close-btn");
let time, mins, secs, color1, color2, color3, color4;
const selectedColors = [];
const gapDefault = 3;
const endText = "Time is up";

let errorFound = false;
let fragment = document.createDocumentFragment();

colorInputs.forEach((color) => {
  for (let i = 0; i < allColors.length; i++) {
    let optn = allColors[i];
    let el = document.createElement("option");
    el.textContent = optn;
    el.value = optn;
    color.appendChild(el);
  }
});

const renderErr = function (msg) {
  errEl.classList.remove("hidden");
  errMsg.textContent = msg;
  return;
};

const synth = window.speechSynthesis;

if (!speechSynthesis in window) {
  errorFound = true;
  renderErr("Your browser does not support this app please change browser");
} else {
  console.log("ok");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  getValues();
  errorCheck();

  if (errorFound) {
    return;
  }

  form.classList.add("hidden");
  timerBlock.classList.remove("hidden");

  svg.style.animation = `countdown ${time}s linear infinite forwards`;
  timer();
});

const getValues = function () {
  gap = +gap.value;
  mins = +minInput.value;
  secs = +secInput.value;
  mins < 10 ? (minsEl.textContent = `0${mins}`) : (minsEl.textContent = mins);
  secs < 10 ? (secsEl.textContent = `0${secs}`) : (secsEl.textContent = secs);
  time = mins * 60 + secs;
  color1 = c1.value;
  color2 = c2.value;
  color3 = c3.value;
  color4 = c4.value;
  selectedColors.push(color1, color2, color3, color4);
  if (!gap) {
    gap = gapDefault;
  }
  errorCheck();
};

const timer = function () {
  let interval = setInterval(() => {
    randomColor();
    time = --time;
    mins = Math.floor(time / 60);
    secs = Math.floor(time % 60);
    mins < 10 ? (minsEl.textContent = `0${mins}`) : (minsEl.textContent = mins);
    secs < 10 ? (secsEl.textContent = `0${secs}`) : (secsEl.textContent = secs);
    if (time === 0) {
      const utterThis = new SpeechSynthesisUtterance(endText);
      synth.speak(utterThis);
      clearInterval(interval);
      window.location.reload();
    }
  }, 1000);
};

const randomColor = function () {
  const randomNum = Math.floor(Math.random() * 4);
  let randomColorVar = selectedColors[randomNum];

  if (time % gap === 0) {
    const randomColorUtt = new SpeechSynthesisUtterance(randomColorVar);
    synth.speak(randomColorUtt);

    timerBlock.classList.add(randomColorVar);
    setTimeout(() => {
      timerBlock.classList.remove(randomColorVar);
    }, 800);
  }
};

closeBtn.addEventListener("click", () => {
  errEl.classList.add("hidden");
  window.location.reload();
});

const errorCheck = function () {
  if (secs == 0 || secs == null) {
    errorFound = true;
    renderErr("seconds are required and can not be zero");
  }
  if (mins > 60 || secs > 59) {
    errorFound = true;
    renderErr("second or miniute input can not be higher than 59");
  }

  if (!checkIfArrayIsUnique(selectedColors)) {
    errorFound = true;
    renderErr("Different colours must be selected");
  }
};

function checkIfArrayIsUnique(myArray) {
  return myArray.length === new Set(myArray).size;
}
