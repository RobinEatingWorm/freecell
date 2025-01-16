# [FreeCell](https://robineatingworm.github.io/freecell/)

FreeCell is a popular solitaire game where the objective is to move all of the
cards to the four foundations in the top-right corner.

## Rules

### Columns

Cards are dealt in eight columns and can be moved between them. To move a card
to another column, it must have an alternating color and a rank one lower
compared to the card it is being moved onto. For example, a red 9 can be placed
on a black 10, but you cannot put a black 9 or red 8 on a black 10. Note that
aces are the lowest rank and kings are the highest.

Any card can be moved onto a column that is empty.

### Free Cells

There are four free cells in the top-left corner, each of which can temporarily
store a single card. Cards can be moved to and from free cells at any time.

### Foundations

There are four foundations in the top-right corner. Cards must be placed
sequentially from ace (the lowest rank) to king (the highest rank) in each
foundation. Additionally, each foundation must contain a unique suit.

Cards played to foundations cannot be moved later.

### Free Space

In FreeCell, only one card can be moved at a time. Therefore, when moving a
sequential stack of cards alternating in color and descending in rank between
columns, you are technically moving each card individually to free spaces (empty
free cells and empty columns) before moving all of them to the desired column.

The maximum number of cards that can be moved at once is equal to $(F + 1)
\times 2^C$, where $F$ is the number of empty free cells, and $C$ is the number
of empty columns, not including the column that the stack of cards is being
moved to if that column is also empty.

## Gameplay

- Click on cards to select them. Click on a valid location when cards are
selected to move them.
- Double click a card to play it directly to a foundation if possible.
- On desktop devices, you can also drag cards to move them. Dragging may not
be fully supported on mobile devices.
- Access game controls using the buttons at the top. Available controls include
starting a new game, resetting the current game, and undoing the last move.
- Ready? [Play here!](https://robineatingworm.github.io/freecell/)
