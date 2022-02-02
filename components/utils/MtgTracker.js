import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NoSleep from 'nosleep.js';

import styles from '../../styles/utils/MtgTracker.module.scss';

let noSleep;
if (typeof window !== "undefined") {
    noSleep = new NoSleep();
} else {
    noSleep = {};
}

const GAME_STATE = 'tcg.online-mtg_game_state';

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		let context = this;
        let args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function MtgTracker() {
    // Manage all of the details of the MTG game tracker in one place
    const [totalPlayers, setTotalPlayers] = useState(null);
    const [startingLife, setStartingLife] = useState(null);
    const [begin, setBegin] = useState(false);
    const [players, setPlayers] = useState([]);
    const [turn, setTurn] = useState(1);
    const [playerTurn, setPlayerTurn] = useState(0); // (playerTurn % state.players.length) => tells you whose turn it is

    useEffect(() => {
        let sizeFn;

        if (typeof document !== undefined && typeof window !== undefined) {
            // Designed with help from:
            // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
            let windowSize = async () => {
                const storeHeight = () => {
                    let vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                };
                const debounce = (await import('../../utils/helpers')).debounce;
                sizeFn = debounce(storeHeight);

                window.addEventListener('resize', sizeFn, { passive: true });
                
                storeHeight();
            }
            windowSize();
        }

        return () => {
            // When the component is removed from view, stop listening for sizing
            window.removeEventListener('resize', sizeFn);
            if (screen && screen.orientation) {
                screen.orientation.removeEventListener('change', sizeFn);
            } else {
                window.removeEventListener('orientationchange', sizeFn);
            }
        }
    }, []);

    useEffect(() => {
        // If there is localStorage, grab any stored game state
        if (typeof window !== "undefined" && window.localStorage.getItem(GAME_STATE)) {
            let storage = JSON.parse(window.localStorage.getItem(GAME_STATE));
            setTotalPlayers(storage.totalPlayers);
            setStartingLife(storage.startingLife);
            setBegin(storage.begin);
            setPlayers(storage.players);
            setTurn(storage.turn);
            setPlayerTurn(storage.playerTurn);
        }
    }, []);

    useEffect(() => {
        // When the component's state updates, update localStorage if available (but not more than once per second)
        let updater = debounce(() => {
            // For some reason, this "debounce" function doesn't cancel requests, and just waits 1 second and then fires them all off
            if (typeof window !== "undefined") {
                window.localStorage.setItem(GAME_STATE, JSON.stringify(
                    {
                        totalPlayers,
                        startingLife,
                        begin,
                        players,
                        turn,
                        playerTurn,
                    }
                ));
            }
        }, 1000);

        updater();
    }, [totalPlayers, startingLife, begin, players, turn, playerTurn]);

    async function startGame() {
        // Can't start the game without these two pieces of information
        if (startingLife === null || totalPlayers === null) {
            return;
        }

        // Build the new players for the game
        let newPlayers = [];
        for (let i = 0; i < totalPlayers; i++) {
            newPlayers.push({
                life: startingLife,
                poison: 0,
                commander: 0,
                energy: 0
            });
        }

        setPlayers(newPlayers);
        setTurn(1);
        setPlayerTurn(0);
        setBegin(true);

        // TODO: Remove the below comments after testing
        // This isn't needed because of the useEffect hook
        // window.localStorage.setItem(GAME_STATE, JSON.stringify(this.state));
    }

    function restart() {
        setTotalPlayers(null);
        setStartingLife(null);
        setBegin(false);
        setPlayers([]);
        setTurn(1);
        setPlayerTurn(0);
    }

    function renderPlayerSelect() {
        let playerButtons = [];

        for (let i = 2; i <= 6; i++) {
            let dynamicClass = `${styles['selector-button']}`;
            if (totalPlayers === i) {
                dynamicClass = dynamicClass + ' ' + `${styles.selected}`
            }
            playerButtons.push(<div key={i+'_player_button'} className={dynamicClass} onClick={() => setTotalPlayers(i)}>{i}</div>);
        }

        return (
            <div>
                <div className={styles['pregame-label']}>Number of Players:</div>
                <div className={styles['selector-container']}>
                    {playerButtons}
                </div>
            </div>
        );
    }

    function renderLifeSelect() {
        let lifeButtons = [];
        let lifeOptions = [
            20,
            40,
            60,
            80,
            100
        ];

        for (let i = 0; i < lifeOptions.length; i++) {
            let dynamicClass = `${styles['selector-button']}`;
            if (startingLife === lifeOptions[i]) {
                dynamicClass = dynamicClass + ' ' + `${styles.selected}`
            }
            lifeButtons.push(<div key={i+'_life_button'} className={dynamicClass} onClick={() => setStartingLife(lifeOptions[i])}>{lifeOptions[i]}</div>);
        }

        return (
            <div>
                <div className={styles['pregame-label']}>Starting Life Total:</div>
                <div className={styles['selector-container']}>
                    {lifeButtons}
                </div>
            </div>
        );
    }

    function renderBeginButton() {
        let classes = `${styles['begin-button']}`;

        if (totalPlayers !== null && startingLife !== null) {
            return <button className={classes} onClick={startGame}>Begin</button>;
        } else {
            classes = classes + ` ${styles.disabled}`;
            return <button className={classes}>Begin</button>;
        }
    }

    async function updatePlayer(playerIndex, values) {
        // Create a clone of the player array, so we don't directly mutate the state
        let tempPlayers = players.slice();
        // Assign the original values to the player and then overwrite with any new valyes
        tempPlayers[playerIndex] = {...tempPlayers[playerIndex], ...values};
        // Update the players state value with the new player data
        setPlayers(tempPlayers);
    }

    return <>
        {
            (begin === false)?
                <div className={styles['gameboard-setup']}>
                    {renderPlayerSelect()}
                    {renderLifeSelect()}
                    {renderBeginButton()}
                </div> :
                <Game players={players} restart={restart} update={updatePlayer}></Game>
        }
    </>
}

