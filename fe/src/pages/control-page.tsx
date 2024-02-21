import { useCallback } from "react"
import { Button } from "../components/Button/Button"
import { newSocketSource } from "../data/socket-source";
import styles from './styles.module.scss';
import { DirectionForwardIcon } from "../icons/DirectionForwardIcon";
import { DirectionBackIcon } from "../icons/DirectionBackIcon";
import { TurnLeftIcon } from "../icons/TurnLeftIcon";
import { TurnRightIcon } from "../icons/TurnRightIcon";
import { UpIcon } from "../icons/UpIcon";
import { DownIcon } from "../icons/DownIcon";
import { StopIcon } from "../icons/StopIcon";

const socketSource = newSocketSource();

export const ControlPage = () => {
    const sendForwardCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'go_step_up' });
    }, []);
    const sendBackwardCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'go_step_down' });
    }, []);
    const sendTurnLeftCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'turn_left' });
    }, []);
    const sendTurnRightCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'turn_right' });
    }, []);


    const sendStopCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'position_stop' });
    }, []);
    const sendUpCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'position_up' });
    }, []);
    const sendDownCommand = useCallback(() => {
        socketSource.sendMessage({ id: 'position_down' });
    }, []);

    return (
        <div className={styles.Container}>
            <div className={styles.ControlContainer}>
                <Button Icon={DirectionForwardIcon} onClick={sendForwardCommand} className={styles.ButtonForward} text="Forward" />
                <Button Icon={DirectionBackIcon} onClick={sendBackwardCommand} className={styles.ButtonBackward} text="Backward" />
                <Button Icon={TurnLeftIcon} onClick={sendTurnLeftCommand} className={styles.ButtonLeft} text="Left" />
                <Button Icon={TurnRightIcon} onClick={sendTurnRightCommand} className={styles.ButtonRight} text="Right" />
            </div>
            <div className={styles.ControlContainer}>
                <Button Icon={DownIcon} onClick={sendUpCommand} className={styles.ButtonDown} text="Start Position" />
                <Button Icon={UpIcon} onClick={sendDownCommand} className={styles.ButtonUp} text="Down" />
                <Button Icon={StopIcon} onClick={sendStopCommand} className={styles.ButtonStop} text="Stop" />
            </div>
        </div>
    );
}