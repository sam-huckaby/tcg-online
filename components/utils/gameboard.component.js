import React, { Component } from 'react';

import styles from '../../styles/utils/gameboard.module.scss';

const GAME_STATE = 'tcg.online-mtg_game_state';
const GAME_DATA = 'tcg.online-mtg_game_data';

function debounce(func, wait, immediate) {
	let timeout;
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

class PreGame extends Component {
    // This constructor may be unnecessary
    constructor(props) {
        super(props);

        this.state = {
            totalPlayers: null,
            startingLife: null,
            begin: false,
        };

        // Bind the method reference to this Component instance, so that I can access `this`
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        if (typeof window !== "undefined" && window.localStorage.getItem(GAME_STATE)) {
            this.setState(JSON.parse(window.localStorage.getItem(GAME_STATE)));
        }
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

    setBegin(state) {
        this.setState({
            begin: state
        });
        window.localStorage.setItem(GAME_STATE, JSON.stringify({...this.state, begin: true}));
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
        }));
        window.localStorage.removeItem(GAME_DATA);
    }

    renderPlayerSelect() {
        if (this.state.totalPlayers === null) {
            return (
                <div>
                    <div>Number of Players:</div>
                    <div className={styles.players}>
                        {/* Setup buttons or radio group to select number of players (2-6) */}
                        {/* Use classes to denote which is selected */}
                        <button onClick={() => this.setPlayers(2)}>2</button>
                        <button onClick={() => this.setPlayers(3)}>3</button>
                        <button onClick={() => this.setPlayers(4)}>4</button>
                        <button onClick={() => this.setPlayers(5)}>5</button>
                        <button onClick={() => this.setPlayers(6)}>6</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>Number of Players: {this.state.totalPlayers}</div>
            );
        }
    }

    renderLifeSelect() {
        if(this.state.startingLife === null) {
            return (
                <div>
                    <div>Starting Life Total:</div>
                    <div className={styles['life-selector']}>
                        <button onClick={() => this.setLife(20)}>20</button>
                        <button onClick={() => this.setLife(40)}>40</button>
                        <button onClick={() => this.setLife(60)}>60</button>
                        <button onClick={() => this.setLife(80)}>80</button>
                        <button onClick={() => this.setLife(100)}>100</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>Starting Life Total: {this.state.startingLife}</div>
            );
        }
    }

    renderBeginButton() {
        if (this.state.totalPlayers !== null && this.state.startingLife !== null) {
            return <button onClick={() => this.setBegin(true)}>Begin</button>;
        } else {
            return '';
        }
    }

    render() {
        if (this.state.begin === false) {
            return (
                <div className={styles['gameboard-setup']}>
                    {this.renderPlayerSelect()}
                    {this.renderLifeSelect()}
                    {this.renderBeginButton()}
                </div>
            );
        } else {
            return (
                <Game players={this.state.totalPlayers} life={this.state.startingLife} restart={this.restart}></Game>
            );
        }
    }
}

class Game extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            players: [],
            turn: 1,
            playerTurn: 0, // (playerTurn % state.players.length) => tells you whose turn it is
            menuOpen: false,
        };

        for (let i = 0; i < props.players; i++) {
            this.state.players.push({
                life: props.life,
                poison: 0,
                commander: 0,
                energy: 0
            });
        }

        this.current = props.myTurn;

        // Grab the parent method to use here
        this.restart = props.restart;
        
        // Bind the method reference to this Component instance, so that I can access `this`
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    componentDidMount() {
        if (typeof window !== "undefined" && window.localStorage.getItem(GAME_DATA)) {
            this.setState(JSON.parse(window.localStorage.getItem(GAME_DATA)));
        }
    }

    componentDidUpdate() {
        // debounce(function() {
            
        // }, 1);
        if (typeof window !== "undefined" && this.state) {
            window.localStorage.setItem(GAME_DATA, JSON.stringify(this.state))
        }
    }

    reset() {
        this.restart();
        this.toggleMenu();
    }

    toggleMenu() {
        this.setState({
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
        let players = this.state.players;
        players[playerIndex].life += lifeChange;
        this.setState({
            players: players
        });
    }

    renderGameBoard() {
        return <GameBoard players={this.state.players} toggleMenu={this.toggleMenu} updateLife={this.updateLife.bind(this)}></GameBoard>;
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

        // Track life along with an assortment of counters that a player can accumulate
        // These are values that the Player component will control
        this.state = {
            index: props.index,
            life: props.life,
            poison: 0,
            commander: 0,
            energy: 0
        };

        this.current = props.myTurn;
        this.updateLife = function(life) {
            return props.updateLife(props.index, life);
        }

        this.classes = `${styles.player} ${styles['player-'+props.index]} ${styles['total-players-'+props.totalPlayers]}`;
    }

    increment() {
        // this.setState({
        //     life: (this.state.life + 1)
        // });
        this.updateLife(1);
    }

    decrement() {
        // this.setState({
        //     life: (this.state.life - 1)
        // });
        this.updateLife(-1);
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

export default PreGame;