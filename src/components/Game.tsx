"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import sandImage from "../../public/path.png";
import lavaImage from "../../public/lava.jpeg";
// import micImage from "../../public/speaker.png";
import castleImage from "../../public/castle.png";
import playerImage from "../../public/player2.png";

function Game() {
  const GRID_SIZE = 7;
  const [gap2, setGap2] = useState<{
    row: number;
    col: number;
    status: "blink" | "gap";
  } | null>(null);
  const [gap, setGap] = useState<{
    row: number;
    col: number;
    status: "blink" | "gap";
  } | null>(null);
  const [gameStatus, setGameStatus] = useState<"won" | "lost" | "playing">(
    "playing"
  );
  const [display, setDisplay] = useState<{
    message: string;
    type: "won" | "lost" | null;
  }>({ message: "", type: null });
  const [path, setPath] = useState<number[][]>(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(0))
  );
  const [player, setPlayer] = useState({ row: GRID_SIZE - 1, col: 0 });

  useEffect(() => {
    generatePath();
  }, []);

  useEffect(() => {
    if (getCount() !== 0) {
      generateGap("GAP_1");
      generateGap("GAP_2");
      setInterval(() => {
        generateGap("GAP_1");
        generateGap("GAP_2");
      }, 4000);
    }
  }, [path[0], path[1], path[2], path[3], path[4], path[5], path[6]]);

  const movePlayer = (direction: string) => {
    if (gameStatus !== "playing") return;
    if (getCount() === 0) {
      return;
    }

    setPlayer((old: { row: number; col: number }) => {
      let newRow = old.row;
      let newCol = old.col;

      switch (direction) {
        case "up":
          if (newRow > 0) newRow -= 1;
          else {
            setGameStatus("lost");
            setDisplay({ message: "You lost!", type: "lost" });
          }
          break;
        case "down":
          if (newRow < GRID_SIZE - 1) newRow += 1;
          else {
            setGameStatus("lost");
            setDisplay({ message: "You lost!", type: "lost" });
          }
          break;
        case "left":
          if (newCol > 0) newCol -= 1;
          else {
            setGameStatus("lost");
            setDisplay({ message: "You lost!", type: "lost" });
          }
          break;
        case "right":
          if (newCol < GRID_SIZE - 1) newCol += 1;
          else {
            setGameStatus("lost");
            setDisplay({ message: "You lost!", type: "lost" });
          }
          break;
        default:
          break;
      }

      return { row: newRow, col: newCol };
    });
  };

  function generateGap(type: "GAP_2" | "GAP_1") {
    while (true) {
      let row = Math.floor(Math.random() * GRID_SIZE);
      let col = Math.floor(Math.random() * GRID_SIZE);
      if (row < GRID_SIZE / 3 && col < GRID_SIZE / 3) {
        continue;
      }

      if (row === 0 && col === GRID_SIZE - 1) {
        continue;
      }

      if (path[row][col] === 1) {
        if (type === "GAP_1") {
          setTimeout(() => {
            setGap((old) => {
              return { row, col, status: "gap" };
            });
          }, 1500);
          setGap((old) => {
            return { row, col, status: "blink" };
          });
          setTimeout(() => {
            setGap((old) => {
              return null;
            });
          }, 4000);
          break;
        } else {
          setTimeout(() => {
            setGap2((old) => {
              return { row, col, status: "gap" };
            });
          }, 1500);
          setGap2((old) => {
            return { row, col, status: "blink" };
          });
          setTimeout(() => {
            setGap2((old) => {
              return null;
            });
          }, 4000);
          break;
        }
      }
    }
  }

  function getCount() {
    let count = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (path[i][j] === 1) {
          count++;
        }
      }
    }
    return count;
  }

  useEffect(() => {
    if (getCount() !== 0) {
      if (player.row === 0 && player.col === GRID_SIZE - 1) {
        setGameStatus("won");
        setDisplay((old: { message: string; type: "won" | "lost" | null }) => {
          return { message: "Verified!", type: "won" };
        });
      }
      if (
        (player.row !== GRID_SIZE - 1 || player.col !== 0) &&
        path[player.row][player.col] === 0
      ) {
        setGameStatus("lost");
        setDisplay((old: { message: string; type: "won" | "lost" | null }) => {
          return { message: "You lost!", type: "lost" };
        });
      }

      if (
        (player.row !== GRID_SIZE - 1 || player.col !== 0) &&
        path[player.row][player.col] === 1 &&
        gap?.row === player.row &&
        gap?.col === player.col &&
        gap?.status === "gap"
      ) {
        setGameStatus("lost");
        setDisplay((old: { message: string; type: "won" | "lost" | null }) => {
          return { message: "You lost!", type: "lost" };
        });
      }

      if (
        (player.row !== GRID_SIZE - 1 || player.col !== 0) &&
        path[player.row][player.col] === 1 &&
        gap2?.row === player.row &&
        gap2?.col === player.col &&
        gap2?.status === "gap"
      ) {
        setGameStatus("lost");
        setDisplay((old: { message: string; type: "won" | "lost" | null }) => {
          return { message: "You lost!", type: "lost" };
        });
      }
    }
  }, [
    gap,
    gap?.row,
    gap?.col,
    gap2,
    gap2?.row,
    gap2?.col,
    player.row,
    player.col,
    path[0],
    path[1],
    path[2],
    path[3],
    path[4],
    path[5],
    path[6],
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          movePlayer("up");
          break;
        case "ArrowDown":
          movePlayer("down");
          break;
        case "ArrowLeft":
          movePlayer("left");
          break;
        case "ArrowRight":
          movePlayer("right");
          break;
        case "w":
          movePlayer("up");
          break;
        case "s":
          movePlayer("down");
          break;
        case "a":
          movePlayer("left");
          break;
        case "d":
          movePlayer("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameStatus,
    path[0],
    path[1],
    path[2],
    path[3],
    path[4],
    path[5],
    path[6],
  ]);

  function generatePath() {
    setPath((old) => {
      const coord = { row: GRID_SIZE - 1, col: 0 };
      const newPath = old.map((row) => row.map((col) => col));
      newPath[GRID_SIZE - 1][0] = 1;
      while (coord.row !== 0 || coord.col !== GRID_SIZE - 1) {
        let direction = Math.floor(Math.random() * 2) === 0 ? "RIGHT" : "UP";
        if (direction === "RIGHT") {
          if (coord.col === GRID_SIZE - 1) {
            for (let i = coord.row - 1; i >= 0; i--) {
              newPath[i][GRID_SIZE - 1] = 1;
            }
            coord.row = 0;
          } else {
            coord.col++;
            newPath[coord.row][coord.col] = 1;
          }
        } else {
          if (coord.row === 0) {
            for (let i = coord.col + 1; i < GRID_SIZE; i++) {
              newPath[0][i] = 1;
            }
            coord.col = GRID_SIZE - 1;
          } else {
            coord.row--;
            newPath[coord.row][coord.col] = 1;
          }
        }
      }
      console.log(newPath);
      return newPath;
    });
  }
  return (
    <main className="w-screen min-h-screen">
      <div className="container h-screen flex flex-col items-center justify-center">
        <div className="p-10 flex flex-col gap-3 bg-zinc-800 rounded-lg">
          <div className="h-[400px] w-[400px] rounded-md relative">
            <div
              style={display.type ? { display: "block" } : { display: "none" }}
              className="text-center absolute w-full top-[45%] bg-black z-[1000000] left-0 py-4 "
            >
              {display.type && (
                <div
                  className={`text-2xl font-bold ${
                    display.type === "won" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {display.message}
                </div>
              )}
            </div>
            {path?.map((row, i) => (
              <div key={"r" + i} className="flex flex-row">
                {row.map((col, j) => (
                  <div
                    key={"r" + i + "c" + j}
                    className={`w-1/5 h-1/5 relative`}
                  >
                    <Image
                      src={castleImage}
                      width={400 / GRID_SIZE}
                      height={400 / GRID_SIZE}
                      alt="castle"
                      style={
                        i === 0 && j === GRID_SIZE - 1
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      className="absolute top-0 left-0 bg-black"
                    />
                    {col === 1 ? (
                      (gap?.row === i && gap?.col === j) ||
                      (gap2?.row === i && gap2?.col === j) ? (
                        gap?.status === "blink" || gap2?.status === "blink" ? (
                          <Image
                            src={sandImage.src}
                            width={400 / GRID_SIZE}
                            height={400 / GRID_SIZE}
                            className="animate-blink"
                            alt="player"
                          />
                        ) : (
                          <Image
                            src={lavaImage.src}
                            width={400 / GRID_SIZE}
                            height={400 / GRID_SIZE}
                            alt="player"
                          />
                        )
                      ) : (
                        <Image
                          src={sandImage.src}
                          width={400 / GRID_SIZE}
                          height={400 / GRID_SIZE}
                          alt="player"
                        />
                      )
                    ) : (
                      <Image
                        src={lavaImage.src}
                        width={400 / GRID_SIZE}
                        height={400 / GRID_SIZE}
                        alt="player"
                        className="lava-image"
                      />
                    )}
                    {player.row === i && player.col === j && (
                      <div className="absolute w-[80px] h-[80px] top-0 left-0">
                        <Image
                          src={playerImage.src}
                          width={400 / GRID_SIZE}
                          height={400 / GRID_SIZE}
                          alt="player"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Game;
