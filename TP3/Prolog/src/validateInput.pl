% row validation
% ------------------------

readRow(Row, Status) :-
    write(Status),
    write(' Row '),
    inputRow(Row),
    validateRowInput(Row).

inputRow(Row) :-
    read(Row).

validateRowInput(Row) :-
    (
        Row =< 5,
        Row >= 1
        ;
        write('\nInvalid row!\n\n'),
        fail
).

% column validation
% ------------------------

readColumn(Column, Status) :-
    write(Status),
    write(' Column '),
    inputColumn(TempColumn),
    validateColumnInput(TempColumn, Column),
    write('\n').

inputColumn(TempColumn) :-
    read(TempColumn).

validateColumnInput('A', Column) :-
    Column = 1.
validateColumnInput('B', Column) :-
    Column = 2.
validateColumnInput('C', Column) :-
    Column = 3.
validateColumnInput('D', Column) :-
    Column = 4.
validateColumnInput('E', Column) :-
    Column = 5.

validateColumnInput(_Column, Column) :-
    write('\nInvalid column!\n\n'),
    inputColumn(Column),
    validateColumnInput(Column).

% checks if a Piece is in that place (Row, Column)
% ------------------------

checkPosition(Row, Column, Piece, Board) :-
    getRow(Row, Column, Piece, Board).

getRow(1, Column, Piece, [Row|_More]) :-
    getColumn(Column, Row, Piece).

getRow(N, Column, Piece, [_Row|Tail]) :-
    N > 1,
    Next is N - 1,
    getRow(Next, Column, Piece, Tail).

% ------------

getColumn(1, [Current|_More], Piece) :-
    (
        Piece == Current
        ;
        fail
).

getColumn(N, [_X|Tail], Piece) :-
    N > 1,
    Next is N - 1,
    getColumn(Next, Tail, Piece).

% check move possibilities
% ------------------------

% verifies if a given move (CRow, CColumn) -> (NRow, NColumn) is valid
checkMove(CRow, CColumn, NRow, NColumn, Color, Adversary, Board, FinalBoard, PreviousBoard, GameStatus) :-
    (
        once(checkSamePosition(CRow, NRow, CColumn, NColumn)),
        once(checkNudge(CRow, CColumn, CRow, CColumn, NRow, NColumn, Color, Adversary, Board, FinalBoard, 0, GameStatus, 1)),
        once(checkDiagonal(CRow, CColumn, NRow, NColumn)),
        once(checkReturnPosition(PreviousBoard, FinalBoard, 1))
        ;
        fail
).

% checks if the player is trying to move to the same place
checkSamePosition(CRow, NRow, CColumn, NColumn) :-
    (
        CRow \= NRow
        ;
        CColumn \= NColumn
        ;
        write('You are already there!\n\n'),
        fail
).
% checks if the player is trying to return to the same place in the same turn
checkReturnPosition(PreviousBoard, FinalBoard, MessageOn) :-
    (
        PreviousBoard \= FinalBoard
        ;
        MessageOn == 1,
        write('Cannot return to the starting position!\n'),
        fail
        ;
        fail
).

% checks if the player is trying to move diagonally
checkDiagonal(CRow, CColumn, NRow, NColumn) :-
    (
        % just moving columns
        abs(CColumn - NColumn) =:= 1,
        CRow - NRow =:= 0
        ;
        % just moving rows
        abs(CRow - NRow) =:= 1,
        CColumn - NColumn =:= 0
        ;
        % moving more than a cell vertically
        abs(CColumn - NColumn) =\= 1,
        CRow - NRow =:= 0,
        write('Can\'t move more than a cell at a time!\n'),
        fail
        ;
        % moving more than a cell horizontally
        abs(CRow - NRow) =\= 1,
        CColumn - NColumn =:= 0,
        write('Can\'t move more than a cell at a time!\n'),
        fail
        ;
        % both movements -> diagonally
        abs(CColumn - NColumn) =:= 1,
        abs(CRow - NRow) =:= 1,
        write('Diagonals are not allowed!\n'),
        fail
).

% checks if the player is trying to nudge incorrectly
checkNudge(IRow, IColumn, CRow, CColumn, NRow, NColumn, Color, Adversary, Board, FinalBoard, N, GameStatus, MessageOn) :-
    (
        % standard move
        checkPosition(NRow, NColumn, empty, Board),
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, FinalBoard)
        ;
        % nudging opponents
        checkPosition(NRow, NColumn, Adversary, Board),
        N > 0,
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, MidBoard1),
        findCoordinates(CRow, CColumn, NRow, NColumn, TRow, TColumn),
        checkPosition(TRow, TColumn, empty, Board),
        checkLimits(TRow, TColumn),
        setPiece(TRow, TColumn, Adversary, MidBoard1, FinalBoard)
        ;
        % nudging out of the board (2 to 1)
        checkPosition(NRow, NColumn, Adversary, Board),
        N > 0,
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, FinalBoard),
        findCoordinates(CRow, CColumn, NRow, NColumn, TRow, TColumn),
        (TRow < 1 ; TColumn < 1 ; TRow > 5 ; TColumn > 5),
        GameStatus = 1
        ;
        % nudging out of the board (3 to 2)
        N > 1,
        checkPosition(NRow, NColumn, Adversary, Board),
        findCoordinates(NRow, NColumn, CRow, CColumn, TRow, TColumn),
        findCoordinates(CRow, CColumn, NRow, NColumn, TTRow, TTColumn),
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, MidBoard1),
        setPiece(TRow, TColumn, empty, MidBoard1, MidBoard2),
        setPiece(TTRow, TTColumn, Color, MidBoard2, FinalBoard),
        GameStatus = 1
        ;
        % standard nudge
        checkPosition(NRow, NColumn, Color, Board),
        findCoordinates(CRow, CColumn, NRow, NColumn, NNRow, NNColumn),
        Next is N + 1, % counts the number of pieces nudging
        checkNudge(IRow, IColumn, NRow, NColumn, NNRow, NNColumn, Color, Adversary, Board, MidBoard, Next, GameStatus, MessageOn),
        setPiece(IRow, IColumn, empty, MidBoard, FinalBoard)
        ;
        % invalid nudge with warning message being displayed
        MessageOn == 1,
        write('Invalid Nudge!\n'),
        fail
        ;
        % invalid nudge without warning message being displayed
        fail
).