function Game(props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [sleeping, setSleeping] = useState(false);

    const router = useRouter();

    // Grab the parent method to use here
    const restart = props.restart;
    const update = props.update;

    async function reset() {
        // Put that thing away, and be sure you're done before you restart things
        await toggleMenu();
        restart();
    }

    async function exit() {
        await toggleMenu();
        restart();
        router.push('/');
    }

    function setSleep(turnOn) {
        if (turnOn) {
            noSleep.enable();
        } else {
            noSleep.disable();
        }
        setSleeping(turnOn);
    }

    function toggleMenu() {
        return setMenuOpen(!menuOpen);
    }

    function renderSleepButton() {
        if (sleeping) {
            return <button className="h-[50px] m-[5px] border border-solid border-neutral-600 bg-white text-neutral-600" onClick={() => setSleep(false)}>Disable Stay Awake</button>;
        } else {
            return <button className="h-[50px] m-[5px] border border-solid border-neutral-600 bg-white text-neutral-600" onClick={() => setSleep(true)}>Enable Stay Awake</button>;
        }
    }

    function renderMenu() {
        if (menuOpen) {
            return (
                <div className={`absolute top-[50px] right-0 bottom-0 left-0 bg-neutral-200 flex flex-col z-10`}>
                    <button className="h-[50px] m-[5px] border border-solid border-neutral-600 bg-white text-neutral-600" onClick={reset}>Restart Game</button>
                    {renderSleepButton()}
                    <div className="flex-auto">&nbsp;</div>
                    <button className="h-[50px] m-[5px] border border-solid border-neutral-600 bg-white text-neutral-600" onClick={exit}>Exit Game</button>
                </div>
            );
        } else {
            return '';
        }
    }

    function updateLife(playerIndex, pointChange) {
        // create a clone of the game's players
        let players = props.players.slice();
        // Update the specified player's life
        players[playerIndex].life += pointChange;
        // Tell the Tracker to update that player's details
        update(playerIndex, players[playerIndex])
    }

    function updateCommander(playerIndex, pointChange) {
        // create a clone of the game's players
        let players = props.players.slice();
        // Update the specified player's life
        players[playerIndex].commander += pointChange;
        // Tell the Tracker to update that player's details
        update(playerIndex, players[playerIndex])
    }

    function updatePoison(playerIndex, pointChange) {
        // create a clone of the game's players
        let players = props.players.slice();
        // Update the specified player's life
        players[playerIndex].poison += pointChange;
        // Tell the Tracker to update that player's details
        update(playerIndex, players[playerIndex])
    }

    function updateEnergy(playerIndex, pointChange) {
        // create a clone of the game's players
        let players = props.players.slice();
        // Update the specified player's life
        players[playerIndex].energy += pointChange;
        // Tell the Tracker to update that player's details
        update(playerIndex, players[playerIndex])
    }

    function renderGameBoard() {
        return <GameBoard players={props.players} toggleMenu={toggleMenu} updateLife={updateLife} updateCommander={updateCommander} updatePoison={updatePoison} updateEnergy={updateEnergy}></GameBoard>;
    }

    return (
        <div className={styles.game}>
            {renderGameBoard()}
            {renderMenu()}
        </div>
    );
}

function GameBoard(props) {
    // Methods passed down from the parent
    const menuHandler = props.toggleMenu;
    const updateLife = props.updateLife;
    const updateCommander = props.updateCommander;
    const updatePoison = props.updatePoison;
    const updateEnergy = props.updateEnergy;

    function renderPlayers() {
        let tempPlayerTiles = []
        for (let i = 0; i < props.players.length; i++) {
            tempPlayerTiles.push(<Player key={i} counters={props.players[i]} index={i} totalPlayers={props.players.length} updateLife={updateLife} updateCommander={updateCommander} updatePoison={updatePoison} updateEnergy={updateEnergy}></Player>);
        }
        return tempPlayerTiles;
    }
    
    return (
        <div className={styles['game-container']}>
            <div className={styles['menu-board']}>
                <button onClick={() => menuHandler()}>&equiv;</button>
            </div>
            <div className={styles['game-board']}>
                {renderPlayers()}
            </div>
        </div>
    );
}

