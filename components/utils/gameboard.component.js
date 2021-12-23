import React, { Component } from 'react';

import styles from '../../styles/utils/gameboard.module.scss';

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
    }

    restart() {
        this.setState({
            totalPlayers: null,
            startingLife: null,
            begin: false,
        });
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

    render() {
        return (
            <div className={styles.game}>
                <GameBoard players={this.state.players} toggleMenu={this.toggleMenu}></GameBoard>
                {this.renderMenu()}
            </div>
        );
    }
}

class GameBoard extends React.Component {
    constructor (props) {
        super(props);
        this.colors = [
            'red',
            'orange',
            'yellow',
            'green',
            'blue',
            'purple',
        ];

        this.playerTiles = [];

        this.menuHandler = props.toggleMenu;
        
        for (let i = 0; i < props.players.length; i++) {
            this.playerTiles.push(<Player key={i} life={props.players[i].life} index={i} totalPlayers={props.players.length}></Player>);
        }
    }
    // Select colors? (Maybe just use the basic 6, and cap the players)
    // Loop through and create a Player object for the number of players specified in props.players
    
    render() {
        return (
            <div className={styles['game-container']}>
                <div className={styles['menu-board']}>
                    <button onClick={() => this.menuHandler()}>&equiv;</button>
                </div>
                <div className={styles['game-board']}>
                    {this.playerTiles}
                </div>
            </div>
        );
    }
}

// Player Class
// Takes props.life && props.color
class Player extends React.Component {
    constructor (props) {
        super(props);

        // Track life along with an assortment of counters that a player can accumulate
        // These are values that the Player component will control
        this.state = {
            life: props.life,
            color: props.color,
            poison: 0,
            commander: 0,
            energy: 0
        };

        this.current = props.myTurn;

        this.classes = `${styles.player} ${styles['player-'+props.index]} ${styles['total-players-'+props.totalPlayers]}`;
    }

    increment() {
        this.setState({
            life: (this.state.life + 1)
        });
    }

    decrement() {
        this.setState({
            life: (this.state.life - 1)
        });
    }
    
    render() {
        return (
            <div className={this.classes}>
                <button className={styles['increment-button']} onClick={() => this.increment()}>+</button>
                {this.state.life}
                <button className={styles['decrement-button']} onClick={() => this.decrement()}>-</button>
            </div>
        );
    }
}

export default PreGame;