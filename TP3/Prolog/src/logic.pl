setPiece(Row, Column, Piece, TabIn, TabOut) :-
    setRow(Row, Column, Piece, TabIn, TabOut).

% rows
% ------------------------

setRow(1, Column, Piece, [Row|More], [NovaRow|More]) :-
    setColumn(Column, Piece, Row, NovaRow).

setRow(N, Column, Piece, [Row|Tail], [Row|NewTail]) :-
    N > 1,
    Next is N - 1,
    setRow(Next, Column, Piece, Tail, NewTail).

% columns
% ------------------------

setColumn(1, Piece, [_|More], [Piece|More]).

setColumn(N, Piece, [X|Tail], [X|NewTail]) :-
    N > 1,
    Next is N - 1,
    setColumn(Next, Piece, Tail, NewTail).

% ------------------------

% main game loop
game(Board, Player1, Player2, GameStatus, GameChoice, GameLevel) :-
(
    (
        GameChoice \== 3, % Player vs Player or Computer vs Player 
        once(whiteTurn(Board, Board, BoardWhite1, Player1, GameStatus, white)),   
        once(game_over(GameStatus, '1')),
        once(whiteTurn(Board, BoardWhite1, BoardWhite2, Player2, GameStatus, black)),
        once(game_over(GameStatus, '1'))
        ;
        GameChoice == 3, % Computer vs Computer
        aiTurn(Board, Board, Player1, Player2, white, black, GameStatus, BoardWhite2, GameLevel, _,_,_,_,_,_,_,_)
    ),
    (
        GameChoice \== 2, % Computer vs Player or Computer vs Computer
        once((BoardWhite1 = Board ; BoardWhite1 = BoardWhite1)), % Board for Computer vs Computer, BoardWhite1 for Player vs Computer
        aiTurn(BoardWhite1, BoardWhite2, Player2, Player1, black, white, GameStatus, BoardNext, GameLevel, _,_,_,_,_,_,_,_)
        ;
        GameChoice == 2, % Player vs Player
        once(blackTurn(BoardWhite1, BoardWhite2, BoardBlack1, Player2, GameStatus, black)),
        once(game_over(GameStatus, '2')),
        once(blackTurn(BoardWhite2, BoardBlack1, BoardNext, Player1, GameStatus, white)),
        once(game_over(GameStatus, '2'))
    ),
    game(BoardNext, Player1, Player2, GameStatus, GameChoice, GameLevel)
    ;
    write('\n* Thank you for playing! *\n\n'),
    !
).

% ai's double turn
aiTurn(PreviousBoard, Board, _, Player2, Color, Adversary, GameStatus, BoardAI, GameLevel, Row, Column, NewRow, NewColumn, Row2, Column2, NewRow2, NewColumn2) :-
    % finds all possible plays with just one movement
    once(findall(FinalBoard-Row-Column-NewRow-NewColumn, moveAI(PreviousBoard, Board, FinalBoard, Color, Adversary, GameStatus, Row, Column, NewRow, NewColumn), AllBoards1)),
    % if there's any chance to win, those boards are put on NewWin1
    once(value(AllBoards1, _, NewWin1, _, _, Adversary)),
    length(NewWin1, L),
    (
        % if on hard level, it makes a win move if possible
        GameLevel == 2,
        L \== 0,
        random_member(BoardAIII, NewWin1),
        [BoardAI-Row-Column-NewRow-NewColumn] = BoardAIII
        ;
        % if on easy level or no winning moves found with just one movement, it finds all possible plays with a second movement
        once(valid_moves(AllBoards1, PreviousBoard, Color, Adversary, GameStatus, _, AllBoards)),
        once(value2(AllBoards, _, NewWin, _, NewOther, Adversary)),
        % according to the gameLevel it either chooses randomnly or a winning movement
        once(choose_move(NewWin, NewOther, BoardAIII, GameLevel)),
        BoardAI-Row-Column-NewRow-NewColumn-Row2-Column2-NewRow2-NewColumn2 = BoardAIII
    ),
    once(display_game(BoardAI, Player2, Adversary)),
    (
        once(gameOverAI(BoardAI, Adversary, 1))
        %sleep(1)
        ;
        !,
        fail
).

% standard white piece turn
whiteTurn(PreviousBoard, Board, FinalBoard, Player, GameStatus, DisplayColor) :-
    once(move(PreviousBoard, Board, FinalBoard, white, black, Player, GameStatus, DisplayColor)).

% standard black piece turn
blackTurn(PreviousBoard, Board, FinalBoard, Player, GameStatus, DisplayColor) :-
    once(move(PreviousBoard, Board, FinalBoard, black, white, Player, GameStatus, DisplayColor)).

% reads coordinates and if everything succeeds, the move is made
move(PreviousBoard, Board, FinalBoard, Color, Adversary, Player, GameStatus, DisplayColor) :-
    repeat,
    (
        readCoordinates(CRow, CColumn, 'Current'),
        checkPosition(CRow, CColumn, Color, Board),
        readCoordinates(NRow, NColumn, 'New'),
        checkMove(CRow, CColumn, NRow, NColumn, Color, Adversary, Board, FinalBoard, PreviousBoard, GameStatus),
        display_game(FinalBoard, Player, DisplayColor)
        ;
        write('* Try again! *\n\n'),
        fail
).

% checks whether the game is over (GameStatus \== 1) and prints the winner (Winner)
game_over(GameStatus, Winner) :-
    (   
        GameStatus \== 1
        ;
        Winner == '1',
        playerOneWins
        ;
        Winner == '2',
        playerTwoWins
).
