%TERMINAL 14 NORMAL
:- include('matrix_logic.pl').
:- include('game_logic').
:- include('board.pl').
:- include('utils.pl').

%%%%USE THIS TO START
play:-
    splash.

%% game_cycle(+Board,+Player,+End,+Turn). % Player = 1;2   %End = 0;1
game_cycle(Board,Player,1,_):-
    cls(100), %Clear 100 lines
    display_title,
    print_board(Board), nl, nl,
    player_won(Player), nl, nl,
    press_zero_back, splash.

game_cycle(Board,Player,_,Turn):-
    cls(100),

    get_turn(Player,Turn,NewTurn), %Player == 1 -> (NewTurn == Turn++) ; NewTurn == Turn.
    get_player_char(Player,PlayerChar), % Player == 1 -> W ; Player == 2 -> B

    % DISPLAY: neutral board
    display_title,
    print_board(Board),
    print_information(Board,NewTurn), nl,nl, % Print: number of pieces for each player
    show_player(Player,PlayerChar,NextPlayer),nl, %Print: player Playing

    % READ: select
    repeat,
        write('Select Piece:'),nl,
        get_input(Xi,Yi),
        write(Xi),nl,write(Yi),
        (valid_moves(Board,PlayerChar,Xi,Yi,Type)->!;
        msg_pos_error, fail)
    ,

    % DISPLAY: selected piece highlighted
    cls(100),

    Xii is Xi-1, Yii is Yi-1, % Board is [1-10], replace takes [0-9]
    replace(Board,Xii,Yii,'X',TempBoard), % Change selected piece into X temporarily

    display_title,
    print_board(TempBoard),
    print_information(Board,NewTurn), nl,nl,
    write('Player '), write(Player), write(' ('),write(PlayerChar), write(')'),nl, % Print: player Playing

    piece_must(Type),nl,nl,  % Print: what kind of move should be done

    % READ: target
    repeat,
        write('Select Target:'),nl,
        get_input(Xf,Yf),
        (move(Board,PlayerChar,Xi,Yi,Xf,Yf,Type)->!;
         msg_target_error, fail)
    ,


    Xff is Xf-1, Yff is Yf-1, % Board is [1-10], replace takes [0-9]
    replace(Board,Xii,Yii,'-',NewBoard), % point of selected piece -> empty
    replace(NewBoard,Xff,Yff,PlayerChar,NewNewBoard), % target point -> selected piece
    write(NewNewBoard),

    game_over(NewNewBoard,Player,NewEnd), % Check if the player not playing this cycle lost
    write('\a'), % xp

    game_cycle(NewNewBoard,NextPlayer,NewEnd,NewTurn).

%%%%%%%MENU
%PLAY
%%1- Player versus Player
%%2- Player versus Environment
%%% 1 - EASY
%%% 2 - HARD
%%3- Environment versus Environment.
%%% 1 - EASY versus EASY
%%% 2 - EASY versus HARD
%%% 3 - HARD versus HARD
%INFO
%EXIT
% To call Main Menu
splash:-
    cls(200), write_big_name, nl,
    main_menu.

% Main menu
main_menu:-
    write_play,
    write_info,
    write_exit,
    cls(12),
    get_menu_input.
play_menu:-
    write_big_name, nl,
    write_pvp,nl,
    write_pve,nl,
    write_back,
    cls(12),
    get_game_mode_menu_input.
info_display:-
    cls, nl,
    ansi_format([fg(black)],'Mad Bishops is played on 10x10 checkerboard~w', [.]), nl,
    ansi_format([fg(black)],'The goal of Mad Bishops is to capture all opponent\'s pieces. No draws are possible~w', [.]), nl,nl,
    ansi_format([fg(black)],'A bishop moves exactly as in Chess: in any diagonal direction, landing on an empty square or on a square that is occupied by an enemy bishop. In this case the enemy bishop is captured and removed from the board. It is forbidden to jump over other bishops (either friendly or enemy ones)~w', [.]), nl,
    nl,ansi_format([fg(black)],'It is allowed to make two kinds of moves~w', [:]), nl,
    ansi_format([bold,fg(black)],'      If a player\'s bishop cannot capture any enemy bishop from its current position then this player\'s bishop can only move to a position where it can capture some enemy bishop~w', [.]), nl,
    ansi_format([bold,fg(black)],'      If a player\'s bishop can capture some enemy bishop then this player\'s bishop must perform a capturing move~w', [.]), nl,nl,nl,nl,
    write('Starting board: '),
    default_board(Board),
    print_board(Board),
    cls(4).

% Get input for Play Menu. 1 - PvP ; 2 - PVE ; 3 - EVE; 0 - Back
get_game_mode_menu_input:-
    write('Select an option: '), nl,
    repeat,
        get_char(X1),
		skip_line,
        char_to_int_menu(X1,X),
		skip_line,
        (check_game_mode_menu_input(X) -> !;
         fail),
        handle_game_mode_menu_input(X).

