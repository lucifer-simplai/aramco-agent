import React, { useEffect, useRef } from "react";
const AudioVisualizer = ({ audioTrack, isAgent }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let audioContext;
    let analyser;
    let dataArray;

    const setupAudioAnalyser = async () => {
      if (!audioTrack || !audioTrack.mediaStreamTrack) return;

      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const stream = new MediaStream([audioTrack.mediaStreamTrack]);
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      dataArray = new Uint8Array(analyser.frequencyBinCount);
    };

    function roundRect(ctx, x, y, width, height, radius = 50) {
      if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
      }

      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height,
      );
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
    }

    const drawVisualizer = () => {
      if (!ctx || !analyser) return;

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / analyser.frequencyBinCount) * 2;

      ctx.clearRect(0, 0, width, height);

      analyser.getByteFrequencyData(dataArray);
      // Set up the visualization parameters

      let x = 0;

      dataArray.forEach((value, index) => {
        const canvasHeight = canvas.height; // Get the canvas height
        const maxBarHeight = canvasHeight - 5;
        const barHeight = Math.min(value + 50, maxBarHeight);

        // Set up a linear gradient fill
        const gradient = ctx.createLinearGradient(
          0,
          canvasHeight / 2 - barHeight / 2,
          0,
          canvasHeight / 2 + barHeight / 2,
        );
        gradient.addColorStop(0, isAgent ? "#C266E7" : "#3E5AEC"); // Start color
        gradient.addColorStop(1, isAgent ? "#602EDF" : "#20D1DC"); // End color

        ctx.fillStyle = gradient;

        // Draw the rounded bar
        roundRect(
          ctx,
          x,
          canvasHeight / 2 - barHeight / 2,
          barWidth,
          barHeight,
          { tl: 3.75, tr: 3.75, br: 3.75, bl: 3.75 },
        );
        ctx.fill();

        x += barWidth + 12;
      });

      //   for (let i = 0; i < analyser.frequencyBinCount; i++) {
      //     const barHeight = (dataArray[i] / 255) * height;
      //     const hue = (i / analyser.frequencyBinCount) * 360;
      //     ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      //     ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
      //   }

      animationFrameId = requestAnimationFrame(drawVisualizer);
    };

    setupAudioAnalyser().then(() => {
      drawVisualizer();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioTrack]);

  return <canvas ref={canvasRef} style={{ width: "150px", height: "38px" }} />;
};

export default AudioVisualizer;
