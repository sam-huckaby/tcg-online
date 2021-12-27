import React, { Component } from 'react';

import styles from '../../styles/utils/gameboard.module.scss';

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

class MtgTracker extends Component {
    // This constructor may be unnecessary
    constructor(props) {
        super(props);

        // Manage all of the details of the MTG game tracker in one place
        this.state = {
            totalPlayers: null,
            startingLife: null,
            begin: false,
            game: {
                players: [],
                turn: 1,
                playerTurn: 0, // (playerTurn % state.players.length) => tells you whose turn it is
            }
        };
    }

    componentDidMount() {
        // If there is localStorage, grab any stored game state
        if (typeof window !== "undefined" && window.localStorage.getItem(GAME_STATE)) {
            this.setState(JSON.parse(window.localStorage.getItem(GAME_STATE)));
        }
    }

    // TODO: Write a better debounce function (probably)
    componentDidUpdate() {
        // When the component's state updates, update localStorage if available (but not more than once per second)
        let updater = debounce(() => {
            // For some reason, this "debounce" function doesn't cancel requests, and just waits 1 second and then fires them all off
            if (typeof window !== "undefined" && this.state) {
                window.localStorage.setItem(GAME_STATE, JSON.stringify(this.state))
            }
        }, 1000);

        updater();
    }

    setPlayers(num) {
        this.setState({
            totalPlayers: num
        });
    }

    setLife(num) {
        this.setState({
            startingLife: num
        });
    }

    async startGame() {
        // Can't start the game without these two pieces of information
        if (this.state.startingLife === null || this.state.totalPlayers === null) {
            return;
        }

        // Build the new players for the game
        let newPlayers = [];
        for (let i = 0; i < this.state.totalPlayers; i++) {
            newPlayers.push({
                life: this.state.startingLife,
                poison: 0,
                commander: 0,
                energy: 0
            });
        }
        await this.setState({
            game: {
                players: newPlayers,
                turn: 1,
                playerTurn: 0,
            },
            begin: true
        });
        window.localStorage.setItem(GAME_STATE, JSON.stringify(this.state));
    }

    restart() {
        // Reset the state
        this.setState({
            totalPlayers: null,
            startingLife: null,
            begin: false,
        });
        // Reset the persisted state
        window.localStorage.setItem(GAME_STATE, JSON.stringify({
            totalPlayers: null,
            startingLife: null,
            begin: false,
            game: {
                players: [],
                turn: 1,
                playerTurn: 0,
            }
        }));
    }

    renderPlayerSelect() {
        let playerButtons = [];

        for (let i = 2; i <= 6; i++) {
            let dynamicClass = `${styles['selector-button']}`;
            if (this.state.totalPlayers === i) {
                dynamicClass = dynamicClass + ' ' + `${styles.selected}`
            }
            playerButtons.push(<div key={i+'_player_button'} className={dynamicClass} onClick={() => this.setPlayers(i)}>{i}</div>);
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

    renderLifeSelect() {
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
            if (this.state.startingLife === lifeOptions[i]) {
                dynamicClass = dynamicClass + ' ' + `${styles.selected}`
            }
            lifeButtons.push(<div key={i+'_life_button'} className={dynamicClass} onClick={() => this.setLife(lifeOptions[i])}>{lifeOptions[i]}</div>);
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

    renderBeginButton() {
        let classes = `${styles['begin-button']}`;

        if (this.state.totalPlayers !== null && this.state.startingLife !== null) {
            return <button className={classes} onClick={() => this.startGame()}>Begin</button>;
        } else {
            classes = classes + ` ${styles.disabled}`;
            return <button className={classes}>Begin</button>;
        }
    }

    async updatePlayer(playerIndex, values) {
        // Create a clone of the player array, so we don't directly mutate the state
        let players = this.state.game.players.slice();
        // Assign the original values to the player and then overwrite with any new valyes
        players[playerIndex] = {...players[playerIndex], ...values};
        // Update the state and call it a day
        await this.setState({
            game: {
                ...this.state.game,
                ...{players: players}
            }
        });
    }

    render() {
        // If the game is not yet started, show the setup screen
        if (this.state.begin === false) {
            return (
                <div className={styles['gameboard-setup']}>
                    {this.renderPlayerSelect()}
                    {this.renderLifeSelect()}
                    {this.renderBeginButton()}
                </div>
            );
        } else {
            // if the game is already started, display the game with existing details
            return (
                <Game players={this.state.game.players} restart={this.restart.bind(this)} update={this.updatePlayer.bind(this)}></Game>
            );
        }
    }
}

class Game extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            menuOpen: false,
        };

        // Grab the parent method to use here
        this.restart = props.restart;
    }

    async reset() {
        // Put that thing away, and be sure you're done before you restart things
        await this.toggleMenu();
        this.restart();
    }

    toggleMenu() {
        return this.setState({
            menuOpen: !this.state.menuOpen
        });
    }

    renderMenu() {
        if (this.state.menuOpen) {
            return (<div className={styles['menu-container']}>
                <button className={styles['menu-item']} onClick={() => this.reset()}>Restart Game</button>
            </div>);
        } else {
            return '';
        }
    }

    updateLife(playerIndex, lifeChange) {
        // create a clone of the game's players
        let players = this.props.players.slice();
        // Update the specified player's life
        players[playerIndex].life += lifeChange;
        // Tell the Tracker to update that player's details
        this.props.update(playerIndex, players[playerIndex])
    }

    renderGameBoard() {
        return <GameBoard players={this.props.players} toggleMenu={this.toggleMenu.bind(this)} updateLife={this.updateLife.bind(this)}></GameBoard>;
    }

    render() {
        return (
            <div className={styles.game}>
                {this.renderGameBoard()}
                {this.renderMenu()}
            </div>
        );
    }
}

class GameBoard extends React.Component {
    constructor (props) {
        super(props);
        this.playerTiles = [];

        this.menuHandler = props.toggleMenu;

        this.updateLife = props.updateLife;
    }

    renderPlayers() {
        this.playerTiles = [];
        for (let i = 0; i < this.props.players.length; i++) {
            this.playerTiles.push(<Player key={i} life={this.props.players[i].life} index={i} totalPlayers={this.props.players.length} updateLife={this.updateLife}></Player>);
        }
        return this.playerTiles;
    }
    
    render() {
        return (
            <div className={styles['game-container']}>
                <div className={styles['menu-board']}>
                    <button onClick={() => this.menuHandler()}>&equiv;</button>
                </div>
                <div className={styles['game-board']}>
                    {this.renderPlayers()}
                </div>
            </div>
        );
    }
}

// Player Class
// Takes props.life
class Player extends React.Component {
    constructor (props) {
        super(props);

        // This will be passed in a future feature (need to add "turn tracker" to the menu)
        //this.current = props.myTurn;

        // Dynamically assign the player classes, so that the color can be set more easily
        this.classes = `${styles.player} ${styles['player-'+props.index]} ${styles['total-players-'+props.totalPlayers]}`;
    }

    increment() {
        this.props.updateLife(this.props.index, 1);
    }

    decrement() {
        this.props.updateLife(this.props.index, -1);
    }
    
    render() {
        return (
            <div className={this.classes}>
                <button className={styles['increment-button']} onClick={() => this.increment()}>+</button>
                {this.props.life}
                <button className={styles['decrement-button']} onClick={() => this.decrement()}>-</button>
            </div>
        );
    }
}

export default MtgTracker;