%% PLAY MENU: PvP Selected
%%CHANGE BOARD HERE
handle_game_mode_menu_input(1):-
    sdefault_board(Board),
    %default_board(Board),
    game_cycle(Board,1,0,0).
%% PLAY MENU: PvE Selected 0-Back, 1-Easy, 2-Hard
handle_game_mode_menu_input(2):-
  write('Select an option: 0-Back, 1-Easy or 2-Hard '), nl, %not a fancy menu, needs a change
  repeat,
  get_char(X1),
  skip_line,
  char_to_int_menu(X1,X),
  (check_difficulty_menu_input(X) -> !;
  fail),
  write('Now select player: 0-Back, 1-White pieces, 2-Black Pieces'),nl,
  repeat,
  get_char(X2),
  skip_line,
  char_to_int_menu(X2,Y),
  (check_player_selection(Y) ->!; fail),
  handle_difficulty_menu_input(X,Y).
%% PLAY MENU: Go Back Selected
handle_game_mode_menu_input(0):-
    splash.

%For easy difficulty
handle_difficulty_menu_input(1,PieceChoice):-
    default_board(Board), %sets default board
    %calls game cycle for PVE with one extra argument: difficulty: 0 easy, 1 hard
    choose_move(Board,1,0,0,0,PieceChoice).
%For hard difficulty
handle_difficulty_menu_input(2,PieceChoice):-
    default_board(Board),
    choose_move(Board,1,0,0,1,PieceChoice).
handle_difficulty_menu_input(0):-
    splash.


%% choose_move(+Board,+Player,+End,+Turn,+Difficulty,+PieceChoice).
choose_move(Board,Player,1,_,_,_):- %when the game is over this is called
  cls(100), %Clear 100 lines
  display_title,
  print_board(Board), nl, nl,
  player_won(Player), nl, nl,
  press_zero_back, splash.
%---------------------------------------EASY BOT PVE--------------------------------------------
%the cycle is the same as PVP when it comes to real player interface, cycle for PLAYER 1
choose_move(Board,1,_,Turn,0,PieceChoice):-
  Player is 1,
  get_turn(Player,Turn,NewTurn), %Player == 1 -> (NewTurn == Turn++) ; NewTurn == Turn.
  getPVE_player_char(1,PieceChoice,PlayerChar), % Player == 1 -> W ; Player == 2 -> B
  % DISPLAY: neutral board
  display_title,
  print_board(Board),
  print_information(Board,NewTurn), nl,nl, % Print: number of pieces for each player
  show_player(Player,PlayerChar,NextPlayer),nl, %Print: player Playing
  print_bot_play(Player,Turn),

  % READ: select
  repeat,
      write('Select Piece:'),nl,
      get_input(Xi,Yi),
      write(Xi),nl,write(Yi),
      (valid_moves(Board,PlayerChar,Xi,Yi,Type)->!;
      msg_pos_error, fail)
      ,

  % DISPLAY: selected piece highlighted
  cls(100),

  Xii is Xi-1, Yii is Yi-1, % Board is [1-10], replace takes [0-9]
  replace(Board,Xii,Yii,'X',TempBoard), % Change selected piece into X temporarily

  display_title,
  print_board(TempBoard),
  print_information(Board,NewTurn), nl,nl,
  write('Player '), write(Player), write(' ('),write(PlayerChar), write(')'),nl, % Print: player Playing

  piece_must(Type),nl,nl,  % Print: what kind of move should be done

  % READ: target
  repeat,
    write('Select Target:'),nl,
    get_input(Xf,Yf),
    (move(Board,PlayerChar,Xi,Yi,Xf,Yf,Type)->!;
    msg_target_error, fail)
    ,


   Xff is Xf-1, Yff is Yf-1, % Board is [1-10], replace takes [0-9]
   replace(Board,Xii,Yii,'-',NewBoard), % point of selected piece -> empty
   replace(NewBoard,Xff,Yff,PlayerChar,NewNewBoard), % target point -> selected piece

   game_over(NewNewBoard,Player,NewEnd), % Check if the player not playing this cycle lost
   write('\a'), % xp

   choose_move(NewNewBoard,NextPlayer,NewEnd,NewTurn,0,PieceChoice).
