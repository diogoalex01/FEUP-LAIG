board_beg(
[
    [empty, empty, empty, empty, empty],
    [empty, white, white, white, empty],
    [empty, empty, empty, empty, empty],
    [empty, black, black, black, empty],
    [empty, empty, empty, empty, empty] 
]).

board_mid(
[
    [empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty],
    [empty, empty, black, white, white],
    [empty, empty, black, black, white]
]).

board_end(
[
    [empty, empty, empty, empty, empty],
    [empty, white, empty, empty, empty],
    [empty, empty, empty, black, white],
    [empty, black, empty, empty, white],
    [empty, empty, empty, empty, black]
]).

display_border :-
    write(' ----- ------- ------- ------- ------- -------').

display_player(Player, Color) :-
    nl,
    write('* Player: '),
    write(Player),
    write(' ('),
    write(Color),
    write(') *'),
    nl, nl.

display_cell(Cell) :-
    write(Cell),
    write(' |'),
    write(' ').

display_row([]) :-
    nl,
    display_border,
    nl.

display_row([Head|Tail]) :-
    display_cell(Head),
    display_row(Tail).

display_board([], _).
display_board([Head|Tail], N) :-
    format('|  ~D  | ', [N]),
    display_row(Head),
    N1 is N + 1,
    display_board(Tail, N1).

display_game(_board, _current_player, Color) :-
    write('       ------- ------- ------- ------- -------\n'),
    write('      |   A   -   B   -   C   -   D   -   E   |\n'),
    display_border,
    nl,
    display_board(_board, 1), % 1 - starting row number
    display_player(_current_player, Color).

mainMenu(Choice) :-
    printMainMenu,
    write('Option: '),
    getChar(Char),
    (
        Char = '1',
        Choice = 1,
        nl
        ;
        Char = '2',
        halt
        ;
        nl,
        write('Invalid input. Try again.\n'),
        pressEnter,
        nl,
        mainMenu(Choice)
).

levelOption(Choice) :-
    printLevel,
    write('Option: '),
    getChar(Char),
    (
        Char = '1',
        Choice = 1,
        nl
        ;
        Char = '2',
        Choice = 2,
        nl
        ;
        nl,
        write('Invalid input. Try again.\n'),
        pressEnter,
        nl,
        mainMenu(Choice)
).

gameOption(Choice) :-
    printGameOption,
    write('Option: '),
    getChar(Char),
    (
        Char = '1',
        Choice = 1,
        nl
        ;
        Char = '2',
        Choice = 2,
        nl
        ;
        Char = '3',
        Choice = 3,
        nl
        ;
        nl,
        write('Invalid input. Try again.\n'),
        pressEnter,
        nl,
        gameOption(Choice)
).

printGameOption :-
    clearScreen,
    write(' ------- ------- ------- ------- ------- \n'),
    write('|                                       |\n'),
    write('| Game Mode                             |\n'),
    write('|                                       |\n'),
    write('| 1. Player vs Computer                 |\n'),
    write('| 2. Player vs Player                   |\n'),
    write('| 3. Computer vs Computer               |\n'),
    write('|                                       |\n'),
    write(' ------- ------- ------- ------- ------- \n\n\n').

printLevel :-
    clearScreen,
    write(' ------- ------- ------- ------- ------- \n'),
    write('|                                       |\n'),
    write('| Difficulty Level                      |\n'),
    write('|                                       |\n'),
    write('| 1. Easy                               |\n'),
    write('| 2. Hard                               |\n'),
    write('|                                       |\n'),
    write(' ------- ------- ------- ------- ------- \n\n\n').

printMainMenu :-
    clearScreen,
    write(' ------- ------- ------- ------- ------- \n'),
    write('|                                       |\n'),
    write('| Nudge                                 |\n'),
    write('|                                       |\n'),
    write('| 1. Start Game                         |\n'),
    write('| 2. Exit                               |\n'),
    write('|                                       |\n'),
    write('|                                       |\n'),
    write('| Choose an option:                     |\n'),
    write(' ------- ------- ------- ------- ------- \n\n\n').

playerOneWins :-
    write(' ____  _                          ___                        _           _ \n'),
    write('|  _ \\| | __ _ _   _  ___ _ __   / _ \\ _ __   ___  __      _(_)_ __  ___| |\n'),
    write('| |_) | |/ _` | | | |/ _ \\ \'__| | | | | \'_ \\ / _ \\ \\ \\ /\\ / / | \'_ \\/ __| |\n'),
    write('|  __/| | (_| | |_| |  __/ |    | |_| | | | |  __/  \\ V  V /| | | | \\__ \\_|\n'),
    write('|_|   |_|\\__,_|\\__, |\\___|_|     \\___/|_| |_|\\___|   \\_/\\_/ |_|_| |_|___(_)\n'),
    write('               |___/                                                       \n'),
    !,
    fail.

playerTwoWins :-
    write(' ____  _                         _____                          _           _\n'),
    write('|  _ \\| | __ _ _   _  ___ _ __  |_   _|_      _____   __      _(_)_ __  ___| |\n'),
    write('| |_) | |/ _` | | | |/ _ \\ \'__|   | | \\ \\ /\\ / / _ \\  \\ \\ /\\ / / | \'_ \\/ __| |\n'),
    write('|  __/| | (_| | |_| |  __/ |      | |  \\ V  V / (_) |  \\ V  V /| | | | \\__ \\_|\n'),
    write('|_|   |_|\\__,_|\\__, |\\___|_|      |_|   \\_/\\_/ \\___/    \\_/\\_/ |_|_| |_|___(_)\n'),
    write('               |___/                                                       \n'),
    !,
    fail.
