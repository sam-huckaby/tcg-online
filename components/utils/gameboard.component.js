import React, { useEffect, useState } from 'react';
import NoSleep from 'nosleep.js';

import styles from '../../styles/utils/gameboard.module.scss';

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

function MtgTracker(props) {
    // Manage all of the details of the MTG game tracker in one place
    const [totalPlayers, setTotalPlayers] = useState(null);
    const [startingLife, setStartingLife] = useState(null);
    const [begin, setBegin] = useState(false);
    const [players, setPlayers] = useState([]);
    const [turn, setTurn] = useState(1);
    const [playerTurn, setPlayerTurn] = useState(0); // (playerTurn % state.players.length) => tells you whose turn it is

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
    const [sleeping, setSleeping] = useState(false)

    // Grab the parent method to use here
    const restart = props.restart;
    const update = props.update;

    async function reset() {
        // Put that thing away, and be sure you're done before you restart things
        await toggleMenu();
        restart();
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
            return <button className={styles['menu-item']} onClick={() => setSleep(false)}>Disable Stay Awake</button>;
        } else {
            return <button className={styles['menu-item']} onClick={() => setSleep(true)}>Enable Stay Awake</button>;
        }
    }

    function renderMenu() {
        if (menuOpen) {
            return (
                <div className={styles['menu-container']}>
                    <button className={styles['menu-item']} onClick={reset}>Restart Game</button>
                    {renderSleepButton()}
                </div>
            );
        } else {
            return '';
        }
    }

    function updateLife(playerIndex, lifeChange) {
        // create a clone of the game's players
        let players = props.players.slice();
        // Update the specified player's life
        players[playerIndex].life += lifeChange;
        // Tell the Tracker to update that player's details
        update(playerIndex, players[playerIndex])
    }

    function renderGameBoard() {
        return <GameBoard players={props.players} toggleMenu={toggleMenu} updateLife={updateLife}></GameBoard>;
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

    function renderPlayers() {
        let tempPlayerTiles = []
        for (let i = 0; i < props.players.length; i++) {
            tempPlayerTiles.push(<Player key={i} life={props.players[i].life} index={i} totalPlayers={props.players.length} updateLife={updateLife}></Player>);
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
    // Setup the classes to color and shape the players
    const classes = `${styles.player} ${styles['player-'+props.index]} ${styles['total-players-'+props.totalPlayers]}`;    

    function increment() {
        props.updateLife(props.index, 1);
    }

    function decrement() {
        props.updateLife(props.index, -1);
    }
    
    return (
        <div className={classes}>
            <button className={styles['increment-button']} onClick={increment}>+</button>
            <span>{props.life}</span>
            <button className={styles['decrement-button']} onClick={decrement}>-</button>
        </div>
    );
}

export default MtgTracker;