%here we process the steps the bot will do to play
choose_move(Board,2,_,Turn,0,PieceChoice):-
  Player is 2,
  get_turn(Player,Turn,NewTurn), %Player == 1 -> (NewTurn == Turn++) ; NewTurn == Turn.
  getPVE_player_char(2,PieceChoice,PlayerChar),
  show_player(Player,PlayerChar,NextPlayer),nl, %Print: player Playing
  %instead of asking for piece input, it randomly chooses a black piece to play
  repeat,
  random(0,9,X),
  random(0,9,Y),
  (valid_moves(Board,PlayerChar,X,Y,Type)->!;
  fail)
  ,
  Xi is X-1, Yi is Y-1, % Board is [1-10], replace takes [0-9]
  %now the target
  repeat,
  random(0,9,Xt),
  random(0,9,Yt),
  (move(Board,PlayerChar,X,Y,Xt,Yt,Type)->!;
  fail)
  ,
  Xf is Xt-1, Yf is Yt-1, % Board is [1-10], replace takes [0-9]
  replace(Board,Xi,Yi,'-',NewBoard), % point of selected piece -> empty
  replace(NewBoard,Xf,Yf,PlayerChar,NewNewBoard), % target point -> selected piece

  game_over(NewNewBoard,Player,NewEnd), % Check if the player not playing this cycle lost
  write('\a'), % xp

  assert(save_bot_play(Xi,Yi)),
  assert(save_bot_play(Xf,Yf)),

  choose_move(NewNewBoard,NextPlayer,NewEnd,NewTurn,0,PieceChoice).
%---------------------------------------HARD BOT PVE--------------------------------------------
%cycle for player 1, not different from the others
choose_move(Board,1,_,Turn,1,PieceChoice):-
  Player is 1,
  get_turn(Player,Turn,NewTurn), %Player == 1 -> (NewTurn == Turn++) ; NewTurn == Turn.
  getPVE_player_char(1,PieceChoice,PlayerChar),

  % DISPLAY: neutral board
  display_title,
  print_board(Board),
  print_information(Board,NewTurn), nl,nl, % Print: number of pieces for each player
  show_player(Player,PlayerChar,NextPlayer),nl, %Print: player Playing
  print_bot_play(Player,Turn),
  % READ: select
  repeat,
      write('Select Piece:'),nl,
      get_input(Xi,Yi),
      (valid_moves(Board,PlayerChar,Xi,Yi,Type)->!;
      msg_pos_error, fail)
      ,

  % DISPLAY: selected piece highlighted
  cls(100),

  Xii is Xi-1, Yii is Yi-1, % Board is [1-10], replace takes [0-9]
  replace(Board,Xii,Yii,'X',TempBoard), % Change selected piece into X temporarily

  display_title,
  print_board(TempBoard),
  print_information(Board,NewTurn), nl,nl,
  write('Player '), write(Player), write(' ('),write(PlayerChar), write(')'),nl, % Print: player Playing

  piece_must(Type),nl,nl,  % Print: what kind of move should be done

  % READ: target
  repeat,
    write('Select Target:'),nl,
    get_input(Xf,Yf),
    (move(Board,PlayerChar,Xi,Yi,Xf,Yf,Type)->!;
    msg_target_error, fail)
    ,


   Xff is Xf-1, Yff is Yf-1, % Board is [1-10], replace takes [0-9]
   replace(Board,Xii,Yii,'-',NewBoard), % point of selected piece -> empty
   replace(NewBoard,Xff,Yff,PlayerChar,NewNewBoard), % target point -> selected piece

   game_over(NewNewBoard,Player,NewEnd), % Check if the player not playing this cycle lost
   write('\a'), % xp

   choose_move(NewNewBoard,NextPlayer,NewEnd,NewTurn,1,PieceChoice).
%process the behavior of hard bot
choose_move(Board,2,_,Turn,1,PieceChoice):-
  Player is 2,
  get_turn(Player,Turn,NewTurn), %Player == 1 -> (NewTurn == Turn++) ; NewTurn == Turn.
  getPVE_player_char(2,PieceChoice,PlayerChar),
  show_player(Player,PlayerChar,NextPlayer), %Print: player Playing

  %computes the values to all pieces to be played (Player: 1 or 2, Board, X=0, Y=0 just for init, a temp board and the list with pieces)
  value(Player,PlayerChar,Board,0,0,Board,ListPieces),
  %at this point we have a list of lineLists each with multiple list with [X,Y,Value], we need to put everything in a single list
  just_one_list(ListPieces,Out),
  %now we sort the list by value (bigger value at the head)
  predsort(nthcompare(2), Out,[MostValuable|_]),
  %get coords
  nth0(0,MostValuable,X),
  nth0(1,MostValuable,Y),
  %valid selection will always succed in this case, we just call it to get the type
  valid_moves(Board,PlayerChar,X,Y,Type),
  Xi is X-1, Yi is Y-1, % Board is [1-10], replace takes [0-9]

  %now the target
  getPVE_player_char(1,PieceChoice,PlayerChar1),
  value(1,PlayerChar1,Board,0,0,Board,EnemyPieces),
  just_one_list(EnemyPieces,EnemyOut),
  predsort(nthcompare(2), EnemyOut,EnemyOrdered),
  pick_target(Board,PlayerChar,X,Y,Type,EnemyOrdered),
  retract(save_bot_play(X1,Y1)),


  Xf is X1-1, Yf is Y1-1, % Board is [1-10], replace takes [0-9]
  replace(Board,Xi,Yi,'-',NewBoard), % point of selected piece -> empty
  replace(NewBoard,Xf,Yf,PlayerChar,NewNewBoard), % target point -> selected piece

  game_over(NewNewBoard,Player,NewEnd), % Check if the player not playing this cycle lost
  write('\a'), % xp

  assert(save_bot_play(Xi,Yi)),
  assert(save_bot_play(Xf,Yf)),

  choose_move(NewNewBoard,NextPlayer,NewEnd,NewTurn,1,PieceChoice).


