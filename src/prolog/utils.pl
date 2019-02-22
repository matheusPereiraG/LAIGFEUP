%interface display utils
% Print: Player won
player_won(2):-
    ansi_format([bold,fg(cyan)],'Player 1 (W) WON!!~w', [!]).
player_won(1):-
    ansi_format([bold,fg(black)],'Player 2 (B) WON!!~w', [!]).

% Title used while playing
display_title:-
  write_big_name_3,write_big_name_2, write_big_name_3.

% Print: what kind of move should be done
piece_must(1):-
  ansi_format([bold,fg(green)],'Piece must take an opponent\'s piece~w', [.]).
piece_must(2):-
  ansi_format([bold,fg(green)],'Piece cant take an opponent\'s piece, must move to a place where it can~w', [.]).

% Get input for Main Menu. 1 - Play ; 2 - Info ; 3 - Exit
get_menu_input:-
  write('Select an option: '), nl,
  repeat,
  get_char(X1),
  skip_line,
  char_to_int_menu(X1,X),
  (check_menu_input(X) -> !;
  fail),
  handle_menu_input(X).
  check_menu_input(1).
  check_menu_input(2).
  check_menu_input(3).

% Player == 1 -> (NewTurn == Turn++); NewTurn == Turn.
get_turn(1,Turn,NewTurn):-
  NewTurn is Turn + 1.
get_turn(2,Turn,NewTurn):-
  NewTurn is Turn.

%Clear 100 Lines
cls:-cls(100).
cls(0):-!.
cls(X):-
  Y is X-1,
  nl,
  cls(Y).

check_game_mode_menu_input(0).
check_game_mode_menu_input(1).
check_game_mode_menu_input(2).
check_game_mode_menu_input(3).

char_to_int_menu('0', 0).
char_to_int_menu('1', 1).
char_to_int_menu('2', 2).
char_to_int_menu('3', 3).

check_player_selection(0):-splash.
check_player_selection(1).
check_player_selection(2).

check_difficulty_menu_input(0):-splash.
check_difficulty_menu_input(1).
check_difficulty_menu_input(2).

write_big_name:-
     write('  __  __      _      ____        ____    ___   ____    _   _    ___    ____    ____  '), nl,
     write(' |  \\/  |    / \\    |  _ \\      | __ )  |_ _| / ___|  | | | |  / _ \\  |  _ \\  / ___| '), nl,
     write(' | |\\/| |   / _ \\   | | | |     |  _ \\   | |  \\___ \\  | |_| | | | | | | |_) | \\___ \\ '), nl,
     write(' | |  | |  / ___ \\  | |_| |     | |_) |  | |   ___) | |  _  | | |_| | |  __/   ___) |'), nl,
     write(' |_|  |_| /_/   \\_\\ |____/      |____/  |___| |____/  |_| |_|  \\___/  |_|     |____/ '),    nl, nl,nl.
write_big_name_2:-
     write('   \\  |     \\     _ \\       _ )  _ _|    __|   |  |    _ \\    _ \\    __| '), nl,
     write('  |\\/ |    _ \\    |  |      _ \\    |   \\__ \\   __ |   (   |   __/  \\__ \\ '), nl,
     write(' _|  _|  _/  _\\  ___/      ___/  ___|  ____/  _| _|  \\___/   _|    ____/'), nl.
write_play:-
        nl,
        write(' _ _             ___   _        _    __   __'),nl,
        write('|_  |    ___    | _ \\ | |      /_\\   \\ \\ / /'),nl,
        write('  | |   |___|   |  _/ | |__   / _ \\   \\ V / '),nl,
        write('  |_|           |_|   |____| /_/ \\_\\   |_|  '),nl.
write_info:-
        write(' ___             ___   _  _   ___    ___  '),nl,
        write('|_  )    ___    |_ _| | \\| | | __|  / _ \\ '),nl,
        write(' / /    |___|    | |  | .` | | _|  | (_) |'),nl,
        write('/___|           |___| |_|\\_| |_|    \\___/ '),nl.
write_exit:-
        write(' ____            ___  __  __  ___   _____ '),nl,
        write('|__ /    ___    | __| \\ \\/ / |_ _| |_   _|'),nl,
        write(' |_ \\   |___|   | _|   >  <   | |    | |  '),nl,
        write('|___/           |___| /_/\\_\\ |___|   |_|'),nl.
write_pvp:-
        write('  _ _             ___         ___ '),nl,
        write(' |_  |    ___    | _ \\ __ __ | _ \\'),nl,
        write('   | |   |___|   |  _/ \\ V / |  _/'),nl,
        write('   |_|           |_|    \\_/  |_|   '),nl.
write_pve:-
        write('  ___             ___         ___ '),nl,
        write(' |_  )    ___    | _ \\ __ __ | __|'),nl,
        write('  / /    |___|   |  _/ \\ V / | _| '),nl,
        write(' /___|           |_|    \\_/  |___| '),nl.
write_back:-
        write('  __              ___     _      ___   _  __'),nl,
        write(' /  \\     ___    | _ )   /_\\    / __| | |/ /'),nl,
        write('| () |   |___|   | _ \\  / _ \\  | (__  |   < '),nl,
        write(' \\__/            |___/ /_/ \\_\\  \\___| |_|\\_\\  '),nl.

write_big_name_3:-
    ansi_format([bold,fg(white)], '   \\  |     \\     _ \\       _ )  _ _|    __|   |  |    _ \\    _ \\    __|~w', [.]), nl,
    ansi_format([bold,fg(white)], '  |\\/ |    _ \\    |  |      _ \\    |   \\__ \\   __ |   (   |   __/  \\__\\~w', [.]), nl,
    ansi_format([bold,fg(white)], ' _|  _|  _/  _\\  ___/      ___/  ___|  ____/  _| _|  \\___/   _|    ____/~w', [.]),nl.

%%ERROR MESSAGES
msg_target_error:-
  ansi_format([bold,fg(red)],'NOT VALID \n   Target point(X,Y) cant be reached~w', [.]),nl,nl.
                  %nl, write('NOT VALID \n   Target point(X,Y) cant be reached'),nl,nl.
msg_input_error:-
  ansi_format([bold,fg(red)],'NOT VALID \n   Should be 0 < Value < 11~w', [.]),nl,nl.
                  %nl, write('NOT VALID \n   Should be 0 < Value < 11'), nl,nl.
msg_pos_error:-
  ansi_format([bold,fg(red)],'NOT VALID \n   Should be a point(X,Y) controlled by the one playing that can eat or move to a point where it can eat~w', [.]),nl,nl.
                  %nl, write('NOT VALID \n   Should be a point(X,Y) controlled by the one playing that can eat or move to a point where it can eat '), nl,nl.


matrixToJson([], []).
matrixToJson([List | R], [JsonList | Json]):-
listToJson(List, JsonList),
matrixToJson(R, Json).

listToJson([], []).
listToJson([Element | Rest], [JSONElem | JsonRest]):-
  json(Element, JSONElem),
  listToJson(Rest, JsonRest).

json(List, Output):-
  is_list(List),
  listToJson(List, Output).

json(Number, Number):-
  number(Number).

json(Element, JSONElem):-
addCommas(Element, '"', '"', JSONElem).

addCommas(Element, Left, Right, JSONElem):-
  atom_concat(Left, Element, Temp),
  atom_concat(Temp, Right, JSONElem).
