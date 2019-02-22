:- use_module(library(lists)).
%%+Matrix,+Elem,-Total
%Total Returns number of Elem in Matrix 
matrix_elem_count([], _, 0).
matrix_elem_count([Head|Tail],Elem,Total):-
              count(Elem,Head,NewCount),          
              matrix_elem_count(Tail,Elem,NewTotal),           
              Total is NewTotal + NewCount. 


count(_, [], 0).
count(X, [X | T], N) :-
  !, count(X, T, N1),
  N is N1 + 1.
count(X, [_ | T], N) :-
  count(X, T, N).


%https://stackoverflow.com/questions/26719774/replacing-elements-in-list-of-lists-prolog              
replace( [L|Ls] , 0 , Y , Z , [R|Ls] ) :- % once we find the desired row,
  replace_column(L,Y,Z,R)                 % - we replace specified column, and we're done.
  .                                       %
replace( [L|Ls] , X , Y , Z , [L|Rs] ) :- % if we haven't found the desired row yet
  X > 0 ,                                 % - and the row offset is positive,
  X1 is X-1 ,                             % - we decrement the row offset
  replace( Ls , X1 , Y , Z , Rs )         % - and recurse down
  .                                       %

replace_column( [_|Cs] , 0 , Z , [Z|Cs] ) .  % once we find the specified offset, just make the substitution and finish up.
replace_column( [C|Cs] , Y , Z , [C|Rs] ) :- % otherwise,
  Y > 0 ,                                    % - assuming that the column offset is positive,
  Y1 is Y-1 ,                                % - we decrement it
  replace_column( Cs , Y1 , Z , Rs )         % - and recurse down.
  . 

%+Board,+X,+Y,-Result 
find_elem(Board, X, Y, Result):-
              nth1(X,Board,Elem),
              nth1(Y,Elem,Result).   