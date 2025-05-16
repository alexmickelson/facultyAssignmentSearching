import { pipeline } from "@huggingface/transformers";

export default function TextToSpeechPage() {
  return (
    <div className="p-5">
      <h1>Text To Speech</h1>

      <button
        onClick={async () => {
          console.log("starting recognition");
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "Xenova/whisper-tiny.en"
          );
          const url =
            "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav";
          const output = await transcriber(url);
        }}
      >
        Start Recording
      </button>
    </div>
  );
}
