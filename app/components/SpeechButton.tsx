import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type SpeechButtonProps = {
  text: string;
};

const SpeechButton = ({ text }: SpeechButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  let utterance: SpeechSynthesisUtterance | null = null;

  const handleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1; // Adjust the rate (speed) of the speech if necessary
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button onClick={handleSpeech} className="text-white">
      <FontAwesomeIcon
        icon={isSpeaking ? faVolumeMute : faVolumeUp}
        size="lg"
      />
    </button>
  );
};

export default SpeechButton;