// Player Class
// Takes props.life
function Player(props) {
    // Setup state values for visuals
    const [trayOpen, setTrayOpen] = useState(false);

    // Setup the classes to color and shape the players
    const classes = `${styles.player} ${styles['player-'+props.index]} ${styles['total-players-'+props.totalPlayers]}`;    

    function incrementLife() {
        props.updateLife(props.index, 1);
    }

    function decrementLife() {
        props.updateLife(props.index, -1);
    }    

    function incrementCommander() {
        props.updateCommander(props.index, 1);
    }

    function decrementCommander() {
        props.updateCommander(props.index, -1);
    }    

    function incrementPoison() {
        props.updatePoison(props.index, 1);
    }

    function decrementPoison() {
        props.updatePoison(props.index, -1);
    }    

    function incrementEnergy() {
        props.updateEnergy(props.index, 1);
    }

    function decrementEnergy() {
        props.updateEnergy(props.index, -1);
    }

    function renderTray() {
        return <div className={((trayOpen)? 'absolute' : 'hidden') + ` ` + (((props.index+1) % 2)? 'rotate-90' : '-rotate-90') + ` ${styles['player-menu']}  absolute z-10 overflow-hidden text-base flex flex-row px-2`}>
            <div className="text-white flex flex-col flex-auto bg-black/75 p-2">
                <div className="flex-auto flex flex-row justify-around">
                    <div className="basis-full flex flex-col justify-center items-center">
                        <div className="text-xs">Commander</div>
                        <button onClick={incrementCommander} className="text-white text-4xl w-10 h-10 flex flex-col justify-center items-center">&#9652;</button>
                        <div className="text-white">{props?.counters?.commander}</div>
                        <button onClick={decrementCommander} className="text-white text-4xl w-10 h-10 flex flex-col justify-center items-center">&#9662;</button>
                    </div>
                    <div className="basis-full flex flex-col justify-center items-center">
                        <div className="text-xs">Poison</div>
                        <button onClick={incrementPoison} className="text-white text-4xl w-10 h-10 flex flex-col justify-center items-center">&#9652;</button>
                        <div className="text-white">{props?.counters?.poison}</div>
                        <button onClick={decrementPoison} className="text-white text-4xl w-10 h-10 flex flex-col justify-center items-center">&#9662;</button>
                    </div>
                    <div className="basis-full flex flex-col justify-center items-center">
                        <div className="text-xs">Energy</div>
                        <button onClick={incrementEnergy} className="text-white text-4xl w-10 h-10 flex flex-col justify-center items-center">&#9652;</button>
                        <div className="text-white">{props?.counters?.energy}</div>
                        <button onClick={decrementEnergy} className="text-white text-4xl w-10 h-10 flex flex-col justify-center items-center">&#9662;</button>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <button onClick={() => setTrayOpen(false)} className="border border-white border-solid h-8 w-8 flex flex-col justify-center items-center">X</button>
                </div>
            </div>
        </div>;
    }
    
    return (
        <div className={`${classes} relative`}>
            { renderTray() }
            <div className={(((props.index+1) % 2)? 'rotate-90' : '-rotate-90') + ` ${styles['inner-container']} flex flex-col px-[12px]`}>
                <div className="flex-auto flex flex-row justify-around">
                    <div className="basis-full flex flex-col justify-center items-center">
                        <div className="text-xs">Commander</div>
                        <div className="text-black text-base">{props?.counters?.commander}</div>
                    </div>
                    <div className="basis-full flex flex-col justify-center items-center">
                        <div className="text-xs">Poison</div>
                        <div className="text-black text-base">{props?.counters?.poison}</div>
                    </div>
                    <div className="basis-full flex flex-col justify-center items-center">
                        <div className="text-xs">Energy</div>
                        <div className="text-black text-base">{props?.counters?.energy}</div>
                    </div>
                </div>
                <div className="flex-auto flex flex-row justify-center items-center">
                    {
                        ((props.index+1) % 2 === 0)?
                            <button className={styles['increment-button']} onClick={incrementLife}>+</button> :
                            <button className={styles['decrement-button']} onClick={decrementLife}>-</button>
                    }
                    <span>{props?.counters?.life}</span>
                    {
                        ((props.index+1) % 2 === 1)?
                            <button className={styles['increment-button']} onClick={incrementLife}>+</button> :
                            <button className={styles['decrement-button']} onClick={decrementLife}>-</button>
                    }
                </div>
                <div className="flex flex-row justify-center items-center pb-2">
                    <button onClick={() => setTrayOpen(true)} className="text-black border border-solid border-black text-sm p-2 h-8 w-8 flex flex-row justify-center items-center">&equiv;</button>
                </div>
            </div>
        </div>
    );
}

export default MtgTracker;