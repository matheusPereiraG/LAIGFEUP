:- use_module(library(random)). %can we please use it?
:-dynamic save_bot_play/2. % X and Y

game_over(Board,1,End):-
             (\+find_elem(Board, _, _, 'B') -> (End is 1)) ;
             End is 0.
game_over(Board,2,End):-
             (\+find_elem(Board, _, _, 'W') -> ( End is 1));
             End is 0.

%nl, write('Game is over'), nl,write('Player: '), write('2(B) won.'),
%nl, write('Game is over'), nl,write('Player: '), write('1(W) won.'),

%get PVP player char
get_player_char(1,PlayerChar):-
              PlayerChar = 'W'.
get_player_char(2,PlayerChar):-
              PlayerChar = 'B'.

%get PVE player char with one extra argument (human player piece option) 1-White,2-Black
getPVE_player_char(1,1,PlayerChar):-
  PlayerChar = 'W'.
getPVE_player_char(1,2,PlayerChar):-
  PlayerChar = 'B'.
getPVE_player_char(2,1,PlayerChar):-
  PlayerChar = 'B'.
getPVE_player_char(2,2,PlayerChar):-
  PlayerChar = 'W'.

char_to_int('0', 1).
char_to_int('1', 2).
char_to_int('2', 3).
char_to_int('3', 4).
char_to_int('4', 5).
char_to_int('5', 6).
char_to_int('6', 7).
char_to_int('7', 8).
char_to_int('8', 9).
char_to_int('9', 10).


%computes value
value(_,_,[],_,_,_,[]).
value(1,PlayerChar,[Head|Tail],LineCounter,ColumnCounter,Board,[LinePieces|T]):-
  line_value(1,PlayerChar,Head,LineCounter,ColumnCounter,Board,LinePieces),
  X is LineCounter +1,
  value(1,PlayerChar,Tail,X,ColumnCounter,Board,T).

value(2,PlayerChar,[Head|Tail],LineCounter,ColumnCounter,Board,[LinePieces|T]):-
  line_value(2,PlayerChar,Head,LineCounter,ColumnCounter,Board,LinePieces),
  X is LineCounter +1,
  value(2,PlayerChar,Tail,X,ColumnCounter,Board,T).

%end of line
line_value(_,_,[],_,_,_,[]).
%for player 1 white pieces
line_value(1,PlayerChar,[Head|Tail],LineCounter,ColumnCounter,Board,[Piece|Rest]):-
  Head == PlayerChar,
  X is LineCounter +1,
  Y is ColumnCounter +1,
  count(can_eat(Board,PlayerChar,X,Y),Count),
  Piece = [X,Y,Count], %stores x,y and how many pieces it can eat
  line_value(1,PlayerChar,Tail,LineCounter,Y,Board,Rest).

%for player 2 black pieces
line_value(2,PlayerChar,[Head|Tail],LineCounter,ColumnCounter,Board,[Piece|Rest]):-
  Head == PlayerChar,
  X is LineCounter +1,
  Y is ColumnCounter +1,
  count(can_eat(Board,PlayerChar,X,Y),Count),
  Piece = [X,Y,Count],
  line_value(2,PlayerChar,Tail,LineCounter,Y,Board,Rest).

%in case is neither Black or White
line_value(Player,PlayerChar,[_|Tail],LineCounter,ColumnCounter,Board,PieceValues):-
  Y is ColumnCounter +1,
  line_value(Player,PlayerChar,Tail,LineCounter,Y,Board,PieceValues).

%count solutions of can_eat
count(Predicate,Count) :-
  findall(1,Predicate,L),
  length(L,Count).

%transform a list of lists in a sigle list
just_one_list([[Head|Tail]|X], [Head|Y]):-
  append(X, [Tail], X2),
  just_one_list(X2, Y).
just_one_list([], []).
just_one_list([[]|T], []) :-
 just_one_list(T, []).

%used by predsort to order the list
nthcompare(N,<,A,B) :- nth0(N,A,X),nth0(N,B,Y), X @> Y.
nthcompare(_,>,_,_).

%pick target, goes through list of ordered enemy pieces until finds the most valuable piece to eat
pick_target(Board,PlayerChar,X,Y,Type,[Head|_]):-
  nth0(0,Head,Xt),
  nth0(1,Head,Yt),
  move(Board,PlayerChar,X,Y,Xt,Yt,Type),!,
  assert(save_bot_play(Xt,Yt)).

%this runs in case move fails
pick_target(Board,PlayerChar,X,Y,Type,[_|Tail]):-
  pick_target(Board,PlayerChar,X,Y,Type,Tail).

%%VALIDATE INPUTS
valid_moves(Board,Player,X,Y,Type):-
              is_same_team(Board,Player,X,Y),
              can_eat(Board,Player,X,Y),
              Type is 1.
valid_moves(Board,Player,X,Y,Type):-
              is_same_team(Board,Player,X,Y),
              can_eat_from(Board, Player, X, Y),
              Type is 2.

