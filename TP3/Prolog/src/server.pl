:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:-consult('nudge.pl').

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

parse_input(play, Board):-
	board_beg(Board),
	write(Board).

parse_input(board(Board),good):-
	board_beg(Board).

parse_input(move(CRow, CColumn, NRow, NColumn, Color, Adversary, Board, PreviousBoard), [Valid, Nudge, GameStatus, FinalBoard]) :-
	(
		checkPosition(CRow, CColumn, Color, Board),
		checkSamePosition(CRow, NRow, CColumn, NColumn),
		checkNudge1(CRow, CColumn, CRow, CColumn, NRow, NColumn, Color, Adversary, Board, FinalBoard, 0, GameStatus, 1, Nudge),
		checkDiagonal(CRow, CColumn, NRow, NColumn),
		checkReturnPosition(PreviousBoard, FinalBoard, 1),
		(
			GameStatus == 1
			;
			GameStatus = 0
		),
		Valid = yes
	)
	;
	(
		Valid = no,
		GameStatus = 0,
		Nudge = no,
		FinalBoard = [[]]
).

parse_input(ai(Color, Adversary, Board, PreviousBoard), [Row, Column, NewRow, NewColumn, Row2, Column2, NewRow2, NewColumn2, GameStatus, BoardAI]) :-
	aiTurn(PreviousBoard, Board, _, Adversary, Color, Adversary, GameStatus, BoardAI, 2, Row, Column, NewRow, NewColumn, Row2, Column2, NewRow2, NewColumn2).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

checkNudge1(IRow, IColumn, CRow, CColumn, NRow, NColumn, Color, Adversary, Board, FinalBoard, N, GameStatus, MessageOn, Nudge) :-
    (
        % standard move
        checkPosition(NRow, NColumn, empty, Board),
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, FinalBoard),
		Nudge = no
        ;
        % nudging opponents
        checkPosition(NRow, NColumn, Adversary, Board),
        N > 0,
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, MidBoard1),
        findCoordinates(CRow, CColumn, NRow, NColumn, TRow, TColumn),
        checkPosition(TRow, TColumn, empty, Board),
        checkLimits(TRow, TColumn),
        setPiece(TRow, TColumn, Adversary, MidBoard1, FinalBoard),
		Nudge = yes
        ;
        % nudging out of the board (2 to 1)
        checkPosition(NRow, NColumn, Adversary, Board),
        N > 0,
        setPiece(IRow, IColumn, empty, Board, MidBoard),
        setPiece(NRow, NColumn, Color, MidBoard, FinalBoard),
        findCoordinates(CRow, CColumn, NRow, NColumn, TRow, TColumn),
        (TRow < 1 ; TColumn < 1 ; TRow > 5 ; TColumn > 5),
        GameStatus = 1,
		Nudge = yes
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
        GameStatus = 1,
		Nudge = yes
        ;
        % standard nudge
        checkPosition(NRow, NColumn, Color, Board),
        findCoordinates(CRow, CColumn, NRow, NColumn, NNRow, NNColumn),
        Next is N + 1, % counts the number of pieces nudging
        checkNudge(IRow, IColumn, NRow, NColumn, NNRow, NNColumn, Color, Adversary, Board, MidBoard, Next, GameStatus, MessageOn),
        setPiece(IRow, IColumn, empty, MidBoard, FinalBoard),
		Nudge = yes
        ;
        % invalid nudge with warning message being displayed
        MessageOn == 1,
        write('Invalid Nudge!\n'),
        fail
        ;
        % invalid nudge without warning message being displayed
        fail
).