%% MAIN MENU: Play Menu Selected
handle_menu_input(1):-
    cls(200),
    play_menu.
%% MAIN MENU: Info Selected
handle_menu_input(2):-
    info_display,
    press_zero_back,
    splash.
%% MAIN MENU: Exit Selected
handle_menu_input(3):-
    cls, nl,
    write('THIS IS EXIT'),nl.


press_zero_back:-
    write('Press 0 to go back. '),nl,
    repeat,
        get_char(X1),
		skip_line,
        char_to_int_menu(X1,X),
        (X == 0 -> !;
         nl,write('Not Valid'), fail).


%%PLAYER RELATED
%Print: player Playing, get next player
show_player(Player,PlayerChar,NewPlayer):-
              write('Player '), write(Player), write(' ('),write(PlayerChar), write(')'),
              (Player==1 -> NewPlayer is 2;
              NewPlayer is 1).
%%READS X and Y, checks if 0 < X(or Y) < 11
get_input(X,Y):-
    write('put X: '), nl,
              repeat,
               get_char(X1),
			   skip_line,
                char_to_int(X1, X),
				skip_line,
                (is_input_valid(X) ->!;
                msg_input_error, fail),
    write('put Y: '), nl,
              repeat,
                get_char(Y1),
				skip_line,
                char_to_int(Y1, Y),
				skip_line,
                (is_input_valid(Y) ->!;
                msg_input_error, fail),
              nl.
is_input_valid(X):-
              integer(X),
              X > 0,
              X < 11.

%%PRINT BOARD 10*10
print_board(Board):-
              nl,
              write('                            Y '),
              nl,nl,
              write('          0   1   2   3   4   5   6   7   8   9'),
              nl,
              print_board_aux(Board, 1),
              nl.
print_board_aux([], _).
print_board_aux([Elem|Tail], Line):-
              Line == 6,
              write('X'),
              write('    '),
              write('    _______________________________________'),
              nl,
              write('     '),
              Line1 is Line -1,
              write(Line1),
              write('  | '),
              NewLine is Line+1,
              print_line(Elem),
              nl,
              print_board_aux(Tail, NewLine).
print_board_aux([Elem|Tail], Line):-
              write('     '),
              write('    _______________________________________'),
              nl,
              write('     '),
              Line1 is Line -1,
              write(Line1),
              write('  | '),
              NewLine is Line+1,
              print_line(Elem),
              nl,
              print_board_aux(Tail, NewLine).
print_line([]).
print_line(['-'|Tail]):-
              write(' '),
              write(' '),
              write('|'),
              write(' '),
              print_line(Tail).
print_line([Elem|Tail]):-

              ((Elem == 'W' -> ansi_format([bold,fg(cyan)],'~w', [Elem]); Elem == 'X' -> ansi_format([bold,fg(green)],'~w', [Elem]);
              Elem == 'B' -> ansi_format([bold,fg(black)],'~w', [Elem]); Elem == 'x' -> ansi_format([bold,fg(white)],'~w',[Elem]));true),
              %write(Elem),
              write(' '),
              write('|'),
              write(' '),
              print_line(Tail).
%print bot play
print_bot_play(1,0).
print_bot_play(_,_):-
  retract(save_bot_play(X,Y)), !,
  write('Bot did choose the piece in X= '),write(X),write(' Y= '),write(Y), nl,
  retract(save_bot_play(Xf,Yf)), !,
  write('Bot eated piece located in X= '),write(Xf),write(' Y = '),write(Yf), nl.

%%PRINT INFORMATION
print_information(Board,Turn):-
              write('Turn: '), write(Turn), nl,
              matrix_elem_count(Board, 'W', T1),
              matrix_elem_count(Board, 'B', T2),
              ansi_format([bold,fg(cyan)],'White Bishop~w', [s]), write(': '), write(T1),
              nl,
              ansi_format([bold,fg(black)],'Black Bishop~w', [s]), write(': '),  write(T2).