can_eat(Board, Player, X, Y):-
              up_left_info(Board,X,Y,Player,Found1),
              up_right_info(Board,X,Y,Player,Found2),
              down_right_info(Board,X,Y,Player,Found3),
              down_left_info(Board,X,Y,Player,Found4),
              !,
              (Found1 == 1; Found2 == 1; Found3 == 1; Found4 == 1).
can_eat_from(Board, Player, X, Y):-
              up_left_info_2(Board,X,Y,Player,Found1),
              up_right_info_2(Board,X,Y,Player,Found2),
              down_right_info_2(Board,X,Y,Player,Found3),
              down_left_info_2(Board,X,Y,Player,Found4),
              !,
              nl,
              %write('CAN EAT FROM'), nl,
              %write('UP_LEFT: '), write(Found1), write('  '),
              %write('UP_RIGHT: '), write(Found2),write('  '),
              %write('DOWN_RIGHT: '), write(Found3),write('  '),
              %write('DOWN_LEFT: '), write(Found4),write('  '),
              nl,
              (Found1 == 3; Found2 == 3; Found3 == 3; Found4 == 3).
move(Board,Player,X,Y,Xf,Yf,1):-
              up_left_info(Board,X,Y,Player,Found1,Xf,Yf),
              up_right_info(Board,X,Y,Player,Found2,Xf,Yf),
              down_right_info(Board,X,Y,Player,Found3,Xf,Yf),
              down_left_info(Board,X,Y,Player,Found4,Xf,Yf),
              !,
              (Found1 == 1; Found2 == 1; Found3 == 1; Found4 == 1).
move(Board,Player,X,Y,Xf,Yf,2):-
              up_left_info_2(Board,X,Y,Player,Found1,Xf,Yf),
              up_right_info_2(Board,X,Y,Player,Found2,Xf,Yf),
              down_right_info_2(Board,X,Y,Player,Found3,Xf,Yf),
              down_left_info_2(Board,X,Y,Player,Found4,Xf,Yf),
              (Found1 == 3; Found2 == 3; Found3 == 3; Found4 == 3).
move(_,_,_,_,_,_):-
              write("Se esta mensagem aparecer significa que deu erro").

%%RULES STUFF
other_team(Board,X,Y,Player):-
              find_elem(Board,X,Y,Elem),
              Elem \= Player,
              Elem \= '-'.
same_team(Board,X,Y,Player):-
              find_elem(Board,X,Y,Elem),
              Elem == Player.
is_same_team(Board,Player,X,Y):-
              find_elem(Board, X, Y, Player).
no_team(Board,X,Y):-
              find_elem(Board,X,Y,Elem),
              Elem == '-'.




