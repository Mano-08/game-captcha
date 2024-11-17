# Castle Quest: Gamified CAPTCHA Challenge

An interactive, dynamic and challenging CAPTCHA alternative that verifies users to secure crypto faucet and airdrop claims. The users verify themselves by helping the knight reach the castle by navigating through a path that consists of tiles and is fully surrounded by lava, the path has disappearing tiles to make the game more challenging. The knight is controlled with mouse-click-events to move across a dynamic path. The challenge fails if he steps into the lava.

## Key Features

- Mouse-Driven Gameplay: Ensure all interactions mimic typical CAPTCHA behaviour with mouse-based controls.
- AI-Resistant Challenges: Introduce dynamic and interactive CAPTCHA tasks to outsmart AI models trained to exploit static CAPTCHAs.   
- Integration with GotCHA: <a href="https://github.com/tcerqueira/gotcha-widget-lib">GotCHA widget library</a> is used for CAPTCHA verification.  
- Lightweight Design: Build a fast, efficient game optimized for web use, ensuring accessibility for users across devices.  
- Retro Themed Gameplay: A pixelated game theme is adopted.
- Timed challenges: The player battles against the clock to complete the challenge.

![Screenshot (2720)](https://github.com/user-attachments/assets/349ffabd-e44a-4b74-97dd-5d88375a8ffe)

## How to Play

- The user must navigate the knight to the castle
- The knight can move only to adjacent cells i.e. RIGHT, LEFT, TOP, BOTTOM
- Move the knight by clicking on the adjacent cell.
- There are disappearing tiles in the game, they blink for 1 second before disappearing.
- Disappeared tiles comes back to normal after 4 seconds.
- If the knight falls into the lava, game is over.
- Complete the challenge within 120 seconds.

## Live links

- Live Link: <a href="game-captcha.vercel.app">Play Castle Quest</a>
- Demo Video: <a href="youtu.be/MC-0jwkRLFU">YouTube</a>

## GotCHA Integration

The following callbacks are utilized for CAPTCHA verification:

```typescript
const handleGameCaptcha = async (gameStatus: string) => {
    if (gameStatus === "lost") {
      await onChallengeResponse(false); // failed challenge
    } else if (gameStatus === "won") {
      await onChallengeResponse(true); // successful challenge
    } else if (gameStatus === "expired") {
      await onChallengeExpired(); // challenge expired
    }
  };
```
