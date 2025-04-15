import { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "../components/Button/Button";
import { newSocketSource } from "../data/socket-source";
import styles from "./styles.module.scss";
import { DirectionForwardIcon } from "../icons/DirectionForwardIcon";
import { DirectionBackIcon } from "../icons/DirectionBackIcon";
import { TurnLeftIcon } from "../icons/TurnLeftIcon";
import { TurnRightIcon } from "../icons/TurnRightIcon";
import { UpIcon } from "../icons/UpIcon";
import { DownIcon } from "../icons/DownIcon";
import { StopIcon } from "../icons/StopIcon";

type StrictIconComponent = React.FC<{ className: string }>;
type ButtonIconComponent = React.FC<{ className?: string | undefined }>;

interface SocketMessage {
  controllerId: string;
  id: string;
}

interface SocketSource {
  sendMessage: (message: SocketMessage) => void;
}

type ButtonRefKey = 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down' | 'stop';
type ButtonRefs = Record<ButtonRefKey, HTMLButtonElement | null>;
type KeyMappings = { [key: string]: ButtonRefKey; };
type CommandHandlers = { [key in ButtonRefKey]: () => void; };

let socketSource: SocketSource;
try {
  socketSource = newSocketSource();
} catch (error) {
  socketSource = {
    sendMessage: (msg: SocketMessage) => console.log('Socket not connected. Would send:', msg)
  };
}

const adaptIcon = (StrictIcon: StrictIconComponent): ButtonIconComponent => {
  return StrictIcon as unknown as ButtonIconComponent;
};

export const ControlPage = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [activeButton, setActiveButton] = useState<ButtonRefKey | null>(null);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttonRefs = useRef<ButtonRefs>({
    forward: null,
    backward: null,
    left: null,
    right: null,
    up: null,
    down: null,
    stop: null
  });

  const setForwardRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.forward = el; }, []);
  const setBackwardRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.backward = el; }, []);
  const setLeftRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.left = el; }, []);
  const setRightRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.right = el; }, []);
  const setUpRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.up = el; }, []);
  const setDownRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.down = el; }, []);
  const setStopRef = useCallback((el: HTMLButtonElement | null) => { buttonRefs.current.stop = el; }, []);

  const COMMANDS = {
    FORWARD: { controllerId: "ARM", id: "go_step_up" },
    BACKWARD: { controllerId: "ARM", id: "go_step_down" },
    LEFT: { controllerId: "ARM", id: "turn_left" },
    RIGHT: { controllerId: "ARM", id: "turn_right" },
    UP: { controllerId: "ARM", id: "position_up" },
    DOWN: { controllerId: "ARM", id: "position_down" },
    STOP: { controllerId: "ARM", id: "position_stop" }
  };

  const safeSendMessage = useCallback((message: SocketMessage) => {
    try {
      socketSource.sendMessage(message);
      return true;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  }, []);

  const animateButton = useCallback((buttonId: ButtonRefKey) => {
    setActiveButton(buttonId);
    const buttonElement = buttonRefs.current[buttonId];
    if (buttonElement) {
      buttonElement.focus();
    }
    setTimeout(() => {
      setActiveButton(null);
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 200);
  }, []);

  const commandHandlers: CommandHandlers = {
    forward: useCallback(() => { safeSendMessage(COMMANDS.FORWARD); animateButton('forward'); }, [safeSendMessage, animateButton]),
    backward: useCallback(() => { safeSendMessage(COMMANDS.BACKWARD); animateButton('backward'); }, [safeSendMessage, animateButton]),
    left: useCallback(() => { safeSendMessage(COMMANDS.LEFT); animateButton('left'); }, [safeSendMessage, animateButton]),
    right: useCallback(() => { safeSendMessage(COMMANDS.RIGHT); animateButton('right'); }, [safeSendMessage, animateButton]),
    up: useCallback(() => { safeSendMessage(COMMANDS.UP); animateButton('up'); }, [safeSendMessage, animateButton]),
    down: useCallback(() => { safeSendMessage(COMMANDS.DOWN); animateButton('down'); }, [safeSendMessage, animateButton]),
    stop: useCallback(() => { safeSendMessage(COMMANDS.STOP); animateButton('stop'); }, [safeSendMessage, animateButton])
  };

  // Updated key mappings: Home = up, End = down
  const KEY_MAPPINGS: KeyMappings = {
    'ArrowUp': 'forward',
    'w': 'forward',
    'W': 'forward',
    'ArrowDown': 'backward',
    's': 'backward',
    'S': 'backward',
    'ArrowLeft': 'left',
    'a': 'left',
    'A': 'left',
    'ArrowRight': 'right',
    'd': 'right',
    'D': 'right',
    'Home': 'up',   // Home key now activates upward button
    'r': 'up',
    'R': 'up',
    'End': 'down',  // End key now activates downward button
    'f': 'down',
    'F': 'down',
    ' ': 'stop'
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const preventDefaultKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
    if (preventDefaultKeys.includes(event.key)) {
      event.preventDefault();
    }
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    const command = KEY_MAPPINGS[event.key] as ButtonRefKey | undefined;
    if (command && commandHandlers[command]) {
      commandHandlers[command]();
    }
  }, [commandHandlers]);

  const activateKeyboardControls = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.focus();
      setKeyboardActive(true);
    }
  }, []);

  useEffect(() => {
    activateKeyboardControls();
    const handleFocusChange = () => {
      setKeyboardActive(document.activeElement === containerRef.current);
    };
    window.addEventListener('focus', handleFocusChange, true);
    window.addEventListener('blur', handleFocusChange, true);
    return () => {
      window.removeEventListener('focus', handleFocusChange, true);
      window.removeEventListener('blur', handleFocusChange, true);
    };
  }, [activateKeyboardControls]);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (document.activeElement === containerRef.current) {
        handleKeyDown(e);
      } else {
        activateKeyboardControls();
      }
    };
    window.addEventListener('keydown', handleKeyDownEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [handleKeyDown, activateKeyboardControls]);

  const getButtonClass = (baseClass: string, buttonId: ButtonRefKey) => {
    return `${baseClass} ${activeButton === buttonId ? styles.ActiveButton : ''}`;
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.Container} ${keyboardActive ? styles.KeyboardActive : ''}`}
      tabIndex={0}
      onClick={activateKeyboardControls}
      onFocus={() => setKeyboardActive(true)}
      onBlur={() => setKeyboardActive(false)}
      aria-label="Control Panel - Click to activate keyboard controls"
    >
      {!isConnected && (
        <div className={styles.ConnectionError}>
          <p>Socket connection error. Controls may not work properly.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      )}
      <div className={styles.FocusIndicator}>
        {keyboardActive ? '✓ Keyboard controls active' : 'Click here to activate keyboard controls'}
      </div>
      <div className={styles.PanelsRow}>
        <div className={styles.ControlContainer}>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonForward}`}>
            <Button
              forwardedRef={setForwardRef}
              Icon={adaptIcon(DirectionForwardIcon)}
              onClick={commandHandlers.forward}
              className={styles.Button}
              text=""
              aria-label="Move Forward - Arrow Up or W key"
            />
            <span className={styles.ShortcutHint}>↑ / W</span>
          </div>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonBackward}`}>
            <Button
              forwardedRef={setBackwardRef}
              Icon={adaptIcon(DirectionBackIcon)}
              onClick={commandHandlers.backward}
              className={styles.Button}
              text=""
              aria-label="Move Backward - Arrow Down or S key"
            />
            <span className={styles.ShortcutHint}>↓ / S</span>
          </div>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonLeft}`}>
            <Button
              forwardedRef={setLeftRef}
              Icon={adaptIcon(TurnLeftIcon)}
              onClick={commandHandlers.left}
              className={styles.Button}
              text=""
              aria-label="Turn Left - Arrow Left or A key"
            />
            <span className={styles.ShortcutHint}>← / A</span>
          </div>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonRight}`}>
            <Button
              forwardedRef={setRightRef}
              Icon={adaptIcon(TurnRightIcon)}
              onClick={commandHandlers.right}
              className={styles.Button}
              text=""
              aria-label="Turn Right - Arrow Right or D key"
            />
            <span className={styles.ShortcutHint}>→ / D</span>
          </div>
        </div>
        <div className={styles.ControlContainer}>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonUp}`}>
            <Button
              forwardedRef={setUpRef}
              Icon={adaptIcon(UpIcon)}
              onClick={commandHandlers.up}
              className={styles.Button}
              text=""
              aria-label="Move Up - Home or R key"
            />
            <span className={styles.ShortcutHint}>Home / R</span>
          </div>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonDown}`}>
            <Button
              forwardedRef={setDownRef}
              Icon={adaptIcon(DownIcon)}
              onClick={commandHandlers.down}
              className={styles.Button}
              text=""
              aria-label="Move Down - End or F key"
            />
            <span className={styles.ShortcutHint}>End / F</span>
          </div>
          <div className={`${styles.ButtonWithHint} ${styles.ButtonStop}`}>
            <Button
              forwardedRef={setStopRef}
              Icon={adaptIcon(StopIcon)}
              onClick={commandHandlers.stop}
              className={styles.Button}
              text=""
              aria-label="Stop All Movement - Space bar"
            />
            <span className={styles.ShortcutHint}>Space</span>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  
