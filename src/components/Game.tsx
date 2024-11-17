"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import React from "react";
import sandImage from "../../public/path.png";
import lavaImage from "../../public/lava.jpeg";
import castleImage from "../../public/castle.png";
import playerImage from "../../public/player.png";
import {
  onChallengeResponse,
  onChallengeExpired,
  onChallengeError,
} from "@gotcha-widget/lib";

function Game() {
  const GRID_SIZE = 7;
  const TIME_LIMIT = 30;

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
    "won" | "lost" | "playing" | "not_started" | "expired"
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
    }
    // else if (gameStatus === "restart") {
    //   resetPath();
    //   setDisplay({ message: "", type: null });
    //   setPlayer((old) => {
    //     return { ...old, row: GRID_SIZE - 1, col: 0 };
    //   });
    //   intervalRef.current && clearInterval(intervalRef.current);
    //   timeoutRef1.current && clearTimeout(timeoutRef1.current);
    //   timeoutRef2.current && clearTimeout(timeoutRef2.current);
    //   timeoutRef3.current && clearTimeout(timeoutRef3.current);
    //   timeoutRef4.current && clearTimeout(timeoutRef4.current);
    //   setGameStatus("not_started");
    // }
  }, [gameStatus]);

  function resetPath() {
    setPath((old) => {
      const newPath = old.map((row) => row.map((col) => 0));
      return newPath;
    });
  }

  const handleGameCaptcha = async (gameStatus: string) => {
    if (gameStatus === "lost") {
      timeoutRefTimer.current && clearInterval(timeoutRefTimer.current);
      await onChallengeResponse(false);
    } else if (gameStatus === "won") {
      timeoutRefTimer.current && clearInterval(timeoutRefTimer.current);
      await onChallengeResponse(true);
    } else if (gameStatus === "expired") {
      await onChallengeExpired();
    }
  };
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
      }, 4100);
    }
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

      if (row === 0 && col === GRID_SIZE - 1) {
        continue;
      }

      if (path[row][col] === 1) {
        if (type === "GAP_1") {
          timeoutRef1.current = setTimeout(() => {
            setGap((old) => {
              return { row, col, status: "gap" };
            });
          }, 1500);
          setGap((old) => {
            return { row, col, status: "blink" };
          });
          timeoutRef2.current = setTimeout(() => {
            setGap((old) => {
              return null;
            });
          }, 4000);
        } else {
          timeoutRef3.current = setTimeout(() => {
            setGap2((old) => {
              return { row, col, status: "gap" };
            });
          }, 1500);
          setGap2((old) => {
            return { row, col, status: "blink" };
          });
          timeoutRef4.current = setTimeout(() => {
            setGap2((old) => {
              return null;
            });
          }, 4000);
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
    <main className="w-screen min-h-screen">
      <div className="container mx-auto h-screen flex flex-col items-center justify-center">
        <div className="p-10 flex flex-col gap-3 bg-zinc-800 rounded-lg">
          <div className="h-[400px] w-[400px] rounded-md overflow-hidden relative">
            {displayInst && (
              <div className=" text-white flex flex-col w-full z-[2922992929229] pb-6 top-[25%] left-0 absolute bg-black">
                <div className="flex flex-row justify-between py-1 border-b border-solid border-neutral-600">
                  <p className="flex px-4 py-2 text-lg">instructions</p>
                  {/* <button
                    className="text-red-900 px-3 text-2xl"
                    onClick={() => setDisplayInst(false)}
                  >
                    X
                  </button> */}
                </div>
                <ol className="list-decimal px-6 py-1">
                  <li>help knight reach the castle safely</li>
                  <li>click on knight's adjacent cell to move</li>
                  <li>beware of the the goofy disappearing tiles</li>
                  <li>complete the challenge within {TIME_LIMIT} seconds</li>
                  <li>good luck!</li>
                </ol>
                <button
                  onClick={() => setGameStatus("playing")}
                  className="bg-green-700 py-1 mt-2 mx-3 rounded-lg text-white"
                >
                  START
                </button>
              </div>
            )}
            <div
              style={display.type ? { display: "block" } : { display: "none" }}
              className="text-center absolute w-full top-[45%] bg-black z-[939393939939] left-0 py-4 "
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
                      className="absolute top-0 left-0 z-[22020202] bg-black"
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
                            alt="sand"
                          />
                        ) : (
                          <Image
                            src={lavaImage.src}
                            width={400 / GRID_SIZE}
                            height={400 / GRID_SIZE}
                            alt="lava"
                          />
                        )
                      ) : (
                        <Image
                          src={sandImage.src}
                          width={400 / GRID_SIZE}
                          height={400 / GRID_SIZE}
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
                        alt="sand"
                      />
                    ) : (
                      <Image
                        src={lavaImage.src}
                        width={400 / GRID_SIZE}
                        height={400 / GRID_SIZE}
                        alt="lava"
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
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <button
                // className="py-0.5"
                onClick={() => setPlayMusic(!playMusic)}
              >
                music
              </button>
              {/* <button
                // className="py-0.5"
                onClick={() => setDisplayInst(!displayInst)}
              >
                instructions
              </button> */}
            </div>
            <div className="flex flex-row items-center gap-3">
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
