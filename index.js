let select1 = document.getElementById("select1");
let select2 = document.getElementById("select2");
let answer = document.getElementById("answer");
let question = document.getElementById("question");
let translateBtn = document.getElementById("translate");
let speech = document.getElementById("speech");
let speechOn = false;
// new speech recognition object
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

async function selectFiller1() {
  let res = await fetch("https://libretranslate.de/languages");
  let data = await res.json();
  data.forEach((element) => {
    let op = document.createElement("option");
    op.setAttribute("value", element.code);
    op.textContent = element.name;
    select1.append(op);
  });
}
async function selectFiller2() {
  let res = await fetch("https://libretranslate.de/languages");
  let data = await res.json();
  data.forEach((element) => {
    let op = document.createElement("option");
    op.setAttribute("value", element.code);
    op.textContent = element.name;
    select2.append(op);
  });
}

async function translate(source, target) {
  console.log(question);
  if (
    question.innerText == null ||
    question.innerText == "" ||
    question.innerText == undefined
  ) {
    answer.innerText = "Please provide a valid text";
  } else {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: question.innerText,
        source,
        target,
      }),
      headers: { "Content-Type": "application/json" },
    });
    let data = await res.json();
    answer.innerText = data.translatedText;
  }
}
async function getLanguage() {
  if (select1.value != "Detect") {
    translate(select1.value, select2.value);
  } else {
    const res = await fetch("https://libretranslate.de/detect", {
      method: "POST",
      body: JSON.stringify({
        q: question.innerText,
      }),
      headers: { "Content-Type": "application/json" },
    });
    let data = await res.json();
    translate(data[0].language, select2.value);
  }
}
selectFiller1();
selectFiller2();
translateBtn.addEventListener("click", () => {
  getLanguage();
});

// This runs when the speech recognition service starts
recognition.onstart = function () {
  console.log("We are listening. Try speaking into the microphone.");
};

recognition.onspeechend = function () {
  // when user is done speaking
  recognition.stop();
  speech.removeAttribute("class");
};

// This runs when the speech recognition service returns result
recognition.onresult = function (event) {
  var transcript = event.results[0][0].transcript;
  var confidence = event.results[0][0].confidence;
  question.innerText = question.innerText + transcript;
};
// start recognition
speech.addEventListener("click", () => {
  if (!speechOn) {
    recognition.start();
    speech.setAttribute("class", "act");
  } else {
    recognition.stop();
    speech.removeAttribute("class");
  }
});
