// script.js
var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "rgb(200, 0, 200)",
  progressColor: "rgb(100, 0, 100)",

  // Set a bar width
  barWidth: 2,
  // Optionally, specify the spacing between bars
  barGap: 1,
  // And the bar radius
  barRadius: 2,
});

wavesurfer.load("sample.mp3");

document.addEventListener("DOMContentLoaded", function () {
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");

  // Add click event listeners to both buttons
  button1.addEventListener("click", function () {
    // Toggle visibility of buttons
    button1.classList.add("hidden");
    button2.classList.remove("hidden");
  });

  button2.addEventListener("click", function () {
    // Toggle visibility of buttons
    button2.classList.add("hidden");
    button1.classList.remove("hidden");
  });
});
