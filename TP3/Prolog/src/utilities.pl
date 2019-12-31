clearScreen :-
	write('\33\[2J').

getChar(Input) :-
  get_char(Input),
  get_char(_).

pressEnter :-
  write('Press <ENTER> to continue.\n\n'),
  get_char(_).

% reads coordinates (Row, Column)
readCoordinates(Row, Column, Status) :-
  once(readRow(Row, Status)),
  once(readColumn(Column, Status)).

% verifies if a given coordinate is inside the board
checkLimits(Row, Column) :-
  (
    Row > 0,
    Row < 6,
    Column > 0,
    Column < 6
    ;
    fail
).

% generates sequential value for the Row and Column argument
genPosition(Row, Column) :-
  member(Row, [1, 2, 3, 4, 5]),
  member(Column, [1, 2, 3, 4, 5]).
  
% randomly selects one of the possible boards
choose_move(Win, Other, BoardAI, GameLevel) :-
  length(Win, X),
  (
    % easy level - random board chosen
    GameLevel == 1,
    join_lists(Win, Other, Boards),
    random_select(BoardAI, Boards, _)
    ;
    % hard level - random winning board chosen and if there are none, another random board is chosen
    (
      X \== 0,
      random_select(BoardAI, Win, _)
      ;
      random_select(BoardAI, Other, _)
    )
).

% finds coordinates of new positions for nudges (symmetric)
findCoordinates(Row, Column, ARow, AColumn, NRow, NColumn) :-
  NRow is 2 * ARow - Row,
  NColumn is 2 * AColumn - Column.

% counts the number of pieces with a given Color present on that Board
pieceCounter(Board, FinalBoard, Color) :-
    genPosition(Row, Column),
    checkPosition(Row, Column, Color, Board),
    FinalBoard = Board.

% appends two lists into another list
join_lists([], L, L).
join_lists([X|L1], L2, [X|L3]) :- 
  join_lists(L1, L2, L3).
