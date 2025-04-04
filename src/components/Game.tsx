"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import React from "react";
import sandImage from "../../public/path.png";
import lavaImage from "../../public/lava.jpeg";
import castleImage from "../../public/castle.png";
import playerImage from "../../public/player.png";

function Game() {
  const GRID_SIZE = 7; // 7 x 7 grid
  const TIME_LIMIT = 30; // in seconds
  const GAP_LIFETIME = 4000; // in milliseconds
  const GAP_BLINK_LIFETIME = 1500; // in milliseconds

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef1 = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef2 = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef3 = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef4 = useRef<NodeJS.Timeout | null>(null);
  const timeoutRefTimer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(TIME_LIMIT);
  const [displayInst, setDisplayInst] = useState<boolean>(true);
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
  const [gameStatus, setGameStatus] = useState<
    "won" | "lost" | "playing" | "not_started" | "restart" | "expired"
  >("not_started");
  const [display, setDisplay] = useState<{
    message: string;
    type: "won" | "lost" | null;
  }>({ message: "", type: null });
  const [path, setPath] = useState<number[][]>(
    Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(0))
  );
  const [playMusic, setPlayMusic] = useState<boolean>(false);
  const [player, setPlayer] = useState({ row: GRID_SIZE - 1, col: 0 });

  useEffect(() => {
    if (gameStatus === "playing") {
      timeoutRefTimer.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime - 1 <= 0) {
            timeoutRefTimer.current && clearInterval(timeoutRefTimer.current);
            setDisplay({ message: "EXPIRED", type: "lost" });
            setGameStatus("expired");
          }
          return prevTime - 1;
        });
      }, 1000);
      setDisplayInst(false);
      generatePath();
    } else if (gameStatus === "restart") {
      resetPath();
      setTime(TIME_LIMIT);
      setDisplayInst(true);
      setDisplay({ message: "", type: null });
      setPlayer((old) => {
        return { ...old, row: GRID_SIZE - 1, col: 0 };
      });
      intervalRef.current && clearInterval(intervalRef.current);
      timeoutRef1.current && clearTimeout(timeoutRef1.current);
      timeoutRef2.current && clearTimeout(timeoutRef2.current);
      timeoutRef3.current && clearTimeout(timeoutRef3.current);
      timeoutRef4.current && clearTimeout(timeoutRef4.current);
      setGameStatus("not_started");
    }
  }, [gameStatus]);

  useEffect(() => {
    handleGameCaptcha(gameStatus);
  }, [gameStatus]);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = 0.2;
    }
  }, []);

  useEffect(() => {
    playMusic && (musicRef.current as HTMLAudioElement)?.play();
    !playMusic && (musicRef.current as HTMLAudioElement)?.pause();
  }, [playMusic]);

  useEffect(() => {
    if (getCount() !== 0 && gameStatus === "playing") {
      generateGap("GAP_1");
      generateGap("GAP_2");
      intervalRef.current = setInterval(() => {
        generateGap("GAP_1");
        generateGap("GAP_2");
      }, GAP_LIFETIME + 100);
    }
  }, [gameStatus, ...path]);

  useEffect(() => {
    if (getCount() !== 0 && gameStatus === "playing") {
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
    gameStatus,
    gap,
    gap?.row,
    gap?.col,
    gap2,
    gap2?.row,
    gap2?.col,
    player.row,
    player.col,
    ...path,
  ]);

  function resetPath() {
    setPath((old) => {
      const newPath = old.map((row) => row.map((col) => 0));
      return newPath;
    });
  }

  const handleGameCaptcha = async (gameStatus: string) => {
    if (gameStatus === "lost") {
      timeoutRefTimer.current && clearInterval(timeoutRefTimer.current);
      // await onChallengeResponse(false);
    } else if (gameStatus === "won") {
      timeoutRefTimer.current && clearInterval(timeoutRefTimer.current);
      // await onChallengeResponse(true);
    }
  };

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

      // don't generate gap on castle
      if (row === 0 && col === GRID_SIZE - 1) {
        continue;
      }

      // don't generate gap on start position to let player understand the game
      if (row === GRID_SIZE - 1 && col === 0) {
        continue;
      }

      if (path[row][col] === 1) {
        if (type === "GAP_1") {
          timeoutRef1.current = setTimeout(() => {
            setGap((old) => {
              return { row, col, status: "gap" };
            });
          }, GAP_BLINK_LIFETIME);
          setGap((old) => {
            return { row, col, status: "blink" };
          });
          timeoutRef2.current = setTimeout(() => {
            setGap((old) => {
              return null;
            });
          }, GAP_LIFETIME);
        } else {
          timeoutRef3.current = setTimeout(() => {
            setGap2((old) => {
              return { row, col, status: "gap" };
            });
          }, GAP_BLINK_LIFETIME);
          setGap2((old) => {
            return { row, col, status: "blink" };
          });
          timeoutRef4.current = setTimeout(() => {
            setGap2((old) => {
              return null;
            });
          }, GAP_LIFETIME);
        }
        break;
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
      return newPath;
    });
  }
  async function handleClick(i: number, j: number, col: number) {
    if (gameStatus !== "playing") return;
    if (
      ((i === player.row + 1 || i === player.row - 1) && j === player.col) ||
      ((j === player.col + 1 || j === player.col - 1) && i === player.row)
    ) {
      if (col === 0) {
        setGameStatus("lost");
        setDisplay((old: { message: string; type: "won" | "lost" | null }) => {
          return { message: "You lost!", type: "lost" };
        });
      }
      if (i === player.row + 1) {
        movePlayer("down");
      } else if (i === player.row - 1) {
        movePlayer("up");
      }
      if (j === player.col + 1) {
        movePlayer("right");
      } else if (j === player.col - 1) {
        movePlayer("left");
      }
    }
  }
  return (
    <main className="w-screen min-h-screen bg-black">
      <div className="container mx-auto h-screen flex flex-col items-center justify-center">
        <div className="p-5 lg:p-10 flex flex-col gap-3 bg-zinc-800 rounded-lg">
          <div className="h-[300px] w-[300px] lg:h-[400px] lg:w-[400px] rounded-md overflow-hidden relative">
            {displayInst && (
              <div className="flex flex-col justify-center items-center w-full h-full z-[2922992929229]  top-0 left-0 absolute ">
                <div className="flex flex-col pb-6 h-full w-full bg-black text-white">
                  <div className="flex flex-row justify-between py-1 border-b border-solid border-neutral-600">
                    <p className="flex px-4 py-2 text-base lg:text-lg">
                      Instructions
                    </p>
                    {/* <button
                    className="text-red-900 px-3 text-2xl"
                    onClick={() => setDisplayInst(false)}
                  >
                    X
                  </button> */}
                  </div>
                  <ol className="list-decimal lg:text-base text-xs px-6 py-1">
                    <li>Help knight reach the castle safely</li>
                    <li>Click on knight's adjacent cell to move</li>
                    <li>Beware of the disappearing tiles</li>
                    <li>Tiles blink before they disappear</li>
                    <li>Complete the challenge within {TIME_LIMIT} seconds</li>
                    <li>Good luck!</li>
                  </ol>

                  <div className="slideshow-container mx-auto w-[55px] lg:w-[100px] h-[55px] lg:h-[100px] my-2"></div>

                  <button
                    onClick={() => setGameStatus("playing")}
                    className="bg-green-700 py-1 text-sm lg:text-base mt-2 mx-3 rounded-lg text-white"
                  >
                    START
                  </button>
                </div>
              </div>
            )}

            {display.type && (
              <div className="text-center flex flex-col items-center  justify-center absolute h-full w-full top-0 z-[939393939939] left-0  ">
                <div className="bg-black w-full py-4">
                  <div
                    className={`text-2xl font-bold ${
                      display.type === "won" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {display.message}
                  </div>
                </div>
              </div>
            )}
            {path?.map((row, i) => (
              <div key={"r" + i} className="flex flex-row">
                {row.map((col, j) => (
                  <div
                    key={"r" + i + "c" + j}
                    onClick={() => handleClick(i, j, col)}
                    className={`w-1/5 h-1/5 relative cursor-pointer`}
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
                      className={`absolute h-[${300 / GRID_SIZE}px] w-[${
                        300 / GRID_SIZE
                      }px] lg:h-[${400 / GRID_SIZE}px] lg:w-[${
                        400 / GRID_SIZE
                      }px] top-0 left-0 z-[22020202] bg-black`}
                    />
                    {col === 1 ? (
                      (gap?.row === i && gap?.col === j) ||
                      (gap2?.row === i && gap2?.col === j) ? (
                        gap?.status === "blink" || gap2?.status === "blink" ? (
                          <Image
                            src={sandImage.src}
                            width={400 / GRID_SIZE}
                            height={400 / GRID_SIZE}
                            className={`animate-blink h-[${
                              300 / GRID_SIZE
                            }px] w-[${300 / GRID_SIZE}px] lg:h-[${
                              400 / GRID_SIZE
                            }px] lg:w-[${400 / GRID_SIZE}px]`}
                            alt="sand"
                          />
                        ) : (
                          <Image
                            src={lavaImage.src}
                            width={400 / GRID_SIZE}
                            height={400 / GRID_SIZE}
                            className={`h-[${300 / GRID_SIZE}px] w-[${
                              300 / GRID_SIZE
                            }px] lg:h-[${400 / GRID_SIZE}px] lg:w-[${
                              400 / GRID_SIZE
                            }px]`}
                            alt="lava"
                          />
                        )
                      ) : (
                        <Image
                          src={sandImage.src}
                          width={400 / GRID_SIZE}
                          height={400 / GRID_SIZE}
                          className={`h-[${300 / GRID_SIZE}px] w-[${
                            300 / GRID_SIZE
                          }px] lg:h-[${400 / GRID_SIZE}px] lg:w-[${
                            400 / GRID_SIZE
                          }px]`}
                          alt="sand"
                        />
                      )
                    ) : gameStatus === "not_started" &&
                      i === GRID_SIZE - 1 &&
                      j === 0 ? (
                      <Image
                        src={sandImage.src}
                        width={400 / GRID_SIZE}
                        height={400 / GRID_SIZE}
                        className={`h-[${300 / GRID_SIZE}px] w-[${
                          300 / GRID_SIZE
                        }px] lg:h-[${400 / GRID_SIZE}px] lg:w-[${
                          400 / GRID_SIZE
                        }px]`}
                        alt="sand"
                      />
                    ) : (
                      <Image
                        src={lavaImage.src}
                        width={400 / GRID_SIZE}
                        height={400 / GRID_SIZE}
                        alt="lava"
                        className={`lava-image h-[${300 / GRID_SIZE}px] w-[${
                          300 / GRID_SIZE
                        }px] lg:h-[${400 / GRID_SIZE}px] lg:w-[${
                          400 / GRID_SIZE
                        }px]`}
                      />
                    )}
                    {player.row === i && player.col === j && (
                      <div
                        className={`absolute lg:w-[${
                          400 / GRID_SIZE
                        }px] lg:h-[${400 / GRID_SIZE}px] w-[${
                          300 / GRID_SIZE
                        }px] h-[${300 / GRID_SIZE}px] top-0 left-0`}
                      >
                        <Image
                          src={playerImage.src}
                          width={400 / GRID_SIZE}
                          height={400 / GRID_SIZE}
                          alt="player"
                          className={`h-[${300 / GRID_SIZE}px] w-[${
                            300 / GRID_SIZE
                          }px] lg:h-[${400 / GRID_SIZE}px] lg:w-[${
                            400 / GRID_SIZE
                          }px]`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <button
                // className="py-0.5"
                className="text-sm lg:text-base text-white"
                onClick={() => setPlayMusic(!playMusic)}
              >
                music
              </button>
              {gameStatus === "expired" ||
              gameStatus === "lost" ||
              gameStatus === "won" ? (
                <button
                  onClick={() => {
                    setGameStatus("restart");
                  }}
                  className="text-white"
                >
                  reset
                </button>
              ) : null}
              {/* <button
                // className="py-0.5"
                onClick={() => setDisplayInst(!displayInst)}
              >
                instructions
              </button> */}
            </div>
            <div className="flex flex-row text-white items-center gap-3 text-sm lg:text-base ">
              <p>{time}s left</p>
              <div className="h-3 w-3 bg-red-700 rounded-full"></div>
              <div className="h-3 w-3 bg-green-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <audio ref={musicRef} src="/audio/re.mp3" />
    </main>
  );
}

export default Game;