%Check next tile from Piece Selected in full diagonal direction, 1 if other team else 2, 0 if nothing
up_left_info(_,1,_,_,Found):- Found is 0.
up_left_info(_,_,1,_,Found):- Found is 0.
up_left_info(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              Found is 1.
up_left_info(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_left_info(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              up_left_info(Board,X1,Y1,Player,Found).
up_right_info(_,1,_,_,Found):- Found is 0.
up_right_info(_,_,10,_,Found):- Found is 0.
up_right_info(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              Found is 1.
up_right_info(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_right_info(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              up_right_info(Board,X1,Y1,Player,Found).
down_right_info(_,10,_,_,Found):- Found is 0.
down_right_info(_,_,10,_,Found):- Found is 0.
down_right_info(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              Found is 1.
down_right_info(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_right_info(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              down_right_info(Board,X1,Y1,Player,Found).
down_left_info(_,10,_,_,Found):- Found is 0.
down_left_info(_,_,1,_,Found):- Found is 0.
down_left_info(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              Found is 1.
down_left_info(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_left_info(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              down_left_info(Board,X1,Y1,Player,Found).


%Check next tile from Piece Selected in full diagonal direction, 3 if can eat from there
up_left_info_2(_,1,_,_,Found):- Found is 0.
up_left_info_2(_,_,1,_,Found):- Found is 0.
up_left_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              no_team(Board,X1,Y1),
              can_eat(Board,Player,X1,Y1) -> Found is 3.
up_left_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              Found is 1.
up_left_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_left_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              up_left_info_2(Board,X1,Y1,Player,Found).


up_right_info_2(_,1,_,_,Found):- Found is 0.
up_right_info_2(_,_,10,_,Found):- Found is 0.
up_right_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              no_team(Board,X1,Y1),
              can_eat(Board,Player,X1,Y1) -> Found is 3.
up_right_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              Found is 1.
up_right_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_right_info_2(Board,X,Y,Player,Found):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              up_right_info_2(Board,X1,Y1,Player,Found).


down_right_info_2(_,10,_,_,Found):- Found is 0.
down_right_info_2(_,_,10,_,Found):- Found is 0.
down_right_info_2(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              no_team(Board,X1,Y1),
              can_eat(Board,Player,X1,Y1) -> Found is 3.
down_right_info_2(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              Found is 1.
down_right_info_2(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_right_info_2(Board,X,Y,Player,Found):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              down_right_info_2(Board,X1,Y1,Player,Found).

down_left_info_2(_,10,_,_,Found):- Found is 0.
down_left_info_2(_,_,1,_,Found):- Found is 0.
down_left_info_2(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              no_team(Board,X1,Y1),
              can_eat(Board,Player,X1,Y1) -> Found is 3.
down_left_info_2(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              Found is 1.
down_left_info_2(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_left_info_2(Board,X,Y,Player,Found):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              down_left_info_2(Board,X1,Y1,Player,Found).



%Check next tile from Piece Selected in full diagonal direction, 1 if other team else 2, 0 if nothing
%Check if target matches a eating move
up_left_info(_,1,_,_,Found,_,_):- Found is 0.
up_left_info(_,_,1,_,Found,_,_):- Found is 0.
up_left_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              ((X1 == Xf, Y1 == Yf -> Found is 1);true).
up_left_info(Board,X,Y,Player,Found,_,_):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_left_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              up_left_info(Board,X1,Y1,Player,Found,Xf,Yf).

up_right_info(_,1,_,_,Found,_,_):- Found is 0.
up_right_info(_,_,10,_,Found,_,_):- Found is 0.
up_right_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              ((X1 == Xf, Y1 == Yf -> Found is 1);true).
up_right_info(Board,X,Y,Player,Found,_,_):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_right_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              up_right_info(Board,X1,Y1,Player,Found, Xf,Yf).

down_right_info(_,10,_,_,Found,_,_):- Found is 0.
down_right_info(_,_,10,_,Found,_,_):- Found is 0.
down_right_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              ((X1 == Xf, Y1 == Yf -> Found is 1);true).
down_right_info(Board,X,Y,Player,Found,_,_):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_right_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              down_right_info(Board,X1,Y1,Player,Found,Xf,Yf).

down_left_info(_,10,_,_,Found,_,_):- Found is 0.
down_left_info(_,_,1,_,Found,_,_):- Found is 0.
down_left_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              other_team(Board,X1,Y1,Player),
             ((X1 == Xf, Y1 == Yf -> Found is 1);true).
down_left_info(Board,X,Y,Player,Found,_,_):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_left_info(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              down_left_info(Board,X1,Y1,Player,Found,Xf,Yf).


%Check next tile from Piece Selected in full diagonal direction, 3 if can eat from there
%Check if target matches a move to a place where you can eat
up_left_info_2(_,1,_,_,Found,_,_):- Found is 0.
up_left_info_2(_,_,1,_,Found,_,_):- Found is 0.
up_left_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              no_team(Board,X1,Y1),
              (can_eat(Board,Player,X1,Y1), X1==Xf, Y1==Yf) -> Found is 3.
up_left_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              Found is 1.
up_left_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_left_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y-1,
              X1 > 0, Y1 > 0,
              up_left_info_2(Board,X1,Y1,Player,Found,Xf,Yf).

up_right_info_2(_,1,_,_,Found,_,_):- Found is 0.
up_right_info_2(_,_,10,_,Found,_,_):- Found is 0.
up_right_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              no_team(Board,X1,Y1),
              (can_eat(Board,Player,X1,Y1), X1==Xf, Y1==Yf) -> Found is 3.
up_right_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              Found is 1.
up_right_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
up_right_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X-1,Y1 is Y+1,
              X1 > 0, Y1 < 11,
              up_right_info_2(Board,X1,Y1,Player,Found,Xf,Yf).

down_right_info_2(_,10,_,_,Found,_,_):- Found is 0.
down_right_info_2(_,_,10,_,Found,_,_):- Found is 0.
down_right_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              no_team(Board,X1,Y1),
              (can_eat(Board,Player,X1,Y1), X1==Xf, Y1==Yf) -> Found is 3.
down_right_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              other_team(Board,X1,Y1,Player),
              Found is 1.
down_right_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_right_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1,Y1 is Y+1,
              X1 < 11, Y1 < 11,
              down_right_info_2(Board,X1,Y1,Player,Found,Xf,Yf).

down_left_info_2(_,10,_,_,Found,_,_):- Found is 0.
down_left_info_2(_,_,1,_,Found,_,_):- Found is 0.
down_left_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              no_team(Board,X1,Y1),
              (can_eat(Board,Player,X1,Y1), X1==Xf, Y1==Yf) -> Found is 3.
down_left_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              other_team(Board,X1,Y1,Player),
              Found is 1.
down_left_info_2(Board,X,Y,Player,Found,_,_):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              same_team(Board,X1,Y1,Player),
              Found is 2.
down_left_info_2(Board,X,Y,Player,Found,Xf,Yf):-
              X1 is X+1, Y1 is Y-1,
              X1 < 11, Y1 > 0,
              down_left_info_2(Board,X1,Y1,Player,Found,Xf,Yf).
